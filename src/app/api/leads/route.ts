import logger from "@/lib/logger"
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const leadBodySchema = z.object({
  email:  z.string().email().max(254),
  source: z.string().max(100).optional(),
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limit — 5 submissions per IP per hour
const leadRateLimit = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const now = Date.now()
    const window = 60 * 60 * 1000 // 1 hour
    const entry = leadRateLimit.get(ip)
    if (entry && now < entry.resetAt) {
      if (entry.count >= 5) {
        return NextResponse.json({ ok: true }) // silent — don't reveal limit to scrapers
      }
      entry.count++
    } else {
      leadRateLimit.set(ip, { count: 1, resetAt: now + window })
    }

    const parsed = leadBodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    const { email, source } = parsed.data

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if already subscribed before upsert
    const { data: existing } = await supabase
      .from('leads')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    const isNew = !existing

    // Upsert into leads table (create if not exists)
    const { error } = await supabase
      .from('leads')
      .upsert(
        { email: email.toLowerCase().trim(), source: source || 'quiz', created_at: new Date().toISOString() },
        { onConflict: 'email', ignoreDuplicates: true }
      )

    if (error) {
      logger.error('Lead save error:', error)
      // Don't fail the request — email capture should be best-effort
    }

    // Notify Admin via Resend (only for new subscribers)
    const adminEmail = process.env.ADMIN_EMAIL
    if (isNew && adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: adminEmail,
          subject: 'Nueva suscripción Food·Mood',
          text: `Nueva suscripción de: ${email}\nOrigen: ${source || 'quiz'}`,
        })
      } catch (emailError) {
        logger.error('Admin notification error:', emailError)
      }
    }

    // Welcome email — send to ALL new subscribers regardless of source
    if (isNew && process.env.RESEND_API_KEY) {
      const recipeEmailHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#E8E2D8;font-family:Georgia,serif;">
<div style="max-width:600px;margin:32px auto;background:#F5F0E8;">

  <div style="background:#2C1810;padding:22px 40px;display:flex;align-items:center;justify-content:space-between;">
    <span style="font-size:18px;font-weight:300;color:#F5F0E8;letter-spacing:3px;text-transform:uppercase;">Food<span style="color:#C9A84C;">·</span>Mood</span>
    <span style="font-family:sans-serif;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;">Tu receta gratis</span>
  </div>

  <div style="background:#6B2737;padding:44px 40px;">
    <p style="font-family:sans-serif;font-size:9px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 16px;">Anti-ansiedad · 20 min · fácil</p>
    <h1 style="font-size:34px;font-weight:300;line-height:1.15;color:#F5F0E8;margin:0 0 20px;">Curry suave de garbanzos<br/>con espinacas y cúrcuma</h1>
    <p style="font-family:sans-serif;font-size:14px;font-weight:300;line-height:1.8;color:rgba(245,240,232,0.7);border-left:2px solid #C9A84C;padding-left:16px;margin:0;">Para cuando crees que el problema es enorme. Antes de decidir nada, prepara esto. Cinco minutos activos. Luego decides.</p>
  </div>

  <div style="padding:32px 40px;background:#F0EBE2;border-bottom:1px solid rgba(107,39,55,0.1);">
    <p style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin:0 0 8px;">La ciencia detrás</p>
    <h4 style="font-size:20px;font-weight:400;color:#6B2737;margin:0 0 12px;">¿Por qué funciona?</h4>
    <p style="font-family:sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#3A2A1E;margin:0 0 14px;">Los garbanzos son una de las fuentes vegetales más ricas en <strong style="color:#6B2737;">triptófano</strong>, el aminoácido precursor de la serotonina. La <strong style="color:#6B2737;">curcumina</strong> de la cúrcuma inhibe la enzima IDO — la misma que el estrés crónico activa para desviar el triptófano hacia la quinurenina. Combinarlos no es casualidad: es bioquímica aplicada al plato.</p>
    <span style="font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:#C9A84C;">Triptófano · Curcumina · Quinurenina</span>
  </div>

  <div style="padding:32px 40px;border-bottom:1px solid rgba(107,39,55,0.1);">
    <p style="font-family:sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#8B7355;margin:0 0 16px;">Lista de compra</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr style="border-bottom:1px solid rgba(107,39,55,0.08);"><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>400 g de garbanzos cocidos (bote o remojados)</td></tr>
      <tr style="border-bottom:1px solid rgba(107,39,55,0.08);"><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>100 g de espinacas frescas o baby</td></tr>
      <tr style="border-bottom:1px solid rgba(107,39,55,0.08);"><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>1 lata de leche de coco (400 ml)</td></tr>
      <tr style="border-bottom:1px solid rgba(107,39,55,0.08);"><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>1 cebolla · 3 dientes de ajo · jengibre fresco</td></tr>
      <tr style="border-bottom:1px solid rgba(107,39,55,0.08);"><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>1 cdta de cúrcuma · 1 cdta de comino · pimienta negra</td></tr>
      <tr><td style="padding:8px 0;font-family:sans-serif;font-size:14px;font-weight:300;color:#3A2A1E;"><span style="color:#4A7B6B;margin-right:10px;">·</span>Aceite de oliva · sal · arroz integral para acompañar</td></tr>
    </table>
  </div>

  <div style="padding:36px 40px;text-align:center;">
    <p style="font-size:22px;font-weight:300;font-style:italic;color:#6B2737;margin:0 0 10px;">¿Te ha gustado este estilo?</p>
    <p style="font-family:sans-serif;font-size:14px;font-weight:300;line-height:1.75;color:#3A2A1E;margin:0 0 24px;max-width:440px;margin-left:auto;margin-right:auto;">Slow Food·Mood — 21 días de recetas como esta, con audios de contexto científico y tracking emocional diario.</p>
    <a href="https://food-mood.app/retos/slow-food-mood" style="display:inline-block;background:#6B2737;color:#F5F0E8;text-decoration:none;font-family:sans-serif;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;padding:14px 32px;margin-bottom:20px;">Ver el reto — 29€ pago único</a>
    <p style="font-family:sans-serif;font-size:12px;font-weight:300;color:#8B7355;margin:0;">O empieza con el test gratuito en <a href="https://food-mood.app" style="color:#6B2737;">food-mood.app</a></p>
  </div>

  <div style="background:#2C1810;padding:18px 40px;text-align:center;">
    <p style="font-size:14px;font-weight:300;color:#F5F0E8;letter-spacing:3px;text-transform:uppercase;margin:0 0 3px;">Food<span style="color:#C9A84C;">·</span>Mood</p>
    <p style="font-family:sans-serif;font-size:10px;color:rgba(245,240,232,0.25);margin:0;letter-spacing:1px;">food-mood.app · © 2026</p>
  </div>

</div>
</body>
</html>`

      try {
        await resend.emails.send({
          from: 'Food·Mood <hola@food-mood.app>',
          to: email,
          subject: 'Tu receta de tranquilidad — Food·Mood',
          html: recipeEmailHtml,
        })
      } catch (emailError) {
        logger.error('Welcome recipe email error:', emailError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // Never block the user
  }
}
