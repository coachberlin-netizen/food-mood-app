'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { detectCorrelations, type CheckinForCorrelation } from '@/lib/oracle/correlations'

export function OracleCorrelations() {
  const [insights, setInsights] = useState<string[] | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setInsights([]); return }

      const { data } = await supabase
        .from('oracle_checkins')
        .select('energy_level, sleep_quality, primary_symptom, craving_state, recipe_mood_id, primary_emotion, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(14)

      if (!data || data.length < 5) { setInsights([]); return }

      const results = detectCorrelations(data as CheckinForCorrelation[])
      setInsights(results.map(r => r.text))
    }
    load()
  }, [])

  if (!insights || insights.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-[520px] w-full mx-auto rounded-3xl p-5"
      style={{ backgroundColor: '#1A0A0E', border: '1px solid rgba(201,168,76,0.08)' }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>
        ✦ Lo que estamos observando
      </p>
      <ul className="space-y-3">
        {insights.map((text, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-xs leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.65)' }}
          >
            <span className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }}>—</span>
            {text}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
