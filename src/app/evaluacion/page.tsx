import { Metadata } from 'next'
import { Suspense } from 'react'
import { EvaluacionLanding } from './EvaluacionLanding'

export const metadata: Metadata = {
  title: 'Evaluación Nutricional Gratuita — Food·Mood',
  description:
    'Tests de perfil nutricional, psiconutrición, síntomas hormonales, cronotipo y objetivos. Valoración personalizada gratuita generada por IA.',
  alternates: { canonical: '/evaluacion' },
}

export default function EvaluacionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1A0A0E] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
        </div>
      }
    >
      <EvaluacionLanding />
    </Suspense>
  )
}
