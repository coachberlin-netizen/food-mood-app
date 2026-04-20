import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const [{ data: enrollment }, { data: challenge }] = await Promise.all([
    supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge_id)
      .single(),
    supabase
      .from('challenges')
      .select('id, title, duration_days, slug')
      .eq('id', challenge_id)
      .single(),
  ])

  if (!enrollment || !challenge) {
    return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })
  }
  if (!enrollment.paid) {
    return NextResponse.json({ error: 'Pago pendiente' }, { status: 403 })
  }
  if (enrollment.completed) {
    return NextResponse.json({ enrollment, completed: true })
  }

  const newDay    = (enrollment.current_day as number) + 1
  const isCompleted = newDay > (challenge.duration_days as number)

  const updateData: Record<string, unknown> = { current_day: newDay }

  if (isCompleted) {
    const { data: fmData } = await supabase
      .from('fm_index_log')
      .select('index_value')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    updateData.completed    = true
    updateData.completed_at = new Date().toISOString()
    updateData.fm_index_end = (fmData as any)?.index_value ?? null
  }

  const { data: updated, error } = await supabase
    .from('user_challenges')
    .update(updateData)
    .eq('id', enrollment.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Completion email (non-blocking)
  if (isCompleted && user.email) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const indexStart  = (enrollment.fm_index_start as number | null) ?? 0
      const indexEnd    = ((updated as any).fm_index_end as number | null) ?? 0
      const improvement = indexEnd - indexStart
      const appUrl      = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'

      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app',
        to:      user.email,
        subject: `🏆 ¡Completaste el reto "${challenge.title}"!`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 16px;background:#F5F0E8">
            <h1 style="font-size:28px;color:#2d0f16;margin:0 0 8px">🏆 Reto completado</h1>
            <p style="font-size:16px;color:#6B2737;margin:0 0 24px">${challenge.title}</p>
            <div style="background:#2d0f16;border-radius:16px;padding:24px;margin-bottom:24px">
              <p style="color:#C9A84C;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px">Tu informe final</p>
              <p style="color:white;font-size:15px;margin:0 0 8px">
                Índice inicial: <strong style="color:#C9A84C">${indexStart}</strong>
                &nbsp;→&nbsp;
                Índice final: <strong style="color:#C9A84C">${indexEnd}</strong>
              </p>
              ${improvement !== 0 ? `
              <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0">
                ${improvement > 0 ? `↑ Mejora de ${improvement} puntos` : `↓ ${Math.abs(improvement)} puntos (sigue en camino)`}
              </p>` : ''}
            </div>
            <p style="color:#6B2737;font-size:14px;margin:0 0 24px">
              Has completado los <strong>${challenge.duration_days} días</strong> del reto.
              Tu cuerpo y tu microbioma te lo agradecen.
            </p>
            <a href="${appUrl}/retos" style="display:inline-block;background:#6B2737;color:white;padding:14px 28px;border-radius:40px;font-size:13px;font-weight:600;text-decoration:none">
              Ver más retos →
            </a>
            <p style="color:rgba(107,39,55,0.4);font-size:11px;margin:32px 0 0">Food·Mood · food-mood.app</p>
          </div>
        `,
      })
    } catch {
      // non-blocking
    }
  }

  return NextResponse.json({ enrollment: updated, completed: isCompleted })
}
