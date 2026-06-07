"use client"

import { useEffect } from 'react'

export default function RetoError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[reto-error]', error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ backgroundColor: '#F5F0E8' }}>
      <p className="font-serif text-xl font-bold" style={{ color: '#2d0f16' }}>Algo ha fallado</p>
      <pre className="text-xs bg-white rounded-xl p-4 max-w-xl w-full overflow-auto border" style={{ borderColor: 'rgba(107,39,55,0.1)', color: '#6B2737' }}>
        {error.message}
        {error.digest ? `\nDigest: ${error.digest}` : ''}
      </pre>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: '#6B2737' }}
      >
        Reintentar
      </button>
      <a href="/" className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.5)' }}>
        ← Inicio
      </a>
    </main>
  )
}
