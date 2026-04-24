import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SlowFoodMoodHero from './SlowFoodMoodHero'
import SlowFoodMoodCTA from './SlowFoodMoodCTA'
import SlowFoodMoodRefs from './SlowFoodMoodRefs'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Slow Food·Mood — Calma la ansiedad cocinando despacio | Food·Mood',
  description: 'Reto de 21 días para calmar la ansiedad a través de la cocina lenta. Fermentos, masas y caldos como herramientas de mindfulness real. Basado en evidencia.',
  keywords: 'reto ansiedad alimentación, cocina lenta mindfulness, fermentados ansiedad, slow food mood, reducir estrés crónico alimentación, eje intestino cerebro ansiedad, hábitos alimentación estrés, reto 21 días ansiedad, mindfulness cocina, psicobióticos ansiedad',
  alternates: { canonical: 'https://www.food-mood.app/retos/slow-food-mood' },
  openGraph: {
    title: 'Slow Food·Mood — Fast life. Slow Food·Mood.',
    description: '21 días para aprender que cocinar despacio es la herramienta antiansiedadmás poderosa que tienes.',
    url: 'https://www.food-mood.app/retos/slow-food-mood',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Slow Food·Mood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slow Food·Mood — Calma la ansiedad cocinando despacio',
    description: 'Reto de 21 días para calmar la ansiedad a través de la cocina lenta. Fermentos, masas y caldos. Desde 19€.',
  },
}

const CANONICAL = 'https://www.food-mood.app/retos/slow-food-mood'


const INGREDIENTS = [
  { name: 'Kéfir',                         note: null },
  { name: 'Vinagre de kombucha o de manzana', note: null },
  { name: 'Masa madre',                     note: null },
  { name: 'Legumbres en remojo',            note: null },
  { name: 'Caldo de kombu',                 note: 'Caldo hecho con alga kombu seca hervida en agua — rico en minerales y con efecto calmante sobre el sistema nervioso.' },
  { name: 'Carnes y pescados con reposo',   note: null },
  { name: 'Yogur artesano',                 note: null },
]

const COMPARISON = [
  { feature: 'Foco',          reset: 'Lo que comes',            slow: 'Cómo cocinas' },
  { feature: 'Mecanismo',     reset: 'Nutrición funcional',     slow: 'Mindfulness encarnado' },
  { feature: 'Sistema',       reset: 'Estado de ánimo general', slow: 'Sistema nervioso / ansiedad' },
  { feature: 'Acción diaria', reset: 'Comer una receta',        slow: 'Preparar algo que necesita tiempo' },
  { feature: 'Para quién',    reset: 'Quiero entender food-mood', slow: 'No puedo parar. Voy demasiado rápido.' },
]

