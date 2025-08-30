'use client';

import { motion } from 'framer-motion';
import { CTAButton } from './cta-button';

interface PainPointsProps {
  onOpenForm: () => void;
}

const painPoints = [
  {
    icon: '🎓',
    title: 'Студент',
    description: 'Обмежений бюджет, мало часу, але хоче їсти смачно',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: '💼',
    title: 'Ділова людина',
    description: 'Працює довго, втомився, потрібно швидко щось приготувати',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Сім\'я',
    description: 'Різні смаки, диетичні обмеження, потрібно годувати всіх',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: '🥗',
    title: 'На дієті',
    description: 'Шукає здорові альтернативи, рахує калорії, хоче різноманітності',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: '👨‍🍳',
    title: 'Гурман',
    description: 'Експериментує з новими смаками, шукає натхнення',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: '🌱',
    title: 'Особливе харчування',
    description: 'Вегани, алергетики, безглютенова дієта - знайдемо рішення',
    color: 'from-teal-500 to-teal-600',
  },
];

export function PainPoints({ onOpenForm }: PainPointsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Це для тебе, якщо ти...
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Hungry Bot розуміє твої потреби і допоможе знайти ідеальний рецепт
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {painPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="group"
              variants={itemVariants}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${point.color} flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {point.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {point.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <CTAButton
            onClick={onOpenForm}
            variant="primary"
            size="lg"
            buttonText="Дізнатись, чи підійде мені"
            location="pain_points"
            className="mx-auto"
          >
            Дізнатись, чи підійде мені
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
