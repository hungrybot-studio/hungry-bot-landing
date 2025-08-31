'use client';

import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

export function AIVoiceAgent() {
  // Простий компонент з кнопкою для відкриття ElevenLabs віджета

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
            <CTAButton
              onClick={() => (window as any).hungryBotOpenAgent?.()}
              variant="primary"
              size="lg"
              location="ai_voice_agent"
              className="mx-auto text-lg px-8 py-4"
            >
              🤖 Запитати Hungry Bot
            </CTAButton>
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
