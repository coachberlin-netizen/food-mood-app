import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const { data: enrollment, error: fetchErr } = await supabase
    .from('user_challenges')
    .select('id, paid, completed')
    .eq('user_id', user.id)
    .eq('challenge_id', challenge_id)
    .maybeSingle()

  if (fetchErr) return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  if (!enrollment) return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })
  if (!enrollment.paid) return NextResponse.json({ error: 'Pago pendiente' }, { status: 403 })
  if (!enrollment.completed) return NextResponse.json({ error: 'El reto no está completado' }, { status: 400 })

  const { error: updateErr } = await supabase
    .from('user_challenges')
    .update({
      current_day:  1,
      completed:    false,
      completed_at: null,
      fm_index_end: null,
    })
    .eq('id', enrollment.id)

  if (updateErr) return NextResponse.json({ error: 'Error al reiniciar' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
