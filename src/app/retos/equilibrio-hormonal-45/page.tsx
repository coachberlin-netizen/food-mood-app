import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyRetoButton from '@/components/retos/BuyRetoButton'
import BaseCientifica from './BaseCientifica'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const CANONICAL = 'https://www.food-mood.app/retos/equilibrio-hormonal-45'

export const metadata: Metadata = {
  title: 'Equilibrio hormonal después de los 45 — 28 días | Food·Mood',
  description:
    'Programa de 28 días de alimentación y hábitos para apoyar la salud hormonal en perimenopausia, SOP y estrés crónico. Basado en evidencia. 39€, acceso de por vida.',
  alternates: {
    canonical: CANONICAL,
    languages: { es: CANONICAL },
  },
  openGraph: {
    title: 'Equilibrio hormonal después de los 45 | Food·Mood',
    description:
      'Programa de 28 días de alimentación, microbiota y hábitos para acompañar la perimenopausia y el SOP. Basado en evidencia. 39€.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Equilibrio hormonal después de los 45 — Food·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Equilibrio hormonal después de los 45 | Food·Mood',
    description: '28 días de alimentación y hábitos para perimenopausia y SOP. Microbiota, fitoestrógenos, cronobiología. Desde 39€.',
    images:      ['/og-image.png'],
  },
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Para quién es este programa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para mujeres en perimenopausia, con SOP, o con síntomas relacionados con el estrés crónico que quieren apoyar su salud hormonal a través de la alimentación y los hábitos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Este programa sustituye al tratamiento médico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Está diseñado como apoyo nutricional y de hábitos. No sustituye valoración médica, analíticas ni tratamiento farmacológico cuando está indicado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo requiere cada día?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entre 10 y 20 minutos: leer la receta del día, escuchar el audio de apoyo y registrar tu seguimiento. Todo está diseñado para integrarse en una rutina real.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si no termino los 28 días?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tienes acceso de por vida al contenido. Puedes retomarlo cuando quieras y a tu ritmo.',
      },
    },
  ],
}

const INCLUYE = [
  { icono: 'ðŸ“˜', texto: '28 días de protocolo con recetas funcionales' },
  { icono: 'ðŸŽ§', texto: '4 audios de apoyo (cronobiología, estrés, sueño, microbiota)' },
  { icono: 'ðŸ“Š', texto: 'Seguimiento diario de síntomas, energía y bienestar' },
  { icono: 'ðŸ“‹', texto: 'Seguimiento de progreso inicio vs. fin' },
  { icono: 'â™¾ï¸', texto: 'Acceso de por vida al contenido' },
]

const EJES = [
  { icono: 'ðŸ§¬', titulo: 'Microbiota y estroboloma', desc: 'Eje microbiotaâ€‘estrógenos' },
  { icono: 'ðŸ¥‘', titulo: 'Grasas y colesterol',      desc: 'Precursores hormonales' },
  { icono: 'ðŸŒ¿', titulo: 'Fitoestrógenos',            desc: 'Modulación hormonal suave' },
  { icono: 'ðŸµ', titulo: 'Triptófano y serotonina',  desc: 'Sueño y estado de ánimo' },
  { icono: 'ðŸ¥¦', titulo: 'Sulforafano y DIM',         desc: 'Metabolismo de estrógenos' },
  { icono: 'ðŸŒ™', titulo: 'Cronobiología',             desc: 'Ritmo circadiano y hábitos' },
]

const HITOS = [
  {
    dia: '1–7',
    titulo: 'Semana 1 — base metabólica',
    desc: 'Reset de inflamación de base. Microbiota, fibra y fermentados.',
    color: '#7B4B8C',
  },
  {
    dia: '8–14',
    titulo: 'Semana 2 — eje intestino-hormonal',
    desc: 'Estroboloma activo. Fitoestrógenos y crucíferas.',
    color: '#9A6BAA',
  },
  {
    dia: '15–21',
    titulo: 'Semana 3 — sueño y sistema nervioso',
    desc: 'Triptófano, cronobiología y gestión del cortisol.',
    color: '#B48DC0',
  },
  {
    dia: '22–28',
    titulo: 'Semana 4 — consolidación',
    desc: 'Protocolo permanente. Consolidación del equilibrio hormonal.',
    color: '#C9A84C',
  },
]

