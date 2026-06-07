import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import logger from "@/lib/logger"

const SignupSchema = z.object({
  email:              z.string().email().max(254),
  password:           z.string().min(8).max(128),
  full_name:          z.string().min(2).max(120),
  professional_title: z.string().min(2).max(80),
  license_number:     z.string().max(40).optional(),
  bio:                z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 })
  }

  const parsed = SignupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos incompletos o no válidos." }, { status: 400 })
  }

  const { email, password, full_name, professional_title, license_number, bio } = parsed.data

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey) {
    logger.error("pro/signup: SUPABASE_SERVICE_ROLE_KEY no configurada en Vercel")
    return NextResponse.json({ error: "Error de configuración del servidor." }, { status: 500 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { full_name },
  })

  if (authError) {
    const msg = authError.message.toLowerCase()
    if (msg.includes("already registered") || msg.includes("already exists")) {
      return NextResponse.json({ error: "El email ya tiene una cuenta registrada." }, { status: 409 })
    }
    logger.error({ err: authError }, "pro/signup: error creando auth user")
    return NextResponse.json({ error: "Error al crear la cuenta." }, { status: 500 })
  }

  const { error: proError } = await admin.from("professionals").insert({
    id:                 authData.user.id,
    email,
    full_name,
    professional_title,
    license_number:     license_number || null,
    bio:                bio || null,
  })

  if (proError) {
    await admin.auth.admin.deleteUser(authData.user.id)
    logger.error({ err: proError }, "pro/signup: error insertando professionals row")
    return NextResponse.json({ error: "Error al registrar el perfil profesional." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
