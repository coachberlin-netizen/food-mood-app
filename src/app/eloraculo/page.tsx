import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import OracleClient from './OracleClient'

export const metadata: Metadata = {
  title: 'Check-in diario — Registro emocional | Food·Mood',
  description:
    'Registra tu estado emocional, energía, síntomas y ciclo. Los datos van a tu profesional de salud para preparar vuestra próxima sesión.',
  alternates: { canonical: 'https://www.food-mood.app/eloraculo' },
  robots: { index: false },
  openGraph: {
    title: 'Check-in diario — Food·Mood',
    description:
      'Registra tu estado emocional y físico de hoy. Herramienta de seguimiento para pacientes de Food·Mood.',
    url: 'https://www.food-mood.app/eloraculo',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Check-in diario — Food·Mood' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Check-in diario — Food·Mood',
    description: 'Registra tu estado emocional y físico de hoy.',
  },
}

export const dynamic = 'force-dynamic'

export default async function OraclePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isPremium = user ? await getPremiumStatus(supabase, user.id) : false

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1A0A0E] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
      </div>
    }>
      <OracleClient isPremium={isPremium} />
    </Suspense>
  )
}
