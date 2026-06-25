"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Mail, Send, Loader2, CheckCircle2 } from "lucide-react"

// ─── Animaciones ───────────────────────────────────────────────────────────────

const fade    = { hidden: { opacity: 0, y: 18 },  visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {},                       visible: { transition: { staggerChildren: 0.08 } } }

// ─── Datos ─────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    id:    "food-mood",
    label: "Food & Mood",
    desc:  "La relación entre lo que comemos y cómo nos sentimos, con base en la conexión intestino-cerebro y la neurobiología del comportamiento.",
    color: "#FF6B35",
  },
  {
    id:    "stress-recovery",
    label: "Stress & Recovery",
    desc:  "Cortisol, eje HPA, regulación del sistema nervioso y nutrición adaptógena como palancas de recuperación y rendimiento sostenible.",
    color: "#5A9B8A",
  },
  {
    id:    "longevity-hospitality",
    label: "Longevity Hospitality",
    desc:  "Cómo los espacios de bienestar premium integran evidencia de longevidad en su propuesta de valor, su menú y su experiencia de cliente.",
    color: "#A07BBE",
  },
  {
    id:    "evidence-notes",
    label: "Evidence Notes",
    desc:  "Síntesis crítica de investigación emergente sobre nutrición, psicología del comportamiento y salud a largo plazo.",
    color: "#6B2737",
  },
  {
    id:    "protocol-lab",
    label: "Protocol Lab",
    desc:  "Protocolos aplicados, casos prácticos y diseño de experiencias basadas en evidencia para entornos clínicos y de hospitality.",
    color: "#C87D4F",
  },
]

const ARTICLES = [
  {
    pillar:      "Food & Mood",
    pillarColor: "#FF6B35",
    title:       "La comida no solo alimenta",
    desc:        "Cómo cada elección alimentaria comunica con el sistema nervioso, el estado emocional y la percepción del entorno.",
    readTime:    "8 min",
    tag:         "Fundamento",
  },
  {
    pillar:      "Longevity Hospitality",
    pillarColor: "#A07BBE",
    title:       "De spa menu a longevity menu",
    desc:        "El salto que están dando los mejores hoteles y retiros del mundo: de la oferta saludable a la propuesta de longevidad con evidencia.",
    readTime:    "10 min",
    tag:         "Aplicación",
  },
  {
    pillar:      "Evidence Notes",
    pillarColor: "#6B2737",
    title:       "Qué puede decir un hotel sobre longevidad sin prometer medicina",
    desc:        "El límite entre comunicar evidencia y hacer promesas médicas. Una guía práctica para espacios de bienestar.",
    readTime:    "6 min",
    tag:         "Guía práctica",
  },
  {
    pillar:      "Food & Mood",
    pillarColor: "#FF6B35",
    title:       "Hambre emocional sin simplificar",
    desc:        "Más allá del cliché: neurobiología, regulación emocional y contexto social del hambre emocional.",
    readTime:    "12 min",
    tag:         "Profundidad",
  },
]

const EVIDENCE_LEVELS = [
  {
    level:       "Evidencia sólida",
    color:       "#5A9B8A",
    bgColor:     "rgba(90,155,138,0.08)",
    borderColor: "rgba(90,155,138,0.25)",
    desc:        "Resultados consistentes en múltiples ensayos clínicos controlados o metaanálisis de calidad. Aplicable con alta confianza.",
  },
  {
    level:       "Evidencia prometedora",
    color:       "#FF6B35",
    bgColor:     "rgba(255,107,53,0.07)",
    borderColor: "rgba(255,107,53,0.22)",
    desc:        "Estudios de buena calidad con resultados reproducibles. Plausibilidad biológica clara. Aplicación matizada recomendada.",
  },
  {
    level:       "Evidencia emergente",
    color:       "#A07BBE",
    bgColor:     "rgba(160,123,190,0.07)",
    borderColor: "rgba(160,123,190,0.22)",
    desc:        "Investigación preliminar o mecanística. Interesante para explorar; insuficiente para recomendar de forma generalizada.",
  },
]

// ─── Formulario de captura de guía ─────────────────────────────────────────────

function GuideCapture() {
  const [email,  setEmail]  = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const r = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, source: "guide-longevidad" }),
      })
      setStatus(r.ok ? "ok" : "error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "ok") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-6 py-4 rounded-xl"
        style={{ backgroundColor: "rgba(90,155,138,0.15)", border: "1px solid rgba(90,155,138,0.3)" }}
      >
        <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#5A9B8A" }} />
        <span className="text-sm font-light" style={{ color: "rgba(245,240,232,0.85)" }}>
          Guía en camino. Revisa tu bandeja de entrada.
        </span>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="relative flex-1">
        <Mail
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "rgba(245,240,232,0.28)" }}
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{
            fontSize:         "16px",
            backgroundColor:  "rgba(255,255,255,0.07)",
            border:           "1px solid rgba(255,255,255,0.13)",
            color:            "#F5F0E8",
            caretColor:       "#FF6B35",
          }}
          className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all focus:border-[#FF6B35]/50"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 shrink-0"
        style={{ backgroundColor: "#FF6B35", color: "#0f0a0d" }}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>Descargar guía <Send className="w-3.5 h-3.5" /></>
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:col-span-2">Algo salió mal. Inténtalo de nuevo.</p>
      )}
    </form>
  )
}

