import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MicrohabitosCTA from './MicrohabitosCTA'

export const dynamic = 'force-dynamic'

const CANONICAL = 'https://www.food-mood.app/retos/microhabitos'

export const metadata: Metadata = {
  title: 'MicrohÃ¡bitos â€" 21 dÃ­as para crear hÃ¡bitos sin fuerza de voluntad | FoodÂ·Mood',
  description: 'Crea hÃ¡bitos que duran con Tiny Habits, ancla hedÃ³nica y bebidas fermentadas. 21 dÃ­as de psicologÃ­a del comportamiento. Sin disciplina. Desde 29â‚¬.',
  alternates: {
    canonical: CANONICAL,
    languages: { 'es': CANONICAL },
  },
  openGraph: {
    title: 'MicrohÃ¡bitos â€" 21 dÃ­as para crear hÃ¡bitos sin fuerza de voluntad',
    description: 'Tiny Habits, ancla hedÃ³nica y bebidas fermentadas como motor de cambio real. 21 dÃ­as. Sin disciplina. Desde 29â‚¬.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MicrohÃ¡bitos FoodÂ·Mood â€" 21 dÃ­as para crear hÃ¡bitos sin fuerza de voluntad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicrohÃ¡bitos â€" 21 dÃ­as para crear hÃ¡bitos sin fuerza de voluntad',
    description: 'Tiny Habits + ancla hedÃ³nica + bebidas funcionales fermentadas. PsicologÃ­a real del comportamiento. 21 dÃ­as, 29â‚¬.',
    images: ['/og-image.png'],
  },
}

// â"€â"€ Contenido estÃ¡tico â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const FASES = [
  {
    num: '01',
    nombre: 'PREPARAR',
    dias: 'DÃ­as 1â€"7',
    concepto: 'Tiny Habits Â· DiseÃ±o de entorno Â· Ancla hedÃ³nica Â· Identidad Â· Dopamina Â· AutocompasiÃ³n',
    descripcion: 'Construyes el andamio. Cada hÃ¡bito es tan pequeÃ±o que la resistencia desaparece. Cada bebida crea una asociaciÃ³n placerâ€"acciÃ³n en tu circuito de dopamina.',
    hito: 'DÃ­a 7 â€" Elixir de celebraciÃ³n: kÃ©fir con vainilla, dÃ¡til y cacao',
    color: '#C9A84C',
  },
  {
    num: '02',
    nombre: 'REFORZAR',
    dias: 'DÃ­as 8â€"14',
    concepto: 'Protocolo de obstÃ¡culos Â· Never miss twice Â· SeÃ±ales mÃºltiples Â· Flexibilidad cognitiva Â· Refuerzo inmediato',
    descripcion: 'El entusiasmo baja â€" y eso es exactamente el entrenamiento. Aprendes a mantener el hÃ¡bito cuando no es conveniente. Eso es lo que lo vuelve permanente.',
    hito: 'DÃ­a 14 â€" Gran elixir: kombucha de hibisco, fresas y albahaca',
    color: '#8B6914',
  },
  {
    num: '03',
    nombre: 'INTEGRAR',
    dias: 'DÃ­as 15â€"21',
    concepto: 'Automaticidad Â· Yo futuro Â· Identidad consolidada Â· Resiliencia Â· Ancla sensorial Â· Plan post-reto',
    descripcion: 'El hÃ¡bito empieza a ocurrir solo. Lo trasladamos del cÃ³rtex prefrontal a los ganglios basales â€" de decisiÃ³n consciente a comportamiento automÃ¡tico.',
    hito: 'DÃ­a 21 â€" El Gran Reset: kÃ©fir con vainilla bean, miel cruda y pÃ©talos de rosa',
    color: '#6B2737',
  },
]

