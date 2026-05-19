'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ExtractData {
  kb: { slug: string; title: string; nivel_evidencia_general: string }
  section: { anchor: string; heading: string; html: string }
}

const EVIDENCE_LABELS: Record<string, { bg: string; fg: string }> = {
  A: { bg: 'rgba(34,197,94,0.1)',   fg: '#16a34a' },
  B: { bg: 'rgba(59,130,246,0.1)',  fg: '#2563eb' },
  C: { bg: 'rgba(245,158,11,0.1)',  fg: '#d97706' },
  D: { bg: 'rgba(156,163,175,0.1)', fg: '#6b7280' },
}

export function ExtractoDia() {
  const [data, setData] = useState<ExtractData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/enciclopedia/extracto')
      .then(r => r.json())
      .then(d => { if (d.kb) setData(d) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl p-6 mb-8 animate-pulse" style={{ backgroundColor: '#fff', border: '1px solid rgba(26,22,18,0.07)', minHeight: 120 }} />
    )
  }

  if (!data) return null

  const ev = EVIDENCE_LABELS[data.kb.nivel_evidencia_general] ?? EVIDENCE_LABELS.B

  return (
    <div className="rounded-3xl p-6 mb-8" style={{ backgroundColor: '#fff', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 2px 20px rgba(201,168,76,0.06)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: '#C9A84C' }}>
          Extracto del día
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: ev.bg, color: ev.fg }}
        >
          Evidencia {data.kb.nivel_evidencia_general}
        </span>
      </div>

      <p className="text-xs font-medium mb-1" style={{ color: 'rgba(26,22,18,0.4)' }}>
        De: {data.kb.title}
      </p>

      <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: '#1A1612' }}>
        {data.section.heading}
      </h3>

      <div
        className="prose prose-sm max-w-none line-clamp-4 text-sm leading-relaxed"
        style={{ color: 'rgba(26,22,18,0.7)' }}
        dangerouslySetInnerHTML={{ __html: data.section.html }}
      />

      <Link
        href={`/enciclopedia/${data.kb.slug}#${data.section.anchor}`}
        className="inline-flex items-center gap-1 mt-4 text-xs font-semibold transition-opacity hover:opacity-70"
        style={{ color: '#6B2737' }}
      >
        Leer artículo completo →
      </Link>
    </div>
  )
}
