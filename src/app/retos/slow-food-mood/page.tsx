import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SlowFoodMoodHero from './SlowFoodMoodHero'
import SlowFoodMoodCTA from './SlowFoodMoodCTA'
import SlowFoodMoodRefs from './SlowFoodMoodRefs'
import SlowFoodMoodFAQ from './SlowFoodMoodFAQ'

export const dynamic = 'force-dynamic'

const CANONICAL = 'https://www.food-mood.app/retos/slow-food-mood'

export const metadata: Metadata = {
  title: 'Slow FoodÂ·Mood â€” 21 dÃ­as para calmar la ansiedad | FoodÂ·Mood',
  description: 'Reto de cocina lenta: 21 dÃ­as para calmar la ansiedad. Fermentos, masas madre y caldos desde 29â‚¬. Mindfulness encarnado basado en evidencia.',
  alternates: {
    canonical: CANONICAL,
    languages: { 'es': CANONICAL },
  },
  openGraph: {
    title: 'Slow FoodÂ·Mood â€” 21 dÃ­as para calmar la ansiedad',
    description: 'Reto de cocina lenta: 21 dÃ­as para calmar la ansiedad. Fermentos, masas madre y caldos desde 29â‚¬.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Slow FoodÂ·Mood â€” reto de cocina lenta para calmar la ansiedad' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slow FoodÂ·Mood â€” 21 dÃ­as para calmar la ansiedad',
    description: 'Reto de cocina lenta: 21 dÃ­as para calmar la ansiedad. Fermentos, masas madre y caldos. Desde 29â‚¬.',
    images: ['/og-image.png'],
  },
}

const INGREDIENTS = [
  { name: 'KÃ©fir',                           note: 'Bebida fermentada con lactobacilos vivos que actÃºan directamente sobre el eje intestino-cerebro y reducen la respuesta al estrÃ©s.' },
  { name: 'Vinagre de kombucha o de manzana', note: 'Ãcido acÃ©tico con propiedades prebiÃ³ticas que regulan el pH intestinal y favorecen la producciÃ³n de serotonina.' },
  { name: 'Masa madre',                       note: 'FermentaciÃ³n lÃ¡ctica de larga duraciÃ³n que predigiere el gluten y produce GABA, el neurotransmisor calmante por excelencia.' },
  { name: 'Legumbres en remojo',              note: 'El remojo de 12-24 horas elimina antinutrientes y activa enzimas que mejoran la biodisponibilidad del triptÃ³fano.' },
  { name: 'Caldo de kombu',                   note: 'Caldo hecho con alga kombu seca hervida en agua â€” rico en minerales y con efecto calmante sobre el sistema nervioso.' },
  { name: 'Carnes y pescados con reposo',     note: 'El marinado prolongado ablanda las fibras musculares y aumenta la concentraciÃ³n de glicina, precursora del sueÃ±o profundo.' },
  { name: 'Yogur artesano',                   note: 'Fuente de Lactobacillus rhamnosus, la cepa con mayor evidencia cientÃ­fica en reducciÃ³n de ansiedad en estudios humanos.' },
]

const COMPARISON = [
  { feature: 'Foco',          reset: 'Lo que comes',              slow: 'CÃ³mo cocinas' },
  { feature: 'Mecanismo',     reset: 'NutriciÃ³n funcional',       slow: 'Mindfulness encarnado' },
  { feature: 'Sistema',       reset: 'Estado de Ã¡nimo general',   slow: 'Sistema nervioso / ansiedad' },
  { feature: 'AcciÃ³n diaria', reset: 'Comer una receta',          slow: 'Preparar algo que necesita tiempo' },
  { feature: 'Para quiÃ©n',    reset: 'Quiero entender foodÂ·mood', slow: 'No puedo parar. Voy demasiado rÃ¡pido.' },
]

