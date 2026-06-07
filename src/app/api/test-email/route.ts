import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey   = process.env.RESEND_API_KEY
  const fromAddr = process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'
  const queryTo  = req.nextUrl.searchParams.get('to')
  const toAddr   = queryTo || process.env.ADMIN_EMAIL

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 400 })
  }
  if (!toAddr) {
    return NextResponse.json({ error: 'Indica el destino: ?to=email@ejemplo.com' }, { status: 400 })
  }

  const resend = new Resend(apiKey)
  const from   = `Food-Mood <${fromAddr}>`
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.food-mood.app'

  // Email 1: bienvenida
  let email1Result: Record<string, unknown> = {}
  try {
    const { data, error } = await resend.emails.send({
      from,
      to:      toAddr,
      subject: 'Tu acceso premium ya está activo — Food·Mood',
      html: [
        '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">',
        '<title>Tu acceso premium en Food·Mood</title></head>',
        '<body style="margin:0;padding:0;background:#EDE8DF;font-family:Georgia,serif;color:#2d0f16">',
        '<div style="max-width:600px;margin:0 auto;background:#F5F0E8">',
        '<div style="background:#2d0f16;padding:44px 40px 36px">',
        '<p style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#FF6B35;margin:0 0 10px">Food-Mood</p>',
        '<h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F5F0E8;line-height:1.2;margin:0 0 12px">',
        'Ya eres parte de esto.</h1>',
        '<p style="font-size:13px;font-weight:300;color:rgba(245,240,232,0.5);margin:0">',
        'Nutricion emocional - Eje intestino-cerebro</p></div>',
        '<div style="padding:36px 40px 28px;border-bottom:1px solid #e0d5c8">',
        '<p style="font-size:15px;line-height:1.80;color:#4a3a3e;font-weight:300;margin:0 0 16px">',
        'Tienes acceso completo a todas las recetas funcionales, los retos de transformacion,',
        ' el glosario cientifico y tu indice Food-Mood personalizado.</p>',
        '<p style="font-size:15px;line-height:1.80;color:#4a3a3e;font-weight:300;margin:0 0 24px">',
        'En un momento te llegara un segundo correo con nuestra ultima newsletter de regalo.</p>',
        '<a href="' + appUrl + '/recetas" style="display:inline-block;background:#FF6B35;color:#2d0f16;',
        'padding:13px 28px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700">',
        'Ver todas las recetas</a></div>',
        '<div style="padding:32px 40px;border-bottom:1px solid #e0d5c8">',
        '<a href="' + appUrl + '/dashboard" style="display:block;background:#6B2737;color:#F5F0E8;',
        'padding:12px 16px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;text-align:center">',
        'Mi dashboard</a></div>',
        '<div style="padding:28px 40px">',
        '<p style="font-size:12px;color:#b08090;margin:0">',
        'Alguna pregunta? Responde directamente a este correo.</p></div>',
        '</div></body></html>',
      ].join(''),
    })
    email1Result = { to: toAddr, data, error: error ? JSON.stringify(error) : null }
  } catch (e: any) {
    email1Result = { exception: e?.message }
  }

  // Email 2: newsletter #19
  let email2Result: Record<string, unknown> = {}
  try {
    const latest = EDITORIAL_NEWSLETTERS[EDITORIAL_NEWSLETTERS.length - 1]
    const nlHtml = latest.buildHtml()
    const { data, error } = await resend.emails.send({
      from,
      to:      toAddr,
      subject: 'Tu newsletter de regalo — Food-Mood #' + latest.numero,
      html:    nlHtml,
    })
    email2Result = {
      to: toAddr,
      newsletter_numero: latest.numero,
      data,
      error: error ? JSON.stringify(error) : null,
    }
  } catch (e: any) {
    email2Result = { exception: e?.message }
  }

  return NextResponse.json({ to: toAddr, email1Result, email2Result })
}