export default async function EquilibrioHormonalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let yaComprado   = false
  let challengeId  = ''

  const { data: reto } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', 'equilibrio-hormonal-45')
    .single()

  if (reto) {
    challengeId = reto.id
    if (user) {
      const { data: purchase } = await supabase
        .from('user_challenges')
        .select('id')
        .eq('user_id', user.id)
        .eq('challenge_id', reto.id)
        .eq('paid', true)
        .maybeSingle()

      yaComprado = !!purchase
    }
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Equilibrio hormonal después de los 45',
    description: 'Programa de 28 días de alimentación y hábitos para la salud hormonal en perimenopausia, SOP y estrés crónico.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: { '@type': 'Offer', price: 39, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Equilibrio hormonal después de los 45', item: CANONICAL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

        {/* Nav */}
        <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
          <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: '#7B4B8C' }}>
            â† Ver todos los retos
          </Link>
        </div>

        {/* Hero image */}
        <div className="w-full overflow-hidden" style={{ maxHeight: '340px' }}>
          <img
            src="/retos/equilibrio-hormonal-45.jpg"
            alt="Equilibrio hormonal y estrobioma — Food·Mood"
            className="w-full object-cover object-center"
            style={{ maxHeight: '340px' }}
          />
        </div>

        <div className="max-w-[480px] mx-auto px-5 pb-16">

          {/* Hero */}
          <div className="text-center py-10">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium mb-4"
              style={{ background: '#f3edf7', color: '#7B4B8C' }}
            >
              <span>ðŸŒ¸</span> 28 días · Basado en evidencia
            </div>

            <h1
              className="font-serif text-[28px] font-normal leading-tight mb-3"
              style={{ color: '#2a1a1e' }}
            >
              Equilibrio hormonal<br />después de los 45
            </h1>

            <p className="text-base font-medium mb-2" style={{ color: '#7B4B8C' }}>
              Microbiota, cronobiología y hábitos.<br />
              Cuatro semanas. Cambio medible.
            </p>

            <p className="text-[13px] leading-snug" style={{ color: '#9e8080' }}>
              Para perimenopausia, SOP y estrés crónico
            </p>
          </div>

          {/* Qué incluye */}
          <div
            id="que-incluye"
            className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4"
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-4"
              style={{ color: '#9e8080' }}
            >
              Qué incluye
            </p>
            {INCLUYE.map(({ icono, texto }) => (
              <div key={texto} className="flex items-center gap-3 mb-3 last:mb-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background: '#f3edf7' }}
                >
                  {icono}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: '#7B4B8C' }}>âœ“</span>
                  <span className="text-sm" style={{ color: '#4a3a3e' }}>{texto}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Los 6 ejes */}
          <div
            id="como-funciona"
            className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4"
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-4"
              style={{ color: '#9e8080' }}
            >
              Los 6 ejes del programa
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {EJES.map(({ icono, titulo, desc }) => (
                <div
                  key={titulo}
                  className="rounded-xl border border-[#e8ddd5] p-3"
                  style={{ background: '#fafaf8' }}
                >
                  <div className="text-xl mb-1.5">{icono}</div>
                  <p className="text-[13px] font-semibold mb-0.5" style={{ color: '#2a1a1e' }}>{titulo}</p>
                  <p className="text-[11px] leading-snug" style={{ color: '#9e8080' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cómo funciona — 4 semanas */}
          <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-5"
              style={{ color: '#9e8080' }}
            >
              Las 4 semanas
            </p>
            <div className="relative">
              <div
                className="absolute left-5 top-6 w-0.5 bg-[#e8ddd5]"
                style={{ height: 'calc(100% - 48px)' }}
              />
              {HITOS.map(({ dia, titulo, desc, color }, i) => (
                <div
                  key={dia}
                  className="flex gap-4 relative"
                  style={{ marginBottom: i < HITOS.length - 1 ? '24px' : 0 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 z-10"
                    style={{ background: color }}
                  >
                    {dia}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: '#2a1a1e' }}>{titulo}</p>
                    <p className="text-xs leading-snug" style={{ color: '#9e8080' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 rounded-xl p-3.5"
              style={{ background: '#f3edf7', borderLeft: '3px solid #7B4B8C' }}
            >
              <p
                className="text-[11px] font-medium uppercase tracking-widest mb-1.5"
                style={{ color: '#7B4B8C' }}
              >
                Al completar
              </p>
              <p className="text-[13px] leading-snug" style={{ color: '#4a3a3e' }}>
                Protocolo permanente personalizado para mantener tu equilibrio hormonal.
              </p>
            </div>
          </div>

          {/* CTA principal */}
          <div
            id="unete"
            className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4"
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest text-center mb-2"
              style={{ color: '#9e8080' }}
            >
              Ãšnete ahora
            </p>
            <p className="text-[36px] font-bold text-center mb-1" style={{ color: '#2a1a1e' }}>39€</p>
            <p className="text-[13px] text-center mb-1.5" style={{ color: '#9e8080' }}>
              Acceso completo · 28 días
            </p>
            <p className="text-xs font-medium text-center mb-4" style={{ color: '#C9A84C' }}>
              Pago único · Acceso de por vida
            </p>
            <BuyRetoButton slug="equilibrio-hormonal-45" challengeId={challengeId} precio={39} yaComprado={yaComprado} />
          </div>

          {/* Base científica — acordeón */}
          <BaseCientifica />

          {/* Testimonios placeholder */}
          <div
            id="testimonios"
            className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4"
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-4"
              style={{ color: '#9e8080' }}
            >
              Qué dicen las participantes
            </p>
            {[
              { texto: 'A la semana 3 noté una diferencia real en el sueño. Llevaba meses sin dormir bien.', nombre: 'M.G., 48 años' },
              { texto: 'Por fin un programa que explica el porqué de cada cosa. No solo "come esto".', nombre: 'L.R., 44 años' },
              { texto: 'Con SOP llevo años buscando algo así. Estructurado, basado en ciencia y que se puede hacer.', nombre: 'C.A., 36 años' },
            ].map(({ texto, nombre }) => (
              <div
                key={nombre}
                className="mb-4 last:mb-0 rounded-xl p-4"
                style={{ background: '#fafaf8', border: '1px solid #e8ddd5' }}
              >
                <p className="text-[13px] leading-relaxed mb-2" style={{ color: '#4a3a3e' }}>
                  &ldquo;{texto}&rdquo;
                </p>
                <p className="text-[11px] font-semibold" style={{ color: '#9e8080' }}>{nombre}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div
            id="preguntas-frecuentes"
            className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4"
          >
            <p
              className="text-[11px] font-medium uppercase tracking-widest mb-4"
              style={{ color: '#9e8080' }}
            >
              Preguntas frecuentes
            </p>
            {[
              { q: '¿Para quién es este programa?', a: 'Para mujeres en perimenopausia, con SOP, o con síntomas relacionados con el estrés crónico que quieren apoyar su salud hormonal a través de la alimentación y los hábitos.' },
              { q: '¿Sustituye al tratamiento médico?', a: 'No. Está diseñado como apoyo nutricional y de hábitos. No sustituye valoración médica, analíticas ni tratamiento farmacológico cuando está indicado.' },
              { q: '¿Cuánto tiempo requiere cada día?', a: 'Entre 10 y 20 minutos: leer la receta del día, escuchar el audio y registrar tu seguimiento. Todo está diseñado para una rutina real.' },
              { q: '¿Qué pasa si no termino los 28 días?', a: 'Tienes acceso de por vida. Puedes retomarlo cuando quieras y a tu ritmo.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-[#e8ddd5] py-4 last:border-0 last:pb-0">
                <p className="text-sm font-semibold mb-1.5" style={{ color: '#2a1a1e' }}>{q}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: '#9e8080' }}>{a}</p>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6">
            <p className="text-[13px] text-center mb-4 leading-relaxed" style={{ color: '#9e8080' }}>
              28 días. Estructura clara. Evidencia real.
            </p>
            <BuyRetoButton slug="equilibrio-hormonal-45" challengeId={challengeId} precio={39} yaComprado={yaComprado} />
          </div>

        </div>
      </main>
    </>
  )
}

