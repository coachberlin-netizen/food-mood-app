"use client"

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Moon, Zap, Leaf, Activity, Trophy, Bell, Brain } from 'lucide-react'

function CategoryIcon({ emoji, size }: { emoji: string; size: number }) {
  const map: Record<string, React.ReactNode> = {
    '😴': <Moon     width={size} height={size} strokeWidth={1.5} />,
    '⚡': <Zap      width={size} height={size} strokeWidth={1.5} />,
    '🌿': <Leaf     width={size} height={size} strokeWidth={1.5} />,
    '🌸': <Activity width={size} height={size} strokeWidth={1.5} />,
    '🏆': <Trophy   width={size} height={size} strokeWidth={1.5} />,
    '🧠': <Brain    width={size} height={size} strokeWidth={1.5} />,
  }
  return <>{map[emoji] ?? null}</>
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
  id:             string
  current_day:    number
  completed:      boolean
  completed_at:   string | null
  fm_index_start: number | null
  fm_index_end:   number | null
  paid:           boolean
}

interface RecipeData {
  fase?:         string
  push_message?: string
  semana?:       number
  idea_clara?: {
    titulo:        string
    texto:         string
    concepto_clave?: string
  }
  cambio_del_dia?: {
    titulo:      string
    instruccion: string
    por_que:     string
    duracion:    string
  }
  psicobiotico?: {
    titulo:           string
    texto:            string
    alimento_estrella: string
  }
  audio?: {
    titulo:      string
    descripcion: string
    duracion_min: number
    tipo:        string
    archivo:     string
  }
  lectura?: {
    titulo: string
    texto:  string
  }
  registro_diario?: {
    pregunta_manana: string
    pregunta_tarde:  string
    pregunta_noche:  string
  }
  reflexion?: string
  hito?: Record<string, unknown> | null
  // sueño fields
  ingredientes?:    string[]
  pasos?:           string[]
  nutricion?:       Record<string, number>
  beneficio_sueno?: string
  tiempo_min?:      number
  momento?:         string
}

interface ChallengeDay {
  id:          string
  day_number:  number
  title:       string
  recipe_id:   string | null
  tip:         string | null
  audio_url:   string | null
  recipe_data: RecipeData | null
}

interface Props {
  challenge:    Challenge
  enrollment:   Enrollment | null
  todayContent: ChallengeDay | null  // kept for backwards compat, no longer rendered inline
}