const BEBIDAS = [
  { dia: 1,  nombre: 'Limonada de limÃ³n fermentado, jengibre y cÃºrcuma',       fase: 'preparar' },
  { dia: 2,  nombre: 'KÃ©fir cremoso con arÃ¡ndanos silvestres y lavanda',        fase: 'preparar' },
  { dia: 3,  nombre: 'Kombucha de menta fresca y lima',                          fase: 'preparar' },
  { dia: 4,  nombre: 'Agua de kÃ©fir con frambuesas y agua de rosas',             fase: 'preparar' },
  { dia: 5,  nombre: 'Smoothie tropical de mango, kÃ©fir y cardamomo',            fase: 'preparar' },
  { dia: 6,  nombre: 'Limonada de hibisco fermentada con miel de flores',        fase: 'preparar' },
  { dia: 7,  nombre: 'âœ¨ Elixir de celebraciÃ³n â€" kÃ©fir, vainilla, dÃ¡til, cacao', fase: 'preparar' },
  { dia: 8,  nombre: 'Shot de adaptÃ³genos: ashwagandha, maca y cacao',           fase: 'reforzar' },
  { dia: 9,  nombre: 'Agua de kÃ©fir con membrillo y canela',                     fase: 'reforzar' },
  { dia: 10, nombre: 'TÃ© de hongos reishi con leche de avena fermentada',        fase: 'reforzar' },
  { dia: 11, nombre: 'KÃ©fir de cabra con pera madura y nuez tostada',            fase: 'reforzar' },
  { dia: 12, nombre: 'Jugo verde fermentado: pepino, apio, manzana, kombucha',   fase: 'reforzar' },
  { dia: 13, nombre: 'Lassi tropical de mango, kÃ©fir y cÃºrcuma dorada',          fase: 'reforzar' },
  { dia: 14, nombre: 'âœ¨ Gran elixir: kombucha de hibisco, fresas y albahaca',    fase: 'reforzar' },
  { dia: 15, nombre: 'TÃ³nica de kÃ©fir con limÃ³n Meyer y miel de manuka',         fase: 'integrar' },
  { dia: 16, nombre: 'Batido cremoso de plÃ¡tano, kÃ©fir y tahini',                fase: 'integrar' },
  { dia: 17, nombre: 'Kombucha de cereza y cacao oscuro',                         fase: 'integrar' },
  { dia: 18, nombre: 'Agua de kÃ©fir con naranja sanguina y cardamomo',            fase: 'integrar' },
  { dia: 19, nombre: 'Smoothie bowl de kÃ©fir con frutos rojos y cacao',           fase: 'integrar' },
  { dia: 20, nombre: 'Elixir nocturno: kÃ©fir, ashwagandha, miel y pimienta',     fase: 'integrar' },
  { dia: 21, nombre: 'âœ¨ El Gran Reset â€" kÃ©fir, vainilla bean y pÃ©talos de rosa', fase: 'integrar' },
]

const MECANISMOS = [
  { icono: 'ðŸ§ ', titulo: 'Tiny Habits', texto: 'HÃ¡bitos tan pequeÃ±os que la resistencia desaparece. BJ Fogg, Stanford.' },
  { icono: 'ðŸ¡', titulo: 'DiseÃ±o de entorno', texto: 'El entorno decide el 80% de tu comportamiento. Sin esfuerzo consciente.' },
  { icono: 'ðŸ‹', titulo: 'Ancla hedÃ³nica', texto: 'Cada bebida crea una asociaciÃ³n placerâ€"hÃ¡bito en tu circuito dopaminÃ©rgico.' },
  { icono: 'ðŸªž', titulo: 'Identidad', texto: 'Los hÃ¡bitos que duran vienen de quiÃ©n eres, no de lo que quieres lograr.' },
  { icono: 'âš¡', titulo: 'AnticipaciÃ³n', texto: 'La dopamina se libera anticipando el placer. Usas el deseo a tu favor.' },
  { icono: 'ðŸ’›', titulo: 'AutocompasiÃ³n', texto: 'La autocrÃ­tica apaga la motivaciÃ³n. La autocompasiÃ³n la enciende. Kristin Neff.' },
  { icono: 'ðŸ›¡ï¸', titulo: 'Protocolo de obstÃ¡culos', texto: 'WOOP + implementation intentions. Los obstÃ¡culos planificados no bloquean.' },
  { icono: 'ðŸ"', titulo: 'Automaticidad', texto: 'El hÃ¡bito pasa del cÃ³rtex prefrontal a los ganglios basales. Ya no requiere decisiÃ³n.' },
]

