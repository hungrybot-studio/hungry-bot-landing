import { env } from './env';
import { LeadPayload } from '@/types/lead';
import { leadPayloadSchema } from './validators';

export async function submitLeadForm(data: LeadPayload): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📨 submitLeadForm отримав дані:', data);
    
    // Validate data
    const validatedData = leadPayloadSchema.parse(data);
    console.log('✅ Дані валідовано:', validatedData);
    
    console.log('🌐 Відправляємо через локальний API роут');

    // Send data through our local API route (bypasses CORS)
    const response = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      console.error('❌ HTTP помилка:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('📥 Отримано відповідь від API роута:', result);
    
    if (result.success) {
      return { success: true };
    } else {
      throw new Error(result.error || 'Server returned error');
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
