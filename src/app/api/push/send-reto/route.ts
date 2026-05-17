import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type DayMsg = { title: string; body: string }
type Enrollment = { user_id: string; current_day: number; challenge_id: string; challenges: { slug: string }[] }

const SUENO_MESSAGES: Record<number, DayMsg> = {
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

const RESET_MESSAGES: Record<number, DayMsg> = {
  1:  { title: '🧠 Día 1 — Empieza el reset',              body: 'Tu intestino y tu mente están más conectados de lo que crees. Día 1 del Food-Mood Reset.' },
  2:  { title: '😊 Día 2 — La serotonina',                 body: 'La serotonina no viene del cerebro. Viene de lo que desayunas.' },
  3:  { title: '📉 Día 3 — El pico de glucosa',            body: 'El pico de glucosa que nadie te explicó. Hoy lo entiendes.' },
  4:  { title: '🦠 Día 4 — Tu microbiota',                 body: 'Tu microbiota y tu estado de ánimo son la misma cosa.' },
  5:  { title: '🌬️ Día 5 — El nervio vago',               body: 'El hábito más infravalorado de la salud mental. Abre la app para descubrirlo.' },
  6:  { title: '🔥 Día 6 — Inflamación de bajo grado',     body: 'La causa silenciosa del bajón. Hoy la entiendes y la atacas.' },
  7:  { title: '🎉 Día 7 — Semana 1 completada',           body: '¿Qué has notado esta semana? Abre la app para tu reflexión de cierre.' },
  8:  { title: '🧘 Día 8 — Semana 2. GABA natural',        body: 'GABA natural desde la cocina. La calma que no necesita pastillas.' },
  9:  { title: '⚡ Día 9 — Dopamina',                      body: 'La molécula de la motivación. Hoy la activas desde el desayuno.' },
  10: { title: '✨ Día 10 — Magnesio',                     body: 'El mineral que más necesitas y menos tienes. Hoy lo añades.' },
  11: { title: '💭 Día 11 — Alimentación emocional',       body: 'Sin juicio. Solo comprensión. Hoy entiendes el hambre que no es hambre.' },
  12: { title: '🌈 Día 12 — 30 plantas a la semana',       body: 'El dato más revolucionario del microbioma. Hoy empiezas a contar.' },
  13: { title: '💧 Día 13 — Hidratación',                  body: 'El hábito más simple para la claridad mental.' },
  14: { title: '🎉 Día 14 — Semana 2 completada',          body: 'Dos semanas. Tu intestino ya no es el mismo.' },
  15: { title: '⏰ Día 15 — Semana 3. Ritmo circadiano',   body: 'Cuándo comes importa tanto como qué comes. Hoy lo integras.' },
  16: { title: '🌿 Día 16 — Adaptógenos',                  body: 'La ayuda natural que el estrés crónico necesita.' },
  17: { title: '🤝 Día 17 — Comida compartida',            body: 'La comida compartida activa lo que ningún suplemento puede.' },
  18: { title: '🗺️ Día 18 — Tu mapa Food-Mood personal',  body: 'Ya tienes datos propios. Hoy los lees y los conviertes en tu protocolo.' },
  19: { title: '🧠 Día 19 — El cuadro completo',           body: 'El eje intestino-cerebro ahora tiene sentido. Todo conectado.' },
  20: { title: '📋 Día 20 — Tu protocolo post-reto',       body: 'Diseña lo que se queda contigo para siempre.' },
  21: { title: '🏆 Día 21 — Food-Mood Reset completado',   body: 'Lo has conseguido. 21 días entendiendo cómo funciona tu cuerpo. Eso no se pierde.' },
}

const ENERGIA_MESSAGES: Record<number, DayMsg> = {
  1: { title: '⚡ Día 1 — Tu energía empieza aquí',       body: 'Las mitocondrias se activan con lo que desayunas. Sardinas, aceite de oliva y limón — CoQ10 puro.' },
  2: { title: '⚡ Día 2 — El truco del hierro',           body: 'El hierro vegetal no se absorbe solo. Añade vitamina C y triplicas la absorción.' },
  3: { title: '⚡ Día 3 — El mineral que más necesitas',  body: 'El magnesio participa en 300 reacciones enzimáticas. El cacao puro es la fuente más densa.' },
  4: { title: '⚡ Día 4 — Punto de inflexión',            body: 'La membrana mitocondrial se construye con omega-3 DHA. La mayoría nota el cambio hoy.' },
  5: { title: '⚡ Día 5 — NAD+ y longevidad celular',     body: 'Las setas shiitake activan tus genes de longevidad. Ergotioneína — el antioxidante más potente.' },
  6: { title: '⚡ Día 6 — Adaptógenos contra el estrés',  body: 'La rhodiola actúa en 30 minutos. Hoy entrenas tu sistema nervioso para no agotarse.' },
  7: { title: '⚡ Día 7 — Reset completado',              body: '7 días de bioquímica real. Tu energía tiene una nueva base. Eso no se pierde.' },
}

const HORMONAL_MESSAGES: Record<number, DayMsg> = {
  // Semana 1 — Estrobioma
  1:  { title: '🌸 Día 1 — El equilibrio hormonal empieza aquí',   body: 'Las bacterias intestinales gestionan el estrógeno. Semillas de lino y yogur — empieza el estrobioma.' },
  2:  { title: '🌸 Día 2 — La fibra regula tu estrógeno',         body: 'La β-glucuronidasa controla cuánto estrógeno reabsorbes. Alcachofas y lentejas hoy.' },
  3:  { title: '🌸 Día 3 — Magnesio y progesterona',              body: 'El magnesio baja el cortisol. El cortisol bajo permite que suba la progesterona.' },
  4:  { title: '🌸 Día 4 — Vitamina D3: la hormona olvidada',     body: 'La D3 modula los receptores estrogénicos. Salmón al horno con huevo — el dúo D3+K2.' },
  5:  { title: '🌸 Día 5 — Omega-3 y membranas hormonales',       body: 'Las hormonas se fabrican donde el DHA construye. Sardinas con aguacate y rúcula hoy.' },
  6:  { title: '🌸 Día 6 — Zinc y testosterona femenina',         body: 'La testosterona femenina importa. El zinc activa su síntesis — semillas de calabaza y carne magra.' },
  7:  { title: '🌸 Día 7 — Semana 1 completada',                  body: 'El estrobioma está activo. Tu microbioma intestinal ya no es el mismo. Celebra con el bol integrador.' },
  // Semana 2 — Fitoestrógenos
  8:  { title: '🌸 Semana 2 — Fitoestrógenos',                   body: 'Las isoflavonas se unen a tus receptores ER-β. Miso con tofu — isoflavonas fermentadas hoy.' },
  9:  { title: '🌸 Día 9 — Granada y urolitinas',                 body: 'Los elagitaninos de la granada producen urolitinas que activan la mitofagia. Media granada hoy.' },
  10: { title: '🌸 Día 10 — Legumbres y cumestanos',              body: 'Garbanzos, lentejas, edamame — fitoestrógenos con doble efecto: receptor y estrobioma.' },
  11: { title: '🌸 Día 11 — Adaptógenos femeninos',               body: 'Maca y ashwagandha actúan sobre el eje HHO. El batido adaptogénico de hoy.' },
  12: { title: '🌸 Día 12 — Proteína para el músculo',            body: 'Sin estrógeno para proteger el músculo, la proteína toma el relevo. 30 g en el desayuno.' },
  13: { title: '🌸 Día 13 — El sueño hormonal',                   body: 'Sin NREM3, las hormonas no se reparan. Cena antes de las 20h. Valeriana y melisa esta noche.' },
  14: { title: '🌸 Día 14 — Dos semanas completadas',             body: 'Los receptores ER-β ya están siendo modulados. El punto de inflexión que esperabas.' },
  // Semana 3 — Detoxificación
  15: { title: '🌸 Semana 3 — El hígado como segundo ovario',    body: 'El DIM del brócoli guía el estrógeno hacia la vía protectora. Brócoli asado con ajo hoy.' },
  16: { title: '🌸 Día 16 — Cardo mariano y detoxificación',      body: 'La silimarina activa la UGT1A1 — la enzima que empaqueta el estrógeno para eliminarlo.' },
  17: { title: '🌸 Día 17 — Intestino permeable y hormonas',      body: 'Un intestino permeable reabsorbe el estrógeno que el hígado ya había eliminado. Caldo de huesos.' },
  18: { title: '🌸 Día 18 — Tiroides, selenio y yodo',            body: '2 nueces de Brasil = 100% del selenio diario. El cofactor que convierte T4 en T3 activa.' },
  19: { title: '🌸 Día 19 — Colágeno y huesos',                   body: 'El estrógeno protegía el colágeno. Ahora lo haces tú con vitamina C y caldo de huesos.' },
  20: { title: '🌸 Día 20 — Microbioma vaginal',                  body: 'Lactobacillus reuteri y rhamnosus restauran el pH vaginal. Kéfir con lino y arándanos hoy.' },
  21: { title: '🌸 Día 21 — Tres semanas completadas',            body: '21 días de protocolo hormonal. El gran bol integrador de la semana 3 hoy.' },
  // Semana 4 — Consolidación
  22: { title: '🌸 Semana 4 — Cronobiología hormonal',           body: 'Cuándo comes las hormonas importa tanto como qué comes. Desayuna en la primera hora.' },
  23: { title: '🌸 Día 23 — DHEA y suprarrenales',               body: 'Las suprarrenales toman el relevo de los ovarios. Leche dorada de ashwagandha esta mañana.' },
  24: { title: '🌸 Día 24 — Inflamación pélvica',                body: 'COX-2 y prostaglandinas E2 alimentan el dolor. Cúrcuma con pimienta negra y curry hoy.' },
  25: { title: '🌸 Día 25 — Antioxidantes específicos para 45+', body: 'NRF2 activa tus propios antioxidantes. 5 colores de vegetales en la ensalada de hoy.' },
  26: { title: '🌸 Día 26 — Glucosa e insulina',                  body: 'La insulina alta baja la SHBG y activa la aromatasa. Empieza la comida con verdura hoy.' },
  27: { title: '🌸 Día 27 — Tu protocolo permanente',             body: 'Mañana terminas. Hoy diseñas el protocolo que se queda contigo para siempre.' },
  28: { title: '🌸 Día 28 — Lo has conseguido',                   body: '28 días de bioquímica hormonal real. Tu cuerpo tiene una nueva línea base. Eso no se pierde.' },
}

const ANTIINFLAMATORIO_MESSAGES: Record<number, DayMsg> = {
  1: { title: '🌿 Día 1 — Empieza el reset',          body: 'Hoy apagas el interruptor de la inflamación. Leche dorada con pimienta negra y ghee — NF-κB inhibido.' },
  2: { title: '🐟 Día 2 — Omega-3 y resolvinas',      body: 'La bioquímica del apagado activo. Caballa, alcaparras y vinagreta de mostaza — resolvinas en marcha.' },
  3: { title: '🦠 Día 3 — Fermentados y barrera',     body: 'El 70% de la inflamación empieza en el intestino. Kéfir + chucrut crudo — la barrera se refuerza.' },
  4: { title: '🎯 Día 4 — Mitad del reset',           body: 'Nrf2 activado. Hoy potencias con polifenoles. Arándanos, moras, cebolla roja y té verde — cuatro vías a la vez.' },
  5: { title: '🥦 Día 5 — Sulforafano',               body: 'El compuesto del brócoli que los laboratorios intentan sintetizar. 10 minutos de reposo antes de cocinarlo.' },
  6: { title: '🌙 Día 6 — Ayuno nocturno',            body: 'La limpieza celular que ocurre mientras duermes. Cena antes de las 20h — autofagia activada.' },
  7: { title: '🏆 Día 7 — Reset completado',          body: '7 días. Seis vías antiinflamatorias. Tu informe personalizado está listo. Eso no se pierde.' },
}

const SLUG_MESSAGES: Record<string, Record<number, DayMsg>> = {
  'mejora-tu-sueno':          SUENO_MESSAGES,
  'food-mood-reset':          RESET_MESSAGES,
  'recupera-tu-energia':      ENERGIA_MESSAGES,
  'equilibrio-hormonal-45':   HORMONAL_MESSAGES,
  'reset-antiinflamatorio':   ANTIINFLAMATORIO_MESSAGES,
}

function getDefaultMessage(slug: string, day: number): DayMsg {
  const icon = slug === 'food-mood-reset' ? '🧠'
    : slug === 'recupera-tu-energia' ? '⚡'
    : slug === 'equilibrio-hormonal-45' ? '🌸'
    : slug === 'reset-antiinflamatorio' ? '🌿'
    : '😴'
  return {
    title: `${icon} Día ${day} — Tu contenido de hoy`,
    body:  'Abre Food·Mood para ver el contenido de hoy y seguir tu progreso.',
  }
}

export async function POST(req: NextRequest) {
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

  // Find all active enrollments for all supported challenges
  const { data: enrollments, error: enrollErr } = await supabase
    .from('user_challenges')
    .select('user_id, current_day, challenge_id, challenges!inner(slug)')
    .in('challenges.slug', Object.keys(SLUG_MESSAGES))
    .eq('paid', true)
    .eq('completed', false)

  if (enrollErr) {
    console.error('Error fetching enrollments:', enrollErr)
    return NextResponse.json({ error: enrollErr.message }, { status: 500 })
  }

  if (!enrollments?.length) {
    return NextResponse.json({ success: true, sentCount: 0 })
  }

  const userIds = (enrollments as Enrollment[]).map((e) => e.user_id)

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

  for (const enrollment of enrollments as Enrollment[]) {
    const subs = subsByUser[enrollment.user_id]
    if (!subs?.length) continue

    const slug = enrollment.challenges?.[0]?.slug ?? 'mejora-tu-sueno'
    const messages = SLUG_MESSAGES[slug] ?? SUENO_MESSAGES
    const msg = messages[enrollment.current_day] ?? getDefaultMessage(slug, enrollment.current_day)
    const payload = JSON.stringify({
      title: msg.title,
      body:  msg.body,
      url:   `/retos/${slug}/dia/${enrollment.current_day}`,
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
