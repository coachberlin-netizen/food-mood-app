import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { NEWSLETTER_NO_DRAMATICA_HTML } from '@/emails/templates/no-dramatica'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { to } = await req.json()
  if (!to) return NextResponse.json({ error: 'Falta el campo "to"' }, { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from:    'Food·Mood <onboarding@resend.dev>',
    to,
    subject: 'No eres dramática. Eres una mezcla que cambia cada día. 🌿',
    html:    NEWSLETTER_NO_DRAMATICA_HTML,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, id: data?.id })
}
