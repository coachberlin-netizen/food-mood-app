import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import logger from "@/lib/logger"

const PATIENT_COUNT_VALUES = ["1-10", "11-30", "31-100", "Más de 100"] as const

const Schema = z.object({
  name:              z.string().min(2).max(120),
  email:             z.string().email(),
  professional_type: z.string().min(1).max(100),
  patient_count:     z.enum(PATIENT_COUNT_VALUES),
  ciudad:            z.string().min(1).max(120),
})

const CALENDLY_URL = "https://calendly.com/foodmoodapp"
const ONEPAGER_URL = "https://www.food-mood.app/food-mood-pro.pdf"

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }) }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos incompletos", issues: parsed.error.flatten() }, { status: 422 })
  }

  const { name, email, professional_type, patient_count, ciudad } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: dbError } = await supabase
    .from("early_access_requests")
    .insert({ name, email, professional_type, patient_count, ciudad })

  if (dbError) {
    logger.error({ dbError, email }, "early-access: error guardando solicitud")
    return NextResponse.json({ error: "No se pudo guardar. Inténtalo de nuevo." }, { status: 500 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@food-mood.app"
  const adminEmail = process.env.ADMIN_EMAIL

  if (resendKey) {
    const resend = new Resend(resendKey)
    const calendlyPrefilled = `${CALENDLY_URL}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`

    // Email de confirmación al profesional
    resend.emails.send({
      from:    `Food·Mood Pro <${fromEmail}>`,
      to:      email,
      subject: "Tu demo con Food·Mood Pro — lo que veremos juntas",
      html: confirmationHtml(name, calendlyPrefilled),
    }).catch(e => logger.warn({ e }, "early-access: fallo enviando email de confirmación"))

    // Notificación interna al equipo
    if (adminEmail) {
      resend.emails.send({
        from:    fromEmail,
        to:      adminEmail,
        subject: `[Food·Mood Pro] Nueva solicitud — ${name} (${ciudad})`,
        html: `
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Especialidad:</strong> ${professional_type}</p>
          <p><strong>Pacientes:</strong> ${patient_count}</p>
          <p><strong>Ciudad:</strong> ${ciudad}</p>
          <p><a href="${calendlyPrefilled}">Abrir Calendly pre-rellenado →</a></p>
        `,
      }).catch(e => logger.warn({ e }, "early-access: fallo enviando notificación interna"))
    }
  }

  logger.info({ email, professional_type, patient_count, ciudad }, "early-access: solicitud registrada")
  return NextResponse.json({ ok: true })
}

function confirmationHtml(name: string, calendlyUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a0d14;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#6B2737;padding:28px 40px;">
          <p style="margin:0;font-size:11px;letter-spacing:3px;color:rgba(245,240,232,0.6);text-transform:uppercase;">Food·Mood Pro</p>
          <h1 style="margin:8px 0 0;font-size:22px;color:#F5F0E8;font-weight:600;">Hola, ${name}</h1>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:32px 40px 24px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:rgba(245,240,232,0.85);">
            Hemos recibido tu solicitud. Antes de que nos veamos, aquí tienes un resumen de lo que Food·Mood Pro puede hacer en tu consulta — para que la demo sea una presentación personalizada, no una llamada de descubrimiento.
          </p>
        </td></tr>

        <!-- One-pager en HTML -->
        <tr><td style="padding:0 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid rgba(255,107,53,0.2);">

            <tr><td style="background:rgba(255,107,53,0.12);padding:20px 24px;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;color:#FF6B35;text-transform:uppercase;font-family:system-ui,sans-serif;">Propuesta de valor · Resumen ejecutivo</p>
            </td></tr>

            <tr><td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr><td style="padding-bottom:20px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FF6B35;font-family:system-ui,sans-serif;">01 · El problema que resolvemos</p>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(245,240,232,0.75);font-family:system-ui,sans-serif;">
                    El 80 % de los pacientes con dificultades alimentarias tiene un componente emocional que no queda registrado entre sesiones. Tu historial clínico captura lo que ocurre en consulta; Food·Mood Pro captura lo que ocurre fuera de ella.
                  </p>
                </td></tr>

                <tr><td style="padding-bottom:20px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FF6B35;font-family:system-ui,sans-serif;">02 · Qué hacen tus pacientes</p>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(245,240,232,0.75);font-family:system-ui,sans-serif;">
                    60 segundos al día: registran hambre física vs. emocional, estado del sistema nervioso, pensamiento automático y emoción dominante. Sin app adicional en iOS · Añadible como PWA en 10 segundos.
                  </p>
                </td></tr>

                <tr><td style="padding-bottom:20px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FF6B35;font-family:system-ui,sans-serif;">03 · Qué ves tú</p>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(245,240,232,0.75);font-family:system-ui,sans-serif;">
                    Un panel profesional con: paleta emocional semanal, correlaciones comida-emoción, patrones de tensión del sistema nervioso, adherencia a las tareas que asignas entre sesiones. Tiempo de lectura antes de sesión: &lt; 2 minutos.
                  </p>
                </td></tr>

                <tr><td style="padding-bottom:20px;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FF6B35;font-family:system-ui,sans-serif;">04 · Frameworks clínicos integrados</p>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(245,240,232,0.75);font-family:system-ui,sans-serif;">
                    Teoría Polivagal (Porges) · Granularidad emocional (Barrett) · Psiconutrición conductual · Interoception-informed therapy. Los registros del paciente están diseñados con lenguaje clínico, no de bienestar general.
                  </p>
                </td></tr>

                <tr><td style="padding-bottom:0;">
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FF6B35;font-family:system-ui,sans-serif;">05 · Seguridad y cumplimiento</p>
                  <p style="margin:0;font-size:13px;line-height:1.65;color:rgba(245,240,232,0.75);font-family:system-ui,sans-serif;">
                    RGPD desde el diseño · Cifrado AES-256 en reposo · Hosting en infraestructura europea (eu-west) · Sin acceso de terceros a datos de pacientes · IA transparente (Art. 50 EU AI Act).
                  </p>
                </td></tr>

              </table>
            </td></tr>

          </table>
        </td></tr>

        <!-- PDF link -->
        <tr><td style="padding:0 40px 24px;">
          <p style="margin:0;font-size:13px;color:rgba(245,240,232,0.55);font-family:system-ui,sans-serif;">
            ¿Prefieres leerlo en PDF?
            <a href="${ONEPAGER_URL}" style="color:#FF6B35;text-decoration:underline;">Descarga el one-pager →</a>
          </p>
        </td></tr>

        <!-- CTA Calendly -->
        <tr><td style="padding:0 40px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid rgba(90,155,138,0.3);background:rgba(90,155,138,0.08);">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#5A9B8A;font-family:system-ui,sans-serif;">Elige tu horario</p>
              <p style="margin:0 0 16px;font-size:13px;color:rgba(245,240,232,0.7);font-family:system-ui,sans-serif;">
                15 minutos · Sin permanencia · Sin tarjeta de crédito
              </p>
              <a href="${calendlyUrl}" style="display:inline-block;background:#FF6B35;color:#0f0a0d;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;font-family:system-ui,sans-serif;">
                Reservar mi demo →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.3);font-family:system-ui,sans-serif;">
            Food·Mood Pro · Para profesionales de la salud alimentaria y emocional ·
            <a href="https://www.food-mood.app" style="color:rgba(245,240,232,0.3);">food-mood.app</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
