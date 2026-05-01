import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Aviso Legal | Food·Mood",
  description: "Información legal del titular del sitio web food-mood.app.",
  robots: { index: false, follow: false },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-serif text-aubergine-dark">{title}</h2>
      <div className="flex flex-col gap-3 text-aubergine-dark/70 font-light leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  )
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        <header className="flex flex-col gap-6 mb-16 md:mb-20">
          <Link href="/" className="font-serif text-xl font-semibold text-aubergine-dark inline-block mb-4 transition-opacity hover:opacity-70">
            Food<span className="text-[#D4AF37]">·</span>Mood
          </Link>
          <div className="h-px bg-[#D4AF37] opacity-40 w-16 mb-2" />
          <h1 className="text-4xl md:text-5xl font-serif text-aubergine-dark leading-tight">
            Información Legal
          </h1>
          <p className="text-lg text-aubergine-dark/70 font-light leading-relaxed mt-4">
            En cumplimiento de la Directiva 2000/31/CE sobre comercio electrónico y la normativa aplicable de la Unión Europea, se facilita la siguiente información sobre el titular de este sitio web.
          </p>
        </header>

        <main className="flex flex-col gap-14 md:gap-16">

          <Section title="1. Datos identificativos del titular">
            <p>
              <strong className="font-semibold text-aubergine-dark">Denominación social:</strong>{" "}
              [NOMBRE] OÜ{" "}
              <span className="text-aubergine-dark/40 text-sm">(pendiente de constitución)</span>
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Forma jurídica:</strong>{" "}
              Osaühing (OÜ) — sociedad de responsabilidad limitada constituida conforme al Derecho estonio
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Número de registro (registrikood):</strong>{" "}
              [PENDIENTE — Äriregister de Estonia]
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Número de IVA intracomunitario:</strong>{" "}
              EE[PENDIENTE]
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Domicilio social:</strong>{" "}
              [DIRECCIÓN], Tallinn, Estonia
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Correo electrónico:</strong>{" "}
              <a href="mailto:info@food-mood.app" className="text-aubergine underline hover:opacity-70 transition-opacity">
                info@food-mood.app
              </a>
            </p>
            <p>
              <strong className="font-semibold text-aubergine-dark">Sitio web:</strong>{" "}
              <a href="https://www.food-mood.app" className="text-aubergine underline hover:opacity-70 transition-opacity">
                www.food-mood.app
              </a>
            </p>
          </Section>

          <Section title="2. Objeto del sitio web">
            <p>
              Food·Mood es una plataforma digital de nutrición emocional que ofrece recomendaciones de recetas funcionales basadas en la ciencia del eje microbiota-intestino-cerebro. Su contenido tiene carácter exclusivamente divulgativo y no constituye diagnóstico médico, tratamiento terapéutico ni asesoramiento nutricional personalizado.
            </p>
            <p>
              Para cualquier cuestión de salud, consulte siempre a un profesional sanitario cualificado.
            </p>
          </Section>

          <Section title="3. Ley aplicable y jurisdicción">
            <p>
              Esta plataforma está operada por una sociedad constituida en Estonia, Estado miembro de la Unión Europea. La relación entre el usuario y Food·Mood se rige por el Derecho estonio, sin perjuicio de las normas de protección al consumidor que resulten aplicables en el país de residencia del usuario conforme a la Directiva 2011/83/UE sobre derechos de los consumidores.
            </p>
            <p>
              El Reglamento General de Protección de Datos (RGPD / GDPR) es de aplicación plena al tratamiento de datos personales realizado por esta plataforma.
            </p>
            <p>
              Para la resolución de litigios en línea, los consumidores de la UE pueden acceder a la plataforma ODR de la Comisión Europea:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aubergine underline hover:opacity-70 transition-opacity"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </Section>

          <Section title="4. Propiedad intelectual">
            <p>
              Todos los contenidos del sitio web — textos, imágenes, diseño, código fuente, marca y logotipo — son propiedad de [NOMBRE] OÜ o de terceros que han autorizado su uso, y están protegidos por la legislación de propiedad intelectual e industrial aplicable.
            </p>
            <p>
              Queda prohibida su reproducción, distribución o comunicación pública sin autorización escrita previa del titular.
            </p>
          </Section>

          <Section title="5. Limitación de responsabilidad">
            <p>
              Food·Mood no garantiza la disponibilidad continua del servicio ni la ausencia de errores en los contenidos. No se responsabiliza de los daños derivados del uso del sitio web, de enlaces a terceros, ni de interrupciones técnicas ajenas a su control.
            </p>
          </Section>

          <Section title="6. Modificaciones">
            <p>
              Nos reservamos el derecho a actualizar esta información en cualquier momento. Los cambios serán efectivos desde su publicación.
            </p>
            <p className="text-aubergine-dark/40 text-sm">Última actualización: abril de 2026</p>
          </Section>

        </main>

        <footer className="mt-20 pt-8 border-t border-aubergine-dark/10 flex flex-wrap gap-6 text-sm text-aubergine-dark/40">
          <Link href="/terminos" className="hover:text-aubergine-dark transition-colors">Términos de uso</Link>
          <Link href="/privacidad" className="hover:text-aubergine-dark transition-colors">Política de privacidad</Link>
          <Link href="/" className="hover:text-aubergine-dark transition-colors">Volver al inicio</Link>
        </footer>

      </div>
    </div>
  )
}
