import { redirect } from 'next/navigation'
import { FEATURES } from '@/lib/featureFlags'
import ViajeClient from './ViajeClient'

export default function ViajePage() {
  if (!FEATURES.journey90d) redirect('/construccion')
  return <ViajeClient />
}