const FAQ = [
  {
    q: 'Â¿Necesito experiencia previa con fermentados o kÃ©fir?',
    a: 'No. Las bebidas son sencillas â€" la mÃ¡s compleja tarda 5 minutos. Muchos ingredientes ya estÃ¡n en tu nevera. Si no encuentras kÃ©fir, damos alternativas para cada receta.',
  },
  {
    q: 'Â¿CuÃ¡nto tiempo necesito cada dÃ­a?',
    a: 'El micro-hÃ¡bito principal son 30 segundos a 5 minutos. La bebida, 2-5 minutos de preparaciÃ³n. El diario, 3-5 minutos. En total: menos de 10 minutos diarios.',
  },
  {
    q: 'Â¿QuÃ© pasa si me salto un dÃ­a?',
    a: 'Nada. El reto incluye especÃ­ficamente el mÃ³dulo "never miss twice" â€" y una versiÃ³n mÃ­nima de cada dÃ­a para cuando la vida se complica. El hÃ¡bito imperfecto que ocurre gana al perfecto que no pasa.',
  },
  {
    q: 'Â¿En quÃ© se diferencia del FoodÂ·Mood Reset o del Slow FoodÂ·Mood?',
    a: 'FoodÂ·Mood Reset trabaja el eje intestino-cerebro desde la nutriciÃ³n. Slow FoodÂ·Mood trabaja la ansiedad desde la cocina lenta. MicrohÃ¡bitos trabaja los hÃ¡bitos â€" cÃ³mo crearlos, fijarlos y hacerlos automÃ¡ticos. Son complementarios.',
  },
  {
    q: 'Â¿Funciona si ya he intentado cambiar hÃ¡bitos antes sin Ã©xito?',
    a: 'Especialmente para ti. Este reto parte de la premisa de que los intentos anteriores fallaron por diseÃ±o, no por falta de voluntad. El placer como mecanismo â€" no como recompensa â€" funciona de forma diferente en el cerebro.',
  },
  {
    q: 'Â¿Tengo acceso permanente al contenido?',
    a: 'SÃ­. Una vez comprado, el contenido es tuyo para siempre. Puedes repetir el reto, revisitar dÃ­as, o usarlo como referencia cuando necesites reinstalar un hÃ¡bito.',
  },
]

// â"€â"€ Structured data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Â¿Necesito experiencia previa con fermentados o kÃ©fir para hacer el reto MicrohÃ¡bitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Las bebidas son sencillas â€" la mÃ¡s compleja tarda 5 minutos. Muchos ingredientes ya estÃ¡n en tu nevera. Si no encuentras kÃ©fir, damos alternativas para cada receta.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿CuÃ¡nto tiempo necesito cada dÃ­a para el reto de microhÃ¡bitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Menos de 10 minutos diarios. El micro-hÃ¡bito principal son 30 segundos a 5 minutos. La bebida, 2-5 minutos de preparaciÃ³n. El diario, 3-5 minutos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿QuÃ© pasa si me salto un dÃ­a del reto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nada. El reto incluye especÃ­ficamente el mÃ³dulo "never miss twice" y una versiÃ³n mÃ­nima de cada dÃ­a para cuando la vida se complica. El hÃ¡bito imperfecto que ocurre gana al perfecto que no pasa.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿En quÃ© se diferencia MicrohÃ¡bitos del FoodÂ·Mood Reset o del Slow FoodÂ·Mood?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FoodÂ·Mood Reset trabaja el eje intestino-cerebro desde la nutriciÃ³n. Slow FoodÂ·Mood trabaja la ansiedad desde la cocina lenta. MicrohÃ¡bitos trabaja los hÃ¡bitos â€" cÃ³mo crearlos, fijarlos y hacerlos automÃ¡ticos usando el placer como mecanismo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿Funciona si ya he intentado cambiar hÃ¡bitos antes y he fracasado?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Especialmente para ti. Este programa parte de que los intentos anteriores fallaron por diseÃ±o, no por falta de voluntad. El placer como mecanismo â€" no como recompensa â€" activa el circuito dopaminÃ©rgico de forma diferente al enfoque basado en disciplina.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿QuÃ© es el ancla hedÃ³nica y por quÃ© funciona para crear hÃ¡bitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El ancla hedÃ³nica es un estÃ­mulo placentero (en este caso una bebida funcional fermentada) que se asocia repetidamente a un micro-hÃ¡bito. Cada vez que el cerebro experimenta placer, libera dopamina y graba la ruta neural que llevÃ³ a ese placer. DespuÃ©s de 21 repeticiones, el hÃ¡bito ocurre de forma automÃ¡tica.',
      },
    },
    {
      '@type': 'Question',
      name: 'Â¿Tengo acceso permanente al contenido del reto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SÃ­. Una vez comprado, el contenido es tuyo para siempre. Puedes repetir el reto, revisitar dÃ­as, o usarlo como referencia cuando necesites reinstalar un hÃ¡bito. Precio Ãºnico de 29â‚¬.',
      },
    },
  ],
}

