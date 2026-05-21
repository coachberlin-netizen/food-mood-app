"use client"

import Link from "next/link"
import { motion } from "framer-motion"

// ── Design tokens ──────────────────────────────────────────────────────────────
const BURG  = "#6B2737"
const CREAM = "#F5F0E8"
const GOLD  = "#C9A84C"

// ── Mood palette ───────────────────────────────────────────────────────────────
const MOODS = [
  { id: "activacion", label: "Activación",  color: "#E8A87C", desc: "cuando necesitas arrancar sin sobreactivarte." },
  { id: "calma",      label: "Calma",        color: "#7EC8C8", desc: "cuando el sistema nervioso pide bajar revoluciones." },
  { id: "focus",      label: "Foco",         color: "#F4E285", desc: "cuando necesitas atención clara para algo concreto." },
  { id: "social",     label: "Social",       color: "#F4A7B9", desc: "cuando vas a estar con gente y quieres llegar bien." },
  { id: "reset",      label: "Reset",        color: "#B8A9C9", desc: "cuando algo necesita limpiarse o reorganizarse." },
  { id: "confort",    label: "Confort",      color: "#D4A574", desc: "cuando lo que toca es abrigo y descanso." },
]

// ── TOC entries ────────────────────────────────────────────────────────────────
const TOC = [
  { id: "el-test",          label: "01 · El test"         },
  { id: "la-paleta",        label: "02 · La paleta"       },
  { id: "la-recomendacion", label: "03 · La recomendación" },
  { id: "dia-a-dia",        label: "04 · Día a día"       },
  { id: "el-rigor",         label: "05 · El rigor"        },
  { id: "lo-que-no-hacemos",label: "06 · Los límites"     },
  { id: "seguridad",        label: "07 · Seguridad"       },
]

// ── Reusable pieces ────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: `${BURG}60` }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[28px] md:text-[36px] leading-[1.2] font-black mb-6" style={{ color: BURG }}>
      {children}
    </h2>
  )
}

