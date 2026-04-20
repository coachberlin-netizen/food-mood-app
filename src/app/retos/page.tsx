"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ── Twemoji helpers ───────────────────────────────────────────────────────────
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg'
const TWEMOJI: Record<string, string> = {
  '😴': '1f634', '⚡': '26a1',  '🌿': '1f33f', '🌸': '1f338',
  '📘': '1f4d8', '🎧': '1f3a7', '📊': '1f4ca',
}

function Twemoji({ emoji, size }: { emoji: string; size: number }) {
  const code = TWEMOJI[emoji]
  if (!code) return <span>{emoji}</span>
  return (
    <img
      src={`${TWEMOJI_BASE}/${code}.svg`}
      width={size}
      height={size}
      alt={emoji}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}

interface Challenge {
  id:           string
  slug:         string
  title:        string
  subtitle:     string | null
  description:  string | null
  category:     string
  duration_days: number
  price_eur:    number
  color:        string
  emoji:        string
  recipe_count: number
  audio_count:  number
}

interface Enrollment {
  challenge_id: string
  current_day:  number
  completed:    boolean
  paid:         boolean
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(107,39,55,0.1)' }}>
      <div
        className="h-1.5 rounded-full transition-all"
        style={{ width: `${Math.max(2, value)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ChallengeCard({
  challenge,
  enrollment,
}: {
  challenge: Challenge
  enrollment: Enrollment | undefined
}) {
  const pct = enrollment
    ? Math.min(100, ((enrollment.current_day - 1) / challenge.duration_days) * 100)
    : 0

  return (
    <div
      className="bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
      style={{ borderLeftColor: challenge.color }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        {/* Emoji con halo de color temático */}
        <div
          className="flex items-center justify-center rounded-2xl shrink-0"
          style={{
            width: 52, height: 52,
            backgroundColor: `${challenge.color}18`,
          }}
        >
          <Twemoji emoji={challenge.emoji} size={32} />
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: challenge.color }}
          >
            {challenge.duration_days === 7 ? '1 semana' : '4 semanas'}
          </span>
          <span
            className="text-[10px] uppercase tracking-widest font-medium"
            style={{ color: 'rgba(107,39,55,0.45)' }}
          >
            {challenge.category}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2
          className="font-serif text-xl font-bold leading-snug mb-1"
          style={{ color: '#2d0f16' }}
        >
          {challenge.title}
        </h2>
        {challenge.subtitle && (
          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.65)' }}>
            {challenge.subtitle}
          </p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: 'rgba(107,39,55,0.5)' }}>
        <span className="flex items-center gap-1">
          <Twemoji emoji="📘" size={14} />
          <span>{challenge.recipe_count} recetas</span>
        </span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1">
          <Twemoji emoji="🎧" size={14} />
          <span>{challenge.audio_count} audios</span>
        </span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1">
          <Twemoji emoji="📊" size={14} />
          <span>tracking diario</span>
        </span>
      </div>

      {/* Enrollment state */}
      {enrollment?.paid && !enrollment.completed ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: challenge.color }}>
              Día {enrollment.current_day} de {challenge.duration_days}
            </span>
            <span className="text-xs" style={{ color: 'rgba(107,39,55,0.4)' }}>
              {Math.round(pct)}%
            </span>
          </div>
          <ProgressBar value={pct} color={challenge.color} />
          <Link
            href={`/retos/${challenge.slug}`}
            className="mt-1 text-center py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: challenge.color }}
          >
            Continuar →
          </Link>
        </div>
      ) : enrollment?.completed ? (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-green-700">✓ Reto completado</span>
          <Link href={`/retos/${challenge.slug}`} className="text-xs font-bold" style={{ color: '#6B2737' }}>
            Ver informe →
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl font-black" style={{ color: '#C9A84C' }}>
            {challenge.price_eur}€
          </span>
          <Link
            href={`/retos/${challenge.slug}`}
            className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#6B2737' }}
          >
            Empezar →
          </Link>
        </div>
      )}
    </div>
  )
}

export default function RetosPage() {
  const [challenges, setChallenges]   = useState<Challenge[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const [{ data: ch }, { data: { user } }] = await Promise.all([
        supabase.from('challenges').select('*').eq('is_active', true).order('created_at'),
        supabase.auth.getUser(),
      ])

      setChallenges((ch ?? []) as Challenge[])

      if (user) {
        const { data: en } = await supabase
          .from('user_challenges')
          .select('challenge_id, current_day, completed, paid')
          .eq('user_id', user.id)
        setEnrollments((en ?? []) as Enrollment[])
      }

      setLoading(false)
    }
    load()
  }, [])

  const enrollmentMap = new Map(enrollments.map(e => [e.challenge_id, e]))

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-4xl mx-auto px-6 py-32 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* ── Hero ── */}
        <section className="mb-16 text-center">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] block mb-6"
            style={{ color: 'rgba(107,39,55,0.45)' }}
          >
            Transformaciones guiadas · Con ciencia y receta
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-black mb-4 leading-tight" style={{ color: '#2d0f16' }}>
            Elige tu reto.
          </h1>
          <p className="text-lg font-light max-w-xl mx-auto" style={{ color: 'rgba(107,39,55,0.6)' }}>
            Un objetivo. Un tiempo. Un camino con datos reales.
          </p>
        </section>

        {/* ── Grid ── */}
        <section className="grid md:grid-cols-2 gap-6 mb-20">
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              enrollment={enrollmentMap.get(challenge.id)}
            />
          ))}
        </section>

        {/* ── Por qué funcionan ── */}
        <section
          className="rounded-3xl p-10 md:p-16 text-center"
          style={{ backgroundColor: '#2d0f16' }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{ color: '#C9A84C' }}
          >
            Por qué funcionan
          </p>
          <p
            className="font-serif text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Los retos son el único formato donde la intención se convierte
            en acción sostenida. Porque tienen principio, medio y fin.
          </p>
          <p className="text-sm font-light mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Inicio · Seguimiento diario con tu índice Food·Mood · Informe final
          </p>
        </section>

      </div>
    </main>
  )
}
