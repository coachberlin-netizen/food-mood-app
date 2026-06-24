import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ProCTA() {
  return (
    <aside
      aria-label="Food·Mood Pro para profesionales"
      className="my-16 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: '#0f0a0d',
        border: '1px solid rgba(255,107,53,0.2)',
      }}
    >
      <div className="px-8 py-10 md:px-12 md:py-12">
        <p
          className="text-[10px] font-sans tracking-[0.25em] uppercase mb-3"
          style={{ color: '#FF6B35' }}
        >
          The Longevity Studio · Food·Mood Lab
        </p>
        <h3
          className="font-serif text-xl md:text-2xl mb-3 leading-snug"
          style={{ color: '#F5F0E8' }}
        >
          Protocolos de cocina funcional para tu proyecto
        </h3>
        <p
          className="text-sm md:text-base leading-relaxed font-light mb-8 max-w-xl"
          style={{ color: 'rgba(245,240,232,0.6)' }}
        >
          Accede a los protocolos aplicados de The Longevity Studio — recetas funcionales
          con su nivel de evidencia, para hoteles, spas y profesionales de la salud.
        </p>
        <Link
          href="/protocolos"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#FF6B35',
            color: '#0f0a0d',
          }}
        >
          Ver protocolos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  )
}
