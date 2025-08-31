'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

export function AIVoiceAgent() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', text: string}>>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);

  // WebSocket підключення
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('wss://hungry-bot-websocket-server.onrender.com');
      
      ws.onopen = () => {
        console.log('✅ WebSocket з\'єднання встановлено');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Відправляємо привітання
        ws.send(JSON.stringify({
          type: 'welcome',
          message: 'Привіт! Hungry Bot готовий до роботи!'
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Отримано повідомлення:', data);
          
          if (data.type === 'welcome') {
            setMessages(prev => [...prev, { type: 'bot', text: data.message }]);
          } else if (data.type === 'echo') {
            setMessages(prev => [...prev, { type: 'bot', text: `Відповідь: ${data.originalMessage.text || data.originalMessage}` }]);
          }
        } catch (error) {
          console.error('❌ Помилка парсингу повідомлення:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket помилка:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };
      
      ws.onclose = () => {
        console.log('👋 WebSocket з\'єднання закрито');
        setIsConnected(false);
        setIsConnecting(false);
      };
      
      wsRef.current = ws;
      
    } catch (error) {
      console.error('❌ Помилка створення WebSocket:', error);
      setIsConnecting(false);
    }
  };

  // Голосове розпізнавання
  const startListening = () => {
    if (!isConnected) return;
    
    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('Голосове розпізнавання не підтримується у вашому браузері');
        return;
      }
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'uk-UA';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('Слухаю...');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        
        // Відправляємо повідомлення через WebSocket
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'message',
            text: text
          }));
          
          setMessages(prev => [...prev, { type: 'user', text: text }]);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('❌ Помилка розпізнавання:', event.error);
        setIsListening(false);
        setTranscript('');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
      
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('❌ Помилка запуску розпізнавання:', error);
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
    setMessages([]);
  };

  // Очищення при розмонтуванні
  useEffect(() => {
    console.log("VOICE_AGENT_BUILD", "a8f67fc");
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
            Hungry Bot відповість на найпоширеніші питання про себе та свої можливості. 
            Просто натисни кнопку і почни розмову!
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
                  <h3 className="text-lg font-semibold mb-4">Hungry Bot підключено! 🤖✨</h3>
                  
                  {/* Голосова кнопка */}
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isListening ? '🎤 Слухаю...' : '🎤 Почати розмову'}
                  </button>
                  
                  {/* Транскрипт */}
                  {transcript && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-700">{transcript}</p>
                    </div>
                  )}
                  
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Про себе</h3>
              <p className="text-gray-600">
                Дізнайся більше про Hungry Bot та його можливості
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
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Кулінарні поради</h3>
              <p className="text-gray-600">
                Отримай поради щодо приготування та рецептів
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
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Особистий помічник</h3>
              <p className="text-gray-600">
                Hungry Bot стане твоїм кухонним другом
              </p>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.p
            className="text-sm text-gray-500 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            * Hungry Bot готовий відповісти на твої питання прямо зараз
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
