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

    // GDPR: verificar consentimiento explícito antes de guardar la suscripción
    const { data: consent } = await supabase
      .from('user_consent')
      .select('consent_push_notifications')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!consent?.consent_push_notifications) {
      return NextResponse.json({ error: 'Consentimiento de notificaciones no otorgado' }, { status: 403 })
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
