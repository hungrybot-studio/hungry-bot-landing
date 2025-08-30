'use client';

import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

interface WhatsNextProps {
  onOpenForm: () => void;
}

const timelineSteps = [
  {
    month: 'Грудень 2025',
    title: 'Запуск бета-версії',
    description: 'Перші 100 користувачів отримають доступ до Hungry Bot',
    icon: '🚀',
    color: 'from-primary-500 to-primary-600',
  },
  {
    month: 'Січень 2026',
    title: 'Розширення функціоналу',
    description: 'Додавання нових рецептів, покращення персоналізації',
    icon: '⚡',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    month: 'Березень 2026',
    title: 'Публічний запуск',
    description: 'Відкриття для всіх користувачів з різними тарифами',
    icon: '🌍',
    color: 'from-accent-500 to-accent-600',
  },
];

const benefits = [
  {
    icon: '🎯',
    title: 'Ранній доступ',
    description: 'Будь першим, хто спробує Hungry Bot',
  },
  {
    icon: '💬',
    title: 'Приватний канал',
    description: 'Ексклюзивні оновлення та новини продукту',
  },
  {
    icon: '🤝',
    title: 'Вплив на продукт',
    description: 'Твоя думка матиме значення для розвитку',
  },
  {
    icon: '🎁',
    title: 'Розіграш Преміум планів',
    description: '3 Преміум плани на місяць серед перших 100 користувачів',
  },
];

export function WhatsNext({ onOpenForm }: WhatsNextProps) {
  const getBenefitGradient = (index: number) => {
    const gradients = [
      'from-pink-300 to-blue-300',    // Light pink to light blue
      'from-orange-300 to-blue-300',  // Light orange to light blue
      'from-orange-300 to-yellow-300', // Light orange to light yellow
      'from-orange-300 to-amber-300',  // Light orange to light brown
    ];
    return gradients[index % gradients.length];
  };

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Що буде далі?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Hungry Bot запускається в грудні 2025. Приєднуйся до раннього доступу 
            та отримай ексклюзивні переваги.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-200 to-secondary-200"></div>
            
            <div className="space-y-12">
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={step.month}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  variants={itemVariants}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r ${step.color} rounded-full shadow-lg z-10`}></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                        {step.icon}
                      </div>
                      <div className="text-sm text-primary-600 font-semibold mb-2">
                        {step.month}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Переваги раннього доступу
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="text-center"
                variants={itemVariants}
              >
                <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getBenefitGradient(index)} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto`}>
                    {benefit.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-4xl mx-auto border border-primary-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 Не пропусти запуск!
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Місця в бета-тестуванні обмежені. Заповни форму зараз і гарантуй собі 
              ранній доступ до Hungry Bot з усіма перевагами.
            </p>
            
            <CTAButton
              onClick={onOpenForm}
              variant="primary"
              size="lg"
              buttonText="🎟 Забронювати місце"
              location="whats_next"
              className="mx-auto"
            >
              🎟 Забронювати місце
            </CTAButton>
            
            <p className="text-sm text-gray-500 mt-4">
              ⏰ Обмежена кількість місць • Безкоштовно • Без зобов'язань
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
