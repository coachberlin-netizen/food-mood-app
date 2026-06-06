import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllKbsMeta } from '@/lib/enciclopedia'
import { ExtractoDia } from './ExtractoDia'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Enciclopedia Food·Mood',
  description: 'La base científica detrás de cada recomendación. 16 artículos sobre longevidad, microbiota, hormonas, cronodieta y psicología alimentaria.',
}

const MOOD_COLORS: Record<string, string> = {
  Activación: '#E30B5D',
  Calma:      '#5A9B8A',
  Focus:      '#4A90D9',
  Social:     '#FF6B35',
  Reset:      '#7B68EE',
  Confort:    '#E8845A',
}

const EVIDENCE_LABELS: Record<string, { bg: string; fg: string }> = {
  A: { bg: 'rgba(34,197,94,0.1)',   fg: '#16a34a' },
  B: { bg: 'rgba(59,130,246,0.1)',  fg: '#2563eb' },
  C: { bg: 'rgba(245,158,11,0.1)',  fg: '#d97706' },
  D: { bg: 'rgba(156,163,175,0.1)', fg: '#6b7280' },
}

export default async function EnciclopediaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/enciclopedia')

  // Premium check
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

  if (!isPremium) {
    return (
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center p-6" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border" style={{ backgroundColor: 'rgba(255,107,53,0.08)', borderColor: 'rgba(255,107,53,0.25)' }}>
            <span className="text-2xl">📚</span>
          </div>
          <div className="space-y-3">
            <h1 className="font-serif text-2xl font-black" style={{ color: '#2d0f16' }}>Enciclopedia Food·Mood</h1>
            <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(45,15,22,0.55)' }}>
              16 artículos científicos sobre longevidad, microbiota, hormonas y psicología alimentaria. Incluido en la membresía Premium.
            </p>
          </div>
          <Link href="/pricing" className="inline-flex px-8 py-3.5 rounded-2xl text-sm font-bold" style={{ backgroundColor: '#FF6B35', color: '#2d0f16' }}>
            Ver membresía →
          </Link>
        </div>
      </div>
    )
  }

  const kbs = getAllKbsMeta()

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">

        {/* Header */}
        <header className="mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: '#FF6B35' }}>
            Enciclopedia
          </span>
          <h1 className="font-serif text-4xl md:text-5xl mt-3 mb-3 leading-tight" style={{ color: '#1A1612' }}>
            El porqué detrás<br className="hidden md:block" /> de cada cosa
          </h1>
          <p className="text-base font-light max-w-xl" style={{ color: 'rgba(26,22,18,0.6)' }}>
            {kbs.length} artículos científicos que fundamentan cada receta y cada recomendación del Asesor.
          </p>
        </header>

        {/* Extracto del día */}
        <ExtractoDia />

        {/* KB grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {kbs.map((kb) => {
            const ev = EVIDENCE_LABELS[kb.nivel_evidencia_general] ?? EVIDENCE_LABELS.B
            return (
              <Link
                key={kb.slug}
                href={`/enciclopedia/${kb.slug}`}
                className="group rounded-3xl p-6 transition-all hover:shadow-lg"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(26,22,18,0.07)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-serif text-4xl font-black select-none" style={{ color: 'rgba(26,22,18,0.06)' }}>
                    {String(kb.orden).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: ev.bg, color: ev.fg }}
                  >
                    Evidencia {kb.nivel_evidencia_general}
                  </span>
                </div>

                <h2
                  className="font-serif text-lg font-semibold mb-2 leading-snug group-hover:text-aubergine transition-colors"
                  style={{ color: '#1A1612' }}
                >
                  {kb.title}
                </h2>

                {kb.intro && (
                  <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(26,22,18,0.55)' }}>
                    {kb.intro}
                  </p>
                )}

                {/* Mood chips */}
                {kb.mood_relevance.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {kb.mood_relevance.map(m => (
                      <span
                        key={m}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
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
              </Link>
            )
          })}
        </div>

        <p className="text-center text-xs mt-12" style={{ color: 'rgba(26,22,18,0.3)' }}>
          Base científica actualizada · Mayo 2026 ·{' '}
          <Link href="/biblioteca" style={{ color: '#6B2737' }}>Ver papers y referencias →</Link>
        </p>
      </div>
    </main>
  )
}
