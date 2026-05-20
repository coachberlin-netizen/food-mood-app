"use client"

import { useState, useTransition, useEffect, useRef } from 'react'
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
  // Optional DB fields — populated when set in Supabase
  incluye?:         string[] | null
  hitos_landing?:   Record<string, unknown>[] | null
  al_completar?:    string | { titulo?: string; subtitulo?: string; cta?: string; cta_slug?: string } | null
  stripe_price_id?: string | null
  audiencia?:       string | null
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
  challenge:       Challenge
  enrollment:      Enrollment | null
  todayContent:    ChallengeDay | null  // kept for backwards compat, no longer rendered inline
  isAuthenticated: boolean
  isPremium:       boolean
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


// FAQ extra por reto — se añaden después de las 3 primeras preguntas base
const FAQS_BY_SLUG: Record<string, Array<{ q: string; a: string | React.ReactNode }>> = {
  'reset-antiinflamatorio': [
    {
      q: '¿Es compatible con mi medicación?',
      a: 'El reto se basa en alimentos naturales, no en suplementos ni dosis terapéuticas. Dicho esto, si tomas medicación anticoagulante (como warfarina) o inmunosupresores, consulta a tu médico antes de aumentar el consumo de cúrcuma y omega-3, ya que pueden interactuar a dosis altas.',
    },
    {
      q: '¿Necesito comprar suplementos o proteínas en polvo?',
      a: 'No. Todo el protocolo se basa en alimentos reales que encuentras en cualquier supermercado. La cúrcuma, el jengibre, el omega-3 del pescado azul y los fermentados son la base — sin pastillas, sin polvos, sin gasto extra.',
    },
  ],
  'mejora-tu-sueno': [
    {
      q: '¿Funciona si tengo insomnio crónico diagnosticado?',
      a: 'El reto actúa sobre la vía serotonina-melatonina a través de la alimentación. Muchas personas con insomnio crónico notan mejoras reales, pero no sustituye a un tratamiento médico si lo tienes. Funciona mejor como complemento.',
    },
    {
      q: '¿Puedo tomar melatonina a la vez?',
      a: 'Sí, son compatibles. El reto trabaja la síntesis endógena de melatonina — que es más sostenible a largo plazo — mientras que el suplemento cubre el corto plazo. Muchos participantes reducen la dosis de melatonina al terminar el reto.',
    },
  ],
  'equilibrio-hormonal-45': [
    {
      q: '¿Es para perimenopausia o también para SOP y tiroides?',
      a: 'Para todos. El programa trabaja el estrobioma, los fitoestrógenos y la inflamación de bajo grado — mecanismos relevantes en la perimenopausia, el SOP y el hipotiroidismo subclínico. Está diseñado como apoyo nutricional, no como tratamiento. Si tienes diagnóstico específico, consúltalo con tu equipo médico.',
    },
    {
      q: '¿Necesito hacerme análisis antes de empezar?',
      a: 'No es obligatorio, pero sí recomendable si no tienes analíticas recientes (últimos 6 meses). Saber tus niveles de vitamina D, ferritina y TSH te permite medir el impacto real del protocolo al terminar.',
    },
  ],
  'recupera-tu-energia': [
    {
      q: '¿Funciona sin dejar el café?',
      a: 'Sí. No pedimos que elimines la cafeína — pedimos que cambies el contexto: cuándo, con qué y por qué la tomas. El reto trabaja la función mitocondrial y el transporte de hierro, que son las causas más frecuentes de fatiga real.',
    },
  ],
}

