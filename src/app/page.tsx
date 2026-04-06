"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

import { moods } from "@/data/moods"
import { ArrowRight, BookOpen, Mail, Send, Brain, Leaf, Hourglass, FlaskConical } from "lucide-react"
import { useRef, useState } from "react"

export default function Home() {
  const [nlEmail, setNlEmail] = useState('')
  const [nlSent, setNlSent] = useState(false)
  const [nlLoading, setNlLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlEmail || !nlEmail.includes('@')) return
    setNlLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail, source: 'newsletter_hero' }),
      })
    } catch {}
    setNlSent(true)
    setNlLoading(false)
  }

  
  const containerRef = useRef(null)
  
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }
  
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-[var(--background)] overflow-hidden font-sans font-light">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 pt-32 pb-24 bg-aubergine">
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="space-y-12 flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="text-[11px] font-sans tracking-[0.2em] uppercase text-gold">
              ESCUCHA A TU CUERPO
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-serif text-cream leading-[1.2] md:leading-[1.1] tracking-tight">
                Dime cÃ³mo te sientes.<br/>
                <span className="italic font-light text-cream/80">Te devolverÃ© el equilibrio.</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-2xl md:text-3xl text-[#F5F0E8] text-center font-serif">
                Descubre quÃ© comer segÃºn tu mood.
              </motion.p>
            </div>
            
            <motion.p variants={fadeIn} className="text-base text-cream/70 max-w-md mx-auto text-center leading-[1.8] font-sans">
              FoodÂ·Mood es tu guÃ­a de nutriciÃ³n emocional. Haz nuestro test visual â€” o conversa libremente con nuestra IA â€” para recibir orientaciones funcionales, rituales e inspiraciÃ³n culinaria basada en la ciencia.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 items-center pt-8 w-full justify-center">
              <Link href="/test" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-10 py-4 rounded-[8px] font-semibold">
                  Hacer mi test gratis
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>

              <div className="flex flex-col items-center">
                <a href="/sintomas" style={{color:'#C9A84C',fontSize:'0.9rem'}}>Â¿Tienes un sÃ­ntoma concreto? â†’ Encuentra recetas para tu cuerpo</a>
              </div>

              <div className="text-cream/50 text-sm italic font-light px-2 hidden sm:block">o prefiere charlar</div>
              <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="w-full sm:w-auto text-cream/70 hover:text-cream text-sm font-medium transition-colors border border-transparent hover:border-cream/20 bg-cream/5 px-6 py-4 rounded-[8px] flex items-center justify-center gap-2">
                Abrir chat IA
              </button>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div variants={fadeIn} className="w-full max-w-md">
              {nlSent ? (
                <p className="text-sm text-[#C9A84C] font-medium">âœ“ Â¡Suscrito! RecibirÃ¡s tu primera receta esta semana.</p>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-[12px] text-cream/40 font-light mb-1 sm:mb-0 w-full text-center sm:text-left">
                    O Ãºnete al Newsletter para un consejo semanal â†’
                  </p>
                  <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/30" />
                      <input
                        type="email"
                        value={nlEmail}
                        onChange={(e) => setNlEmail(e.target.value)}
                        placeholder="tu email"
                        className="w-full sm:w-48 pl-9 pr-3 py-2.5 rounded-lg bg-cream/10 border border-cream/15 text-cream text-xs placeholder:text-cream/25 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={nlLoading}
                      className="px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <Send className="w-3 h-3" />
                      Suscribirse
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. SECCIÃ“N PROBLEMA */}
      <section className="py-32 md:py-48 bg-cream relative border-t border-aubergine-dark/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={fadeIn}
            className="text-center mb-24"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Origen</h2>
            <h3 className="text-3xl md:text-5xl font-serif italic text-aubergine-dark leading-relaxed max-w-4xl mx-auto">
              &quot;No es falta de voluntad, es bioquÃ­mica. Lo que comes determina cÃ³mo te sientes, y cÃ³mo te sientes dicta quÃ© quieres comer.&quot;
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-32">
            {[
              { title: "Niebla Mental", text: "Te cuesta concentrarte o recordar detalles despuÃ©s de ciertas comidas." },
              { title: "Bajones de EnergÃ­a", text: "Necesitas cafÃ© constantemente y colapsas a media tarde." },
              { title: "Ansiedad Digestiva", text: "Tu estÃ³mago reacciona fÃ­sicamente a tus picos de estrÃ©s." },
              { title: "Antojos Emocionales", text: "Buscas azÃºcar o carbohidratos buscando un abrazo bioquÃ­mico." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-cream p-12 md:p-16 rounded-xl shadow-luxury hover:shadow-luxury-hover border border-transparent transition-all duration-300"
              >
                <h4 className="font-serif font-semibold text-aubergine-dark text-2xl mb-4">{item.title}</h4>
                <p className="text-aubergine-dark/70 text-base leading-[1.8] font-light">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Banner Oscuro */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-aubergine-dark rounded-2xl p-12 md:p-32 text-center text-white relative overflow-hidden"
          >
            <div className="relative z-10 max-w-3xl mx-auto space-y-12">
              <div className="text-[11px] font-sans tracking-[0.2em] uppercase text-cream/70">Tu cuerpo sabe</div>
              <h3 className="text-4xl md:text-6xl font-serif text-cream leading-[1.2]">
                Hay recetas con superpoderes.<br/>
                <span className="italic font-light text-cream/80">Y estÃ¡n buenÃ­simas.</span>
              </h3>
              <p className="text-white/60 text-lg leading-[1.8] font-light">
                Nosotros te damos el mejor sabor para romper el ciclo de inflamaciÃ³n y sentirte genial de verdad, usando ingredientes que hablan directamente con tu nervio vago.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. LOS 6 ESTADOS */}
      <section className="py-32 md:py-48 overflow-hidden bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 mb-24 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Mapa Emocional</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-aubergine-dark">Los 6 Estados FoodÂ·Mood</h3>
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 overflow-hidden">
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }}
            className="flex gap-8 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-6"
          >
            {moods.map((mood) => (
              <motion.div 
                key={mood.id} variants={fadeIn}
                className="min-w-[300px] md:min-w-0 flex-1 bg-cream p-10 rounded-xl shadow-luxury border border-aubergine-dark/20 snap-center group hover:shadow-luxury-hover transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: mood.color }} />
                <div className="w-16 h-16 rounded-full bg-aubergine/10 flex items-center justify-center text-3xl font-serif text-aubergine-dark mb-8 group-hover:bg-aubergine-dark group-hover:text-cream transition-colors duration-500 origin-left">
                  {mood.emoji}
                </div>
                <h4 className="font-serif text-xl md:text-2xl font-semibold mb-4 text-aubergine-dark break-words">{mood.nombre}</h4>
                <p className="text-aubergine-dark/60 text-sm leading-[1.8] font-light">{mood.descripcion_corta}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CÃ“MO FUNCIONA */}
      <section className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center mb-32"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">La MetodologÃ­a</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-aubergine-dark">Â¿CÃ³mo funciona?</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 text-left">
            {[
              { num: "01", title: "El Check-in", text: "CuÃ©ntanos cÃ³mo te sientes. Responde nuestro test visual o habla libremente con el Chat." },
              { num: "02", title: "Tu Mapa", text: "Nuestra tecnologÃ­a mapea por ti tu estado digestivo y mental real." },
              { num: "03", title: "La InspiraciÃ³n", text: "Obtienes una poderosa recomendaciÃ³n funcional (y si eres Premium, desbloqueas su receta Ã­ntegra)." }
            ].map((step, i) => (
              <motion.div 
                key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.15 }}
                className="flex flex-col gap-6"
              >
                <div className="text-6xl font-serif font-light text-aubergine-dark">{step.num}</div>
                <h4 className="text-2xl font-serif font-semibold text-aubergine-dark">{step.title}</h4>
                <p className="text-aubergine-dark/60 leading-[1.8] font-light">{step.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mt-32 max-w-3xl mx-auto flex flex-col items-center text-center gap-6 pt-16 border-t border-aubergine-dark/20"
          >
            <BookOpen className="w-6 h-6 text-aubergine-dark/30" />
            <p className="text-sm text-aubergine-dark/50 leading-[1.8] font-light">
              Las explicaciones cientÃ­ficas de FoodÂ·Mood son simplificaciones divulgativas. Nuestro objetivo es traducir la investigaciÃ³n sobre el eje intestino-cerebro a un lenguaje claro y Ãºtil â€” no sustituir la literatura acadÃ©mica ni la opiniÃ³n de profesionales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4.5 TESTIMONIOS / PRUEBA SOCIAL */}
      <section className="py-24 md:py-32 bg-[var(--background)] border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Lo Dicen Ellos</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark">Historias reales</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                quote: "Llevaba meses con bajones de energía a media tarde. Dos semanas siguiendo las recetas de Reset y he dejado el café de las 5.",
                name: "Laura M.",
                city: "Madrid",
                mood: "Reset"
              },
              {
                quote: "Nunca había conectado mis antojos con el nervio vago. Ahora tiene todo el sentido.",
                name: "Ana P.",
                city: "Barcelona",
                mood: "Calma"
              },
              {
                quote: "Las recetas de Focus me salvaron la semana de ex\u00e1menes. Simple, rico y funcional.",
                name: "Daniel R.",
                city: "Valencia",
                mood: "Focus"
              },
              {
                quote: "A todos nos encantan los snacks nutritivos de la secciÃ³n Familia. Su digestiÃ³n y la mÃ­a han agradecido el cambio sin que sientan 'dietas' extremas.",
                name: "Marta G.",
                city: "Sevilla",
                mood: "Familia"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-cream rounded-2xl p-8 md:p-10 border border-aubergine-dark/10 shadow-luxury relative"
              >
                {/* Badge */}
                <span className="inline-block text-[10px] px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] font-medium uppercase tracking-wider mb-5">
                  {t.mood}
                </span>

                {/* Quote */}
                <div className="text-3xl text-[#C9A84C]/25 font-serif leading-none mb-3">&ldquo;</div>
                <p className="text-aubergine-dark/70 text-base leading-[1.8] font-light italic mb-6">
                  {t.quote}
                </p>

                {/* Author */}
                <p className="text-sm text-aubergine-dark/40 font-medium">
                  &mdash; {t.name}, {t.city}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Counter */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl font-serif text-aubergine-dark mb-2">+2.400 tests realizados</p>
            <p className="text-sm text-aubergine-dark/40 font-light">y subiendo cada semana</p>
          </motion.div>
        </div>
      </section>

      {/* 4.75 QUIÃ‰NES SOMOS */}
      <section id="quienes-somos" className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header â€” left aligned */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mb-20"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">QuiÃ©nes Somos</h2>
            <h3 className="text-4xl md:text-6xl font-serif italic text-aubergine-dark mb-8 leading-[1.2]">Ciencia con propÃ³sito</h3>
            <p className="text-base md:text-lg text-aubergine-dark/60 font-light leading-[1.8] max-w-3xl">
              Somos un equipo de psicÃ³logos, tecnÃ³logos alimentarios y especialistas en longevidad y envejecimiento saludable, con mÃ¡s de 10 aÃ±os de experiencia clÃ­nica e investigadora en el eje intestino-cerebro.
            </p>
          </motion.div>

          {/* 3 Pillar Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Brain,
                title: "PsicologÃ­a y neurociencia",
                text: "Especialistas en conducta alimentaria, psicobiÃ³ticos y el impacto del estrÃ©s en el eje intestino-cerebro."
              },
              {
                icon: Leaf,
                title: "TecnologÃ­a alimentaria",
                text: "FormulaciÃ³n funcional, microbiota y diseÃ±o de recetas con ingredientes de eficacia demostrada."
              },
              {
                icon: Hourglass,
                title: "Longevidad y envejecimiento saludable",
                text: "NutriciÃ³n antienvejecimiento y gerontologÃ­a nutricional basada en evidencia cientÃ­fica publicada."
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: i * 0.12 }}
                className="bg-cream rounded-xl shadow-luxury hover:shadow-luxury-hover border border-aubergine-dark/8 p-10 md:p-12 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-aubergine-dark/5 flex items-center justify-center mb-8 group-hover:bg-aubergine-dark/10 transition-colors duration-300">
                  <pillar.icon className="w-6 h-6 text-aubergine-dark/60" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-aubergine-dark mb-4 leading-snug">{pillar.title}</h4>
                <p className="text-aubergine-dark/55 text-sm leading-[1.8] font-light">{pillar.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Evidence block */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="rounded-xl bg-aubergine-dark/[0.03] border border-aubergine-dark/10 p-10 md:p-12 flex gap-6 items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-aubergine-dark/5 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-aubergine-dark/50" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-aubergine-dark mb-2">
                Todo estÃ¡ basado en evidencia cientÃ­fica publicada
              </h4>
              <p className="text-aubergine-dark/55 text-sm leading-[1.8] font-light mb-3">
                No tendencias. No creencias. Cada recomendaciÃ³n de FoodÂ·Mood se apoya en investigaciÃ³n revisada por pares sobre neurociencia nutricional, microbiota y longevidad.
              </p>
              <a href="#referencias" className="text-sm font-medium text-aubergine-dark/70 hover:text-aubergine-dark transition-colors inline-flex items-center gap-1.5">
                Ver referencias cientÃ­ficas <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. PRICING SUMMARY */}
      <section className="py-24 md:py-32 px-6 bg-[var(--background)] border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Planes</h2>
            <h3 className="text-3xl md:text-5xl font-serif italic text-aubergine-dark">Empieza gratis. <span className="not-italic font-semibold">Profundiza cuando quieras.</span></h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Free */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 flex flex-col items-start"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35 mb-2">Gratuito</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-3">0â‚¬</span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Test ilimitado + OrientaciÃ³n e Inspiraciones</p>
              <Link href="/test" className="mt-auto w-full py-3 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-medium text-center hover:bg-aubergine-dark/5 transition-colors">
                Hacer mi test â†’
              </Link>
            </motion.div>

            {/* Monthly */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}
              className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 flex flex-col items-start"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35 mb-2">Mensual</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-3">9â‚¬<span className="text-base font-light text-aubergine-dark/40">/mes</span></span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Acceso Ã­ntegro a todas las Recetas Completas e ingredientes funcionales.</p>
              <Link href="/pricing" className="mt-auto w-full py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium text-center hover:bg-aubergine-dark/90 transition-colors">
                Suscribirme â†’
              </Link>
            </motion.div>

            {/* Quarterly â€” highlighted */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.2 }}
              className="relative bg-cream rounded-2xl border-2 border-[#C9A84C]/40 p-8 flex flex-col items-start shadow-luxury"
            >
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">MÃ¡s popular</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">Trimestral</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-1">15â‚¬<span className="text-base font-light text-aubergine-dark/40">/ 3 meses</span></span>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">Solo 5â‚¬/mes</p>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">El mapa Premium para ti y tu Familia, ahorrando 44%</p>
              <Link href="/pricing" className="mt-auto w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-semibold text-center shadow-lg hover:shadow-xl transition-all">
                7 dÃ­as gratis â†’
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-xs text-aubergine-dark/35 font-light">
            Sin permanencia Â· Cancela cuando quieras Â· Pago seguro
          </p>
        </div>
      </section>

      {/* 7. REFERENCIAS CIENTÃFICAS */}
      <section id="referencias" className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Evidencia</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-aubergine-dark mb-12">Referencias cientÃ­ficas</h3>

            <ol className="space-y-6">
              {[
                {
                  num: 1,
                  authors: "MÃ¶rkl S. et al.",
                  year: "2020",
                  title: "Probiotics and the Microbiome-Gut-Brain Axis: Focus on Psychiatry.",
                  journal: "Current Nutrition Reports.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/32002813/"
                },
                {
                  num: 2,
                  authors: "Cryan J.F. et al.",
                  year: "2019",
                  title: "The Microbiota-Gut-Brain Axis.",
                  journal: "Physiological Reviews, 99(4), 1877â€“2013.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/31460832/"
                },
                {
                  num: 3,
                  authors: "Marx W. et al.",
                  year: "2025",
                  title: "Food and Mood: Current Evidence on Mental Health and the Microbiota-Gut-Brain Axis.",
                  journal: "Current Psychiatry Reports, 27(11), 632â€“641.",
                  url: "https://mdanderson.elsevierpure.com/en/publications/food-and-mood-current-evidence-on-mental-health-and-the-microbiot/"
                },
                {
                  num: 4,
                  authors: "Badal V.D. et al.",
                  year: "2020",
                  title: "The Gut Microbiome, Aging, and Longevity: A Systematic Review.",
                  journal: "Nutrients, 12(12), 3759.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/33297486/"
                },
                {
                  num: 5,
                  authors: "Pan S. et al.",
                  year: "2025",
                  title: "Healthy Ageing and Gut Microbiota: A Study on Longevity in Adults.",
                  journal: "PMC.",
                  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12298205/"
                },
                {
                  num: 6,
                  authors: "Huang C. et al.",
                  year: "2026",
                  title: "Aging and the microbiome: implications for health and disease.",
                  journal: "PMC.",
                  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12867172/"
                }
              ].map((ref) => (
                <li key={ref.num} className="text-sm leading-[1.8]">
                  <span className="text-aubergine-dark/60 font-medium">[{ref.num}]</span>{' '}
                  <span className="text-aubergine-dark font-semibold">{ref.authors}</span>{' '}
                  <span className="text-aubergine-dark/70">({ref.year}).</span>{' '}
                  <span className="text-aubergine-dark/90 italic">&ldquo;{ref.title}&rdquo;</span>{' '}
                  <span className="text-aubergine-dark/70">{ref.journal}</span>{' '}
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-aubergine-dark/80 hover:text-aubergine-dark font-medium transition-colors inline-flex items-center gap-1"
                  >
                    â†’ Ver estudio
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-12 text-xs text-aubergine-dark/35 font-light leading-[1.8] border-t border-aubergine-dark/10 pt-8">
              Las referencias cientÃ­ficas se incluyen con fines informativos. FoodÂ·Mood no es un servicio mÃ©dico ni sustituye el consejo de un profesional de la salud.
            </p>
          </motion.div>
        </div>
      </section>
      
    </main>
  )
}
