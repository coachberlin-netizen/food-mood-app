import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyRetoButton from '@/components/retos/BuyRetoButton'
import type { Metadata } from 'next'

const CANONICAL = 'https://www.food-mood.app/retos/recupera-tu-energia'

export const metadata: Metadata = {
  title:       'Recupera tu energÃ­a en 7 dÃ­as | FoodÂ·Mood',
  description: 'Sin cafeÃ­na forzada, sin azÃºcares de rebote. CoQ10, magnesio, hierro y adaptÃ³genos. Protocolo mitocondrial de 7 dÃ­as basado en evidencia. 19â‚¬.',
  alternates: {
    canonical: CANONICAL,
    languages: { es: CANONICAL },
  },
  openGraph: {
    title:       'Recupera tu energÃ­a en 7 dÃ­as | FoodÂ·Mood',
    description: 'Protocolo mitocondrial de 7 dÃ­as. CoQ10, magnesio, hierro y adaptÃ³genos. Sin cafeÃ­na forzada. Resultados medibles desde 19â‚¬.',
    url:         CANONICAL,
    type:        'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Recupera tu energÃ­a en 7 dÃ­as â€” FoodÂ·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Recupera tu energÃ­a en 7 dÃ­as | FoodÂ·Mood',
    description: 'Protocolo mitocondrial de 7 dÃ­as. CoQ10, magnesio, hierro y adaptÃ³genos. Desde 19â‚¬.',
    images:      ['/og-image.png'],
  },
}

const INCLUYE = [
  { icono: 'ðŸ“˜', texto: '7 dÃ­as de protocolo mitocondrial con evidencia' },
  { icono: 'ðŸŽ§', texto: '7 audios de apoyo â€” uno por dÃ­a' },
  { icono: 'ðŸ“Š', texto: 'Seguimiento diario de energÃ­a y Ã¡nimo' },
  { icono: 'ðŸ“‹', texto: 'Informe personalizado al completar' },
  { icono: 'â™¾ï¸', texto: 'Acceso de por vida al contenido' },
]

const MECANISMOS = [
  { icono: 'âš¡', titulo: 'CoQ10',              desc: 'Motor de la cadena respiratoria' },
  { icono: 'ðŸ©¸', titulo: 'Hierro + Vit. C',   desc: 'Transporte de oxÃ­geno celular' },
  { icono: 'ðŸ”‹', titulo: 'Magnesio',           desc: 'Activa el ATP producido' },
  { icono: 'ðŸŸ', titulo: 'Omega-3 DHA',        desc: 'Fluidez de membrana mitocondrial' },
  { icono: 'ðŸ”¬', titulo: 'NAD+',               desc: 'BiogÃ©nesis de nuevas mitocondrias' },
  { icono: 'ðŸŒ¿', titulo: 'AdaptÃ³genos',        desc: 'RegulaciÃ³n del cortisol' },
]

const HITOS = [
  { dia: 1, titulo: 'DÃ­a 1 â€” empieza el reset.',     desc: 'CoQ10 y la cadena respiratoria.',          color: '#6B2737' },
  { dia: 4, titulo: 'DÃ­a 4 â€” punto de inflexiÃ³n.',   desc: 'La mayorÃ­a nota el cambio aquÃ­.',           color: '#C9A84C' },
  { dia: 7, titulo: 'DÃ­a 7 â€” reset completado.',     desc: 'Informe personalizado. Siguiente reto.',    color: '#4B8A6B' },
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
    name: 'Recupera tu energÃ­a en 7 dÃ­as',
    description: 'Protocolo mitocondrial de 7 dÃ­as para recuperar la energÃ­a sin cafeÃ­na forzada ni azÃºcares de rebote.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'FoodÂ·Mood' },
    offers: { '@type': 'Offer', price: 19, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Recupera tu energÃ­a', item: CANONICAL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

      {/* Nav */}
      <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
        <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: '#6B2737' }}>
          â† Ver todos los retos
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
            <span>âš¡</span> 7 dÃ­as Â· Basado en evidencia
          </div>

          <h1 className="font-serif text-[28px] font-normal leading-tight mb-3"
            style={{ color: '#2a1a1e' }}>
            Recupera tu energÃ­a<br />en una semana
          </h1>

          <p className="text-base font-medium mb-2" style={{ color: '#6B2737' }}>
            Sin cafeÃ­na forzada, sin azÃºcares de rebote.<br />Resultados medibles en 7 dÃ­as.
          </p>

          <p className="text-[13px] leading-snug" style={{ color: '#9e8080' }}>
            Seguimiento real con tu Ã­ndice FoodÂ·Mood
          </p>
        </div>

        {/* QuÃ© incluye */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
            QuÃ© incluye
          </p>
          {INCLUYE.map(({ icono, texto }) => (
            <div key={texto} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                style={{ background: '#f5eaec' }}>
                {icono}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: '#6B2737' }}>âœ“</span>
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

        {/* CÃ³mo funciona */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-5" style={{ color: '#9e8080' }}>
            CÃ³mo funciona
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
              Informe personalizado: Ã­ndice inicio vs. fin, sÃ­ntomas mejorados, siguiente reto recomendado.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#9e8080' }}>
            Ãšnete ahora
          </p>
          <p className="text-[36px] font-bold text-center mb-1" style={{ color: '#2a1a1e' }}>19â‚¬</p>
          <p className="text-[13px] text-center mb-1.5" style={{ color: '#9e8080' }}>
            Acceso completo Â· 7 dÃ­as
          </p>
          <p className="text-xs font-medium text-center mb-4" style={{ color: '#C9A84C' }}>
            Solo quedan algunas plazas esta semana
          </p>
          <BuyRetoButton slug="recupera-tu-energia" challengeId={challengeId} precio={19} yaComprado={yaComprado} />
        </div>

      </div>
    </main>
    </>
  )
}

