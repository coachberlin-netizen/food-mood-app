import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { z } from "zod"
import logger from "@/lib/logger"

const InvitationSchema = z.object({
  patient_name:  z.string().min(1).optional(),
  patient_email: z.string().email().optional(),
})

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = InvitationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Autenticación requerida." }, { status: 401 })
  }

  const { data: professional } = await supabase
    .from("professionals")
    .select("id")
    .maybeSingle()

  if (!professional) {
    return NextResponse.json({ error: "Perfil profesional no encontrado." }, { status: 403 })
  }

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  let code = ""
  for (let i = 0; i < 5; i++) {
    const candidate = generateCode()
    const { data: existing } = await admin
      .from("patient_invitations")
      .select("id")
      .eq("invitation_code", candidate)
      .maybeSingle()
    if (!existing) { code = candidate; break }
  }

  if (!code) {
    return NextResponse.json({ error: "Error al generar el código de invitación." }, { status: 500 })
  }

  const { patient_name, patient_email } = parsed.data

  const { data: invitation, error: insertError } = await admin
    .from("patient_invitations")
    .insert({
      professional_id: professional.id,
      invitation_code: code,
      patient_name:    patient_name  ?? null,
      patient_email:   patient_email ?? null,
    })
    .select()
    .single()

  if (insertError) {
    logger.error({ err: insertError }, "pro/invitations: error insertando invitación")
    return NextResponse.json({ error: "Error al crear la invitación." }, { status: 500 })
  }

  return NextResponse.json({ invitation })
}
