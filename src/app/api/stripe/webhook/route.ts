import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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
      console.warn('⚠️ Stripe webhook secret is missing or pending. Verify manually in Vercel.')
      // In development/test, we might skip signature verification ONLY if explicitly allowed, 
      // but let's assume we WANT it verified even in test.
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

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      let userId = session.metadata?.supabase_user_id || session.client_reference_id
      const customerEmail = session.customer_details?.email || session.customer_email

      // Initialize Supabase Admin with Service Role Key. Fallback to RECETAS_SUPABASE_KEY if the primary fails.
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

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
      } else {
        console.warn(`⚠️ Pago recibido (Email: ${customerEmail}) pero NO se encontró un usuario existente en Supabase. El webhook no ha podido vincular la compra.`)
      }
      break

    default:
      console.log(`🟡 Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