export default async function SlowFoodMoodPage() {
  const supabase = await createClient()

  const [
    { data: ch21 },
    { data: ch7  },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('challenges').select('id').eq('slug', 'slow-food-mood').eq('is_active', true).maybeSingle(),
    supabase.from('challenges').select('id').eq('slug', 'slow-food-mood-7d').eq('is_active', true).maybeSingle(),
    supabase.auth.getUser(),
  ])

  const challenge21dId = ch21?.id ?? null
  const challenge7dId  = ch7?.id  ?? null
  const isAuthenticated = !!user

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Slow Food·Mood',
    description: 'Reto de cocina lenta para calmar la ansiedad y el sistema nervioso. Fermentos, masas madre y caldos como herramientas de mindfulness real.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'Food·Mood' },
    offers: [
      {
        '@type': 'Offer',
        name: 'Slow Food·Mood — 21 días',
        price: 29,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: CANONICAL,
      },
      {
        '@type': 'Offer',
        name: 'Slow Food·Mood — 7 días',
        price: 19,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: CANONICAL,
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos', item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Slow Food·Mood', item: CANONICAL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* sr-only SEO content */}
      <div className="sr-only">
        <nav aria-label="Ruta de navegación">
          <a href="/retos">Retos</a> › <span>Slow Food·Mood</span>
        </nav>
        <h1>Slow Food·Mood — Calma la ansiedad cocinando despacio</h1>
        <p>Reto de 21 días para calmar la ansiedad a través de la cocina lenta. Fermentos, masas madre y caldos como mindfulness encarnado.</p>
        <p>Precio: 19€ (7 días) o 29€ (21 días). Pago único, acceso de por vida.</p>
      </div>

      <main style={{ backgroundColor: '#F5F0E8' }}>

        {/* ── HERO ── */}
        <SlowFoodMoodHero />

        {/* ── HERO COPY + FIRST CTA ── */}
        <section
          className="max-w-2xl mx-auto px-6 py-20 text-center"
          aria-label="Presentación del reto"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-6" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Ansiedad · Sistema nervioso · Estrés crónico
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-black mb-5 leading-tight" style={{ color: '#2d0f16' }}>
            Cocina despacio.<br />Calma la ansiedad.
          </h1>
          <p className="text-lg font-light leading-relaxed mb-10" style={{ color: 'rgba(107,39,55,0.65)' }}>
            En 21 días, aprenderás que el tiempo no es el enemigo. Es la herramienta.
          </p>
          <SlowFoodMoodCTA
            challenge7dId={challenge7dId}
            challenge21dId={challenge21dId}
            isAuthenticated={isAuthenticated}
          />
        </section>

        {/* ── SECCIÓN 2: EL PROBLEMA ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          aria-label="El problema de la ansiedad"
        >
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>
              El problema
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#F5F0E8' }}>
              La ansiedad no se cura<br />con más información.
            </h2>
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)' }}>
              Sabes perfectamente que deberías respirar más, dormir mejor, ir más despacio. Lo sabes. Y aun así, no puedes. Porque el conocimiento solo no cambia los hábitos. Lo que cambia los hábitos es la experiencia repetida, sensorial, que deja huella en el cuerpo.
            </p>
          </div>
        </section>

        {/* ── SECCIÓN 3: LA SOLUCIÓN ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          aria-label="La solución — alimentos que no mienten"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.45)' }}>
            La solución
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#2d0f16' }}>
            Hay alimentos que no mienten<br />sobre el tiempo.
          </h2>
          <p className="text-base font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.65)' }}>
            Un fermento no se hace en una hora. Una masa madre no admite prisas. Un caldo largo necesita su tiempo. Durante {21} días vas a preparar alimentos que tienen su propio ritmo biológico. Y en ese proceso — sin que te des cuenta — tu mente empieza a soltar.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-1 italic font-serif text-xl"
            style={{ borderColor: '#C9A84C', color: 'rgba(107,39,55,0.8)' }}
          >
            &ldquo;Tu sistema nervioso no se calma con información. Se calma con experiencia repetida, sensorial y encarnada.&rdquo;
          </blockquote>
        </section>

        {/* ── SECCIÓN 4: QUÉ INCLUYE ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          aria-label="Contenido del reto"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-7" style={{ color: '#6B2737' }}>
              Lo que vas a encontrar dentro
            </p>
            <ul className="space-y-4 mb-10">
              {[
                { icon: '🧪', text: '21 preparaciones lentas — fermentos, masas, caldos, reposos' },
                { icon: '🎧', text: '21 audios de ritual guiado (antes de cocinar, no después)' },
                { icon: '📔', text: 'Diario de ritmo diario: ¿cuánto tardé? ¿cómo me sentí?' },
                { icon: '💬', text: 'Canal privado WhatsApp Premium con comunidad Food·Mood' },
                { icon: '📊', text: 'Mapa de tu ritmo mental al día 21' },
                { icon: '📚', text: 'Base científica descargable con referencias bibliográficas' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#F5F0E8]"
                    style={{ backgroundColor: '#6B2737' }}
                    aria-hidden="true"
                  >✓</span>
                  {text}
                </li>
              ))}
            </ul>

            {/* Ingredientes protagonistas */}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.45)' }}>
              Ingredientes protagonistas
            </p>
            <ul className="space-y-3">
              {INGREDIENTS.map(({ name, note }) => (
                <li key={name}>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#C9A84C' }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: '#2d0f16' }}>{name}</span>
                  </div>
                  {note && (
                    <p className="text-xs font-light ml-4 mt-1 leading-relaxed" style={{ color: 'rgba(107,39,55,0.55)' }}>
                      {note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECCIÓN 5: BASE CIENTÍFICA ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          aria-label="Respaldo científico"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>
            Ciencia real
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ color: '#2d0f16' }}>
            Respaldado por ciencia real.
          </h2>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(107,39,55,0.55)' }}>
            Slow Food·Mood no es intuición. Es neurociencia aplicada a la cocina.
          </p>

          <div className="bg-white rounded-2xl px-5 py-2" style={{ border: '1px solid rgba(107,39,55,0.08)' }}>
            <SlowFoodMoodRefs />
          </div>
        </section>

        {/* ── SECCIÓN 6: DIFERENCIACIÓN ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          aria-label="Diferencias con Food·Mood Reset"
        >
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'rgba(107,39,55,0.04)', border: '1px solid rgba(107,39,55,0.1)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: 'rgba(107,39,55,0.45)' }}>
              ¿En qué se diferencia del Food·Mood Reset?
            </p>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(107,39,55,0.4)', width: '28%' }}> </th>
                    <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(107,39,55,0.5)', width: '36%' }}>Food·Mood Reset</th>
                    <th className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#6B2737', width: '36%' }}>Slow Food·Mood</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ feature, reset, slow }, i) => (
                    <tr key={feature} style={{ borderTop: '1px solid rgba(107,39,55,0.08)' }}>
                      <td className="py-3 px-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: 'rgba(107,39,55,0.4)' }}>{feature}</td>
                      <td className="py-3 px-3 text-xs font-light" style={{ color: 'rgba(107,39,55,0.6)' }}>{reset}</td>
                      <td className="py-3 px-3 text-xs font-semibold" style={{ color: '#2d0f16' }}>{slow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── SECCIÓN 7: CTA FINAL ── */}
        <section
          className="max-w-2xl mx-auto px-6 pb-24"
          aria-label="Empieza el reto"
          id="cta-compra"
        >
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>
              Fast life. Slow Food·Mood.
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: '#F5F0E8' }}>
              ¿Listo para ir más despacio?
            </h2>
            <p className="text-base font-light mb-8 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
              21 días. Una preparación al día. Y la ansiedad empieza a tener otro ritmo.
            </p>
            <SlowFoodMoodCTA
              challenge7dId={challenge7dId}
              challenge21dId={challenge21dId}
              isAuthenticated={isAuthenticated}
              compact
            />
          </div>
        </section>

        {/* ── BACK LINK ── */}
        <div className="text-center pb-16">
          <a href="/retos" className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
            ← Ver todos los retos
          </a>
        </div>

      </main>
    </>
  )
}
