import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { GateForm } from './GateForm'
import { ProtocolosContent } from './ProtocolosContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'Zona de cliente · Food·Mood Lab',
  robots: { index: false, follow: false },
}

export default async function ProtocolosPage() {
  const cookieStore = await cookies()
  const hasAccess   = cookieStore.get('protocolos_access')?.value === 'ok'

  if (!hasAccess) return <GateForm />
  return <ProtocolosContent />
}
