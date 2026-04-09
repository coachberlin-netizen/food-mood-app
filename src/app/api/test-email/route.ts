import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'replace_me_with_real_key') {
    return NextResponse.json({ error: 'RESEND_API_KEY no configurada' }, { status: 400 })
  }

  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail || 'test@example.com',
      subject: 'Test de notificación Food·Mood',
      text: 'Si recibes esto, la integración con Resend funciona correctamente.',
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
