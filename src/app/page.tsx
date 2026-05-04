"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, Moon, Zap, Leaf, Activity, Brain, ArrowRight, Check, Flame, Sprout, Sparkles, Wind, Flower2, FlaskConical } from "lucide-react"
import { ConstellationBackground } from "@/components/layout/ConstellationBackground"
import { NewsletterForm } from "@/components/layout/NewsletterForm"
import HomeHero from "@/components/layout/HomeHero"
import { AppDemo } from "@/components/layout/AppDemo"

// ─── Retos estáticos ──────────────────────────────────────────────────────────
const RETOS = [
  { Icon: Zap,         category: "Energía",      color: "#E8703A", duration: "7 días",    title: "Recupera tu energía",         price: 19, slug: "recupera-tu-energia"    },
  { Icon: Flame,       category: "Inflamación",  color: "#5A9B8A", duration: "7 días",    title: "Reset antiinflamatorio",      price: 19, slug: "reset-antiinflamatorio" },
  { Icon: Sprout,      category: "Longevidad",   color: "#2D6B55", duration: "10 días",   title: "Activa tu longevidad",        price: 19, slug: "activa-tu-longevidad"   },
  { Icon: Sparkles,    category: "Hábitos",      color: "#C9A84C", duration: "21 días",   title: "Microhábitos",                price: 29, slug: "microhabitos"           },
  { Icon: Wind,        category: "Ansiedad",     color: "#4A7B6B", duration: "21 días",   title: "Slow Food·Mood",              price: 29, slug: "slow-food-mood"         },
  { Icon: Brain,       category: "Salud mental", color: "#4A7AB5", duration: "21 días",   title: "Food·Mood Reset",             price: 29, slug: "food-mood-reset"        },
  { Icon: Flower2,     category: "Hormonas",     color: "#C04878", duration: "28 días",   title: "Equilibrio hormonal 45+",     price: 29, slug: "equilibrio-hormonal-45" },
  { Icon: Moon,        category: "Sueño",        color: "#4A7AB5", duration: "4 semanas", title: "Mejora tu sueño",             price: 29, slug: "mejora-tu-sueno"        },
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
  const href = `/retos/${reto.slug}`
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border-l-[3px] px-4 py-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow no-underline"
      style={{ borderLeftColor: reto.color }}
    >
      <span
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${reto.color}15` }}
      >
        <reto.Icon size={14} strokeWidth={1.75} style={{ color: reto.color }} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: reto.color }}>
          {reto.category} · {reto.duration}
        </p>
        <p className="text-sm font-semibold truncate" style={{ color: "#2d0f16" }}>
          {reto.title}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-serif text-base font-black" style={{ color: "#C9A84C" }}>{reto.price}€</span>
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: reto.color }} />
      </div>
    </Link>
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

// ─── Phone screen components ──────────────────────────────────────────────────
function TestScreen() {
  return (
    <div className="h-full flex flex-col p-4" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="flex justify-between items-center text-[8px] font-medium pt-8 pb-4" style={{ color: "rgba(45,15,22,0.3)" }}>
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: i < 2 ? "#C9A84C" : "rgba(107,39,55,0.12)" }} />
        ))}
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(107,39,55,0.35)" }}>Pregunta 2 de 8</p>
      <h3 className="font-serif text-xs font-bold leading-snug mb-4" style={{ color: "#2d0f16" }}>¿Cómo te sientes ahora mismo?</h3>
      <div className="flex flex-col gap-1.5">
        {[
          { e: "⚡", l: "Activo y con energía", s: true },
          { e: "🌿", l: "Tranquilo y en calma", s: false },
          { e: "😰", l: "Con ansiedad", s: false },
          { e: "😔", l: "Sin energía", s: false },
        ].map(o => (
          <div key={o.l} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-medium"
            style={o.s ? { backgroundColor: "#C9A84C", color: "#2d0f16" } : { backgroundColor: "rgba(107,39,55,0.06)", color: "rgba(107,39,55,0.65)" }}>
            <span>{o.e}</span><span>{o.l}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <div className="w-full py-2.5 rounded-xl text-[9px] font-bold text-center text-white" style={{ backgroundColor: "#6B2737" }}>Siguiente →</div>
      </div>
    </div>
  )
}

function PaletaScreen() {
  return (
    <div className="h-full flex flex-col p-4" style={{ backgroundColor: "#1e0d12" }}>
      <div className="flex justify-between items-center text-[8px] font-medium pt-8 pb-4" style={{ color: "rgba(245,240,232,0.25)" }}>
        <span>9:41</span><span>●●●</span>
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>Tu paleta de hoy</p>
      <h3 className="font-serif text-xs font-bold text-white leading-snug mb-5">
        Estado dominante: <span style={{ color: "#C9A84C" }}>Calma</span>
      </h3>
      <div className="flex flex-col gap-3 mb-4">
        {[
          { label: "Calma", pct: 68, color: "#5A9B8A" },
          { label: "Focus", pct: 32, color: "#4A7AB5" },
          { label: "Energía", pct: 18, color: "#C9A84C" },
        ].map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[8px] mb-1">
              <span style={{ color: "rgba(245,240,232,0.4)" }}>{b.label}</span>
              <span style={{ color: b.color }}>{b.pct}%</span>
            </div>
            <div className="w-full h-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 mb-5">
        {["#5A9B8A","#5A9B8A","#5A9B8A","#4A7AB5","#4A7AB5","#C9A84C"].map((c, i) => (
          <div key={i} className="flex-1 h-5 rounded" style={{ backgroundColor: c, opacity: 0.75 }} />
        ))}
      </div>
      <div className="mt-auto">
        <div className="w-full py-2.5 rounded-xl text-[9px] font-bold text-center" style={{ backgroundColor: "#C9A84C", color: "#1e0d12" }}>Ver receta del día →</div>
      </div>
    </div>
  )
}

function RecetaScreen() {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="h-24 flex flex-col items-center justify-end pb-3 relative" style={{ backgroundColor: "#2d0f16" }}>
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center text-[8px] font-medium pt-8 px-4" style={{ color: "rgba(245,240,232,0.3)" }}>
          <span>9:41</span><span>●●●</span>
        </div>
        <div className="px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest mb-1" style={{ backgroundColor: "rgba(90,155,138,0.25)", color: "#5A9B8A" }}>Calma</div>
        <p className="font-serif text-[10px] font-bold text-white text-center px-4 leading-tight">Bowl de miso y aguacate</p>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2">
        <p className="text-[8px] font-light" style={{ color: "rgba(107,39,55,0.45)" }}>Para tu estado de hoy</p>
        <div className="flex flex-col gap-1">
          {["Triptófano → serotonina","Omega-3 antiinflamatorio","Magnesio nervioso central"].map(item => (
            <div key={item} className="flex items-start gap-1.5 text-[8px]" style={{ color: "rgba(107,39,55,0.65)" }}>
              <span style={{ color: "#C9A84C" }}>·</span>{item}
            </div>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {["🥑 Aguacate","🍶 Miso","🌿 Cilantro"].map(ing => (
            <span key={ing} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(107,39,55,0.07)", color: "rgba(107,39,55,0.55)" }}>{ing}</span>
          ))}
        </div>
        <div className="flex gap-2 text-[7px]" style={{ color: "rgba(107,39,55,0.35)" }}>
          <span>⏱ 20 min</span><span>🌱 Vegano</span>
        </div>
        <div className="mt-auto">
          <div className="w-full py-2 rounded-xl text-[8px] font-bold text-center text-white" style={{ backgroundColor: "#6B2737" }}>Ver receta completa →</div>
        </div>
      </div>
    </div>
  )
}

function PhoneMockup({ screen, featured = false, dimmed = false }: {
  screen: "test" | "paleta" | "receta"
  featured?: boolean
  dimmed?: boolean
}) {
  return (
    <div
      className="relative mx-auto rounded-[2.5rem] overflow-hidden"
      style={{
        width: "100%",
        aspectRatio: "9/19",
        border: `${featured ? "2" : "1.5"}px solid ${featured ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: featured
          ? "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08)"
          : "0 20px 40px rgba(0,0,0,0.4)",
        opacity: dimmed ? 0.55 : 1,
        backgroundColor: "#111",
      }}
    >
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full z-10" style={{ backgroundColor: "#000" }} />
      <div className="absolute inset-[2px] rounded-[2.4rem] overflow-hidden">
        {screen === "test" && <TestScreen />}
        {screen === "paleta" && <PaletaScreen />}
        {screen === "receta" && <RecetaScreen />}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set())
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

      {/* ── 1b. DEMO INTERACTIVA ─────────────────────────────────────────────── */}
      <AppDemo />

      {/* ── 2. LA CIENCIA ───────────────────────────────────────────────────── */}
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
                El 90% de tu serotonina nace en el intestino.
              </motion.h2>
              <motion.p variants={fade} className="text-base md:text-lg font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
                No en tu cabeza. Por eso un plato bien elegido puede calmar la ansiedad antes de que tu mente
                lo procese. Y el mecanismo no es la disciplina — es el placer. Cuando comes lo que tu cuerpo
                necesita y lo disfrutas, activas el mismo circuito que hace que quieras repetirlo.
                Eso es lo que construye hábitos duraderos.
              </motion.p>
              <motion.p variants={fade} className="text-sm font-light italic" style={{ color: "rgba(245,240,232,0.35)" }}>
                Basado en la investigación de Lisa Feldman Barrett y el trabajo de Cryan et al. sobre el eje microbiota-intestino-cerebro.
              </motion.p>
            </motion.div>

            <dl className="grid grid-cols-2 gap-4">
              {[
                { number: "90%", label: "de tu serotonina se produce en el intestino" },
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

      {/* ── 2b. TRANQUILIDAD — plato concreto ──────────────────────────────── */}
      <section aria-label="Un plato para la tranquilidad" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Texto */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
            className="space-y-6"
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "rgba(107,39,55,0.4)" }}>
              Estado · Calma
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-[1.1]">
              ¿Más tranquilidad?{" "}
              <span className="italic font-light" style={{ color: "#6B2737" }}>Hay un plato para eso.</span>
            </motion.h2>
            <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>
              El miso aporta GABA — el neurotransmisor inhibidor que frena el exceso de activación. El aguacate completa con magnesio, el mineral que el sistema nervioso consume primero cuando hay tensión. El sésamo cierra el triángulo con glicina, que ralentiza las señales de alerta.
            </motion.p>
            <motion.p variants={fade} className="text-sm font-light italic" style={{ color: "rgba(107,39,55,0.35)" }}>
              No es intuición. Es bioquímica que ya existe en tu nevera.
            </motion.p>
            <motion.div variants={fade}>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70"
                style={{ color: "#6B2737" }}
              >
                Descubre tu plato de hoy — 30 segundos <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Tarjeta receta */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-3xl overflow-hidden shadow-sm"
            style={{ border: "1px solid rgba(107,39,55,0.09)" }}
          >
            {/* Header */}
            <div className="px-7 pt-7 pb-5" style={{ backgroundColor: "#2d0f16" }}>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(90,155,138,0.22)", color: "#7BBFAA" }}
                >
                  Calma
                </span>
                <span className="text-[10px] font-light" style={{ color: "rgba(245,240,232,0.3)" }}>· 15 min · fácil</span>
              </div>
              <p className="font-serif text-xl font-bold leading-snug" style={{ color: "#F5F0E8" }}>
                Bol de miso, aguacate y sésamo
              </p>
              <p className="text-xs font-light mt-2" style={{ color: "rgba(245,240,232,0.45)" }}>
                GABA · Magnesio · Glicina — el triángulo de la calma
              </p>
            </div>

            {/* Mecanismos */}
            <div className="px-7 py-5 border-b" style={{ backgroundColor: "white", borderColor: "rgba(107,39,55,0.07)" }}>
              <div className="flex flex-col gap-3">
                {[
                  { mol: "GABA", fuente: "Miso (fermentado)", efecto: "Inhibe la sobreactivación neuronal. Mismo mecanismo que los ansiolíticos, sin receta." },
                  { mol: "Magnesio", fuente: "Aguacate", efecto: "Cofactor de más de 300 reacciones nerviosas. El estrés lo depleta primero." },
                  { mol: "Glicina", fuente: "Sésamo tostado", efecto: "Aminoácido inhibidor que ralentiza las señales de alerta en el tálamo." },
                ].map(({ mol, fuente, efecto }) => (
                  <div key={mol} className="flex items-start gap-3">
                    <span
                      className="shrink-0 mt-0.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(90,155,138,0.1)", color: "#4A7B6B" }}
                    >
                      {mol}
                    </span>
                    <div>
                      <span className="text-[10px] font-semibold" style={{ color: "rgba(107,39,55,0.5)" }}>{fuente} · </span>
                      <span className="text-[11px] font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>{efecto}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredientes rápidos */}
            <div className="px-7 py-5" style={{ backgroundColor: "#FAFAF5" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(107,39,55,0.3)" }}>
                Lo que necesitas
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["🥑 Aguacate", "🍶 Pasta de miso", "🌿 Edamame", "⚪ Sésamo tostado", "🍋 Limón", "🫚 AOVE"].map(i => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-full font-light" style={{ backgroundColor: "rgba(107,39,55,0.06)", color: "rgba(107,39,55,0.6)" }}>
                    {i}
                  </span>
                ))}
              </div>
              <Link
                href="/paleta/calma"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
                style={{ color: "#4A7B6B" }}
              >
                Ver recetas para la calma <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 3. CÓMO FUNCIONA ────────────────────────────────────────────────── */}
      <section id="como-funciona" aria-label="Cómo funciona Food·Mood" className="py-20 md:py-28 px-6 bg-[#F5F0E8]">
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

      {/* ── 3b. BENEFICIOS ──────────────────────────────────────────────────── */}
      <section aria-label="Beneficios de Food·Mood" className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "rgba(107,39,55,0.4)" }}>
              Lo que cambia
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight">
              Sin esfuerzo. Sin culpa.{" "}
              <span className="italic font-light">Sin dieta.</span>
            </h2>
          </div>

          {/* Bloque diferencial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-10 mb-12 text-center"
            style={{ backgroundColor: "#2d0f16" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(201,168,76,0.55)" }}>
              La neurociencia lo confirma
            </p>
            <p className="font-serif text-xl md:text-2xl font-light leading-relaxed text-white mb-4">
              Los hábitos duraderos no se crean con disciplina.{" "}
              <span style={{ color: "#C9A84C" }}>Se crean con placer.</span>
            </p>
            <p className="text-sm font-light max-w-lg mx-auto" style={{ color: "rgba(245,240,232,0.5)" }}>
              Tu intestino produce el 90% de tu serotonina — el neurotransmisor del bienestar y la recompensa.
              Cuando comes lo que te hace sentir bien, ese circuito se activa y tu cerebro lo pide de nuevo.
              Eso es lo que crea el hábito. No el esfuerzo.
            </p>
          </motion.div>

          {/* Grid de beneficios */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: <Leaf size={20} />,
                title: "Comes mejor sin sentirte a dieta",
                body: "No restricción. No control. Un plato que te da placer y te hace sentir bien. Sin culpa incluida.",
                iconBg: "rgba(107,39,55,0.06)",
                iconColor: "#6B2737",
              },
              {
                icon: <Activity size={20} />,
                title: "Reduces la ansiedad con comida que disfrutas",
                body: "Sin el ciclo de restricción → ansiedad → abandono. La comida como solución, no como problema.",
                iconBg: "rgba(201,168,76,0.09)",
                iconColor: "#C9A84C",
              },
              {
                icon: <Zap size={20} />,
                title: "Creas hábitos de forma natural",
                body: "Cuando algo te da placer, tu cerebro lo repite solo. Sin fuerza de voluntad ni disciplina rígida.",
                iconBg: "rgba(107,39,55,0.06)",
                iconColor: "#6B2737",
              },
              {
                icon: <Brain size={20} />,
                title: "Reconectas con tu cuerpo",
                body: "Aprendes a escuchar lo que te pide el cuerpo. Food·Mood traduce esa señal en un plato concreto.",
                iconBg: "rgba(201,168,76,0.09)",
                iconColor: "#C9A84C",
              },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-5 p-6 rounded-2xl"
                style={{ border: "1px solid rgba(107,39,55,0.08)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: b.iconBg, color: b.iconColor }}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold mb-1.5" style={{ color: "#2d0f16" }}>{b.title}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>{b.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3c. DEMOSTRACIÓN VISUAL ─────────────────────────────────────────── */}
      <section aria-label="Pantallas de la aplicación Food·Mood" className="py-20 md:py-28 px-6 overflow-hidden" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: "#C9A84C" }}>La app</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Simple. Personal.{" "}
              <span className="italic font-light">Tuya.</span>
            </h2>
            <p className="text-base font-light mt-5 max-w-lg mx-auto" style={{ color: "rgba(245,240,232,0.5)" }}>
              Sin curva de aprendizaje. En 30 segundos ya tienes tu receta del día.
            </p>
          </div>

          <div className="flex items-end justify-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden md:block shrink-0"
              style={{ width: 188 }}
            >
              <PhoneMockup screen="test" dimmed />
              <p className="text-center text-[11px] font-light mt-5" style={{ color: "rgba(245,240,232,0.3)" }}>Test emocional</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="shrink-0"
              style={{ width: 210 }}
            >
              <PhoneMockup screen="paleta" featured />
              <p className="text-center text-[11px] font-light mt-5" style={{ color: "rgba(245,240,232,0.5)" }}>Tu paleta emocional</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block shrink-0"
              style={{ width: 188 }}
            >
              <PhoneMockup screen="receta" dimmed />
              <p className="text-center text-[11px] font-light mt-5" style={{ color: "rgba(245,240,232,0.3)" }}>Receta del día</p>
            </motion.div>
          </div>

          <p className="text-center text-[10px] font-light mt-10" style={{ color: "rgba(245,240,232,0.15)" }}>
            Interfaz real de la app · Sin filtros · Sin montajes
          </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-10">
            {RETOS.map((reto) => (
              <RetoCard key={reto.slug} reto={reto} />
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

      {/* ── 5b. CORPORATE WELLNESS ──────────────────────────────────────────── */}
      <section aria-label="Food·Mood for Work — Corporate Wellness" className="py-14 px-6" style={{ backgroundColor: '#FF5500' }}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 bg-white">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: '#FF5500' }}>
                Food·Mood for Work · Corporate Wellness
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-3" style={{ color: '#2d0f16' }}>
                Alimenta el foco<br />
                <span className="italic font-light">de tu equipo.</span>
              </h2>
              <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(107,39,55,0.6)' }}>
                Programa corporativo de 7 días: snacks funcionales, micro-hábitos y tracking para mejorar el foco, la energía y el bienestar en la jornada laboral.
              </p>
              <Link
                href="/corporate-wellness"
                className="inline-flex items-center gap-2 self-start px-7 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF5500', color: 'white' }}
              >
                Ver el programa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(107,39,55,0.08)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(107,39,55,0.35)' }}>
                Incluye
              </p>
              <ul className="space-y-3">
                {[
                  '7 días · 14 snacks funcionales',
                  'Lista de compra semanal',
                  'Check-in diario: energía, foco, ánimo',
                  'Audios de 2–3 min: foco y pausa consciente',
                  'Informe agregado para RRHH',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-light" style={{ color: 'rgba(107,39,55,0.7)' }}>
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#FF5500' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-light" style={{ color: 'rgba(107,39,55,0.35)' }}>
                Desde 490€ · Piloto hasta 25 personas · Factura incluida
              </p>
            </div>
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
                cta: "Empezar — 9€/mes",
                href: "/pricing",
                highlight: false,
              },
              {
                tier: "Premium trimestral",
                price: "7€",
                cadence: "/mes — 21€ cada 3 meses",
                features: ["Todo lo del plan mensual", "Ahorra un 22%", "Fermentos del Mundo", "Canal privado de Telegram", "Cancela cuando quieras"],
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
      <section aria-label="Receta anti-ansiedad gratuita" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              No compres aún si no estás seguro
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] leading-tight">
              Prueba antes.{" "}
              <span className="italic font-light">Una receta anti-ansiedad, gratis.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">

            {/* ── Tarjeta receta ── */}
            <div className="rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: '#2d0f16' }}>
              {/* Header receta */}
              <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(74,123,107,0.25)', color: '#7BBFAA' }}>
                    Anti-ansiedad
                  </span>
                  <span className="text-[10px] font-light" style={{ color: 'rgba(245,240,232,0.3)' }}>· 20 min · fácil</span>
                </div>
                <p className="font-serif text-xl font-bold leading-snug" style={{ color: '#F5F0E8' }}>
                  Curry suave de garbanzos con espinacas y cúrcuma
                </p>
              </div>

              {/* Snippet científico */}
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-2.5">
                  <FlaskConical size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#C9A84C' }}>La ciencia detrás</p>
                    <p className="text-xs font-light leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
                      Los garbanzos son una de las fuentes vegetales más ricas en triptófano, el aminoácido precursor de la serotonina. La curcumina de la cúrcuma inhibe la enzima IDO — la misma que el estrés crónico activa para desviar el triptófano hacia la ruta de la quinurenina, alejándolo de la serotonina. Combinarlos no es casualidad: es bioquímica aplicada al plato.
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                      Triptófano · Curcumina · Quinurenina
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de compra */}
              <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  Lista de compra
                </p>
                <ul className="space-y-1.5">
                  {[
                    '400 g de garbanzos cocidos (bote o remojados)',
                    '100 g de espinacas frescas o baby',
                    '1 lata de leche de coco (400 ml)',
                    '1 cebolla · 3 dientes de ajo · jengibre fresco',
                    '1 cdta de cúrcuma · 1 cdta de comino · pimienta negra',
                    'Aceite de oliva · sal · arroz integral para acompañar',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs font-light" style={{ color: 'rgba(245,240,232,0.55)' }}>
                      <span style={{ color: '#4A7B6B' }} className="shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Slow Food·Mood */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  ¿Te gusta este estilo?
                </p>
                <p className="text-sm font-semibold mb-1" style={{ color: '#F5F0E8' }}>
                  Slow Food·Mood — 21 días de recetas como esta
                </p>
                <p className="text-xs font-light mb-4" style={{ color: 'rgba(245,240,232,0.5)' }}>
                  21 recetas funcionales para la ansiedad · audios de contexto científico · tracking emocional diario · informe final personalizado.
                </p>
                <Link
                  href="/retos/slow-food-mood"
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-all hover:opacity-80"
                  style={{ color: '#7BBFAA' }}
                >
                  Ver el reto — 29€ pago único <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* ── Formulario newsletter ── */}
            <div className="flex flex-col justify-center gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-3" style={{ color: "rgba(107,39,55,0.4)" }}>
                  Newsletter semanal
                </p>
                <p className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-3" style={{ color: '#2d0f16' }}>
                  Una receta como esta en tu correo cada semana.
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>
                  Correlaciones entre alimentos y estado de ánimo, ciencia del eje intestino-cerebro y recetas funcionales. Sin spam, sin ruido.
                </p>
              </div>
              <NewsletterForm source="home-lead-magnet" dark={false} />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {["Sin spam", "Cancelas cuando quieras", "Un email a la semana"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
                    <Check className="w-3 h-3" style={{ color: "#C9A84C" }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
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
                Retos desde 19€ · Planes premium desde 7€/mes · Cancelas cuando quieras
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
