import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'En construcción | Food·Mood',
  robots: { index: false, follow: false },
}

export default function ConstruccionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-16"
      style={{ background: '#F5F0E8' }}>

      <div className="max-w-[400px] w-full text-center">

        <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl"
          style={{ background: 'rgba(107,39,55,0.08)' }}>
          🔧
        </div>

        <h1 className="font-serif text-[26px] font-normal mb-3" style={{ color: '#2a1a1e' }}>
          En construcción
        </h1>

        <p className="text-[14px] leading-relaxed mb-8" style={{ color: '#7a5c63' }}>
          Esta sección está en proceso de validación. Vuelve pronto.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold no-underline"
          style={{ background: '#6B2737', color: '#F5F0E8' }}
        >
          ← Volver al inicio
        </Link>

      </div>
    </main>
  )
}
