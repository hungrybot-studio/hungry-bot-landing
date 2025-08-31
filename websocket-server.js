const { WebSocketServer } = require('ws');

// Отримуємо порт з змінних середовища або використовуємо 8080 за замовчуванням
const PORT = process.env.PORT || 8080;

// Створюємо WebSocket сервер
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 WebSocket сервер запущено на порту ${PORT}`);

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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Отримано сигнал SIGINT, закриваю сервер...');
  wss.close(() => {
    console.log('✅ WebSocket сервер успішно закрито');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Отримано сигнал SIGTERM, закриваю сервер...');
  wss.close(() => {
    console.log('✅ WebSocket сервер успішно закрито');
    process.exit(0);
  });
});

// Логування статусу сервера
console.log(`📡 WebSocket сервер готовий до прийому підключень на порту ${PORT}`);
console.log(`🌐 Використовуйте wss://your-domain.com або ws://localhost:${PORT} для підключення`);
