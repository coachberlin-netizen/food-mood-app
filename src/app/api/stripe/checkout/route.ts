import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for subscription.
 * Body: { priceId: string, userId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing priceId or userId' },
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
