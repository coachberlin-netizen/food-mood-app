import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MicrohabitosCTA from './MicrohabitosCTA'

export const dynamic = 'force-dynamic'

const CANONICAL = 'https://www.food-mood.app/retos/microhabitos'

export const metadata: Metadata = {
  title: 'Microhábitos — 21 días para crear hábitos sin fuerza de voluntad | Food·Mood',
  description: 'Crea hábitos que duran con Tiny Habits, ancla hedónica y bebidas fermentadas. 21 días de psicología del comportamiento. Sin disciplina. Desde 29€.',
  alternates: {
    canonical: CANONICAL,
    languages: { 'es': CANONICAL },
  },
  openGraph: {
    title: 'Microhábitos — 21 días para crear hábitos sin fuerza de voluntad',
    description: 'Tiny Habits, ancla hedónica y bebidas fermentadas como motor de cambio real. 21 días. Sin disciplina. Desde 29€.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Microhábitos Food·Mood — 21 días para crear hábitos sin fuerza de voluntad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microhábitos — 21 días para crear hábitos sin fuerza de voluntad',
    description: 'Tiny Habits + ancla hedónica + bebidas funcionales fermentadas. Psicología real del comportamiento. 21 días, 29€.',
    images: ['/og-image.png'],
  },
}

// â"€â"€ Contenido estático â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const FASES = [
  {
    num: '01',
    nombre: 'PREPARAR',
    dias: 'Días 1—7',
    concepto: 'Tiny Habits · Diseño de entorno · Ancla hedónica · Identidad · Dopamina · Autocompasión',
    descripcion: 'Construyes el andamio. Cada hábito es tan pequeño que la resistencia desaparece. Cada bebida crea una asociación placer—acción en tu circuito de dopamina.',
    hito: 'Día 7 — Elixir de celebración: kéfir con vainilla, dátil y cacao',
    color: '#FF6B35',
  },
  {
    num: '02',
    nombre: 'REFORZAR',
    dias: 'Días 8—14',
    concepto: 'Protocolo de obstáculos · Never miss twice · Señales múltiples · Flexibilidad cognitiva · Refuerzo inmediato',
    descripcion: 'El entusiasmo baja — y eso es exactamente el entrenamiento. Aprendes a mantener el hábito cuando no es conveniente. Eso es lo que lo vuelve permanente.',
    hito: 'Día 14 — Gran elixir: kombucha de hibisco, fresas y albahaca',
    color: '#8B6914',
  },
  {
    num: '03',
    nombre: 'INTEGRAR',
    dias: 'Días 15—21',
    concepto: 'Automaticidad · Yo futuro · Identidad consolidada · Resiliencia · Ancla sensorial · Plan post-reto',
    descripcion: 'El hábito empieza a ocurrir solo. Lo trasladamos del córtex prefrontal a los ganglios basales — de decisión consciente a comportamiento automático.',
    hito: 'Día 21 — El Gran Reset: kéfir con vainilla bean, miel cruda y pétalos de rosa',
    color: '#6B2737',
  },
]

