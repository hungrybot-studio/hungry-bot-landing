import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import ElevenLabsAgentWidget from '@/components/ElevenLabsAgentWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hungry Bot - Рецепти, як ніколи раніше 🍳',
  description: 'Hungry Bot — твій кулінарний асистент у Telegram. Введи, що є у холодильнику. Отримай рецепт — швидко, з настроєм і з сюрпризом.',
  keywords: 'кулінарний бот, рецепти, Telegram, штучний інтелект, кухня, приготування їжі',
  authors: [{ name: 'Hungry Bot Team' }],
  creator: 'Hungry Bot',
  publisher: 'Hungry Bot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://myhungrybot.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hungry Bot - Рецепти, як ніколи раніше 🍳',
    description: 'Hungry Bot — твій кулінарний асистент у Telegram. Введи, що є у холодильнику. Отримай рецепт — швидко, з настроєм і з сюрпризом.',
    url: 'https://myhungrybot.com',
    siteName: 'Hungry Bot',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hungry Bot - Кулінарний асистент у Telegram',
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hungry Bot - Рецепти, як ніколи раніше 🍳',
    description: 'Hungry Bot — твій кулінарний асистент у Telegram. Введи, що є у холодильнику. Отримай рецепт — швидко, з настроєм і з сюрпризом.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ed7516" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'ga4' && process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Plausible Analytics */}
        {process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'plausible' && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'myhungrybot.com'}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="antialiased">
        {children}
        
        {/* ElevenLabs Agent Widget */}
        <ElevenLabsAgentWidget />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Hungry Bot',
              description: 'Кулінарний асистент у Telegram з штучним інтелектом',
              url: 'https://myhungrybot.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://myhungrybot.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Hungry Bot',
                url: 'https://myhungrybot.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://myhungrybot.com/images/logo.png',
                },
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
