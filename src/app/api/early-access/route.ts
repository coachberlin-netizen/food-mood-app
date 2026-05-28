import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import logger from "@/lib/logger"

const Schema = z.object({
  name:              z.string().min(2).max(120),
  email:             z.string().email(),
  professional_type: z.string().min(1).max(100),
  patient_count:     z.string().max(50).optional(),
  current_tool:      z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }) }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos incompletos", issues: parsed.error.flatten() }, { status: 422 })
  }

  const { name, email, professional_type, patient_count, current_tool } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: dbError } = await supabase
    .from("early_access_requests")
    .insert({ name, email, professional_type, patient_count, current_tool })

  if (dbError) {
    logger.error({ dbError, email }, "early-access: error guardando solicitud")
    return NextResponse.json({ error: "No se pudo guardar. Inténtalo de nuevo." }, { status: 500 })
  }

  // Notificación al equipo (non-blocking)
  const adminEmail = process.env.ADMIN_EMAIL
  const resendKey  = process.env.RESEND_API_KEY
  const fromEmail  = process.env.RESEND_FROM_EMAIL ?? "noreply@food-mood.app"

  if (adminEmail && resendKey) {
    const resend = new Resend(resendKey)
    resend.emails.send({
      from:    fromEmail,
      to:      adminEmail,
      subject: `[Food·Mood Pro] Nueva solicitud de acceso — ${name}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo de profesional:</strong> ${professional_type}</p>
        <p><strong>Pacientes aprox.:</strong> ${patient_count ?? "—"}</p>
        <p><strong>Herramienta actual:</strong> ${current_tool ?? "—"}</p>
      `,
    }).catch(e => logger.warn({ e }, "early-access: fallo enviando email de notificación"))
  }

  logger.info({ email, professional_type }, "early-access: solicitud registrada")
  return NextResponse.json({ ok: true })
}