const BEBIDAS = [
  { dia: 1,  nombre: 'Limonada de limón fermentado, jengibre y cúrcuma',       fase: 'preparar' },
  { dia: 2,  nombre: 'Kéfir cremoso con arándanos silvestres y lavanda',        fase: 'preparar' },
  { dia: 3,  nombre: 'Kombucha de menta fresca y lima',                          fase: 'preparar' },
  { dia: 4,  nombre: 'Agua de kéfir con frambuesas y agua de rosas',             fase: 'preparar' },
  { dia: 5,  nombre: 'Smoothie tropical de mango, kéfir y cardamomo',            fase: 'preparar' },
  { dia: 6,  nombre: 'Limonada de hibisco fermentada con miel de flores',        fase: 'preparar' },
  { dia: 7,  nombre: '✨ Elixir de celebración — kéfir, vainilla, dátil, cacao', fase: 'preparar' },
  { dia: 8,  nombre: 'Shot de adaptógenos: ashwagandha, maca y cacao',           fase: 'reforzar' },
  { dia: 9,  nombre: 'Agua de kéfir con membrillo y canela',                     fase: 'reforzar' },
  { dia: 10, nombre: 'Té de hongos reishi con leche de avena fermentada',        fase: 'reforzar' },
  { dia: 11, nombre: 'Kéfir de cabra con pera madura y nuez tostada',            fase: 'reforzar' },
  { dia: 12, nombre: 'Jugo verde fermentado: pepino, apio, manzana, kombucha',   fase: 'reforzar' },
  { dia: 13, nombre: 'Lassi tropical de mango, kéfir y cúrcuma dorada',          fase: 'reforzar' },
  { dia: 14, nombre: '✨ Gran elixir: kombucha de hibisco, fresas y albahaca',    fase: 'reforzar' },
  { dia: 15, nombre: 'Tónica de kéfir con limón Meyer y miel de manuka',         fase: 'integrar' },
  { dia: 16, nombre: 'Batido cremoso de plátano, kéfir y tahini',                fase: 'integrar' },
  { dia: 17, nombre: 'Kombucha de cereza y cacao oscuro',                         fase: 'integrar' },
  { dia: 18, nombre: 'Agua de kéfir con naranja sanguina y cardamomo',            fase: 'integrar' },
  { dia: 19, nombre: 'Smoothie bowl de kéfir con frutos rojos y cacao',           fase: 'integrar' },
  { dia: 20, nombre: 'Elixir nocturno: kéfir, ashwagandha, miel y pimienta',     fase: 'integrar' },
  { dia: 21, nombre: '✨ El Gran Reset — kéfir, vainilla bean y pétalos de rosa', fase: 'integrar' },
]

const MECANISMOS = [
  { icono: '🧠', titulo: 'Tiny Habits', texto: 'Hábitos tan pequeños que la resistencia desaparece. BJ Fogg, Stanford.' },
  { icono: '🏡', titulo: 'Diseño de entorno', texto: 'El entorno decide el 80% de tu comportamiento. Sin esfuerzo consciente.' },
  { icono: '🍋', titulo: 'Ancla hedónica', texto: 'Cada bebida crea una asociación placer—hábito en tu circuito dopaminérgico.' },
  { icono: '🪞', titulo: 'Identidad', texto: 'Los hábitos que duran vienen de quién eres, no de lo que quieres lograr.' },
  { icono: '⚡', titulo: 'Anticipación', texto: 'La dopamina se libera anticipando el placer. Usas el deseo a tu favor.' },
  { icono: '💛', titulo: 'Autocompasión', texto: 'La autocrítica apaga la motivación. La autocompasión la enciende. Kristin Neff.' },
  { icono: '🛡️', titulo: 'Protocolo de obstáculos', texto: 'WOOP + implementation intentions. Los obstáculos planificados no bloquean.' },
  { icono: '🔁', titulo: 'Automaticidad', texto: 'El hábito pasa del córtex prefrontal a los ganglios basales. Ya no requiere decisión.' },
]

const FAQ = [
  {
    q: '¿Necesito experiencia previa con fermentados o kéfir?',
    a: 'No. Las bebidas son sencillas — la más compleja tarda 5 minutos. Muchos ingredientes ya están en tu nevera. Si no encuentras kéfir, damos alternativas para cada receta.',
  },
  {
    q: '¿Cuánto tiempo necesito cada día?',
    a: 'El micro-hábito principal son 30 segundos a 5 minutos. La bebida, 2-5 minutos de preparación. El diario, 3-5 minutos. En total: menos de 10 minutos diarios.',
  },
  {
    q: '¿Qué pasa si me salto un día?',
    a: 'Nada. El reto incluye específicamente el módulo "never miss twice" — y una versión mínima de cada día para cuando la vida se complica. El hábito imperfecto que ocurre gana al perfecto que no pasa.',
  },
  {
    q: '¿En qué se diferencia del Food·Mood Reset o del Slow Food·Mood?',
    a: 'Food·Mood Reset trabaja el eje intestino-cerebro desde la nutrición. Slow Food·Mood trabaja la ansiedad desde la cocina lenta. Microhábitos trabaja los hábitos — cómo crearlos, fijarlos y hacerlos automáticos. Son complementarios.',
  },
  {
    q: '¿Funciona si ya he intentado cambiar hábitos antes sin éxito?',
    a: 'Especialmente para ti. Este reto parte de la premisa de que los intentos anteriores fallaron por diseño, no por falta de voluntad. El placer como mecanismo — no como recompensa — funciona de forma diferente en el cerebro.',
  },
  {
    q: '¿Tengo acceso permanente al contenido?',
    a: 'Sí. Una vez comprado, el contenido es tuyo para siempre. Puedes repetir el reto, revisitar días, o usarlo como referencia cuando necesites reinstalar un hábito.',
  },
]

