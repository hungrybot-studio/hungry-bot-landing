'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Hungry Bot
              </h3>
              <p className="text-gray-400">
                Твій кулінарний асистент у Telegram
              </p>
            </div>
            <p className="text-gray-400 text-sm">
              Змінюємо ставлення до приготування їжі через штучний інтелект та особистість.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Швидкі посилання
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Політика конфіденційності
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/hungrybot_support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Підтримка
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@myhungrybot.com" 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  hello@myhungrybot.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              Зв'яжіться з нами
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <span className="text-gray-400">Telegram: @hungrybot</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📧</span>
                <span className="text-gray-400">hello@myhungrybot.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌐</span>
                <span className="text-gray-400">myhungrybot.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          className="border-t border-gray-800 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Hungry Bot. Всі права захищені.
            </div>
            <div className="flex space-x-6">
              <a 
                href="https://t.me/hungrybot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Telegram"
              >
                📱
              </a>
              <a 
                href="mailto:hello@myhungrybot.com" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                📧
              </a>
            </div>
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-gray-500 text-xs">
            Hungry Bot — продукт, що розробляється з ❤️ в Україні. 
            Бета-версія планується до запуску в грудні 2025.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
