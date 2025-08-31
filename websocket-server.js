const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// ElevenLabs API налаштування
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'your-api-key-here';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

// Створюємо HTTP сервер
const server = http.createServer((req, res) => {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      message: 'WebSocket сервер з ElevenLabs інтеграцією працює',
      timestamp: new Date().toISOString(),
      port: PORT,
      uptime: process.uptime(),
      connections: wss.clients.size,
      features: ['WebSocket', 'ElevenLabs TTS', 'AI Agent']
    }));
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

// Створюємо WebSocket сервер поверх HTTP сервера
const wss = new WebSocketServer({ server });

console.log(`🚀 HTTP та WebSocket сервер з ElevenLabs запущено на порту ${PORT}`);

// Функція для генерації аудіо через ElevenLabs
async function generateElevenLabsAudio(text, voiceId = ELEVENLABS_VOICE_ID) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return {
      success: true,
      audioData: base64Audio,
      format: 'audio/mpeg'
    };
  } catch (error) {
    console.error('❌ Помилка ElevenLabs API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Функція для активації AI агента
async function activateHungryBotAgent(ws, clientId) {
  try {
    console.log(`🤖 Активація Hungry Bot для клієнта ${clientId}`);
    
    // Привітання агента
    const welcomeMessage = "Привіт! Я Hungry Bot, твій кулінарний AI-асистент. Я готовий відповісти на всі твої питання про кухню, рецепти та кулінарні секрети. Що тебе цікавить?";
    
    // Генеруємо аудіо через ElevenLabs
    const audioResult = await generateElevenLabsAudio(welcomeMessage);
    
    if (audioResult.success) {
      // Відправляємо повідомлення з аудіо
      ws.send(JSON.stringify({
        type: 'agent_speech',
        message: welcomeMessage,
        audioData: audioResult.audioData,
        audioFormat: audioResult.format,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`✅ Агент активовано та відправлено аудіо для клієнта ${clientId}`);
    } else {
      // Якщо аудіо не згенеровано, відправляємо тільки текст
      ws.send(JSON.stringify({
        type: 'agent_speech',
        message: welcomeMessage,
        error: 'Аудіо недоступне',
        timestamp: new Date().toISOString()
      }));
      
      console.log(`⚠️ Агент активовано без аудіо для клієнта ${clientId}`);
    }
    
  } catch (error) {
    console.error(`❌ Помилка активації агента для клієнта ${clientId}:`, error);
    
    // Відправляємо повідомлення про помилку
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
  console.log(`📡 HTTP та WebSocket сервер готовий до прийому підключень на порту ${PORT}`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`🤖 ElevenLabs інтеграція: ${ELEVENLABS_API_KEY !== 'your-api-key-here' ? '✅ Активна' : '❌ Не налаштована'}`);
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
