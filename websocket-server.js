const { WebSocketServer } = require('ws');
const http = require('http');
const { pipeline } = require('node:stream');
const { Readable } = require('node:stream');
const { parse } = require('node:url');

// Імпортуємо конфігурацію (якщо використовуємо TypeScript)
// const { env, logEnvSummary } = require('./src/server/config.js');

// Тимчасова конфігурація для CommonJS
const env = {
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY?.trim(),
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID?.trim() || '21m00Tcm4TlvDq8ikWAM',
  ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2',
};

// Валідація ENV
if (!env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY.length < 10) {
  throw new Error('ELEVENLABS_API_KEY is missing or too short');
}

if (!env.ELEVENLABS_VOICE_ID || env.ELEVENLABS_VOICE_ID.length < 5) {
  throw new Error('ELEVENLABS_VOICE_ID is missing or too short');
}

// Хелпери для нативного http.ServerResponse
function sendJSON(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function sendText(res, status, text) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(String(text));
}

// Безпечне ехо в логи
function logEnvSummary() {
  const key = env.ELEVENLABS_API_KEY;
  const safe = key ? `${key.slice(0, 4)}…(${key.length})` : "none";
  console.log("[ENV] ELEVENLABS_API_KEY =", safe);
  console.log("[ENV] ELEVENLABS_VOICE_ID =", env.ELEVENLABS_VOICE_ID);
  console.log("[ENV] ELEVENLABS_MODEL_ID =", env.ELEVENLABS_MODEL_ID);
}

const PORT = process.env.PORT || 8080;

// Функція для потокового TTS
function toNodeReadable(webStream) {
  return Readable.fromWeb ? Readable.fromWeb(webStream) : Readable.from(webStream);
}

async function streamTtsToResponse(res, text, {
  voiceId = env.ELEVENLABS_VOICE_ID,
  modelId = env.ELEVENLABS_MODEL_ID,
  timeoutMs = 20000,
  format = "mp3_44100_128",
} = {}) {
  if (!text?.trim()) return sendText(res, 400, "TTS text is empty");

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort("TTS timeout"), timeoutMs);

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3&output_format=${format}`;

  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      signal: ac.signal,
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        model_id: modelId,
        text,
        voice_settings: { stability: 0.3, similarity_boost: 0.8 },
      }),
    });
  } catch (e) {
    clearTimeout(timer);
    return sendText(res, 502, "Upstream fetch error: " + String(e));
  }

  if (!upstream.ok) {
    clearTimeout(timer);
    const body = await upstream.text().catch(() => "");
    return sendText(res, upstream.status, body || `Upstream status ${upstream.status}`);
  }

  res.setHeader("Content-Type", "audio/mpeg");
  await new Promise((resolve) => {
    pipeline(
      toNodeReadable(upstream.body),
      res,
      (err) => { clearTimeout(timer); if (err) console.error("[/status/tts] pipeline error:", err); resolve(); }
    );
  });
}

// Створюємо HTTP сервер
const server = http.createServer(async (req, res) => {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname, query } = parse(req.url, true);

  if (req.method === 'GET') {
    // Health check endpoint
    if (pathname === '/') {
      return sendJSON(res, 200, {
        status: 'running',
        message: 'WebSocket сервер з ElevenLabs інтеграцією працює',
        timestamp: new Date().toISOString(),
        port: PORT,
        uptime: process.uptime(),
        connections: wss.clients.size,
        features: ['WebSocket', 'ElevenLabs TTS', 'AI Agent']
      });
    }

    // TTS status endpoint для ручної перевірки
    if (pathname === '/status/tts') {
      const text = (query?.text && String(query.text)) || "Hello from Hungry Bot";
      return streamTtsToResponse(res, text);
    }

    // TTS JSON endpoint для діагностики
    if (pathname === '/status/tts-json') {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}/stream?output_format=mp3_44100_128`;
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "xi-api-key": env.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({ model_id: env.ELEVENLABS_MODEL_ID, text: "ok" }),
        });
        const out = { status: r.status, ok: r.ok, headers: Object.fromEntries(r.headers.entries()) };
        if (!r.ok) out.body = (await r.text().catch(() => "")).slice(0, 800);
        return sendJSON(res, 200, out);
      } catch (e) {
        return sendJSON(res, 502, { error: String(e) });
      }
    }

    return sendText(res, 404, 'Not found');
  } else {
    return sendText(res, 405, 'Method not allowed');
  }
});

// Створюємо WebSocket сервер поверх HTTP сервера
const wss = new WebSocketServer({ server });

// Self-check функція для ElevenLabs
async function elevenSelfCheck() {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[TTS] Self-check failed:", res.status, body.slice(0, 200));
    } else {
      console.log("[TTS] Self-check OK");
    }
  } catch (error) {
    console.error("[TTS] Self-check error:", error);
  }
}

// Канонічний генератор аудіо через ElevenLabs
async function generateElevenLabsAudio(text) {
  if (!text || !text.trim()) throw new Error("TTS text is empty");

  const url =
    `https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}/stream` +
    `?optimize_streaming_latency=3&output_format=mp3_44100_128`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,   // ВАЖЛИВО: не Authorization
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      model_id: env.ELEVENLABS_MODEL_ID,
      text,
      voice_settings: { stability: 0.3, similarity_boost: 0.8 },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 300)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  return buf; // MP3
}

