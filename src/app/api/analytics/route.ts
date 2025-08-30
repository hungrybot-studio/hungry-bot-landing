import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties, timestamp } = body;

    // Validate required fields
    if (!event || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: event, timestamp' },
        { status: 400 }
      );
    }

    // Log analytics event (in production, you might want to send this to a service like LogRocket, DataDog, etc.)
    console.log('Analytics Event:', {
      event,
      properties: properties || {},
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.ip,
      referer: request.headers.get('referer'),
    });

    // Here you could also:
    // - Send to external analytics service
    // - Store in database
    // - Trigger webhooks
    // - Send to Slack/Discord for monitoring

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Analytics endpoint - use POST to track events' },
    { status: 200 }
  );
}
