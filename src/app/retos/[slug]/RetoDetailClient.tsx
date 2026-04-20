"use client"

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
  id:             string
  current_day:    number
  completed:      boolean
  completed_at:   string | null
  fm_index_start: number | null
  fm_index_end:   number | null
  paid:           boolean
}

interface ChallengeDay {
  id:        string
  day_number: number
  title:     string
  recipe_id: string | null
  tip:       string | null
  audio_url: string | null
}

interface Props {
  challenge:    Challenge
  enrollment:   Enrollment | null
  todayContent: ChallengeDay | null
}

const MILESTONES: Record<number, string> = {
  7:  'Primera semana — los primeros cambios se sienten.',
  14: 'Segunda semana — el hábito empieza a formarse.',
  28: 'Reto completado — transformación medible.',
}

const SHORT_MILESTONES: Record<number, string> = {
  1: 'Día 1 — empieza el reset.',
  4: 'Día 4 — la mitad del camino.',
  7: 'Día 7 — reto completado.',
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function RetoDetailClient({ challenge, enrollment: initialEnrollment, todayContent: initialTodayContent }: Props) {
  const searchParams = useSearchParams()
  const [enrollment,   setEnrollment]   = useState(initialEnrollment)
  const [todayContent, setTodayContent] = useState(initialTodayContent)
  const [dayDone,      setDayDone]      = useState(false)
  const [checkoutErr,  setCheckoutErr]  = useState<string | null>(null)
  const [isPending,    startTransition]  = useTransition()
  const [showSuccess,  setShowSuccess]  = useState(false)

  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      const t = setTimeout(() => setShowSuccess(false), 6000)
      return () => clearTimeout(t)
    }
  }, [isSuccess])

  const rgb = hexToRgb(challenge.color)
  const pct = enrollment
    ? Math.min(100, ((enrollment.current_day - 1) / challenge.duration_days) * 100)
    : 0

  const milestones = challenge.duration_days <= 7 ? SHORT_MILESTONES : MILESTONES

  async function handleCheckout() {
    setCheckoutErr(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/retos/checkout', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ challenge_id: challenge.id }),
        })
        const data = await res.json()
        if (!res.ok) { setCheckoutErr(data.error ?? 'Error al procesar el pago'); return }
        window.location.href = data.url
      } catch {
        setCheckoutErr('Error de conexión. Inténtalo de nuevo.')
      }
    })
  }

  async function handleCompleteDay() {
    startTransition(async () => {
      const res = await fetch('/api/retos/complete-day', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ challenge_id: challenge.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setEnrollment(data.enrollment)
        setDayDone(true)
        if (!data.completed) {
          // Would need to refresh todayContent — router.refresh() would do it
          // but since this is a client component with server data we just clear it
          setTodayContent(null)
        }
      }
    })
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

      {/* ── Success banner ── */}
      {showSuccess && (
        <div
          className="fixed top-20 left-0 right-0 z-50 mx-auto max-w-lg px-4"
        >
          <div
            className="rounded-2xl px-6 py-4 text-center shadow-lg text-white font-semibold"
            style={{ backgroundColor: challenge.color }}
          >
            🎉 ¡Pago confirmado! Tu reto ha comenzado. Día 1 te espera.
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section
        className="px-6 pt-32 pb-16 text-center"
        style={{ background: `linear-gradient(160deg, rgba(${rgb},0.12) 0%, transparent 60%)` }}
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl block mb-4">{challenge.emoji}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-black mb-3 leading-tight" style={{ color: '#2d0f16' }}>
            {challenge.title}
          </h1>
          {challenge.subtitle && (
            <p className="text-lg font-light mb-6" style={{ color: 'rgba(107,39,55,0.65)' }}>
              {challenge.subtitle}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span
              className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: challenge.color }}
            >
              {challenge.duration_days === 7 ? '7 días' : '28 días'}
            </span>
            <span className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.5)' }}>
              Basado en evidencia · Seguimiento real con tu índice Food·Mood
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 pb-24 space-y-10">

        {/* ── Qué incluye ── */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-aubergine-dark/5">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-6"
            style={{ color: challenge.color }}
          >
            Qué incluye
          </p>
          {challenge.description && (
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.7)' }}>
              {challenge.description}
            </p>
          )}
          <ul className="space-y-3">
            {[
              `📘 ${challenge.recipe_count} recetas ${challenge.duration_days <= 7 ? 'de reset' : '— una por día'}`,
              `🎧 ${challenge.audio_count} audios de apoyo`,
              '💬 Acceso al grupo WhatsApp Premium durante el reto',
              '📊 Seguimiento diario con tu índice Food·Mood',
              '📋 Informe final personalizado al completar',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs text-white"
                  style={{ backgroundColor: challenge.color }}
                >✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Cómo funciona ── */}
        <section>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-5"
            style={{ color: 'rgba(107,39,55,0.5)' }}
          >
            Cómo funciona
          </p>
          <div className="relative pl-6">
            <div
              className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
              style={{ backgroundColor: `rgba(${rgb},0.25)` }}
            />
            {Object.entries(milestones).map(([day, label]) => (
              <div key={day} className="relative mb-6 last:mb-0">
                <div
                  className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: challenge.color }}
                />
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: challenge.color }}>
                  Día {day}
                </p>
                <p className="text-sm font-light" style={{ color: '#2d0f16' }}>{label}</p>
              </div>
            ))}
            <div className="relative mb-0">
              <div
                className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: '#C9A84C' }}
              />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#C9A84C' }}>
                Al completar
              </p>
              <p className="text-sm font-light" style={{ color: '#2d0f16' }}>
                Informe personalizado: índice inicio vs. fin, síntomas mejorados, siguiente reto recomendado.
              </p>
            </div>
          </div>
        </section>

        {/* ── Día actual (si inscrito y pagado) ── */}
        {enrollment?.paid && !enrollment.completed && (
          <section
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: `rgba(${rgb},0.06)`,
              borderColor:     `rgba(${rgb},0.2)`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: challenge.color }}
              >
                Tu día de hoy
              </p>
              <span className="text-xs font-semibold" style={{ color: challenge.color }}>
                Día {enrollment.current_day} / {challenge.duration_days}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full mb-5" style={{ backgroundColor: 'rgba(107,39,55,0.1)' }}>
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${Math.max(2, pct)}%`, backgroundColor: challenge.color }}
              />
            </div>

            {dayDone ? (
              <div className="text-center py-4">
                <p className="font-serif text-lg font-bold mb-1" style={{ color: '#2d0f16' }}>
                  ¡Día {enrollment.current_day - 1} completado! 🎉
                </p>
                <p className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.6)' }}>
                  Vuelve mañana para el día {enrollment.current_day}.
                </p>
              </div>
            ) : todayContent ? (
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold" style={{ color: '#2d0f16' }}>
                  {todayContent.title}
                </h3>
                {todayContent.tip && (
                  <div
                    className="rounded-xl p-4 border-l-4"
                    style={{ backgroundColor: 'white', borderLeftColor: challenge.color }}
                  >
                    <p className="text-sm font-light italic" style={{ color: '#2d0f16' }}>
                      💡 {todayContent.tip}
                    </p>
                  </div>
                )}
                {todayContent.audio_url && (
                  <audio controls src={todayContent.audio_url} className="w-full rounded-lg" />
                )}
                {todayContent.recipe_id && (
                  <Link
                    href={`/recetas/${todayContent.recipe_id}`}
                    className="block text-center py-3 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: challenge.color }}
                  >
                    Ver receta del día →
                  </Link>
                )}
                <button
                  onClick={handleCompleteDay}
                  disabled={isPending}
                  className="w-full py-3 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ borderColor: challenge.color, color: challenge.color }}
                >
                  {isPending ? 'Guardando…' : '✓ Marcar día como completado'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm font-light mb-4" style={{ color: 'rgba(107,39,55,0.6)' }}>
                  El contenido de hoy se publicará en breve.
                </p>
                <button
                  onClick={handleCompleteDay}
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80 disabled:opacity-50"
                  style={{ borderColor: challenge.color, color: challenge.color }}
                >
                  {isPending ? 'Guardando…' : '✓ Marcar día completado'}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── Completado ── */}
        {enrollment?.completed && (
          <section
            className="rounded-2xl p-8 text-center border"
            style={{ backgroundColor: `rgba(${rgb},0.06)`, borderColor: `rgba(${rgb},0.2)` }}
          >
            <p className="text-3xl mb-3">🏆</p>
            <p className="font-serif text-xl font-bold mb-2" style={{ color: '#2d0f16' }}>
              ¡Reto completado!
            </p>
            {enrollment.fm_index_start != null && enrollment.fm_index_end != null && (
              <p className="text-sm font-light mb-4" style={{ color: 'rgba(107,39,55,0.65)' }}>
                Índice {enrollment.fm_index_start} → {enrollment.fm_index_end}
                {enrollment.fm_index_end > enrollment.fm_index_start
                  ? ` · ↑ ${enrollment.fm_index_end - enrollment.fm_index_start} puntos de mejora`
                  : ''}
              </p>
            )}
            <Link
              href="/retos"
              className="text-sm font-bold"
              style={{ color: '#6B2737' }}
            >
              Ver más retos →
            </Link>
          </section>
        )}

        {/* ── CTA de compra ── */}
        {!enrollment?.paid && (
          <section
            className="rounded-3xl p-8 md:p-10"
            style={{ backgroundColor: '#2d0f16' }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: '#C9A84C' }}
            >
              Únete ahora
            </p>
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="font-serif text-5xl font-black" style={{ color: '#C9A84C' }}>
                  {challenge.price_eur}€
                </p>
                <p className="text-xs font-light mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Acceso completo · {challenge.duration_days} días
                </p>
              </div>
              <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Solo quedan algunas plazas esta semana
              </p>
            </div>

            {checkoutErr && (
              <p className="text-red-400 text-sm mb-4">{checkoutErr}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: challenge.color }}
            >
              {isPending ? 'Procesando…' : `Empezar mi reto →`}
            </button>

            <p className="text-xs font-light text-center mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Pago seguro vía Stripe · Acceso inmediato al completar
            </p>
          </section>
        )}

        {/* Pago pendiente */}
        {enrollment && !enrollment.paid && (
          <section className="text-center">
            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="px-8 py-3 rounded-full text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {isPending ? 'Procesando…' : 'Completar pago →'}
            </button>
          </section>
        )}

        {/* Back */}
        <Link
          href="/retos"
          className="block text-center text-sm font-light"
          style={{ color: 'rgba(107,39,55,0.45)' }}
        >
          ← Ver todos los retos
        </Link>

      </div>
    </main>
  )
}