const MILESTONES: Record<number, string> = {
  7:  'Primera semana — base mineral y primeros fermentados.',
  14: 'Segunda semana — síntesis hormonal completa. Triptófano activo.',
  21: 'Tercera semana — microbioma nocturno. El hábito empieza a ser automático.',
  28: 'Cuarta semana — sistema nervioso y cronobiología. Transformación medible.',
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

export default function RetoDetailClient({ challenge, enrollment: initialEnrollment }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [enrollment,  setEnrollment]  = useState(initialEnrollment)
  const [checkoutErr, setCheckoutErr] = useState<string | null>(null)
  const [isPending,   startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)
  const [notifState,  setNotifState]  = useState<'idle' | 'loading' | 'done' | 'denied'>('idle')

  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    if (isSuccess && enrollment?.paid) {
      router.replace(`/retos/${challenge.slug}/dia/1`)
    } else if (isSuccess) {
      setShowSuccess(true)
      const t = setTimeout(() => setShowSuccess(false), 6000)
      return () => clearTimeout(t)
    }
  }, [isSuccess]) // eslint-disable-line

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

  async function handleEnableReminder() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setNotifState('denied')
      return
    }
    setNotifState('loading')
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setNotifState('denied'); return }

      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const sub = existing ?? await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      await fetch('/api/push/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ endpoint: sub.endpoint, keys: (sub.toJSON() as any).keys }),
      })
      setNotifState('done')
    } catch {
      setNotifState('denied')
    }
  }

  // ── Modo dashboard (ya pagado, en curso) ────────────────────────────────────
  if (enrollment?.paid && !enrollment.completed) {
    const currentDay  = enrollment.current_day as number
    const weekNum     = Math.ceil(currentDay / 7)
    const totalWeeks  = Math.ceil(challenge.duration_days / 7)
    const progressPct = Math.min(100, ((currentDay - 1) / challenge.duration_days) * 100)

    return (
      <main className="min-h-screen" style={{ background: '#F5F0E8' }}>
        {/* Nav */}
        <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
          <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: challenge.color }}>
            ← Ver todos los retos
          </Link>
        </div>

        <div className="max-w-[480px] mx-auto px-5 pb-16 pt-8 space-y-4">

          {/* Encabezado del reto */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${challenge.color}18` }}
            >
              <CategoryIcon emoji={challenge.emoji} size={28} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest mb-0.5" style={{ color: 'rgba(107,39,55,0.45)' }}>
                En curso
              </p>
              <h1 className="font-serif text-[18px] font-bold leading-tight" style={{ color: '#2d0f16' }}>
                {challenge.title}
              </h1>
            </div>
          </div>

          {/* Progreso */}
          <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'rgba(107,39,55,0.45)' }}>
                Progreso
              </p>
              <span className="text-[13px] font-bold" style={{ color: challenge.color }}>
                Semana {weekNum} de {totalWeeks}
              </span>
            </div>

            {/* Barra */}
            <div className="w-full h-2 rounded-full mb-1.5" style={{ background: 'rgba(107,39,55,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(3, progressPct)}%`, background: challenge.color }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Día 1</span>
              <span className="text-[13px] font-bold" style={{ color: '#2d0f16' }}>
                Día {currentDay} <span style={{ color: 'rgba(107,39,55,0.35)', fontWeight: 400 }}>/ {challenge.duration_days}</span>
              </span>
              <span className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Día {challenge.duration_days}</span>
            </div>

            {/* Grid de semanas */}
            <div className="mt-4 space-y-2">
              {Array.from({ length: totalWeeks }, (_, w) => (
                <div key={w} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-light w-5 shrink-0 text-right" style={{ color: 'rgba(107,39,55,0.35)' }}>
                    S{w + 1}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }, (_, d) => {
                      const dayN = w * 7 + d + 1
                      if (dayN > challenge.duration_days) return <span key={d} className="w-5 h-5" />
                      const isDone    = dayN < currentDay
                      const isCurrent = dayN === currentDay
                      return (
                        <Link
                          key={d}
                          href={isDone || isCurrent ? `/retos/${challenge.slug}/dia/${dayN}` : '#'}
                          className="w-5 h-5 rounded-full flex items-center justify-center no-underline transition-transform hover:scale-110"
                          style={{
                            background:  isDone    ? challenge.color
                                       : isCurrent ? 'white'
                                       : 'rgba(107,39,55,0.08)',
                            border:      isCurrent ? `2px solid ${challenge.color}` : 'none',
                            cursor:      isDone || isCurrent ? 'pointer' : 'default',
                          }}
                          onClick={e => { if (!isDone && !isCurrent) e.preventDefault() }}
                        >
                          {isCurrent && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: challenge.color }}
                            />
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Índice Food·Mood (si existe) */}
          {enrollment.fm_index_start != null && (
            <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>
                Índice Food·Mood
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Inicio</p>
                  <p className="font-serif text-2xl font-black" style={{ color: 'rgba(107,39,55,0.35)' }}>
                    {enrollment.fm_index_start}
                  </p>
                </div>
                <div className="flex-1 h-px" style={{ background: 'rgba(107,39,55,0.1)' }} />
                <div className="text-right">
                  <p className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Evolución</p>
                  <p className="text-[13px] font-medium" style={{ color: 'rgba(107,39,55,0.55)' }}>
                    Al completar
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA principal */}
          <Link
            href={`/retos/${challenge.slug}/dia/${currentDay}`}
            className="block w-full py-4 rounded-2xl text-[16px] font-bold text-center no-underline transition-opacity hover:opacity-90"
            style={{ background: challenge.color, color: 'white' }}
          >
            {challenge.emoji} Ir al Día {currentDay} →
          </Link>

          {/* Recordatorio diario */}
          {notifState !== 'done' && (
            <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#2d0f16' }}>Recordatorio diario</p>
                <p className="text-xs font-light mt-0.5" style={{ color: 'rgba(107,39,55,0.55)' }}>
                  {notifState === 'denied'
                    ? 'Activa los permisos de notificación en tu navegador.'
                    : 'Recibe el recordatorio a las 19:30h.'}
                </p>
              </div>
              <button
                onClick={handleEnableReminder}
                disabled={notifState === 'loading' || notifState === 'denied'}
                className="px-4 py-2.5 rounded-full text-sm font-bold text-white shrink-0 disabled:opacity-50"
                style={{ background: challenge.color }}
              >
                {notifState === 'loading' ? '…' : notifState === 'denied' ? 'Sin permisos' : 'Activar'}
              </button>
            </div>
          )}
          {notifState === 'done' && (
            <p className="text-center text-xs font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
              Recordatorio activado — te avisamos cada día a las 19:30h.
            </p>
          )}

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>

      {/* ── Success banner ── */}
      {showSuccess && (
        <div className="fixed top-20 left-0 right-0 z-50 mx-auto max-w-lg px-4">
          <div
            className="rounded-2xl px-6 py-4 text-center shadow-lg text-white font-semibold"
            style={{ backgroundColor: challenge.color }}
          >
            ¡Pago confirmado! Tu reto ha comenzado. Día 1 te espera.
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section
        className="px-6 pt-32 pb-16 text-center"
        style={{ background: `linear-gradient(160deg, rgba(${rgb},0.12) 0%, transparent 60%)` }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center justify-center rounded-3xl mx-auto mb-4"
            style={{ width: 80, height: 80, backgroundColor: `${challenge.color}18` }}
          >
            <CategoryIcon emoji={challenge.emoji} size={44} />
          </div>
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
              {challenge.duration_days} días
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
          <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: challenge.color }}>
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
              '💬 Canal privado de Telegram + comunidad WhatsApp Premium',
              '📊 Seguimiento diario con tu índice Food·Mood',
              '📋 Informe final personalizado al completar',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs text-white"
                  style={{ backgroundColor: challenge.color }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Cómo funciona ── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.5)' }}>
            Cómo funciona
          </p>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 rounded-full"
              style={{ backgroundColor: `rgba(${rgb},0.25)` }} />
            {Object.entries(milestones).map(([day, label]) => (
              <div key={day} className="relative mb-6 last:mb-0">
                <div className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: challenge.color }} />
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: challenge.color }}>
                  Día {day}
                </p>
                <p className="text-sm font-light" style={{ color: '#2d0f16' }}>{label}</p>
              </div>
            ))}
            <div className="relative mb-0">
              <div className="absolute -left-4 top-1 w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: '#C9A84C' }} />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#C9A84C' }}>
                Al completar
              </p>
              <p className="text-sm font-light" style={{ color: '#2d0f16' }}>
                Informe personalizado: índice inicio vs. fin, síntomas mejorados, siguiente reto recomendado.
              </p>
            </div>
          </div>
        </section>


        {/* ── Completado ── */}
        {enrollment?.completed && (
          <section
            className="rounded-2xl p-8 text-center border"
            style={{ backgroundColor: `rgba(${rgb},0.06)`, borderColor: `rgba(${rgb},0.2)` }}
          >
            <div className="flex justify-center mb-3">
              <Trophy size={36} strokeWidth={1.5} style={{ color: '#C9A84C' }} />
            </div>
            <p className="font-serif text-xl font-bold mb-1" style={{ color: '#2d0f16' }}>
              ¡Reto completado!
            </p>
            <p className="text-xs font-light mb-5" style={{ color: 'rgba(107,39,55,0.45)' }}>
              {challenge.duration_days} días · {challenge.duration_days} recetas · {challenge.duration_days / 7} semanas
            </p>
            {enrollment.fm_index_start != null && enrollment.fm_index_end != null && (
              <div
                className="rounded-xl px-5 py-4 mb-5 text-left"
                style={{ backgroundColor: 'white', border: `1px solid rgba(${rgb},0.15)` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: challenge.color }}>
                  Tu índice Food·Mood
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-2xl font-black" style={{ color: 'rgba(107,39,55,0.35)' }}>
                    {enrollment.fm_index_start}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(107,39,55,0.3)' }}>→</span>
                  <span className="font-serif text-2xl font-black" style={{ color: challenge.color }}>
                    {enrollment.fm_index_end}
                  </span>
                  {enrollment.fm_index_end > enrollment.fm_index_start && (
                    <span className="ml-auto text-xs font-semibold" style={{ color: '#4A7C59' }}>
                      ↑ {enrollment.fm_index_end - enrollment.fm_index_start} puntos
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link
                href="/retos"
                className="block py-3 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: challenge.color }}
              >
                Ver más retos →
              </Link>
              <button
                onClick={() => {
                  const text = `Acabo de completar el reto "${challenge.title}" en 28 días con Food·Mood. El eje intestino-cerebro es real. 🏆`
                  if (navigator.share) {
                    navigator.share({ text, url: window.location.href }).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(text + ' ' + window.location.href)
                  }
                }}
                className="block w-full py-3 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80"
                style={{ borderColor: challenge.color, color: challenge.color }}
              >
                Compartir mi logro →
              </button>
            </div>
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
