import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyRetoButton from '@/components/retos/BuyRetoButton'
import type { Metadata } from 'next'

const CANONICAL = 'https://www.food-mood.app/retos/reset-antiinflamatorio'

export const metadata: Metadata = {
  title:       'Reset antiinflamatorio en una semana | Food·Mood',
  description: 'Cúrcuma, omega-3, fermentados y polifenoles. Seis vías antiinflamatorias en 7 días con seguimiento real. Basado en evidencia. 19€.',
  alternates: {
    canonical: CANONICAL,
    languages: { es: CANONICAL },
  },
  openGraph: {
    title:       'Reset antiinflamatorio en una semana | Food·Mood',
    description: 'Seis vías antiinflamatorias en 7 días. Cúrcuma, omega-3, fermentados, polifenoles, sulforafano y ayuno nocturno. Desde 19€.',
    url:         CANONICAL,
    type:        'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Reset antiinflamatorio — Food·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Reset antiinflamatorio en una semana | Food·Mood',
    description: 'Seis vías antiinflamatorias en 7 días. Cúrcuma, omega-3, fermentados y más. Desde 19€.',
    images:      ['/og-image.png'],
  },
}

const INCLUYE = [
  { icono: 'ðŸ“˜', texto: '7 días de protocolo antiinflamatorio con evidencia' },
  { icono: 'ðŸŽ§', texto: '7 audios de apoyo (4-8 min)' },
  { icono: 'ðŸ“Š', texto: 'Seguimiento diario de síntomas y bienestar' },
  { icono: 'ðŸ“‹', texto: 'Informe personalizado al completar' },
  { icono: 'â™¾ï¸', texto: 'Acceso de por vida al contenido' },
]

const MECANISMOS = [
  { icono: 'ðŸ§¬', titulo: 'Curcumina + piperina', desc: 'Inhibición directa de NF-ÎºB' },
  { icono: 'ðŸŸ', titulo: 'Omega-3 EPA/DHA',      desc: 'Síntesis de resolvinas y protectinas' },
  { icono: 'ðŸ¦ ', titulo: 'Fermentados',           desc: 'Barrera intestinal anti-LPS' },
  { icono: 'ðŸ«', titulo: 'Polifenoles',           desc: 'Activación de Nrf2 endógeno' },
  { icono: 'ðŸ¥¦', titulo: 'Sulforafano',           desc: 'Detoxificación celular fase II' },
  { icono: 'ðŸŒ™', titulo: 'Ayuno nocturno',        desc: 'Autofagia y limpieza del inflamasoma' },
]

const HITOS = [
  { dia: 1, titulo: 'Día 1 — empieza el reset.',     desc: 'NF-ÎºB inhibido desde la primera leche dorada.',   color: '#5A9B8A' },
  { dia: 4, titulo: 'Día 4 — punto de inflexión.',   desc: 'La mayoría nota cambios aquí. Nrf2 activo.',       color: '#C9A84C' },
  { dia: 7, titulo: 'Día 7 — reset completado.',     desc: 'Informe personalizado. Seis vías trabajadas.',     color: '#4B8A6B' },
]

export default async function RetoAntiinflamatorioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let yaComprado  = false
  let challengeId = ''

  const { data: reto } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', 'reset-antiinflamatorio')
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
    name: 'Reset antiinflamatorio en una semana',
    description: 'Seis vías antiinflamatorias en 7 días. Cúrcuma, omega-3, fermentados, polifenoles, sulforafano y ayuno nocturno.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: { '@type': 'Offer', price: 19, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Reset antiinflamatorio', item: CANONICAL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

      {/* Nav */}
      <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
        <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: '#5A9B8A' }}>
          â† Ver todos los retos
        </Link>
      </div>

      <div className="max-w-[480px] mx-auto px-5 pb-16">

        {/* Hero */}
        <div className="text-center py-10">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium mb-4"
            style={{ background: '#e8f4f1', color: '#5A9B8A' }}>
            <span>ðŸŒ¿</span> 7 días · Basado en evidencia
          </div>

          <h1 className="font-serif text-[28px] font-normal leading-tight mb-3"
            style={{ color: '#2a1a1e' }}>
            Reset antiinflamatorio<br />en una semana
          </h1>

          <p className="text-base font-medium mb-2" style={{ color: '#5A9B8A' }}>
            Cúrcuma, omega-3, fermentados.<br />Seis vías. Siete días.
          </p>

          <p className="text-[13px] leading-snug" style={{ color: '#9e8080' }}>
            Seguimiento real con tu índice Food·Mood
          </p>
        </div>

        {/* Qué incluye */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
            Qué incluye
          </p>
          {INCLUYE.map(({ icono, texto }) => (
            <div key={texto} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: '#e8f4f1' }}>
                {icono}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: '#5A9B8A' }}>âœ“</span>
                <span className="text-sm" style={{ color: '#4a3a3e' }}>{texto}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Los 6 mecanismos */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
            Las 6 vías antiinflamatorias
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {MECANISMOS.map(({ icono, titulo, desc }) => (
              <div key={titulo} className="rounded-xl border border-[#e8ddd5] p-3"
                style={{ background: '#fafaf8' }}>
                <div className="text-xl mb-1.5">{icono}</div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: '#2a1a1e' }}>{titulo}</p>
                <p className="text-[11px] leading-snug" style={{ color: '#9e8080' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-5" style={{ color: '#9e8080' }}>
            Cómo funciona
          </p>

          <div className="relative">
            <div className="absolute left-5 top-6 w-0.5 bg-[#e8ddd5]" style={{ height: 'calc(100% - 48px)' }} />
            {HITOS.map(({ dia, titulo, desc, color }, i) => (
              <div key={dia} className="flex gap-4 relative" style={{ marginBottom: i < HITOS.length - 1 ? '24px' : 0 }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 z-10"
                  style={{ background: color }}>
                  {dia}
                </div>
                <div className="pt-2">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: '#2a1a1e' }}>{titulo}</p>
                  <p className="text-xs leading-snug" style={{ color: '#9e8080' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl p-3.5" style={{ background: '#e8f4f1', borderLeft: '3px solid #5A9B8A' }}>
            <p className="text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#5A9B8A' }}>
              Al completar
            </p>
            <p className="text-[13px] leading-snug" style={{ color: '#4a3a3e' }}>
              Informe personalizado: índice inflamación inicio vs. fin, vías más efectivas para ti, protocolo permanente recomendado.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#9e8080' }}>
            Ãšnete ahora
          </p>
          <p className="text-[36px] font-bold text-center mb-1" style={{ color: '#2a1a1e' }}>19€</p>
          <p className="text-[13px] text-center mb-1.5" style={{ color: '#9e8080' }}>
            Acceso completo · 7 días
          </p>
          <p className="text-xs font-medium text-center mb-4" style={{ color: '#C9A84C' }}>
            Solo quedan algunas plazas esta semana
          </p>
          <BuyRetoButton slug="reset-antiinflamatorio" challengeId={challengeId} precio={19} yaComprado={yaComprado} />
        </div>

      </div>
    </main>
    </>
  )
}

