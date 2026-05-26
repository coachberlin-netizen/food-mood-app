import logger from "@/lib/logger"
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  // RLS policy `user_challenges_select_own` allows SELECT where auth.uid() = user_id
  const { data: enrollment, error: fetchErr } = await supabase
    .from('user_challenges')
    .select('id, paid, completed')
    .eq('user_id', user.id)
    .eq('challenge_id', challenge_id)
    .maybeSingle()

  if (fetchErr) {
    logger.error('[restart] fetch error:', fetchErr)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }
  if (!enrollment)           return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })
  if (!enrollment.paid)      return NextResponse.json({ error: 'Pago pendiente' },            { status: 403 })
  if (!enrollment.completed) return NextResponse.json({ error: 'El reto no está completado' }, { status: 400 })

  // RLS policy `user_challenges_update_own` allows UPDATE where auth.uid() = user_id
  const { data: updated, error: updateErr } = await supabase
    .from('user_challenges')
    .update({ current_day: 1, completed: false, completed_at: null, fm_index_end: null })
    .eq('id', enrollment.id)
    .eq('user_id', user.id)
    .select('id, current_day, completed')
    .maybeSingle()

  if (updateErr) {
    logger.error('[restart] update error:', updateErr)
    return NextResponse.json({ error: `Error DB: ${updateErr.message}` }, { status: 500 })
  }
  if (!updated) {
    logger.error('[restart] no rows updated for enrollment.id:', enrollment.id)
    return NextResponse.json({ error: 'No se pudo actualizar la inscripción' }, { status: 500 })
  }

  logger.info('[restart] OK user:', user.id, 'enrollment:', enrollment.id)
  return NextResponse.json({ ok: true, current_day: updated.current_day })
}
