'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EVALUACION_TESTS, SESSION_KEY_PREFIX } from '@/data/evaluacion-tests'

// ── Types ────────────────────────────────────────────────────────────────────

interface Valoracion {
  titulo: string
  resumen: string
  hallazgos: string[]
  fortalezas: string[]
  areas_atencion: string[]
  recomendaciones: string[]
  siguiente_paso: string
}

type Estado = 'checking_auth' | 'login_gate' | 'loading_ai' | 'result' | 'no_tests' | 'error'

// ── Login gate ───────────────────────────────────────────────────────────────

function LoginGate() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm w-full space-y-6">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <Sparkles className="w-7 h-7 text-[#C9A84C]" />
        </div>
        <div>
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-[0.3em] uppercase mb-3">
            Un paso más
          </p>
          <h2 className="font-serif text-2xl text-[#F5F0E8] font-light leading-tight mb-3">
            Tu valoración está lista
          </h2>
          <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">
            Crea una cuenta gratuita para recibir tu informe personalizado.
            Tus respuestas ya están guardadas.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/register?redirect=/evaluacion/resultado"
            className="w-full flex items-center justify-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-2xl py-4 text-sm font-semibold hover:bg-[#5a212e] transition-all"
          >
            Crear cuenta gratis <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth/login?redirect=/evaluacion/resultado"
            className="w-full py-3 text-[#F5F0E8]/40 text-sm hover:text-[#F5F0E8]/70 transition-colors block"
          >
            Ya tengo cuenta — entrar
          </Link>
        </div>

        <div
          className="rounded-xl p-4 text-xs text-[#F5F0E8]/40 leading-relaxed border"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
        >
          <p>✦ La cuenta es <strong className="text-[#F5F0E8]/60">gratuita</strong> — sin tarjeta de crédito</p>
          <p className="mt-1">✦ Tu valoración queda guardada en tu perfil</p>
          <p className="mt-1">✦ Tus datos son privados y nunca se comparten</p>
        </div>
      </div>
    </motion.div>
  )
}

// ── Loading screen ───────────────────────────────────────────────────────────

