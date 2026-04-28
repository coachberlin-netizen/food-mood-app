import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import OracleClient from './OracleClient'

export const metadata: Metadata = {
  title: 'El Oráculo Bioquímico — Tu lectura emocional y nutricional | Food·Mood',
  description:
    'Registra cómo te sientes hoy y recibe una lectura personalizada basada en tu estado emocional, energía y síntomas. Nutrición emocional guiada por el eje intestino-cerebro.',
  alternates: { canonical: 'https://www.food-mood.app/eloraculo' },
  openGraph: {
    title: 'El Oráculo Bioquímico | Food·Mood',
    description:
      'Tu cuerpo habla. Tus emociones también. Recibe una lectura nutricional personalizada cada día.',
    url: 'https://www.food-mood.app/eloraculo',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'El Oráculo Bioquímico — Food·Mood' }],
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
