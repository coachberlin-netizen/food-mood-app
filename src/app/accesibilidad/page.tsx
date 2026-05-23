import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Accesibilidad y modo offline | Food·Mood",
  description:
    "Cómo usar Food·Mood sin WiFi, en modo oscuro, con letra grande o con lectores de pantalla. Diseñado para funcionar en la cocina.",
}

const DARK  = "#2d0f16"
const GOLD  = "#C9A84C"
const CREAM = "#F5F0E8"

export default function AccesibilidadPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        <Link
          href="/"
          className="inline-block text-sm font-medium mb-10 transition-opacity hover:opacity-60"
          style={{ color: `${DARK}88` }}
        >
          ← Food·Mood
        </Link>

        <h1
          className="font-serif text-4xl md:text-5xl leading-tight mb-4"
          style={{ color: DARK }}
        >
          Diseñada para usarse<br />en la cocina.
        </h1>
        <p
          className="text-base font-light leading-relaxed mb-14"
          style={{ color: `${DARK}99` }}
        >
          Con las manos mojadas, la pantalla a plena luz, de noche, o sin WiFi.
          Aquí explicamos qué funciona y cómo activarlo.
        </p>

        {/* ── Offline ── */}
        <section id="offline" className="mb-14">
          <h2 className="font-serif text-2xl mb-6" style={{ color: DARK }}>
            📵 Qué funciona sin WiFi
          </h2>

          <div className="space-y-3 mb-6">
            {[
              {
                label: "El test de mood completo",
                detail: "Funciona 100% offline — todas las preguntas y el cálculo de tu paleta son locales.",
                ok: true,
              },
              {
                label: "Tu resultado y paleta emocional",
                detail: "Se guardan en tu móvil. Los ves aunque no haya red.",
                ok: true,
              },
              {
                label: "El catálogo de recetas",
                detail: "Las recetas base y sus imágenes se descargan la primera vez que abres la app. Después las tienes offline.",
                ok: true,
              },
              {
                label: "Recetas personalizadas por IA",
                detail: "Necesitan conexión — la IA genera la receta en tiempo real.",
                ok: false,
              },
              {
                label: "Tu historial emocional",
                detail: "Necesita conexión para sincronizarse desde el servidor.",
                ok: false,
              },
              {
                label: "El asistente FOOD-MOOD Guide",
                detail: "Necesita conexión — las respuestas se generan en tiempo real.",
                ok: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl p-4"
                style={{
                  backgroundColor: item.ok ? "rgba(74,124,89,0.07)" : "rgba(107,39,55,0.05)",
                  border: `1px solid ${item.ok ? "rgba(74,124,89,0.15)" : "rgba(107,39,55,0.1)"}`,
                }}
              >
                <span
                  className="text-lg shrink-0 mt-0.5"
                  aria-label={item.ok ? "Funciona offline" : "Necesita conexión"}
                >
                  {item.ok ? "✓" : "~"}
                </span>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: DARK }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-light" style={{ color: `${DARK}80` }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}80` }}>
            Food·Mood es una PWA (Progressive Web App). Si la instalas en tu pantalla de inicio
            desde el navegador, carga incluso sin red y sin ocupar espacio como una app nativa.
          </p>
        </section>

        {/* ── Accesibilidad visual ── */}
        <section id="pantalla" className="mb-14">
          <h2 className="font-serif text-2xl mb-6" style={{ color: DARK }}>
            👁 Ajustes de pantalla
          </h2>
          <p className="text-sm font-light leading-relaxed mb-5" style={{ color: `${DARK}99` }}>
            El botón ♿ en la esquina inferior izquierda abre el panel de accesibilidad.
            Tus preferencias se guardan y se aplican en cada visita.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: "🌙",
                title: "Modo oscuro",
                body: "Invierte la paleta de colores para cocinar de noche sin deslumbrarte. Reduce el cansancio ocular en entornos con poca luz.",
              },
              {
                icon: "Aa",
                title: "Letra grande",
                body: "Sube el tamaño base de texto a 18px (desde 16px). Toda la interfaz escala proporcionalmente, incluyendo instrucciones de receta.",
              },
              {
                icon: "◑",
                title: "Contraste alto",
                body: "Aumenta el contraste global al 150% para mayor legibilidad con luz solar directa o visión reducida.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl p-5"
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${DARK}12`,
                }}
              >
                <span
                  className="text-xl shrink-0 w-8 text-center font-mono font-bold"
                  style={{ color: GOLD }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: DARK }}>
                    {item.title}
                  </p>
                  <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}80` }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Lectores de pantalla ── */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
            🔊 Lectores de pantalla
          </h2>
          <p className="text-sm font-light leading-relaxed mb-4" style={{ color: `${DARK}99` }}>
            Food·Mood funciona con VoiceOver (iOS/macOS) y TalkBack (Android).
            La app usa HTML semántico, etiquetas{" "}
            <code
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: `${DARK}10`, color: DARK }}
            >
              aria-label
            </code>
            {" "}en botones interactivos y estructura de encabezados{" "}
            <code
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: `${DARK}10`, color: DARK }}
            >
              h1→h2→h3
            </code>
            {" "}jerárquica.
          </p>
          <ul className="space-y-2 text-sm font-light" style={{ color: `${DARK}99` }}>
            {[
              "El test de mood se puede completar por completo con navegación por teclado o gesto de lector de pantalla",
              "Los botones de acción tienen etiquetas descriptivas en texto, no solo iconos",
              "El formulario de login y registro usan labels visibles y asociados",
              "El asistente de voz del chat (micrófono) tiene aria-pressed para indicar estado",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: GOLD }} className="shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Pinch-to-zoom ── */}
        <section className="mb-14">
          <h2 className="font-serif text-2xl mb-4" style={{ color: DARK }}>
            🤌 Zoom del sistema
          </h2>
          <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}99` }}>
            La app no bloquea el pinch-to-zoom del sistema operativo.
            Si necesitas ampliar una receta o un gráfico, el gesto nativo de tu móvil funciona sin restricciones.
            Esto cumple con el criterio WCAG 2.1 — 1.4.4 (Resize Text).
          </p>
        </section>

        {/* ── WCAG ── */}
        <section
          className="rounded-2xl p-6 mb-10"
          style={{ backgroundColor: "#fff", border: `1px solid ${DARK}12` }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: `${DARK}55` }}
          >
            Declaración de conformidad
          </p>
          <p className="text-sm font-light leading-relaxed" style={{ color: `${DARK}CC` }}>
            Food·Mood trabaja hacia la conformidad con{" "}
            <strong className="font-medium">WCAG 2.1 Nivel AA</strong>. Somos una aplicación en
            desarrollo activo y mejoramos la accesibilidad de forma continua. Si encuentras alguna
            barrera, escríbenos — lo resolvemos en menos de 48h laborables.
          </p>
          <a
            href="mailto:info@food-mood.app?subject=Accesibilidad"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold transition-opacity hover:opacity-75"
            style={{ color: GOLD }}
          >
            Reportar una barrera de accesibilidad →
          </a>
        </section>

        <div
          className="text-xs font-light text-center"
          style={{ color: `${DARK}44` }}
        >
          <Link href="/privacidad" className="hover:underline" style={{ color: `${DARK}66` }}>
            Política de privacidad
          </Link>
          {" · "}
          <Link href="/" className="hover:underline" style={{ color: `${DARK}66` }}>
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  )
}
