'use client';

import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

interface FinalCtaProps {
  onOpenForm: () => void;
}

export function FinalCta({ onOpenForm }: FinalCtaProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main headline */}
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            variants={itemVariants}
          >
            Спробуй — і забудеш про нудні рецепти
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Просто відкрий Telegram і скажи мені, що в тебе в холодильнику. 
            Отримай рецепт, який точно підійде саме тобі.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <CTAButton
              onClick={onOpenForm}
              variant="secondary"
              size="lg"
              buttonText="🚀 Отримати запрошення"
              location="final_cta_primary"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-primary-600 border-white"
            >
              🚀 Отримати запрошення
            </CTAButton>
            
            <CTAButton
              onClick={onOpenForm}
              variant="ghost"
              size="lg"
              buttonText="🔥 Спробувати першим"
              location="final_cta_secondary"
              className="w-full sm:w-auto text-white hover:bg-white hover:text-primary-600 border-white"
            >
              🔥 Спробувати першим
            </CTAButton>
          </motion.div>

          {/* Additional motivation */}
          <motion.div
            className="mt-12"
            variants={itemVariants}
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-soft rounded-2xl p-6 max-w-2xl mx-auto border border-white border-opacity-20">
              <div className="flex items-center justify-center space-x-4 text-white">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-primary-300 rounded-full flex items-center justify-center text-sm font-bold">👨‍🍳</div>
                  <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center text-sm font-bold">👩‍💻</div>
                  <div className="w-8 h-8 bg-accent-300 rounded-full flex items-center justify-center text-sm font-bold">🎓</div>
                </div>
                <span className="text-sm font-medium">
                  Приєднуйся до 500+ людей, які вже змінили своє ставлення до кухні
                </span>
              </div>
            </div>
          </motion.div>

          {/* Urgency message */}
          <motion.p
            className="text-sm text-primary-200 mt-8 italic"
            variants={itemVariants}
          >
            ⏰ Бета-тестування починається в грудні 2025. Місця обмежені!
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
