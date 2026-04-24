import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/admin-config'
import { getPremiumStatus } from '@/lib/premium'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for subscription.
 * Body: { priceId: string, planType: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { priceId, planType } = await req.json()

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing from environment variables.')
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY_NOT_CONFIGURED. Please check Vercel/Env settings.' },
        { status: 500 }
      )
    }

    if (!priceId) {
      console.error('❌ Received checkout request without priceId.')
      return NextResponse.json(
        { error: 'Missing priceId. Ensure NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY/QUARTERLY is set.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const host = req.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

    // Admin / beta / influencer bypass — activate premium directly without Stripe
    if (user) {
      const hasFreeAccess = isUserAdmin(user) || await getPremiumStatus(supabase, user.id)
      if (hasFreeAccess) {
        await supabase
          .from('profiles')
          .upsert({ id: user.id, is_premium: true, premium_level: 1, updated_at: new Date().toISOString() }, { onConflict: 'id' })
        return NextResponse.json({ url: `${baseUrl}/dashboard` })
      }
    }

    // Build session params — works for both authenticated and guest users
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/auth/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        plan_type: planType || 'monthly',
        ...(user ? { supabase_user_id: user.id } : {}),
      },
      subscription_data: {
        ...(planType === 'quarterly' ? { trial_period_days: 7 } : {}),
        metadata: {
          plan_type: planType || 'monthly',
          ...(user ? { supabase_user_id: user.id } : {}),
        },
      },

    }

    // If authenticated, attach user info; otherwise let Stripe collect email
    if (user) {
      sessionParams.client_reference_id = user.id
      sessionParams.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] Critical Error:', err)
    
    let message = 'Error al crear la sesión de pago'
    if (err instanceof Stripe.errors.StripeError) {
      message = `${err.message} (${err.type}${err.code ? ' - ' + err.code : ''})`
    } else if (err instanceof Error) {
      message = err.message
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
