import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResultadoClient } from './ResultadoClient'

export const metadata: Metadata = {
  title: 'Tu Valoración Nutricional — Food·Mood',
  description: 'Tu valoración psiconutricional personalizada generada por IA, basada en tus tests completados.',
  robots: { index: false },
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A0A0E] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        </div>
      }
    >
      <ResultadoClient />
    </Suspense>
  )
}
