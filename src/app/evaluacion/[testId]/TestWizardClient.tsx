'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { EvaluacionTest, RespuestasTest, TestPregunta } from '@/data/evaluacion-tests'
import { getSessionKey } from '@/data/evaluacion-tests'

// ── Shared styles ────────────────────────────────────────────────────────────

const cardBase = 'w-full rounded-2xl p-4 text-left transition-all border-2 cursor-pointer'
const cardIdle = 'border-transparent bg-white/5 hover:bg-white/8'
const cardSelected = 'border-[#C9A84C] bg-[#C9A84C]/10'

// ── Question renderers ───────────────────────────────────────────────────────

function SingleChoice({
  pregunta,
  value,
  onChange,
  color,
}: {
  pregunta: TestPregunta
  value: string
  onChange: (v: string) => void
  color: string
}) {
  return (
    <div className="space-y-2">
      {pregunta.opciones?.map(opt => (
        <button
          key={opt.valor}
          onClick={() => onChange(opt.valor)}
          className={`${cardBase} ${value === opt.valor ? cardSelected : cardIdle}`}
          style={value === opt.valor ? { borderColor: color + '80', background: color + '12' } : {}}
        >
          <p className="text-[#F5F0E8] font-medium text-sm">{opt.label}</p>
          {opt.desc && <p className="text-[#F5F0E8]/40 text-xs mt-0.5">{opt.desc}</p>}
        </button>
      ))}
    </div>
  )
}

function MultiChoice({
  pregunta,
  value,
  onChange,
  color,
}: {
  pregunta: TestPregunta
  value: string[]
  onChange: (v: string[]) => void
  color: string
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {pregunta.opciones?.map(opt => {
        const selected = value.includes(opt.valor)
        return (
          <button
            key={opt.valor}
            onClick={() => toggle(opt.valor)}
            className={`rounded-2xl p-3.5 text-left transition-all border-2 cursor-pointer`}
            style={{
              borderColor: selected ? color + '80' : 'transparent',
              background: selected ? color + '14' : 'rgba(255,255,255,0.05)',
            }}
          >
            {selected && (
              <CheckCircle2 className="w-3.5 h-3.5 mb-1.5" style={{ color }} />
            )}
            <p className="text-[#F5F0E8] font-medium text-sm leading-snug">{opt.label}</p>
          </button>
        )
      })}
    </div>
  )
}

