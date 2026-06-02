import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { z } from "zod"
import logger from "@/lib/logger"

const PatchSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("advance_stage") }),
  z.object({ action: z.literal("pause") }),
  z.object({ action: z.literal("resume") }),
])

const TOOL_LABELS: Record<string, string> = {
  "registro/interoceptivo": "Check-in interoceptivo",
  "registro/hambre":        "Termómetro de hambre",
  "registro/comida":        "Pre/post comida",
  "setup/intenciones":      "Planes si-entonces",
  "registro/pensamiento":   "Diario de pensamientos",
  "registro/emocion":       "Registro emocional",
  "setup/valores":          "Clarificación de valores",
}

type ProtocolStage = {
  stage:         number
  name:          string
  days:          string
  day_end:       number
  tools:         string[]
  content_slugs: string[]
  description:   string
}

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 })

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 })
  }

  const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Load and verify ownership
  const { data: pp } = await admin
    .from("patient_protocols")
    .select("id, professional_id, patient_user_id, protocol_id, current_stage, status, started_at")
    .eq("id", id)
    .maybeSingle()

  if (!pp) return NextResponse.json({ error: "Protocolo no encontrado." }, { status: 404 })
  if (pp.professional_id !== user.id) return NextResponse.json({ error: "Sin acceso." }, { status: 403 })

  const { action } = parsed.data

  if (action === "pause") {
    await admin.from("patient_protocols").update({ status: "paused" }).eq("id", id)
    return NextResponse.json({ status: "paused" })
  }

  if (action === "resume") {
    if (pp.status !== "paused") return NextResponse.json({ error: "El protocolo no está pausado." }, { status: 409 })
    await admin.from("patient_protocols").update({ status: "active" }).eq("id", id)
    return NextResponse.json({ status: "active" })
  }

  // advance_stage
  const { data: protocol } = await admin
    .from("clinical_protocols")
    .select("stages, duration_days")
    .eq("id", pp.protocol_id)
    .maybeSingle()

  if (!protocol) return NextResponse.json({ error: "Definición de protocolo no encontrada." }, { status: 500 })

  const stages = protocol.stages as ProtocolStage[]
  const nextStageNum = pp.current_stage + 1
  const nextStage = stages.find(s => s.stage === nextStageNum)

  if (!nextStage) {
    // All stages done — mark as completed
    await admin.from("patient_protocols").update({
      status:       "completed",
      completed_at: new Date().toISOString(),
    }).eq("id", id)
    return NextResponse.json({ status: "completed" })
  }

  // Deactivate current stage assignments
  await admin
    .from("therapeutic_assignments")
    .update({ is_active: false })
    .eq("patient_protocol_id", id)
    .eq("protocol_stage", pp.current_stage)

  // Advance stage counter
  await admin.from("patient_protocols").update({ current_stage: nextStageNum }).eq("id", id)

  // Create assignments for next stage
  const startedAt = new Date(pp.started_at)
  const dueDate   = new Date(startedAt)
  dueDate.setDate(dueDate.getDate() + nextStage.day_end)

  const assignments = nextStage.tools.map(toolSlug => ({
    professional_id:     user.id,
    patient_user_id:     pp.patient_user_id,
    tool_slug:           toolSlug,
    title:               `${TOOL_LABELS[toolSlug] ?? toolSlug} — Protocolo Cortisol`,
    instruction:         nextStage.description,
    frequency_per_week:  3,
    due_date:            dueDate.toISOString().split("T")[0],
    is_active:           true,
    patient_protocol_id: id,
    protocol_stage:      nextStageNum,
  }))

  const { error: asgErr } = await admin.from("therapeutic_assignments").insert(assignments)
  if (asgErr) {
    logger.error({ err: asgErr }, "protocols/advance: error creating assignments")
    return NextResponse.json({ error: "Error al crear las asignaciones." }, { status: 500 })
  }

  // Create content prescriptions for next stage
  if (nextStage.content_slugs.length > 0) {
    const { data: contentItems } = await admin
      .from("content_library")
      .select("id, slug")
      .in("slug", nextStage.content_slugs)
      .eq("is_published", true)

    if (contentItems && contentItems.length > 0) {
      const prescriptions = contentItems.map(item => ({
        professional_id:     user.id,
        patient_user_id:     pp.patient_user_id,
        content_id:          item.id,
        patient_protocol_id: id,
        protocol_stage:      nextStageNum,
      }))
      await admin.from("content_prescriptions").insert(prescriptions)
    }
  }

  logger.info({ patient_protocol_id: id, from_stage: pp.current_stage, to_stage: nextStageNum }, "Protocol stage advanced")
  return NextResponse.json({ current_stage: nextStageNum })
}
