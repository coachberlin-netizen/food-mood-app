import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptSensitive } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { checkin, palette } = await req.json()

  // Build row — encrypt GDPR Art.9 free-text fields server-side
  const row: Record<string, unknown> = {
    user_id:           user.id,
    primary_emotion:   checkin.primary_emotion   ?? null,
    secondary_emotion: checkin.secondary_emotion ?? null,
    energy_level:      checkin.energy_level,
    sleep_quality:     checkin.sleep_quality,
    primary_symptom:   checkin.primary_symptom   ?? null,
    craving_state:     checkin.craving_state      ?? null,
    oracle_reading:    checkin.oracle_reading     ?? null,
    recipe_mood_id:    checkin.recipe_mood_id     ?? null,
    suggested_action:  checkin.suggested_action   ?? null,
    emotional_mix:     checkin.emotional_mix      ?? null,
    engine_output:     checkin.engine_output      ?? null,
  }

  // cycle_phase — encrypt if user gave a real value (not 'skip')
  const rawCycle = checkin.cycle_phase
  if (rawCycle && rawCycle !== 'skip') {
    try {
      row.cycle_phase = encryptSensitive(rawCycle, user.id)
    } catch {
      row.cycle_phase = null
    }
  }

  // notes — encrypt free text (can contain sensitive personal/health content)
  const rawNotes = checkin.notes
  if (rawNotes) {
    try {
      row.notes = encryptSensitive(rawNotes, user.id)
    } catch {
      row.notes = rawNotes  // fallback if ENCRYPTION_SECRET missing in dev
    }
  }

  const { error } = await supabase.from('oracle_checkins').insert(row)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Emotional palette (derived, less sensitive — saved separately)
  if (palette) {
    await supabase.from('emotional_palettes').insert({ user_id: user.id, ...palette })
  }

  return NextResponse.json({ ok: true })
}
