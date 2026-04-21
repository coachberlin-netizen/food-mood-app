import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DAY_MESSAGES: Record<number, { title: string; body: string }> = {
  // Semana 1 — Magnesio + Zinc + base mineral
  1:  { title: '😴 Día 1 — Tu reset empieza hoy',          body: 'Arroz con leche de avena y semillas de calabaza. Magnesio puro para tu primer buen sueño.' },
  2:  { title: '😴 Día 2 — Tu intestino agradece esto',     body: 'Kéfir con plátano y nueces. El 90% de tu serotonina viene de tu barriga.' },
  3:  { title: '😴 Día 3 — Antiinflamación nocturna',       body: 'Crema de boniato con cúrcuma. Reducir la inflamación mejora el sueño profundo.' },
  4:  { title: '😴 Día 4 — Mitad del camino',               body: 'Salmón con espárragos y quinoa. Omega-3 + magnesio para el sueño REM.' },
  5:  { title: '😴 Día 5 — Fermentado nocturno',            body: 'Sopa de miso con tofu. Una cena caliente que prepara tu cuerpo para el descanso.' },
  6:  { title: '😴 Día 6 — Melatonina natural',             body: 'Batido de cereza y kéfir. Las cerezas tienen más melatonina que cualquier suplemento.' },
  7:  { title: '😴 Día 7 — Primera semana completada',      body: 'Tortilla de espinacas y semillas de girasol. La trinidad del sueño profundo.' },
  // Semana 2 — Triptófano + Ritmo circadiano + Melatonina
  8:  { title: '🌅 Semana 2 — empieza el trabajo en profundidad', body: 'Desayuno de triptófano: avena nocturna con plátano y semillas de girasol. Lo que comes a las 8h determina el sueño de las 23h.' },
  9:  { title: '🥦 Noche 9 — brócoli y sulforafano',        body: 'Bol de brócoli asado con tahini negro y huevo. Nrf2 activado — reparación celular durante el sueño profundo.' },
  10: { title: '🫙 Noche 10 — kéfir con avena',             body: 'Kéfir con manzana y chía. El microbioma pide fibra — la pectina alimenta al Bifidobacterium que produce GABA.' },
  11: { title: '🐟 Noche 11 — caballa en escabeche',        body: 'Caballa marinada en vinagre de kombucha con aguacate. Omega-3 para el REM profundo — el DHA llega intacto.' },
  12: { title: '🌰 Noche 12 — crema de anacardos',          body: 'Crema de anacardos con dátiles y cacao. Triptófano directo + magnesio cofactor. La cadena completa en un bol.' },
  13: { title: '🫁 Noche 13 — caldo de huesos con miso',    body: 'Glicina + zinc juntos. Doble apagador del sistema nervioso nocturno. Tómalo a las 20h.' },
  14: { title: '🎉 Día 14 — dos semanas',                   body: 'Sushi bowl de salmón y arroz integral. Tu microbioma ya lo nota. Celébralo.' },
  // Semana 3 — Consolidación + Microbioma nocturno
  15: { title: '🧠 Semana 3 — consolidación',               body: 'Tu cerebro ya reconoce el ritual. Infusión de valeriana y manzanilla a las 21h — mismo lugar, misma taza.' },
  16: { title: '🫫 Noche 16 — chocolate negro con especias', body: 'Mousse de cacao con frambuesas y flor de sal. Teobromina sostenida 7-9 horas — activa hasta las 3-4h.' },
  17: { title: '🥬 Noche 17 — ensalada de rúcula y sardinas', body: 'Amargo + omega-3. El TAS2R de la rúcula baja tu frecuencia cardíaca vía nervio vago en minutos.' },
  18: { title: '🍵 Noche 18 — sopa de lentejas rojas',       body: 'Triptófano vegetal + hierro cofactor + leche de coco. La cadena completa hacia la serotonina.' },
  19: { title: '🫙 Noche 19 — bol de fermentados mixtos',    body: 'Chucrut, kimchi, miso y kéfir juntos. Tu microbioma en modo noche — butirato en producción.' },
  20: { title: '🌿 Noche 20 — crema de espinacas con miso',  body: 'Folato + GABA bacteriano. El sueño profundo necesita folato para reparar el ADN — espinacas 5 minutos, no más.' },
  21: { title: '🎉 3 semanas — tu sueño ya es un hábito neuronal', body: 'Bol de quinoa con boniato, tahini negro y granada. La receta más completa del reto. Una semana más.' },
  // Semana 4 — Sistema nervioso + Cronobiología + Cierre
  22: { title: '🌿 Semana 4 — afinar el sistema',            body: 'Leche dorada de ashwagandha y melisa. La curva del cortisol nocturno empieza a normalizarse.' },
  23: { title: '⏰ Noche 23 — cronobiología',                body: 'Sopa de lentejas rojas con coco. La hora de cenar también es medicina — comer antes de las 20h sincroniza el reloj hepático.' },
  24: { title: '⚡ Noche 24 — mitocondrias activas',         body: 'Bol de semillas tostadas con aguacate y huevo. CoQ10 y semillas para la reparación celular durante el NREM3.' },
  25: { title: '🔄 Noche 25 — el círculo completo',          body: 'Salmón lacado con miso y arroz negro. Intestino → nervio vago → cerebro. 25 días de trabajo convergiendo en un plato.' },
  26: { title: '💓 Noche 26 — tono vagal',                   body: 'Kéfir + chucrut crudo + aceite de oliva. Los fermentados activan el nervio vago en minutos — notarás la calma.' },
  27: { title: '🍇 Noche 27 — limpieza glinfática',          body: 'Ensalada de arándanos, moras y cebolla roja. Resveratrol y quercetina para que el cerebro se limpie esta noche.' },
  28: { title: '🏆 Día 28 — lo has conseguido',              body: '28 días de bioquímica real. El gran bol integrador. Tu cerebro te lo agradece esta noche.' },
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
