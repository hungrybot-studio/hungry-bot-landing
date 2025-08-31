'use client';

import { env } from '@/lib/env';

export function EnvTest() {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">🔍 Тест змінних середовища:</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>NEXT_PUBLIC_LEADS_WEBHOOK:</strong>{' '}
          <span className={env.NEXT_PUBLIC_LEADS_WEBHOOK ? 'text-green-600' : 'text-red-600'}>
            {env.NEXT_PUBLIC_LEADS_WEBHOOK || 'НЕ НАЛАШТОВАНО'}
          </span>
        </div>
        <div>
          <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
        </div>
        <div>
          <strong>Довжина URL:</strong> {env.NEXT_PUBLIC_LEADS_WEBHOOK?.length || 0} символів
        </div>
      </div>
    </div>
  );
}
