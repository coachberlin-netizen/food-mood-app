import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encryptSensitive } from "@/lib/crypto"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { levels, notes, session_id, log_date } = body as {
    levels: Record<string, number>
    notes: string | null
    session_id: string
    log_date: string
  }

  const { data: { user } } = await supabase.auth.getUser()

  const row: Record<string, unknown> = {
    log_date,
    bloating_level:  levels.bloating  ?? 0,
    sleep_level:     levels.sleep     ?? 0,
    brain_fog_level: levels.brain_fog ?? 0,
    energy_level:    levels.energy    ?? 0,
    cycle_level:     levels.cycle     ?? 0,
    anxiety_level:   levels.anxiety   ?? 0,
    headache_level:  levels.headache  ?? 0,
    digestion_level: levels.digestion ?? 0,
    mood_level:      levels.mood      ?? 0,
    notes:           notes || null,
    updated_at:      new Date().toISOString(),
  }

  if (user) {
    row.user_id = user.id
    if ((levels.cycle ?? 0) > 0) {
      try {
        row.cycle_encrypted = encryptSensitive(String(levels.cycle), user.id)
      } catch {
        // ENCRYPTION_SECRET missing in dev — skip silently
      }
    }
    const { error } = await supabase
      .from("symptom_log")
      .upsert(row, { onConflict: "user_id,log_date" })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    row.user_id    = null
    row.session_id = session_id
    const { error } = await supabase.from("symptom_log").insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
