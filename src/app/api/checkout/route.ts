import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session for the selected plan.
 * Body: { plan: "monthly" | "quarterly" }
 */
export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()

    // Select Price ID based on plan
    const priceId =
      plan === 'quarterly'
        ? process.env.STRIPE_PRICE_ID_QUARTERLY
        : process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID

    if (!priceId) {
      console.error('[checkout] Missing Stripe Price ID for plan:', plan)
      return NextResponse.json(
        { error: 'Plan no configurado' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.food-mood.app'

    // Build Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      ...(user?.email && {
        customer_email: user.email,
        metadata: { supabase_user_id: user.id, plan },
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan },
        },
      }),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