// Функція для активації AI агента
async function activateHungryBotAgent(ws, clientId) {
  try {
    console.log(`🤖 Активація Hungry Bot для клієнта ${clientId}`);
    
    // Генеруємо привітальне повідомлення
    const welcomeMessage = "Привіт! Я Hungry Bot - ваш кулінарний AI асистент. Я можу допомогти вам з рецептами, порадами по готуванню та відповісти на будь-які питання про їжу. Що б ви хотіли дізнатися сьогодні?";
    
    // Відправляємо текстове повідомлення
    ws.send(JSON.stringify({
      type: 'agent_speech',
      message: welcomeMessage,
      timestamp: new Date().toISOString()
    }));

    // Генеруємо аудіо через ElevenLabs
    try {
      const audioBuffer = await generateElevenLabsAudio(welcomeMessage);
      
      // Відправляємо аудіо як base64
      ws.send(JSON.stringify({
        type: 'audio',
        format: 'mp3',
        data: audioBuffer.toString('base64'),
        timestamp: new Date().toISOString()
      }));
      
      console.log(`✅ Агент активовано та відправлено аудіо для клієнта ${clientId}`);
    } catch (audioError) {
      console.error(`❌ Помилка генерації аудіо для ${clientId}:`, audioError.message);
      
      // Відправляємо повідомлення про помилку аудіо
      ws.send(JSON.stringify({
        type: 'tts_error',
        message: String(audioError.message || audioError),
        timestamp: new Date().toISOString()
      }));
    }
    
  } catch (error) {
    console.error(`❌ Помилка активації агента для ${clientId}:`, error);
    
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Помилка активації агента',
      error: error.message,
      timestamp: new Date().toISOString()
    }));
  }
}

// Обробка WebSocket з'єднань
wss.on('connection', (ws, req) => {
  const clientId = req.socket.remoteAddress || 'unknown';
  console.log(`✅ Новий клієнт підключився: ${clientId}`);

  // Відправляємо привітання
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Вітаю! WebSocket сервер успішно підключено.',
    timestamp: new Date().toISOString(),
    features: ['ElevenLabs TTS', 'AI Agent', 'Voice Generation']
  }));

  // Обробка повідомлень від клієнта
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`📨 Отримано повідомлення від ${clientId}:`, message);

      // Обробка різних типів повідомлень
      switch (message.type) {
        case 'activate_agent':
          // Активація AI агента
          await activateHungryBotAgent(ws, clientId);
          break;
          
        case 'interrupt_agent':
          // Переривання агента
          console.log(`🎤 Клієнт ${clientId} перериває агента`);
          ws.send(JSON.stringify({
            type: 'agent_interrupted',
            message: 'Агент перервано. Що ви хотіли сказати?',
            timestamp: new Date().toISOString()
          }));
          break;
          
        case 'user_message':
          // Повідомлення від користувача
          console.log(`💬 Користувач ${clientId} сказав: ${message.text}`);
          
          // Тут можна додати логіку обробки запитів користувача
          // та генерації відповідей через AI
          
          // Відправляємо підтвердження
          ws.send(JSON.stringify({
            type: 'message_received',
            message: 'Ваше повідомлення отримано',
            timestamp: new Date().toISOString()
          }));
          break;
          
        default:
          // Ехо-відповідь для невідомих типів
          console.log(`🔄 Відправлено ехо-відповідь клієнту ${clientId}`);
          ws.send(JSON.stringify({
            type: 'echo',
            originalMessage: message,
            timestamp: new Date().toISOString(),
            serverInfo: {
              version: '2.0.0',
              features: ['ElevenLabs TTS', 'AI Agent'],
              uptime: process.uptime()
            }
          }));
      }
      
    } catch (error) {
      console.error(`❌ Помилка обробки повідомлення від ${clientId}:`, error);
      
      // Відправляємо повідомлення про помилку
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Помилка обробки повідомлення',
        error: error.message,
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Обробка закриття з'єднання
  ws.on('close', () => {
    console.log(`👋 Клієнт відключився: ${clientId}`);
  });

  // Обробка помилок
  ws.on('error', (error) => {
    console.error(`❌ WebSocket помилка для клієнта ${clientId}:`, error);
  });
});

// Запускаємо HTTP сервер
server.listen(PORT, () => {
  console.log(`🚀 HTTP та WebSocket сервер з ElevenLabs запущено на порту ${PORT}`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  
  // Логуємо ENV та робимо self-check
  logEnvSummary();
  elevenSelfCheck().catch((e) => console.error("[TTS] Self-check error:", e));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Отримано сигнал SIGINT, закриваю сервер...');
  server.close(() => {
    console.log('✅ HTTP та WebSocket сервер успішно закрито');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Отримано сигнал SIGTERM, закриваю сервер...');
  server.close(() => {
    console.log('✅ HTTP та WebSocket сервер успішно закрито');
    process.exit(0);
  });
});
