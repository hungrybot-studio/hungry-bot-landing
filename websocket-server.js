const { WebSocketServer } = require('ws');
const http = require('http');

// Отримуємо порт з змінних середовища або використовуємо 8080 за замовчуванням
const PORT = process.env.PORT || 8080;

// Створюємо HTTP сервер
const server = http.createServer((req, res) => {
  // Налаштовуємо CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET') {
    // Відповідаємо на GET запити
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'running',
      message: 'WebSocket server is running',
      timestamp: new Date().toISOString(),
      port: PORT,
      uptime: process.uptime(),
      connections: wss.clients.size
    }));
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

// Створюємо WebSocket сервер на основі HTTP сервера
const wss = new WebSocketServer({ server });

console.log(`🚀 HTTP та WebSocket сервер запущено на порту ${PORT}`);

// Обробка підключень
wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`✅ Новий клієнт підключився: ${clientIP}`);

  // Відправляємо привітання
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Вітаю! WebSocket сервер успішно підключено.',
    timestamp: new Date().toISOString()
  }));

  // Обробка повідомлень від клієнта
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📨 Отримано повідомлення від ${clientIP}:`, message);

      // Відправляємо ехо-відповідь
      const echoResponse = {
        type: 'echo',
        originalMessage: message,
        timestamp: new Date().toISOString(),
        serverInfo: {
          port: PORT,
          uptime: process.uptime()
        }
      };

      ws.send(JSON.stringify(echoResponse));
      console.log(`🔄 Відправлено ехо-відповідь клієнту ${clientIP}`);

    } catch (error) {
      console.error(`❌ Помилка обробки повідомлення від ${clientIP}:`, error);
      
      // Відправляємо повідомлення про помилку
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Помилка обробки повідомлення. Перевірте формат JSON.',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Обробка закриття з'єднання
  ws.on('close', () => {
    console.log(`👋 Клієнт відключився: ${clientIP}`);
  });

  // Обробка помилок
  ws.on('error', (error) => {
    console.error(`❌ Помилка WebSocket для клієнта ${clientIP}:`, error);
  });
});

// Обробка помилок сервера
wss.on('error', (error) => {
  console.error('❌ Помилка WebSocket сервера:', error);
});

// Запускаємо HTTP сервер
server.listen(PORT, () => {
  console.log(`📡 HTTP та WebSocket сервер готовий до прийому підключень на порту ${PORT}`);
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
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
