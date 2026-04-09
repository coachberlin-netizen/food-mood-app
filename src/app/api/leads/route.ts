import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upsert into leads table (create if not exists)
    const { error } = await supabase
      .from('leads')
      .upsert(
        { email: email.toLowerCase().trim(), source: source || 'quiz', created_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Lead save error:', error)
      // Don't fail the request — email capture should be best-effort
    }

    // Notify Admin via Resend
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: adminEmail,
          subject: 'Nueva suscripción Food·Mood',
          text: `Nueva suscripción de: ${email}\nOrigen: ${source || 'quiz'}`,
        })
      } catch (emailError) {
        console.error('Admin notification error:', emailError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Never block the user
  }
}
