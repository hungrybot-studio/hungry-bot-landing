import { z } from 'zod';

export const leadFormSchema = z.object({
  email: z.string().email('Введіть коректну email адресу').optional(),
  telegram: z.string().regex(/^@?[a-zA-Z0-9_]{5,}$/, 'Введіть коректний Telegram username').optional(),
  problem: z.enum(['Так', 'Ні', 'Іноді'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  cook_freq: z.enum(['Щодня', 'Кілька разів на тиждень', 'Рідко'], {
    required_error: 'Оберіть частоту приготування',
  }),
  tg_ok: z.enum(['Так', 'Ні'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  tone: z.enum(['Гумор', 'Серйозно', 'Комбо'], {
    required_error: 'Оберіть тон спілкування',
  }),
  blocker: z.string().optional(),
  style_preference: z.enum(['Швидко', 'Бюджетно', 'Для сім\'ї', 'Для дієти', 'Креативно'], {
    required_error: 'Оберіть стиль приготування',
  }),
  primary_goal: z.enum(['Меню на тиждень', 'Дешеві рецепти', 'Фітнес-страви', 'Щось нове'], {
    required_error: 'Оберіть основну мету',
  }),
  payment_willingness: z.enum(['Так', 'Ні', 'Важко сказати'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  fair_price: z.enum(['1$', '3$', '5$', '10$'], {
    required_error: 'Оберіть вартість',
  }),
}).refine(
  (data) => data.email || data.telegram,
  {
    message: 'Введіть або email, або Telegram username',
    path: ['email'],
  }
);

export type LeadFormSchema = z.infer<typeof leadFormSchema>;

export const leadPayloadSchema = z.object({
  email: z.string().email('Введіть коректну email адресу').optional(),
  telegram: z.string().regex(/^@?[a-zA-Z0-9_]{5,}$/, 'Введіть коректний Telegram username').optional(),
  problem: z.enum(['Так', 'Ні', 'Іноді'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  cook_freq: z.enum(['Щодня', 'Кілька разів на тиждень', 'Рідко'], {
    required_error: 'Оберіть частоту приготування',
  }),
  tg_ok: z.enum(['Так', 'Ні'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  tone: z.enum(['Гумор', 'Серйозно', 'Комбо'], {
    required_error: 'Оберіть тон спілкування',
  }),
  blocker: z.string().optional(),
  style_preference: z.enum(['Швидко', 'Бюджетно', 'Для сім\'ї', 'Для дієти', 'Креативно'], {
    required_error: 'Оберіть стиль приготування',
  }),
  primary_goal: z.enum(['Меню на тиждень', 'Дешеві рецепти', 'Фітнес-страви', 'Щось нове'], {
    required_error: 'Оберіть основну мету',
  }),
  payment_willingness: z.enum(['Так', 'Ні', 'Важко сказати'], {
    required_error: 'Оберіть варіант відповіді',
  }),
  fair_price: z.enum(['1$', '3$', '5$', '10$'], {
    required_error: 'Оберіть вартість',
  }),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referrer: z.string().optional(),
  landing_variant: z.string().default('A'),
}).refine(
  (data) => data.email || data.telegram,
  {
    message: 'Введіть або email, або Telegram username',
    path: ['email'],
  }
);

export type LeadPayloadSchema = z.infer<typeof leadPayloadSchema>;
