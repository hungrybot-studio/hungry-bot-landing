const { WebSocketServer } = require('ws');
const http = require('http');
const { parse } = require('node:url');
const WebSocket = require('ws'); // <--- Цей рядок додано!

// Конфігурація для ElevenLabs Agent Bridge
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY?.trim();
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID?.trim() || 'agent_6101k3vk48naeaers05d01pzw084';

// Валідація ENV
if (!ELEVEN_KEY || ELEVEN_KEY.length < 10) {
  throw new Error('ELEVENLABS_API_KEY is missing or too short');
}

if (!AGENT_ID || AGENT_ID.length < 10) {
  throw new Error('ELEVENLABS_AGENT_ID is missing or too short');
}

// Логування конфігурації
console.log("[ENV] ELEVENLABS_API_KEY =", `${ELEVEN_KEY.slice(0, 4)}…(${ELEVEN_KEY.length})`);
console.log("[ENV] ELEVENLABS_AGENT_ID =", AGENT_ID);

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

// Допоміжне: безпечна відправка WebSocket
function sendJSON(ws, obj) { 
  try { 
    ws.send(JSON.stringify(obj)); 
  } catch (e) { 
    console.error("WS send error:", e); 
  } 
}

const PORT = process.env.PORT || 8080;

// Створюємо HTTP сервер
const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url || '/');
  
  if (pathname === '/') {
    sendJSON(res, 200, {
      status: "running",
      message: "Сервер WebSocket працює",
      timestamp: new Date().toISOString(),
      port: PORT,
      "час роботи": (Date.now() - startTime) / 1000,
      connections: wss.clients.size
    });
    return;
  }

  if (pathname === '/health') {
    sendText(res, 200, "OK");
    return;
  }

  sendText(res, 404, "Not Found");
});

// Створюємо WebSocket сервер
const wss = new WebSocketServer({ server });
const startTime = Date.now();

console.log(`🚀 Server starting on port ${PORT}...`);

// Обробка WebSocket підключень
wss.on("connection", (client) => {
  console.log("✅ Client connected");

  // 1) Відкриваємо WS до ElevenLabs Agent (Realtime)
  const upstream = new WebSocket(
    `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": ELEVEN_KEY } }
  );

  // 2) Коли агент підключився — (опційно) ініціюємо першу відповідь
  upstream.on("open", () => {
    console.log("🟢 Connected to ElevenLabs Agent");
    // Якщо потрібно, щоб агент відразу сказав вітання:
    // sendJSON(upstream, { type: "response.create" }); // назва події з Realtime доки
  });

  // 3) Повідомлення від браузера → в ElevenLabs
  client.on("message", (raw) => {
    let msg; 
    try { 
      msg = JSON.parse(raw); 
    } catch (e) { 
      console.error("Failed to parse client message:", e);
      return; 
    }

    if (msg.type === "activate_agent") {
      // або чекаємо автопривітання, або явно просимо відповідь:
      // sendJSON(upstream, { type: "response.create" });
      console.log("🎯 Agent activated by client");
      return;
    }

    if (msg.type === "interrupt") {
      // перервати поточну відповідь агента
      sendJSON(upstream, { type: "response.cancel" });
      console.log("⏹️ Client interrupted agent");
      return;
    }

    // (опційно) Якщо колись додасте STT: надсилати звук користувача сюди
    // if (msg.type === "user_audio_chunk") { ... }
    
    console.log("📤 Client → Agent:", msg.type);
  });

  // 4) Відповіді ElevenLabs → у браузер
  upstream.on("message", (buf) => {
    let ev; 
    try { 
      ev = JSON.parse(buf.toString()); 
    } catch (e) { 
      console.error("Failed to parse agent message:", e);
      return; 
    }

    console.log("📥 Agent → Client:", ev.type);

    // Нижче — типові події Realtime (назви можуть трохи відрізнятися — ми обробили найчастіші)
    // Потік аудіо шматками (base64)
    if (ev.type === "response.audio.delta" && ev.delta) {
      sendJSON(client, { type: "audio_chunk", data: ev.delta, final: false });
      return;
    }

    // Кінець потоку аудіо
    if (ev.type === "response.audio.completed") {
      sendJSON(client, { type: "audio_chunk", data: "", final: true });
      return;
    }

    // Текст відповіді агента
    if (ev.type === "response.completed" && ev.text) {
      sendJSON(client, { type: "agent_speech", message: ev.text });
      return;
    }

    // Вітання/системні
    if (ev.type === "conversation.created" || ev.type === "session.created") {
      sendJSON(client, { type: "welcome", message: "Agent ready" });
      return;
    }

    // Помилки
    if (ev.type === "error") {
      sendJSON(client, { type: "error", message: ev.message || "Agent error" });
      return;
    }
  });

  const closeBoth = () => { 
    try { upstream.close(); } catch (e) { console.error("Upstream close error:", e); }
    try { client.close(); } catch (e) { console.error("Client close error:", e); }
  };
  
  upstream.on("close", () => {
    console.log("🔴 ElevenLabs Agent disconnected");
    closeBoth();
  });
  
  upstream.on("error", (e) => { 
    console.error("UP error", e); 
    sendJSON(client, {type:"error", message:String(e.message||e)}); 
  });
  
  client.on("close", () => { 
    console.log("👋 Client closed"); 
    closeBoth(); 
  });
});

// Запускаємо сервер
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Status: http://localhost:${PORT}/`);
});
