import { NextRequest, NextResponse } from "next/server"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"

const adminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function GET(_req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Autenticación requerida" }, { status: 401 })
  }

  const admin = adminClient()
  const userId = user.id

  const [
    { data: profile },
    { data: userProfile },
    { data: subscriptions },
    { data: testResults },
    { data: emotionalPalettes },
    { data: diaryEntries },
    { data: moodHistory },
    { data: recipeHistory },
    { data: consent },
    { data: oracleCheckins },
    { data: symptomLog },
  ] = await Promise.all([
    admin.from("profiles").select("*").eq("id", userId).maybeSingle(),
    admin.from("user_profiles").select("*").eq("id", userId).maybeSingle(),
    admin.from("subscriptions").select("*").eq("user_id", userId),
    admin.from("test_results").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("emotional_palettes").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("diary_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("mood_history").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("user_recipe_history").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("user_consent").select("*").eq("user_id", userId).maybeSingle(),
    admin.from("oracle_checkins").select("created_at,primary_emotion,secondary_emotion,energy_level,sleep_quality,primary_symptom,craving_state,oracle_reading").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("symptom_log").select("log_date,bloating_level,sleep_level,brain_fog_level,energy_level,anxiety_level,headache_level,digestion_level,mood_level").eq("user_id", userId).order("log_date", { ascending: false }),
  ])

  const exportPayload = {
    export_generated_at: new Date().toISOString(),
    format_version: "1.0",
    subject: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    profile,
    user_profile: userProfile,
    subscriptions: subscriptions ?? [],
    consent,
    emotional_data: {
      test_results:       testResults       ?? [],
      emotional_palettes: emotionalPalettes ?? [],
      diary_entries:      diaryEntries      ?? [],
      mood_history:       moodHistory       ?? [],
      oracle_checkins:    oracleCheckins    ?? [],  // check-ins del Oráculo (notas y ciclo cifrados en BD)
      symptom_log:        symptomLog        ?? [],
    },
    activity: {
      recipe_history: recipeHistory ?? [],
    },
  }

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="foodmood-data-${userId.slice(0, 8)}.json"`,
    },
  })
}
