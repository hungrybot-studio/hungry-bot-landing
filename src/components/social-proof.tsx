'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Анна, 24',
    role: 'Студентка',
    message: 'Тепер готую кожен день! Бот знаходить рецепти з того, що є в холодильнику 😊',
    avatar: '👩‍🎓',
  },
  {
    name: 'Максим, 31',
    role: 'IT-спеціаліст',
    message: 'Після роботи не хочеться думати що готувати. Бот вирішує цю проблему за секунди!',
    avatar: '👨‍💻',
  },
  {
    name: 'Олена, 28',
    role: 'Мати двох дітей',
    message: 'Різні смаки в сім\'ї? Не проблема! Бот підбирає страви, які подобаються всім.',
    avatar: '👩‍👧‍👦',
  },
];

const stats = [
  { number: '500+', label: 'у списку очікування' },
  { number: '95%', label: 'швидше й веселіше за Google' },
  { number: '24/7', label: 'доступність у Telegram' },
];

export function SocialProof() {
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
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Нас уже тестують
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Приєднуйся до спільноти людей, які вже змінили своє ставлення до приготування їжі
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={itemVariants}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group"
              variants={itemVariants}
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>

                {/* Message */}
                <div className="text-center mb-4">
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.message}"
                  </p>
                </div>

                {/* Author */}
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-primary-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional social proof */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              🎁 Розіграш Преміум планів
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Розіграш 3 Преміум планів на місяць серед перших 100 користувачів 
              та можливість впливати на розвиток продукту.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                🎯 Розіграш
              </span>
              <span className="flex items-center">
                ⭐ Преміум плани
              </span>
              <span className="flex items-center">
                🚀 Вплив на продукт
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