const FAQS_BASE = [
  {
    q: '¿Qué recibo exactamente al comprar el reto?',
    a: 'Acceso inmediato a todas las recetas funcionales, audios de apoyo, seguimiento diario con tu índice Food·Mood e informe personalizado al finalizar. Todo accesible desde esta misma página, día a día.',
  },
  {
    q: '¿Necesito ingredientes especiales o difíciles de encontrar?',
    a: 'No. Los ingredientes están pensados para comprarse en cualquier supermercado. Cuando algún alimento es más específico (como ciertos fermentados o adaptógenos), siempre incluimos una alternativa accesible.',
  },
  {
    q: '¿Puedo hacerlo si trabajo en turnos o tengo un horario irregular?',
    a: 'Sí. Las recetas están diseñadas para 20-30 minutos de preparación y no dependen de un horario fijo. Puedes preparar los platos cuando mejor te venga — el reto no caduca ni tiene notificaciones obligatorias.',
  },
  {
    q: '¿Necesito tener una dieta especial o ser vegano?',
    a: 'No. Las recetas son flexibles — incluyen opciones para distintas preferencias. El objetivo es añadir alimentos funcionales, no eliminar nada.',
  },
  {
    q: '¿Cuánto tiempo al día requiere?',
    a: 'Entre 20 y 30 minutos. Cada día recibes una receta, un audio breve y un registro emocional de dos preguntas. Sin rituales complejos ni listas interminables.',
  },
  {
    q: '¿Puedo empezar cuando quiera?',
    a: 'Sí. El acceso es inmediato tras el pago y el reto empieza el día que tú decidas. No hay fechas fijas ni cohortes.',
  },
  {
    q: '¿Tengo dudas o necesito ayuda?',
    a: <>Puedes escribirnos en cualquier momento a <a href="mailto:info@food-mood.app" style={{ color: 'inherit', textDecoration: 'underline' }}>info@food-mood.app</a> o consultar los <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'underline' }}>planes de suscripción</Link> si buscas acceso continuo a todas las recetas.</>,
  },
]

