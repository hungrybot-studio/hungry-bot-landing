export const env = {
  NEXT_PUBLIC_LEADS_WEBHOOK: process.env.NEXT_PUBLIC_LEADS_WEBHOOK || '',
  NEXT_PUBLIC_ENABLE_ELEVENLABS_AGENT: process.env.NEXT_PUBLIC_ENABLE_ELEVENLABS_AGENT === 'true',
  NEXT_PUBLIC_ANALYTICS_PROVIDER: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'ga4',
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || '',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'myhungrybot.com',
} as const;

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Validation
if (isProduction && !env.NEXT_PUBLIC_LEADS_WEBHOOK) {
  console.warn('NEXT_PUBLIC_LEADS_WEBHOOK is not set in production');
}

if (isProduction && env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'ga4' && !env.NEXT_PUBLIC_GA4_ID) {
  console.warn('NEXT_PUBLIC_GA4_ID is not set in production');
}
