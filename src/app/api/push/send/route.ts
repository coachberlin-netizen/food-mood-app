import logger from "@/lib/logger"
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/push/send
 * Sends a push notification to all subscriptions of a user or all users.
 * Body: { userId?: string, title: string, body: string, url: string }
 */
export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId, title, body, url } = await req.json()
    const supabase = await createClient()

    // Initialize web-push with VAPID keys
    webpush.setVapidDetails(
      'mailto:admin@food-mood.app',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )

    // Build the query
    let query = supabase.from('push_subscriptions').select('*')
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      logger.error('Error fetching subscriptions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const notifications = subscriptions.map((sub: any) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      }

      return webpush.sendNotification(
        pushSubscription,
        JSON.stringify({ title, body, url: url || '/dashboard' })
      ).catch((err: any) => {
        logger.error('Push error for endpoint:', sub.endpoint, err.message)
        // Optionally delete expired subscriptions here
      })
    })

    await Promise.all(notifications)

    return NextResponse.json({ success: true, sentCount: notifications.length })
  } catch (err: any) {
    logger.error('Push send error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