const COURSE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'MicrohÃ¡bitos â€" 21 dÃ­as para crear hÃ¡bitos con placer',
  description: 'Programa de 21 dÃ­as basado en psicologÃ­a del comportamiento (Tiny Habits, Environment Design, Hedonic Anchoring) para crear hÃ¡bitos duraderos usando el placer como mecanismo neurolÃ³gico, no como recompensa.',
  url: CANONICAL,
  image: 'https://www.food-mood.app/og-image.png',
  provider: { '@type': 'Organization', name: 'FoodÂ·Mood', url: 'https://www.food-mood.app' },
  educationalLevel: 'Beginner',
  inLanguage: 'es',
  timeRequired: 'P21D',
  courseMode: 'online',
  offers: {
    '@type': 'Offer',
    price: 29,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: CANONICAL,
  },
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      name: 'Fase 1 â€" Preparar (dÃ­as 1â€"7)',
      description: 'Tiny Habits, diseÃ±o de entorno, ancla hedÃ³nica, identidad basada en hÃ¡bitos, anticipaciÃ³n de dopamina y autocompasiÃ³n como motor de persistencia.',
    },
    {
      '@type': 'CourseInstance',
      name: 'Fase 2 â€" Reforzar (dÃ­as 8â€"14)',
      description: 'Protocolo de obstÃ¡culos (WOOP), regla del "never miss twice", seÃ±ales mÃºltiples, flexibilidad cognitiva y refuerzo inmediato en ventana de 90 segundos.',
    },
    {
      '@type': 'CourseInstance',
      name: 'Fase 3 â€" Integrar (dÃ­as 15â€"21)',
      description: 'Automaticidad, conexiÃ³n con el yo futuro, consolidaciÃ³n de identidad, resiliencia ante el estrÃ©s, ancla sensorial y plan de continuidad post-reto.',
    },
  ],
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FoodÂ·Mood',
  url: 'https://www.food-mood.app',
  contactPoint: { '@type': 'ContactPoint', email: 'info@food-mood.app', contactType: 'customer service' },
}

// â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

