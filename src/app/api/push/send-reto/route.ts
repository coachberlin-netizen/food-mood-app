import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DAY_MESSAGES: Record<number, { title: string; body: string }> = {
  1:  { title: '😴 Día 1 — Tu reset empieza hoy',          body: 'Arroz con leche de avena y semillas de calabaza. Magnesio puro para tu primer buen sueño.' },
  2:  { title: '😴 Día 2 — Tu intestino agradece esto',     body: 'Kéfir con plátano y nueces. El 90% de tu serotonina viene de tu barriga.' },
  3:  { title: '😴 Día 3 — Antiinflamación nocturna',       body: 'Crema de boniato con cúrcuma. Reducir la inflamación mejora el sueño profundo.' },
  4:  { title: '😴 Día 4 — Mitad del camino 🎯',            body: 'Salmón con espárragos y quinoa. Omega-3 + magnesio para el sueño REM.' },
  5:  { title: '😴 Día 5 — Fermentado nocturno',            body: 'Sopa de miso con tofu. Una cena caliente que prepara tu cuerpo para el descanso.' },
  6:  { title: '😴 Día 6 — Melatonina natural',             body: 'Batido de cereza y kéfir. Las cerezas tienen más melatonina que cualquier suplemento.' },
  7:  { title: '😴 Día 7 — ¡Primera semana completada! 🏆', body: 'Tortilla de espinacas y semillas de girasol. La trinidad del sueño profundo.' },
  14: { title: '😴 Día 14 — Dos semanas. El hábito es tuyo.', body: 'El patrón de sueño tarda 14 días en cambiar. Lo estás consiguiendo.' },
  21: { title: '😴 Día 21 — Tres semanas de transformación', body: 'Tu microbiota ya ha cambiado. Tu sueño también lo nota.' },
  28: { title: '😴 Día 28 — ¡Reto completado! 🏆',          body: 'Lo lograste. Revisa tu informe personalizado.' },
}

function getDefaultMessage(day: number) {
  return {
    title: `😴 Día ${day} — Tu receta de hoy`,
    body:  'Abre Food·Mood para ver la receta de hoy y seguir tu progreso.',
  }
}

export async function POST(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  webpush.setVapidDetails(
    'mailto:admin@food-mood.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  // Find all active enrollments for sleep challenge
  const { data: enrollments, error: enrollErr } = await supabase
    .from('user_challenges')
    .select('user_id, current_day, challenge_id, challenges!inner(slug)')
    .eq('challenges.slug', 'mejora-tu-sueno')
    .eq('paid', true)
    .eq('completed', false)

  if (enrollErr) {
    console.error('Error fetching enrollments:', enrollErr)
    return NextResponse.json({ error: enrollErr.message }, { status: 500 })
  }

  if (!enrollments?.length) {
    return NextResponse.json({ success: true, sentCount: 0 })
  }

  const userIds = enrollments.map((e: any) => e.user_id)

  // Get push subscriptions for these users
  const { data: subscriptions, error: subErr } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, p256dh, auth')
    .in('user_id', userIds)

  if (subErr) {
    console.error('Error fetching subscriptions:', subErr)
    return NextResponse.json({ error: subErr.message }, { status: 500 })
  }

  // Group subscriptions by user_id
  const subsByUser: Record<string, any[]> = {}
  for (const sub of subscriptions ?? []) {
    if (!subsByUser[sub.user_id]) subsByUser[sub.user_id] = []
    subsByUser[sub.user_id].push(sub)
  }

  let sentCount = 0
  const sends: Promise<any>[] = []

  for (const enrollment of enrollments as any[]) {
    const subs = subsByUser[enrollment.user_id]
    if (!subs?.length) continue

    const msg = DAY_MESSAGES[enrollment.current_day] ?? getDefaultMessage(enrollment.current_day)
    const payload = JSON.stringify({
      title: msg.title,
      body:  msg.body,
      url:   `/retos/mejora-tu-sueno`,
    })

    for (const sub of subs) {
      sends.push(
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        ).catch((err: any) => {
          console.error('Push error for user', enrollment.user_id, err.message)
          // Clean up expired subscriptions
          if (err.statusCode === 410) {
            supabase.from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint)
              .then(() => {})
          }
        })
      )
      sentCount++
    }
  }

  await Promise.all(sends)
  return NextResponse.json({ success: true, sentCount })
}
