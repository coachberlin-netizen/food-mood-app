'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { moods } from '@/data/moods'
import { createClient } from '@/lib/supabase/client'
import { calculatePalette, mixColors } from '@/lib/emotional-palette'
import { scoreCheckin, type EmotionalMix, type OracleSuggestedAction } from '@/lib/oracle-scoring'

// ── Types ────────────────────────────────────────────────────────────

interface OracleData {
  emotions: string[]        // up to 2, index 0 = dominant
  energyLevel: number
  sleepQuality: number
  primarySymptom: string | null
  cravingState: string[]
  cyclePhase: string | null
  notes: string
}

type Screen = 'hero' | 'consent' | 'wizard' | 'result'

const CONSENT_KEY = 'fm_health_consent_v1'

// ── Static data ──────────────────────────────────────────────────────

const SCREENS_META = [
  { n: 1, label: 'Estado emocional',   question: '¿Qué hay más presente en ti ahora mismo?' },
  { n: 2, label: 'Energía y descanso', question: '¿Cómo están tu energía y descanso hoy?' },
  { n: 3, label: 'Señales del cuerpo', question: '¿Qué más notas hoy?' },
]

const SLEEP_OPTIONS = [
  { value: 1, label: 'Muy mal',  desc: 'Apenas dormí' },
  { value: 2, label: 'Mal',      desc: 'Poco y entrecortado' },
  { value: 3, label: 'Regular',  desc: 'Podría ser mejor' },
  { value: 4, label: 'Bien',     desc: 'Bastante reparador' },
  { value: 5, label: 'Muy bien', desc: 'Profundo y completo' },
]

