import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/emails/lib/email-service';
import WelcomeEmail from '@/emails/welcome-email';
import { storeJson } from '@/emails/lib/json-storage';

export async function POST(request: NextRequest) {
  try {
    const { to, userName, userEmail, jsonData } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Email destinatario requerido' }, { status: 400 });
    }

    let jsonId: string | undefined = undefined;
    if (jsonData) {
      jsonId = storeJson(jsonData);
    }

    // Get base URL dynamically from request headers
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    await sendEmail(
      to,
      'Requested quota from Web App',
      WelcomeEmail({ userName, userEmail: to, jsonId, baseUrl })
    );

    return NextResponse.json({ message: 'Email enviado exitosamente' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al enviar email' }, { status: 500 });
  }
}