function FAQSection({ accentColor, slug }: { accentColor: string; slug: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const extra = FAQS_BY_SLUG[slug] ?? []
  // Insert slug-specific questions after the first 3 base questions
  const faqs = [...FAQS_BASE.slice(0, 3), ...extra, ...FAQS_BASE.slice(3)]
  return (
    <section>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.5)' }}>
        Preguntas frecuentes
      </p>
      <div className="divide-y" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left py-4 flex items-center justify-between gap-4"
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span className="text-sm font-medium" style={{ color: '#2d0f16' }}>{faq.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform"
                style={{ backgroundColor: accentColor, transform: open === i ? 'rotate(45deg)' : 'none' }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div id={`faq-answer-${i}`} className="pb-4 text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.65)' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// Warm amber-orange: high contrast on both dark (#2d0f16) and cream backgrounds,
// signals immediate action without blending into the reto's own accent color.
const CTA_BUY = '#E8703A'

function hexToRgb(hex: string | null | undefined) {
  const h = (hex && hex.startsWith('#') && hex.length >= 7) ? hex : '#6B2737'
  const r = parseInt(h.slice(1, 3), 16)
  const g = parseInt(h.slice(3, 5), 16)
  const b = parseInt(h.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function RetoDetailClient({ challenge, enrollment: initialEnrollment, isAuthenticated, isPremium }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [enrollment,  setEnrollment]  = useState(initialEnrollment)
  const [checkoutErr,    setCheckoutErr]    = useState<string | null>(null)
  const [isPending,      startTransition]   = useTransition()
  const [showSuccess,   setShowSuccess]   = useState(false)
  const [notifState,    setNotifState]    = useState<'idle' | 'loading' | 'done' | 'denied'>('idle')
  const [showStickyCta, setShowStickyCta] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [betaCode,     setBetaCode]     = useState('')
  const [betaState,    setBetaState]    = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [betaError,    setBetaError]    = useState<string | null>(null)
  const [showBetaBox,  setShowBetaBox]  = useState(false)

  const [restartState, setRestartState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [restartError,  setRestartError]  = useState<string | null>(null)

  const isSuccess = searchParams.get('success') === 'true'
  const [pollingPaid, setPollingPaid] = useState(false)

  // When Stripe redirects back with ?success=true, the webhook may not have
  // fired yet. Poll /api/retos/status every 2s until paid=true (max ~30s).
  useEffect(() => {
    if (!isSuccess) return

    if (enrollment?.paid) {
      router.replace(`/retos/${challenge.slug}/dia/1`)
      return
    }

    setPollingPaid(true)
    let attempts = 0
    const maxAttempts = 15

    const poll = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(`/api/retos/status?challenge_id=${challenge.id}`)
        const data = await res.json()
        if (data.paid) {
          clearInterval(poll)
          router.replace(`/retos/${challenge.slug}/dia/${data.current_day ?? 1}`)
          return
        }
      } catch { /* keep polling */ }

      if (attempts >= maxAttempts) {
        clearInterval(poll)
        setPollingPaid(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 8000)
      }
    }, 2000)

    return () => clearInterval(poll)
  }, [isSuccess]) // eslint-disable-line

  // Field defaults — guard against incomplete DB rows
  const color      = challenge.color        || '#6B2737'
  const emoji      = challenge.emoji        || '🌿'
  const priceEur   = challenge.price_eur    ?? 19
  const durationD  = challenge.duration_days ?? 7
  const recipeCount = challenge.recipe_count ?? 0
  const audioCount  = challenge.audio_count  ?? 0

  const rgb = hexToRgb(color)
  const pct = enrollment
    ? Math.min(100, ((enrollment.current_day - 1) / durationD) * 100)
    : 0

  const milestones = durationD <= 7 ? SHORT_MILESTONES : MILESTONES

  // Show sticky CTA after user scrolls past the 50% sentinel
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/retos/${challenge.slug}`)
      return
    }

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

  async function handleRestart() {
    setRestartState('loading')
    setRestartError(null)
    try {
      const res = await fetch('/api/retos/restart', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ challenge_id: challenge.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRestartState('error')
        setRestartError(data.error ?? 'Error al reiniciar')
        return
      }
      window.location.href = `/retos/${challenge.slug}/dia/1`
    } catch {
      setRestartState('error')
      setRestartError('Error de conexión')
    }
  }

  // Auto-apply beta_code param after login redirect
  useEffect(() => {
    const paramCode = searchParams.get('beta_code')
    if (paramCode && isAuthenticated && !enrollment?.paid) {
      redeemBetaCode(paramCode)
    }
  }, []) // eslint-disable-line

  async function redeemBetaCode(code: string) {
    if (!code.trim()) return

    if (!isAuthenticated) {
      // Save to sessionStorage and redirect to login; code will be auto-applied after
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fm_beta_code', code.trim())
      }
      router.push(`/auth/login?redirect=${encodeURIComponent(`/retos/${challenge.slug}?beta_code=${encodeURIComponent(code.trim())}`)}`)
      return
    }

    setBetaState('loading')
    setBetaError(null)

    try {
      const redeemRes = await fetch('/api/beta/redeem', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: code.trim() }),
      })
      const redeemData = await redeemRes.json()

      if (!redeemRes.ok) {
        setBetaState('error')
        setBetaError(redeemData.error ?? 'Código incorrecto.')
        return
      }

      // Code valid — now call checkout to get free enrollment
      setBetaState('success')
      startTransition(async () => {
        try {
          const checkRes = await fetch('/api/retos/checkout', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ challenge_id: challenge.id }),
          })
          const checkData = await checkRes.json()
          if (checkData.url) {
            window.location.href = checkData.url
          } else {
            router.refresh()
          }
        } catch {
          router.refresh()
        }
      })
    } catch {
      setBetaState('error')
      setBetaError('Error de conexión. Inténtalo de nuevo.')
    }
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

  // ── Modo completado ─────────────────────────────────────────────────────────
  if (enrollment?.paid && enrollment.completed) {
    return (
      <main className="min-h-screen" style={{ background: '#F5F0E8' }}>
        <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
          <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: color }}>
            ← Ver todos los retos
          </Link>
        </div>

        <div className="max-w-[480px] mx-auto px-5 pb-16 pt-8 space-y-4">

          {/* Encabezado */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18` }}
            >
              <CategoryIcon emoji={emoji} size={28} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest mb-0.5" style={{ color: 'rgba(107,39,55,0.45)' }}>
                Completado
              </p>
              <h1 className="font-serif text-[18px] font-bold leading-tight" style={{ color: '#2d0f16' }}>
                {challenge.title}
              </h1>
            </div>
          </div>

          {/* Trofeo */}
          <div
            className="rounded-2xl p-6 text-center border"
            style={{ backgroundColor: `rgba(${rgb},0.06)`, borderColor: `rgba(${rgb},0.2)` }}
          >
            <div className="flex justify-center mb-3">
              <Trophy size={40} strokeWidth={1.5} style={{ color: '#C9A84C' }} />
            </div>
            <p className="font-serif text-xl font-bold mb-1" style={{ color: '#2d0f16' }}>
              ¡Reto completado!
            </p>
            <p className="text-xs font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>
              {durationD} días · {durationD} recetas
            </p>
          </div>

          {/* Índice Food·Mood */}
          {enrollment.fm_index_start != null && enrollment.fm_index_end != null && (
            <div className="bg-white rounded-2xl border border-[#e8ddd5] p-5">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: 'rgba(107,39,55,0.45)' }}>
                Tus logros Food·Mood
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
                  <p className="text-[10px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Fin</p>
                  <p className="font-serif text-2xl font-black" style={{ color: color }}>
                    {enrollment.fm_index_end}
                  </p>
                </div>
                {enrollment.fm_index_end > enrollment.fm_index_start && (
                  <span className="text-xs font-semibold ml-2" style={{ color: '#4A7C59' }}>
                    ↑ +{enrollment.fm_index_end - enrollment.fm_index_start}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleRestart}
              disabled={restartState === 'loading'}
              className="w-full py-4 rounded-2xl text-[16px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: color }}
            >
              {restartState === 'loading' ? 'Reiniciando…' : `${emoji} Empezar de nuevo →`}
            </button>
            {restartState === 'error' && (
              <p className="text-xs text-center" style={{ color: '#c0392b' }}>
                {restartError ? `Error: ${restartError}` : 'Error al reiniciar. Inténtalo de nuevo.'}
              </p>
            )}
            <Link
              href="/retos"
              className="block py-3 rounded-2xl text-sm font-bold text-center border-2 transition-all hover:opacity-80 no-underline"
              style={{ borderColor: color, color: color }}
            >
              Ver más retos →
            </Link>
            <button
              onClick={() => {
                const text = `Acabo de completar el reto "${challenge.title}" en ${durationD} días con Food·Mood 🏆`
                if (navigator.share) {
                  navigator.share({ text, url: window.location.href }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(text + ' ' + window.location.href)
                }
              }}
              className="block w-full py-3 rounded-2xl text-sm font-bold border-2 transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(107,39,55,0.2)', color: 'rgba(107,39,55,0.45)' }}
            >
              Compartir mi logro →
            </button>
          </div>

        </div>
      </main>
    )
  }

  // ── Modo dashboard (ya pagado, en curso) ────────────────────────────────────
  if (enrollment?.paid && !enrollment.completed) {
    const currentDay  = enrollment.current_day as number
    const weekNum     = Math.ceil(currentDay / 7)
    const totalWeeks  = Math.ceil(durationD / 7)
    const progressPct = Math.min(100, ((currentDay - 1) / durationD) * 100)

    return (
      <main className="min-h-screen" style={{ background: '#F5F0E8' }}>
        {/* Nav */}
        <div className="px-5 py-4 border-b border-[#e8ddd5] bg-white">
          <Link href="/retos" className="text-[13px] font-medium no-underline" style={{ color: color }}>
            ← Ver todos los retos
          </Link>
        </div>

        <div className="max-w-[480px] mx-auto px-5 pb-16 pt-8 space-y-4">

          {/* Encabezado del reto */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18` }}
            >
              <CategoryIcon emoji={emoji} size={28} />
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
              <span className="text-[13px] font-bold" style={{ color: color }}>
                Semana {weekNum} de {totalWeeks}
              </span>
            </div>

            {/* Barra */}
            <div className="w-full h-2 rounded-full mb-1.5" style={{ background: 'rgba(107,39,55,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(3, progressPct)}%`, background: color }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Día 1</span>
              <span className="text-[13px] font-bold" style={{ color: '#2d0f16' }}>
                Día {currentDay} <span style={{ color: 'rgba(107,39,55,0.35)', fontWeight: 400 }}>/ {durationD}</span>
              </span>
              <span className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.45)' }}>Día {durationD}</span>
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
                      if (dayN > durationD) return <span key={d} className="w-5 h-5" />
                      const isDone    = dayN < currentDay
                      const isCurrent = dayN === currentDay
                      return (
                        <Link
                          key={d}
                          href={isDone || isCurrent ? `/retos/${challenge.slug}/dia/${dayN}` : '#'}
                          className="w-5 h-5 rounded-full flex items-center justify-center no-underline transition-transform hover:scale-110"
                          style={{
                            background:  isDone    ? color
                                       : isCurrent ? 'white'
                                       : 'rgba(107,39,55,0.08)',
                            border:      isCurrent ? `2px solid ${color}` : 'none',
                            cursor:      isDone || isCurrent ? 'pointer' : 'default',
                          }}
                          onClick={e => { if (!isDone && !isCurrent) e.preventDefault() }}
                        >
                          {isCurrent && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: color }}
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
            style={{ background: color, color: 'white' }}
          >
            {emoji} Ir al Día {currentDay} →
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
                style={{ background: color }}
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

  // Polling state: show a waiting screen while Stripe webhook is in-flight
  if (pollingPaid) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ backgroundColor: '#F5F0E8' }}>
        <div
          className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${color}40`, borderTopColor: color }}
        />
        <div className="text-center space-y-2">
          <p className="font-serif text-xl font-bold" style={{ color: '#2d0f16' }}>Confirmando tu pago…</p>
          <p className="text-sm font-light" style={{ color: 'rgba(107,39,55,0.55)' }}>
            Estamos procesando la confirmación de Stripe. Esto tarda solo unos segundos.
          </p>
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
            style={{ backgroundColor: color }}
          >
            ¡Pago confirmado! Tu reto ha comenzado. Día 1 te espera.
          </div>
        </div>
      )}

      {/* ── Breadcrumb visual ── */}
      <nav aria-label="Ruta de navegación" className="pt-24 pb-0 px-6 max-w-2xl mx-auto">
        <ol className="flex items-center gap-2 text-[12px] font-light flex-wrap" style={{ color: 'rgba(107,39,55,0.45)' }}>
          <li><Link href="/" style={{ color: 'rgba(107,39,55,0.45)' }} className="hover:underline">Inicio</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href="/retos" style={{ color: 'rgba(107,39,55,0.45)' }} className="hover:underline">Retos</Link></li>
          <li aria-hidden="true">›</li>
          <li style={{ color: '#2d0f16' }} aria-current="page">{challenge.title}</li>
        </ol>
      </nav>

      {/* ── Hero ── */}
      <section
        className="px-6 pt-8 pb-16 text-center"
        style={{ background: `linear-gradient(160deg, rgba(${rgb},0.12) 0%, transparent 60%)` }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center justify-center rounded-3xl mx-auto mb-4"
            style={{ width: 80, height: 80, backgroundColor: `${color}18` }}
          >
            <CategoryIcon emoji={emoji} size={44} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-black mb-3 leading-tight" style={{ color: '#2d0f16' }}>
            {challenge.title}
          </h1>
          {challenge.subtitle && (
            <p className="text-lg font-light mb-4" style={{ color: 'rgba(107,39,55,0.65)' }}>
              {challenge.subtitle}
            </p>
          )}
          <p className="text-xs font-medium mb-6" style={{ color: 'rgba(107,39,55,0.45)' }}>
            IA entrenada en neurociencia nutricional · adapta tu seguimiento a tu mezcla emocional real
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span
              className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: color }}
            >
              {durationD} días
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
          <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: color }}>
            Qué incluye
          </p>
          {challenge.description && (
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.7)' }}>
              {challenge.description}
            </p>
          )}
          <ul className="space-y-3">
            {(challenge.incluye && challenge.incluye.length > 0
              ? challenge.incluye
              : [
                  { emoji: '📘', label: 'libro', text: `${recipeCount} recetas ${durationD <= 7 ? 'de reset' : '— una por día'}` },
                  { emoji: '🎧', label: 'auriculares', text: `${audioCount} audios de apoyo` },
                  { emoji: '💬', label: 'comunidad', text: 'Canal privado de Telegram + comunidad WhatsApp Premium' },
                  { emoji: '📊', label: 'seguimiento', text: 'Seguimiento diario con tu índice Food·Mood' },
                  { emoji: '📋', label: 'informe', text: 'Informe final personalizado al completar' },
                ].map(({ emoji, label, text }) => `${emoji} ${text}`)
            ).map((item: string, i: number) => {
              const emojiLabels: Record<string, string> = { '📘': 'libro', '🎧': 'auriculares', '💬': 'comunidad', '📊': 'estadísticas', '📋': 'informe' }
              const firstChar = Array.from(item)[0] ?? ''
              const emoji = emojiLabels[firstChar] ? firstChar : ''
              const text = emoji ? item.slice(emoji.length).trim() : item
              return (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#2d0f16' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs text-white"
                    style={{ backgroundColor: color }}>✓</span>
                  {emoji && <span role="img" aria-label={emojiLabels[emoji]}>{emoji}</span>}
                  {text}
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── Más allá de los probióticos ── */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-aubergine-dark/5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: color }}>
            Más allá de los probióticos
          </p>
          <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(107,39,55,0.7)' }}>
            Trabajamos con <strong style={{ color: '#2d0f16' }}>postbióticos</strong> — los compuestos que tus bacterias producen y que regulan tu humor, tu inflamación y tu energía. Butirato, urolitinas, ácidos grasos de cadena corta. Cada receta está diseñada para maximizarlos.
          </p>
          <p className="text-[11px] font-light mt-3 italic" style={{ color: 'rgba(107,39,55,0.45)' }}>
            La micro-práctica diaria de 20 minutos que reordena tu eje intestino-cerebro.
          </p>
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
                  style={{ backgroundColor: color }} />
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: color }}>
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
                {typeof challenge.al_completar === 'string'
                  ? challenge.al_completar
                  : typeof challenge.al_completar === 'object' && challenge.al_completar !== null
                  ? (challenge.al_completar.subtitulo ?? challenge.al_completar.titulo ?? 'Informe personalizado al completar.')
                  : 'Informe personalizado: índice inicio vs. fin, síntomas mejorados, siguiente reto recomendado.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Testimonios ── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.5)' }}>
            Lo que dicen quienes lo completaron
          </p>
          <div className="space-y-4">
            {[
              { nombre: 'Laura M.', ciudad: 'Madrid', texto: 'Empecé sin esperar mucho y al final del reto dormía 7 horas seguidas por primera vez en años. Las recetas son reales, no de revista.' },
              { nombre: 'Carlos R.', ciudad: 'Barcelona', texto: 'Lo que más me sorprendió fue el índice Food·Mood — ver la evolución en números hace que te lo tomes en serio. Repetiría.' },
              { nombre: 'Ana P.', ciudad: 'Valencia', texto: 'Pensé que sería otro programa de bienestar más. No lo es. Hay ciencia detrás de cada plato y se nota.' },
            ].map((t, i) => (
              <blockquote key={i} className="bg-white rounded-2xl border p-5" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
                <p className="text-sm font-light leading-relaxed mb-3" style={{ color: 'rgba(107,39,55,0.75)' }}>
                  &ldquo;{t.texto}&rdquo;
                </p>
                <footer className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}>
                    {t.nombre[0]}
                  </span>
                  <span className="text-[11px] font-medium" style={{ color: '#2d0f16' }}>{t.nombre}</span>
                  <span className="text-[11px] font-light" style={{ color: 'rgba(107,39,55,0.4)' }}>· {t.ciudad}</span>
                </footer>
              </blockquote>
            ))}
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
              {durationD} días · {durationD} recetas · {durationD / 7} semanas
            </p>
            {enrollment.fm_index_start != null && enrollment.fm_index_end != null && (
              <div
                className="rounded-xl px-5 py-4 mb-5 text-left"
                style={{ backgroundColor: 'white', border: `1px solid rgba(${rgb},0.15)` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: color }}>
                  Tus logros Food·Mood
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-serif text-2xl font-black" style={{ color: 'rgba(107,39,55,0.35)' }}>
                    {enrollment.fm_index_start}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(107,39,55,0.3)' }}>→</span>
                  <span className="font-serif text-2xl font-black" style={{ color: color }}>
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
              <button
                onClick={handleRestart}
                disabled={restartState === 'loading'}
                className="block w-full py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: color }}
              >
                {restartState === 'loading' ? 'Reiniciando…' : 'Empezar de nuevo →'}
              </button>
              {restartState === 'error' && (
                <p className="text-xs text-center" style={{ color: '#c0392b' }}>
                  Error al reiniciar. Inténtalo de nuevo.
                </p>
              )}
              <Link
                href="/retos"
                className="block py-3 rounded-full text-sm font-bold text-center border-2 transition-all hover:opacity-80"
                style={{ borderColor: color, color: color }}
              >
                Ver más retos →
              </Link>
              <button
                onClick={() => {
                  const text = `Acabo de completar el reto "${challenge.title}" en ${durationD} días con Food·Mood. El eje intestino-cerebro es real. 🏆`
                  if (navigator.share) {
                    navigator.share({ text, url: window.location.href }).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(text + ' ' + window.location.href)
                  }
                }}
                className="block w-full py-3 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80"
                style={{ borderColor: 'rgba(107,39,55,0.2)', color: 'rgba(107,39,55,0.45)' }}
              >
                Compartir mi logro →
              </button>
            </div>
          </section>
        )}

        {/* Sentinel — sticky CTA aparece cuando este div sale de pantalla */}
        <div ref={sentinelRef} aria-hidden="true" />

        {/* ── FAQ ── */}
        {!enrollment?.paid && (
          <FAQSection accentColor={color} slug={challenge.slug} />
        )}

        {/* ── CTA de compra / acceso premium ── */}
        {!enrollment?.paid && (
          <section
            id="cta-compra"
            className="rounded-3xl p-8 md:p-10"
            style={{ backgroundColor: '#2d0f16' }}
          >
            {isPremium ? (
              /* Premium / beta user — bypass payment */
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
                  Acceso incluido
                </p>
                <p className="text-sm font-light mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Tu cuenta tiene acceso completo a todos los retos. Empieza cuando quieras — sin coste adicional.
                </p>
                {checkoutErr && (
                  <p className="text-red-400 text-sm mb-4">{checkoutErr}</p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: color }}
                >
                  {isPending ? 'Activando…' : 'Empezar mi reto gratis →'}
                </button>
              </>
            ) : (
              /* Standard purchase flow */
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
                  {enrollment ? 'Completar pago' : 'Únete ahora'}
                </p>
                <div className="mb-6">
                  <p className="font-serif text-5xl font-black" style={{ color: '#C9A84C' }}>
                    {priceEur}€
                  </p>
                  <p className="text-xs font-light mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Acceso completo · {durationD} días · Pago único
                  </p>
                </div>

                {checkoutErr && (
                  <p className="text-red-400 text-sm mb-4">{checkoutErr}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: CTA_BUY }}
                >
                  {isPending ? 'Procesando…' : enrollment ? 'Completar pago →' : 'Empezar mi reto →'}
                </button>

                <p className="text-xs font-light text-center mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Pago seguro vía Stripe · Acceso inmediato al completar
                </p>

                {/* Beta / influencer code input */}
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  {betaState === 'success' ? (
                    <p className="text-center text-sm font-medium" style={{ color: '#C9A84C' }}>
                      ✓ Código activado — redirigiendo…
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowBetaBox(v => !v)}
                        className="w-full text-center text-xs font-light transition-opacity hover:opacity-80"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        ¿Tienes un código de acceso?
                      </button>
                      {showBetaBox && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={betaCode}
                            onChange={e => setBetaCode(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && redeemBetaCode(betaCode)}
                            placeholder="Código beta o influencer"
                            disabled={betaState === 'loading'}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/10 text-white placeholder:text-white/25 border border-white/15 focus:outline-none focus:border-white/30 disabled:opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => redeemBetaCode(betaCode)}
                            disabled={betaState === 'loading' || !betaCode.trim()}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity whitespace-nowrap"
                            style={{ backgroundColor: '#C9A84C' }}
                          >
                            {betaState === 'loading' ? '…' : 'Canjear'}
                          </button>
                        </div>
                      )}
                      {betaError && (
                        <p className="text-xs mt-2 text-center" style={{ color: '#f87171' }}>{betaError}</p>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
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

      {/* ── Sticky CTA móvil — aparece tras scroll 50% ── */}
      {!enrollment?.paid && showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-3"
          style={{ background: 'linear-gradient(to top, #F5F0E8 70%, transparent)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}>
          <button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
            style={{ backgroundColor: isPremium ? color : CTA_BUY }}
          >
            {isPending
              ? (isPremium ? 'Activando…' : 'Procesando…')
              : isPremium
              ? 'Empezar mi reto gratis →'
              : `Empezar mi reto · ${priceEur}€ →`}
          </button>
        </div>
      )}

    </main>
  )
}
