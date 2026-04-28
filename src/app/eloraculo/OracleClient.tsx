'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { moods } from '@/data/moods'
import { SYMPTOMS } from '@/data/symptoms'
import { createClient } from '@/lib/supabase/client'
import { calculatePalette } from '@/lib/emotional-palette'

// ── Types ────────────────────────────────────────────────────────────

interface OracleData {
  primaryEmotion: string | null
  energyLevel: number
  sleepQuality: number
  primarySymptom: string | null
  cravingState: string | null
  cyclePhase: string | null
  notes: string
}

type Screen = 'hero' | 'wizard' | 'result'

// ── Static data ──────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: 'Abrimos tu mapa emocional',   question: '¿Qué hay más presente en ti ahora mismo?' },
  { n: 2, label: 'Leemos tu energía',            question: '¿Cómo está tu energía hoy?' },
  { n: 3, label: 'Escuchamos tu descanso',       question: '¿Cómo has descansado esta noche?' },
  { n: 4, label: 'Observamos tu cuerpo',         question: '¿Hay algo que notes en tu cuerpo hoy?' },
  { n: 5, label: 'Detectamos lo que necesitas',  question: '¿Qué te está pidiendo el cuerpo?' },
  { n: 6, label: 'Afinamos tu lectura',          question: 'Añade contexto si quieres (opcional)' },
]

const SLEEP_OPTIONS = [
  { value: 1, label: 'Muy mal',  desc: 'Apenas dormí' },
  { value: 2, label: 'Mal',      desc: 'Poco y entrecortado' },
  { value: 3, label: 'Regular',  desc: 'Podría ser mejor' },
  { value: 4, label: 'Bien',     desc: 'Bastante reparador' },
  { value: 5, label: 'Muy bien', desc: 'Profundo y completo' },
]

const CRAVINGS = [
  { id: 'dulce',       label: 'Dulce',               icon: '🍫' },
  { id: 'salado',      label: 'Salado',               icon: '🧂' },
  { id: 'proteina',    label: 'Proteína',             icon: '🥩' },
  { id: 'calor',       label: 'Calor y confort',      icon: '🍲' },
  { id: 'fresco',      label: 'Algo fresco',          icon: '🥗' },
  { id: 'fermento',    label: 'Ácido o fermentado',   icon: '🫙' },
  { id: 'estimulante', label: 'Café o estimulante',   icon: '☕' },
  { id: 'nada',        label: 'Nada en concreto',     icon: '✨' },
]

const CYCLE_OPTIONS = [
  { id: 'folicular', label: 'Fase folicular', desc: 'Días 1–13' },
  { id: 'ovulacion', label: 'Ovulación',      desc: 'Días 14–16' },
  { id: 'lutea',     label: 'Fase lútea',     desc: 'Días 17–28' },
  { id: 'skip',      label: 'No indicar',     desc: '' },
]

// Mapping primaryEmotion → approximate 4-slider values for emotional_palettes compatibility
const EMOTION_TO_SLIDERS: Record<string, { energia: number; serenidad: number; claridad: number; conexion: number }> = {
  activacion: { energia: 8, serenidad: 3, claridad: 6, conexion: 5 },
  calma:      { energia: 3, serenidad: 8, claridad: 5, conexion: 6 },
  focus:      { energia: 6, serenidad: 6, claridad: 9, conexion: 4 },
  social:     { energia: 7, serenidad: 5, claridad: 5, conexion: 9 },
  reset:      { energia: 2, serenidad: 6, claridad: 3, conexion: 3 },
  confort:    { energia: 4, serenidad: 7, claridad: 4, conexion: 6 },
}

// ── Oracle reading generator ─────────────────────────────────────────

function generateReading(data: OracleData): string {
  const mood = moods.find(m => m.id === data.primaryEmotion)
  const symptom = data.primarySymptom ? SYMPTOMS.find(s => s.slug === data.primarySymptom) : null
  if (!mood) return ''

  const lines: string[] = []
  lines.push(`Tu estado apunta a ${mood.descripcion_corta.toLowerCase()}.`)

  if (data.energyLevel <= 3) {
    lines.push('Tu energía parece pedir pausa — nutrición profunda, no impulso.')
  } else if (data.energyLevel >= 8) {
    lines.push('Tu vitalidad está en un momento alto — un estado propicio para actuar y construir.')
  }

  if (data.sleepQuality <= 2) {
    lines.push('El descanso de anoche ha sido escaso — apoyar la recuperación hoy podría marcar la diferencia.')
  } else if (data.sleepQuality >= 4) {
    lines.push('Un descanso reparador. Tu sistema nervioso llega bien a este día.')
  }

  if (symptom) {
    lines.push(`Tu cuerpo también señala ${symptom.titulo.toLowerCase()} — ${symptom.subtitulo.toLowerCase()}.`)
  }

  return lines.join(' ')
}