// â"€â"€ Structured data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Necesito experiencia previa con fermentados o kéfir para hacer el reto Microhábitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Las bebidas son sencillas — la más compleja tarda 5 minutos. Muchos ingredientes ya están en tu nevera. Si no encuentras kéfir, damos alternativas para cada receta.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo necesito cada día para el reto de microhábitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Menos de 10 minutos diarios. El micro-hábito principal son 30 segundos a 5 minutos. La bebida, 2-5 minutos de preparación. El diario, 3-5 minutos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si me salto un día del reto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nada. El reto incluye específicamente el módulo "never miss twice" y una versión mínima de cada día para cuando la vida se complica. El hábito imperfecto que ocurre gana al perfecto que no pasa.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué se diferencia Microhábitos del Food·Mood Reset o del Slow Food·Mood?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Food·Mood Reset trabaja el eje intestino-cerebro desde la nutrición. Slow Food·Mood trabaja la ansiedad desde la cocina lenta. Microhábitos trabaja los hábitos — cómo crearlos, fijarlos y hacerlos automáticos usando el placer como mecanismo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Funciona si ya he intentado cambiar hábitos antes y he fracasado?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Especialmente para ti. Este programa parte de que los intentos anteriores fallaron por diseño, no por falta de voluntad. El placer como mecanismo — no como recompensa — activa el circuito dopaminérgico de forma diferente al enfoque basado en disciplina.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el ancla hedónica y por qué funciona para crear hábitos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El ancla hedónica es un estímulo placentero (en este caso una bebida funcional fermentada) que se asocia repetidamente a un micro-hábito. Cada vez que el cerebro experimenta placer, libera dopamina y graba la ruta neural que llevó a ese placer. Después de 21 repeticiones, el hábito ocurre de forma automática.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo acceso permanente al contenido del reto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Una vez comprado, el contenido es tuyo para siempre. Puedes repetir el reto, revisitar días, o usarlo como referencia cuando necesites reinstalar un hábito. Precio único de 29€.',
      },
    },
  ],
}

