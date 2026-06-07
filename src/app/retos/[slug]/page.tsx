import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/admin-config'
import { getPremiumStatus } from '@/lib/premium'
import RetoDetailClient from './RetoDetailClient'

export const dynamic = 'force-dynamic'

// ─── FAQ schema data (plain text, no JSX — for JSON-LD) ──────────────────────
const FAQS_BASE_SCHEMA = [
  { q: '¿Qué recibo exactamente al comprar el reto?',                   a: 'Acceso inmediato a todas las recetas funcionales, audios de apoyo, seguimiento diario con tu índice Food·Mood e informe personalizado al finalizar. Todo accesible desde esta misma página, día a día.' },
  { q: '¿Necesito ingredientes especiales o difíciles de encontrar?',   a: 'No. Los ingredientes están pensados para comprarse en cualquier supermercado. Cuando algún alimento es más específico, siempre incluimos una alternativa accesible.' },
  { q: '¿Puedo hacerlo si trabajo en turnos o tengo un horario irregular?', a: 'Sí. Las recetas están diseñadas para 20-30 minutos de preparación y no dependen de un horario fijo. Puedes preparar los platos cuando mejor te venga — el reto no caduca ni tiene notificaciones obligatorias.' },
  { q: '¿Necesito tener una dieta especial o ser vegano?',              a: 'No. Las recetas son flexibles — incluyen opciones para distintas preferencias. El objetivo es añadir alimentos funcionales, no eliminar nada.' },
  { q: '¿Cuánto tiempo al día requiere?',                               a: 'Entre 20 y 30 minutos. Cada día recibes una receta, un audio breve y un registro emocional de dos preguntas. Sin rituales complejos ni listas interminables.' },
  { q: '¿Puedo empezar cuando quiera?',                                 a: 'Sí. El acceso es inmediato tras el pago y el reto empieza el día que tú decidas. No hay fechas fijas ni cohortes.' },
  { q: '¿Tengo dudas o necesito ayuda?',                                a: 'Puedes escribirnos en cualquier momento a info@food-mood.app.' },
]
const FAQS_BY_SLUG_SCHEMA: Record<string, Array<{ q: string; a: string }>> = {
  'reset-antiinflamatorio': [
    { q: '¿Es compatible con mi medicación?',              a: 'El reto se basa en alimentos naturales. Si tomas medicación anticoagulante (warfarina) o inmunosupresores, consulta a tu médico antes de aumentar el consumo de cúrcuma y omega-3.' },
    { q: '¿Necesito comprar suplementos o proteínas?',     a: 'No. Todo el protocolo se basa en alimentos reales: cúrcuma, jengibre, omega-3 del pescado azul y fermentados. Sin pastillas, sin polvos, sin gasto extra.' },
  ],
  'mejora-tu-sueno': [
    { q: '¿Funciona si tengo insomnio crónico?',           a: 'El reto actúa sobre la vía serotonina-melatonina a través de la alimentación. Funciona mejor como complemento a un tratamiento médico si lo tienes.' },
    { q: '¿Puedo tomar melatonina a la vez?',              a: 'Sí, son compatibles. El reto trabaja la síntesis endógena de melatonina — más sostenible a largo plazo — mientras el suplemento cubre el corto plazo.' },
  ],
  'equilibrio-hormonal-45': [
    { q: '¿Es para perimenopausia o también para SOP?',    a: 'Para todos. El protocolo trabaja el estrobioma, los fitoestrógenos y la inflamación de bajo grado — mecanismos comunes a la perimenopausia, el SOP y el hipotiroidismo subclínico.' },
    { q: '¿Necesito análisis antes de empezar?',           a: 'No es obligatorio, pero conocer tus niveles de vitamina D, ferritina y TSH te permite medir el impacto real del protocolo al terminar.' },
  ],
  'recupera-tu-energia': [
    { q: '¿Funciona sin dejar el café?',                   a: 'Sí. No pedimos que elimines la cafeína — pedimos que cambies el contexto: cuándo, con qué y por qué la tomas. El reto trabaja la función mitocondrial y el transporte de hierro.' },
  ],
}
function buildFaqSchema(slug: string) {
  const extra = FAQS_BY_SLUG_SCHEMA[slug] ?? []
  const all = [...FAQS_BASE_SCHEMA.slice(0, 3), ...extra, ...FAQS_BASE_SCHEMA.slice(3)]
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('challenges')
    .select('title, subtitle, description, price_eur, duration_days')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Reto — Food·Mood' }

  const SLUG_TITLES: Record<string, string> = {
    'slow-food-mood':         'Cocina lenta para la calma interior — Programa 21 días | Food·Mood',
    'mejora-tu-sueno':        'Reto Circadiano — Mejora tu sueño en 4 semanas | Food·Mood',
    'reset-antiinflamatorio': 'Postbióticos antiinflamatorios — Reset intestinal 7 días | Food·Mood',
    'equilibrio-hormonal-45': 'Alimentación perimenopausia y menopausia — Reto 28 días | Food·Mood',
    'recupera-tu-energia':    'Recetas para recuperar energía sin cafeína — Reto 7 días | Food·Mood',
    'food-mood-reset':        'Mental Fitness Reset — 21 días para resetear la mente | Food·Mood',
    'microhabitos':           'Microhábitos de nutrición — 21 días sin rutinas | Food·Mood',
    'activa-tu-longevidad':   'Activa tu longevidad — Urolitinas y polifenoles | Food·Mood',
  }

  const title = SLUG_TITLES[slug] ?? `${data.title} — Reto ${data.duration_days} días | Food·Mood`
  const rawDesc = data.subtitle ?? ''
  const description = rawDesc.toLowerCase().includes('reto')
    ? rawDesc
    : `Programa de ${data.duration_days} días · ${data.price_eur}€ · ${rawDesc || 'Nutrición emocional basada en el eje intestino-cerebro.'}`
  const canonicalUrl = `https://www.food-mood.app/retos/${slug}`

  const SLUG_KEYWORDS: Record<string, string[]> = {
    'reset-antiinflamatorio':  ['reset antiinflamatorio postbióticos', 'dieta antiinflamatoria', 'NF-kB alimentación', 'cúrcuma omega-3 butirato', 'fermentados antiinflamación', 'urolitinas intestino'],
    'mejora-tu-sueno':         ['reto circadiano sueño', 'mejorar sueño alimentación', 'crononutrición ritmo circadiano', 'triptófano melatonina alimentos', 'insomnio nutrición', 'magnesio sueño reloj biológico'],
    'recupera-tu-energia':     ['recuperar energía sin cafeína', 'fatiga crónica alimentación', 'energía mitocondrial CoQ10', 'adaptógenos energía', 'energía estable sin estimulantes'],
    'equilibrio-hormonal-45':  ['alimentación perimenopausia menopausia', 'estrobioma hormonal', 'fitoestrógenos dieta', 'urolitinas hormonas', 'alimentación SOP', 'neurofemtech nutrición'],
    'food-mood-reset':         ['mental fitness reset', 'microbioma salud mental', 'psicobióticos ansiedad', 'serotonina intestinal', 'regulación sistema nervioso dieta'],
    'slow-food-mood':          ['cocina lenta ansiedad', 'nervio vago alimentación', 'regulación sistema nervioso cocina', 'slow food bienestar mental', 'fermentados ansiedad'],
    'microhabitos':            ['microhábitos nutrición', 'hábitos alimentarios sostenibles', 'micro-prácticas diarias', 'hábitos saludables sin esfuerzo'],
    'activa-tu-longevidad':    ['urolitinas longevidad', 'polifenoles envejecimiento', 'longevidad alimentación', 'activar longevidad dieta', 'nutraceuticos longevidad'],
  }
  const slugKeywords = SLUG_KEYWORDS[slug] ?? []

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function RetoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!challenge) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let enrollment = null
  let todayContent = null
  let isPremium = false

  if (user) {
    const { data: en } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('challenge_id', challenge.id)
      .maybeSingle()

    enrollment = en

    // Admin and premium/influencer users get free access — auto-grant paid enrollment
    if (!enrollment?.paid) {
      const hasFreeAccess = isUserAdmin(user) || await getPremiumStatus(supabase, user.id)
      isPremium = hasFreeAccess
      if (hasFreeAccess) {
        const today = new Date().toISOString().split('T')[0]
        await supabase
          .from('user_challenges')
          .upsert(
            {
              user_id:     user.id,
              challenge_id: challenge.id,
              start_date:  today,
              paid:        true,
              current_day: enrollment?.current_day ?? 1,
            },
            { onConflict: 'user_id,challenge_id' }
          )
        enrollment = {
          ...(enrollment ?? { id: '', completed: false, completed_at: null, fm_index_start: null, fm_index_end: null }),
          paid:        true,
          current_day: enrollment?.current_day ?? 1,
        } as typeof enrollment
      }
    } else {
      isPremium = true  // already paid = already has access
    }

    if (enrollment?.paid && !enrollment.completed) {
      const { data: day } = await supabase
        .from('challenge_days')
        .select('*')
        .eq('challenge_id', challenge.id)
        .eq('day_number', enrollment.current_day)
        .maybeSingle()

      todayContent = day
    }
  }

  const canonicalUrl = `https://www.food-mood.app/retos/${slug}`

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: challenge.title,
    description: challenge.subtitle ?? `Reto de ${challenge.duration_days} días de nutrición emocional basada en el eje intestino-cerebro.`,
    url: canonicalUrl,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: {
      '@type': 'Offer',
      price: challenge.price_eur ?? 19,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      seller: { '@type': 'Organization', name: 'Food·Mood' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: challenge.title, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(slug)) }} />
      <div className="sr-only">
        <nav aria-label="Ruta de navegación">
          <a href="/">Inicio</a> › <span>{challenge.title}</span>
        </nav>
        <h1>{challenge.title}</h1>
        {challenge.subtitle && <p>{challenge.subtitle}</p>}
        <p>Duración: {challenge.duration_days} días · Precio: {challenge.price_eur ?? 19}€ pago único</p>
      </div>
      <Suspense fallback={null}>
        <RetoDetailClient
          challenge={challenge}
          enrollment={enrollment}
          todayContent={todayContent}
          isAuthenticated={!!user}
          isPremium={isPremium}
        />
      </Suspense>
    </>
  )
}
