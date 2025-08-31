'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

export function AIVoiceAgent() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [agentMessage, setAgentMessage] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', text: string}>>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // WebSocket підключення
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('wss://hungry-bot-websocket-server.onrender.com');
      
      ws.onopen = () => {
        console.log('✅ WebSocket з\'єднання встановлено');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Автоматично активуємо агента
        activateAgent();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Отримано повідомлення:', data);
          
          if (data.type === 'agent_speech') {
            // Агент починає говорити
            setAgentMessage(data.message);
            setIsAgentActive(true);
            
            // Відтворюємо аудіо від ElevenLabs
            if (data.audioUrl) {
              playAgentAudio(data.audioUrl);
            }
            
            setMessages(prev => [...prev, { type: 'bot', text: data.message }]);
          } else if (data.type === 'agent_response') {
            // Відповідь агента
            setAgentMessage(data.message);
            setMessages(prev => [...prev, { type: 'bot', text: data.message }]);
          } else if (data.type === 'user_input') {
            // Користувач щось сказав
            setMessages(prev => [...prev, { type: 'user', text: data.text }]);
          }
        } catch (error) {
          console.error('❌ Помилка парсингу повідомлення:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket помилка:', error);
        setIsConnected(false);
        setIsConnecting(false);
        setIsAgentActive(false);
      };
      
      ws.onclose = () => {
        console.log('👋 WebSocket з\'єднання закрито');
        setIsConnected(false);
        setIsConnecting(false);
        setIsAgentActive(false);
      };
      
      wsRef.current = ws;
      
    } catch (error) {
      console.error('❌ Помилка створення WebSocket:', error);
      setIsConnecting(false);
    }
  };

  // Активація агента
  const activateAgent = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('🤖 Активація Hungry Bot...');
      
      // Відправляємо команду активації
      wsRef.current.send(JSON.stringify({
        type: 'activate_agent',
        action: 'start_conversation'
      }));
    }
  };

  // Відтворення аудіо від агента
  const playAgentAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('❌ Помилка відтворення аудіо:', error);
      });
    }
  };

  // Переривання агента голосом
  const interruptAgent = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('🎤 Перериваю агента...');
      
      wsRef.current.send(JSON.stringify({
        type: 'interrupt_agent',
        action: 'user_speaking'
      }));
      
      setIsAgentActive(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    connectWebSocket();
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setIsAgentActive(false);
    setAgentMessage('');
    setMessages([]);
  };

  // Очищення при розмонтуванні
  useEffect(() => {
    console.log("VOICE_AGENT_BUILD", "a8f67fc");
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Спитай у Hungry Bot{' '}
            <span className="text-gradient">🤖</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Hungry Bot — твій кулінарний AI-асистент! Просто натисни кнопку і почни розмову. 
            Агент сам веде діалог та відповідає на всі твої питання про кухню.
          </motion.p>

          {/* AI Voice Agent Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {!isConnected ? (
              <CTAButton
                onClick={handleConnect}
                variant="primary"
                size="lg"
                buttonText={isConnecting ? "🔗 Підключаємося..." : "🤖 Запитати Hungry Bot"}
                location="ai_voice_agent"
                className="mx-auto text-lg px-8 py-4"
                disabled={isConnecting}
              />
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Hungry Bot активовано! 🤖✨</h3>
                  
                  {/* Статус агента */}
                  {isAgentActive && (
                    <div className="mb-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm">🎤 Агент говорить...</p>
                    </div>
                  )}
                  
                  {/* Повідомлення агента */}
                  {agentMessage && (
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 text-sm">{agentMessage}</p>
                    </div>
                  )}
                  
                  {/* Кнопка переривання */}
                  <button
                    onClick={interruptAgent}
                    disabled={!isAgentActive}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isAgentActive 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    🎤 Перервати агента
                  </button>
                  
                  {/* Повідомлення */}
                  {messages.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-lg text-sm ${
                            msg.type === 'user' 
                              ? 'bg-blue-100 text-blue-800 ml-4' 
                              : 'bg-gray-100 text-gray-800 mr-4'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Кнопка відключення */}
                  <button
                    onClick={handleDisconnect}
                    className="mt-4 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Відключитися
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Прихований аудіо елемент */}
          <audio ref={audioRef} style={{ display: 'none' }} />

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Card 1 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Асистент</h3>
              <p className="text-gray-600">
                Hungry Bot сам веде діалог та відповідає на всі питання про кухню
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Голосовий інтерфейс</h3>
              <p className="text-gray-600">
                Натуральна мова через ElevenLabs та можливість переривати агента
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Кулінарна експертиза</h3>
              <p className="text-gray-600">
                Спеціалізується на рецептах, кухонних порадах та кулінарних секретах
              </p>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.p
            className="text-sm text-gray-500 mt-12 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            * Hungry Bot використовує ElevenLabs для натурального голосу та AI для розумних відповідей
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
