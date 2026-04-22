import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { slug } = await req.json()

    const { data: reto, error } = await supabase
      .from('challenges')
      .select('id, title, price_eur, is_premium')
      .eq('slug', slug)
      .single()

    if (error || !reto) {
      return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 })
    }

    if (!reto.is_premium) {
      return NextResponse.json({ error: 'Reto gratuito' }, { status: 400 })
    }

    const { data: existingPurchase } = await supabase
      .from('reto_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('challenge_id', reto.id)
      .eq('status', 'active')
      .maybeSingle()

    if (existingPurchase) {
      return NextResponse.json({ error: 'Ya tienes acceso a este reto' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: reto.title,
              description: 'Acceso completo · Food·Mood',
            },
            unit_amount: Math.round(reto.price_eur * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type:         'challenge',
        user_id:      user.id,
        challenge_id: reto.id,
        slug,
      },
      client_reference_id: user.id,
      customer_email:      user.email,
      success_url: `${baseUrl}/retos/${slug}/acceso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/retos/${slug}`,
      locale: 'es',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout] Error:', err)
    return NextResponse.json({ error: 'Error creando sesión de pago' }, { status: 500 })
  }
}