function LoadingValoracion({ testsCount }: { testsCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C]/70 mb-6"
      />
      <h2 className="font-serif text-2xl text-[#F5F0E8] font-light mb-2">
        Analizando tus respuestas…
      </h2>
      <p className="text-[#F5F0E8]/40 text-sm max-w-xs">
        Estamos procesando {testsCount} {testsCount === 1 ? 'test' : 'tests'} para crear tu valoración personalizada
      </p>
      <div className="mt-8 space-y-2">
        {['Leyendo tu perfil nutricional', 'Identificando patrones', 'Generando recomendaciones'].map((step, i) => (
          <motion.p
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.6 }}
            className="text-[#F5F0E8]/25 text-xs"
          >
            ✦ {step}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}

// ── Result card ──────────────────────────────────────────────────────────────

function FadeSection({
  delay = 0,
  label,
  color = '#6B2737',
  children,
}: {
  delay?: number
  label: string
  color?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="rounded-3xl p-7 border"
      style={{
        borderColor: color + '30',
        background: `linear-gradient(150deg, ${color}12 0%, ${color}06 100%)`,
      }}
    >
      <p className="text-[10px] font-black tracking-[0.28em] uppercase mb-4" style={{ color }}>
        {label}
      </p>
      {children}
    </motion.div>
  )
}

// ── Main result screen ───────────────────────────────────────────────────────

function ValoracionResult({
  valoracion,
  testsCompletados,
}: {
  valoracion: Valoracion
  testsCompletados: string[]
}) {
  return (
    <div className="min-h-screen bg-[#1A0A0E] px-5 pb-16 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <Sparkles className="w-6 h-6 text-[#C9A84C]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-[#F5F0E8] font-serif text-2xl font-light mb-2"
        >
          {valoracion.titulo}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[#F5F0E8]/50 text-sm max-w-sm mx-auto leading-relaxed"
        >
          {valoracion.resumen}
        </motion.p>

        {/* Tests badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          {testsCompletados.map(id => {
            const test = EVALUACION_TESTS.find(t => t.id === id)
            if (!test) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ color: test.color, backgroundColor: test.color + '18' }}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {test.titulo}
              </span>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 rounded-2xl p-4 mb-6 border"
        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
      >
        <AlertCircle className="w-4 h-4 text-[#F5F0E8]/30 shrink-0 mt-0.5" />
        <p className="text-[#F5F0E8]/35 text-xs leading-relaxed">
          Esta valoración ha sido <strong className="text-[#F5F0E8]/50">generada por inteligencia artificial</strong> a partir de tus respuestas.
          Es orientativa y no constituye diagnóstico médico ni sustituye la consulta con un profesional de salud.
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Hallazgos */}
        <FadeSection delay={0.55} label="Lo que observamos" color="#6B2737">
          <ul className="space-y-3">
            {valoracion.hallazgos.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-[#F5F0E8]/80 text-sm leading-relaxed">
                <span className="shrink-0 font-bold text-[#6B2737]/60 mt-0.5">—</span>
                {h}
              </li>
            ))}
          </ul>
        </FadeSection>

        {/* Fortalezas */}
        <FadeSection delay={0.65} label="Tus fortalezas" color="#7FB069">
          <ul className="space-y-3">
            {valoracion.fortalezas.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[#F5F0E8]/80 text-sm leading-relaxed">
                <span className="shrink-0 text-[#7FB069] mt-0.5">✦</span>
                {f}
              </li>
            ))}
          </ul>
        </FadeSection>

        {/* Áreas de atención */}
        <FadeSection delay={0.75} label="Áreas con potencial" color="#E8621C">
          <ul className="space-y-3">
            {valoracion.areas_atencion.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-[#F5F0E8]/80 text-sm leading-relaxed">
                <span className="shrink-0 font-bold text-[#E8621C]/60 mt-0.5">—</span>
                {a}
              </li>
            ))}
          </ul>
        </FadeSection>

        {/* Recomendaciones */}
        <FadeSection delay={0.85} label="Recomendaciones" color="#C9A84C">
          <ul className="space-y-3">
            {valoracion.recomendaciones.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-[#F5F0E8]/80 text-sm leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </FadeSection>

        {/* Siguiente paso */}
        <FadeSection delay={0.95} label="Tu siguiente paso" color="#5B8FA8">
          <p className="text-[#F5F0E8]/85 text-base leading-relaxed font-light">
            {valoracion.siguiente_paso}
          </p>
        </FadeSection>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
          className="pt-4 space-y-3"
        >
          <Link
            href="/evaluacion"
            className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-2xl py-3.5 text-sm text-[#F5F0E8]/50 hover:text-[#F5F0E8]/80 hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Completar más tests
          </Link>
          <Link
            href="/eloraculo"
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all"
            style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}
          >
            Ir a mi check-in diario <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/practicas"
            className="w-full flex items-center justify-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-2xl py-4 text-sm font-semibold hover:bg-[#5a212e] transition-all"
          >
            Ver mis herramientas <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function ResultadoClient() {
  const [estado, setEstado] = useState<Estado>('checking_auth')
  const [valoracion, setValoracion] = useState<Valoracion | null>(null)
  const [testsCompletados, setTestsCompletados] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function init() {
      // 1. Check auth — wrap in try/catch so network errors fall through to login gate
      let user: { id: string } | null = null
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        user = data.user
      } catch {
        // Network/CORS error — treat as unauthenticated
        setEstado('login_gate')
        return
      }

      if (!user) {
        setEstado('login_gate')
        return
      }

      // 2. Read completed tests from sessionStorage
      const tests: Record<string, Record<string, string | string[] | number>> = {}
      for (const test of EVALUACION_TESTS) {
        const key = `${SESSION_KEY_PREFIX}${test.id}`
        const raw = sessionStorage.getItem(key)
        if (raw) {
          try {
            const data = JSON.parse(raw)
            if (data && Object.keys(data).length > 0) {
              tests[test.id] = data
            }
          } catch { /* ignore */ }
        }
      }

      const completados = Object.keys(tests)
      setTestsCompletados(completados)

      if (completados.length === 0) {
        setEstado('no_tests')
        return
      }

      // 3. Call AI
      setEstado('loading_ai')
      try {
        const res = await fetch('/api/evaluacion/valorar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tests }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          if (res.status === 429) {
            setErrorMsg(data.message ?? 'Has alcanzado el límite mensual de valoraciones.')
          } else {
            setErrorMsg('No se pudo generar la valoración. Inténtalo de nuevo.')
          }
          setEstado('error')
          return
        }

        const data = await res.json()
        setValoracion(data.resultado)
        setEstado('result')
      } catch {
        setErrorMsg('Error de conexión. Comprueba tu conexión e inténtalo de nuevo.')
        setEstado('error')
      }
    }

    init()
  }, [])

  if (estado === 'checking_auth') {
    return (
      <div className="min-h-screen bg-[#1A0A0E] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    )
  }

  if (estado === 'login_gate') return <LoginGate />

  if (estado === 'loading_ai') return <LoadingValoracion testsCount={testsCompletados.length} />

  if (estado === 'no_tests') {
    return (
      <div className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#F5F0E8]/50 text-sm mb-6">
          Completa al menos un test para recibir tu valoración.
        </p>
        <Link
          href="/evaluacion"
          className="inline-flex items-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-2xl px-6 py-3 text-sm font-semibold hover:bg-[#5a212e] transition-all"
        >
          Ir a los tests <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  if (estado === 'error') {
    return (
      <div className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="w-10 h-10 text-[#F5F0E8]/30 mb-4" />
        <p className="text-[#F5F0E8]/60 text-sm mb-6 max-w-xs">{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 border border-white/15 text-[#F5F0E8]/60 rounded-2xl px-6 py-3 text-sm hover:bg-white/5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Intentar de nuevo
        </button>
      </div>
    )
  }

  if (estado === 'result' && valoracion) {
    return <ValoracionResult valoracion={valoracion} testsCompletados={testsCompletados} />
  }

  return null
}
