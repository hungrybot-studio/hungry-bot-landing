const { WebSocketServer } = require('ws');
const http = require('http');
const WebSocket = require('ws');

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

// Хелпери для HTTP і WebSocket
function sendJsonHttp(res, obj, status = 200, extraHeaders = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body),
    ...extraHeaders,
  });
  res.end(body);
}

function sendJsonWS(socket, obj) {
  try {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(obj));
    }
  } catch (e) {
    console.error("WS send error:", e);
  }
}

const PORT = process.env.PORT || 10000;

// Нормальний HTTP-сервер (без плутанини з ws)
const server = http.createServer((req, res) => {
  try {
    // CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "*",
        "access-control-max-age": "600",
      });
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/health") {
      return sendJsonHttp(res, { ok: true, service: "hungry-bot-ws", ts: Date.now() });
    }

    if (url.pathname === "/") {
      return sendJsonHttp(res, { status: "running" });
    }

    return sendJsonHttp(res, { error: "Not found" }, 404);
  } catch (e) {
    try { sendJsonHttp(res, { error: String(e?.message || e) }, 500); } catch {}
  }
});

// Прив'язати WS до цього HTTP-серверу й зробити міст до ElevenLabs
const wss = new WebSocketServer({ server });

wss.on("connection", (client) => {
  console.log("✅ Client connected");

  const upstream = new WebSocket(
    `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`,
    { headers: { "xi-api-key": ELEVEN_KEY } }
  );

  upstream.on("open", () => {
    console.log("🟢 Connected to ElevenLabs Agent");
    // за потреби можна одразу дати агенту команду заговорити:
    // upstream.send(JSON.stringify({ type: "response.create" }));
  });

  // клієнтський браузер -> агент
  client.on("message", (raw) => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === "activate_agent") {
      // або чекаємо автопривітання, або запускаємо відповідь:
      // upstream.send(JSON.stringify({ type: "response.create" }));
      return;
    }
    if (msg.type === "interrupt") {
      upstream.send(JSON.stringify({ type: "response.cancel" }));
      return;
    }
    // (опційно) тут колись піде аудіо користувача до агента
  });

  // агент -> клієнтський браузер
  upstream.on("message", (buf) => {
    let ev; try { ev = JSON.parse(buf.toString()); } catch { return; }

    if (ev.type === "response.audio.delta" && ev.delta) {
      return sendJsonWS(client, { type: "audio_chunk", data: ev.delta, final: false });
    }
    if (ev.type === "response.audio.completed") {
      return sendJsonWS(client, { type: "audio_chunk", data: "", final: true });
    }
    if (ev.type === "response.completed" && ev.text) {
      return sendJsonWS(client, { type: "agent_speech", message: ev.text });
    }
    if (ev.type === "conversation.created" || ev.type === "session.created") {
      return sendJsonWS(client, { type: "welcome", message: "Agent ready" });
    }
    if (ev.type === "error") {
      return sendJsonWS(client, { type: "error", message: ev.message || "Agent error" });
    }
  });

  const closeBoth = () => { try{upstream.close();}catch{} try{client.close();}catch{} };
  upstream.on("close", closeBoth);
  upstream.on("error", (e) => { console.error("UP error", e); sendJsonWS(client, { type:"error", message: String(e.message||e) }); });
  client.on("close", () => { console.log("👋 Client closed"); closeBoth(); });
});

// Старт сервера коректно (слухати 0.0.0.0 і $PORT)
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[ENV] ELEVENLABS_AGENT_ID = ${AGENT_ID}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
