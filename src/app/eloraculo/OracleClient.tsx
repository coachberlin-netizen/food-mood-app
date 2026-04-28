'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2, CheckCircle2, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { moods } from '@/data/moods'
import { SYMPTOMS } from '@/data/symptoms'
import { createClient } from '@/lib/supabase/client'
import { calculatePalette, mixColors } from '@/lib/emotional-palette'
import { scoreCheckin } from '@/lib/oracle-scoring'

// ── Types ────────────────────────────────────────────────────────────

interface OracleData {
  emotions: string[]        // up to 2, index 0 = dominant
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
  { n: 1, label: 'Mapa emocional',      question: '¿Qué hay más presente en ti ahora mismo?' },
  { n: 2, label: 'Nivel de energía',    question: '¿Cómo está tu energía hoy?' },
  { n: 3, label: 'Descanso',            question: '¿Cómo has descansado esta noche?' },
  { n: 4, label: 'Señales del cuerpo',  question: '¿Hay algo que notes en tu cuerpo hoy?' },
  { n: 5, label: 'Lo que necesitas',    question: '¿Qué te está pidiendo el cuerpo?' },
  { n: 6, label: 'Contexto',            question: 'Añade contexto si quieres (opcional)' },
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

const EMOTION_TO_SLIDERS: Record<string, { energia: number; serenidad: number; claridad: number; conexion: number }> = {
  activacion: { energia: 8, serenidad: 3, claridad: 6, conexion: 5 },
  calma:      { energia: 3, serenidad: 8, claridad: 5, conexion: 6 },
  focus:      { energia: 6, serenidad: 6, claridad: 9, conexion: 4 },
  social:     { energia: 7, serenidad: 5, claridad: 5, conexion: 9 },
  reset:      { energia: 2, serenidad: 6, claridad: 3, conexion: 3 },
  confort:    { energia: 4, serenidad: 7, claridad: 4, conexion: 6 },
}

// ── Helpers ──────────────────────────────────────────────────────────

function getMixedSliders(emotions: string[]) {
  const fallback = { energia: 5, serenidad: 5, claridad: 5, conexion: 5 }
  if (emotions.length === 0) return fallback
  if (emotions.length === 1) return EMOTION_TO_SLIDERS[emotions[0]] ?? fallback
  const a = EMOTION_TO_SLIDERS[emotions[0]] ?? fallback
  const b = EMOTION_TO_SLIDERS[emotions[1]] ?? fallback
  return {
    energia:   Math.round((a.energia   + b.energia)   / 2),
    serenidad: Math.round((a.serenidad + b.serenidad) / 2),
    claridad:  Math.round((a.claridad  + b.claridad)  / 2),
    conexion:  Math.round((a.conexion  + b.conexion)  / 2),
  }
}

// ── Shared card style ────────────────────────────────────────────────

const cardBase = 'w-full rounded-2xl p-4 text-left transition-all border-2 cursor-pointer'
const cardIdle = 'border-transparent bg-white/5 hover:bg-white/8'
const cardSelected = 'border-[#C9A84C] bg-[#C9A84C]/10'

// ── Step components ──────────────────────────────────────────────────

function StepEmocion({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id))
    } else if (value.length < 2) {
      onChange([...value, id])
    } else {
      onChange([value[1], id]) // rotate: drop oldest, add new
    }
  }

  const mixColor = value.length === 2
    ? mixColors(
        moods.find(m => m.id === value[0])?.color ?? '#6B2737',
        moods.find(m => m.id === value[1])?.color ?? '#6B2737',
        0.5,
      )
    : null

  return (
    <div>
      <AnimatePresence>
        {value.length === 2 && mixColor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5"
          >
            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: mixColor }} />
            <p className="text-[#F5F0E8]/60 text-xs">
              Mezcla activa — toca una para cambiarla
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-2 gap-3">
        {moods.map(m => {
          const isSelected = value.includes(m.id)
          const idx = value.indexOf(m.id)
          return (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`${cardBase} ${isSelected ? cardSelected : cardIdle}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                {isSelected && (
                  <span className="text-[9px] font-medium text-[#C9A84C] uppercase tracking-wider">
                    {idx === 0 ? 'Principal' : 'Secundaria'}
                  </span>
                )}
              </div>
              <p className="text-[#F5F0E8] font-medium text-sm">{m.nombre}</p>
              <p className="text-[#F5F0E8]/40 text-xs mt-0.5 leading-snug line-clamp-2">
                {m.descripcion_corta.split('.')[0]}
              </p>
            </button>
          )
        })}
      </div>
      <p className="text-center text-[#F5F0E8]/25 text-xs mt-4">
        {value.length === 0 && 'Selecciona hasta 2 estados'}
        {value.length === 1 && 'Puedes añadir un segundo estado si hay mezcla'}
        {value.length === 2 && '✓ Mezcla registrada'}
      </p>
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

function FadeCard({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className="bg-white/5 rounded-2xl p-5 border border-white/8"
    >
      {children}
    </motion.div>
  )
}

function OracleResult({ data, isPremium, onReset }: { data: OracleData; isPremium: boolean; onReset: () => void }) {
  const [recipe, setRecipe] = useState<{ id: string; nombre_es: string; tiempo_preparacion_min: number; tipo_plato: string } | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const score = useMemo(() => scoreCheckin(data), [data])

  const moodA = moods.find(m => m.id === data.emotions[0])
  const moodB = data.emotions[1] ? moods.find(m => m.id === data.emotions[1]) : null
  const recipeMood = moods.find(m => m.id === score.recipeQuery.moodId)

  const accentColor = moodA && moodB
    ? mixColors(moodA.color, moodB.color, 0.5)
    : moodA?.color ?? '#C9A84C'

  useEffect(() => {
    if (!recipeMood) return
    const supabase = createClient()
    supabase
      .from('recetas')
      .select('id, nombre_es, tiempo_preparacion_min, tipo_plato')
      .eq('mood_es', recipeMood.nombre)
      .limit(1)
      .maybeSingle()
      .then(({ data: r }) => { if (r) setRecipe(r) })
  }, [recipeMood])

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
        user_id:           user.id,
        primary_emotion:   data.emotions[0] ?? null,
        secondary_emotion: data.emotions[1] ?? null,
        energy_level:      data.energyLevel,
        sleep_quality:     data.sleepQuality,
        primary_symptom:   data.primarySymptom,
        craving_state:     data.cravingState,
        cycle_phase:       data.cyclePhase,
        notes:             data.notes || null,
        oracle_reading:    score.reading,
        suggested_action:  { focus: score.nutritionPriority, ritual: score.ritual },
        emotional_mix: {
          emotions:    data.emotions,
          weights:     Object.fromEntries(data.emotions.map((e, i) => [e, i === 0 ? 1.0 : 0.4])),
          mixed_color: accentColor,
        },
      })

      if (data.emotions[0]) {
        const sliders = getMixedSliders(data.emotions)
        const palette = calculatePalette(sliders)
        await supabase.from('emotional_palettes').insert({
          user_id:           user.id,
          ...sliders,
          mood_dominante:    palette.moodDominante,
          mood_secundario:   palette.moodSecundario,
          color_resultado:   palette.colorMezclado,
          recetas_sugeridas: recipe ? [recipe.id] : [],
        })
      }

      setSaved(true)
    } finally {
      setSaving(false)
    }
  }, [data, score, accentColor, recipe])

  if (!moodA) return null

  return (
    <div className="min-h-screen bg-[#1A0A0E] px-5 pb-12 max-w-md mx-auto">
      {/* Celebratory header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="py-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: accentColor + '25', border: `1px solid ${accentColor}40` }}
        >
          <Sparkles className="w-6 h-6" style={{ color: accentColor }} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-[#F5F0E8] font-serif text-2xl font-light mb-1"
        >
          Lectura completada
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[#F5F0E8]/35 text-xs"
        >
          Hoy has sumado una nueva señal a tu mapa bioemocional
        </motion.p>
      </motion.div>

      {/* Emotion mix chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 mb-6 flex-wrap"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{ background: moodA.color + '20', border: `1px solid ${moodA.color}40` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: moodA.color }} />
          <span className="text-sm font-medium" style={{ color: moodA.color }}>{moodA.nombre}</span>
        </div>
        {moodB && (
          <>
            <span className="text-[#F5F0E8]/30 text-xs">+</span>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{ background: moodB.color + '20', border: `1px solid ${moodB.color}40` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: moodB.color }} />
              <span className="text-sm font-medium" style={{ color: moodB.color }}>{moodB.nombre}</span>
            </div>
          </>
        )}
      </motion.div>

      <div className="space-y-4">
        {/* Oracle reading */}
        <FadeCard delay={0.45}>
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Lo que estamos observando</p>
          <p className="text-[#F5F0E8]/85 text-sm leading-relaxed">{score.reading}</p>
        </FadeCard>

        {/* Pattern insight — only when a cross-signal pattern is detected */}
        {score.insight && (
          <FadeCard delay={0.55}>
            <div className="flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: accentColor + '80' }} />
              <div>
                <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-2">Patrón detectado</p>
                <p className="text-[#F5F0E8]/85 text-sm leading-relaxed">{score.insight}</p>
              </div>
            </div>
          </FadeCard>
        )}

        {/* Nutrition focus */}
        <FadeCard delay={0.65}>
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Lo que podría ayudarte hoy</p>
          <ul className="space-y-2">
            {score.nutritionPriority.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F5F0E8]/75">
                <span className="text-[#C9A84C] shrink-0 mt-0.5">—</span>
                {f}
              </li>
            ))}
          </ul>
        </FadeCard>

        {/* Ritual */}
        <FadeCard delay={0.75}>
          <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-2">Tu siguiente pequeño paso</p>
          <p className="text-[#F5F0E8]/75 text-sm">{score.ritual}</p>
        </FadeCard>

        {/* Recipe */}
        {recipe && (
          <FadeCard delay={0.85}>
            <p className="text-[#C9A84C] text-[10px] font-medium tracking-widest uppercase mb-3">Tu recomendación Food·Mood</p>
            <p className="text-[#F5F0E8] font-medium text-sm mb-1">{recipe.nombre_es}</p>
            <p className="text-[#F5F0E8]/40 text-xs mb-4">{recipe.tiempo_preparacion_min} min · {recipe.tipo_plato}</p>
            {isPremium ? (
              <Link href={`/recetas/${recipe.id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors">
                Ver receta completa <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link href="/pricing" className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors">
                Hazte Premium para ver la receta <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </FadeCard>
        )}

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} className="space-y-3 pt-2">
          {saved ? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm" style={{ color: accentColor }}>
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
          <button onClick={onReset} className="w-full py-3 text-[#F5F0E8]/35 text-sm hover:text-[#F5F0E8]/60 transition-colors">
            Nueva lectura
          </button>
        </motion.div>
      </div>
    </div>
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
    emotions: [],
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
    data.emotions.length > 0,
    true,
    data.sleepQuality > 0,
    true,
    true,
    true,
  ][step]

  const next = () => {
    if (step < STEPS.length - 1) { setDir(1); setStep(s => s + 1) }
    else setScreen('result')
  }

  const back = () => {
    if (step === 0) setScreen('hero')
    else { setDir(-1); setStep(s => s - 1) }
  }

  const reset = () => {
    setScreen('hero'); setStep(0); setDir(1)
    setData({ emotions: [], energyLevel: 5, sleepQuality: 0, primarySymptom: null, cravingState: null, cyclePhase: null, notes: '' })
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
      {/* Stepper header */}
      <div className="px-5 pt-5 pb-4 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={back}
            className="flex items-center gap-1 text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center flex-1 px-4">
            <p className="text-[#C9A84C] text-[10px] font-medium tracking-[0.2em] uppercase">
              Paso {currentStep.n} de {STEPS.length}
            </p>
            <p className="text-[#F5F0E8]/50 text-xs mt-0.5">{currentStep.label}</p>
          </div>
          <div className="w-8" />
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#C9A84C' }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-5 max-w-md mx-auto w-full py-2 overflow-y-auto">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={STEP_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <h2 className="font-serif text-2xl text-[#F5F0E8] font-light leading-snug mb-6">
              {currentStep.question}
            </h2>
            {step === 0 && <StepEmocion value={data.emotions} onChange={v => update('emotions', v)} />}
            {step === 1 && <StepEnergia value={data.energyLevel} onChange={v => update('energyLevel', v)} />}
            {step === 2 && <StepSueno value={data.sleepQuality} onChange={v => update('sleepQuality', v)} />}
            {step === 3 && <StepSintoma value={data.primarySymptom} onChange={v => update('primarySymptom', v)} />}
            {step === 4 && <StepCraving value={data.cravingState} onChange={v => update('cravingState', v)} />}
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
          <button onClick={next} className="w-full mt-2 py-2.5 text-[#F5F0E8]/30 text-xs hover:text-[#F5F0E8]/50 transition-colors">
            Omitir este paso
          </button>
        )}
      </div>
    </div>
  )
}
