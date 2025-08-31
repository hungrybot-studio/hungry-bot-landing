'use client';

import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';
import { Logo } from './logo';

interface HeroProps {
  onOpenForm: () => void;
}

export function Hero({ onOpenForm }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Logo size="lg" className="mx-auto" />
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main headline */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Рецепти, як ніколи раніше{' '}
            <span className="text-gradient">🍳</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-8 font-medium"
            variants={itemVariants}
          >
            Hungry Bot — твій кулінарний асистент у Telegram
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Введи, що є у холодильнику. Отримай рецепт — швидко, з настроєм і з сюрпризом. 
            Це не Google. Це твій кухонний друг.
          </motion.p>

          {/* Micro text */}
          <motion.p
            className="text-sm text-gray-500 mb-12 italic"
            variants={itemVariants}
          >
            Ніяких спойлерів. Просто перевір 😉
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <CTAButton
              onClick={onOpenForm}
              variant="primary"
              size="lg"
              location="hero_primary"
              className="w-full sm:w-auto"
            >
              🎟 Отримати раннє запрошення
            </CTAButton>
            
            <CTAButton
              onClick={onOpenForm}
              variant="secondary"
              size="lg"
              location="hero_secondary"
              className="w-full sm:w-auto"
            >
              🔥 Спробувати бета-бота (безкоштовно)
            </CTAButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero illustration placeholder */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl opacity-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="w-full h-64 bg-gradient-to-t from-primary-200 to-transparent rounded-t-full"></div>
      </motion.div>
    </section>
  );
}
