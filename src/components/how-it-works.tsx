'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Опиши свій холодильник',
    description: 'Просто перелічи, що у тебе є. Бот зрозуміє навіть якщо ти не знаєш точних назв.',
    icon: '📱',
  },
  {
    number: '02',
    title: 'Отримай персоналізований рецепт',
    description: 'Бот підбере страву під твої інгредієнти, час, навички та настрій.',
    icon: '🧠',
  },
  {
    number: '03',
    title: 'Готуй з задоволенням',
    description: 'Покрокові інструкції, корисні поради та моральна підтримка в процесі.',
    icon: '👨‍🍳',
  },
];

export function HowItWorks() {
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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Як це працює?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Простий процес, який змінить твоє ставлення до приготування їжі. 
            Бот підбирає рецепт «під твій холодильник» — без складних пошуків та розчарувань.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              variants={itemVariants}
            >
              {/* Step number background */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 z-10">
                {step.number}
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 h-full relative">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>

                {/* Connection line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-200 to-transparent transform -translate-y-1/2"></div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 Ніяких спойлерів
            </h3>
            <p className="text-gray-600 text-lg">
              Ми не показуємо всі секрети, але гарантуємо: кожен рецепт буде 
              адаптований саме під твої потреби та можливості.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