const TIMELINE = [
  { day: 7,  title: 'Primera semana',   text: 'Tu sistema nervioso reconoce el ritmo. Los primeros fermentos empiezan a colonizar el intestino.' },
  { day: 14, title: 'Segunda semana',   text: 'La fermentaciÃ³n tiene su propio tiempo. El tuyo tambiÃ©n. El GABA empieza a estabilizar la respuesta al estrÃ©s.' },
  { day: 21, title: 'Tercera semana',   text: 'La cocina lenta ya es parte de tu rutina. El hÃ¡bito se ha instalado en el cuerpo, no solo en la mente.' },
]

export default async function SlowFoodMoodPage() {
  const supabase = await createClient()

  const [
    { data: ch },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('challenges').select('id').eq('slug', 'slow-food-mood').eq('is_active', true).maybeSingle(),
    supabase.auth.getUser(),
  ])

  const challengeId     = ch?.id ?? null
  const isAuthenticated = !!user

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Slow FoodÂ·Mood',
    description: 'Reto de cocina lenta para calmar la ansiedad y el sistema nervioso. Fermentos, masas madre y caldos como herramientas de mindfulness real.',
    url: CANONICAL,
    image: 'https://www.food-mood.app/og-image.png',
    brand: { '@type': 'Brand', name: 'FoodÂ·Mood' },
    offers: [
      { '@type': 'Offer', name: 'Slow FoodÂ·Mood â€” 21 dÃ­as', price: 29, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: CANONICAL },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodÂ·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Retos',     item: 'https://www.food-mood.app/retos' },
      { '@type': 'ListItem', position: 3, name: 'Slow FoodÂ·Mood', item: CANONICAL },
    ],
  }

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FoodÂ·Mood',
    url: 'https://www.food-mood.app',
    contactPoint: { '@type': 'ContactPoint', email: 'info@food-mood.app', contactType: 'customer service' },
  }

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ backgroundColor: '#6B2737', color: '#F5F0E8' }}
      >
        Saltar al contenido
      </a>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <main id="main-content" style={{ backgroundColor: '#F5F0E8' }}>

        {/* â”€â”€ HERO â”€â”€ */}
        <SlowFoodMoodHero />

        {/* â”€â”€ HERO COPY + FIRST CTA â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 py-20 text-center" aria-labelledby="sfm-h1">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] block mb-6" style={{ color: 'rgba(107,39,55,0.4)' }}>
            Ansiedad Â· Sistema nervioso Â· EstrÃ©s crÃ³nico
          </span>
          <h1 id="sfm-h1" className="font-serif text-4xl md:text-5xl font-black mb-5 leading-tight" style={{ color: '#2d0f16' }}>
            Cocina despacio.<br />Calma la ansiedad.
          </h1>
          <p className="text-lg font-light leading-relaxed mb-4" style={{ color: 'rgba(107,39,55,0.65)' }}>
            En 21 dÃ­as, aprenderÃ¡s que el tiempo no es el enemigo. Es la herramienta.
          </p>

          <SlowFoodMoodCTA
            challengeId={challengeId}
            isAuthenticated={isAuthenticated}
          />
        </section>

        {/* â”€â”€ EL PROBLEMA â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-problema">
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>El problema</p>
            <h2 id="sfm-problema" className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#F5F0E8' }}>
              La ansiedad no se cura<br />con mÃ¡s informaciÃ³n.
            </h2>
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)' }}>
              Sabes perfectamente que deberÃ­as respirar mÃ¡s, dormir mejor, ir mÃ¡s despacio. Lo sabes. Y aun asÃ­, no puedes. Porque el conocimiento solo no cambia los hÃ¡bitos. Lo que cambia los hÃ¡bitos es la experiencia repetida, sensorial, que deja huella en el cuerpo.
            </p>
          </div>
        </section>

        {/* â”€â”€ LA SOLUCIÃ“N â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-solucion">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.45)' }}>La soluciÃ³n</p>
          <h2 id="sfm-solucion" className="font-serif text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#2d0f16' }}>
            Hay alimentos que no mienten<br />sobre el tiempo.
          </h2>
          <p className="text-base font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.65)' }}>
            Un fermento no se hace en una hora. Una masa madre no admite prisas. Un caldo largo necesita su tiempo. Durante 21 dÃ­as vas a preparar alimentos que tienen su propio ritmo biolÃ³gico. Y en ese proceso â€” sin que te des cuenta â€” tu mente empieza a soltar.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-1 italic font-serif text-xl"
            style={{ borderColor: '#C9A84C', color: 'rgba(107,39,55,0.8)' }}
          >
            &ldquo;Tu sistema nervioso no se calma con informaciÃ³n. Se calma con experiencia repetida, sensorial y encarnada.&rdquo;
          </blockquote>
        </section>

        {/* â”€â”€ CÃ“MO FUNCIONA (TIMELINE) â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-timeline">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>El proceso</p>
          <h2 id="sfm-timeline" className="font-serif text-2xl md:text-3xl font-bold mb-10 leading-tight" style={{ color: '#2d0f16' }}>
            CÃ³mo funciona el reto
          </h2>
          <ol className="relative pl-6" style={{ listStyle: 'none' }}>
            <div
              aria-hidden="true"
              className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(107,39,55,0.15)' }}
            />
            {TIMELINE.map(({ day, title, text }) => (
              <li key={day} className="relative mb-8 last:mb-0">
                <div
                  aria-hidden="true"
                  className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: '#6B2737' }}
                />
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6B2737' }}>
                  DÃ­a {day}
                </p>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#2d0f16' }}>{title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.65)' }}>{text}</p>
              </li>
            ))}
            <li className="relative mb-0">
              <div
                aria-hidden="true"
                className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: '#C9A84C' }}
              />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#C9A84C' }}>
                Al completar
              </p>
              <h3 className="text-sm font-semibold" style={{ color: '#2d0f16' }}>
                Mapa de tu ritmo mental
              </h3>
            </li>
          </ol>
        </section>

        {/* â”€â”€ QUÃ‰ INCLUYE â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-incluye">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6B2737' }}>Contenido</p>
            <h2 id="sfm-incluye" className="font-serif text-2xl font-bold mb-8 leading-tight" style={{ color: '#2d0f16' }}>
              Lo que vas a encontrar dentro
            </h2>
            <ul className="space-y-4" role="list">
              {[
                { icon: 'ðŸ§ª', text: '21 preparaciones lentas â€” fermentos, masas, caldos, reposos' },
                { icon: 'ðŸŽ§', text: '21 audios de ritual guiado (antes de cocinar, no despuÃ©s)' },
                { icon: 'ðŸ“”', text: 'Diario de ritmo diario: Â¿cuÃ¡nto tardÃ©? Â¿cÃ³mo me sentÃ­?' },
                { icon: 'ðŸ’¬', text: 'Canal privado WhatsApp Premium con comunidad FoodÂ·Mood' },
                { icon: 'ðŸ“Š', text: 'Mapa de tu ritmo mental al dÃ­a 21' },
                { icon: 'ðŸ“š', text: 'Base cientÃ­fica descargable con referencias bibliogrÃ¡ficas' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#F5F0E8]"
                    style={{ backgroundColor: '#6B2737' }}
                    aria-hidden="true"
                  >âœ“</span>
                  {text}
                </li>
              ))}
            </ul>

            {/* Ingredientes protagonistas */}
            <p className="text-[10px] font-bold uppercase tracking-widest mt-10 mb-5" style={{ color: 'rgba(107,39,55,0.45)' }}>
              Ingredientes protagonistas
            </p>
            <dl className="space-y-4">
              {INGREDIENTS.map(({ name, note }) => (
                <div key={name}>
                  <dt className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#2d0f16' }}>
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: '#C9A84C' }}
                    />
                    {name}
                  </dt>
                  <dd className="text-xs font-light ml-3.5 mt-1 leading-relaxed" style={{ color: 'rgba(107,39,55,0.55)' }}>
                    {note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* â”€â”€ BASE CIENTÃFICA â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-ciencia">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Ciencia real</p>
          <h2 id="sfm-ciencia" className="font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ color: '#2d0f16' }}>
            Respaldado por ciencia real.
          </h2>
          <p className="text-sm font-light mb-8" style={{ color: 'rgba(107,39,55,0.55)' }}>
            Slow FoodÂ·Mood no es intuiciÃ³n. Es neurociencia aplicada a la cocina.
          </p>
          <div className="bg-white rounded-2xl px-5 py-2" style={{ border: '1px solid rgba(107,39,55,0.08)' }}>
            <SlowFoodMoodRefs />
          </div>
        </section>

        {/* â”€â”€ DIFERENCIACIÃ“N â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-diferencia">
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: 'rgba(107,39,55,0.04)', border: '1px solid rgba(107,39,55,0.1)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Comparativa</p>
            <h2 id="sfm-diferencia" className="font-serif text-xl font-bold mb-6 leading-tight" style={{ color: '#2d0f16' }}>
              Â¿En quÃ© se diferencia del FoodÂ·Mood Reset?
            </h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th scope="col" className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(107,39,55,0.4)', width: '28%' }}> </th>
                    <th scope="col" className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(107,39,55,0.5)', width: '36%' }}>FoodÂ·Mood Reset</th>
                    <th scope="col" className="text-left py-2 px-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#6B2737', width: '36%' }}>Slow FoodÂ·Mood</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ feature, reset, slow }) => (
                    <tr key={feature} style={{ borderTop: '1px solid rgba(107,39,55,0.08)' }}>
                      <th scope="row" className="py-3 px-3 text-[11px] font-bold uppercase tracking-wide text-left" style={{ color: 'rgba(107,39,55,0.4)' }}>{feature}</th>
                      <td className="py-3 px-3 text-xs font-light" style={{ color: 'rgba(107,39,55,0.6)' }}>{reset}</td>
                      <td className="py-3 px-3 text-xs font-semibold" style={{ color: '#2d0f16' }}>{slow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* â”€â”€ FAQ â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-20" aria-labelledby="sfm-faq">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>Dudas frecuentes</p>
          <h2 id="sfm-faq" className="font-serif text-2xl md:text-3xl font-bold mb-8 leading-tight" style={{ color: '#2d0f16' }}>
            Preguntas frecuentes
          </h2>
          <div className="bg-white rounded-2xl px-5 py-2" style={{ border: '1px solid rgba(107,39,55,0.08)' }}>
            <SlowFoodMoodFAQ />
          </div>
        </section>

        {/* â”€â”€ CTA FINAL â”€â”€ */}
        <section className="max-w-2xl mx-auto px-6 pb-24" aria-labelledby="sfm-cta" id="cta-compra">
          <div className="rounded-3xl p-10 md:p-14" style={{ backgroundColor: '#2d0f16' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: '#C9A84C' }}>Fast life. Slow FoodÂ·Mood.</p>
            <h2 id="sfm-cta" className="font-serif text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: '#F5F0E8' }}>
              Â¿Listo para ir mÃ¡s despacio?
            </h2>
            <p className="text-base font-light mb-6 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
              21 dÃ­as. Una preparaciÃ³n al dÃ­a. Y la ansiedad empieza a tener otro ritmo.
            </p>

            <SlowFoodMoodCTA
              challengeId={challengeId}
              isAuthenticated={isAuthenticated}
              compact
            />
          </div>
        </section>

        {/* â”€â”€ BACK LINK â”€â”€ */}
        <div className="text-center pb-16">
          <a href="/retos" className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
            â† Ver todos los retos
          </a>
        </div>

      </main>
    </>
  )
}

