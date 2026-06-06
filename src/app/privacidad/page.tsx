import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Privacidad | Food·Mood",
  description: "Tus datos se quedan en servidores de la UE. No los vendemos. Puedes borrarlos cuando quieras.",
}

const GOLD = "#FF6B35"
const BURGUNDY = "#6B2737"
const DARK = "#2d0f16"

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        {/* Back */}
        <Link
          href="/"
          className="inline-block text-sm font-medium mb-10 transition-opacity hover:opacity-60"
          style={{ color: `${DARK}99` }}
        >
          ← Food·Mood
        </Link>

        {/* Header */}
        <h1
          className="font-serif text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: DARK }}
        >
          Tu privacidad,<br />en palabras normales.
        </h1>
        <p className="text-base font-light mb-12" style={{ color: `${DARK}99` }}>
          Última actualización: mayo 2026
        </p>

        {/* Las tres promesas — destacadas */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: "🇪🇺",
              title: "Datos en la UE",
              body: "Tu información vive en servidores de Irlanda (UE). No sale de Europa sin que lo sepas.",
            },
            {
              icon: "🚫",
              title: "No los vendemos",
              body: "Nunca hemos vendido datos de usuarios. Nunca lo haremos. No es nuestro modelo de negocio.",
            },
            {
              icon: "🗑️",
              title: "Los borras tú",
              body: "Puedes eliminar tu cuenta y todos tus datos desde tu Perfil. Sin formularios, sin esperas.",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 flex flex-col gap-2"
              style={{ backgroundColor: "#fff", border: `1px solid ${DARK}12` }}
            >
              <span className="text-2xl">{p.icon}</span>
              <p className="font-semibold text-sm" style={{ color: DARK }}>{p.title}</p>
              <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}80` }}>{p.body}</p>
            </div>
          ))}
        </div>

        {/* Secciones */}
        <div className="space-y-12">

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Qué guardamos de ti
            </h2>
            <ul className="space-y-2 text-base font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
              {[
                "Tu email y contraseña (cifrados — ni nosotros vemos la contraseña)",
                "Tus respuestas al test emocional y tu paleta de colores",
                "El historial de tu paleta emocional (si tienes cuenta)",
                "Tus datos de pago los gestiona Stripe directamente — nosotros no vemos ni guardamos tu número de tarjeta",
                "Si te suscribes al boletín, tu email para enviártelo",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: GOLD }} className="shrink-0 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Para qué usamos esos datos
            </h2>
            <ul className="space-y-2 text-base font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
              {[
                "Darte acceso a tu cuenta y recordar tu progreso",
                "Generar recetas y respuestas de la IA ajustadas a tu estado emocional",
                "Enviarte el boletín si te suscribiste (siempre puedes darte de baja con un clic)",
                "Mejorar la app con datos agregados y anónimos — nunca ligados a tu nombre",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: GOLD }} className="shrink-0 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Con quién compartimos datos (y por qué)
            </h2>
            <p className="text-base font-light leading-relaxed mb-5" style={{ color: `${DARK}CC` }}>
              No vendemos ni cedemos tus datos a anunciantes. Solo trabajamos con proveedores técnicos necesarios para que la app funcione:
            </p>
            <div className="space-y-3">
              {[
                {
                  who: "Supabase",
                  what: "Base de datos y autenticación",
                  where: "Irlanda (UE)",
                  link: "https://supabase.com/privacy",
                },
                {
                  who: "Stripe",
                  what: "Procesamiento de pagos",
                  where: "EE.UU. — PCI DSS nivel 1",
                  link: "https://stripe.com/es/privacy",
                },
                {
                  who: "Anthropic",
                  what: "IA que genera recetas y respuestas del asistente",
                  where: "EE.UU. — tus mensajes se procesan para generar la respuesta y no se usan para entrenar modelos sin tu consentimiento",
                  link: "https://www.anthropic.com/privacy",
                },
                {
                  who: "Vercel",
                  what: "Alojamiento web y analítica anónima de uso",
                  where: "EE.UU. — analítica sin cookies ni identificadores personales",
                  link: "https://vercel.com/legal/privacy-policy",
                },
                {
                  who: "Resend",
                  what: "Envío de emails transaccionales",
                  where: "EE.UU.",
                  link: "https://resend.com/privacy",
                },
              ].map((s) => (
                <div
                  key={s.who}
                  className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4"
                  style={{ backgroundColor: "#fff", border: `1px solid ${DARK}10` }}
                >
                  <p className="font-semibold text-sm shrink-0 w-28" style={{ color: DARK }}>{s.who}</p>
                  <div className="flex-1">
                    <p className="text-sm font-light" style={{ color: `${DARK}CC` }}>{s.what}</p>
                    <p className="text-xs mt-0.5" style={{ color: `${DARK}60` }}>{s.where}</p>
                  </div>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium shrink-0 underline underline-offset-2 hover:no-underline"
                    style={{ color: GOLD }}
                  >
                    Su política →
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Tus derechos (son sencillos)
            </h2>
            <ul className="space-y-2 text-base font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
              {[
                "Ver qué guardamos de ti — escríbenos y te lo enviamos en 72h",
                "Corregir cualquier dato incorrecto",
                "Borrar tu cuenta y todos tus datos — desde tu Perfil, con un solo botón",
                "Oponerte a que usemos tus datos para análisis — escríbenos",
                "Exportar tus datos en formato legible — escríbenos",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span style={{ color: GOLD }} className="shrink-0 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href="/configuracion"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: BURGUNDY, color: "#F5F0E8" }}
              >
                Ir a Configuración →
              </Link>
              <a
                href="mailto:info@food-mood.app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ border: `1px solid ${DARK}22`, color: `${DARK}99` }}
              >
                Contactar por email
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Cookies
            </h2>
            <p className="text-base font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
              Usamos solo las cookies imprescindibles para que la sesión funcione. No hay cookies publicitarias ni de rastreo entre sitios. La analítica de uso es anónima (Vercel Analytics) y no usa cookies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
              Base legal y responsable
            </h2>
            <p className="text-base font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
              Food·Mood opera bajo el RGPD. El responsable del tratamiento es Food·Mood OÜ (Estonia). Para cualquier consulta sobre privacidad: <a href="mailto:info@food-mood.app" className="font-medium underline underline-offset-2" style={{ color: GOLD }}>info@food-mood.app</a>.
            </p>
          </section>

        </div>

        {/* Footer de la página */}
        <div
          className="mt-16 pt-8 text-xs font-light"
          style={{ borderTop: `1px solid ${DARK}15`, color: `${DARK}55` }}
        >
          Si tienes alguna duda que no está resuelta aquí, escríbenos. Respondemos en menos de 48h en días laborables.
        </div>

      </div>
    </div>
  )
}
