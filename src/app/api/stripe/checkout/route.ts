import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
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

    if (!user) {
      return NextResponse.json(
        { error: 'unauthenticated', redirect: '/auth/login?redirect=/pricing' },
        { status: 401 }
      )
    }

    const protocol = req.headers.get('x-forwarded-proto') || 'http'
    const host = req.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?subscribed=true`,
      cancel_url: `${baseUrl}/pricing`,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_email: user.email,
      metadata: {
        supabase_user_id: user.id,
        plan_type: planType || 'monthly',
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_type: planType || 'monthly',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] Error:', err)
    const message = err instanceof Error ? err.message : 'Error al crear la sesión de pago'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
