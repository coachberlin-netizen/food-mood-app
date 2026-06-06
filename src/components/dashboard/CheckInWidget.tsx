'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { moods } from '@/data/moods'

interface LastCheckin {
  primary_emotion:   string
  secondary_emotion: string | null
  oracle_reading:    string | null
  recipe_mood_id:    string | null
  created_at:        string
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export function CheckInWidget() {
  const [checkin, setCheckin] = useState<LastCheckin | null | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setCheckin(null); return }

      const { data } = await supabase
        .from('oracle_checkins')
        .select('primary_emotion, secondary_emotion, oracle_reading, recipe_mood_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setCheckin(data ?? null)
    }
    load()
  }, [])

  if (checkin === undefined) {
    return (
      <div
        className="max-w-[520px] w-full mx-auto rounded-3xl p-5 h-[88px] animate-pulse"
        style={{ backgroundColor: '#1A0A0E' }}
      />
    )
  }

  const doneToday = checkin && isToday(checkin.created_at)

  if (!doneToday) {
    const ago = checkin ? daysAgo(checkin.created_at) : null

    return (
      <Link
        href="/eloraculo"
        className="max-w-[520px] w-full mx-auto block rounded-3xl p-5 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: '#1A0A0E', border: '1px solid rgba(255,107,53,0.15)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF6B35' }}>
            ✦ Check-in diario
          </p>
          {ago !== null && (
            <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.25)' }}>
              Última: hace {ago === 1 ? '1 día' : `${ago} días`}
            </span>
          )}
        </div>
        <p className="font-serif text-lg font-light mb-4 leading-snug" style={{ color: '#F5F0E8' }}>
          {checkin ? 'Aún no has hecho tu registro de hoy' : 'Registra tu estado emocional y físico de hoy'}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#FF6B35' }}>
          Hacer mi registro <ArrowRight className="w-3 h-3" />
        </span>
      </Link>
    )
  }

  const moodA = moods.find(m => m.id === checkin.primary_emotion)
  const moodB = checkin.secondary_emotion ? moods.find(m => m.id === checkin.secondary_emotion) : null
  const firstSentence = checkin.oracle_reading?.split('. ')[0]?.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[520px] w-full mx-auto rounded-3xl p-5"
      style={{ backgroundColor: '#1A0A0E', border: '1px solid rgba(255,107,53,0.15)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FF6B35' }}>
          ✦ Check-in · Hoy
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/eloraculo/historial"
            className="text-[10px] transition-opacity hover:opacity-80"
            style={{ color: 'rgba(245,240,232,0.25)' }}
          >
            Historial
          </Link>
          <Link
            href="/eloraculo"
            className="text-[10px] transition-opacity hover:opacity-80"
            style={{ color: 'rgba(245,240,232,0.35)' }}
          >
            Nueva →
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {moodA && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: moodA.color + '20', color: moodA.color, border: `1px solid ${moodA.color}35` }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: moodA.color }} />
            {moodA.nombre}
          </span>
        )}
        {moodB && (
          <>
            <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.25)' }}>+</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: moodB.color + '20', color: moodB.color, border: `1px solid ${moodB.color}35` }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: moodB.color }} />
              {moodB.nombre}
            </span>
          </>
        )}
      </div>

      {firstSentence && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(245,240,232,0.55)' }}>
          {firstSentence}.
        </p>
      )}
    </motion.div>
  )
}
