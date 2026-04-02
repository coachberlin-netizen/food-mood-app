import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events for subscription lifecycle.
 * Updates profiles.is_premium in Supabase.
 */
export async function POST(req: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[webhook] Missing Supabase env vars')
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const customerEmail = session.customer_details?.email || session.customer_email
        const plan = session.metadata?.plan || 'monthly'

        console.log(`[webhook] checkout.session.completed — userId: ${userId}, email: ${customerEmail}, plan: ${plan}`)

        if (userId) {
          // Update profiles table: is_premium = true
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', userId)

          if (profileError) {
            console.error('[webhook] Error updating profiles:', profileError)
          } else {
            console.log(`✅ profiles.is_premium = true for user ${userId}`)
          }
        } else if (customerEmail) {
          // Fallback: find user by email
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .single()

          if (profile?.id) {
            await supabaseAdmin
              .from('profiles')
              .update({ is_premium: true })
              .eq('id', profile.id)
            console.log(`✅ profiles.is_premium = true for user ${profile.id} (found by email)`)
          } else {
            console.error(`[webhook] No profile found for email: ${customerEmail}`)
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerEmail = subscription.metadata?.customer_email

        console.log(`[webhook] subscription.deleted — customerId: ${subscription.customer}`)

        // Try to find user by Stripe customer ID or email and downgrade
        if (customerEmail) {
          await supabaseAdmin
            .from('profiles')
            .update({ is_premium: false })
            .eq('email', customerEmail)
          console.log(`❌ profiles.is_premium = false for ${customerEmail}`)
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const status = subscription.status

        console.log(`🔄 Subscription updated: ${status} for customer ${subscription.customer}`)

        // If subscription becomes inactive, downgrade
        if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
          const userId = subscription.metadata?.supabase_user_id
          if (userId) {
            await supabaseAdmin
              .from('profiles')
              .update({ is_premium: false })
              .eq('id', userId)
            console.log(`❌ profiles.is_premium = false for user ${userId}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
