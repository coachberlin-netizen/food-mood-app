import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const { data, error } = await supabase
    .from('user_challenges')
    .upsert(
      {
        user_id:     user.id,
        challenge_id,
        start_date:  new Date().toISOString().split('T')[0],
      },
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    )
    .select()
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ enrollment: data })
}
