"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, BookOpen, Headphones, BarChart2, Moon, Zap, Leaf, Activity, Brain, ArrowRight, Check } from "lucide-react"
import { ConstellationBackground } from "@/components/layout/ConstellationBackground"
import { NewsletterForm } from "@/components/layout/NewsletterForm"
import HomeHero from "@/components/layout/HomeHero"

// ─── Retos estáticos ──────────────────────────────────────────────────────────
const RETOS = [
  {
    emoji: "⚡",
    category: "Energía",
    color: "#C9A84C",
    duration: "7 días",
    title: "Recupera tu energía en 7 días",
    subtitle: "Sin cafeína forzada, sin azúcares de rebote. Resultados medibles en una semana.",
    recipes: 7,
    audios: 3,
    price: 19,
    slug: "recupera-tu-energia",
  },
  {
    emoji: "😴",
    category: "Sueño",
    color: "#6B2737",
    duration: "4 semanas",
    title: "Mejora tu sueño en 4 semanas",
    subtitle: "Serotonina → melatonina. Magnesio, triptófano, fermentados nocturnos.",
    recipes: 28,
    audios: 4,
    price: 29,
    slug: null,
  },
  {
    emoji: "🌿",
    category: "Inflamación",
    color: "#4A7C59",
    duration: "7 días",
    title: "Reset antiinflamatorio",
    subtitle: "Cúrcuma, omega-3, fermentados. Reset completo en una semana.",
    recipes: 7,
    audios: 7,
    price: 19,
    slug: "reset-antiinflamatorio",
  },
  {
    emoji: "🧠",
    category: "Salud mental",
    color: "#4A7AB5",
    duration: "21 días",
    title: "21 días para resetear tu mente",
    subtitle: "Protocolo Food-Mood Reset. Eje intestino-cerebro en práctica.",
    recipes: 21,
    audios: 21,
    price: 29,
    slug: null,
  },
]

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Necesito saber cocinar?",
    a: "No. Las recetas son de 20-30 minutos, 5-7 ingredientes, y se adaptan a tu nivel de energía del día. Si puedes hervir agua, puedes hacer cualquier receta de Food·Mood.",
  },
  {
    q: "¿Y si tengo intolerancias o sigo una dieta vegana?",
    a: "Cada receta tiene alternativas sin gluten, sin lácteos y veganas claramente marcadas. El test inicial lo tiene en cuenta para personalizarte mejor.",
  },
  {
    q: "¿Qué incluye exactamente un reto?",
    a: "Recetas diarias diseñadas para tu objetivo, audios de contexto científico, tracking de tu índice Food·Mood, y un informe final con tus correlaciones personales.",
  },
  {
    q: "¿Cuánto cuesta y hay suscripción oculta?",
    a: "Los retos son pago único: 19€ (7 días) o 29€ (4 semanas). Acceso de por vida al contenido, sin renovación automática. El plan premium mensual/trimestral sí es suscripción — cancelas cuando quieras desde tu perfil.",
  },
  {
    q: "¿Cuándo empiezo a notar cambios?",
    a: "La mayoría nota algo diferente entre el día 3 y el día 4. El cambio real — el que se sostiene — aparece en la segunda o tercera semana, cuando el microbioma empieza a reorganizarse.",
  },
  {
    q: "¿Sustituye a la atención médica o psicológica?",
    a: "No. Food·Mood es una herramienta de bienestar basada en evidencia nutricional, no un tratamiento médico. Si tienes un diagnóstico, consúltalo siempre con tu profesional.",
  },
]

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

