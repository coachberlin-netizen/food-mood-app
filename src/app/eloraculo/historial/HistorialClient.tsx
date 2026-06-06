'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { moods } from '@/data/moods'

// ── Types ────────────────────────────────────────────────────────────

interface Checkin {
  id:                string
  created_at:        string
  primary_emotion:   string
  secondary_emotion: string | null
  energy_level:      number
  sleep_quality:     number
  primary_symptom:   string | null
  oracle_reading:    string | null
  recipe_mood_id:    string | null
  engine_output:     unknown
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  const isToday    = d.toDateString() === new Date().toDateString()
  const yesterday  = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()
  if (isToday)     return 'Hoy'
  if (isYesterday) return 'Ayer'
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── Sub-components ───────────────────────────────────────────────────

function EmotionCalendar({ checkins }: { checkins: Checkin[] }) {
  const today = new Date()
  const days  = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (27 - i))
    return d
  })

  const byDate = new Map<string, Checkin>()
  checkins.forEach(c => {
    const key = new Date(c.created_at).toLocaleDateString("en-CA")
    if (!byDate.has(key)) byDate.set(key, c)
  })

  const present = moods.filter(m =>
    days.some(d => byDate.get(d.toLocaleDateString("en-CA"))?.primary_emotion === m.id)
  )

  return (
    <div className="mb-6 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,53,0.1)" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(245,240,232,0.3)" }}>
        Últimos 28 días
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          const key  = day.toLocaleDateString("en-CA")
          const c    = byDate.get(key)
          const mood = c ? moods.find(m => m.id === c.primary_emotion) : null
          const isToday = day.toDateString() === today.toDateString()
          return (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{
                background:    mood ? mood.color + "bb" : "rgba(255,255,255,0.05)",
                outline:       isToday ? "1.5px solid rgba(255,107,53,0.6)" : undefined,
                outlineOffset: isToday ? "2px" : undefined,
              }}
            />
          )
        })}
      </div>
      {present.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {present.map(m => {
            const count = days.filter(d => byDate.get(d.toLocaleDateString("en-CA"))?.primary_emotion === m.id).length
            return (
              <span key={m.id} className="inline-flex items-center gap-1 text-[9px]" style={{ color: "rgba(245,240,232,0.4)" }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: m.color }} />
                {m.nombre} ({count})
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EnergyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="w-[5px] h-3 rounded-sm"
            style={{ background: i < value ? '#FF6B35' : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.3)' }}>{value}/10</span>
    </div>
  )
}

function SleepDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: i < value ? '#FF6B35' : 'rgba(255,255,255,0.1)' }}
        />
      ))}
      <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.3)' }}>{value}/5</span>
    </div>
  )
}

function CheckinCard({ checkin, index }: { checkin: Checkin; index: number }) {
  const moodA     = moods.find(m => m.id === checkin.primary_emotion)
  const moodB     = checkin.secondary_emotion ? moods.find(m => m.id === checkin.secondary_emotion) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: '#120609', borderColor: 'rgba(255,107,53,0.1)' }}
    >
      {/* Date + dominant need */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-medium capitalize" style={{ color: 'rgba(245,240,232,0.35)' }}>
          {formatDate(checkin.created_at)}
        </p>
        {checkin.recipe_mood_id && (
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: '#FF6B35', background: 'rgba(255,107,53,0.1)' }}
          >
            {checkin.recipe_mood_id}
          </span>
        )}
      </div>

      {/* Emotion chips */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {moodA && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ background: moodA.color + '20', color: moodA.color, border: `1px solid ${moodA.color}30` }}
          >
            {moodA.nombre}
          </span>
        )}
        {moodB && (
          <>
            <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.2)' }}>+</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ background: moodB.color + '20', color: moodB.color, border: `1px solid ${moodB.color}30` }}
            >
              {moodB.nombre}
            </span>
          </>
        )}
      </div>

      {/* Metrics row */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] w-12 shrink-0" style={{ color: 'rgba(245,240,232,0.25)' }}>Energía</span>
          <EnergyBar value={checkin.energy_level} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] w-12 shrink-0" style={{ color: 'rgba(245,240,232,0.25)' }}>Sueño</span>
          <SleepDots value={checkin.sleep_quality} />
        </div>
      </div>

    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────

export default function HistorialClient({ checkins }: { checkins: Checkin[] }) {
  return (
    <div className="min-h-screen pb-16 max-w-md mx-auto px-5" style={{ background: '#1A0A0E' }}>

      {/* Header */}
      <div className="pt-8 pb-6">
        <Link
          href="/eloraculo"
          className="inline-flex items-center gap-1 text-xs mb-6 transition-opacity hover:opacity-70"
          style={{ color: 'rgba(245,240,232,0.35)' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Check-in diario
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#FF6B35' }}>
          Food·Mood · Historial
        </p>
        <h1 className="font-serif text-3xl font-light text-[#F5F0E8]">Tus registros</h1>
        {checkins.length > 0 && (
          <p className="text-[10px] mt-1" style={{ color: 'rgba(245,240,232,0.3)' }}>
            {checkins.length} check-in{checkins.length !== 1 ? 's' : ''} registrados
          </p>
        )}
      </div>

      {/* Empty state */}
      {checkins.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center py-20 text-center px-6"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}
          >
            <Sparkles className="w-6 h-6" style={{ color: 'rgba(255,107,53,0.5)' }} />
          </div>
          <p className="font-serif text-xl font-light mb-3" style={{ color: '#F5F0E8' }}>
            Tu espacio está esperando
          </p>
          <p className="text-sm font-light leading-relaxed max-w-xs mb-8" style={{ color: 'rgba(245,240,232,0.4)' }}>
            Cada check-in es un momento de escucha. Empieza hoy y en 7 días tendrás una imagen real de tus patrones.
          </p>
          <Link
            href="/eloraculo"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{ background: '#6B2737', color: '#F5F0E8' }}
          >
            Empezar mi registro
          </Link>
        </motion.div>
      )}

      {/* Emotion heatmap */}
      {checkins.length > 0 && <EmotionCalendar checkins={checkins} />}

      {/* Cards */}
      <div className="space-y-3">
        {checkins.map((c, i) => (
          <CheckinCard key={c.id} checkin={c} index={i} />
        ))}
      </div>

      {/* CTA at the bottom */}
      {checkins.length > 0 && (
        <div className="pt-8 text-center">
          <Link
            href="/eloraculo"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
            style={{ background: '#6B2737', color: '#F5F0E8' }}
          >
            Nuevo registro
          </Link>
        </div>
      )}
    </div>
  )
}
