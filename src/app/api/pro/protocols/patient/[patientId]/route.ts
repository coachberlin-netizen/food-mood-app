import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

function makeSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    return NextResponse.json({ error: "Error de configuración." }, { status: 500 })
  }

  const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: pp } = await admin
    .from("patient_protocols")
    .select(`
      id,
      current_stage,
      status,
      started_at,
      professional_notes,
      clinical_protocols (
        id,
        name,
        slug,
        duration_days,
        stages
      )
    `)
    .eq("professional_id", user.id)
    .eq("patient_user_id", patientId)
    .in("status", ["active", "paused"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!pp) return NextResponse.json({ protocol: null })

  // Compute stage completion: completions in current stage / (assignments × freq)
  const { data: stageAssignments } = await admin
    .from("therapeutic_assignments")
    .select("id, frequency_per_week, assignment_completions(completed_at)")
    .eq("patient_protocol_id", pp.id)
    .eq("protocol_stage", pp.current_stage)

  let stage_completion_pct = 0
  if (stageAssignments && stageAssignments.length > 0) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 6)
    weekStart.setHours(0, 0, 0, 0)

    const rows = stageAssignments as {
      id: string
      frequency_per_week: number
      assignment_completions: { completed_at: string }[]
    }[]

    const totalExpected = rows.reduce((s, r) => s + r.frequency_per_week, 0)
    const totalDone = rows.reduce((s, r) => {
      return s + r.assignment_completions.filter(c => new Date(c.completed_at) >= weekStart).length
    }, 0)

    stage_completion_pct = totalExpected > 0 ? Math.round((totalDone / totalExpected) * 100) : 0
  }

  const daysSinceStart = Math.floor(
    (Date.now() - new Date(pp.started_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return NextResponse.json({
    protocol: {
      ...pp,
      days_elapsed: daysSinceStart + 1,
      stage_completion_pct,
    },
  })
}