const CRAVINGS = [
  { id: 'dulce',       label: 'Dulce',             icon: '🍫' },
  { id: 'salado',      label: 'Salado',             icon: '🧂' },
  { id: 'proteina',    label: 'Proteína',           icon: '🥩' },
  { id: 'calor',       label: 'Calor y confort',    icon: '🍲' },
  { id: 'fresco',      label: 'Algo fresco',        icon: '🥗' },
  { id: 'fermento',    label: 'Ácido / fermentado', icon: '🫙' },
  { id: 'estimulante', label: 'Café o estimulante', icon: '☕' },
  { id: 'nada',        label: 'Nada en concreto',   icon: '✨' },
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

// ── Card style tokens ─────────────────────────────────────────────────

const cardBase     = 'w-full rounded-2xl p-4 text-left transition-all border-2 cursor-pointer'
const cardIdle     = 'border-transparent bg-white/5 hover:bg-white/8'
const cardSelected = 'border-[#FF6B35] bg-[#FF6B35]/10'

// ── Screen 1 — Emotion ───────────────────────────────────────────────

function Screen1Emocion({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id))
    } else if (value.length < 2) {
      onChange([...value, id])
    } else {
      onChange([value[1], id])
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
            <p className="text-[#F5F0E8]/60 text-xs">Mezcla activa — toca una para cambiarla</p>
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
                  <span className="text-[9px] font-medium text-[#FF6B35] uppercase tracking-wider">
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

// ── Screen 2 — Energy + Sleep ─────────────────────────────────────────

function Screen2EnergiaSueno({
  energyLevel, sleepQuality, onEnergy, onSleep,
}: {
  energyLevel: number; sleepQuality: number
  onEnergy: (v: number) => void; onSleep: (v: number) => void
}) {
  return (
    <div className="space-y-8">

      {/* Energy */}
      <div>
        <p className="text-[#F5F0E8]/40 text-[10px] font-bold uppercase tracking-widest mb-4">
          Nivel de energía
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <button
              key={n}
              onClick={() => onEnergy(n)}
              className={`rounded-xl py-3 text-sm font-medium transition-all border-2 ${
                energyLevel === n
                  ? 'border-[#FF6B35] bg-[#FF6B35]/15 text-[#FF6B35]'
                  : 'border-transparent bg-white/5 text-[#F5F0E8]/60 hover:bg-white/10'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#F5F0E8]/30 px-1 mt-2">
          <span>Sin energía</span>
          <span>Llena de vitalidad</span>
        </div>
      </div>

      <div className="h-px bg-white/8" />

      {/* Sleep */}
      <div>
        <p className="text-[#F5F0E8]/40 text-[10px] font-bold uppercase tracking-widest mb-4">
          Calidad del sueño
        </p>
        <div className="space-y-2">
          {SLEEP_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSleep(opt.value)}
              className={`${cardBase} flex items-center gap-4 ${sleepQuality === opt.value ? cardSelected : cardIdle}`}
            >
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: i <= opt.value ? '#FF6B35' : 'rgba(255,255,255,0.15)' }}
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
      </div>

    </div>
  )
}

// ── Screen 3 — Signals + Context (all optional) ──────────────────────

function Screen3SenalesContexto({
  cravingState, notes, onCraving, onNotes,
}: {
  cravingState: string[]; notes: string
  onCraving: (v: string) => void; onNotes: (v: string) => void
}) {
  return (
    <div className="space-y-6">

      {/* Cravings */}
      <div>
        <p className="text-[#F5F0E8]/40 text-[10px] font-bold uppercase tracking-widest mb-4">
          ¿Qué te pide el cuerpo? <span className="normal-case font-normal">(puedes elegir varios)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CRAVINGS.map(c => (
            <button
              key={c.id}
              onClick={() => onCraving(c.id)}
              className={`${cardBase} py-3 ${cravingState.includes(c.id) ? cardSelected : cardIdle}`}
            >
              <span className="text-lg mb-1 block">{c.icon}</span>
              <p className="text-[#F5F0E8] text-xs font-medium leading-snug">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Optional note */}
      <div>
        <p className="text-[#F5F0E8]/40 text-[10px] font-bold uppercase tracking-widest mb-3">
          Contexto (opcional)
        </p>
        <textarea
          value={notes}
          onChange={e => onNotes(e.target.value)}
          placeholder="¿Algo más que quieras registrar hoy?"
          rows={3}
          className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-[#F5F0E8] text-sm placeholder:text-[#F5F0E8]/25 focus:outline-none focus:border-[#FF6B35]/50 resize-none"
        />
        <p className="text-[#F5F0E8]/20 text-[10px] mt-1 px-1">
          Cifradas y solo visibles para ti y tu profesional.
        </p>
      </div>

    </div>
  )
}

// ── Result screen ────────────────────────────────────────────────────

function OracleResult({ data, isPremium: _isPremium, onReset }: { data: OracleData; isPremium: boolean; onReset: () => void }) {
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)
  const autoSavedRef = useRef(false)

  const score = scoreCheckin(data)

  const moodA = moods.find(m => m.id === data.emotions[0])
  const moodB = data.emotions[1] ? moods.find(m => m.id === data.emotions[1]) : null

  const accentColor = moodA && moodB
    ? mixColors(moodA.color, moodB.color, 0.5)
    : moodA?.color ?? '#FF6B35'

  const handleSave = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login?redirect=/eloraculo'
      return
    }
    setSaving(true)
    try {
      let palettePayload: Record<string, unknown> | null = null
      if (data.emotions[0]) {
        const sliders = getMixedSliders(data.emotions)
        const palette = calculatePalette(sliders)
        palettePayload = {
          ...sliders,
          mood_dominante:    palette.moodDominante,
          mood_secundario:   palette.moodSecundario,
          color_resultado:   palette.colorMezclado,
          recetas_sugeridas: [],
        }
      }

      const res = await fetch('/api/oracle/save', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin: {
            primary_emotion:   data.emotions[0] ?? null,
            secondary_emotion: data.emotions[1] ?? null,
            energy_level:      data.energyLevel,
            sleep_quality:     data.sleepQuality,
            primary_symptom:   data.primarySymptom,
            craving_state:     data.cravingState.length > 0 ? data.cravingState.join(',') : null,
            cycle_phase:       data.cyclePhase === 'skip' ? null : data.cyclePhase,
            notes:             data.notes || null,
            oracle_reading:    score.reading,
            recipe_mood_id:    score.recipeQuery.moodId,
            suggested_action:  { focus: score.nutritionPriority, ritual: score.ritual } satisfies OracleSuggestedAction,
            emotional_mix: {
              emotions:      data.emotions,
              weights:       Object.fromEntries(data.emotions.map((e, i) => [e, i === 0 ? 1.0 : 0.4])),
              mixed_color:   accentColor,
              dominant_need: score.dominantNeed,
            } satisfies EmotionalMix,
            engine_output: score,
          },
          palette: palettePayload,
        }),
      })

      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }, [data, accentColor, score])

  useEffect(() => {
    if (autoSavedRef.current || saved) return
    autoSavedRef.current = true
    handleSave()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!moodA) return null

  return (
    <div className="min-h-screen bg-[#1A0A0E] px-5 md:px-8 pb-16 max-w-2xl mx-auto">
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
          Registro completado
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-[#F5F0E8]/35 text-xs"
        >
          Tu estado de hoy ha sido registrado
        </motion.p>
      </motion.div>

      {/* Emotion chips */}
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

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-3xl p-8 border text-center"
          style={{ borderColor: 'rgba(255,107,53,0.2)', background: 'rgba(255,107,53,0.05)' }}
        >
          <p className="text-[#F5F0E8]/70 text-base leading-relaxed font-light">
            Tu check-in ha sido registrado. Tu profesional tendrá acceso a tu evolución en la próxima sesión.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3 pt-2">
          {saved ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 py-3 text-sm" style={{ color: accentColor }}>
                <CheckCircle2 className="w-4 h-4" />
                Registro guardado
              </div>
              <Link
                href="/eloraculo/historial"
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium border transition-colors hover:bg-white/5"
                style={{ color: 'rgba(245,240,232,0.5)', borderColor: 'rgba(245,240,232,0.1)' }}
              >
                Ver mis registros →
              </Link>
            </div>
          ) : saving ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm" style={{ color: 'rgba(245,240,232,0.35)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando registro…
            </div>
          ) : null}
          <button onClick={onReset} className="w-full py-3 text-[#F5F0E8]/35 text-sm hover:text-[#F5F0E8]/60 transition-colors">
            Nuevo registro
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// ── Consent screen (GDPR Art.9) ──────────────────────────────────────

function ConsentScreen({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const [saving, setSaving] = useState(false)

  const handleAccept = async () => {
    setSaving(true)
    localStorage.setItem(CONSENT_KEY, 'true')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('user_consent').upsert({
          user_id:             user.id,
          health_data_consent: true,
          consent_version:     CONSENT_KEY,
          consented_at:        new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }
    } catch { /* non-blocking */ }
    finally { setSaving(false) }
    onAccept()
  }

  return (
    <motion.div
      key="consent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#1A0A0E] flex flex-col items-center justify-center px-6 py-16"
    >
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <p className="text-[#FF6B35] text-[10px] font-medium tracking-[0.3em] uppercase mb-4">
            Antes de empezar
          </p>
          <h2 className="font-serif text-2xl text-[#F5F0E8] font-light leading-tight mb-3">
            Tus datos de salud
          </h2>
          <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">
            Este registro captura información sobre tu estado emocional, síntomas y descanso —
            datos de categoría especial según el RGPD (Art. 9).
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 text-sm text-[#F5F0E8]/60 leading-relaxed">
          <p>✦ Solo <strong className="text-[#F5F0E8]/80">tú y tu profesional</strong> podéis ver tus registros — están cifrados y no se usan para publicidad.</p>
          <p>✦ <strong className="text-[#F5F0E8]/80">Puedes borrar</strong> todos tus datos en cualquier momento desde tu perfil.</p>
          <p>✦ Nunca compartimos datos de salud con terceros ni con herramientas de analítica.</p>
          <p className="text-[#F5F0E8]/30 text-xs pt-1">Base legal: consentimiento explícito · Art. 9(2)(a) RGPD</p>
        </div>

        <div className="space-y-3">
          <button
            disabled={saving}
            onClick={handleAccept}
            className="w-full py-4 rounded-[60px] bg-[#6B2737] text-[#F5F0E8] font-semibold text-sm hover:bg-[#5a212e] transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Entendido, empezar mi registro'}
          </button>
          <button
            onClick={onDecline}
            className="w-full py-3 text-[#F5F0E8]/30 text-xs hover:text-[#F5F0E8]/50 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Slide animation ───────────────────────────────────────────────────

const STEP_VARIANTS = {
  enter:  (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
}

// ── Main component ───────────────────────────────────────────────────

export default function OracleClient({ isPremium }: { isPremium: boolean }) {
  const [screen,       setScreen]       = useState<Screen>('hero')
  const [step,         setStep]         = useState(0)   // 0-2
  const [dir,          setDir]          = useState(1)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    setConsentGiven(localStorage.getItem(CONSENT_KEY) === 'true')
  }, [])

  const [data, setData] = useState<OracleData>({
    emotions:       [],
    energyLevel:    5,
    sleepQuality:   0,
    primarySymptom: null,
    cravingState:   [],
    cyclePhase:     null,
    notes:          '',
  })

  const update = useCallback(<K extends keyof OracleData>(key: K, val: OracleData[K]) => {
    setData(d => ({ ...d, [key]: val }))
  }, [])

  const canAdvance = [
    data.emotions.length > 0,  // screen 1: emotion required
    data.sleepQuality > 0,     // screen 2: sleep required (energy defaults to 5)
    true,                       // screen 3: all optional
  ][step]

  const next = () => {
    if (step < SCREENS_META.length - 1) { setDir(1); setStep(s => s + 1) }
    else setScreen('result')
  }

  const back = () => {
    if (step === 0) setScreen('hero')
    else { setDir(-1); setStep(s => s - 1) }
  }

  const reset = () => {
    setScreen('hero'); setStep(0); setDir(1)
    setData({ emotions: [], energyLevel: 5, sleepQuality: 0, primarySymptom: null, cravingState: [], cyclePhase: null, notes: '' })
  }

  if (screen === 'result') {
    return <OracleResult data={data} isPremium={isPremium} onReset={reset} />
  }

  if (screen === 'consent') {
    return (
      <ConsentScreen
        onAccept={() => { setConsentGiven(true); setScreen('wizard'); setStep(0) }}
        onDecline={() => setScreen('hero')}
      />
    )
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
          <p className="text-[#FF6B35] text-[10px] font-medium tracking-[0.3em] uppercase mb-6">
            Food·Mood · Check-in diario
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F5F0E8] font-light leading-tight mb-4">
            Registro<br />
            <em className="italic text-[#FF6B35]">emocional</em>
          </h1>
          <p className="text-[#F5F0E8]/55 text-base max-w-xs mx-auto leading-relaxed mb-12">
            Registra tu estado emocional y físico de hoy.<br />
            Los datos ayudan a tu profesional a preparar vuestra sesión.
          </p>
          <button
            onClick={() => {
              if (consentGiven) { setScreen('wizard'); setStep(0) }
              else setScreen('consent')
            }}
            className="inline-flex items-center gap-3 bg-[#6B2737] text-[#F5F0E8] rounded-[60px] px-10 py-4 text-base font-semibold hover:bg-[#5a212e] transition-all hover:scale-105 active:scale-95"
          >
            Empezar mi registro
          </button>
          <p className="text-[#F5F0E8]/25 text-xs mt-5">3 pantallas · menos de 90 segundos</p>
        </motion.div>
      </motion.div>
    )
  }

  const currentScreen = SCREENS_META[step]

  return (
    <div className="min-h-screen bg-[#1A0A0E] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={back}
            className="flex items-center gap-1 text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center flex-1 px-4">
            <p className="text-[#FF6B35] text-[10px] font-medium tracking-[0.2em] uppercase">
              {currentScreen.n} de {SCREENS_META.length}
            </p>
            <p className="text-[#F5F0E8]/50 text-xs mt-0.5">{currentScreen.label}</p>
          </div>
          <div className="w-8" />
        </div>
        <div className="h-1 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#FF6B35' }}
            animate={{ width: `${((step + 1) / SCREENS_META.length) * 100}%` }}
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
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <h2 className="font-serif text-2xl text-[#F5F0E8] font-light leading-snug mb-6">
              {currentScreen.question}
            </h2>

            {step === 0 && (
              <Screen1Emocion
                value={data.emotions}
                onChange={v => update('emotions', v)}
              />
            )}
            {step === 1 && (
              <Screen2EnergiaSueno
                energyLevel={data.energyLevel}
                sleepQuality={data.sleepQuality}
                onEnergy={v => update('energyLevel', v)}
                onSleep={v => update('sleepQuality', v)}
              />
            )}
            {step === 2 && (
              <Screen3SenalesContexto
                cravingState={data.cravingState}
                notes={data.notes}
                onCraving={v => update('cravingState',
                  data.cravingState.includes(v)
                    ? data.cravingState.filter(c => c !== v)
                    : [...data.cravingState, v]
                )}
                onNotes={v => update('notes', v)}
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
          {step === SCREENS_META.length - 1 ? 'Guardar mi registro →' : 'Continuar →'}
        </button>
        {step === SCREENS_META.length - 1 && (
          <button
            onClick={next}
            className="w-full mt-2 py-2.5 text-[#F5F0E8]/30 text-xs hover:text-[#F5F0E8]/50 transition-colors"
          >
            Omitir y guardar →
          </button>
        )}
      </div>
    </div>
  )
}
