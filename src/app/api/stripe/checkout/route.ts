import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for subscription.
 * Body: { plan: string, userId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json()

    // Select Price ID based on plan from env
    const priceId = plan === 'quarterly'
      ? process.env.STRIPE_PRICE_ID_QUARTERLY
      : process.env.STRIPE_PRICE_ID_MONTHLY || process.env.STRIPE_PRICE_ID

    if (!priceId) {
      console.error('[checkout] Missing Stripe Price ID for plan:', plan)
      return NextResponse.json({ error: 'Plan no configurado' }, { status: 500 })
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.food-mood.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/pricing`,
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        supabase_user_id: userId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout] Error:', err)
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
