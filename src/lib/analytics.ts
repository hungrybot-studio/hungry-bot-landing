import { env } from './env';

export type AnalyticsEvent = 
  | 'cta_click'
  | 'form_open'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'audio_play'
  | 'faq_voice_play';

export type AnalyticsProps = Record<string, string | number | boolean>;

// GA4 Analytics
function trackGA4Event(eventName: string, properties?: AnalyticsProps): void {
  if (typeof window === 'undefined' || env.NEXT_PUBLIC_ANALYTICS_PROVIDER !== 'ga4') {
    return;
  }

  try {
    // @ts-ignore - gtag is loaded via script
    if (window.gtag) {
      // @ts-ignore
      window.gtag('event', eventName, {
        event_category: 'Hungry Bot Landing',
        ...properties,
      });
    }
  } catch (error) {
    console.warn('GA4 tracking error:', error);
  }
}

// Plausible Analytics
function trackPlausibleEvent(eventName: string, properties?: AnalyticsProps): void {
  if (typeof window === 'undefined' || env.NEXT_PUBLIC_ANALYTICS_PROVIDER !== 'plausible') {
    return;
  }

  try {
    // @ts-ignore - plausible is loaded via script
    if (window.plausible) {
      // @ts-ignore
      window.plausible(eventName, { props: properties });
    }
  } catch (error) {
    console.warn('Plausible tracking error:', error);
  }
}

// Main tracking function
export function trackEvent(eventName: AnalyticsEvent, properties?: AnalyticsProps): void {
  if (env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'ga4') {
    trackGA4Event(eventName, properties);
  } else if (env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'plausible') {
    trackPlausibleEvent(eventName, properties);
  }
}

// Specific event tracking functions
export function trackCTAClick(buttonText: string, location: string): void {
  trackEvent('cta_click', {
    button_text: buttonText,
    location,
  });
}

export function trackFormOpen(): void {
  trackEvent('form_open');
}

export function trackFormSubmit(success: boolean, error?: string): void {
  trackEvent(success ? 'form_submit_success' : 'form_submit_error', {
    error: error || '',
  });
}

export function trackAudioPlay(audioFile: string): void {
  trackEvent('audio_play', {
    audio_file: audioFile,
  });
}

export function trackFAQVoicePlay(question: string): void {
  trackEvent('faq_voice_play', {
    question,
  });
}

// Page view tracking
export function trackPageView(url: string): void {
  if (env.NEXT_PUBLIC_ANALYTICS_PROVIDER === 'ga4') {
    trackGA4Event('page_view', { page_location: url });
  }
}
