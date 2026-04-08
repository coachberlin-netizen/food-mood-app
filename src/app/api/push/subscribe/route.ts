import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/push/subscribe
 * Saves a new push subscription in Supabase.
 */
export async function POST(req: NextRequest) {
  try {
    const { endpoint, keys } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint,
        p256dh: keys?.p256dh,
        auth: keys?.auth
      }, { onConflict: 'user_id, endpoint' })

    if (error) {
      console.error('Error saving subscription:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Push subscribe error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