const COURSE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Microhábitos — 21 días para crear hábitos con placer',
  description: 'Programa de 21 días basado en psicología del comportamiento (Tiny Habits, Environment Design, Hedonic Anchoring) para crear hábitos duraderos usando el placer como mecanismo neurológico, no como recompensa.',
  url: CANONICAL,
  image: 'https://www.food-mood.app/og-image.png',
  provider: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
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
      name: 'Fase 1 — Preparar (días 1—7)',
      description: 'Tiny Habits, diseño de entorno, ancla hedónica, identidad basada en hábitos, anticipación de dopamina y autocompasión como motor de persistencia.',
    },
    {
      '@type': 'CourseInstance',
      name: 'Fase 2 — Reforzar (días 8—14)',
      description: 'Protocolo de obstáculos (WOOP), regla del "never miss twice", señales múltiples, flexibilidad cognitiva y refuerzo inmediato en ventana de 90 segundos.',
    },
    {
      '@type': 'CourseInstance',
      name: 'Fase 3 — Integrar (días 15—21)',
      description: 'Automaticidad, conexión con el yo futuro, consolidación de identidad, resiliencia ante el estrés, ancla sensorial y plan de continuidad post-reto.',
    },
  ],
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Food·Mood',
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
    name: 'Microhábitos — 21 días',
    description: 'Crea hábitos reales usando el placer como motor de cambio. 21 días de micro-hábitos, psicología del comportamiento y bebidas funcionales fermentadas.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: [
      { '@type': 'Offer', name: 'Microhábitos — 21 días', price: 29, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos',     item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Microhábitos', item: CANONICAL },
    ],
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ backgroundColor: '#FF6B35', color: '#2d0f16' }}
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
              background: 'radial-gradient(ellipse 70% 60% at 60% 30%, rgba(255,107,53,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 70%, rgba(107,39,55,0.25) 0%, transparent 60%)',
            }}
          />

          <div className="absolute top-8 left-6 right-6 flex justify-between items-center">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
            >
              21 días · Psicología del comportamiento
            </span>
            <span className="text-xl" aria-hidden="true">✨</span>
          </div>

          <div aria-hidden="true" className="absolute top-20 right-6 flex flex-col gap-2 opacity-40">
            {['🍋', '🫐', '🌿', '🥭', '🌺'].map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(255,107,53,0.6)' }}>
              Hábitos · Placer · Neurociencia
            </p>
            <h1
              id="mh-h1"
              className="font-serif font-black leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 8vw, 4rem)', color: '#F5F0E8' }}
            >
              El placer no es<br />
              la recompensa.<br />
              <span style={{ color: '#FF6B35' }}>Es el mecanismo.</span>
            </h1>
            <p className="text-lg font-light leading-relaxed mb-10" style={{ color: 'rgba(245,240,232,0.6)', maxWidth: '440px' }}>
              21 días para crear un hábito real sin fuerza de voluntad. Un micro-hábito + una teoría psicológica + una bebida funcional como ancla hedónica. Cada día.
            </p>

            <MicrohabitosCTA challengeId={challengeId} isAuthenticated={isAuthenticated} />

            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#FF6B35' }}>21</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>días</p>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(245,240,232,0.1)' }} aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#FF6B35' }}>8</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>mecanismos</p>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(245,240,232,0.1)' }} aria-hidden="true" />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#FF6B35' }}>29€</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(245,240,232,0.35)' }}>acceso de por vida</p>
              </div>
            </div>
          </div>
        </section>

        {/* â"€â"€ EL PROBLEMA â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 py-20" aria-labelledby="mh-problema">
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#FF6B35' }}>El problema real</p>
            <h2 id="mh-problema" className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#F5F0E8' }}>
              La fuerza de voluntad<br />no es la solución.
            </h2>
            <p className="text-base font-light leading-relaxed mb-4" style={{ color: 'rgba(245,240,232,0.65)' }}>
              Los estudios de seguimiento muestran que el 92% de los propósitos fallan. No porque las personas sean débiles — sino porque el método está mal diseñado. La fuerza de voluntad es un recurso limitado que se agota. Un hábito que depende de ella fracasa en cuanto el día se complica.
            </p>
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.65)' }}>
              La neurociencia del comportamiento lleva 30 años diciéndonos lo que sabemos intuitivamente: el placer crea rutas neurales. La repetición placentera construye hábitos. La restricción y la culpa los destruyen.
            </p>
          </div>
        </section>

        {/* â"€â"€ EL MECANISMO â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-mecanismo">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>La diferencia</p>
          <h2 id="mh-mecanismo" className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: '#2d0f16' }}>
            El ancla hedónica:<br />por qué funciona.
          </h2>
          <p className="text-base font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.65)' }}>
            Cada día del reto, preparas una bebida funcional fermentada. No como recompensa por haber hecho algo difícil. Como el hábito mismo. Tu circuito dopaminérgico aprende: <em>esto vale la pena repetir.</em> Después de 21 repeticiones, la ruta neural existe. El hábito ya vive en ti.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-1 italic font-serif text-xl"
            style={{ borderColor: '#FF6B35', color: 'rgba(107,39,55,0.8)' }}
          >
            &ldquo;Cada vez que experimentas placer, el cerebro libera dopamina y graba la ruta neural que llevó a ese placer.&rdquo;
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
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Psicología real</p>
          <h2 id="mh-ciencia" className="font-serif text-2xl md:text-3xl font-bold mb-10 leading-tight" style={{ color: '#2d0f16' }}>
            8 mecanismos psicológicos.<br />21 días para instalarlos.
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
            Tres fases, un hábito<br />permanente.
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
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#FF6B35' }}>Las 21 anclas</p>
            <h2 id="mh-bebidas" className="font-serif text-2xl font-bold mb-2 leading-tight" style={{ color: '#F5F0E8' }}>
              21 bebidas funcionales fermentadas.
            </h2>
            <p className="text-sm font-light mb-8" style={{ color: 'rgba(245,240,232,0.5)' }}>
              Kéfir, kombucha, adaptógenos, probióticos. Cada una diseñada para el mecanismo psicológico del día.
            </p>
            <ol className="space-y-2.5" role="list">
              {BEBIDAS.map(({ dia, nombre }) => (
                <li key={dia} className="flex items-baseline gap-3 text-sm">
                  <span
                    className="text-[10px] font-black shrink-0 w-5 text-right"
                    style={{ color: 'rgba(255,107,53,0.45)' }}
                  >
                    {dia}
                  </span>
                  <span
                    className="font-light"
                    style={{ color: nombre.startsWith('✨') ? '#FF6B35' : 'rgba(245,240,232,0.7)' }}
                  >
                    {nombre}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* â"€â"€ QUÉ INCLUYE â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-incluye">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6B2737' }}>Contenido</p>
            <h2 id="mh-incluye" className="font-serif text-2xl font-bold mb-8 leading-tight" style={{ color: '#2d0f16' }}>
              Lo que vas a encontrar dentro
            </h2>
            <ul className="space-y-4" role="list">
              {[
                { icon: '🧪', text: '21 bebidas funcionales fermentadas — kéfir, kombucha, adaptógenos' },
                { icon: '🧠', text: '21 micro-hábitos con base en psicología del comportamiento real' },
                { icon: '🎧', text: '21 audios guiados de 3-5 minutos — uno por día' },
                { icon: '📔', text: 'Diario de reflexión: 3 preguntas mañana, tarde y noche' },
                { icon: '🏆', text: '3 hitos de celebración en los días 7, 14 y 21' },
                { icon: '♾️', text: 'Acceso de por vida — repite el reto cuando lo necesites' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#F5F0E8]"
                    style={{ backgroundColor: '#FF6B35' }}
                    aria-hidden="true"
                  >✓</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* â"€â"€ PARA QUIÉN â"€â"€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="mh-paraquien">
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>¿Es para ti?</p>
            <h2 id="mh-paraquien" className="font-serif text-xl font-bold mb-6 leading-tight" style={{ color: '#2d0f16' }}>
              Este reto es para ti si…
            </h2>
            <ul className="space-y-3" role="list">
              {[
                'Has intentado cambiar hábitos antes y los has abandonado',
                'Sientes que te falta fuerza de voluntad — pero en realidad te falta diseño',
                'Quieres resultados que duren más de 3 semanas',
                'Te gusta la idea de que el placer sea el motor, no la recompensa',
                'Tienes menos de 10 minutos al día para invertir',
                'Quieres entender la psicología detrás de tu propio comportamiento',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-light" style={{ color: 'rgba(107,39,55,0.75)' }}>
                  <span style={{ color: '#FF6B35', fontWeight: 700, flexShrink: 0 }}>→</span>
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
                    style={{ color: '#FF6B35', fontSize: '1.25rem', lineHeight: 1 }}
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
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: '#FF6B35' }}>
              El placer como arquitecto
            </p>
            <h2
              id="mh-cta"
              className="font-serif font-black leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#F5F0E8' }}
            >
              21 días para que el hábito<br />
              <span style={{ color: '#FF6B35' }}>ocurra solo.</span>
            </h2>
            <p className="text-base font-light mb-8 leading-relaxed" style={{ color: 'rgba(245,240,232,0.55)' }}>
              Sin fuerza de voluntad. Sin restricción. Sin culpa.<br />
              Solo placer bien diseñado, repetido 21 veces.
            </p>
            <MicrohabitosCTA challengeId={challengeId} isAuthenticated={isAuthenticated} compact />
          </div>
        </section>

        {/* â"€â"€ BACK LINK â"€â"€ */}
        <div className="text-center pb-16">
          <a href="/retos" className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
            ← Ver todos los retos
          </a>
        </div>

      </main>
    </>
  )
}

