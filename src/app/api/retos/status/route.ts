import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const challengeId = req.nextUrl.searchParams.get('challenge_id')
  if (!challengeId) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const { data } = await supabase
    .from('user_challenges')
    .select('paid, current_day, completed')
    .eq('user_id', user.id)
    .eq('challenge_id', challengeId)
    .maybeSingle()

  return NextResponse.json({ paid: data?.paid ?? false, current_day: data?.current_day ?? 1 })
}
