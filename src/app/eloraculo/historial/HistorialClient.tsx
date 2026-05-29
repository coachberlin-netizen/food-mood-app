'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { moods } from '@/data/moods'
import type { OracleScore } from '@/lib/oracle'

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
  engine_output:     unknown   // jsonb — cast to OracleScore when accessing
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

function EnergyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="w-[5px] h-3 rounded-sm"
            style={{ background: i < value ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
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
          style={{ background: i < value ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
        />
      ))}
      <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.3)' }}>{value}/5</span>
    </div>
  )
}

function CheckinCard({ checkin, index }: { checkin: Checkin; index: number }) {
  const moodA       = moods.find(m => m.id === checkin.primary_emotion)
  const moodB       = checkin.secondary_emotion ? moods.find(m => m.id === checkin.secondary_emotion) : null
  const firstLine   = checkin.oracle_reading?.split('. ')[0]?.trim()
  const engineOut   = checkin.engine_output as OracleScore | null
  const insight     = engineOut?.insight ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: '#120609', borderColor: 'rgba(201,168,76,0.1)' }}
    >
      {/* Date + dominant need */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-medium capitalize" style={{ color: 'rgba(245,240,232,0.35)' }}>
          {formatDate(checkin.created_at)}
        </p>
        {checkin.recipe_mood_id && (
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.1)' }}
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

      {/* Reading first sentence */}
      {firstLine && (
        <p
          className="text-xs leading-relaxed mb-4 line-clamp-2"
          style={{ color: 'rgba(245,240,232,0.5)' }}
        >
          {firstLine}.
        </p>
      )}

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

      {/* Cross-signal insight (from engine_output) */}
      {insight && (
        <div
          className="rounded-xl px-3 py-2.5 mt-1"
          style={{ background: 'rgba(201,168,76,0.06)', borderLeft: '2px solid rgba(201,168,76,0.25)' }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(245,240,232,0.45)' }}>
            {insight}
          </p>
        </div>
      )}
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
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: '#C9A84C' }}>
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
        <div className="flex flex-col items-center py-20 text-center">
          <Sparkles className="w-8 h-8 mb-5" style={{ color: 'rgba(201,168,76,0.3)' }} />
          <p className="text-sm mb-6" style={{ color: 'rgba(245,240,232,0.4)' }}>
            Aún no has registrado ningún check-in
          </p>
          <Link
            href="/eloraculo"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
            style={{ background: '#6B2737', color: '#F5F0E8' }}
          >
            Hacer mi primer registro
          </Link>
        </div>
      )}

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
