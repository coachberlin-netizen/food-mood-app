"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"

// â”€â”€â”€ FAQ data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FAQS = [
  {
    q: "Â¿Esto es una dieta?",
    a: "No. FoodÂ·Mood no tiene listas de alimentos prohibidos, objetivos de peso ni conteo de calorÃ­as. Te proponemos recetas diseÃ±adas para cÃ³mo te sientes hoy â€” sin etiquetas de bueno o malo, sin restricciones.",
  },
  {
    q: "Â¿Para quiÃ©n estÃ¡ pensado?",
    a: "Principalmente para mujeres a partir de los 40 aÃ±os que sienten que su cuerpo estÃ¡ cambiando â€” sueÃ±o irregular, niebla mental, sofocos, cambios de humor, digestiones lentas. TambiÃ©n para cualquier persona que quiera entender mejor la conexiÃ³n entre lo que come y cÃ³mo se siente.",
  },
  {
    q: "Â¿Necesito conocimientos de cocina?",
    a: "No. Las recetas son de 20-30 minutos, 5-7 ingredientes, y se adaptan a tu nivel de energÃ­a del dÃ­a. Si puedes hervir agua, puedes hacer cualquier receta de FoodÂ·Mood.",
  },
  {
    q: "Â¿Es compatible con dieta vegana, vegetariana o sin gluten?",
    a: "SÃ­. Cada receta tiene alternativas sin gluten, sin lÃ¡cteos y veganas claramente marcadas. El check-in diario lo tiene en cuenta para personalizarte mejor.",
  },
  {
    q: "Â¿CuÃ¡ndo empiezo a notar algo?",
    a: "La mayorÃ­a nota algo diferente entre el dÃ­a 3 y el dÃ­a 4. El cambio que se sostiene aparece en la segunda o tercera semana, cuando el microbioma empieza a reorganizarse. En 90 dÃ­as tu microbiota puede ser otra. Tu sueÃ±o puede mejorar antes.",
  },
  {
    q: "Â¿Puedo cancelar cuando quiera?",
    a: "SÃ­. El plan premium mensual es suscripciÃ³n y puedes cancelarlo en cualquier momento desde tu perfil, sin penalizaciÃ³n. El test y una receta diaria bÃ¡sica son gratis para siempre.",
  },
  {
    q: "Â¿Sustituye a la atenciÃ³n mÃ©dica o psicolÃ³gica?",
    a: "No. FoodÂ·Mood es una herramienta de bienestar basada en evidencia nutricional, no un tratamiento mÃ©dico. Si tienes sÃ­ntomas que te preocupan o un diagnÃ³stico, consÃºltalo siempre con tu mÃ©dica o especialista.",
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

// â”€â”€â”€ Animation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

// â”€â”€â”€ FAQ item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ Phone screens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TestScreen() {
  return (
    <div className="h-full flex flex-col p-4" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="flex justify-between items-center text-[8px] font-medium pt-8 pb-4" style={{ color: "rgba(45,15,22,0.3)" }}>
        <span>9:41</span><span>â—â—â—</span>
      </div>
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: i < 2 ? "#C9A84C" : "rgba(107,39,55,0.12)" }} />
        ))}
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(107,39,55,0.6)" }}>Pregunta 2 de 8</p>
      <h3 className="font-serif text-xs font-bold leading-snug mb-4" style={{ color: "#2d0f16" }}>Â¿CÃ³mo te sientes ahora mismo?</h3>
      <div className="flex flex-col gap-1.5">
        {[
          { e: "âš¡", l: "Activo y con energÃ­a", s: true },
          { e: "ðŸŒ¿", l: "Tranquilo y en calma", s: false },
          { e: "ðŸ˜°", l: "Con ansiedad", s: false },
          { e: "ðŸ˜”", l: "Sin energÃ­a", s: false },
        ].map(o => (
          <div key={o.l} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-medium"
            style={o.s ? { backgroundColor: "#C9A84C", color: "#2d0f16" } : { backgroundColor: "rgba(107,39,55,0.08)", color: "rgba(107,39,55,0.82)" }}>
            <span>{o.e}</span><span>{o.l}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-3">
        <div className="w-full py-2.5 rounded-xl text-[9px] font-bold text-center text-white" style={{ backgroundColor: "#6B2737" }}>Siguiente â†’</div>
      </div>
    </div>
  )
}

function PaletaScreen() {
  return (
    <div className="h-full flex flex-col p-4" style={{ backgroundColor: "#1e0d12" }}>
      <div className="flex justify-between items-center text-[8px] font-medium pt-8 pb-4" style={{ color: "rgba(245,240,232,0.55)" }}>
        <span>9:41</span><span>â—â—â—</span>
      </div>
      <p className="text-[8px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.9)" }}>Tu paleta de hoy</p>
      <h3 className="font-serif text-xs font-bold text-white leading-snug mb-5">
        Estado dominante: <span style={{ color: "#C9A84C" }}>Calma</span>
      </h3>
      <div className="flex flex-col gap-3 mb-4">
        {[
          { label: "Calma", pct: 68, color: "#5A9B8A" },
          { label: "Foco", pct: 32, color: "#4A7AB5" },
          { label: "EnergÃ­a", pct: 18, color: "#C9A84C" },
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
        <div className="w-full py-2.5 rounded-xl text-[9px] font-bold text-center" style={{ backgroundColor: "#C9A84C", color: "#1e0d12" }}>Ver receta del dÃ­a â†’</div>
      </div>
    </div>
  )
}

function RecetaScreen() {
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="h-24 flex flex-col items-center justify-end pb-3 relative" style={{ backgroundColor: "#2d0f16" }}>
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center text-[8px] font-medium pt-8 px-4" style={{ color: "rgba(245,240,232,0.6)" }}>
          <span>9:41</span><span>â—â—â—</span>
        </div>
        <div className="px-2 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest mb-1" style={{ backgroundColor: "rgba(90,155,138,0.25)", color: "#5A9B8A" }}>Calma</div>
        <p className="font-serif text-[10px] font-bold text-white text-center px-4 leading-tight">Bowl de miso y aguacate</p>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2">
        <p className="text-[8px] font-light" style={{ color: "rgba(107,39,55,0.7)" }}>Para tu estado de hoy</p>
        <div className="flex flex-col gap-1">
          {["TriptÃ³fano â†’ serotonina","Omega-3 antiinflamatorio","Magnesio nervioso central"].map(item => (
            <div key={item} className="flex items-start gap-1.5 text-[8px]" style={{ color: "rgba(107,39,55,0.85)" }}>
              <span style={{ color: "#C9A84C" }}>Â·</span>{item}
            </div>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {["ðŸ¥‘ Aguacate","ðŸ¶ Miso","ðŸŒ¿ Cilantro"].map(ing => (
            <span key={ing} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(107,39,55,0.10)", color: "rgba(107,39,55,0.78)" }}>{ing}</span>
          ))}
        </div>
        <div className="flex gap-2 text-[7px]" style={{ color: "rgba(107,39,55,0.62)" }}>
          <span>â± 20 min</span><span>ðŸŒ± Vegano</span>
        </div>
        <div className="mt-auto">
          <div className="w-full py-2 rounded-xl text-[8px] font-bold text-center text-white" style={{ backgroundColor: "#6B2737" }}>Ver receta completa â†’</div>
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

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Home() {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set())
  const toggleFaq = (i: number) => setOpenFaqs(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })
  const [testimoniosOpen, setTestimoniosOpen] = useState(false)

  // WebMCP â€” expose site tools to AI agents via the browser
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('modelContext' in navigator)) return
    type MC = { registerTool: (tool: object, opts?: object) => void }
    const mc = (navigator as unknown as { modelContext: MC }).modelContext
    const ac = new AbortController()

    mc.registerTool({
      name: 'search_recipes',
      title: 'Search FoodÂ·Mood recipes',
      description: 'Search functional recipes by emotional state or ingredient.',
      inputSchema: {
        type: 'object',
        properties: {
          mood:  { type: 'string', description: 'Emotional state â€” e.g. ansiedad, calma, energÃ­a, foco, sueÃ±o' },
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
      title: 'Start the FoodÂ·Mood emotional quiz',
      description: 'Navigates the user to the emotional-state quiz that recommends personalised functional recipes.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => {
        window.location.href = '/test'
        return { navigating: true, url: '/test' }
      },
    }, { signal: ac.signal })

    mc.registerTool({
      name: 'subscribe_newsletter',
      title: 'Subscribe to FoodÂ·Mood newsletter',
      description: 'Subscribe an email address to the weekly FoodÂ·Mood newsletter.',
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
        return { success: true, message: 'Subscribed to FoodÂ·Mood newsletter' }
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
        name: "CÃ³mo funciona FoodÂ·Mood",
        description: "AcompaÃ±amiento nutricional basado en el eje intestino-cerebro para mujeres 40+.",
        step: [
          { "@type": "HowToStep", position: 1, name: "CuÃ©ntale cÃ³mo estÃ¡s", text: "Dos minutos. Sin tecnicismos. CÃ³mo te sientes hoy y quÃ© te preocupa." },
          { "@type": "HowToStep", position: 2, name: "Recibe tu propuesta del dÃ­a", text: "Una receta, una microacciÃ³n y una explicaciÃ³n corta del porquÃ©." },
          { "@type": "HowToStep", position: 3, name: "Vuelve maÃ±ana", text: "Cuanto mÃ¡s la usas, mÃ¡s te conoce. Cuanto mÃ¡s te conoce, mejor te acompaÃ±a." },
        ],
      }) }} />

      {/* â”€â”€ 1. HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

            {/* â”€â”€ LEFT: copy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                  NutriciÃ³n neuroactiva Â· Femtech
                </span>
              </div>

              {/* H1 */}
              <h1 className="font-serif text-3xl md:text-[2.6rem] lg:text-5xl font-bold text-white leading-[1.1] mb-6">
                Hay dÃ­as en los que la misma comida no te cuida igual.
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg font-light leading-relaxed mb-10" style={{ color: "rgba(245,240,232,0.72)" }}>
                Tu estado emocional, hormonal y mental cambia lo que necesitas y cÃ³mo te sienta cada alimento. Por eso, antes de recomendarte recetas, FoodÂ·Mood empieza por conocerte.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#C9A84C", color: "#1a0910" }}
                >
                  Hacer el test gratis
                </Link>
                <button
                  onClick={() => document.getElementById("sintomas")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-1.5 text-sm font-light transition-opacity hover:opacity-70 bg-transparent border-none cursor-pointer"
                  style={{ color: "rgba(245,240,232,0.55)" }}
                >
                  Ver cÃ³mo funciona <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* â”€â”€ RIGHT: phone mockups â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(201,168,76,0.5)" }}>
                La app Â· Simple. Personal. Tuya.
              </p>

              <div className="flex items-end justify-center gap-4 w-full">
                {/* Test phone */}
                <div className="flex flex-col items-center gap-3" style={{ width: 160 }}>
                  <PhoneMockup screen="test" dimmed />
                  <p className="text-[11px] font-light" style={{ color: "rgba(245,240,232,0.55)" }}>Test emocional</p>
                </div>
                {/* Paleta phone â€” featured */}
                <div className="flex flex-col items-center gap-3" style={{ width: 180 }}>
                  <PhoneMockup screen="paleta" featured />
                  <p className="text-[11px] font-light" style={{ color: "rgba(245,240,232,0.82)" }}>Tu paleta emocional</p>
                </div>
              </div>

              <p className="text-[9px] font-light mt-4" style={{ color: "rgba(245,240,232,0.28)" }}>
                Interfaz real Â· Sin filtros
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* â”€â”€ TRUST BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ backgroundColor: "#F5F0E8", borderTop: "1px solid rgba(107,39,55,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-y-3 gap-x-0">
          {[
            { icon: "ðŸ§¬", text: "NutriciÃ³n neuroactiva y cronobiologÃ­a" },
            { icon: "ðŸŒ™", text: "Adaptado a tu ciclo menstrual" },
            { icon: "ðŸ§ ", text: "Eje intestinoâ€“cerebro" },
            { icon: "ðŸ”’", text: "Tus datos, siempre privados" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-6 md:border-r last:border-r-0" style={{ borderColor: "rgba(107,39,55,0.12)" }}>
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.58)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ TRUST PILLS: offline + a11y â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="py-4 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {[
            { icon: "ðŸ“µ", text: "Funciona sin WiFi", href: "/accesibilidad#offline" },
            { icon: "ðŸŒ™", text: "Modo oscuro incluido", href: "/accesibilidad#pantalla" },
            { icon: "â™¿", text: "Accesible â€” WCAG 2.1", href: "/accesibilidad" },
          ].map((pill) => (
            <Link
              key={pill.text}
              href={pill.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-opacity hover:opacity-75"
              style={{
                backgroundColor: "rgba(107,39,55,0.06)",
                border: "1px solid rgba(107,39,55,0.12)",
                color: "rgba(107,39,55,0.65)",
              }}
            >
              <span aria-hidden="true">{pill.icon}</span>
              {pill.text}
            </Link>
          ))}
        </div>
      </div>

      {/* â”€â”€ 2. Â¿TE IDENTIFICAS? â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="sintomas" aria-label="SÃ­ntomas de perimenopausia y menopausia" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.45)" }}>
              SÃ­ntomas
            </motion.p>
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-[#2d0f16] leading-tight mb-12">
              Â¿Te identificas con alguno de estos?
            </motion.h2>

            <motion.div variants={fade} className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 mb-12">
              {[
                "Sofocos y sudoraciÃ³n nocturna",
                "SueÃ±o que se rompe entre las 3 y las 5",
                "Niebla mental, Â«no encuentro la palabraÂ»",
                "Ansiedad que aparece sin causa clara",
                "Tristeza sin nombre, irritabilidad fÃ¡cil",
                "Peso que cambia aunque comas igual que antes",
                "HinchazÃ³n abdominal, digestiones lentas",
                "Dolor articular, hombro o cadera que no se va",
                "Sequedad de piel, ojos, mucosas",
                "MigraÃ±as que cambian de patrÃ³n",
                "CaÃ­da de pelo, cambios en uÃ±as",
                "Cansancio que no se quita con dormir",
                "Antojos al final del dÃ­a que no controlas",
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
                Si has marcado dos o mÃ¡s, hay una transiciÃ³n en curso â€”perimenopausia o menopausiaâ€” que probablemente nadie te ha explicado a fondo. Empieza por el test y le ponemos nombre.
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

      {/* â”€â”€ 3. LONGEVIDAD FEMENINA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Por quÃ© importa lo que comes ahora" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#f7f5f0" }}>
        <div className="max-w-5xl mx-auto">

          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.32em] mb-12"
            style={{ color: "#9e4f6e" }}
          >
            Por quÃ© importa lo que comes ahora
          </motion.p>

          {/* Stat card + narrative */}
          <div className="grid md:grid-cols-2 gap-10 mb-14 items-start">

            {/* Dark stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-2xl p-10 flex flex-col gap-6 relative overflow-hidden"
              style={{ backgroundColor: "#141210", color: "#e8e4dc" }}
            >
              <div
                className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, rgba(158,79,110,0.18) 0%, transparent 70%)" }}
                aria-hidden="true"
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#8a8579" }}>
                GWI 2026 Â· OMS
              </span>
              <div>
                <div className="font-serif leading-none" style={{ fontSize: "clamp(3rem,8vw,5rem)", color: "#fff", letterSpacing: "-0.03em" }}>
                  5 <span className="font-serif italic" style={{ fontSize: "0.52em", color: "rgba(255,255,255,0.42)" }}>aÃ±os mÃ¡s</span>
                </div>
                <p className="text-sm font-light leading-relaxed mt-3" style={{ color: "#8a8579", maxWidth: "26ch" }}>
                  Las mujeres viven mÃ¡s que los hombres, pero pasan mÃ¡s aÃ±os gestionando el declive.
                </p>
              </div>
              <div
                className="rounded-lg p-4 text-sm font-light leading-relaxed"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e4dc" }}
              >
                <strong className="font-semibold" style={{ color: "#fff" }}>No es cuestiÃ³n de longevidad. Es cuestiÃ³n de healthspan.</strong>
                {" "}CuÃ¡ntos de esos aÃ±os se viven con energÃ­a, claridad y bienestar real.
              </div>
            </motion.div>

            {/* Copy narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="flex flex-col gap-6 pt-2"
            >
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-[#1e1b14]" style={{ letterSpacing: "-0.025em" }}>
                Vivir mÃ¡s aÃ±os no es lo mismo que{" "}
                <em className="font-light italic" style={{ color: "#9e4f6e" }}>vivir bien mÃ¡s aÃ±os.</em>
              </h2>
              <p className="text-base font-light leading-relaxed" style={{ color: "#6b6659", maxWidth: "52ch" }}>
                La perimenopausia y la menopausia no son el final de nada: son una transiciÃ³n biolÃ³gica que llega sin manual de instrucciones. Lo que comes â€”y cÃ³mo lo comesâ€” puede cambiar radicalmente cÃ³mo transitas esa etapa. La ciencia lo sabe. FoodÂ·Mood lo traduce.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Perimenopausia y energÃ­a",
                  "SueÃ±o, cortisol y antojos",
                  "Microbiota y claridad mental",
                  "Hormonas y estado de Ã¡nimo",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#fff", border: "1px solid rgba(40,30,10,0.10)", color: "#6b6659" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#9e4f6e" }} aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/test"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#4a7c59", color: "#fff" }}
                >
                  Hacer el test gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/como-funciona"
                  className="text-sm font-medium transition-colors hover:opacity-70 border-b"
                  style={{ color: "#6b6659", borderColor: "rgba(40,30,10,0.12)", paddingBottom: "1px" }}
                >
                  Ver cÃ³mo funciona â†—
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Feature cards row */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: "ðŸ§ ",
                title: "Niebla mental y microbiota",
                body: "El 95% de la serotonina se produce en el intestino. Lo que comes influye directamente en tu claridad mental, memoria y gestiÃ³n emocional.",
              },
              {
                icon: "ðŸŒ™",
                title: "SueÃ±o roto y cortisol",
                body: "El patrÃ³n de despertar entre las 3 y las 5h no es solo estrÃ©s: el cortisol y los estrÃ³genos se regulan tambiÃ©n desde la alimentaciÃ³n.",
              },
              {
                icon: "ðŸ”¥",
                title: "InflamaciÃ³n silenciosa",
                body: "La bajada de estrÃ³genos activa vÃ­as inflamatorias. Ciertos alimentos las apagan. FoodÂ·Mood sabe cuÃ¡les son y cuÃ¡ndo usarlos.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl p-6 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: "#f7f5f0", border: "1px solid rgba(40,30,10,0.09)" }}
              >
                <span className="text-2xl leading-none" aria-hidden="true">{card.icon}</span>
                <h3 className="font-serif text-base font-semibold leading-snug" style={{ color: "#1e1b14" }}>{card.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "#6b6659" }}>{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Science note */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl p-7"
            style={{
              background: "linear-gradient(105deg, #f5e8ee 0%, #fdf6ee 100%)",
              border: "1px solid rgba(158,79,110,0.12)",
            }}
          >
            <span className="text-4xl leading-none shrink-0" aria-hidden="true">ðŸ”¬</span>
            <div>
              <strong className="block font-serif text-lg font-semibold mb-1" style={{ color: "#1e1b14" }}>
                Base cientÃ­fica, no promesas.
              </strong>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#6b6659" }}>
                Cada recomendaciÃ³n estÃ¡ respaldada por literatura sobre perimenopausia, eje intestino-cerebro y psiconutriciÃ³n. Un equipo experto supervisa cada protocolo. Cuando algo no tiene evidencia clara, te lo decimos.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* â”€â”€ 4. TRES COSAS QUE TE DA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}

      <section aria-label="QuÃ© te ofrece FoodÂ·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.55)" }}>
              QuÃ© te ofrecemos
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Tres cosas que la app te da,{" "}
              <em className="font-light italic" style={{ color: "#C9A84C" }}>todos los dÃ­as.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Entiendes lo que te pasa.",
                body: "Cada vez que abres la app, te explicamos â€”con palabras claras, no con tecnicismosâ€” quÃ© estÃ¡ haciendo tu cuerpo y por quÃ©. Sin diagnosticar. Sin asustar.",
                color: "#C9A84C",
              },
              {
                num: "02",
                title: "Sabes quÃ© comer hoy.",
                body: "Una receta diseÃ±ada para cÃ³mo te sientes en este momento, con ingredientes que la ciencia conecta con tu sueÃ±o, tu estado de Ã¡nimo, tus hormonas y tu energÃ­a. Sin pesar nada. Sin contar nada.",
                color: "#5A9B8A",
              },
              {
                num: "03",
                title: "Aprendes tus patrones.",
                body: "DÃ­a a dÃ­a empiezas a ver quÃ© te sienta bien y quÃ© no â€”tu sueÃ±o, tu digestiÃ³n, tu energÃ­aâ€”. No es bÃ¡scula. Es informaciÃ³n que te devuelve la confianza en tu cuerpo.",
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

      {/* â”€â”€ 4. CÃ“MO FUNCIONA â€” 3 PASOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="como-funciona" aria-label="CÃ³mo funciona FoodÂ·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              CÃ³mo funciona
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
                title: "CuÃ©ntale cÃ³mo estÃ¡s.",
                body: "Dos minutos. Sin tecnicismos. CÃ³mo te sientes hoy y quÃ© te preocupa.",
                tag: "2 min Â· Sin registro",
                color: "#6B2737",
                bg: "rgba(107,39,55,0.04)",
              },
              {
                num: "02",
                title: "Recibe tu propuesta del dÃ­a.",
                body: "Una receta, una microacciÃ³n y una explicaciÃ³n corta de por quÃ© eso ayuda a tu cuerpo hoy.",
                tag: "Personalizada Â· Funcional",
                color: "#5A9B8A",
                bg: "rgba(90,155,138,0.06)",
              },
              {
                num: "03",
                title: "Vuelve maÃ±ana.",
                body: "Cuanto mÃ¡s la usas, mÃ¡s te conoce. Cuanto mÃ¡s te conoce, mejor te acompaÃ±a.",
                tag: "90 dÃ­as Â· Patrones reales",
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
              Ver el mÃ©todo en detalle â†’
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ 5. LO QUE FOODÂ·MOOD NO ES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Lo que FoodÂ·Mood no es" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#111009" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(201,168,76,0.45)" }}>
              Aclaramos
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
              Lo que FoodÂ·Mood no es.
            </h2>
          </div>

          <div>
            {[
              {
                title: "No es una dieta.",
                body: "No vas a contar calorÃ­as, no te vamos a poner objetivos de peso, no vas a Â«ser buenaÂ» o Â«ser malaÂ» segÃºn lo que comas. Esto no va de bajar kilos.",
                color: "#C9A84C",
              },
              {
                title: "No es una promesa milagro.",
                body: "Lo que ofrecemos es acompaÃ±amiento real, basado en lo que la ciencia sabe hoy. Algunas cosas las sabemos mucho. Otras menos. Te lo decimos cuando es asÃ­.",
                color: "#5A9B8A",
              },
              {
                title: "No es un sustituto de tu mÃ©dica o tu psicÃ³loga.",
                body: "Es algo que va en paralelo, que cuida lo que muchas veces nadie cuida: tu dÃ­a a dÃ­a, en la cocina y en el cuerpo.",
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

      {/* â”€â”€ 6. POR QUÃ‰ CONFIAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Por quÃ© confiar en FoodÂ·Mood" className="py-20 md:py-28 px-6" style={{ backgroundColor: "#2d0f16" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="space-y-6"
            >
              <motion.p variants={fade} className="text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
                Base cientÃ­fica
              </motion.p>
              <motion.h2 variants={fade} className="font-serif text-3xl md:text-4xl text-white leading-tight">
                Por quÃ© confiar en lo que la app te dice.
              </motion.h2>
              <motion.p variants={fade} className="text-base font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
                DetrÃ¡s de cada recomendaciÃ³n hay diez aÃ±os de literatura cientÃ­fica sobre perimenopausia, microbiota, sueÃ±o, eje intestino-cerebro y psicologÃ­a nutricional. Un equipo experto en perimenopausia, microbiota y longevidad revisa cada protocolo. Cuando algo no tiene evidencia clara, te lo decimos. Cuando algo es solo una idea, lo marcamos.
              </motion.p>
              <motion.p variants={fade} className="text-sm font-semibold tracking-wide mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}>
                <span aria-hidden="true">âœ¦</span>
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
                  Los hÃ¡bitos duraderos no se crean con disciplina.{" "}
                  <em className="font-light italic" style={{ color: "#C9A84C" }}>Se crean con placer.</em>
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€ 7. EMPIEZA GRATIS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              El test, una receta diaria y el glosario son gratis para siempre.
            </motion.p>
            <motion.div variants={fade} className="text-sm font-light text-left max-w-sm mx-auto" style={{ color: "rgba(107,39,55,0.65)" }}>
              <p className="font-semibold mb-3" style={{ color: "rgba(107,39,55,0.8)" }}>Desde 7â‚¬/mes (plan trimestral), tambiÃ©n:</p>
              <ul className="space-y-2 leading-relaxed">
                {[
                  "Recetas generadas para tu mezcla emocional exacta del dÃ­a â€” no una categorÃ­a genÃ©rica",
                  "FOOD-MOOD Guide, tu asistente IA especializada en el eje intestino-cerebro â€” responde sobre recetas, sÃ­ntomas y hÃ¡bitos del dÃ­a",
                  "Historial de tu paleta emocional â€” observa tus patrones semana a semana",
                  "Historial emocional completo â€” observa tus patrones semana a semana",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0 font-normal" style={{ color: "#C9A84C" }}>â€”</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs" style={{ color: "rgba(107,39,55,0.4)" }}>Sin permanencia Â· Cancela cuando quieras.</p>
            </motion.div>
            <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/test"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
              >
                Hacer el test gratis
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

      {/* â”€â”€ 8. TESTIMONIOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                { name: "SofÃ­a M.", tag: "Usuaria, 48 aÃ±os" },
                { name: "Laura P.", tag: "Usuaria, 52 aÃ±os" },
                { name: "Carmen V.", tag: "Usuaria, 45 aÃ±os" },
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
                    { quote: "Llevaba dos aÃ±os durmiendo fatal y pensaba que era estrÃ©s. Cuando entendÃ­ la conexiÃ³n con lo que comÃ­a, todo cambiÃ³.", name: "SofÃ­a M.", tag: "Usuaria, 48 aÃ±os" },
                    { quote: "Lo que mÃ¡s me ayudÃ³ fue entender que no estaba exagerando. HabÃ­a nombres para lo que sentÃ­a y cosas concretas que podÃ­a hacer.", name: "Laura P.", tag: "Usuaria, 52 aÃ±os" },
                    { quote: "Por fin una app que no me pide que cuente calorÃ­as ni que sea perfecta. Solo me pide que cuide cÃ³mo me siento.", name: "Carmen V.", tag: "Usuaria, 45 aÃ±os" },
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

      {/* â”€â”€ 10. FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Preguntas frecuentes" className="py-20 md:py-28 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: "rgba(107,39,55,0.4)" }}>
              Preguntas frecuentes
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2d0f16] leading-tight">
              Las dudas mÃ¡s habituales.
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

      {/* â”€â”€ 11. CIERRE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section aria-label="Cierre" className="py-24 md:py-32 px-6" style={{ backgroundColor: "#1a0910" }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-7"
          >
            <motion.h2 variants={fade} className="font-serif text-3xl md:text-5xl text-white leading-tight">
              En 90 dÃ­as tu microbiota es otra.{" "}
              <br className="hidden md:block" />
              <span style={{ color: "#C9A84C" }}>Tu sueÃ±o puede cambiar antes.</span>
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
                o conoce el mÃ©todo primero â†’
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
