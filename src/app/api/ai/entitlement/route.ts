import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'

export const dynamic = 'force-dynamic'

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

  return NextResponse.json({ canUseAI: true, reason: 'active_subscription' })
}