function RetoCard({ reto }: { reto: typeof RETOS[0] }) {
  const href = reto.slug ? `/retos/${reto.slug}` : "/retos"
  return (
    <div
      className="bg-white rounded-2xl p-6 border-l-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
      style={{ borderLeftColor: reto.color }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: reto.color }}>
          {reto.category}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: reto.color }}
        >
          {reto.duration}
        </span>
      </div>
      <div>
        <h3 className="font-serif text-xl font-bold leading-snug mb-1" style={{ color: "#2d0f16" }}>
          {reto.title}
        </h3>
        <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
          {reto.subtitle}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: "rgba(107,39,55,0.5)" }}>
        <span className="flex items-center gap-1"><BookOpen size={13} strokeWidth={1.5} />{reto.recipes} recetas</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1"><Headphones size={13} strokeWidth={1.5} />{reto.audios} audios</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span className="flex items-center gap-1"><BarChart2 size={13} strokeWidth={1.5} />tracking diario</span>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-serif text-2xl font-black" style={{ color: "#C9A84C" }}>{reto.price}€</span>
        <Link
          href={href}
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#6B2737" }}
        >
          Empezar →
        </Link>
      </div>
    </div>
  )
}

function FaqItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#6B2737]/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl font-serif text-[#2d0f16]/90 group-hover:text-[#6B2737] transition-colors pr-8">
          {faq.q}
        </span>
        <ChevronDown
          className="w-5 h-5 shrink-0 transition-transform duration-300"
          style={{ color: isOpen ? "#C9A84C" : "rgba(107,39,55,0.4)", transform: isOpen ? "rotate(180deg)" : undefined }}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 font-light leading-relaxed text-[15px] sm:pr-12" style={{ color: "rgba(107,39,55,0.65)" }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set([0, 1, 2]))
  const toggleFaq = (i: number) => setOpenFaqs(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-hidden font-sans font-light">

      {/* Schema.org FAQ + HowTo */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Cómo funciona Food·Mood",
        description: "Sistema de nutrición emocional basado en el eje intestino-cerebro.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Test de 30 segundos", text: "Dinos cómo te sientes hoy. Tu mezcla real en porcentajes, no una etiqueta." },
          { "@type": "HowToStep", position: 2, name: "Tu paleta emocional", text: "Te mostramos tu espectro emocional del día: 60% calma, 25% melancolía, 15% curiosidad." },
          { "@type": "HowToStep", position: 3, name: "Receta del día", text: "Diseñada para tu estado emocional, con el mecanismo bioquímico explicado." },
          { "@type": "HowToStep", position: 4, name: "Tu índice Food·Mood", text: "Ves en datos cómo evolucionas. 90 días de trayectoria documentada." },
        ],
      }) }} />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <HomeHero />

      {/* ── 2. ALEGRÍA + CONOCIMIENTO ───────────────────────────────────────── */}
      <section aria-label="Más alegría, más conocimiento" className="py-20 md:py-28 px-6 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-8"
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
              Más alegría · más conocimiento
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-[1.15]">
              Comer bien{" "}
              <span className="italic font-light">es el acto más placentero que puedes hacer por ti.</span>
            </motion.h2>
            <motion.div variants={fade} className="space-y-5 text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.7)" }}>
              <p>
                Cuando comes con curiosidad y con conocimiento, algo cambia: más energía, más claridad,
                más placer en cada plato. No es magia — es bioquímica a tu favor.
              </p>
              <p>
                Lo que comes cambia cómo te sientes. Y lo que sientes cambia lo que comes.
                Food·Mood te da las dos claves a la vez.
              </p>
              <p className="font-medium" style={{ color: "#6B2737" }}>
                Placer y ciencia. Juntos. En cada receta.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. LA CIENCIA ───────────────────────────────────────────────────── */}
      <section aria-label="La ciencia del eje intestino-cerebro" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-6"
            >
              <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
                La ciencia
              </motion.p>
              <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-white leading-[1.15]">
                El 95% de tu serotonina nace en el intestino.
              </motion.h2>
              <motion.p variants={fade} className="text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
                No en tu cabeza. Por eso un plato bien elegido puede calmar la ansiedad antes de que tu mente
                lo procese. En Food·Mood traducimos neurociencia en recetas reales, con ingredientes que encuentras
                en cualquier supermercado.
              </motion.p>
              <motion.p variants={fade} className="text-sm font-light italic" style={{ color: "rgba(245,240,232,0.35)" }}>
                Basado en la investigación de Lisa Feldman Barrett y el trabajo de Cryan et al. sobre el eje microbiota-intestino-cerebro.
              </motion.p>
            </motion.div>

            <dl className="grid grid-cols-2 gap-4">
              {[
                { number: "95%", label: "de tu serotonina se produce en el intestino" },
                { number: "90 días", label: "el ciclo real de cambio del microbioma" },
                { number: "20 min", label: "de media por receta — nada complicado" },
                { number: "7 días", label: "para sentir los primeros cambios" },
              ].map(({ number, label }) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-5 flex flex-col gap-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <dt className="font-serif text-3xl font-black" style={{ color: "#C9A84C" }}>{number}</dt>
                  <dd className="text-xs font-light leading-snug" style={{ color: "rgba(245,240,232,0.45)" }}>{label}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── 3b. CTA MICROBIOMA ──────────────────────────────────────────────── */}
      <section aria-label="Empieza hoy" className="py-16 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "rgba(107,39,55,0.4)" }}>
            Tu microbioma se renueva en 90 días
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-[#2d0f16] leading-tight">
            Empieza hoy.
          </h2>
          <p className="text-base font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.6)" }}>
            Tus hematíes, tu microbioma, tus hábitos neuronales — todo se renueva en 90 días. Es el ciclo biológico real del cambio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
            <Link
              href="/retos"
              className="px-8 py-3.5 rounded-full text-sm font-bold text-[#2d0f16] transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Ver los retos disponibles →
            </Link>
            <Link
              href="/test"
              className="text-sm font-light transition-colors hover:text-[#2d0f16]"
              style={{ color: "rgba(45,15,22,0.4)" }}
            >
              O empieza con el test gratis →
            </Link>
          </div>
          <p className="text-xs font-light" style={{ color: "rgba(45,15,22,0.3)" }}>
            Retos desde 19€ · Pago único · Acceso de por vida
          </p>
        </div>
      </section>

      {/* ── 4. CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section aria-label="Cómo funciona Food·Mood" className="py-20 md:py-28 px-6 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "rgba(107,39,55,0.4)" }}>
              Cómo funciona
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight">
              Un sistema que escucha{" "}
              <span className="italic font-light">antes de recomendar.</span>
            </h2>
          </div>

          {/* Flow diagram */}
          <div className="relative">

            {/* Desktop: animated connecting line */}
            <div className="hidden md:block absolute top-[38px] left-[12%] right-[12%] h-px" style={{ backgroundColor: "rgba(107,39,55,0.08)" }}>
              <motion.div
                className="absolute inset-y-0 left-0"
                initial={{ right: "100%" }}
                whileInView={{ right: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                style={{ backgroundColor: "#C9A84C", opacity: 0.5 }}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-10 md:gap-6">
              {([
                {
                  title: "Test de 30 segundos",
                  body: "Dinos cómo te sientes hoy. Tu mezcla real en porcentajes, no una etiqueta.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <line x1="3" y1="6" x2="21" y2="6" opacity=".3"/>
                      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/>
                      <line x1="3" y1="12" x2="21" y2="12" opacity=".3"/>
                      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/>
                      <line x1="3" y1="18" x2="21" y2="18" opacity=".3"/>
                      <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none"/>
                    </svg>
                  ),
                },
                {
                  title: "Tu paleta emocional",
                  body: "60% calma, 25% melancolía, 15% curiosidad. Un mapa real, no una etiqueta.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                      <rect x="3" y="8" width="5" height="8" rx="2" fill="#5A9B8A" opacity=".8"/>
                      <rect x="10" y="5" width="5" height="11" rx="2" fill="#4A7AB5" opacity=".8"/>
                      <rect x="17" y="10" width="5" height="6" rx="2" fill="#C04878" opacity=".8"/>
                    </svg>
                  ),
                },
                {
                  title: "Receta del día",
                  body: "Diseñada para tu estado, no para una dieta genérica. Con el mecanismo bioquímico.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 2v7c0 1.7 1.3 3 3 3s3-1.3 3-3V2"/>
                      <line x1="6" y1="12" x2="6" y2="22"/>
                      <path d="M20.84 2.18a5 5 0 00-5.67 5.67L17 10l-1.68 1.68A5 5 0 0020.84 2.18z"/>
                      <line x1="17" y1="10" x2="17" y2="22"/>
                    </svg>
                  ),
                },
                {
                  title: "Tu índice Food·Mood",
                  body: "Ves en datos cómo evolucionas. 90 días de trayectoria documentada.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  ),
                },
              ] as const).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative flex flex-col items-center text-center gap-5"
                >
                  {/* Mobile: vertical connector above (except first) */}
                  {i > 0 && (
                    <div className="md:hidden absolute -top-5 left-1/2 -translate-x-1/2 w-px h-5" style={{ backgroundColor: "rgba(201,168,76,0.4)" }} />
                  )}

                  {/* Icon circle */}
                  <div className="relative z-10">
                    <div
                      className="w-[76px] h-[76px] rounded-full flex items-center justify-center bg-white shadow-sm"
                      style={{ border: "1.5px solid rgba(107,39,55,0.1)", color: "#6B2737" }}
                    >
                      {step.icon}
                    </div>
                    {/* Step badge */}
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: "#C9A84C" }}
                    >
                      {i + 1}
                    </span>
                    {/* Desktop arrow between steps */}
                    {i < 3 && (
                      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-[calc(50%+8px)] items-center" style={{ color: "#C9A84C", opacity: 0.6 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-w-[180px]">
                    <h3 className="font-serif text-base font-bold leading-snug" style={{ color: "#2d0f16" }}>
                      {i === 1 ? (
                        <Link href="/paleta" className="underline decoration-[#C9A84C]/50 underline-offset-2 hover:text-[#6B2737] transition-colors">
                          {step.title}
                        </Link>
                      ) : step.title}
                    </h3>
                    <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>
                      {step.body}
                    </p>
                    {i === 1 && (
                      <Link href="/paleta" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors hover:opacity-80" style={{ color: "#C9A84C" }}>
                        Explorar →
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/test"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: "#6B2737" }}
            >
              Hacer el test gratis — 30 segundos <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[#6B2737]/20 hidden sm:inline">·</span>
            <Link
              href="/paleta"
              className="inline-flex items-center gap-2 text-sm font-light transition-opacity hover:opacity-70"
              style={{ color: "rgba(107,39,55,0.5)" }}
            >
              Descubre tu paleta emocional <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4c. ÍNDICE FOOD·MOOD — EJEMPLO ─────────────────────────────────── */}
      <section aria-label="Qué es el índice Food·Mood" className="py-20 md:py-24 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Texto */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-5"
            >
              <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
                Tu índice Food·Mood
              </motion.p>
              <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
                Un número que te dice<br />
                <span className="italic font-light">cómo estás de verdad.</span>
              </motion.h2>
              <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
                Cada día calculas tu índice (0-100) a partir de tus registros de comida, síntomas y estado emocional.
                No es una báscula — es un espejo de tu eje intestino-cerebro.
              </motion.p>
              <motion.ul variants={fade} className="space-y-3">
                {[
                  "Ve en qué días comes mejor y cómo te afecta al día siguiente",
                  "Detecta los alimentos que te suben o te bajan el índice",
                  "Compara tu inicio vs. fin de cada reto en datos reales",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: "rgba(245,240,232,0.65)" }}>
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-[#2d0f16]" style={{ backgroundColor: "#C9A84C" }}>✓</span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Tarjeta de ejemplo */}
            <motion.div
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl p-7"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(201,168,76,0.7)" }}>Índice Food·Mood</p>
                  <p className="text-xs font-light" style={{ color: "rgba(245,240,232,0.3)" }}>21 días · Reto antiinflamatorio</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-4xl font-black" style={{ color: "#C9A84C" }}>74</p>
                  <p className="text-[10px] font-light" style={{ color: "rgba(201,168,76,0.5)" }}>/ 100</p>
                </div>
              </div>

              {/* Mini gráfica SVG */}
              <div className="mb-5">
                <svg viewBox="0 0 280 80" className="w-full" preserveAspectRatio="none" aria-label="Evolución del índice Food·Mood en 21 días">
                  {/* Grid lines */}
                  {[20, 40, 60].map(y => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="fmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,68 C20,66 30,60 50,55 C70,50 80,58 100,50 C120,42 130,38 150,35 C170,32 180,28 200,24 C220,20 240,18 260,12 L280,8 L280,80 L0,80 Z"
                    fill="url(#fmGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M0,68 C20,66 30,60 50,55 C70,50 80,58 100,50 C120,42 130,38 150,35 C170,32 180,28 200,24 C220,20 240,18 260,12 L280,8"
                    fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"
                  />
                  {/* End dot */}
                  <circle cx="280" cy="8" r="4" fill="#C9A84C" />
                </svg>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] font-light" style={{ color: "rgba(245,240,232,0.25)" }}>Día 1</span>
                  <span className="text-[10px] font-light" style={{ color: "rgba(245,240,232,0.25)" }}>Día 21</span>
                </div>
              </div>

              {/* Comparativa inicio/fin */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <p className="text-[10px] font-light mb-1" style={{ color: "rgba(245,240,232,0.35)" }}>Inicio</p>
                  <p className="font-serif text-2xl font-black" style={{ color: "rgba(201,168,76,0.45)" }}>37</p>
                </div>
                <div className="rounded-2xl p-4 text-center flex flex-col items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <p className="font-serif text-xl font-black" style={{ color: "#C9A84C" }}>+37</p>
                  <p className="text-[9px] font-light mt-0.5" style={{ color: "rgba(201,168,76,0.5)" }}>puntos</p>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <p className="text-[10px] font-light mb-1" style={{ color: "rgba(201,168,76,0.6)" }}>Hoy</p>
                  <p className="font-serif text-2xl font-black" style={{ color: "#C9A84C" }}>74</p>
                </div>
              </div>

              {/* Insight */}
              <div className="mt-4 rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                <p className="text-[11px] font-light" style={{ color: "rgba(245,240,232,0.45)" }}>
                  <span className="font-semibold" style={{ color: "rgba(245,240,232,0.7)" }}>Patrón detectado:</span>{" "}
                  los días que comes chucrut o kéfir, tu índice sube una media de 8 puntos al día siguiente.
                </p>
              </div>

              <p className="text-center text-[10px] font-light mt-5" style={{ color: "rgba(245,240,232,0.2)" }}>
                Ejemplo basado en datos reales de usuarias del reto antiinflamatorio
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 4b. ECOSISTEMA / INTEGRACIONES ──────────────────────────────────── */}
      <section aria-label="Disponible en todos tus dispositivos" className="py-12 px-6 bg-white border-y" style={{ borderColor: "rgba(107,39,55,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "#C9A84C" }}>Plataforma</p>
            <h3 className="font-serif text-2xl md:text-3xl text-[#2d0f16] leading-snug">
              Sin app que instalar.<br />
              <span className="italic font-light">En cualquier dispositivo.</span>
            </h3>
            <p className="text-sm font-light leading-relaxed mt-1" style={{ color: "rgba(107,39,55,0.6)" }}>
              Food·Mood es una PWA — se instala desde el navegador en iOS, Android y desktop. Sin App Store. Funciona offline.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "iOS", available: true },
                { label: "Android", available: true },
                { label: "Desktop", available: true },
                { label: "Apple Health", available: false },
                { label: "Google Fit", available: false },
                { label: "MyFitnessPal", available: false },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={
                    item.available
                      ? { backgroundColor: "#2d0f16", color: "#F5F0E8" }
                      : { backgroundColor: "rgba(107,39,55,0.06)", color: "rgba(107,39,55,0.35)", border: "1px dashed rgba(107,39,55,0.18)" }
                  }
                >
                  {item.label}
                  {!item.available && (
                    <span className="text-[8px] uppercase tracking-widest font-bold" style={{ color: "#C9A84C" }}>prox.</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-[10px] font-light" style={{ color: "rgba(107,39,55,0.3)" }}>
              Push notifications · Acceso offline · Sin actualizaciones manuales
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. LOS RETOS ────────────────────────────────────────────────────── */}
      <section aria-label="Retos de transformación disponibles" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#FEFBF4" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "#C9A84C" }}>
              Retos de transformación
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight mb-4">
              No necesitas otro plan de comidas.{" "}
              <span className="italic font-light">Necesitas un punto de partida.</span>
            </h2>
            <p className="text-base font-light max-w-xl mx-auto" style={{ color: "rgba(107,39,55,0.6)" }}>
              Un objetivo. Un tiempo. Un camino con datos reales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {RETOS.map((reto) => (
              <RetoCard key={reto.title} reto={reto} />
            ))}
          </div>

          <div
            className="rounded-3xl p-8 md:p-12 text-center"
            style={{ backgroundColor: "#2d0f16" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A84C" }}>
              Por qué funcionan
            </p>
            <p className="font-serif text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>
              Los retos son el único formato donde la intención se convierte en acción sostenida.
              Porque tienen principio, medio y fin.
            </p>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.35)" }}>
              Inicio · Tracking diario con tu índice Food·Mood · Informe final
            </p>
            <Link
              href="/retos"
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-[#2d0f16] transition-all hover:opacity-90"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Ver todos los retos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. PRUEBA SOCIAL ────────────────────────────────────────────────── */}
      <section aria-label="Testimonios de usuarios" className="py-16 md:py-20 px-6 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Día 4 del reto de energía. No me lo podía creer — sin cafeína desde las 3pm y sin el bajón de siempre.",
                name: "Sofía M.",
                tag: "Reto Energía · 7 días",
              },
              {
                quote: "El índice Food·Mood me hizo ver que mi peor semana coincidía justo con una semana sin fermentados. Dato objetivo. No intuición.",
                name: "Carlos R.",
                tag: "Usuario desde enero",
              },
              {
                quote: "Pensaba que era cosa de bienestar genérico. Cuando vi mis correlaciones propias al final del reto entendí por qué funciona.",
                name: "Laura P.",
                tag: "Reto Sueño · 4 semanas",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.08)" }}
              >
                <p className="text-sm font-light leading-relaxed italic" style={{ color: "rgba(107,39,55,0.75)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{t.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#C9A84C" }}>{t.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6b. MODELO DE NEGOCIO / PRICING ─────────────────────────────────── */}
      <section aria-label="Precios y modelo de acceso" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "#C9A84C" }}>
              Sin letra pequeña
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Empieza gratis.{" "}
              <span className="italic font-light">Profundiza cuando quieras.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {([
              {
                tier: "Gratuito",
                price: "0€",
                cadence: "para siempre",
                features: ["Test emocional completo", "Paleta emocional básica", "1 receta de muestra al día"],
                cta: "Empezar gratis",
                href: "/test",
                highlight: false,
              },
              {
                tier: "Premium mensual",
                price: "9€",
                cadence: "/mes",
                features: ["200+ recetas completas", "Paleta emocional personalizada", "Historial de 90 días", "Glosario científico", "Canal privado de Telegram"],
                cta: "Ver plan mensual",
                href: "/pricing",
                highlight: false,
              },
              {
                tier: "Premium trimestral",
                price: "5€",
                cadence: "/mes — 15€ cada 3 meses",
                features: ["Todo lo del plan mensual", "Ahorra un 44%", "Fermentos del Mundo", "Canal privado de Telegram", "Cancela cuando quieras"],
                cta: "Mejor precio →",
                href: "/pricing",
                highlight: true,
              },
            ] as const).map((plan) => (
              <div
                key={plan.tier}
                className="rounded-2xl p-6 flex flex-col gap-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: plan.highlight ? "2px solid rgba(201,168,76,0.6)" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: plan.highlight ? "#C9A84C" : "rgba(245,240,232,0.35)" }}>
                    {plan.tier}
                  </span>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-3xl font-serif font-black text-white">{plan.price}</span>
                    <span className="text-xs font-light pb-1 ml-0.5" style={{ color: "rgba(245,240,232,0.4)" }}>{plan.cadence}</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-light" style={{ color: "rgba(245,240,232,0.6)" }}>
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="text-center py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={
                    plan.highlight
                      ? { backgroundColor: "#C9A84C", color: "#2d0f16" }
                      : { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(245,240,232,0.7)" }
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs font-light" style={{ color: "rgba(245,240,232,0.2)" }}>
            Los retos de transformación (7–30 días) son pago único desde 19€ · Sin renovación automática
          </p>
        </div>
      </section>

      {/* ── 7. NEWSLETTER / LEAD MAGNET ─────────────────────────────────────── */}
      <section aria-label="Suscripción al newsletter" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "rgba(107,39,55,0.4)" }}>
              No compres aún si no estás seguro
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-[#2d0f16] leading-tight">
              Recibe las 5 recetas anti-ansiedad.{" "}
              <span className="italic font-light">Gratis.</span>
            </motion.h2>
            <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>
              El newsletter semanal de Food·Mood incluye correlaciones, recetas funcionales y novedades de la ciencia del eje intestino-cerebro. Sin spam. Cancelas cuando quieras.
            </motion.p>
            <motion.div variants={fade} className="flex justify-center pt-2">
              <NewsletterForm source="home-lead-magnet" dark={false} />
            </motion.div>
            <motion.div variants={fade} className="flex items-center justify-center gap-6 pt-2">
              {["Sin spam", "Cancelas cuando quieras", "Un email a la semana"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
                  <Check className="w-3 h-3" style={{ color: "#C9A84C" }} />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────────────────────── */}
      <section aria-label="Preguntas frecuentes" className="py-20 md:py-28 px-6" style={{ backgroundColor: "white", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "rgba(107,39,55,0.4)" }}>
              Preguntas frecuentes
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16]">
              Las dudas habituales.
            </h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                isOpen={openFaqs.has(i)}
                onToggle={() => toggleFaq(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CIERRE ───────────────────────────────────────────────────────── */}
      <section aria-label="Llamada a la acción final" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl px-10 py-16 md:px-20 md:py-20 text-center relative overflow-hidden"
            style={{ backgroundColor: "#2d0f16" }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(201,168,76,0.07)" }} />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
                Tu microbioma se renueva en 90 días
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
                Empieza hoy.
              </h2>
              <p className="font-serif italic text-lg md:text-xl font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.55)" }}>
                Tus hematíes, tu microbioma, tus hábitos neuronales — todo se renueva en 90 días.
                Es el ciclo biológico real del cambio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                <Link
                  href="/retos"
                  className="px-10 py-4 rounded-full text-sm font-bold text-[#2d0f16] transition-all hover:opacity-90 hover:scale-[1.02] shadow-xl"
                  style={{ backgroundColor: "#C9A84C" }}
                >
                  Ver los retos disponibles →
                </Link>
                <Link
                  href="/test"
                  className="text-sm font-light transition-colors hover:text-white"
                  style={{ color: "rgba(245,240,232,0.4)" }}
                >
                  O empieza con el test gratis →
                </Link>
              </div>
              <p className="text-xs font-light" style={{ color: "rgba(245,240,232,0.25)" }}>
                Retos desde 19€ · Pago único · Acceso de por vida · Planes premium: cancelas cuando quieras
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
