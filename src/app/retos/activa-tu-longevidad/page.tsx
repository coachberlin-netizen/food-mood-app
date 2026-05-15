import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BuyRetoButton from '@/components/retos/BuyRetoButton'
import type { Metadata } from 'next'

const CANONICAL = 'https://www.food-mood.app/retos/activa-tu-longevidad'

export const metadata: Metadata = {
  title:       'Activa tu longevidad en 10 dÃ­as â€” Come joven. Siente todo. | FoodÂ·Mood',
  description: 'TelÃ³meros, autofagia, colÃ¡geno y NAD+. 10 mecanismos antiaging activados desde el plato en 10 dÃ­as. Sin suplementos, sin restricciones. Basado en la ciencia de las zonas azules. Desde 19â‚¬.',
  alternates: {
    canonical: CANONICAL,
    languages: { es: CANONICAL },
  },
  openGraph: {
    title:       'Activa tu longevidad en 10 dÃ­as â€” Come joven. Siente todo. | FoodÂ·Mood',
    description: 'TelÃ³meros, autofagia, colÃ¡geno y NAD+. 10 mecanismos antiaging desde el plato. Sin suplementos, sin restricciones. Basado en zonas azules. 19â‚¬.',
    url:         CANONICAL,
    type:        'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Activa tu longevidad en 10 dÃ­as â€” FoodÂ·Mood' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Activa tu longevidad en 10 dÃ­as | FoodÂ·Mood',
    description: 'TelÃ³meros, autofagia, colÃ¡geno y NAD+. 10 mecanismos antiaging desde el plato. Sin suplementos. 19â‚¬.',
    images:      ['/og-image.png'],
  },
}

const COLOR = '#2D6B55'

const INCLUYE = [
  { icono: 'ðŸ§¬', texto: '10 recetas antiaging con mecanismo cientÃ­fico integrado' },
  { icono: 'ðŸŽ§', texto: '10 audios guiados â€” educativos, rituales y cierre' },
  { icono: 'ðŸ“Š', texto: 'Tracking diario de energÃ­a, piel y bienestar' },
  { icono: 'ðŸ“‹', texto: 'Protocolo de longevidad personal al completar' },
  { icono: 'â™¾ï¸', texto: 'Acceso permanente al contenido' },
]

const MECANISMOS = [
  { icono: 'ðŸ§¬', titulo: 'TelÃ³meros',       desc: 'ProtecciÃ³n del ADN con polifenoles' },
  { icono: 'â™»ï¸', titulo: 'Autofagia',        desc: 'Limpieza celular con spermidina' },
  { icono: 'ðŸ¦´', titulo: 'ColÃ¡geno',         desc: 'SÃ­ntesis desde el caldo de huesos' },
  { icono: 'âš¡', titulo: 'NAD+',             desc: 'Sirtuinas y biogÃ©nesis mitocondrial' },
  { icono: 'ðŸ¦ ', titulo: 'Microbioma',       desc: 'Diversidad bacteriana y butirato' },
  { icono: 'ðŸ”¥', titulo: 'Inflammaging',     desc: 'ResoluciÃ³n activa de la inflamaciÃ³n' },
  { icono: 'ðŸ§ ', titulo: 'BDNF',             desc: 'Neuroplasticidad y DHA cerebral' },
  { icono: 'âœ¨', titulo: 'Eje piel-intestino', desc: 'Barrera cutÃ¡nea desde dentro' },
  { icono: 'ðŸŒ™', titulo: 'Reloj circadiano', desc: 'TRE y sincronÃ­a metabÃ³lica' },
  { icono: 'ðŸŒ¿', titulo: 'Zonas azules',     desc: 'El patrÃ³n completo, integrado' },
]

const HITOS = [
  { dia: 1,  titulo: 'DÃ­a 1 â€” seÃ±alizaciÃ³n de longevidad.',  desc: 'TelÃ³meros y antioxidantes. El primer bocado ya cuenta.',   color: COLOR },
  { dia: 5,  titulo: 'DÃ­a 5 â€” punto de inflexiÃ³n interior.', desc: 'Autofagia, colÃ¡geno, NAD+ y microbioma en marcha.',         color: '#C9A84C' },
  { dia: 10, titulo: 'DÃ­a 10 â€” el protocolo es tuyo.',       desc: 'La mesa de las zonas azules. Un estilo de vida, no una dieta.', color: '#4B8A6B' },
]

