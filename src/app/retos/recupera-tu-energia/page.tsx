import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyRetoButton from '@/components/retos/BuyRetoButton'
import type { Metadata } from 'next'

const CANONICAL = 'https://www.food-mood.app/retos/recupera-tu-energia'

export const metadata: Metadata = {
  title:       'Recupera tu energía en 7 días | Food·Mood',
  description: 'Sin cafeína forzada, sin azúcares de rebote. CoQ10, magnesio, hierro y adaptógenos. Protocolo mitocondrial de 7 días basado en evidencia. 19€.',
  alternates: {
    canonical: CANONICAL,
    languages: { es: CANONICAL },
  },
  openGraph: {
    title:       'Recupera tu energía en 7 días | Food·Mood',
    description: 'Protocolo mitocondrial de 7 días. CoQ10, magnesio, hierro y adaptógenos. Sin cafeína forzada. Resultados medibles desde 19€.',
    url:         CANONICAL,
    type:        'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Recupera tu energía en 7 días — Food·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Recupera tu energía en 7 días | Food·Mood',
    description: 'Protocolo mitocondrial de 7 días. CoQ10, magnesio, hierro y adaptógenos. Desde 19€.',
    images:      ['/og-image.png'],
  },
}

const INCLUYE = [
  { icono: '📘', texto: '7 días de protocolo mitocondrial con evidencia' },
  { icono: '🎧', texto: '7 audios de apoyo — uno por día' },
  { icono: '📊', texto: 'Seguimiento diario de energía y ánimo' },
  { icono: '📋', texto: 'Informe personalizado al completar' },
  { icono: '♾️', texto: 'Acceso de por vida al contenido' },
]

const MECANISMOS = [
  { icono: '⚡', titulo: 'CoQ10',              desc: 'Motor de la cadena respiratoria' },
  { icono: '🩸', titulo: 'Hierro + Vit. C',   desc: 'Transporte de oxígeno celular' },
  { icono: '🔋', titulo: 'Magnesio',           desc: 'Activa el ATP producido' },
  { icono: '🐟', titulo: 'Omega-3 DHA',        desc: 'Fluidez de membrana mitocondrial' },
  { icono: '🔬', titulo: 'NAD+',               desc: 'Biogénesis de nuevas mitocondrias' },
  { icono: '🌿', titulo: 'Adaptógenos',        desc: 'Regulación del cortisol' },
]

const HITOS = [
  { dia: 1, titulo: 'Día 1 — empieza el reset.',     desc: 'CoQ10 y la cadena respiratoria.',          color: '#6B2737' },
  { dia: 4, titulo: 'Día 4 — punto de inflexión.',   desc: 'La mayoría nota el cambio aquí.',           color: '#FF6B35' },
  { dia: 7, titulo: 'Día 7 — reset completado.',     desc: 'Informe personalizado. Siguiente reto.',    color: '#4B8A6B' },
]

export default async function RetoEnergiaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let yaComprado  = false
  let challengeId = ''

  const { data: reto } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', 'recupera-tu-energia')
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
    name: 'Recupera tu energía en 7 días',
    description: 'Protocolo mitocondrial de 7 días para recuperar la energía sin cafeína forzada ni azúcares de rebote.',
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
      { '@type': 'ListItem', position: 3, name: 'Recupera tu energía', item: CANONICAL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

      {/* Nav */}
      <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
        <Link href="/" className="text-[13px] font-medium no-underline" style={{ color: '#6B2737' }}>
          ← Inicio
        </Link>
      </div>

      {/* Hero image */}
      <div className="w-full overflow-hidden" style={{ maxHeight: '340px' }}>
        <img
          src="/retos/recupera-tu-energia.jpg"
          alt="Recupera tu energía en 7 días — Food·Mood"
          className="w-full object-cover object-center"
          style={{ maxHeight: '340px' }}
        />
      </div>

      <div className="max-w-[480px] mx-auto px-5 pb-16">

        {/* Hero */}
        <div className="text-center py-10">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium mb-4"
            style={{ background: '#f5eaec', color: '#6B2737' }}>
            <span>⚡</span> 7 días · Basado en evidencia
          </div>

          <h1 className="font-serif text-[28px] font-normal leading-tight mb-3"
            style={{ color: '#2a1a1e' }}>
            Recupera tu energía<br />en una semana
          </h1>

          <p className="text-base font-medium mb-2" style={{ color: '#6B2737' }}>
            Sin cafeína forzada, sin azúcares de rebote.<br />Resultados medibles en 7 días.
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
                style={{ background: '#f5eaec' }}>
                {icono}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: '#6B2737' }}>✓</span>
                <span className="text-sm" style={{ color: '#4a3a3e' }}>{texto}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Los 6 cofactores */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
            Los 6 cofactores del reset
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

          <div className="mt-6 rounded-xl p-3.5" style={{ background: '#f5eaec', borderLeft: '3px solid #6B2737' }}>
            <p className="text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: '#6B2737' }}>
              Al completar
            </p>
            <p className="text-[13px] leading-snug" style={{ color: '#4a3a3e' }}>
              Informe personalizado: índice inicio vs. fin, síntomas mejorados, siguiente reto recomendado.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#9e8080' }}>
            Únete ahora
          </p>
          <p className="text-[36px] font-bold text-center mb-1" style={{ color: '#2a1a1e' }}>19€</p>
          <p className="text-[13px] text-center mb-1.5" style={{ color: '#9e8080' }}>
            Acceso completo · 7 días
          </p>
          <p className="text-xs font-medium text-center mb-4" style={{ color: '#FF6B35' }}>
            Solo quedan algunas plazas esta semana
          </p>
          <BuyRetoButton slug="recupera-tu-energia" challengeId={challengeId} precio={19} yaComprado={yaComprado} />
        </div>

      </div>
    </main>
    </>
  )
}

