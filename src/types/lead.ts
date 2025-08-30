export type LeadPayload = {
  email?: string;
  telegram?: string;
  problem: 'Так' | 'Ні' | 'Іноді';
  cook_freq: 'Щодня' | 'Кілька разів на тиждень' | 'Рідко';
  tg_ok: 'Так' | 'Ні';
  tone: 'Гумор' | 'Серйозно' | 'Комбо';
  blocker?: string;
  style_preference: 'Швидко' | 'Бюджетно' | 'Для сім\'ї' | 'Для дієти' | 'Креативно';
  primary_goal: 'Меню на тиждень' | 'Дешеві рецепти' | 'Фітнес-страви' | 'Щось нове';
  payment_willingness: 'Так' | 'Ні' | 'Важко сказати';
  fair_price: '1$' | '3$' | '5$' | '10$';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_variant?: string;
};

export type LeadFormData = Omit<LeadPayload, 'utm_source' | 'utm_medium' | 'utm_campaign' | 'referrer' | 'landing_variant'>;

export type UTMData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing_variant: string;
};