export default async function RetoLongevidadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let yaComprado  = false
  let challengeId = ''

  const { data: reto } = await supabase
    .from('challenges')
    .select('id')
    .eq('slug', 'activa-tu-longevidad')
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
    name: 'Activa tu longevidad en 10 dÃ­as â€” Come joven. Siente todo.',
    description: 'TelÃ³meros, autofagia, colÃ¡geno, NAD+ y microbioma. 10 mecanismos antiaging activados desde el plato en 10 dÃ­as. Sin suplementos, sin restricciones.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'FoodÂ·Mood' },
    offers: {
      '@type': 'Offer',
      price: 19,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: CANONICAL,
      priceValidUntil: '2026-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '38',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Activa tu longevidad', item: CANONICAL },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Â¿QuÃ© es la autofagia y cÃ³mo se activa con comida?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La autofagia es el mecanismo de limpieza celular mediante el cual la cÃ©lula recicla sus componentes daÃ±ados. Se activa con ayuno intermitente y con alimentos ricos en spermidina como las setas shitake, el trigo germinado y los polifenoles del tÃ© verde (EGCG). El Nobel de Medicina 2016 fue otorgado por este descubrimiento.',
        },
      },
      {
        '@type': 'Question',
        name: 'Â¿QuÃ© alimentos alargan los telÃ³meros?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los telÃ³meros se protegen con vitamina C (fresas, kiwi, pimiento), licopeno (tomate, sandÃ­a, granada), resveratrol (uvas, granada, arÃ¡ndanos), quercetina (cebollas, manzanas, alcaparras) y Ã¡cidos grasos omega-3 del pescado azul. Los probiÃ³ticos vivos del kÃ©fir y el yogur reducen el estrÃ©s oxidativo sistÃ©mico, el principal enemigo de los telÃ³meros.',
        },
      },
      {
        '@type': 'Question',
        name: 'Â¿CÃ³mo subir los niveles de NAD+ de forma natural?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los precursores del NAD+ en alimentos incluyen la niacina (vitamina B3) presente en atÃºn, pollo, cacahuetes y setas; el triptÃ³fano en proteÃ­na animal y legumbres; y el NMN (nicotinamida mononucleÃ³tido) en brÃ³coli, aguacate y edamame. El resveratrol potencia la activaciÃ³n de sirtuinas NAD-dependientes. El ayuno intermitente suave tambiÃ©n eleva el NAD+ de forma significativa.',
        },
      },
      {
        '@type': 'Question',
        name: 'Â¿QuÃ© es la inflammaging y cÃ³mo se reduce con alimentaciÃ³n?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La inflammaging es la inflamaciÃ³n crÃ³nica de bajo grado asociada al envejecimiento y es el denominador comÃºn de enfermedades como el Alzheimer, diabetes tipo 2 y enfermedad cardiovascular. Se reduce con omega-3 (salmÃ³n, sardinas, nueces), curcumina con pimienta negra, polifenoles (frutas del bosque, tÃ© verde, aceite de oliva virgen extra), fibra prebiÃ³tica y fermentados vivos.',
        },
      },
      {
        '@type': 'Question',
        name: 'Â¿QuÃ© es el colÃ¡geno natural y cÃ³mo estimular su sÃ­ntesis?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El colÃ¡geno no se obtiene directamente de los alimentos, sino que se sintetiza en el cuerpo con la materia prima adecuada: vitamina C (imprescindible para la hidroxilaciÃ³n de prolina), glicina y prolina del caldo de huesos cocido lentamente con vinagre, cobre (semillas de girasol), silicio (puerro, avena) y zinc (semillas de calabaza, legumbres). Un caldo de huesos de 3-6 horas con vinagre es el suplemento de colÃ¡geno mÃ¡s biodisponible y econÃ³mico que existe.',
        },
      },
      {
        '@type': 'Question',
        name: 'Â¿CuÃ¡nto dura el reto y quÃ© incluye?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El reto dura 10 dÃ­as e incluye: 10 recetas antiaging con explicaciÃ³n cientÃ­fica, 10 audios guiados (educativos, rituales y cierre), tracking diario, y un protocolo de longevidad personal al completar. El acceso es permanente y el precio es 19â‚¬.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

      {/* Nav */}
      <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
        <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: COLOR }}>
          â† Ver todos los retos
        </Link>
      </div>

      <div className="max-w-[480px] mx-auto px-5 pb-16">

        {/* Hero */}
        <div className="text-center py-10">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium mb-4"
            style={{ background: `${COLOR}18`, color: COLOR }}>
            <span>ðŸŒ¿</span> 10 dÃ­as Â· Ciencia de zonas azules
          </div>

          <h1 className="font-serif text-[28px] font-normal leading-tight mb-3"
            style={{ color: '#2a1a1e' }}>
            Come joven.<br />Siente todo.
          </h1>

          <p className="text-base font-medium mb-2" style={{ color: COLOR }}>
            TelÃ³meros, autofagia, colÃ¡geno y microbioma.<br />10 mecanismos antiaging desde el plato.
          </p>

          <p className="text-[13px] leading-snug" style={{ color: '#9e8080' }}>
            Sin restricciones. Sin sufrimiento. Solo placer muy bien elegido.
          </p>
        </div>

        {/* FilosofÃ­a */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: '#9e8080' }}>
            La premisa
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#4a3a3e' }}>
            Envejecer es inevitable. <span className="font-semibold" style={{ color: COLOR }}>CÃ³mo envejecemos, no.</span>
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(74,58,62,0.75)' }}>
            La ciencia de la longevidad ya no pertenece solo a las clÃ­nicas ni a los suplementos de 200â‚¬. EstÃ¡ en tu cocina. En cÃ³mo combinas los ingredientes. En el momento del dÃ­a en que comes. En las bacterias que cuidas sin saberlo.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(74,58,62,0.75)' }}>
            Cada dÃ­a de este reto activa un mecanismo antiaging diferente. No hay restricciones. No hay sufrimiento. Solo placer muy bien elegido.
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
                style={{ background: `${COLOR}12` }}>
                {icono}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold" style={{ color: COLOR }}>âœ“</span>
                <span className="text-sm" style={{ color: '#4a3a3e' }}>{texto}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Los 10 mecanismos */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6 mb-4">
          <p className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: '#9e8080' }}>
            Los 10 mecanismos antiaging
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

          <div className="mt-6 rounded-xl p-3.5" style={{ background: `${COLOR}0d`, borderLeft: `3px solid ${COLOR}` }}>
            <p className="text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: COLOR }}>
              Al completar
            </p>
            <p className="text-[13px] leading-snug" style={{ color: '#4a3a3e' }}>
              Protocolo de longevidad personal: los 10 mecanismos que activaste, tu mapa nutricional y el patrÃ³n de zonas azules que incorporaste.
            </p>
          </div>
        </div>

        {/* Evidencia cientÃ­fica */}
        <div className="rounded-2xl border p-5 mb-4" style={{ background: `${COLOR}06`, borderColor: `${COLOR}20` }}>
          <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: COLOR }}>
            Basado en
          </p>
          <div className="space-y-2">
            {[
              'Ciencia de zonas azules (Blue Zones, Dan Buettner)',
              'CronobiologÃ­a nutricional y TRE (Satchidananda Panda)',
              'Autofagia y spermidina (Nobel Medicina 2016)',
              'NAD+ y sirtuinas (David Sinclair, Harvard)',
              'Eje intestino-cerebro y inflammaging',
            ].map(item => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: COLOR }}>Â·</span>
                <span className="text-xs leading-snug" style={{ color: 'rgba(74,58,62,0.7)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-[#e8ddd5] p-6">
          <p className="text-[11px] font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#9e8080' }}>
            Ãšnete ahora
          </p>
          <p className="text-[36px] font-bold text-center mb-1" style={{ color: '#2a1a1e' }}>19â‚¬</p>
          <p className="text-[13px] text-center mb-1.5" style={{ color: '#9e8080' }}>
            Acceso completo Â· 10 dÃ­as
          </p>
          <p className="text-xs font-medium text-center mb-4" style={{ color: '#C9A84C' }}>
            Solo quedan algunas plazas esta semana
          </p>
          <BuyRetoButton slug="activa-tu-longevidad" challengeId={challengeId} precio={19} yaComprado={yaComprado} />
        </div>

      </div>
    </main>
    </>
  )
}

