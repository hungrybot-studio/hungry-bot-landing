import { env } from './env';
import { LeadPayload } from '@/types/lead';
import { leadPayloadSchema } from './validators';

export async function submitLeadForm(data: LeadPayload): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate data
    const validatedData = leadPayloadSchema.parse(data);
    
    // Check if webhook is configured
    if (!env.NEXT_PUBLIC_LEADS_WEBHOOK) {
      throw new Error('Webhook URL not configured');
    }

    // Send data to Google Apps Script
    const response = await fetch(env.NEXT_PUBLIC_LEADS_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.ok) {
      return { success: true };
    } else {
      throw new Error('Server returned error');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Невідома помилка' };
  }
}

export function formatFormData(formData: FormData): Record<string, string> {
  const data: Record<string, string> = {};
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      data[key] = value;
    }
  }
  
  return data;
}
