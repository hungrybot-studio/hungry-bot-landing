'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-3">
      <motion.div
        className="flex items-start space-x-3"
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            id="consent"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 focus:ring-offset-2"
            required
          />
        </div>
        
        <div className="flex-1">
          <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
            Я погоджуюся з{' '}
            <Link
              href="/privacy"
              className="text-primary-600 hover:text-primary-700 underline font-medium transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Політикою конфіденційності
            </Link>
            {' '}та даю згоду на обробку моїх персональних даних для отримання раннього доступу до Hungry Bot та персоналізованих повідомлень.
          </label>
        </div>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm flex items-center space-x-2"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Additional info */}
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-lg">ℹ️</span>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Що ми збираємо:</p>
            <ul className="space-y-1 text-xs">
              <li>• Email або Telegram username для зв'язку</li>
              <li>• Відповіді на питання форми для персоналізації</li>
              <li>• UTM-параметри для аналітики</li>
              <li>• Дані про взаємодію з продуктом</li>
            </ul>
            <p className="mt-2 text-xs">
              Ваші дані захищені та використовуються тільки для покращення Hungry Bot.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