function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[15px] md:text-[16px] font-light leading-[1.8] space-y-4 ${className}`} style={{ color: `${BURG}bb` }}>
      {children}
    </div>
  )
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <p>
      <span style={{ color: BURG, marginRight: "0.6em" }}>—</span>
      {children}
    </p>
  )
}

function Divider() {
  return <div className="border-t my-16" style={{ borderColor: `${BURG}12` }} />
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ComoFuncionaPage() {
  return (
    <main style={{ backgroundColor: CREAM, minHeight: "100vh" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Eyebrow>El método</Eyebrow>
            <h1 className="font-serif text-[36px] md:text-[52px] lg:text-[60px] leading-[1.1] font-black mb-6" style={{ color: BURG }}>
              Cómo te acompaña Food·Mood, en concreto.
            </h1>
            <p className="text-[17px] md:text-[19px] font-light leading-[1.7] max-w-2xl" style={{ color: `${BURG}99` }}>
              Sin promesas vagas. Esto es exactamente lo que pasa cuando abres la app por primera vez,
              y lo que pasa cuando vuelves al día siguiente.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ LAYOUT: TOC + CONTENT ════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 pb-32 flex gap-16 items-start">

        {/* TOC — desktop only, sticky */}
        <nav className="hidden lg:block w-48 shrink-0 sticky top-28 self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-5" style={{ color: `${BURG}40` }}>
            Secciones
          </p>
          <ul className="space-y-3">
            {TOC.map(t => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="text-[12px] font-light leading-snug block transition-colors hover:text-[#6B2737]"
                  style={{ color: `${BURG}55` }}
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* ── En resumen ─────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 md:p-10 mb-16"
            style={{ backgroundColor: `${BURG}08`, border: `1px solid ${BURG}10` }}
          >
            <h3 className="font-serif text-[13px] uppercase tracking-[0.2em] font-bold mb-6" style={{ color: `${BURG}60` }}>
              En resumen.
            </h3>
            <div className="space-y-3 mb-8">
              {[
                "Te preguntamos cómo te sientes hoy y qué te preocupa.",
                "Te proponemos una receta, una microacción y una explicación corta del porqué.",
                "Día a día aprendemos juntas qué te sienta bien y qué no.",
              ].map((frase, i) => (
                <p key={i} className="text-[17px] md:text-[19px] font-light leading-[1.6]" style={{ color: BURG }}>
                  {frase}
                </p>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/test"
                className="inline-block px-7 py-3 rounded-full text-[13px] font-semibold transition-all hover:brightness-105"
                style={{ backgroundColor: BURG, color: CREAM }}
              >
                Hacer el test ahora
              </Link>
              <a href="#el-test" className="text-[13px] font-light" style={{ color: `${BURG}60` }}>
                o sigue leyendo ↓
              </a>
            </div>
          </motion.section>

          {/* ── 01 El test ─────────────────────────────────────────────────── */}
          <motion.section
            id="el-test"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>01 · El test</Eyebrow>
            <SectionTitle>Dos minutos. Sin tecnicismos.</SectionTitle>
            <Body>
              <p>
                El test inicial recoge la mínima información necesaria para que la app deje de tratarte
                como “una usuaria genérica” y empiece a tratarte como tú.
              </p>
              <Item>Cómo te sientes hoy, en tus palabras o eligiendo entre mezclas —no una sola etiqueta: una paleta.</Item>
              <Item>Tu edad y la etapa hormonal en la que estás, si la sabes.</Item>
              <Item>Síntomas que arrastras y que te están pesando ahora mismo.</Item>
              <Item>Alergias, intolerancias y medicación —para que la app no te proponga nada que te haga daño.</Item>
              <Item>Si quieres y tienes wearable, conectamos tu sueño, tu HRV y tu actividad.</Item>
              <p className="pt-2" style={{ color: `${BURG}80` }}>
                No te pedimos peso, no te pedimos talla, no te pedimos foto. Y nada de esto se comparte con nadie fuera del equipo que diseña los protocolos.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── 02 La paleta ────────────────────────────────────────────────── */}
          <motion.section
            id="la-paleta"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>02 · Tu paleta emocional</Eyebrow>
            <SectionTitle>No eres “una mujer ansiosa”. No eres “una mujer cansada”. Eres una mezcla, y la mezcla cambia.</SectionTitle>
            <Body>
              <p>
                La mayoría de las apps te piden que elijas una etiqueta única —contenta, triste, energética, cansada—.
                Food·Mood no funciona así. La realidad emocional, sobre todo en perimenopausia, no es una etiqueta: es una paleta.
                Puedes estar a la vez con poca energía y con la cabeza acelerada. Puedes estar tranquila y triste a la vez.
                Puedes necesitar calma y a la vez no querer apagarte del todo.
              </p>
              <p>Seis estados componen la paleta Food·Mood. Acompañamos tu mezcla particular de hoy y diseñamos en consecuencia:</p>
            </Body>

            {/* Mood grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 mb-6">
              {MOODS.map(m => (
                <div
                  key={m.id}
                  className="flex items-start gap-4 rounded-2xl p-5"
                  style={{ backgroundColor: `${m.color}18`, border: `1px solid ${m.color}30` }}
                >
                  <div className="w-3 h-3 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: m.color }} />
                  <div>
                    <p className="text-[14px] font-semibold mb-1" style={{ color: BURG }}>{m.label}</p>
                    <p className="text-[13px] font-light leading-snug" style={{ color: `${BURG}80` }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Body>
              <p style={{ color: `${BURG}80` }}>
                Cada estado conecta con palancas distintas de tu fisiología —sueño, microbiota, hormonas, inflamación—.
                Acompañamos esa traducción a comida y rituales que te apetezcan, no a una lista de prohibiciones.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── 03 La recomendación ─────────────────────────────────────────── */}
          <motion.section
            id="la-recomendacion"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>03 · La recomendación</Eyebrow>
            <SectionTitle>Cómo pasamos de “hoy estoy en Calma” a “esta noche, esta cena”.</SectionTitle>
            <Body>
              <p>Cuando registras tu estado del día, cruzamos tres cosas:</p>
              <Item>Tu paleta de hoy y los síntomas que arrastras.</Item>
              <Item>Tu perfil completo: edad, etapa hormonal, alergias, medicación, restricciones.</Item>
              <Item>La literatura científica más actualizada sobre qué alimentos y rituales conectan con lo que tu cuerpo te está pidiendo en este momento.</Item>
              <p className="pt-2">De ese cruce nace tu propuesta del día:</p>
              <Item>Una receta funcional, con su tiempo de preparación, sus ingredientes y sus pasos.</Item>
              <Item>Una microacción —respiración guiada, ventana de luz natural, paseo postprandial, lo que toque— que potencia el efecto de la receta.</Item>
              <Item>Una explicación corta del porqué: qué está haciendo lo que comes en tu sistema, sin clase de bioquímica.</Item>
              <p style={{ color: `${BURG}80` }}>
                Si la propuesta no te apetece —porque no tienes los ingredientes, porque ese sabor hoy no, porque has cambiado de planes—,
                nos lo dices y te proponemos otra cosa. Nos ajustamos a tu vida, no al revés.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── 04 Día a día ─────────────────────────────────────────────────── */}
          <motion.section
            id="dia-a-dia"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>04 · Día a día</Eyebrow>
            <SectionTitle>Cuanto más la usas, más te conocemos.</SectionTitle>
            <Body>
              <p>El primer día, la app te ofrece la mejor propuesta posible con lo que sabe de ti.</p>
              <p>
                A las dos semanas, empieza a notar patrones que tú sola difícilmente verías: que tus días Calma coinciden con cenas tardías;
                que duermes mejor los días que has tomado fermentos en la comida; que tu energía baja sistemáticamente los jueves.
              </p>
              <p>
                Al mes, las propuestas son más afinadas. Y la información empieza a serte útil más allá de la app:
                empiezas a entender por qué tu cuerpo responde como responde.
              </p>
              <p>
                Al cabo de 90 días —el tiempo que tu microbiota, la comunidad de bacterias que vive en tu intestino, tarda en reorganizarse—
                muchas usuarias notan cambios reales: el sueño se ha asentado un poco, la niebla mental afloja,
                las digestiones son más cómodas, los antojos vespertinos se han calmado.
              </p>
              <p style={{ color: `${BURG}70` }}>
                No prometemos eso. Lo decimos porque es lo que vemos. Tu cuerpo decide cuánto le sirve y a qué ritmo.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── 05 El rigor ──────────────────────────────────────────────────── */}
          <motion.section
            id="el-rigor"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>05 · El rigor detrás</Eyebrow>
            <SectionTitle>Por qué puedes confiar en lo que la app te dice.</SectionTitle>
            <Body>
              <p>
                Detrás de cada protocolo hay un equipo experto en perimenopausia, microbiota y longevidad.
                Diez años de literatura científica sobre eje intestino-cerebro —la conexión bidireccional entre lo que sientes
                y lo que ocurre en tu digestión—, hormonas femeninas, sueño, inflamación crónica y psicología nutricional
                están condensados en la base de conocimiento que la app consulta cada vez que te responde.
              </p>
              <p>Tres principios que nos importan:</p>
              <Item>Decimos siempre el nivel de evidencia. Lo que está respaldado por ensayos clínicos sólidos no es lo mismo que lo que está respaldado por estudios mecanísticos o por experiencia clínica acumulada. Te lo marcamos cuando aplica.</Item>
              <Item>No inventamos referencias. Si una propuesta no tiene respaldo claro, lo decimos. Si está en zona emergente, te avisamos.</Item>
              <Item>Revisamos cada protocolo antes de que llegue a ti. La IA aprende; el equipo experto supervisa. No es una caja negra.</Item>
              <p style={{ color: `${BURG}70` }}>
                Lo que la app no sustituye: a tu médica, a tu psicóloga, a tu nutricionista clínica si tienes condiciones que requieren seguimiento profesional.
                Acompañamos en paralelo. Cubrimos lo que muchas veces nadie cuida —tu día a día, en la cocina y en el cuerpo.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── 06 Lo que no hacemos ─────────────────────────────────────────── */}
          <motion.section
            id="lo-que-no-hacemos"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>06 · Los límites</Eyebrow>
            <SectionTitle>Lo que Food·Mood no va a hacer nunca.</SectionTitle>

            <div className="space-y-6">
              {[
                {
                  title: "No es una dieta.",
                  body: "No vas a contar calorías. No vas a contar macros. No vas a pesar comida. No vamos a ponerte objetivos de peso. No vamos a hablar de “perder kilos”, “operación bikini”, “antes y después”, “ser buena” o “ser mala” según lo que comas. Si has pasado por dietas que te dejaron peor, esto es justo lo contrario.",
                },
                {
                  title: "No promete milagros.",
                  body: "Lo que ofrecemos es acompañamiento real, basado en lo que la ciencia sabe hoy. Algunas cosas las sabemos mucho —fibra alimenta microbiota, fermentos diarios mejoran diversidad, sueño suficiente regula hormonas—. Otras menos. Te lo decimos cuando es así.",
                },
                {
                  title: "No diagnostica ni trata.",
                  body: "Si la app detecta señales de algo que necesita más que una receta —patrones de relación dañina con la comida, crisis emocional, síntomas que sugieren un problema médico activo—, no intenta resolverlo. Te lleva a quien sí puede ayudarte: profesional especializado, recursos clínicos, líneas de apoyo según el caso.",
                },
                {
                  title: "No te juzga por tu cuerpo.",
                  body: "Tu cuerpo en perimenopausia cambia. Lo respetamos. La app no se hace eco de la cultura del “antes y después”, del “recuperar tu cuerpo de los 30” ni de ninguna fantasía estética. La salud es lo que importa, y la salud se mide en cómo duermes, cómo digieres, cómo piensas, cómo te mueves —no en una báscula.",
                },
              ].map((bloque, i) => (
                <div key={i} className="rounded-2xl p-6 md:p-7" style={{ backgroundColor: `${BURG}06`, border: `1px solid ${BURG}0d` }}>
                  <p className="text-[15px] font-semibold mb-2" style={{ color: BURG }}>{bloque.title}</p>
                  <p className="text-[15px] font-light leading-[1.75]" style={{ color: `${BURG}99` }}>{bloque.body}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <Divider />

          {/* ── 07 Seguridad ─────────────────────────────────────────────────── */}
          <motion.section
            id="seguridad"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="scroll-mt-28"
          >
            <Eyebrow>07 · La capa de seguridad</Eyebrow>
            <SectionTitle>Cuando lo que necesitas no es una receta.</SectionTitle>
            <Body>
              <p>La app está diseñada para no hacer daño. Antes de cada propuesta, revisamos que:</p>
              <Item>Ningún ingrediente sea conflictivo con tus alergias o intolerancias.</Item>
              <Item>Ningún alimento interaccione mal con tu medicación —té verde con anticoagulantes, queso curado con ciertos antidepresivos, pomelo con estatinas, ese tipo de cruces que pocas apps revisan.</Item>
              <Item>Las propuestas sean apropiadas para tu estado: embarazo, lactancia, condiciones tiroideas, insuficiencia renal, síndrome del intestino irritable.</Item>
              <p>
                Y si lo que cuentas en el chat sugiere algo que va más allá del alcance de la app —una crisis emocional,
                señales de relación dañina con la comida, síntomas que necesitan revisión médica—, la app no te da una receta.
                Te dice con calidez que esto necesita acompañamiento profesional, y te orienta a recursos reales en tu zona.
              </p>
              <p className="font-medium" style={{ color: `${BURG}cc` }}>
                No somos tu psicóloga. No somos tu endocrina. Somos lo que va con ellas, día a día.
              </p>
            </Body>
          </motion.section>

          <Divider />

          {/* ── CTA final ────────────────────────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-3xl px-8 py-12 md:px-12 md:py-16 text-center"
            style={{ backgroundColor: BURG }}
          >
            <h2 className="font-serif text-[30px] md:text-[40px] font-black leading-[1.15] mb-4" style={{ color: CREAM }}>
              ¿Lista para probarlo?
            </h2>
            <p className="text-[15px] font-light leading-[1.7] mb-8 max-w-sm mx-auto" style={{ color: `${CREAM}99` }}>
              Dos minutos. Sin registro. Sin tarjeta de crédito.
              Si después de eso sientes que no es para ti, no pasa nada —te llevas un día con una receta diseñada
              para cómo estás hoy, y eso ya es algo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/test"
                className="inline-block px-8 py-4 rounded-full text-[14px] font-semibold transition-all hover:brightness-105"
                style={{ backgroundColor: GOLD, color: "#2d0f16" }}
              >
                Hacer el test gratis
              </Link>
              <Link
                href="/"
                className="text-[13px] font-light transition-colors hover:opacity-80"
                style={{ color: `${CREAM}60` }}
              >
                o vuelve al inicio →
              </Link>
            </div>
          </motion.section>

        </div>
      </div>
    </main>
  )
}
