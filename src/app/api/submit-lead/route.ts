import { NextRequest, NextResponse } from 'next/server';
import { leadPayloadSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    // Отримуємо дані з запиту
    const body = await request.json();
    
    // Валідуємо дані
    const validatedData = leadPayloadSchema.parse(body);
    
    // URL Google Apps Script
    const webhookUrl = process.env.NEXT_PUBLIC_LEADS_WEBHOOK;
    
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    // Відправляємо дані до Google Apps Script
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      console.error('Google Apps Script error:', response.status, response.statusText);
      return NextResponse.json(
        { success: false, error: `Google Apps Script error: ${response.status}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    // Повертаємо результат
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('API route error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
