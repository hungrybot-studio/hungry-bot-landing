import { UTMData } from '@/types/lead';

const UTM_STORAGE_KEY = 'hungrybot_utm_data';

export function parseUTMParams(): UTMData {
  if (typeof window === 'undefined') {
    return { landing_variant: 'A' };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer || '';
  
  const utmData: UTMData = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    referrer: referrer || undefined,
    landing_variant: urlParams.get('v') || 'A',
  };

  // Store in localStorage
  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
  } catch (error) {
    console.warn('Failed to store UTM data:', error);
  }

  return utmData;
}

export function getStoredUTMData(): UTMData {
  if (typeof window === 'undefined') {
    return { landing_variant: 'A' };
  }

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to retrieve UTM data:', error);
  }

  return { landing_variant: 'A' };
}

export function clearUTMData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear UTM data:', error);
  }
}
