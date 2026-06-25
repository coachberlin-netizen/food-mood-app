'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useActivePatientProtocol } from '@/hooks/useActivePatientProtocol'

export function ProtocolCard() {
  const { protocol, loading } = useActivePatientProtocol()

  if (loading || !protocol) return null

  const pct = Math.min(100, (protocol.days_elapsed / protocol.duration_days) * 100)

  return (
    <Link
      href="/practicas"
      className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: '#2d0f16', border: '1px solid rgba(255,107,53,0.15)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF6B35' }}>
          Protocolo activo
        </p>
        <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.3)' }}>
          Ver prácticas →
        </span>
      </div>
      <p className="font-serif text-base font-semibold mb-1" style={{ color: '#F5F0E8' }}>
        {protocol.protocol_name}
      </p>
      <p className="text-xs mb-4" style={{ color: 'rgba(245,240,232,0.60)' }}>
        Día {protocol.days_elapsed} de {protocol.duration_days} · {protocol.stage_name}
      </p>
      <div className="w-full h-1 rounded-full" style={{ backgroundColor: 'rgba(245,240,232,0.08)' }}>
        <motion.div
          className="h-1 rounded-full"
          style={{ backgroundColor: '#FF6B35' }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(1, pct)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </Link>
  )
}