// ─── Página ─────────────────────────────────────────────────────────────────────

export default function LabHomepage() {
  return (
    <main className="min-h-screen font-sans font-light" style={{ backgroundColor: "#F5F0E8" }}>

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section aria-label="Introducción" className="relative overflow-hidden" style={{ backgroundColor: "#0f0a0d" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: [
              "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(107,39,55,0.30) 0%, transparent 65%)",
              "radial-gradient(ellipse 40% 35% at 88% 85%, rgba(255,107,53,0.06) 0%, transparent 60%)",
            ].join(", "),
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-36 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div
              variants={fade}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8"
              style={{ backgroundColor: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "#FF6B35" }}>
                Food·Mood Lab
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              className="font-serif text-4xl md:text-6xl font-semibold text-white leading-[1.07] mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Comida, emoción y{" "}
              <em className="font-light italic" style={{ color: "#FF6B35" }}>longevidad aplicada.</em>
            </motion.h1>

            <motion.p
              variants={fade}
              className="text-base md:text-lg font-light leading-relaxed mb-10 mx-auto"
              style={{ color: "rgba(245,240,232,0.6)", maxWidth: "52ch" }}
            >
              Food·Mood Lab es el espacio editorial de The Longevity Studio sobre nutrición, psicología, estrés, hábitos y longevidad.
            </motion.p>

            <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#FF6B35", color: "#0f0a0d", boxShadow: "0 0 28px rgba(255,107,53,0.28)" }}
              >
                Leer el Journal <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="https://thelongevity.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-white/8"
                style={{ color: "rgba(245,240,232,0.72)", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                Ver The Longevity Studio
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── 2. INTRO ─────────────────────────────────────────────────────────── */}
      <section aria-label="Por qué importa la comida" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "rgba(107,39,55,0.38)" }}>
              Por qué importa la comida
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#2d0f16" }}>
              La alimentación no es{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>solo nutrición.</em>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <p className="text-base font-light leading-relaxed mb-5" style={{ color: "rgba(45,15,22,0.68)" }}>
              Lo que comes influye en tu energía disponible, en cómo percibes el entorno, en la calidad de tu descanso, en tu capacidad de concentración y en la forma en que gestionas el estrés. Influye en el deseo, en la adherencia a cualquier hábito y en el estado de ánimo que moldea cada decisión.
            </p>
            <p className="text-base font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.48)" }}>
              Food·Mood Lab recoge la investigación que conecta eje intestino-cerebro, psicología del comportamiento, neurobiología del estrés y hábitos de longevidad — para construir un marco de referencia aplicable en consulta, en hospitality y en la vida cotidiana.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ── 3. CONTENT PILLARS ───────────────────────────────────────────────── */}
      <section aria-label="Líneas editoriales" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0f0a0d" }}>
        <div className="max-w-5xl mx-auto">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14 text-center">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(255,107,53,0.42)" }}>
              Áreas editoriales
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Cinco líneas de{" "}
              <em className="font-light italic" style={{ color: "#FF6B35" }}>profundidad.</em>
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`rounded-2xl px-6 py-7${i === 4 ? " sm:col-span-2 lg:col-span-1" : ""}`}
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${p.color}2a` }}
              >
                <div className="w-1.5 h-5 rounded-full mb-4" style={{ backgroundColor: p.color }} />
                <p className="text-sm font-semibold text-white mb-2">{p.label}</p>
                <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.60)" }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 4. FEATURED ARTICLES ─────────────────────────────────────────────── */}
      <section aria-label="Artículos destacados" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-14">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.38)" }}>
              Del Journal
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight" style={{ color: "#2d0f16" }}>
              Lecturas recientes.
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {ARTICLES.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.08)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: a.pillarColor + "14",
                      color:           a.pillarColor,
                      border:          `1px solid ${a.pillarColor}30`,
                    }}
                  >
                    {a.pillar}
                  </span>
                  <span className="text-[9px]" style={{ color: "rgba(107,39,55,0.3)" }}>{a.readTime}</span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold leading-snug mb-2" style={{ color: "#2d0f16" }}>{a.title}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.58)" }}>{a.desc}</p>
                </div>

                <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(107,39,55,0.06)" }}>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                    style={{ color: "rgba(107,39,55,0.32)", backgroundColor: "rgba(107,39,55,0.04)" }}
                  >
                    {a.tag} · Próximamente
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:opacity-70"
              style={{ color: "#6B2737" }}
            >
              Ver todos los artículos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── 5. EVIDENCE LIBRARY ──────────────────────────────────────────────── */}
      <section aria-label="Biblioteca de evidencia" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#f7f4ef" }}>
        <div className="max-w-4xl mx-auto">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.38)" }}>
              Biblioteca de evidencia
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl leading-tight mb-4" style={{ color: "#2d0f16" }}>
              No todo tiene el mismo{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>peso.</em>
            </motion.h2>
            <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.58)", maxWidth: "52ch" }}>
              Todo el contenido de Food·Mood Lab está etiquetado según el nivel de evidencia que lo sustenta. La claridad sobre la certeza científica es parte del rigor editorial.
            </motion.p>
          </motion.div>

          <div className="flex flex-col gap-4 mb-10">
            {EVIDENCE_LEVELS.map((ev, i) => (
              <motion.div
                key={ev.level}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start gap-4"
                style={{ backgroundColor: ev.bgColor, border: `1px solid ${ev.borderColor}` }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: ev.color + "1e", color: ev.color, border: `1px solid ${ev.color}3a` }}
                >
                  {ev.level}
                </span>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.62)" }}>{ev.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-light leading-relaxed px-5 py-4 rounded-xl"
            style={{ color: "rgba(45,15,22,0.42)", backgroundColor: "rgba(107,39,55,0.04)", border: "1px solid rgba(107,39,55,0.07)" }}
          >
            Food·Mood Lab ofrece contenido educativo sobre bienestar, hábitos y longevidad. No presta servicios médicos, no diagnostica y no sustituye la valoración de profesionales sanitarios.
          </motion.p>

        </div>
      </section>

      {/* ── 6. FOR PROFESSIONALS + FOR HOTELS & CLINICS ──────────────────────── */}
      <section aria-label="Para quién" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0f0a0d" }}>
        <div className="max-w-5xl mx-auto">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-12 text-center">
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(255,107,53,0.42)" }}>
              Aplicaciones
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Evidencia que se convierte{" "}
              <em className="font-light italic" style={{ color: "#FF6B35" }}>en práctica.</em>
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Para profesionales de salud */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: "rgba(107,39,55,0.22)", border: "1px solid rgba(107,39,55,0.38)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "rgba(255,107,53,0.65)" }}>
                Para profesionales de salud
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
                Food·Mood Pro
              </h2>
              <p className="text-sm font-light leading-relaxed mb-7 flex-1" style={{ color: "rgba(245,240,232,0.58)" }}>
                Una capa digital que permite observar los patrones entre sesiones de tus pacientes: hambre, emoción, conducta e interocepción. Bajo tu criterio clínico, en tu flujo de trabajo.
              </p>
              <div>
                <Link
                  href="/pro"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#FF6B35", color: "#0f0a0d" }}
                >
                  Ver Food·Mood Pro <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Para hoteles y clínicas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.5 }}
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "rgba(160,123,190,0.75)" }}>
                Para hoteles y clínicas
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
                The Longevity Studio
              </h2>
              <p className="text-sm font-light leading-relaxed mb-7 flex-1" style={{ color: "rgba(245,240,232,0.58)" }}>
                El brazo de consultoría que convierte evidencia en experiencias premium de longevidad para espacios de hospitality, spas y clínicas. Diseño de menú, protocolos, formación de equipo y narrativa de marca.
              </p>
              <div>
                <Link
                  href="https://thelongevity.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:bg-white/10"
                  style={{ color: "rgba(245,240,232,0.78)", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  Conocer The Longevity Studio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 7. NEWSLETTER / GUÍA ─────────────────────────────────────────────── */}
      <section aria-label="Descargar guía" className="py-24 md:py-32 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>

            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(255,107,53,0.5)" }}>
              Guía gratuita
            </motion.p>

            <motion.h2
              variants={fade}
              className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight mb-4"
              style={{ letterSpacing: "-0.015em" }}
            >
              La nueva longevidad{" "}
              <em className="font-light italic" style={{ color: "#FF6B35" }}>no es una tendencia.</em>
            </motion.h2>

            <motion.p variants={fade} className="text-sm font-light leading-relaxed mb-10" style={{ color: "rgba(245,240,232,0.5)", maxWidth: "42ch", margin: "0 auto 2.5rem" }}>
              Una introducción al marco de longevidad aplicada: qué dice la ciencia, qué está sobrevendido y cómo integrar evidencia real en entornos de bienestar.
            </motion.p>

            <motion.div variants={fade} className="flex justify-center">
              <GuideCapture />
            </motion.div>

          </motion.div>
        </div>
      </section>

    </main>
  )
}
