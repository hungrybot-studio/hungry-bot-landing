'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

export function AIVoiceAgent() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Тут буде реальна інтеграція з AI Voice Agent через API
      // Наприклад, WebSocket підключення або REST API виклик
      
      // Симуляція підключення для демонстрації
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Після успішного підключення можна:
      // 1. Відкрити чат-інтерфейс
      // 2. Запустити голосовий асистент
      // 3. Підключитися до API для real-time комунікації
      
      // Показуємо успішне підключення
      alert('Hungry Bot підключено! Тепер можеш задавати питання голосом або текстом. 🤖✨');
      
    } catch (error) {
      console.error('Помилка підключення до Hungry Bot:', error);
      alert('Помилка підключення. Спробуй ще раз або звернися до підтримки.');
    } finally {
      setIsConnecting(false);
    }
  };

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
                                <CTAButton
              onClick={handleConnect}
              variant="primary"
              size="lg"
              buttonText={isConnecting ? "🔗 Підключаємося..." : "🤖 Запитати Hungry Bot"}
              location="ai_voice_agent"
              className="mx-auto text-lg px-8 py-4"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Підключаємося...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">🤖</span>
                  Запитати Hungry Bot
                </>
              )}
            </CTAButton>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                🤖
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Про себе</h3>
              <p className="text-gray-600 text-sm">Hungry Bot розповість про свої можливості та функції</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                🍳
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Кулінарні поради</h3>
              <p className="text-gray-600 text-sm">Отримай поради щодо приготування та рецептів</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                💬
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Особистий помічник</h3>
              <p className="text-gray-600 text-sm">Hungry Bot стане твоїм кухонним другом</p>
            </div>
          </motion.div>

          {/* Additional info */}
          <motion.p
            className="text-sm text-gray-500 mt-8 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            * Hungry Bot готовий відповісти на твої питання прямо зараз
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
