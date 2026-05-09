import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'

export const dynamic = 'force-dynamic'

const DAILY_LIMIT = 20

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { canUseAI: false, reason: 'unauthenticated' },
      { status: 401 }
    )
  }

  const isPremium = await getPremiumStatus(supabase, user.id)

  if (!isPremium) {
    return NextResponse.json({ canUseAI: false, reason: 'no_active_subscription' })
  }

  // Fetch current daily counter
  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_messages_today, ai_messages_reset_at')
    .eq('id', user.id)
    .maybeSingle()

  const todayUtc = new Date().toISOString().slice(0, 10)
  const resetDay = profile?.ai_messages_reset_at
    ? new Date(profile.ai_messages_reset_at).toISOString().slice(0, 10)
    : null
  const usedToday = resetDay === todayUtc ? (profile?.ai_messages_today ?? 0) : 0

  return NextResponse.json({
    canUseAI: true,
    reason: 'active_subscription',
    messagesUsedToday: usedToday,
    dailyLimit: DAILY_LIMIT,
    messagesRemaining: Math.max(0, DAILY_LIMIT - usedToday),
  })
}
