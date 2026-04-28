import { Suspense } from 'react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HistorialClient from './HistorialClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Historial · El Oráculo — Food·Mood',
  robots: { index: false },
}

export default async function HistorialPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/eloraculo/historial')

  const { data: checkins } = await supabase
    .from('oracle_checkins')
    .select('id, created_at, primary_emotion, secondary_emotion, energy_level, sleep_quality, primary_symptom, oracle_reading, recipe_mood_id, engine_output')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <Suspense>
      <HistorialClient checkins={checkins ?? []} />
    </Suspense>
  )
}
