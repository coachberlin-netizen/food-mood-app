'use client'

import { useState } from 'react'

interface Props {
  titulo: string
  texto:  string
}

const PREVIEW = 120

export default function LecturaCard({ titulo, texto }: Props) {
  const [expandido, setExpandido] = useState(false)
  const largo = texto.length > PREVIEW

  return (
    <div className="rounded-xl border border-[#e8ddd5] p-4"
      style={{ backgroundColor: '#FAFAF5', borderLeftWidth: '3px', borderLeftColor: '#FF6B35' }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">💡</span>
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#7a5a00' }}>
          {titulo}
        </p>
      </div>
      <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.75)' }}>
        {largo && !expandido ? texto.slice(0, PREVIEW) + '…' : texto}
      </p>
      {largo && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="mt-2 text-xs font-semibold bg-transparent border-none p-0 cursor-pointer font-[inherit]"
          style={{ color: '#6B2737' }}
        >
          {expandido ? 'Leer menos ↑' : 'Leer más →'}
        </button>
      )}
    </div>
  )
}
