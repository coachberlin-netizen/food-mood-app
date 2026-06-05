import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Acuerdo de Encargado del Tratamiento (DPA) | Food·Mood Pro",
  description: "Acuerdo de Encargado del Tratamiento para profesionales que usan Food·Mood Pro con datos de pacientes.",
  robots: { index: false, follow: false },
}

const BURGUNDY = "#6B2737"
const DARK = "#2d0f16"

export default function DpaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        <Link
          href="/pro/dashboard"
          className="inline-block text-sm font-medium mb-10 transition-opacity hover:opacity-60"
          style={{ color: `${DARK}99` }}
        >
          ← Portal profesional
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4" style={{ color: DARK }}>
          Acuerdo de Encargado<br />del Tratamiento
        </h1>
        <p className="text-sm font-light mb-2" style={{ color: `${DARK}80` }}>
          Data Processing Agreement (DPA) — Art. 28 RGPD
        </p>
        <p className="text-xs font-light mb-12" style={{ color: `${DARK}60` }}>
          Versión 1.0 — junio 2026 · Pendiente de revisión legal
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: DARK }}>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>1. Partes del acuerdo</h2>
            <p className="mb-2">
              <strong>Responsable del tratamiento:</strong> el profesional de salud que contrata el plan Food·Mood Pro
              y trata datos de sus pacientes a través de la plataforma (en adelante, «el Responsable»).
            </p>
            <p>
              <strong>Encargado del tratamiento:</strong> Food·Mood OÜ, sociedad estonia constituida bajo la ley de
              la República de Estonia, con domicilio a efectos de notificaciones en{" "}
              <a href="mailto:coachberlin@gmail.com" className="underline hover:opacity-70">coachberlin@gmail.com</a>{" "}
              (en adelante, «Food·Mood» o «el Encargado»).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>2. Objeto y duración</h2>
            <p className="mb-2">
              El presente acuerdo regula el tratamiento de datos personales de pacientes que el Responsable
              introduce o genera en la plataforma Food·Mood Pro durante la vigencia de su suscripción activa.
            </p>
            <p>
              El acuerdo entra en vigor en el momento de la primera activación del plan Pro y se extingue
              automáticamente al cancelar la suscripción, momento en el que el Encargado suprimirá o anonimizará
              los datos en el plazo máximo de 30 días, salvo obligación legal de conservación.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>3. Naturaleza y finalidad del tratamiento</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Almacenamiento de registros emocionales e interoceptivos del paciente</li>
              <li>Análisis de patrones de estado emocional para soporte clínico</li>
              <li>Generación de sugerencias nutricionales personalizadas mediante IA</li>
              <li>Visualización de datos en el panel del profesional</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>4. Categorías de datos y personas afectadas</h2>
            <p className="mb-2">
              <strong>Datos tratados:</strong> identificador pseudónimo del paciente, registros de estado emocional
              (texto libre y etiquetas estructuradas), datos de ingesta nutricional, marcas de tiempo.
            </p>
            <p className="mb-2">
              <strong>Datos especiales (Art. 9 RGPD):</strong> los registros pueden contener información relativa
              a la salud. El Responsable es el único que conoce la identidad real del paciente y es responsable
              de obtener el consentimiento explícito conforme al Art. 9.2.a RGPD antes de introducir datos
              en la plataforma.
            </p>
            <p>
              <strong>Personas afectadas:</strong> pacientes del Responsable que han aceptado expresamente
              el uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>5. Obligaciones del Encargado (Food·Mood)</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Tratar los datos únicamente según las instrucciones documentadas del Responsable.</li>
              <li>Garantizar que las personas con acceso a los datos están sujetas a obligación de confidencialidad.</li>
              <li>Aplicar las medidas técnicas y organizativas del Art. 32 RGPD: cifrado en tránsito (TLS 1.3) y en reposo, control de acceso basado en roles, auditoría de accesos.</li>
              <li>No subcontratar a terceros encargados sin autorización previa por escrito del Responsable, salvo los subencargados actuales indicados en el Anexo A.</li>
              <li>Asistir al Responsable en el ejercicio de derechos de los interesados (acceso, rectificación, supresión, portabilidad) en el plazo de 72 horas desde la solicitud.</li>
              <li>Notificar cualquier brecha de seguridad en el plazo máximo de 72 horas desde su detección.</li>
              <li>Suprimir o devolver todos los datos al finalizar el contrato, según elija el Responsable.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>6. Obligaciones del Responsable</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Obtener base jurídica válida (consentimiento u otro supuesto del Art. 6 y 9 RGPD) antes de introducir datos de pacientes.</li>
              <li>Informar a sus pacientes del tratamiento conforme al Art. 13 RGPD.</li>
              <li>No introducir datos de menores de 16 años sin consentimiento parental verificado.</li>
              <li>Comunicar de inmediato cualquier instrucción de supresión o rectificación de datos de un paciente.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>7. Transferencias internacionales</h2>
            <p>
              Los datos se almacenan en servidores de Supabase ubicados en la Unión Europea (región eu-central-1).
              Las transferencias a proveedores de IA (Anthropic) se realizan con cláusulas contractuales tipo
              aprobadas por la Comisión Europea. No se realizan transferencias a países sin decisión de adecuación
              sin garantías adicionales.{" "}
              <span className="italic opacity-60">[PENDIENTE: verificar SCCs actualizadas con Anthropic]</span>
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>Anexo A — Subencargados actuales</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BURGUNDY}30` }}>
                    <th className="text-left py-2 pr-4 font-semibold">Proveedor</th>
                    <th className="text-left py-2 pr-4 font-semibold">Finalidad</th>
                    <th className="text-left py-2 font-semibold">País</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: `${BURGUNDY}15` }}>
                  {[
                    ["Supabase Inc.", "Base de datos y autenticación", "UE (Frankfurt)"],
                    ["Anthropic PBC", "Procesamiento IA de registros", "EE.UU. (SCCs)"],
                    ["Vercel Inc.", "Infraestructura de aplicación", "EE.UU. (SCCs)"],
                    ["Resend Inc.", "Notificaciones por email", "EE.UU. (SCCs)"],
                    ["Stripe Inc.", "Procesamiento de pagos", "EE.UU. (SCCs)"],
                  ].map(([name, purpose, country]) => (
                    <tr key={name}>
                      <td className="py-2 pr-4">{name}</td>
                      <td className="py-2 pr-4" style={{ color: `${DARK}80` }}>{purpose}</td>
                      <td className="py-2" style={{ color: `${DARK}80` }}>{country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-3" style={{ color: BURGUNDY }}>8. Ley aplicable y resolución de conflictos</h2>
            <p>
              El presente acuerdo se rige por el Reglamento (UE) 2016/679 (RGPD) y la ley estonia aplicable.
              Las partes intentarán resolver cualquier controversia de forma amistosa. En caso de litigio,
              los tribunales competentes serán los de Tallin (Estonia), salvo que la normativa de consumo
              aplicable al Responsable establezca otro fuero imperativo.
            </p>
          </section>

          <section className="pt-4 border-t" style={{ borderColor: `${BURGUNDY}20` }}>
            <p className="text-xs" style={{ color: `${DARK}60` }}>
              Al activar el plan Food·Mood Pro, el Responsable acepta los términos del presente acuerdo.
              Para cualquier cuestión relacionada con el tratamiento de datos, contacta con el DPO en{" "}
              <a href="mailto:coachberlin@gmail.com" className="underline hover:opacity-70">
                coachberlin@gmail.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
