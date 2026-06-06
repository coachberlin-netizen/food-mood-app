import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { z } from "zod"
import logger from "@/lib/logger"

const ActivateSchema = z.object({
  patient_user_id: z.string().uuid(),
  protocol_id:     z.string().uuid(),
})

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

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = ActivateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 })
  const { patient_user_id, protocol_id } = parsed.data

  const cookieStore = await cookies()
  const supabase = makeSupabase(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })

  const { data: professional } = await supabase.from("professionals").select("id").maybeSingle()
  if (!professional) return NextResponse.json({ error: "Perfil profesional no encontrado." }, { status: 403 })

  // Verify professional is linked to patient
  const { data: link } = await supabase
    .from("professional_patient_links")
    .select("id")
    .eq("professional_id", user.id)
    .eq("patient_user_id", patient_user_id)
    .eq("status", "active")
    .maybeSingle()

  if (!link) return NextResponse.json({ error: "El paciente no está vinculado a este profesional." }, { status: 403 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 })
  }

  const admin = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Check there is no active protocol already
  const { data: existing } = await admin
    .from("patient_protocols")
    .select("id")
    .eq("patient_user_id", patient_user_id)
    .eq("status", "active")
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "Este paciente ya tiene un protocolo activo." }, { status: 409 })
  }

  // Load protocol definition (including challenge_id for program-type entries)
  const { data: protocol, error: protocolErr } = await admin
    .from("clinical_protocols")
    .select("id, name, stages, duration_days, challenge_id")
    .eq("id", protocol_id)
    .eq("is_active", true)
    .maybeSingle()

  if (protocolErr || !protocol) {
    return NextResponse.json({ error: "Protocolo no encontrado." }, { status: 404 })
  }

  // Create patient_protocols row (tracks assignment at the professional level for all types)
  const { data: patientProtocol, error: ppErr } = await admin
    .from("patient_protocols")
    .insert({
      professional_id: user.id,
      patient_user_id,
      protocol_id,
      current_stage:   1,
      status:          "active",
    })
    .select("id, started_at")
    .single()

  if (ppErr || !patientProtocol) {
    logger.error({ err: ppErr }, "protocols/activate: error creating patient_protocol")
    return NextResponse.json({ error: "Error al crear el protocolo." }, { status: 500 })
  }

  // ── Programa (challenge_id present): enroll via user_challenges ──────
  if (protocol.challenge_id) {
    const { error: enrollErr } = await admin
      .from("user_challenges")
      .upsert(
        {
          user_id:      patient_user_id,
          challenge_id: protocol.challenge_id,
          start_date:   new Date().toISOString().split("T")[0],
          paid:         true,
        },
        { onConflict: "user_id,challenge_id", ignoreDuplicates: true }
      )

    if (enrollErr) {
      logger.error({ err: enrollErr, challenge_id: protocol.challenge_id }, "protocols/activate: error enrolling in challenge")
    }

    logger.info({ patient_user_id, protocol_id, challenge_id: protocol.challenge_id, patient_protocol_id: patientProtocol.id }, "Program activated via challenge enrollment")
    return NextResponse.json({ id: patientProtocol.id }, { status: 201 })
  }

  // ── Protocolo clínico (stages-based) ────────────────────────────────
  const stages = protocol.stages as ProtocolStage[]
  const stage1 = stages.find(s => s.stage === 1)
  if (!stage1) return NextResponse.json({ error: "El protocolo no tiene etapa 1 definida." }, { status: 500 })

  const startedAt = new Date(patientProtocol.started_at)
  const dueDate   = new Date(startedAt)
  dueDate.setDate(dueDate.getDate() + stage1.day_end)

  // Create therapeutic_assignments for stage 1
  const assignments = stage1.tools.map(toolSlug => ({
    professional_id:    user.id,
    patient_user_id,
    tool_slug:          toolSlug,
    title:              `${TOOL_LABELS[toolSlug] ?? toolSlug} — ${protocol.name}`,
    instruction:        stage1.description,
    frequency_per_week: 3,
    due_date:           dueDate.toISOString().split("T")[0],
    is_active:          true,
    patient_protocol_id: patientProtocol.id,
    protocol_stage:     1,
  }))

  const { error: asgErr } = await admin.from("therapeutic_assignments").insert(assignments)
  if (asgErr) {
    logger.error({ err: asgErr }, "protocols/activate: error creating assignments")
    return NextResponse.json({ error: "Error al crear las asignaciones." }, { status: 500 })
  }

  // Create content_prescriptions for stage 1
  if (stage1.content_slugs.length > 0) {
    const { data: contentItems } = await admin
      .from("content_library")
      .select("id, slug")
      .in("slug", stage1.content_slugs)
      .eq("is_published", true)

    if (contentItems && contentItems.length > 0) {
      const prescriptions = contentItems.map(item => ({
        professional_id:     user.id,
        patient_user_id,
        content_id:          item.id,
        patient_protocol_id: patientProtocol.id,
        protocol_stage:      1,
      }))

      const { error: prescErr } = await admin.from("content_prescriptions").insert(prescriptions)
      if (prescErr) {
        logger.error({ err: prescErr }, "protocols/activate: error creating prescriptions")
      }
    }
  }

  logger.info({ patient_user_id, protocol_id, patient_protocol_id: patientProtocol.id }, "Protocol activated")
  return NextResponse.json({ id: patientProtocol.id }, { status: 201 })
}
