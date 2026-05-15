import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, GraduationCap, Clock, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sesiones y Protocolos Personalizados — Food·Mood',
  description:
    'Sesión 1:1 y protocolo de 4 semanas supervisados por expertos universitarios en psicología, psicología de la alimentación y longevidad. Orientación rigurosa, humana y práctica.',
  alternates: { canonical: 'https://www.food-mood.app/servicios' },
  openGraph: {
    title: 'Sesiones y Protocolos Personalizados — Food·Mood',
    description:
      'Orientación personalizada supervisada por expertos universitarios en psicología, alimentación y longevidad.',
    url: 'https://www.food-mood.app/servicios',
    type: 'website',
    siteName: 'Food·Mood',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Servicios Food·Mood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sesiones y Protocolos Personalizados — Food·Mood',
    description: 'Supervisado por expertos universitarios en psicología, alimentación y longevidad.',
    images: ['/og-image.png'],
  },
}

const LD_JSON = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Food·Mood', item: 'https://www.food-mood.app' },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://www.food-mood.app/servicios' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sesión Premium 1:1 Food·Mood',
    description:
      'Sesión personalizada de 75 minutos para entender qué te está pidiendo tu cuerpo y cómo empezar a regularlo a través de la comida, tus ritmos y pequeños cambios sostenibles. Supervisada por expertos universitarios en psicología, psicología de la alimentación y longevidad.',
    provider: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
    offers: {
      '@type': 'Offer',
      price: '75.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    serviceType: 'Consulta de nutrición emocional',
    areaServed: { '@type': 'Country', name: 'Spain' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Protocolo Premium 4 Semanas Food·Mood',
    description:
      'Acompañamiento de 4 semanas para ordenar alimentación, señales emocionales y hábitos con estructura y seguimiento. Supervisado por expertos universitarios en psicología, psicología de la alimentación y longevidad.',
    provider: { '@type': 'Organization', name: 'Food·Mood', url: 'https://www.food-mood.app' },
    offers: {
      '@type': 'Offer',
      price: '135.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    serviceType: 'Protocolo de nutrición emocional',
    areaServed: { '@type': 'Country', name: 'Spain' },
  },
]

const SESSION_INCLUDES = [
  'Sesión online 1:1 de 75 minutos',
  'Lectura de tu situación actual: emociones, síntomas, energía, digestión y hábitos',
  'Recomendaciones concretas y realistas para tus próximas semanas',
  'Resumen escrito posterior con tus puntos clave',
]

const PROTOCOL_INCLUDES = [
  'Sesión inicial de 60–75 minutos',
  'Plan personalizado de 4 semanas',
  'Ideas de comidas, recetas y rituales adaptados a ti',
  'Un check-in intermedio',
  'Cierre final con próximos pasos',
  'Acceso premium a Food·Mood durante el proceso',
]

const SESSION_FOR = [
  'Comes "bien" pero no terminas de encontrarte bien',
  'Se repiten el cansancio, la ansiedad, los antojos o la inflamación',
  'Quieres una mirada más profunda y personalizada',
]

const PROTOCOL_FOR = [
  'No quieres solo una sesión puntual',
  'Buscas un proceso con estructura, seguimiento y un plan',
  'Quieres que el plan esté adaptado a tu momento vital concreto',
]

export default function ServiciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
      />

      <main className="min-h-screen bg-[var(--background)]">

        {/* ── HERO ── */}
        <section className="bg-aubergine-dark pt-36 pb-24 px-6 relative overflow-hidden">
          {/* Fondo sutil */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,168,76,0.08) 0%, transparent 70%)',
          }} />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge expertos */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-gold/30 bg-gold/5">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                Supervisado por expertos universitarios
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-cream mb-6 tracking-tight leading-[1.05]">
              Una mirada más<br />
              <em className="italic text-gold">profunda y personal</em>
            </h1>

            <p className="text-xl text-cream/60 font-light leading-relaxed max-w-2xl mx-auto mb-4">
              Sesiones y protocolos de nutrición emocional con psicólogas,
              gerontólogas y expertas en longevidad.
            </p>
            <p className="text-base text-cream/40 font-light max-w-xl mx-auto">
              Una orientación rigurosa, humana y basada en conocimiento actualizado —
              para que los cambios sean reales y duraderos.
            </p>
          </div>
        </section>

        {/* ── CARDS DE SERVICIO ── */}
        <section className="py-24 px-6 bg-[#F5F0E8]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">

            {/* ─ SESIÓN 1:1 ─ */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-luxury border border-aubergine-dark/8 flex flex-col">
              {/* Header card */}
              <div className="bg-aubergine-dark p-8 pb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Sesión única</span>
                <h2 className="text-3xl font-serif text-cream mt-2 mb-3">Sesión Premium 1:1</h2>
                <p className="text-cream/60 font-light text-sm leading-relaxed">
                  Una sesión personalizada para entender qué te está pidiendo tu cuerpo
                  y cómo empezar a regularlo a través de la comida, tus ritmos y pequeños
                  cambios sostenibles.
                </p>
                {/* Precio */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-serif text-gold">75€</span>
                  <span className="text-cream/40 text-sm font-light">· sesión única</span>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-8 flex-1">
                {/* Para quién */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Para ti si...
                  </h3>
                  <ul className="space-y-3">
                    {SESSION_FOR.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-aubergine-dark/70 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qué incluye */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Qué incluye
                  </h3>
                  <ul className="space-y-3">
                    {SESSION_INCLUDES.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-aubergine-dark/80 font-light">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-6 pt-2 border-t border-aubergine-dark/8">
                  <div className="flex items-center gap-2 text-xs text-aubergine-dark/40 font-light">
                    <Clock className="w-3.5 h-3.5" /> 75 minutos · online
                  </div>
                  <div className="flex items-center gap-2 text-xs text-aubergine-dark/40 font-light">
                    <GraduationCap className="w-3.5 h-3.5" /> Psicología · Longevidad
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://calendly.com/coachberlin/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block text-center bg-aubergine-dark hover:bg-[#5C1320] text-cream font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  Reservar mi sesión →
                </a>
              </div>
            </article>

            {/* ─ PROTOCOLO 4 SEMANAS ─ */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-luxury border-2 border-gold/40 flex flex-col relative">
              {/* Badge destacado */}
              <div className="absolute top-5 right-5 z-10">
                <span className="bg-gold text-aubergine-dark text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                  Más completo
                </span>
              </div>

              {/* Header card */}
              <div className="bg-[#1a1118] p-8 pb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70">Proceso guiado</span>
                <h2 className="text-3xl font-serif text-cream mt-2 mb-3">Protocolo 4 Semanas</h2>
                <p className="text-cream/60 font-light text-sm leading-relaxed">
                  Un acompañamiento más profundo para ayudarte a ordenar tu alimentación,
                  tus señales emocionales y tus hábitos con una guía clara durante 4 semanas.
                </p>
                {/* Precio */}
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-serif text-gold">135€</span>
                  <span className="text-cream/40 text-sm font-light">· proceso completo</span>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-8 flex-1">
                {/* Para quién */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Para ti si...
                  </h3>
                  <ul className="space-y-3">
                    {PROTOCOL_FOR.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-aubergine-dark/70 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qué incluye */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/40 mb-4">
                    Qué incluye
                  </h3>
                  <ul className="space-y-3">
                    {PROTOCOL_INCLUDES.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-aubergine-dark/80 font-light">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-6 pt-2 border-t border-aubergine-dark/8">
                  <div className="flex items-center gap-2 text-xs text-aubergine-dark/40 font-light">
                    <Calendar className="w-3.5 h-3.5" /> 4 semanas · online
                  </div>
                  <div className="flex items-center gap-2 text-xs text-aubergine-dark/40 font-light">
                    <GraduationCap className="w-3.5 h-3.5" /> Psicología · Gerontología
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://calendly.com/coachberlin/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block text-center bg-gold hover:bg-[#b8953e] text-aubergine-dark font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  Quiero mi protocolo →
                </a>
              </div>
            </article>

          </div>
        </section>

        {/* ── BLOQUE CONFIANZA ── */}
        <section className="py-20 px-6 bg-aubergine-dark">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <GraduationCap className="w-10 h-10 text-gold mx-auto" />
            <h2 className="text-3xl md:text-4xl font-serif text-cream leading-tight">
              Psicólogas · Gerontólogas · Expertas en longevidad
            </h2>
            <p className="text-cream/50 font-light text-lg leading-relaxed">
              Una propuesta que integra la mirada emocional, conductual y nutricional en un
              formato práctico y cercano — para que los cambios que empieces tengan sentido
              dentro de tu vida real.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/como-funciona"
                className="inline-flex items-center gap-2 text-gold/70 hover:text-gold text-sm font-light transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> Cómo funciona Food·Mood
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-cream/40 hover:text-cream/70 text-sm font-light transition-colors"
              >
                <ArrowRight className="w-4 h-4" /> Ver planes digitales
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ BREVE ── */}
        <section className="py-20 px-6 bg-[#F5F0E8]">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-serif text-aubergine-dark text-center mb-12">Preguntas frecuentes</h2>

            {[
              {
                q: '¿Las sesiones son completamente online?',
                a: 'Sí. Todas las sesiones y el seguimiento del protocolo se realizan online, por videollamada. Sin desplazamientos.',
              },
              {
                q: '¿Hay que ser usuario Premium de Food·Mood para reservar?',
                a: 'No. Las sesiones son independientes de la suscripción digital. El protocolo de 4 semanas incluye acceso premium durante el proceso.',
              },
              {
                q: '¿Cómo reservo mi sesión?',
                a: 'Escríbenos a info@food-mood.app con el asunto "Sesión 1:1" o "Protocolo 4 Semanas" y te enviamos disponibilidad en 24 horas.',
              },
              {
                q: '¿Esto sustituye a un médico o dietista?',
                a: 'No. Food·Mood ofrece orientación basada en psicología de la alimentación y longevidad. No sustituye el diagnóstico ni el tratamiento médico. Ante cualquier duda de salud, consulta a un profesional sanitario.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-aubergine-dark/10 pb-8">
                <h3 className="font-serif text-lg text-aubergine-dark mb-3">{item.q}</h3>
                <p className="text-aubergine-dark/60 font-light text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}