// ── Shared card style ────────────────────────────────────────────────

const cardBase = 'w-full rounded-2xl p-4 text-left transition-all border-2 cursor-pointer'
const cardIdle = 'border-transparent bg-white/5 hover:bg-white/8'
const cardSelected = 'border-[#C9A84C] bg-[#C9A84C]/10'

// ── Step components ──────────────────────────────────────────────────

function StepEmocion({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {moods.map(m => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`${cardBase} ${value === m.id ? cardSelected : cardIdle}`}
        >
          <div className="w-3 h-3 rounded-full mb-2 mt-0.5" style={{ background: m.color }} />
          <p className="text-[#F5F0E8] font-medium text-sm">{m.nombre}</p>
          <p className="text-[#F5F0E8]/40 text-xs mt-0.5 leading-snug line-clamp-2">
            {m.descripcion_corta.split('.')[0]}
          </p>
        </button>
      ))}
    </div>
  )
}

function StepEnergia({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`rounded-xl py-3 text-sm font-medium transition-all border-2 ${
              value === n
                ? 'border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]'
                : 'border-transparent bg-white/5 text-[#F5F0E8]/60 hover:bg-white/10'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[#F5F0E8]/30 px-1">
        <span>Sin energía</span>
        <span>Llena de vitalidad</span>
      </div>
    </div>
  )
}

function StepSueno({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      {SLEEP_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`${cardBase} flex items-center gap-4 ${value === opt.value ? cardSelected : cardIdle}`}
        >
          <div className="flex gap-1 shrink-0">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: i <= opt.value ? '#C9A84C' : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>
          <div>
            <p className="text-[#F5F0E8] font-medium text-sm">{opt.label}</p>
            <p className="text-[#F5F0E8]/40 text-xs">{opt.desc}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

function StepSintoma({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onChange(null)}
        className={`${cardBase} ${value === null ? cardSelected : cardIdle}`}
      >
        <p className="text-[#F5F0E8] font-medium text-sm">✨ Sin síntomas hoy</p>
      </button>
      {SYMPTOMS.map(s => (
        <button
          key={s.slug}
          onClick={() => onChange(s.slug)}
          className={`${cardBase} ${value === s.slug ? cardSelected : cardIdle}`}
        >
          <p className="text-[#F5F0E8] font-medium text-sm">{s.titulo}</p>
          <p className="text-[#F5F0E8]/40 text-xs mt-0.5">{s.subtitulo}</p>
        </button>
      ))}
    </div>
  )
}

function StepCraving({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CRAVINGS.map(c => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`${cardBase} ${value === c.id ? cardSelected : cardIdle}`}
        >
          <span className="text-xl mb-2 block">{c.icon}</span>
          <p className="text-[#F5F0E8] text-sm font-medium leading-snug">{c.label}</p>
        </button>
      ))}
    </div>
  )
}

function StepNota({
  notes, onNotes, cyclePhase, onCycle,
}: {
  notes: string; onNotes: (v: string) => void
  cyclePhase: string | null; onCycle: (v: string | null) => void
}) {
  return (
    <div className="space-y-6">
      <textarea
        value={notes}
        onChange={e => onNotes(e.target.value)}
        placeholder="¿Algo más que quieras registrar hoy? (opcional)"
        rows={4}
        className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-[#F5F0E8] text-sm placeholder:text-[#F5F0E8]/25 focus:outline-none focus:border-[#C9A84C]/50 resize-none"
      />
      <div>
        <p className="text-[#F5F0E8]/40 text-xs uppercase tracking-widest mb-3">Fase del ciclo (opcional)</p>
        <div className="grid grid-cols-2 gap-2">
          {CYCLE_OPTIONS.map(c => (
            <button
              key={c.id}
              onClick={() => onCycle(cyclePhase === c.id ? null : c.id)}
              className={`rounded-xl p-3 text-left transition-all border ${
                cyclePhase === c.id
                  ? 'border-[#C9A84C]/60 bg-[#C9A84C]/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <p className="text-[#F5F0E8] text-xs font-medium">{c.label}</p>
              {c.desc && <p className="text-[#F5F0E8]/35 text-[10px]">{c.desc}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Result screen ────────────────────────────────────────────────────

function OracleResult({
  data, isPremium, onReset,
}: {
  data: OracleData; isPremium: boolean; onReset: () => void
}) {
  const [recipe, setRecipe] = useState<{ id: string; nombre_es: string; tiempo_preparacion_min: number; tipo_plato: string } | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const mood = moods.find(m => m.id === data.primaryEmotion)
  const symptom = data.primarySymptom ? SYMPTOMS.find(s => s.slug === data.primarySymptom) : null
  const reading = generateReading(data)
  const nutritionFocus = symptom?.nutritionFocus ?? (mood?.ingredientes.slice(0, 4) ?? [])
  const ritual = mood?.ritualSugerido

  useEffect(() => {
    if (!mood) return
    const supabase = createClient()
    supabase
      .from('recetas')
      .select('id, nombre_es, tiempo_preparacion_min, tipo_plato')
      .eq('mood_es', mood.nombre)
      .limit(1)
      .maybeSingle()
      .then(({ data: r }) => { if (r) setRecipe(r) })
  }, [mood])

  const handleSave = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login?redirect=/eloraculo'
      return
    }
    setSaving(true)
    try {
      await supabase.from('oracle_checkins').insert({
        user_id:         user.id,
        primary_emotion: data.primaryEmotion,
        energy_level:    data.energyLevel,
        sleep_quality:   data.sleepQuality,
        primary_symptom: data.primarySymptom,
        craving_state:   data.cravingState,
        cycle_phase:     data.cyclePhase,
        notes:           data.notes || null,
        oracle_reading:  reading,
        suggested_action: nutritionFocus.length ? { focus: nutritionFocus, ritual } : null,
      })

      // Also save to emotional_palettes for dashboard PaletteWidget compatibility
      if (data.primaryEmotion && EMOTION_TO_SLIDERS[data.primaryEmotion]) {
        const sliders = EMOTION_TO_SLIDERS[data.primaryEmotion]
        const palette = calculatePalette(sliders)
        await supabase.from('emotional_palettes').insert({
          user_id:          user.id,
          ...sliders,
          mood_dominante:   palette.moodDominante,
          mood_secundario:  palette.moodSecundario,
          color_resultado:  palette.colorMezclado,
          recetas_sugeridas: recipe ? [recipe.id] : [],
        })
      }

      setSaved(true)
    } finally {
      setSaving(false)
    }
  }, [data, reading, nutritionFocus, ritual, recipe])

  if (!mood) return null

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#1A0A0E] px-5 py-12 max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C9A84C]/20">
          <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" />
        </div>
        <div>
          <p className="text-[#C9A84C] text-xs font-medium tracking-widest uppercase">Lectura completada</p>
          <p className="text-[#F5F0E8]/40 text-[10px]">Cada registro afina tu mapa bioemocional</p>
        </div>
      </div>

      {/* Mood chip */}
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
        style={{ background: mood.color + '20', border: `1px solid ${mood.color}40` }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: mood.color }} />
        <span className="text-sm font-medium" style={{ color: mood.color }}>{mood.nombre}</span>
        <span className="text-[#F5F0E8]/40 text-xs">· Emoción principal de hoy</span>
      </div>

      {/* Oracle reading */}
      <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/8">
        <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Lo que estamos observando</p>
        <p className="text-[#F5F0E8]/85 text-sm leading-relaxed">{reading}</p>
      </div>

      {/* Nutrition focus */}
      {nutritionFocus.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/8">
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Lo que podría ayudarte hoy</p>
          <ul className="space-y-2">
            {nutritionFocus.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F5F0E8]/75">
                <span className="text-[#C9A84C] shrink-0 mt-0.5">—</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ritual */}
      {ritual && (
        <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/8">
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-2">Tu siguiente pequeño paso</p>
          <p className="text-[#F5F0E8]/75 text-sm">{ritual}</p>
        </div>
      )}

      {/* Recipe */}
      {recipe && (
        <div className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/8">
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Tu recomendación Food·Mood</p>
          <p className="text-[#F5F0E8] font-medium text-sm mb-1">{recipe.nombre_es}</p>
          <p className="text-[#F5F0E8]/40 text-xs mb-4">{recipe.tiempo_preparacion_min} min · {recipe.tipo_plato}</p>
          {isPremium ? (
            <Link
              href={`/recetas/${recipe.id}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors"
            >
              Ver receta completa <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors"
            >
              Hazte Premium para ver la receta <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3">
        {saved ? (
          <div className="flex items-center justify-center gap-2 py-3 text-[#C9A84C] text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Lectura guardada en tu historial
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#6B2737] text-[#F5F0E8] rounded-2xl py-4 text-sm font-semibold hover:bg-[#5a212e] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            Guardar lectura de hoy
          </button>
        )}
        <button
          onClick={onReset}
          className="w-full py-3 text-[#F5F0E8]/40 text-sm hover:text-[#F5F0E8]/70 transition-colors"
        >
          Nueva lectura
        </button>
      </div>
    </motion.div>
  )
}

// ── Main wizard ──────────────────────────────────────────────────────

const STEP_VARIANTS = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

export default function OracleClient({ isPremium }: { isPremium: boolean }) {
  const [screen, setScreen] = useState<Screen>('hero')
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<OracleData>({
    primaryEmotion: null,
    energyLevel: 5,
    sleepQuality: 0,
    primarySymptom: null,
    cravingState: null,
    cyclePhase: null,
    notes: '',
  })

  const update = useCallback(<K extends keyof OracleData>(key: K, val: OracleData[K]) => {
    setData(d => ({ ...d, [key]: val }))
  }, [])

  const canAdvance = [
    data.primaryEmotion !== null,    // step 0
    true,                            // step 1 — energy always valid
    data.sleepQuality > 0,           // step 2
    true,                            // step 3 — null = no symptoms
    true,                            // step 4 — null = no craving
    true,                            // step 5 — optional
  ][step]

  const next = () => {
    if (step < STEPS.length - 1) {
      setDir(1)
      setStep(s => s + 1)
    } else {
      setScreen('result')
    }
  }

  const back = () => {
    if (step === 0) {
      setScreen('hero')
    } else {
      setDir(-1)
      setStep(s => s - 1)
    }
  }

  const reset = () => {
    setScreen('hero')
    setStep(0)
    setDir(1)
    setData({
      primaryEmotion: null,
      energyLevel: 5,
      sleepQuality: 0,
      primarySymptom: null,
      cravingState: null,
      cyclePhase: null,
      notes: '',
    })
  }

  if (screen === 'result') {
    return <OracleResult data={data} isPremium={isPremium} onReset={reset} />
  }

  if (screen === 'hero') {
    return (
      <motion.div
        key="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-[0.3em] uppercase mb-6">
            Food·Mood · Check-in diario
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F0E8] font-light leading-tight mb-4">
            El Oráculo<br />
            <em className="italic text-[#C9A84C]">Bioquímico</em>
          </h1>
          <p className="text-[#F5F0E8]/55 text-base max-w-xs mx-auto leading-relaxed mb-12">
            Tu cuerpo habla. Tus emociones también.<br />
            Registra cómo estás hoy y recibe una lectura personalizada.
          </p>
          <button
            onClick={() => { setScreen('wizard'); setStep(0) }}
            className="inline-flex items-center gap-3 bg-[#6B2737] text-[#F5F0E8] rounded-[60px] px-10 py-4 text-base font-semibold hover:bg-[#5a212e] transition-all hover:scale-105 active:scale-95"
          >
            Empezar mi lectura <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[#F5F0E8]/25 text-xs mt-5">6 preguntas · menos de 2 minutos</p>
        </motion.div>
      </motion.div>
    )
  }

  const currentStep = STEPS[step]

  return (
    <div className="min-h-screen bg-[#1A0A0E] flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5 w-full">
        <motion.div
          className="h-full bg-[#C9A84C]"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Top nav */}
      <div className="flex items-center justify-between px-5 py-4">
        <button
          onClick={back}
          className="flex items-center gap-1.5 text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Atrás
        </button>
        <span className="text-[#F5F0E8]/30 text-xs">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 max-w-md mx-auto w-full py-4 overflow-y-auto">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={STEP_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Step label */}
            <div className="mb-6">
              <p className="text-[#C9A84C] text-[10px] font-medium tracking-[0.2em] uppercase mb-2">
                Paso {currentStep.n} de {STEPS.length} — {currentStep.label}
              </p>
              <h2 className="font-serif text-2xl text-[#F5F0E8] font-light leading-snug">
                {currentStep.question}
              </h2>
            </div>

            {/* Step body */}
            {step === 0 && (
              <StepEmocion value={data.primaryEmotion} onChange={v => update('primaryEmotion', v)} />
            )}
            {step === 1 && (
              <StepEnergia value={data.energyLevel} onChange={v => update('energyLevel', v)} />
            )}
            {step === 2 && (
              <StepSueno value={data.sleepQuality} onChange={v => update('sleepQuality', v)} />
            )}
            {step === 3 && (
              <StepSintoma value={data.primarySymptom} onChange={v => update('primarySymptom', v)} />
            )}
            {step === 4 && (
              <StepCraving value={data.cravingState} onChange={v => update('cravingState', v)} />
            )}
            {step === 5 && (
              <StepNota
                notes={data.notes}
                onNotes={v => update('notes', v)}
                cyclePhase={data.cyclePhase}
                onCycle={v => update('cyclePhase', v)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="px-5 pb-8 pt-4 max-w-md mx-auto w-full">
        <button
          onClick={next}
          disabled={!canAdvance}
          className="w-full bg-[#6B2737] text-[#F5F0E8] rounded-2xl py-4 text-sm font-semibold transition-all hover:bg-[#5a212e] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? 'Ver mi lectura →' : 'Continuar →'}
        </button>
        {step >= 3 && (
          <button
            onClick={next}
            className="w-full mt-2 py-2.5 text-[#F5F0E8]/30 text-xs hover:text-[#F5F0E8]/50 transition-colors"
          >
            Omitir este paso
          </button>
        )}
      </div>
    </div>
  )
}
