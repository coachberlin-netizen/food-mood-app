import logger from "@/lib/logger"
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { challenge_id } = await req.json()
  if (!challenge_id) return NextResponse.json({ error: 'challenge_id requerido' }, { status: 400 })

  const [enrollmentResult, challengeResult] = await Promise.all([
    supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge_id)
      .maybeSingle(),
    supabase
      .from('challenges')
      .select('id, title, duration_days, slug')
      .eq('id', challenge_id)
      .maybeSingle(),
  ])

  if (enrollmentResult.error || challengeResult.error) {
    logger.error('complete-day DB error', enrollmentResult.error ?? challengeResult.error)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }

  const enrollment = enrollmentResult.data
  const challenge  = challengeResult.data

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
  if (isCompleted && user.email && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const indexStart  = (enrollment.fm_index_start as number | null) ?? 0
      const indexEnd    = ((updated as any).fm_index_end as number | null) ?? 0
      const improvement = indexEnd - indexStart
      const appUrl      = process.env.NEXT_PUBLIC_APP_URL ?? 'https://food-mood.app'

      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'hola@food-mood.app',
        to:      user.email,
        subject: `🏆 Completaste el reto "${challenge.title}" — ¿y ahora qué?`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:0;background:#F5F0E8">

            <!-- Header -->
            <div style="background:#2d0f16;padding:40px 32px 32px;border-radius:0">
              <p style="color:#FF6B35;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;margin:0 0 16px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">Reto completado</p>
              <h1 style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:32px;font-weight:900;color:#F5F0E8;margin:0 0 8px;letter-spacing:-0.03em;line-height:1.1">
                Lo has hecho.<br/><span style="color:#FF6B35">${challenge.duration_days} días.</span>
              </h1>
              <p style="font-size:15px;color:rgba(245,240,232,0.6);margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">${challenge.title}</p>
            </div>

            <!-- Índice -->
            <div style="padding:28px 32px;border-bottom:1px solid #e0d5c8">
              <p style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9e8080;margin:0 0 14px">Tu progreso</p>
              <div style="display:flex;align-items:center;gap:16px">
                <div style="text-align:center">
                  <div style="font-size:32px;font-weight:700;color:#2d0f16;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">${indexStart}</div>
                  <div style="font-size:11px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">al empezar</div>
                </div>
                <div style="font-size:20px;color:#FF6B35">→</div>
                <div style="text-align:center">
                  <div style="font-size:32px;font-weight:700;color:#6B2737;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">${indexEnd}</div>
                  <div style="font-size:11px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">al terminar</div>
                </div>
                ${improvement !== 0 ? `
                <div style="margin-left:auto;background:${improvement > 0 ? '#f0f9f4' : '#fef3f0'};border:1px solid ${improvement > 0 ? '#4A7C5940' : '#E8703A40'};border-radius:10px;padding:10px 16px;text-align:center">
                  <div style="font-size:18px;font-weight:700;color:${improvement > 0 ? '#4A7C59' : '#E8703A'};font-family:Helvetica Neue,Helvetica,Arial,sans-serif">${improvement > 0 ? `+${improvement}` : improvement}</div>
                  <div style="font-size:11px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">puntos</div>
                </div>` : ''}
              </div>
            </div>

            <!-- Por qué repetir -->
            <div style="padding:28px 32px;border-bottom:1px solid #e0d5c8">
              <p style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9e8080;margin:0 0 14px">Antes de seguir</p>
              <div style="background:#fff;border-radius:14px;border:1px solid #e8ddd5;padding:20px 22px">
                <p style="font-family:Georgia,serif;font-size:18px;color:#6B2737;margin:0 0 12px;font-weight:400;line-height:1.4">
                  El hábito se consolida<br/>en la repetición.
                </p>
                <p style="font-size:14px;color:#7a5c63;line-height:1.7;margin:0;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">
                  Un ciclo de <strong style="color:#2d0f16">${challenge.duration_days} días</strong> activa los mecanismos.
                  La segunda vuelta los consolida. El microbioma necesita exposición repetida
                  para que los cambios sean permanentes — no es suficiente con una vez.
                  <br/><br/>
                  <strong style="color:#6B2737">Repetir el reto en 30 días es lo que convierte un cambio en un hábito.</strong>
                </p>
              </div>
              <div style="margin-top:16px;text-align:center">
                <a href="${appUrl}/retos/${challenge.slug}" style="display:inline-block;background:#6B2737;color:#F5F0E8;padding:12px 26px;border-radius:40px;font-size:13px;font-weight:600;text-decoration:none;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;letter-spacing:0.02em">
                  Volver a empezar el reto →
                </a>
              </div>
            </div>

            <!-- Otros retos -->
            <div style="padding:28px 32px;border-bottom:1px solid #e0d5c8">
              <p style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9e8080;margin:0 0 14px">Mientras tanto — variedad para el microbioma</p>
              <p style="font-size:14px;color:#7a5c63;line-height:1.7;margin:0 0 18px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">
                Tu microbioma prospera con la diversidad. Alternar retos activa diferentes cepas bacterianas y diferentes vías metabólicas. Mientras esperas para repetir este, prueba uno diferente.
              </p>
              <div style="display:grid;gap:10px">
                <a href="${appUrl}/retos/slow-food-mood" style="display:block;background:#fff;border:1px solid #e8ddd5;border-left:3px solid oklch(68% 0.18 165);border-radius:10px;padding:14px 18px;text-decoration:none">
                  <div style="font-size:12px;font-weight:600;color:#2d0f16;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;margin-bottom:3px">Slow Food·Mood — 20 días</div>
                  <div style="font-size:12px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">Fermentados, caldos, masa madre. Bioquímica con paciencia.</div>
                </a>
                <a href="${appUrl}/retos/food-mood-reset" style="display:block;background:#fff;border:1px solid #e8ddd5;border-left:3px solid oklch(70% 0.22 300);border-radius:10px;padding:14px 18px;text-decoration:none">
                  <div style="font-size:12px;font-weight:600;color:#2d0f16;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;margin-bottom:3px">Food·Mood Reset — 21 días</div>
                  <div style="font-size:12px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">El eje intestino-cerebro completo. El más transformador.</div>
                </a>
                <a href="${appUrl}/retos/reset-antiinflamatorio" style="display:block;background:#fff;border:1px solid #e8ddd5;border-left:3px solid oklch(74% 0.22 148);border-radius:10px;padding:14px 18px;text-decoration:none">
                  <div style="font-size:12px;font-weight:600;color:#2d0f16;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;margin-bottom:3px">Reset Antiinflamatorio — 7 días</div>
                  <div style="font-size:12px;color:#9e8080;font-family:Helvetica Neue,Helvetica,Arial,sans-serif">Cúrcuma, omega-3, fermentados. Una semana que cambia el marcador.</div>
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding:20px 32px;text-align:center">
              <p style="font-family:Georgia,serif;font-size:16px;color:#6B2737;margin:0 0 4px">Food·Mood</p>
              <p style="font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:11px;color:#b0a0a0;margin:0">food-mood.app</p>
            </div>

          </div>
        `,
      })
    } catch {
      // non-blocking
    }
  }

  return NextResponse.json({ enrollment: updated, completed: isCompleted })
}
