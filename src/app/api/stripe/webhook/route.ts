import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createInviteLink, removeMember, isTelegramConfigured } from '@/lib/telegram'
import { EDITORIAL_NEWSLETTERS } from '@/lib/editorial-newsletters'

/**
 * POST /api/stripe/webhook
 * Receives Stripe events and updates user profile in Supabase.
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (!sig || !webhookSecret || webhookSecret === 'whsec_pendiente') {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ CRITICAL: Stripe webhook secret is missing or pending in PRODUCTION. Rejecting request.')
        return NextResponse.json({ error: `Signature Verification Failed (Production Security Enforced)` }, { status: 400 })
      }
      console.warn('⚠️ Stripe webhook secret is missing or pending. Bypassing signature verification (TEST MODE ONLY).')
      event = JSON.parse(body)
    } else {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
      } catch (err: any) {
        console.error(`❌ Webhook Signature Verification Failed: ${err.message}`)
        return NextResponse.json({ error: `Signature Verification Failed` }, { status: 400 })
      }
    }
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Initialize Supabase Admin
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY
  if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not configured')
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object

      // ── Reto (one-time payment) ───────────────────────────────────────────
      if (session.metadata?.type === 'challenge') {
        const { user_id, challenge_id, challenge_slug } = session.metadata
        if (user_id && challenge_id) {
          const [{ data: fmData }, { data: challengeData }] = await Promise.all([
            supabaseAdmin
              .from('fm_index_log')
              .select('index_value')
              .eq('user_id', user_id)
              .order('log_date', { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabaseAdmin
              .from('challenges')
              .select('title, duration_days, price_eur')
              .eq('id', challenge_id)
              .single(),
          ])

          // Registrar compra en reto_purchases
          await supabaseAdmin
            .from('reto_purchases')
            .upsert({
              user_id,
              challenge_id,
              stripe_session_id:     session.id,
              stripe_payment_intent: session.payment_intent as string,
              amount_eur:            (session.amount_total ?? 0) / 100,
              status:                'active',
              purchased_at:          new Date().toISOString(),
            }, { onConflict: 'stripe_session_id' })

          // Marcar user_challenges como pagado
          await supabaseAdmin
            .from('user_challenges')
            .upsert({
              user_id,
              challenge_id,
              paid:              true,
              stripe_session_id: session.id,
              fm_index_start:    (fmData as any)?.index_value ?? null,
              current_day:       1,
              completed:         false,
              start_date:        new Date().toISOString().split('T')[0],
            }, { onConflict: 'user_id,challenge_id' })

          // Email de confirmación del reto
          const retoEmail = session.customer_details?.email || session.customer_email
          if (retoEmail && process.env.RESEND_API_KEY && challengeData) {
            try {
              const resend = new Resend(process.env.RESEND_API_KEY)
              const retoUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.food-mood.app'}/retos/${challenge_slug ?? challenge_id}`
              await resend.emails.send({
                from:    `Food·Mood <${process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'}>`,
                to:      retoEmail,
                subject: `Tu reto "${challengeData.title}" ha comenzado — Food·Mood`,
                html: `
                  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2d0f16;padding:32px 24px">
                    <h1 style="font-size:26px;font-weight:400;margin-bottom:8px;line-height:1.2">
                      ¡Tu reto ha comenzado! 🎯
                    </h1>
                    <p style="font-size:15px;line-height:1.7;color:#6b4452;margin-bottom:24px">
                      Has accedido a <strong>${challengeData.title}</strong> — ${challengeData.duration_days} días de nutrición emocional basada en el eje intestino-cerebro.
                    </p>
                    <p style="margin-bottom:28px">
                      <a href="${retoUrl}/dia/1"
                         style="display:inline-block;background:#6B2737;color:#F5F0E8;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600">
                        Ir al Día 1 →
                      </a>
                    </p>
                    <p style="font-size:13px;color:#b08090;line-height:1.6">
                      Accede en cualquier momento desde <a href="${retoUrl}" style="color:#6B2737">${retoUrl}</a>.<br>
                      Si tienes cualquier duda, responde a este correo.
                    </p>
                  </div>
                `,
              })
              console.log(`✅ Reto confirmation email sent to ${retoEmail}`)
            } catch (emailErr: any) {
              console.error(`⚠️ Reto email failed (non-blocking): ${emailErr.message}`)
            }
          }

          console.log(`✅ Reto pagado: user=${user_id} challenge=${challenge_id}`)
        }
        break
      }

      // ── Subscripción (existing flow) ──────────────────────────────────────
      let userId = session.metadata?.supabase_user_id || session.client_reference_id
      const customerEmail = session.customer_details?.email || session.customer_email

      // Fallback: Si no hay userId en los metadatos, buscamos el usuario por su email del checkout
      if (!userId && customerEmail) {
        console.log(`Buscando usuario en Supabase por email de checkout: ${customerEmail}`);
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        
        let match = null;
        if (!authError && authData?.users) {
          match = authData.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());
        }

        if (match) {
          userId = match.id;
          console.log(`✅ Usuario encontrado vía email: ${userId}`);
        } else {
          console.log(`⚠️ Usuario no encontrado. Creando cuenta shadow (auto-provision) para: ${customerEmail}`);
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
          });

          if (newUser?.user) {
            userId = newUser.user.id;
            console.log(`✅ Cuenta autogenerada con éxito: ${userId}`);
          } else {
            console.error(`❌ Falló la autogeneración de cuenta:`, createError?.message);
          }
        }
      }

      if (userId) {
        console.log(`🔔 Payment successful for user: ${userId} (${customerEmail || 'No email provided'})`)

        const { error } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            is_premium: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })

        if (error) {
          console.error(`❌ Error updating profile for user ${userId}:`, error.message)
        } else {
          console.log(`✅ Profile updated (upsert): User ${userId} is now PREMIUM.`)
        }

        // ── Emails de bienvenida ──────────────────────────────────────────
        if (customerEmail && process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY)
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.food-mood.app'

            // Receta de bienvenida — query a Supabase
            const { data: receta } = await supabaseAdmin
              .from('recetas')
              .select('id, nombre_es, ingredientes_es, preparacion_es, nota_food_mood_es, tiempo_preparacion_min, mood_es')
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()

            const recetaUrl   = receta ? `${appUrl}/recetas/${receta.id}` : `${appUrl}/recetas`
            const nombreReceta = receta?.nombre_es ?? 'Tu primera receta de regalo'
            const ingredientes = (receta?.ingredientes_es ?? []).slice(0, 6) as string[]
            const pasos        = (receta?.preparacion_es ?? []).slice(0, 3) as string[]
            const notaFM       = receta?.nota_food_mood_es ?? ''
            const tiempoMin    = receta?.tiempo_preparacion_min ?? null

            // Email 1 — Bienvenida con receta
            await resend.emails.send({
              from:    `Food·Mood <${process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'}>`,
              to:      customerEmail,
              subject: 'Bienvenida a Food·Mood ✨ — tu primera receta de regalo',
              html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bienvenida a Food·Mood</title>
</head>
<body style="margin:0;padding:0;background:#EDE8DF;font-family:Georgia,serif;color:#2d0f16">
<div style="max-width:600px;margin:0 auto;background:#F5F0E8">

  <!-- Header -->
  <div style="background:#2d0f16;padding:44px 40px 36px">
    <p style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#C9A84C;margin:0 0 10px">Food·Mood</p>
    <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:400;color:#F5F0E8;line-height:1.2;margin:0 0 12px">
      Bienvenida. <em style="color:#C9A84C;font-style:italic">Ya eres parte de esto.</em>
    </h1>
    <p style="font-size:13px;font-weight:300;color:rgba(245,240,232,0.5);margin:0;letter-spacing:.04em">
      Nutrición emocional · Eje intestino-cerebro
    </p>
  </div>

  <!-- Intro -->
  <div style="padding:36px 40px 28px;border-bottom:1px solid #e0d5c8">
    <p style="font-size:15px;line-height:1.80;color:#4a3a3e;font-weight:300;margin:0 0 16px">
      Hemos reservado un espacio para ti en Food·Mood. A partir de ahora tienes acceso completo a todas las recetas funcionales, los retos de transformación, el glosario científico y tu índice Food·Mood personalizado.
    </p>
    <p style="font-size:15px;line-height:1.80;color:#4a3a3e;font-weight:300;margin:0">
      Para empezar, te dejamos aquí debajo la receta que te prometimos. Guárdala, hazla esta semana.
    </p>
  </div>

  <!-- Receta -->
  <div style="padding:36px 40px;border-bottom:1px solid #e0d5c8">
    <p style="font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#9e8080;margin:0 0 14px">
      Tu receta de bienvenida
    </p>
    <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#2d0f16;margin:0 0 6px;line-height:1.25">
      ${nombreReceta}
    </h2>
    ${tiempoMin ? `<p style="font-size:12px;color:#b08090;margin:0 0 20px">⏱ ${tiempoMin} min</p>` : '<div style="margin-bottom:20px"></div>'}

    ${ingredientes.length > 0 ? `
    <p style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#C9A84C;margin:0 0 10px">Ingredientes</p>
    <ul style="margin:0 0 20px;padding:0;list-style:none">
      ${ingredientes.map((ing: string) => `<li style="font-size:14px;font-weight:300;color:#4a3a3e;line-height:1.7;padding:2px 0">· ${ing}</li>`).join('')}
    </ul>` : ''}

    ${pasos.length > 0 ? `
    <p style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#C9A84C;margin:0 0 10px">Preparación</p>
    <ol style="margin:0 0 20px;padding:0;list-style:none">
      ${pasos.map((paso: string, i: number) => `<li style="font-size:14px;font-weight:300;color:#4a3a3e;line-height:1.7;padding:3px 0"><strong style="color:#6B2737">${i + 1}.</strong> ${paso}</li>`).join('')}
    </ol>` : ''}

    ${notaFM ? `
    <div style="background:#2d0f16;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <p style="font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#C9A84C;margin:0 0 8px">Por qué funciona</p>
      <p style="font-size:13px;font-weight:300;color:rgba(245,240,232,0.8);line-height:1.75;margin:0">${notaFM}</p>
    </div>` : ''}

    <a href="${recetaUrl}" style="display:inline-block;background:#C9A84C;color:#2d0f16;padding:13px 28px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.03em">
      Ver receta completa →
    </a>
  </div>

  <!-- CTAs -->
  <div style="padding:32px 40px;border-bottom:1px solid #e0d5c8">
    <p style="font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#9e8080;margin:0 0 16px">
      Empieza por donde más lo necesites
    </p>
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding-right:8px;padding-bottom:8px">
          <a href="${appUrl}/dashboard" style="display:block;background:#6B2737;color:#F5F0E8;padding:12px 16px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;text-align:center">
            Mi dashboard →
          </a>
        </td>
        <td style="padding-left:8px;padding-bottom:8px">
          <a href="${appUrl}/recetas" style="display:block;background:transparent;color:#6B2737;padding:11px 16px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;text-align:center;border:1px solid #6B2737">
            Todas las recetas →
          </a>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <a href="${appUrl}/retos" style="display:block;background:transparent;color:#6B2737;padding:11px 16px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600;text-align:center;border:1px solid rgba(107,39,55,0.3)">
            Explorar retos →
          </a>
        </td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="padding:28px 40px">
    <p style="font-size:13px;font-weight:300;color:#b08090;line-height:1.7;margin:0 0 6px">
      En un momento te llega un segundo correo con nuestra última newsletter de regalo.
    </p>
    <p style="font-size:12px;color:#c4a8b0;margin:0">
      ¿Alguna pregunta? Responde directamente a este correo.
    </p>
  </div>

</div>
</body>
</html>`,
            })

            // Email 2 — Última newsletter de regalo
            const latest = EDITORIAL_NEWSLETTERS[EDITORIAL_NEWSLETTERS.length - 1]
            await resend.emails.send({
              from:    `Food·Mood <${process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'}>`,
              to:      customerEmail,
              subject: `🎁 De regalo: Newsletter #${latest.numero} — ${latest.subject}`,
              html:    latest.buildHtml(),
            })

            console.log(`✅ Welcome + newsletter emails sent to ${customerEmail}`)
          } catch (emailErr: any) {
            console.error(`⚠️ Welcome email failed (non-blocking): ${emailErr.message}`)
          }
        }

        // ── Telegram: generate one-time invite link ────────────────────────
        if (isTelegramConfigured() && customerEmail && session.metadata?.type !== 'challenge' && process.env.RESEND_API_KEY) {
          try {
            const inviteLink = await createInviteLink(`premium-${userId.slice(0, 8)}`)
            await supabaseAdmin
              .from('profiles')
              .update({ telegram_invite_url: inviteLink, telegram_invite_sent_at: new Date().toISOString() })
              .eq('id', userId)

            const resend = new Resend(process.env.RESEND_API_KEY)
            await resend.emails.send({
              from:    `Food·Mood <${process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app'}>`,
              to:      customerEmail,
              subject: 'Tu acceso al canal privado de Telegram — Food·Mood',
              html: `
                <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2d0f16">
                  <h1 style="font-size:24px;font-weight:400;margin-bottom:8px">Bienvenida al canal privado ✨</h1>
                  <p style="font-size:15px;line-height:1.6;color:#6b4452">
                    Como miembro premium de Food·Mood tienes acceso exclusivo a nuestro canal privado de Telegram,
                    donde compartimos contenido científico, novedades y recomendaciones antes que nadie.
                  </p>
                  <p style="margin:28px 0">
                    <a href="${inviteLink}"
                       style="display:inline-block;background:#6B2737;color:#F5F0E8;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600">
                      Unirme al canal →
                    </a>
                  </p>
                  <p style="font-size:12px;color:#b08090;line-height:1.5">
                    Este enlace es de uso único y personal. Si tienes problemas, responde a este correo.
                  </p>
                </div>
              `,
            })
            console.log(`✅ Telegram invite sent to ${customerEmail}`)
          } catch (tgErr: any) {
            console.error(`⚠️ Telegram invite failed (non-blocking): ${tgErr.message}`)
          }
        }
      } else {
        console.warn(`⚠️ Pago recibido (Email: ${customerEmail}) pero NO se encontró un usuario existente en Supabase.`)
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const status = subscription.status
      const customerId = subscription.customer as string
      
      // Get user by Stripe Customer ID if stored, or by email
      const customer = await stripe.customers.retrieve(customerId)
      const email = (customer as any).email

      if (email) {
        const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
        const user = authData?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

        if (user) {
          const isPremium = ['active', 'trialing'].includes(status)
          console.log(`🔄 Subscription ${event.type} for ${email}: status=${status} -> is_premium=${isPremium}`)
          
          await supabaseAdmin
            .from('profiles')
            .upsert({ 
              id: user.id, 
              is_premium: isPremium,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer as string
      
      const customer = await stripe.customers.retrieve(customerId)
      const email = (customer as any).email

      if (email) {
        const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
        const user = authData?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

        if (user) {
          console.log(`🚫 Subscription deleted for ${email}: is_premium=false`)
          await supabaseAdmin
            .from('profiles')
            .upsert({
              id: user.id,
              is_premium: false,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })

          // ── Telegram: kick from group ─────────────────────────────────
          if (isTelegramConfigured()) {
            try {
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('telegram_user_id, telegram_joined')
                .eq('id', user.id)
                .maybeSingle()

              if (profile?.telegram_user_id && profile.telegram_joined) {
                await removeMember(Number(profile.telegram_user_id))
                await supabaseAdmin
                  .from('profiles')
                  .update({ telegram_joined: false, telegram_user_id: null, telegram_invite_url: null })
                  .eq('id', user.id)
                console.log(`✅ Removed from Telegram: user=${user.id}`)
              }
            } catch (tgErr: any) {
              console.error(`⚠️ Telegram kick failed (non-blocking): ${tgErr.message}`)
            }
          }
        }
      }
      break
    }

    default:
      console.log(`🟡 Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
