import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const { data: challenge, error: challengeErr } = await supabase
    .from('challenges')
    .select('id, slug, title, subtitle, price_eur')
    .eq('id', challenge_id)
    .eq('is_active', true)
    .single()

  if (challengeErr || !challenge) {
    return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 })
  }

  // Ensure enrollment exists (idempotent)
  await supabase
    .from('user_challenges')
    .upsert(
      { user_id: user.id, challenge_id, start_date: new Date().toISOString().split('T')[0] },
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    )

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name:        `Reto Food·Mood: ${challenge.title}`,
            description: challenge.subtitle ?? undefined,
          },
          unit_amount: Math.round((challenge.price_eur as number) * 100),
        },
        quantity: 1,
      },
    ],
    success_url:           `${appUrl}/retos/${challenge.slug}?success=true`,
    cancel_url:            `${appUrl}/retos/${challenge.slug}`,
    client_reference_id:   user.id,
    customer_email:        user.email ?? undefined,
    allow_promotion_codes: true,
    metadata: {
      type:            'challenge',
      user_id:         user.id,
      challenge_id:    challenge.id,
      challenge_slug:  challenge.slug,
    },
  })

  return NextResponse.json({ url: session.url })
}
