import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/admin-config'
import { getPremiumStatus } from '@/lib/premium'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const { data: challenge, error: challengeErr } = await supabase
    .from('challenges')
    .select('id, slug, title, subtitle, price_eur, stripe_price_id')
    .eq('id', challenge_id)
    .eq('is_active', true)
    .single()

  if (challengeErr || !challenge) {
    return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'
  const today  = new Date().toISOString().split('T')[0]

  // Admin and premium/influencer users bypass Stripe — enroll directly
  const hasFreeAccess = isUserAdmin(user) || await getPremiumStatus(supabase, user.id)
  if (hasFreeAccess) {
    const { data: existing } = await supabase
      .from('user_challenges')
      .select('current_day')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge_id)
      .maybeSingle()
    await supabase
      .from('user_challenges')
      .upsert(
        { user_id: user.id, challenge_id, start_date: today, paid: true, current_day: existing?.current_day ?? 1 },
        { onConflict: 'user_id,challenge_id' }
      )
    const day = existing?.current_day ?? 1
    const dest = day === 1 ? `${appUrl}/retos/${challenge.slug}/lista-compra` : `${appUrl}/retos/${challenge.slug}/dia/${day}`
    return NextResponse.json({ url: dest })
  }

  // Ensure enrollment exists (idempotent)
  await supabase
    .from('user_challenges')
    .upsert(
      { user_id: user.id, challenge_id, start_date: today },
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    )

  const lineItem = challenge.stripe_price_id
    ? { price: challenge.stripe_price_id, quantity: 1 }
    : {
        price_data: {
          currency: 'eur',
          product_data: {
            name:        `Reto Food·Mood: ${challenge.title}`,
            description: challenge.subtitle ?? undefined,
          },
          unit_amount: Math.round((challenge.price_eur as number) * 100),
        },
        quantity: 1,
      }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [lineItem],
    success_url:           `${appUrl}/retos/${challenge.slug}/lista-compra`,
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
