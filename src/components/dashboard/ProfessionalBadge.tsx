'use client'

import { useLinkedProfessional } from '@/hooks/usePrescriptions'

export function ProfessionalBadge() {
  const { hasLink, professionalName, loading } = useLinkedProfessional()

  if (loading || !hasLink) return null

  return (
    <div
      className="max-w-[520px] w-full mx-auto rounded-2xl px-5 py-3 flex items-center gap-3"
      style={{
        backgroundColor: 'rgba(255,107,53,0.06)',
        border: '1px solid rgba(255,107,53,0.14)',
      }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{
          backgroundColor: '#FF6B35',
          boxShadow: '0 0 5px 1px rgba(255,107,53,0.35)',
        }}
      />
      <p className="text-xs font-light" style={{ color: 'rgba(45,15,22,0.6)' }}>
        Te acompaña{' '}
        <span className="font-medium" style={{ color: '#2d0f16' }}>
          {professionalName ?? 'tu profesional'}
        </span>
      </p>
    </div>
  )
}
