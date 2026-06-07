import Link from 'next/link'
import type { Metadata } from 'next'

const CANONICAL = 'https://www.food-mood.app/pro'

export const metadata: Metadata = {
  title: 'Food·Mood Pro — Psicología práctica y recetario funcional en consulta',
  description: 'Herramientas de psicología práctica para trabajar la relación con la comida entre sesiones, y un recetario funcional que prescribes. Todo bajo tu criterio, en un mismo flujo.',
  alternates: { canonical: CANONICAL, languages: { es: CANONICAL } },
  openGraph: {
    title: 'Food·Mood Pro — Psicología práctica y recetario funcional',
    description: 'Herramientas de TCC, ACT y autocompasión integradas con un recetario funcional prescrito por el profesional.',
    url: CANONICAL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Food·Mood Pro — Portal profesional' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Food·Mood Pro — Psicología práctica y recetario funcional',
    description: 'TCC, ACT, autocompasión e interocepción integradas con un recetario funcional que prescribes tú.',
    images: ['/og-image.png'],
  },
}

const MODULOS = [
  {
    icono: '🧠',
    titulo: 'Seguimiento entre sesiones',
    desc: 'Captura lo que ocurre entre sesiones —patrones de conducta, momentos críticos, relación con la comida— y te lo devuelve organizado antes de cada cita.',
  },
  {
    icono: '📋',
    titulo: 'Preparación de sesión',
    desc: 'Resumen clínico del paciente antes de cada cita: estado emocional, registro alimentario, hitos y alertas relevantes.',
  },
  {
    icono: '🛠️',
    titulo: 'Herramientas clínicas integradas',
    desc: 'TCC, ACT, autocompasión e interocepción disponibles en el seguimiento. Asignables por paciente según tu criterio.',
  },
  {
    icono: '🥗',
    titulo: 'Recetas funcionales prescritas',
    desc: 'El profesional selecciona y prescribe recetas según el momento del paciente: microbiota, antioxidantes y valor nutricional, desde el placer. El paciente las recibe en su app únicamente cuando se las asignas.',
  },
  {
    icono: '📊',
    titulo: 'Retos y protocolos clínicos',
    desc: 'Programas de 7 a 45 días que el profesional activa para cada paciente. Seguimiento diario con informe personalizado al completar.',
  },
]

export default function ProLandingPage() {
  return (
    <main className="min-h-screen font-[inherit]" style={{ background: '#F5F0E8' }}>

      {/* Nav */}
      <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-lg no-underline" style={{ color: '#6B2737' }}>
          Food·Mood
        </Link>
        <Link
          href="/pro/login"
          className="text-[13px] font-semibold no-underline px-4 py-2 rounded-full"
          style={{ background: '#6B2737', color: '#F5F0E8' }}
        >
          Acceso profesional
        </Link>
      </div>

      <div className="max-w-[640px] mx-auto px-5 pb-20">

        {/* Hero */}
        <div className="py-14 text-center">
          <div
            className="inline-flex items-center rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest mb-5"
            style={{ background: '#f5eaec', color: '#6B2737' }}
          >
            Para profesionales de la salud mental y la nutrición
          </div>
          <h1 className="font-serif text-[34px] font-normal leading-tight mb-5" style={{ color: '#2a1a1e' }}>
            Food·Mood Pro
          </h1>
          <p className="text-[15px] leading-relaxed max-w-[520px] mx-auto" style={{ color: '#4a3a3e' }}>
            Food·Mood Pro reúne lo que normalmente queda separado: herramientas de psicología práctica para trabajar la relación con la comida entre sesiones, y un recetario funcional que prescribes para acompañar el bienestar del paciente. Todo bajo tu criterio, en un mismo flujo.
          </p>
        </div>

        {/* Dos patas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Columna A — La mente */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e8ddd5', borderLeft: '4px solid #6B2737' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6B2737' }}>
              Psicología práctica en consulta
            </p>
            <h2 className="font-serif text-[18px] font-normal mb-3" style={{ color: '#2a1a1e' }}>
              La mente
            </h2>
            <p className="text-[13px] leading-relaxed" style={{ color: '#4a3a3e' }}>
              Captura lo que ocurre entre sesiones —patrones de conducta, momentos críticos, relación con la comida— y te lo devuelve organizado antes de cada cita. Herramientas de TCC, ACT, autocompasión e interocepción integradas en el seguimiento.
            </p>
          </div>

          {/* Columna B — El plato */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e8ddd5', borderLeft: '4px solid #C9A84C' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#C9A84C' }}>
              Recetas funcionales que prescribes tú
            </p>
            <h2 className="font-serif text-[18px] font-normal mb-3" style={{ color: '#2a1a1e' }}>
              El plato
            </h2>
            <p className="text-[13px] leading-relaxed" style={{ color: '#4a3a3e' }}>
              Un recetario pensado desde el placer y el valor nutricional: microbiota, alimentos antioxidantes y de alta densidad nutricional, que pueden acompañar el bienestar. El profesional las prescribe a cada paciente según su momento. El paciente no las elige ni accede por su cuenta: todo pasa por tu criterio. Sin dietas, sin restricción: comida que nutre y apetece.
            </p>
          </div>
        </div>

        {/* CTA principal */}
        <div className="text-center mb-14">
          <Link
            href="/pro/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold no-underline transition-all hover:brightness-110"
            style={{ background: '#6B2737', color: '#F5F0E8' }}
          >
            Acceder al portal →
          </Link>
          <p className="text-[12px] mt-3" style={{ color: '#9e8080' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/pro/signup" className="no-underline font-semibold" style={{ color: '#6B2737' }}>
              Solicita acceso
            </Link>
          </p>
        </div>

        {/* Módulos */}
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-widest text-center mb-6" style={{ color: '#9e8080' }}>
            Qué incluye el portal profesional
          </p>
          <div className="flex flex-col gap-3">
            {MODULOS.map(({ icono, titulo, desc }) => (
              <div
                key={titulo}
                className="rounded-2xl p-5 flex gap-4"
                style={{ background: '#fff', border: '1px solid #e8ddd5' }}
              >
                <div className="text-2xl shrink-0 mt-0.5">{icono}</div>
                <div>
                  <p className="text-[14px] font-semibold mb-1" style={{ color: '#2a1a1e' }}>{titulo}</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: '#7a5c63' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer legal */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#faf8f5', border: '1px solid #e8ddd5' }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: '#9e8080' }}>
            Las recetas y contenidos los prescribe el profesional y acompañan el bienestar; se basan en evidencia en desarrollo y no constituyen tratamiento ni prometen efectos clínicos garantizados. Food·Mood Pro no es un dispositivo médico ni está indicada para el tratamiento de trastornos de la conducta alimentaria; ante su sospecha, se recomienda derivación a un equipo especializado.
          </p>
        </div>

      </div>
    </main>
  )
}
