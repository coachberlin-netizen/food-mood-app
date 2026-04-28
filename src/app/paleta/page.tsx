import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPremiumStatus } from '@/lib/premium'
import PaletaClient from './PaletaClient'

export const metadata = {
  title: 'Paleta Emocional · Food·Mood',
  description: 'Mezcla tus sensaciones y descubre tu color emocional hoy.',
}

export default async function PaletaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/paleta')

  const isPremium = await getPremiumStatus(supabase, user.id)

  return <PaletaClient initialIsPremium={isPremium} />
}