function ScaleChoice({
  pregunta,
  value,
  onChange,
  color,
}: {
  pregunta: TestPregunta
  value: number
  onChange: (v: number) => void
  color: string
}) {
  const { min, max, minLabel, maxLabel } = pregunta.escala!
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i)

  return (
    <div className="space-y-4">
      <div className={`grid gap-2 ${steps.length <= 5 ? 'grid-cols-5' : 'grid-cols-5'}`}>
        {steps.map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="rounded-xl py-3.5 text-sm font-semibold transition-all border-2"
            style={
              value === n
                ? { borderColor: color, background: color + '20', color }
                : { borderColor: 'transparent', background: 'rgba(255,255,255,0.05)', color: 'rgba(245,240,232,0.5)' }
            }
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs px-1" style={{ color: 'rgba(245,240,232,0.3)' }}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

function TextInput({
  value,
  onChange,
  opcional,
}: {
  value: string
  onChange: (v: string) => void
  opcional?: boolean
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={opcional ? 'Opcional — escribe lo que quieras compartir' : 'Tu respuesta…'}
        rows={4}
        className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-[#F5F0E8] text-sm placeholder:text-[#F5F0E8]/25 focus:outline-none focus:border-[#C9A84C]/50 resize-none"
      />
    </div>
  )
}

// ── Step variants ────────────────────────────────────────────────────────────

const STEP_VARIANTS = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

// ── Main wizard ──────────────────────────────────────────────────────────────

export function TestWizardClient({ test }: { test: EvaluacionTest }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [respuestas, setRespuestas] = useState<RespuestasTest>({})
  const [done, setDone] = useState(false)
  // Skip the enter animation on first render so content is visible immediately.
  // Subsequent step changes use the full slide animation.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const pregunta = test.preguntas[step]

  const getValor = useCallback(<T,>(id: string, fallback: T): T => {
    return (respuestas[id] as T) ?? fallback
  }, [respuestas])

  const setValor = useCallback((id: string, val: string | string[] | number) => {
    setRespuestas(r => ({ ...r, [id]: val }))
  }, [])

  const canAdvance = (): boolean => {
    if (pregunta.opcional) return true
    const val = respuestas[pregunta.id]
    if (val === undefined || val === '') return false
    if (Array.isArray(val)) return val.length > 0
    if (typeof val === 'number') return val > 0
    return true
  }

  const next = () => {
    if (step < test.preguntas.length - 1) {
      setDir(1)
      setStep(s => s + 1)
    } else {
      // Save to sessionStorage
      try {
        sessionStorage.setItem(getSessionKey(test.id), JSON.stringify(respuestas))
      } catch { /* ignore */ }
      setDone(true)
    }
  }

  const back = () => {
    if (step === 0) router.push('/evaluacion')
    else { setDir(-1); setStep(s => s - 1) }
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: test.color + '20', border: `1px solid ${test.color}40` }}
        >
          <CheckCircle2 className="w-7 h-7" style={{ color: test.color }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-2xl text-[#F5F0E8] font-light mb-2"
        >
          Test completado
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#F5F0E8]/45 text-sm mb-10 max-w-xs"
        >
          Tus respuestas están guardadas. Puedes completar más tests o recibir tu valoración ahora.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 w-full max-w-xs"
        >
          <button
            onClick={() => router.push('/evaluacion/resultado')}
            className="w-full flex items-center justify-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-2xl py-4 text-sm font-semibold hover:bg-[#5a212e] transition-all"
          >
            Ver mi valoración <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/evaluacion')}
            className="w-full py-3 text-[#F5F0E8]/35 text-sm hover:text-[#F5F0E8]/60 transition-colors"
          >
            Completar otro test
          </button>
        </motion.div>
      </motion.div>
    )
  }

  // ── Wizard screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#1A0A0E] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={back}
            className="flex items-center gap-1 text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center flex-1 px-4">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: test.color }}>
              {test.titulo}
            </p>
            <p className="text-[#F5F0E8]/35 text-[10px] mt-0.5">
              {step + 1} de {test.preguntas.length}
            </p>
          </div>
          <div className="w-8" />
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: test.color }}
            animate={{ width: `${((step + 1) / test.preguntas.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 max-w-md mx-auto w-full py-2 overflow-y-auto">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={STEP_VARIANTS}
            initial={mounted ? "enter" : "center"}
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <h2 className="font-serif text-xl text-[#F5F0E8] font-light leading-snug mb-6">
              {pregunta.texto}
              {pregunta.opcional && (
                <span className="text-[#F5F0E8]/30 text-sm font-sans"> (opcional)</span>
              )}
            </h2>

            {pregunta.tipo === 'single' && (
              <SingleChoice
                pregunta={pregunta}
                value={getValor<string>(pregunta.id, '')}
                onChange={v => setValor(pregunta.id, v)}
                color={test.color}
              />
            )}
            {pregunta.tipo === 'multi' && (
              <MultiChoice
                pregunta={pregunta}
                value={getValor<string[]>(pregunta.id, [])}
                onChange={v => setValor(pregunta.id, v)}
                color={test.color}
              />
            )}
            {pregunta.tipo === 'scale' && (
              <ScaleChoice
                pregunta={pregunta}
                value={getValor<number>(pregunta.id, 0)}
                onChange={v => setValor(pregunta.id, v)}
                color={test.color}
              />
            )}
            {pregunta.tipo === 'text' && (
              <TextInput
                value={getValor<string>(pregunta.id, '')}
                onChange={v => setValor(pregunta.id, v)}
                opcional={pregunta.opcional}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="px-5 pb-8 pt-4 max-w-md mx-auto w-full">
        <button
          onClick={next}
          disabled={!canAdvance()}
          className="w-full rounded-2xl py-4 text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: '#6B2737', color: '#F5F0E8' }}
        >
          {step === test.preguntas.length - 1 ? 'Finalizar test →' : 'Continuar →'}
        </button>
        {pregunta.opcional && (
          <button
            onClick={next}
            className="w-full mt-2 py-2.5 text-[#F5F0E8]/30 text-xs hover:text-[#F5F0E8]/50 transition-colors"
          >
            Omitir
          </button>
        )}
      </div>
    </div>
  )
}
