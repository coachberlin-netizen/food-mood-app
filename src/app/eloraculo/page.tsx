import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import OracleClient from './OracleClient'

export const metadata: Metadata = {
  title: 'El Oráculo Bioquímico — IA de nutrición emocional femenina | Food·Mood',
  description:
    'Tecnología femtech basada en neurociencia nutricional. Registra tu estado emocional, energía y ciclo menstrual y recibe cada día una lectura personalizada desde el eje intestino-cerebro. Postbióticos, crononutrición y regulación del sistema nervioso.',
  keywords: [
    'femtech', 'women\'s health technology', 'salud femenina digital',
    'nutrición emocional mujer', 'eje intestino-cerebro', 'gut-brain axis women',
    'regulación hormonal nutrición', 'ciclo menstrual alimentación', 'cycle syncing nutrition',
    'mental fitness mujer', 'emotional intelligence nutrition', 'microbioma femenino',
    'psicobióticos', 'estrobolome', 'postbióticos mujer', 'nervous system care',
    'crononutrición', 'biohacking femenino', 'health tech mujer', 'women wellness app',
    'female nutrition AI', 'inteligencia artificial salud femenina',
  ].join(', '),
  alternates: { canonical: 'https://www.food-mood.app/eloraculo' },
  openGraph: {
    title: 'El Oráculo Bioquímico — IA femtech de nutrición emocional | Food·Mood',
    description:
      'Tu cuerpo habla. Tus emociones también. IA femtech que conecta ciclo menstrual, estado emocional y microbioma para darte una lectura nutricional personalizada cada día.',
    url: 'https://www.food-mood.app/eloraculo',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'El Oráculo Bioquímico — Food·Mood femtech IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Oráculo Bioquímico — IA femtech de nutrición emocional | Food·Mood',
    description: 'IA que conecta ciclo, emociones y microbioma para darte una lectura nutricional personalizada cada día.',
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
