import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Політика конфіденційності - Hungry Bot',
  description: 'Політика конфіденційності Hungry Bot. Дізнайся, як ми збираємо, використовуємо та захищаємо твої персональні дані.',
  robots: {
    index: true,
    follow: true,
  },
};

const PRIVACY_VERSION = '1.0.0';
const PRIVACY_DATE = new Date('2025-01-01');

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Політика конфіденційності
            </h1>
            <p className="text-lg text-gray-600">
              Hungry Bot захищає твою приватність та прозоро розповідає про обробку даних
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Версія {PRIVACY_VERSION} • Оновлено {formatDate(PRIVACY_DATE)}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Вступ
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Hungry Bot («ми», «нас», «наш») зобов'язується захищати твою приватність. 
                Ця Політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо 
                твою персональну інформацію при використанні нашого сервісу.
              </p>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Які дані ми збираємо
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Персональна інформація
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Email адреса (якщо надана)</li>
                    <li>Telegram username (якщо наданий)</li>
                    <li>Відповіді на питання форми для персоналізації</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Технічна інформація
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>UTM-параметри (utm_source, utm_medium, utm_campaign)</li>
                    <li>Referrer (джерело переходу)</li>
                    <li>Landing variant (A/B тестування)</li>
                    <li>IP адреса та геолокація (анонімно)</li>
                    <li>Дані про взаємодію з продуктом</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Як ми використовуємо твої дані
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Основні цілі
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Надання раннього доступу до Hungry Bot</li>
                    <li>Покращення продукту на основі зворотного зв'язку</li>
                    <li>Персоналізація повідомлень та рекомендацій</li>
                    <li>Аналітика та оптимізація продукту</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Маркетингові цілі
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Інформування про оновлення та нові функції</li>
                    <li>Запрошення до бета-тестування</li>
                    <li>Персоналізовані пропозиції та знижки</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Де та як зберігаються дані
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Google Sheets
                  </h3>
                  <p className="text-gray-700">
                    Основні дані форм зберігаються в Google Sheets з обмеженим доступом 
                    тільки для команди Hungry Bot. Google забезпечує високий рівень безпеки.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Аналітика
                  </h3>
                  <p className="text-gray-700">
                    Агреговані дані про використання зберігаються в Google Analytics або Plausible 
                    для аналітики продуктивності та покращення користувацького досвіду.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Передача даних третім сторонам
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ми <strong>НЕ продаємо, НЕ здаємо в оренду та НЕ передаємо</strong> твої персональні дані 
                третім сторонам, окрім технічних провайдерів, необхідних для роботи сервісу:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-3">
                <li>Google (Sheets, Analytics) - зберігання та аналітика</li>
                <li>Vercel - хостинг та технічна інфраструктура</li>
                <li>Telegram - платформа для бота</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Термін зберігання даних
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Твої дані зберігаються протягом наступних періодів:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-3">
                <li>До запуску Hungry Bot + 12 місяців</li>
                <li>До відкликання згоди на обробку</li>
                <li>До запиту на видалення</li>
              </ul>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Твої права
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Право на доступ
                  </h3>
                  <p className="text-gray-700">
                    Ти можеш запитувати копію своїх персональних даних, які ми зберігаємо.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Право на виправлення
                  </h3>
                  <p className="text-gray-700">
                    Ти можеш виправляти неточні або неповні дані.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Право на видалення
                  </h3>
                  <p className="text-gray-700">
                    Ти можеш запитувати видалення своїх персональних даних.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Право на відкликання згоди
                  </h3>
                  <p className="text-gray-700">
                    Ти можеш відкликати згоду на обробку даних у будь-який час.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Зв'яжіться з нами
              </h2>
              <div className="bg-primary-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Для питань щодо цієї Політики конфіденційності або для реалізації своїх прав:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:privacy@myhungrybot.com" 
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      privacy@myhungrybot.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Telegram:</strong>{' '}
                    <a 
                      href="https://t.me/hungrybot_support" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      @hungrybot_support
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Оновлення Політики
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Ми можемо оновлювати цю Політику конфіденційності. Про всі зміни ми повідомимо 
                тебе через email або Telegram. Продовження використання сервісу після змін 
                означає твою згоду з оновленою Політикою.
              </p>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Повернутися на головну
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
