"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, ArrowRight, Check } from "lucide-react"
import { NewsletterForm } from "@/components/layout/NewsletterForm"

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "¿Esto es una dieta?",
    a: "No. Food·Mood no tiene listas de alimentos prohibidos, objetivos de peso ni conteo de calorías. Te proponemos recetas diseñadas para cómo te sientes hoy — sin etiquetas de bueno o malo, sin restricciones.",
  },
  {
    q: "¿Para quién está pensado?",
    a: "Principalmente para mujeres a partir de los 40 años que sienten que su cuerpo está cambiando — sueño irregular, niebla mental, sofocos, cambios de humor, digestiones lentas. También para cualquier persona que quiera entender mejor la conexión entre lo que come y cómo se siente.",
  },
  {
    q: "¿Necesito conocimientos de cocina?",
    a: "No. Las recetas son de 20-30 minutos, 5-7 ingredientes, y se adaptan a tu nivel de energía del día. Si puedes hervir agua, puedes hacer cualquier receta de Food·Mood.",
  },
  {
    q: "¿Es compatible con dieta vegana, vegetariana o sin gluten?",
    a: "Sí. Cada receta tiene alternativas sin gluten, sin lácteos y veganas claramente marcadas. El check-in diario lo tiene en cuenta para personalizarte mejor.",
  },
  {
    q: "¿Cuándo empiezo a notar algo?",
    a: "La mayoría nota algo diferente entre el día 3 y el día 4. El cambio que se sostiene aparece en la segunda o tercera semana, cuando el microbioma empieza a reorganizarse. En 90 días tu microbiota puede ser otra. Tu sueño puede mejorar antes.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí. El plan premium mensual es suscripción y puedes cancelarlo en cualquier momento desde tu perfil, sin penalización. El test y una receta diaria básica son gratis para siempre.",
  },
  {
    q: "¿Sustituye a la atención médica o psicológica?",
    a: "No. Food·Mood es una herramienta de bienestar basada en evidencia nutricional, no un tratamiento médico. Si tienes síntomas que te preocupan o un diagnóstico, consúltalo siempre con tu médica o especialista.",
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

// ─── Animation helpers ────────────────────────────────────────────────────────
const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

// ─── FAQ item ─────────────────────────────────────────────────────────────────
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

// ─── Phone screens ────────────────────────────────────────────────────────────
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
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(107,39,55,0.6)" }}>Pregunta 2 de 8</p>
      <h3 className="font-serif text-xs font-bold leading-snug mb-4" style={{ color: "#2d0f16" }}>¿Cómo te sientes ahora mismo?</h3>
      <div className="flex flex-col gap-1.5">
        {[
          { e: "⚡", l: "Activo y con energía", s: true },
          { e: "🌿", l: "Tranquilo y en calma", s: false },
          { e: "😰", l: "Con ansiedad", s: false },
          { e: "😔", l: "Sin energía", s: false },
        ].map(o => (
          <div key={o.l} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-medium"
            style={o.s ? { backgroundColor: "#C9A84C", color: "#2d0f16" } : { backgroundColor: "rgba(107,39,55,0.08)", color: "rgba(107,39,55,0.82)" }}>
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
      <div className="flex justify-between items-center text-[8px] font-medium pt-8 pb-4" style={{ color: "rgba(245,240,232,0.55)" }}>
        <span>9:41</span><span>●●●</span>
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.9)" }}>Tu paleta de hoy</p>
      <h3 className="font-serif text-xs font-bold text-white leading-snug mb-5">
        Estado dominante: <span style={{ color: "#C9A84C" }}>Calma</span>
      </h3>
      <div className="flex flex-col gap-3 mb-4">
        {[
          { label: "Calma", pct: 68, color: "#5A9B8A" },
          { label: "Foco", pct: 32, color: "#4A7AB5" },
          { label: "Energía", pct: 18, color: "#C9A84C" },
        ].map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[8px] mb-1">
              <span style={{ color: "rgba(245,240,232,0.8)" }}>{b.label}</span>
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
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center text-[8px] font-medium pt-8 px-4" style={{ color: "rgba(245,240,232,0.6)" }}>
          <span>9:41</span><span>●●●</span>
        </div>
        <div className="px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest mb-1" style={{ backgroundColor: "rgba(90,155,138,0.25)", color: "#5A9B8A" }}>Calma</div>
        <p className="font-serif text-[10px] font-bold text-white text-center px-4 leading-tight">Bowl de miso y aguacate</p>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2">
        <p className="text-[8px] font-light" style={{ color: "rgba(107,39,55,0.7)" }}>Para tu estado de hoy</p>
        <div className="flex flex-col gap-1">
          {["Triptófano → serotonina","Omega-3 antiinflamatorio","Magnesio nervioso central"].map(item => (
            <div key={item} className="flex items-start gap-1.5 text-[8px]" style={{ color: "rgba(107,39,55,0.85)" }}>
              <span style={{ color: "#C9A84C" }}>·</span>{item}
            </div>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {["🥑 Aguacate","🍶 Miso","🌿 Cilantro"].map(ing => (
            <span key={ing} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(107,39,55,0.10)", color: "rgba(107,39,55,0.78)" }}>{ing}</span>
          ))}
        </div>
        <div className="flex gap-2 text-[7px]" style={{ color: "rgba(107,39,55,0.62)" }}>
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
        opacity: dimmed ? 0.82 : 1,
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
  const [testimoniosOpen, setTestimoniosOpen] = useState(false)

  // WebMCP — expose site tools to AI agents via the browser
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return
    type MC = { registerTool: (tool: object, opts?: object) => void }
    const mc = (navigator as unknown as { modelContext: MC }).modelContext
    const ac = new AbortController()

    mc.registerTool({
      name: 'search_recipes',
      title: 'Search Food·Mood recipes',
      description: 'Search functional recipes by emotional state or ingredient.',
      inputSchema: {
        type: 'object',
        properties: {
          mood:  { type: 'string', description: 'Emotional state — e.g. ansiedad, calma, energía, foco, sueño' },
          query: { type: 'string', description: 'Free-text ingredient or keyword' },
        },
      },
      execute: async (input: { mood?: string; query?: string }) => {
        const params = new URLSearchParams()
        if (input.mood)  params.set('mood', input.mood)
        if (input.query) params.set('q', input.query)
        const res = await fetch(`/api/recetas?${params}`)
        if (!res.ok) return { error: 'Failed to fetch recipes' }
        return res.json()
      },
      annotations: { readOnlyHint: true },
    }, { signal: ac.signal })

    mc.registerTool({
      name: 'start_mood_test',
      title: 'Start the Food·Mood emotional quiz',
      description: 'Navigates the user to the emotional-state quiz that recommends personalised functional recipes.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        window.location.href = '/test'
        return { navigating: true, url: '/test' }
      },
    }, { signal: ac.signal })

    mc.registerTool({
      name: 'subscribe_newsletter',
      title: 'Subscribe to Food·Mood newsletter',
      description: 'Subscribe an email address to the weekly Food·Mood newsletter.',
      inputSchema: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', description: 'Email address to subscribe' },
        },
        required: ['email'],
      },
      execute: async (input: { email: string }) => {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input.email, source: 'webmcp' }),
        })
        if (!res.ok) return { error: 'Subscription failed' }
        return { success: true, message: 'Subscribed to Food·Mood newsletter' }
      },
      annotations: { untrustedContentHint: false },
    }, { signal: ac.signal })

    return () => ac.abort()
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F0E8] overflow-hidden font-sans font-light">

      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Cómo funciona Food·Mood",
        description: "Acompañamiento nutricional basado en el eje intestino-cerebro para mujeres 40+.",
        step: [
          { "@type": "HowToStep", position: 1, name: "Cuéntale cómo estás", text: "Dos minutos. Sin tecnicismos. Cómo te sientes hoy y qué te preocupa." },
          { "@type": "HowToStep", position: 2, name: "Recibe tu propuesta del día", text: "Una receta, una microacción y una explicación corta del porqué." },
          { "@type": "HowToStep", position: 3, name: "Vuelve mañana", text: "Cuanto más la usas, más te conoce. Cuanto más te conoce, mejor te acompaña." },
        ],
      }) }} />

      {/* ── 1. HERO ───────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1a0910" }}
      >
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero/hero-neurogastronomy.jpg')", opacity: 0.12 }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(26,9,16,0.97) 0%, rgba(26,9,16,0.82) 100%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* ── LEFT: copy ───────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {/* Eyebrow badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.22)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: "#C9A84C" }}>
                  Nutrición psicoactiva · Femtech
                </span>
              </div>

              {/* H1 */}
              <h1 className="font-serif text-3xl md:text-[2.6rem] lg:text-5xl font-bold text-white leading-[1.1] mb-6">
                Hay días en los que la misma comida no te cuida igual.
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg font-light leading-relaxed mb-10" style={{ color: "rgba(245,240,232,0.72)" }}>
                Tu estado emocional, hormonal y mental cambia lo que necesitas y cómo te sienta cada alimento. Por eso, antes de recomendarte recetas, Food·Mood empieza por conocerte.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#C9A84C", color: "#1a0910" }}
                >
                  Descubrir mi perfil
                </Link>
                <button
                  onClick={() => document.getElementById("sintomas")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 text-sm font-light transition-opacity hover:opacity-70 bg-transparent border-none cursor-pointer"
                  style={{ color: "rgba(245,240,232,0.55)" }}
                >
                  Ver cómo funciona <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* ── RIGHT: phone mockups ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
                La app · Simple. Personal. Tuya.
              </p>

              <div className="flex items-end justify-center gap-4 w-full">
                {/* Test phone */}
                <div className="flex flex-col items-center gap-3" style={{ width: 160 }}>
                  <PhoneMockup screen="test" dimmed />
                  <p className="text-[11px] font-light" style={{ color: "rgba(245,240,232,0.55)" }}>Test emocional</p>
                </div>
                {/* Paleta phone — featured */}
                <div className="flex flex-col items-center gap-3" style={{ width: 180 }}>
                  <PhoneMockup screen="paleta" featured />
                  <p className="text-[11px] font-light" style={{ color: "rgba(245,240,232,0.82)" }}>Tu paleta emocional</p>
                </div>
              </div>

              <p className="text-[9px] font-light mt-4" style={{ color: "rgba(245,240,232,0.28)" }}>
                Interfaz real · Sin filtros
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-y-3 gap-x-0">
          {[
            { icon: "🧬", text: "Basado en psiconutrición y cronobiología" },
            { icon: "🌙", text: "Adaptado a tu ciclo menstrual" },
            { icon: "🧠", text: "Eje intestino–cerebro" },
            { icon: "🔒", text: "Tus datos, siempre privados" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-6 md:border-r last:border-r-0" style={{ borderColor: "rgba(107,39,55,0.12)" }}>
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.58)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. ¿TE IDENTIFICAS? ──────────────────────────────────────────────── */}
      <section id="sintomas" aria-label="Síntomas de perimenopausia y menopausia" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.45)" }}>
              Síntomas
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight mb-12">
              ¿Te identificas con alguno de estos?
            </motion.h2>

            <motion.div variants={fade} className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 mb-12">
              {[
                "Sofocos y sudoración nocturna",
                "Sueño que se rompe entre las 3 y las 5",
                "Niebla mental, «no encuentro la palabra»",
                "Ansiedad que aparece sin causa clara",
                "Tristeza sin nombre, irritabilidad fácil",
                "Peso que cambia aunque comas igual que antes",
                "Hinchazón abdominal, digestiones lentas",
                "Dolor articular, hombro o cadera que no se va",
                "Sequedad de piel, ojos, mucosas",
                "Migrañas que cambian de patrón",
                "Caída de pelo, cambios en uñas",
                "Cansancio que no se quita con dormir",
                "Antojos al final del día que no controlas",
                "Libido baja, ausente o cambiante",
              ].map((symptom) => (
                <div
                  key={symptom}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: "1px solid rgba(107,39,55,0.07)" }}
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#6B2737" }} />
                  <span className="text-sm font-light" style={{ color: "rgba(107,39,55,0.72)" }}>{symptom}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fade} className="rounded-2xl px-8 py-8" style={{ backgroundColor: "rgba(107,39,55,0.05)", border: "1px solid rgba(107,39,55,0.1)" }}>
              <p className="text-base font-light leading-relaxed mb-6" style={{ color: "rgba(107,39,55,0.72)" }}>
                Si has marcado dos o más, hay una transición en curso —perimenopausia o menopausia— que probablemente nadie te ha explicado a fondo. Empieza por el test y le ponemos nombre.
              </p>
              <Link
                href="/test"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:brightness-110"
                style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
              >
                Hacer el test gratis <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. TRES COSAS QUE TE DA ──────────────────────────────────────────── */}
      <section aria-label="Qué te ofrece Food·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.55)" }}>
              Qué te ofrecemos
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Tres cosas que la app te da,{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>todos los días.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Entiendes lo que te pasa.",
                body: "Cada vez que abres la app, te explicamos —con palabras claras, no con tecnicismos— qué está haciendo tu cuerpo y por qué. Sin diagnosticar. Sin asustar.",
                color: "#C9A84C",
              },
              {
                num: "02",
                title: "Sabes qué comer hoy.",
                body: "Una receta diseñada para cómo te sientes en este momento, con ingredientes que la ciencia conecta con tu sueño, tu estado de ánimo, tus hormonas y tu energía. Sin pesar nada. Sin contar nada.",
                color: "#5A9B8A",
              },
              {
                num: "03",
                title: "Aprendes tus patrones.",
                body: "Día a día empiezas a ver qué te sienta bien y qué no —tu sueño, tu digestión, tu energía—. No es báscula. Es información que te devuelve la confianza en tu cuerpo.",
                color: "#A07BBE",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="rounded-2xl p-7"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${item.color}22` }}
              >
                <span className="font-mono text-xs mb-5 block" style={{ color: `${item.color}80` }}>{item.num}</span>
                <h3 className="font-serif text-xl font-semibold mb-3 leading-snug" style={{ color: "#F5F0E8" }}>{item.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.58)" }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CÓMO FUNCIONA — 3 PASOS ───────────────────────────────────────── */}
      <section id="como-funciona" aria-label="Cómo funciona Food·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Cómo funciona
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight max-w-xl">
              Tres pasos.{" "}
              <em className="font-light italic" style={{ color: "#6B2737" }}>Empiezas hoy.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                num: "01",
                title: "Cuéntale cómo estás.",
                body: "Dos minutos. Sin tecnicismos. Cómo te sientes hoy y qué te preocupa.",
                tag: "2 min · Sin registro",
                color: "#6B2737",
                bg: "rgba(107,39,55,0.04)",
              },
              {
                num: "02",
                title: "Recibe tu propuesta del día.",
                body: "Una receta, una microacción y una explicación corta de por qué eso ayuda a tu cuerpo hoy.",
                tag: "Personalizada · Funcional",
                color: "#5A9B8A",
                bg: "rgba(90,155,138,0.06)",
              },
              {
                num: "03",
                title: "Vuelve mañana.",
                body: "Cuanto más la usas, más te conoce. Cuanto más te conoce, mejor te acompaña.",
                tag: "90 días · Patrones reales",
                color: "#4A7AB5",
                bg: "rgba(74,122,181,0.06)",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{ backgroundColor: step.bg, border: `1px solid ${step.color}18` }}
              >
                <span
                  className="absolute top-4 right-5 font-serif font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(52px,8vw,80px)", color: step.color, opacity: 0.1 }}
                >
                  {step.num}
                </span>
                <span
                  className="inline-block text-[9px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full mb-5"
                  style={{ backgroundColor: `${step.color}12`, color: step.color, border: `1px solid ${step.color}22` }}
                >
                  {step.tag}
                </span>
                <p className="font-mono text-[10px] mb-2" style={{ color: step.color }}>{step.num}</p>
                <h3 className="font-serif text-xl font-semibold mb-3 leading-snug" style={{ color: "#2d0f16" }}>{step.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.58)" }}>{step.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
            >
              Hacer el test gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/como-funciona"
              className="text-sm font-light transition-opacity hover:opacity-60"
              style={{ color: "rgba(107,39,55,0.5)" }}
            >
              Ver el método en detalle →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. LO QUE FOOD·MOOD NO ES ───────────────────────────────────────── */}
      <section aria-label="Lo que Food·Mood no es" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#111009" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.45)" }}>
              Aclaramos
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Lo que Food·Mood no es.
            </h2>
          </div>

          <div>
            {[
              {
                title: "No es una dieta.",
                body: "No vas a contar calorías, no te vamos a poner objetivos de peso, no vas a «ser buena» o «ser mala» según lo que comas. Esto no va de bajar kilos.",
                color: "#C9A84C",
              },
              {
                title: "No es una promesa milagro.",
                body: "Lo que ofrecemos es acompañamiento real, basado en lo que la ciencia sabe hoy. Algunas cosas las sabemos mucho. Otras menos. Te lo decimos cuando es así.",
                color: "#5A9B8A",
              },
              {
                title: "No es un sustituto de tu médica o tu psicóloga.",
                body: "Es algo que va en paralelo, que cuida lo que muchas veces nadie cuida: tu día a día, en la cocina y en el cuerpo.",
                color: "#A07BBE",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-7 py-9"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="shrink-0 w-0.5 rounded-full mt-1 self-stretch" style={{ backgroundColor: item.color, minHeight: "1.5rem" }} />
                <div>
                  <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 leading-snug" style={{ color: "#F5F0E8" }}>{item.title}</h3>
                  <p className="text-base font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.58)" }}>{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. POR QUÉ CONFIAR ───────────────────────────────────────────────── */}
      <section aria-label="Por qué confiar en Food·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-6"
            >
              <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
                Base científica
              </motion.p>
              <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
                Por qué confiar en lo que la app te dice.
              </motion.h2>
              <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
                Detrás de cada recomendación hay diez años de literatura científica sobre perimenopausia, microbiota, sueño, eje intestino-cerebro y psicología nutricional. Un equipo experto en perimenopausia, microbiota y longevidad revisa cada protocolo. Cuando algo no tiene evidencia clara, te lo decimos. Cuando algo es solo una idea, lo marcamos.
              </motion.p>
              <motion.p variants={fade} className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.42)" }}>
                No somos una caja negra: la IA aprende, las expertas supervisan.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <blockquote
                className="relative rounded-2xl p-8 md:p-10"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.15)" }}
              >
                <span
                  className="absolute top-5 left-8 font-serif text-7xl leading-none select-none"
                  style={{ color: "rgba(201,168,76,0.12)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="font-serif text-2xl md:text-3xl font-semibold text-white leading-snug pt-5 relative z-10">
                  Los hábitos duraderos no se crean con disciplina.{" "}
                  <em className="font-light italic" style={{ color: "#C9A84C" }}>Se crean con placer.</em>
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. EMPIEZA GRATIS ────────────────────────────────────────────────── */}
      <section aria-label="Empieza gratis" className="py-20 md:py-24 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "rgba(107,39,55,0.4)" }}>
              Acceso
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight">
              Empieza gratis hoy.
            </motion.h2>
            <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
              El test, una receta diaria y la guía básica son gratis para siempre.
              El acompañamiento personalizado completo —con la IA que te conoce y el seguimiento de tus patrones— son 9€/mes. Lo cancelas cuando quieras.
            </motion.p>
            <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/test"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
              >
                Empezar gratis
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-light border transition-all hover:opacity-75"
                style={{ borderColor: "rgba(107,39,55,0.22)", color: "rgba(107,39,55,0.58)" }}
              >
                Ver detalle de planes
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 8. TESTIMONIOS ───────────────────────────────────────────────────── */}
      <section aria-label="Testimonios" className="py-8 md:py-10 px-6" style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setTestimoniosOpen(o => !o)}
            className="w-full flex items-center justify-between gap-4 py-3 group"
            aria-expanded={testimoniosOpen}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
              {[
                { name: "Sofía M.", tag: "Usuaria, 48 años" },
                { name: "Laura P.", tag: "Usuaria, 52 años" },
                { name: "Carmen V.", tag: "Usuaria, 45 años" },
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{t.name}</span>
                  <span className="text-[10px] font-light" style={{ color: "rgba(107,39,55,0.38)" }}>{t.tag}</span>
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1.5 shrink-0 text-xs font-light" style={{ color: "rgba(107,39,55,0.45)" }}>
              {testimoniosOpen ? "Ocultar" : "Ver opiniones"}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${testimoniosOpen ? "rotate-180" : ""}`}
                style={{ color: "#C9A84C" }}
              />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {testimoniosOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-6 pt-6">
                  {[
                    { quote: "Llevaba dos años durmiendo fatal y pensaba que era estrés. Cuando entendí la conexión con lo que comía, todo cambió.", name: "Sofía M.", tag: "Usuaria, 48 años" },
                    { quote: "Lo que más me ayudó fue entender que no estaba exagerando. Había nombres para lo que sentía y cosas concretas que podía hacer.", name: "Laura P.", tag: "Usuaria, 52 años" },
                    { quote: "Por fin una app que no me pide que cuente calorías ni que sea perfecta. Solo me pide que cuide cómo me siento.", name: "Carmen V.", tag: "Usuaria, 45 años" },
                  ].map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-7 flex flex-col gap-4"
                      style={{ backgroundColor: "white", border: "1px solid rgba(107,39,55,0.08)" }}
                    >
                      <p className="text-sm font-light leading-relaxed italic" style={{ color: "rgba(107,39,55,0.72)" }}>
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{t.name}</p>
                        <p className="text-[10px] font-light mt-0.5" style={{ color: "rgba(107,39,55,0.45)" }}>{t.tag}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── 9. NEWSLETTER ────────────────────────────────────────────────────── */}
      <section aria-label="Newsletter semanal" className="px-6 py-14" style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.07)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "rgba(107,39,55,0.4)" }}>
                Newsletter semanal
              </p>
              <p className="font-serif text-2xl md:text-3xl font-bold leading-snug" style={{ color: "#2d0f16" }}>
                Una receta funcional cada semana. Sin spam.
              </p>
              <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.6)" }}>
                Ciencia del eje intestino-cerebro, fermentos y recetas funcionales — explicados sin tecnicismos. Un email a la semana.
              </p>
            </div>
            <div className="space-y-4">
              <NewsletterForm source="home-newsletter" dark={false} />
              <div className="flex flex-wrap gap-x-6 gap-y-2">
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

      {/* ── 10. FAQ ──────────────────────────────────────────────────────────── */}
      <section aria-label="Preguntas frecuentes" className="py-20 md:py-28 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Preguntas frecuentes
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] leading-tight">
              Las dudas más habituales.
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

      {/* ── 11. CIERRE ───────────────────────────────────────────────────────── */}
      <section aria-label="Cierre" className="py-24 md:py-32 px-6" style={{ backgroundColor: "#1a0910" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-7"
          >
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-white leading-tight">
              En 90 días tu microbiota es otra.{" "}
              <br className="hidden md:block" />
              <span style={{ color: "#C9A84C" }}>Tu sueño puede cambiar antes.</span>
            </motion.h2>
            <motion.p variants={fade} className="text-base font-light" style={{ color: "rgba(245,240,232,0.55)" }}>
              Empieza hoy con dos minutos. Sin registro. Sin compromiso.
            </motion.p>
            <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/test"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#C9A84C", color: "#1a0910" }}
              >
                Hacer el test gratis
              </Link>
              <Link
                href="/como-funciona"
                className="text-sm font-light transition-opacity hover:opacity-60"
                style={{ color: "rgba(245,240,232,0.4)" }}
              >
                o conoce el método primero →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