export default async function MicrohabitosPage() {
  const supabase = await createClient()

  const [
    { data: ch },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('challenges').select('id').eq('slug', 'microhabitos').eq('is_active', true).maybeSingle(),
    supabase.auth.getUser(),
  ])

  const challengeId     = ch?.id ?? null
  const isAuthenticated = !!user

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'MicrohÃ¡bitos â€" 21 dÃ­as',
    description: 'Crea hÃ¡bitos reales usando el placer como motor de cambio. 21 dÃ­as de micro-hÃ¡bitos, psicologÃ­a del comportamiento y bebidas funcionales fermentadas.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'FoodÂ·Mood' },
    offers: [
      { '@type': 'Offer', name: 'MicrohÃ¡bitos â€" 21 dÃ­as', price: 29, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos',     item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'MicrohÃ¡bitos', item: CANONICAL },
    ],
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ backgroundColor: '#C9A84C', color: '#2d0f16' }}
      >
        Saltar al contenido
      </a>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />

      <main id="main-content" style={{ backgroundColor: '#F5F0E8' }}>

        {/* â"€â"€ HERO â"€â"€ */}
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: '#1a0a0d', minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          aria-labelledby="mh-h1"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 60% 30%, rgba(201,168,76,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 70%, rgba(107,39,55,0.25) 0%, transparent 60%)',
            }}
          />

          <div className="absolute top-8 left-6 right-6 flex justify-between items-center">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              21 dÃ­as Â· PsicologÃ­a del comportamiento
            </span>
            <span className="text-xl" aria-hidden="true">âœ¨</span>
          </div>

          <div aria-hidden="true" className="absolute top-20 right-6 flex flex-col gap-2 opacity-40">
            {['ðŸ‹', 'ðŸ«', 'ðŸŒ¿', 'ðŸ¥­', 'ðŸŒº'].map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(201,168,76,0.6)' }}>
              HÃ¡bitos Â· Placer Â· Neurociencia
            </p>
            <h1
              id="mh-h1"
              className="font-serif font-black leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 8vw, 4rem)', color: '#F5F0E8' }}
            >
              El placer no es<br />
              la recompensa.<br />
              <span style={{ color: '#C9A84C' }}>Es el mecanismo.</span>
            </h1>
            <p className="text-lg font-light leading-relaxed mb-10" style={{ color: 'rgba(245,240,232,0.6)', maxWidth: '440px' }}>
              21 dÃ­as para crear un hÃ¡bito real sin fuerza de voluntad. Un micro-hÃ¡bito + una teorÃ­a psicolÃ³gica + una bebida funcional como ancla hedÃ³nica. Cada dÃ­a.
            </p>

            <MicrohabitosCTA challengeId={challengeId} isAuthenticated={isAuthenticated} />

            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#C9A84C' }}>21</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>dÃ­as</p>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(245,240,232,0.1)' }} aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#C9A84C' }}>8</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>mecanismos</p>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(245,240,232,0.1)' }} aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#C9A84C' }}>29â‚¬</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>acceso de por vida</p>
              </div>
            </div>
          </div>
        </section>

        {/* â"€â"€ EL PROBLEMA â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 py-20" aria-labelledby="mh-problema">
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>El problema real</p>
            <h2 id="mh-problema" className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#F5F0E8' }}>
              La fuerza de voluntad<br />no es la soluciÃ³n.
            </h2>
            <p className="text-base font-light leading-relaxed mb-4" style={{ color: 'rgba(245,240,232,0.65)' }}>
              Los estudios de seguimiento muestran que el 92% de los propÃ³sitos fallan. No porque las personas sean dÃ©biles â€" sino porque el mÃ©todo estÃ¡ mal diseÃ±ado. La fuerza de voluntad es un recurso limitado que se agota. Un hÃ¡bito que depende de ella fracasa en cuanto el dÃ­a se complica.
            </p>
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.65)' }}>
              La neurociencia del comportamiento lleva 30 aÃ±os diciÃ©ndonos lo que sabemos intuitivamente: el placer crea rutas neurales. La repeticiÃ³n placentera construye hÃ¡bitos. La restricciÃ³n y la culpa los destruyen.
            </p>
          </div>
        </section>

        {/* â"€â"€ EL MECANISMO â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-mecanismo">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>La diferencia</p>
          <h2 id="mh-mecanismo" className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#2d0f16' }}>
            El ancla hedÃ³nica:<br />por quÃ© funciona.
          </h2>
          <p className="text-base font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.65)' }}>
            Cada dÃ­a del reto, preparas una bebida funcional fermentada. No como recompensa por haber hecho algo difÃ­cil. Como el hÃ¡bito mismo. Tu circuito dopaminÃ©rgico aprende: <em>esto vale la pena repetir.</em> DespuÃ©s de 21 repeticiones, la ruta neural existe. El hÃ¡bito ya vive en ti.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-1 italic font-serif text-xl"
            style={{ borderColor: '#C9A84C', color: 'rgba(107,39,55,0.8)' }}
          >
            &ldquo;Cada vez que experimentas placer, el cerebro libera dopamina y graba la ruta neural que llevÃ³ a ese placer.&rdquo;
          </blockquote>
        </section>

        {/* â"€â"€ FOTO â"€â"€ */}
        <div className="w-full overflow-hidden" style={{ maxHeight: '340px' }}>
          <img
            src="/retos/microhabitos.jpg"
            alt="Micro-prácticas diarias — 21 días Food·Mood"
            className="w-full object-cover object-center"
            style={{ maxHeight: '340px' }}
          />
        </div>

        {/* â"€â"€ 8 MECANISMOS â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-ciencia">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>PsicologÃ­a real</p>
          <h2 id="mh-ciencia" className="font-serif text-2xl md:text-3xl font-bold mb-10 leading-tight" style={{ color: '#2d0f16' }}>
            8 mecanismos psicolÃ³gicos.<br />21 dÃ­as para instalarlos.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MECANISMOS.map(({ icono, titulo, texto }) => (
              <div
                key={titulo}
                className="rounded-2xl p-5"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(107,39,55,0.08)' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{icono}</span>
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: '#2d0f16' }}>{titulo}</p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.6)' }}>{texto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* â"€â"€ 3 FASES â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-fases">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>El proceso</p>
          <h2 id="mh-fases" className="font-serif text-2xl md:text-3xl font-bold mb-10 leading-tight" style={{ color: '#2d0f16' }}>
            Tres fases, un hÃ¡bito<br />permanente.
          </h2>
          <div className="space-y-6">
            {FASES.map(({ num, nombre, dias, concepto, descripcion, hito, color }) => (
              <div
                key={num}
                className="rounded-3xl p-8 md:p-10"
                style={{ backgroundColor: '#fff', border: `1px solid ${color}22` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    {num}
                  </span>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color }}>
                      {nombre}
                    </p>
                    <p className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.4)' }}>{dias}</p>
                  </div>
                </div>
                <p className="text-sm font-light leading-relaxed mb-3" style={{ color: 'rgba(107,39,55,0.65)' }}>
                  {descripcion}
                </p>
                <p className="text-[11px] font-semibold mb-3" style={{ color: 'rgba(107,39,55,0.4)' }}>
                  {concepto}
                </p>
                <div
                  className="text-xs font-medium rounded-xl px-4 py-2.5 inline-block"
                  style={{ backgroundColor: `${color}12`, color }}
                >
                  {hito}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* â"€â"€ 21 BEBIDAS â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-bebidas">
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#C9A84C' }}>Las 21 anclas</p>
            <h2 id="mh-bebidas" className="font-serif text-2xl font-bold mb-2 leading-tight" style={{ color: '#F5F0E8' }}>
              21 bebidas funcionales fermentadas.
            </h2>
            <p className="text-sm font-light mb-8" style={{ color: 'rgba(245,240,232,0.5)' }}>
              KÃ©fir, kombucha, adaptÃ³genos, probiÃ³ticos. Cada una diseÃ±ada para el mecanismo psicolÃ³gico del dÃ­a.
            </p>
            <ol className="space-y-2.5" role="list">
              {BEBIDAS.map(({ dia, nombre }) => (
                <li key={dia} className="flex items-baseline gap-3 text-sm">
                  <span
                    className="text-[10px] font-black shrink-0 w-5 text-right"
                    style={{ color: 'rgba(201,168,76,0.45)' }}
                  >
                    {dia}
                  </span>
                  <span
                    className="font-light"
                    style={{ color: nombre.startsWith('âœ¨') ? '#C9A84C' : 'rgba(245,240,232,0.7)' }}
                  >
                    {nombre}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* â"€â"€ QUÃ‰ INCLUYE â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-incluye">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6B2737' }}>Contenido</p>
            <h2 id="mh-incluye" className="font-serif text-2xl font-bold mb-8 leading-tight" style={{ color: '#2d0f16' }}>
              Lo que vas a encontrar dentro
            </h2>
            <ul className="space-y-4" role="list">
              {[
                { icon: 'ðŸ§ª', text: '21 bebidas funcionales fermentadas â€" kÃ©fir, kombucha, adaptÃ³genos' },
                { icon: 'ðŸ§ ', text: '21 micro-hÃ¡bitos con base en psicologÃ­a del comportamiento real' },
                { icon: 'ðŸŽ§', text: '21 audios guiados de 3-5 minutos â€" uno por dÃ­a' },
                { icon: 'ðŸ""', text: 'Diario de reflexiÃ³n: 3 preguntas maÃ±ana, tarde y noche' },
                { icon: 'ðŸ†', text: '3 hitos de celebraciÃ³n en los dÃ­as 7, 14 y 21' },
                { icon: 'â™¾ï¸', text: 'Acceso de por vida â€" repite el reto cuando lo necesites' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#F5F0E8]"
                    style={{ backgroundColor: '#C9A84C' }}
                    aria-hidden="true"
                  >âœ"</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* â"€â"€ PARA QUIÃ‰N â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-paraquien">
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Â¿Es para ti?</p>
            <h2 id="mh-paraquien" className="font-serif text-xl font-bold mb-6 leading-tight" style={{ color: '#2d0f16' }}>
              Este reto es para ti siâ€¦
            </h2>
            <ul className="space-y-3" role="list">
              {[
                'Has intentado cambiar hÃ¡bitos antes y los has abandonado',
                'Sientes que te falta fuerza de voluntad â€" pero en realidad te falta diseÃ±o',
                'Quieres resultados que duren mÃ¡s de 3 semanas',
                'Te gusta la idea de que el placer sea el motor, no la recompensa',
                'Tienes menos de 10 minutos al dÃ­a para invertir',
                'Quieres entender la psicologÃ­a detrÃ¡s de tu propio comportamiento',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-light" style={{ color: 'rgba(107,39,55,0.75)' }}>
                  <span style={{ color: '#C9A84C', fontWeight: 700, flexShrink: 0 }}>â†’</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* â"€â"€ FAQ â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-faq">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Dudas frecuentes</p>
          <h2 id="mh-faq" className="font-serif text-2xl md:text-3xl font-bold mb-8 leading-tight" style={{ color: '#2d0f16' }}>
            Preguntas frecuentes
          </h2>
          <div className="bg-white rounded-2xl divide-y divide-[rgba(107,39,55,0.06)]" style={{ border: '1px solid rgba(107,39,55,0.08)' }}>
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group px-6 py-5">
                <summary
                  className="flex justify-between items-start cursor-pointer text-sm font-semibold leading-snug list-none"
                  style={{ color: '#2d0f16' }}
                >
                  <span className="pr-4">{q}</span>
                  <span
                    className="shrink-0 mt-0.5 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                    style={{ color: '#C9A84C', fontSize: '1.25rem', lineHeight: 1 }}
                  >+</span>
                </summary>
                <p className="text-sm font-light leading-relaxed mt-3" style={{ color: 'rgba(107,39,55,0.65)' }}>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* â"€â"€ CTA FINAL â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-24" aria-labelledby="mh-cta" id="cta-compra">
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#1a0a0d' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: '#C9A84C' }}>
              El placer como arquitecto
            </p>
            <h2
              id="mh-cta"
              className="font-serif font-black leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#F5F0E8' }}
            >
              21 dÃ­as para que el hÃ¡bito<br />
              <span style={{ color: '#C9A84C' }}>ocurra solo.</span>
            </h2>
            <p className="text-base font-light mb-8 leading-relaxed" style={{ color: 'rgba(245,240,232,0.55)' }}>
              Sin fuerza de voluntad. Sin restricciÃ³n. Sin culpa.<br />
              Solo placer bien diseÃ±ado, repetido 21 veces.
            </p>
            <MicrohabitosCTA challengeId={challengeId} isAuthenticated={isAuthenticated} compact />
          </div>
        </section>

        {/* â"€â"€ BACK LINK â"€â"€ */}
        <div className="text-center pb-16">
          <a href="/retos" className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
            â† Ver todos los retos
          </a>
        </div>

      </main>
    </>
  )
}

