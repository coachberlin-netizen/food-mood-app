import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey   = process.env.RESEND_API_KEY
  const fromAddr = process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'
  const toAddr   = process.env.ADMIN_EMAIL

  const diagnostics: Record<string, string | boolean> = {
    RESEND_API_KEY_set:   !!apiKey,
    RESEND_FROM_EMAIL:    fromAddr,
    ADMIN_EMAIL:          toAddr ?? '(not set)',
    newsletter_count:     String(EDITORIAL_NEWSLETTERS.length),
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured', diagnostics }, { status: 400 })
  }
  if (!toAddr) {
    return NextResponse.json({ error: 'ADMIN_EMAIL not configured', diagnostics }, { status: 400 })
  }

  const resend = new Resend(apiKey)
  const from   = `Food-Mood <${fromAddr}>`
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.food-mood.app'

  // Email 1: welcome
  let email1Result: Record<string, unknown> = {}
  try {
    const { data, error } = await resend.emails.send({
      from,
      to:      toAddr,
      subject: '[TEST] Bienvenida a Food-Mood — tu acceso premium ya esta activo',
      html: [
        '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">',
        '<title>Test Bienvenida Food-Mood</title></head>',
        '<body style="margin:0;padding:0;background:#EDE8DF;font-family:Georgia,serif;color:#2d0f16">',
        '<div style="max-width:600px;margin:0 auto;background:#F5F0E8">',
        '<div style="background:#2d0f16;padding:44px 40px 36px">',
        '<p style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A84C;margin:0 0 10px">Food-Mood</p>',
        '<h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F5F0E8;line-height:1.2;margin:0 0 12px">',
        'TEST — Bienvenida. Ya eres parte de esto.</h1>',
        '<p style="font-size:13px;font-weight:300;color:rgba(245,240,232,0.5);margin:0">',
        'Nutricion emocional - Eje intestino-cerebro</p></div>',
        '<div style="padding:36px 40px 28px;border-bottom:1px solid #e0d5c8">',
        '<p style="font-size:15px;line-height:1.80;color:#4a3a3e;font-weight:300;margin:0 0 24px">',
        'Este es un TEST del email de bienvenida. Si lo ves, el email 1 funciona.</p>',
        '<a href="' + appUrl + '/recetas" style="display:inline-block;background:#C9A84C;color:#2d0f16;',
        'padding:13px 28px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700">',
        'Ver todas las recetas</a></div>',
        '</div></body></html>',
      ].join(''),
    })
    email1Result = { data, error: error ? JSON.stringify(error) : null }
  } catch (e: any) {
    email1Result = { exception: e?.message }
  }

  // Email 2: latest newsletter
  let email2Result: Record<string, unknown> = {}
  try {
    const latest = EDITORIAL_NEWSLETTERS[EDITORIAL_NEWSLETTERS.length - 1]
    const nlHtml = latest.buildHtml()
    const { data, error } = await resend.emails.send({
      from,
      to:      toAddr,
      subject: '[TEST] Tu newsletter de regalo — Food-Mood #' + latest.numero,
      html:    nlHtml,
    })
    email2Result = {
      newsletter_numero: latest.numero,
      html_length:       nlHtml.length,
      data,
      error: error ? JSON.stringify(error) : null,
    }
  } catch (e: any) {
    email2Result = { exception: e?.message }
  }

  return NextResponse.json({ diagnostics, email1Result, email2Result })
}
