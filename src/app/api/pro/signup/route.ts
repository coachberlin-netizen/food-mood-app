import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
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

  // 1. Create auth user — unconfirmed (email_confirm: false)
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

  // 2. Insert professionals row — rollback auth user on failure
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

  // 3. Generate confirmation link and send it via Resend
  //    admin.generateLink sends the email itself when redirectTo is provided
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.food-mood.app"
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type:       "signup",
    email,
    password,
    options: { redirectTo: `${appUrl}/pro/login` },
  })

  if (linkError || !linkData?.properties?.action_link) {
    // Account created but confirmation link failed — log and continue, user can request resend
    logger.error({ err: linkError }, "pro/signup: error generando link de confirmación")
    return NextResponse.json({ success: true, warning: "confirm_link_failed" })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddr  = process.env.RESEND_FROM_EMAIL ?? "hola@food-mood.app"

  if (!resendKey) {
    logger.error("pro/signup: RESEND_API_KEY no configurada")
    return NextResponse.json({ success: true, warning: "email_not_sent" })
  }

  const resend = new Resend(resendKey)
  const { error: emailError } = await resend.emails.send({
    from:    `Food·Mood Pro <${fromAddr}>`,
    to:      email,
    subject: "Confirma tu acceso al portal profesional — Food·Mood",
    html: [
      '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">',
      '<title>Confirma tu cuenta profesional</title></head>',
      '<body style="margin:0;padding:0;background:#EDE8DF;font-family:Georgia,serif;color:#2d0f16">',
      '<div style="max-width:560px;margin:0 auto;background:#F5F0E8">',
      '<div style="background:#6B2737;padding:36px 40px 28px">',
      '<p style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#FF6B35;margin:0 0 8px">Food·Mood Pro</p>',
      '<h1 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#F5F0E8;line-height:1.2;margin:0">',
      'Un paso más para acceder al portal.</h1>',
      '</div>',
      '<div style="padding:36px 40px 28px;border-bottom:1px solid #e0d5c8">',
      `<p style="font-size:15px;line-height:1.8;color:#4a3a3e;margin:0 0 8px">Hola, ${full_name}.</p>`,
      '<p style="font-size:15px;line-height:1.8;color:#4a3a3e;margin:0 0 24px">',
      'Confirma tu dirección de correo para activar tu cuenta profesional.</p>',
      `<a href="${linkData.properties.action_link}" `,
      'style="display:inline-block;background:#6B2737;color:#F5F0E8;padding:14px 28px;',
      'border-radius:50px;text-decoration:none;font-size:13px;font-weight:700;',
      'font-family:Helvetica Neue,Helvetica,Arial,sans-serif">',
      'Confirmar mi cuenta →</a>',
      '</div>',
      '<div style="padding:24px 40px">',
      '<p style="font-size:11px;color:#b08090;margin:0;line-height:1.6">',
      'Este enlace caduca en 24 horas. Si no has creado esta cuenta, ignora este correo.',
      '</p></div>',
      '</div></body></html>',
    ].join(""),
  })

  if (emailError) {
    logger.error({ err: emailError }, "pro/signup: error enviando email de confirmación")
    // Account and professionals row exist — user can request resend from Supabase dashboard
    return NextResponse.json({ success: true, warning: "email_not_sent" })
  }

  return NextResponse.json({ success: true })
}
