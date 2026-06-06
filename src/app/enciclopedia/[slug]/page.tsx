import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAllKbsMeta, getKbBySlug } from '@/lib/enciclopedia'
import { KbDetailClient } from './KbDetailClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const kb = await getKbBySlug(slug)
  if (!kb) return {}
  return {
    title: `${kb.title} · Enciclopedia Food·Mood`,
    description: kb.intro,
  }
}

const MOOD_COLORS: Record<string, string> = {
  Activación: '#E30B5D',
  Calma:      '#5A9B8A',
  Focus:      '#4A90D9',
  Social:     '#FF6B35',
  Reset:      '#7B68EE',
  Confort:    '#E8845A',
}

const EVIDENCE_LABELS: Record<string, { bg: string; fg: string; label: string }> = {
  A: { bg: 'rgba(34,197,94,0.1)',   fg: '#16a34a', label: 'Evidencia sólida (meta-análisis, ECA)' },
  B: { bg: 'rgba(59,130,246,0.1)',  fg: '#2563eb', label: 'Evidencia moderada (estudios prospectivos)' },
  C: { bg: 'rgba(245,158,11,0.1)',  fg: '#d97706', label: 'Evidencia preliminar (estudios observacionales)' },
  D: { bg: 'rgba(156,163,175,0.1)', fg: '#6b7280', label: 'Evidencia emergente (preclínico o experto)' },
}

export default async function KbDetailPage({ params }: Props) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/enciclopedia/${slug}`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_level')
    .eq('id', user.id)
    .single()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const isPremium = sub?.status === 'active' || profile?.is_premium || (profile?.premium_level ?? 0) > 0

  if (!isPremium) redirect('/enciclopedia')

  const kb = await getKbBySlug(slug)
  if (!kb) notFound()

  const allKbs = getAllKbsMeta()
  const currentIndex = allKbs.findIndex(k => k.slug === slug)
  const prev = currentIndex > 0 ? allKbs[currentIndex - 1] : null
  const next = currentIndex < allKbs.length - 1 ? allKbs[currentIndex + 1] : null

  const ev = EVIDENCE_LABELS[kb.nivel_evidencia_general] ?? EVIDENCE_LABELS.B

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs" style={{ color: 'rgba(26,22,18,0.4)' }}>
          <Link href="/enciclopedia" className="hover:opacity-70 transition-opacity">Enciclopedia</Link>
          <span>/</span>
          <span style={{ color: 'rgba(26,22,18,0.6)' }}>{kb.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: ev.bg, color: ev.fg }}
              title={ev.label}
            >
              Evidencia {kb.nivel_evidencia_general}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(26,22,18,0.05)', color: 'rgba(26,22,18,0.4)' }}>
              Actualizado {kb.last_updated}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: '#1A1612' }}>
            {kb.title}
          </h1>

          {kb.intro && (
            <p className="text-base font-light leading-relaxed" style={{ color: 'rgba(26,22,18,0.6)' }}>
              {kb.intro}
            </p>
          )}

          {kb.mood_relevance.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {kb.mood_relevance.map(m => (
                <span
                  key={m}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${MOOD_COLORS[m] ?? '#888'}18`,
                    color: MOOD_COLORS[m] ?? '#888',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Table of contents */}
        {kb.sections.length > 3 && (
          <nav className="rounded-2xl p-5 mb-8" style={{ backgroundColor: 'rgba(26,22,18,0.03)', border: '1px solid rgba(26,22,18,0.07)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-3" style={{ color: '#FF6B35' }}>Índice</p>
            <ol className="space-y-1.5">
              {kb.sections.map((s, i) => (
                <li key={s.anchor}>
                  <a
                    href={`#${s.anchor}`}
                    className="text-sm hover:opacity-70 transition-opacity flex items-baseline gap-2"
                    style={{ color: s.level === 2 ? '#1A1612' : 'rgba(26,22,18,0.6)' }}
                  >
                    <span className="text-xs shrink-0" style={{ color: 'rgba(26,22,18,0.25)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={s.level === 3 ? 'pl-3' : ''}>{s.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Sections — client component handles bookmarks */}
        <KbDetailClient kb={kb} />

        {/* Prev / Next navigation */}
        <nav className="flex items-center justify-between mt-16 pt-8" style={{ borderTop: '1px solid rgba(26,22,18,0.08)' }}>
          {prev ? (
            <Link href={`/enciclopedia/${prev.slug}`} className="group flex flex-col gap-0.5 max-w-[45%]">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(26,22,18,0.3)' }}>← Anterior</span>
              <span className="text-sm font-medium group-hover:opacity-70 transition-opacity" style={{ color: '#1A1612' }}>{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/enciclopedia/${next.slug}`} className="group flex flex-col gap-0.5 max-w-[45%] text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(26,22,18,0.3)' }}>Siguiente →</span>
              <span className="text-sm font-medium group-hover:opacity-70 transition-opacity" style={{ color: '#1A1612' }}>{next.title}</span>
            </Link>
          ) : <div />}
        </nav>

        <p className="text-center text-xs mt-12" style={{ color: 'rgba(26,22,18,0.3)' }}>
          <Link href="/enciclopedia" style={{ color: '#6B2737' }}>← Volver a la Enciclopedia</Link>
          {' · '}
          <Link href="/biblioteca" style={{ color: '#6B2737' }}>Ver papers y referencias →</Link>
        </p>
      </div>
    </main>
  )
}
