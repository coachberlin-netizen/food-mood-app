"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"


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
                Recetas que te cambian el humor.<br/>
                <span className="italic font-light text-cream/80">Cada una tiene un porqué.</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-2xl md:text-3xl text-[#F5F0E8] text-center font-serif">
                Y está increíblemente buena.
              </motion.p>
            </div>
            
            <motion.p variants={fadeIn} className="text-base text-cream/70 max-w-md mx-auto text-center leading-[1.8] font-sans">
              Descubre qué necesita tu cuerpo ahora mismo y recibe recetas diseñadas para equilibrarte. Puro placer. Cero restricciones.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 items-center pt-8 w-full justify-center">
              <Link href="/test" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-14 py-4 rounded-[8px]">
                  Haz el test
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div variants={fadeIn} className="w-full max-w-md">
              {nlSent ? (
                <p className="text-sm text-[#C9A84C] font-medium">✓ ¡Suscrito! Recibirás tu primera receta esta semana.</p>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-[12px] text-cream/40 font-light mb-1 sm:mb-0 w-full text-center sm:text-left">
                    O recibe cada semana una receta funcional para tu estado de ánimo →
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

      {/* 2. SECCIÓN PROBLEMA */}
      <section className="py-32 md:py-48 bg-cream relative border-t border-aubergine-dark/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-24"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Origen</h2>
            <h3 className="text-3xl md:text-5xl font-serif italic text-aubergine-dark leading-relaxed max-w-4xl mx-auto">
              &quot;No es falta de voluntad, es bioquímica. Lo que comes determina cómo te sientes, y cómo te sientes dicta qué quieres comer.&quot;
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-32">
            {[
              { title: "Niebla Mental", text: "Te cuesta concentrarte o recordar detalles después de ciertas comidas." },
              { title: "Bajones de Energía", text: "Necesitas café constantemente y colapsas a media tarde." },
              { title: "Ansiedad Digestiva", text: "Tu estómago reacciona físicamente a tus picos de estrés." },
              { title: "Antojos Emocionales", text: "Buscas azúcar o carbohidratos buscando un abrazo bioquímico." }
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
                <span className="italic font-light text-cream/80">Y están buenísimas.</span>
              </h3>
              <p className="text-white/60 text-lg leading-[1.8] font-light">
                Nosotros te damos el mejor sabor para romper el ciclo de inflamación y sentirte genial de verdad, usando ingredientes que hablan directamente con tu nervio vago.
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
            <h3 className="text-4xl md:text-6xl font-serif text-aubergine-dark">Los 6 Estados Food·Mood</h3>
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 overflow-hidden">
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
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
                <h4 className="font-serif text-2xl font-semibold mb-4 text-aubergine-dark">{mood.nombre}</h4>
                <p className="text-aubergine-dark/60 text-sm leading-[1.8] mb-8 font-light">{mood.descripcion_corta}</p>
                <Link href="/test" className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/40 group-hover:text-aubergine-dark/80 transition-colors">
                  Hacer el test &rarr;
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CÓMO FUNCIONA */}
      <section className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/20 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center mb-32"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">La Metodología</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-aubergine-dark">¿Cómo funciona?</h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 text-left">
            {[
              { num: "01", title: "Dinos qué sientes", text: "Un check-in rápido y sensorial para entender a tu cuerpo." },
              { num: "02", title: "Traducimos", text: "Nuestra IA analiza tus anhelos para encontrar tu estado." },
              { num: "03", title: "Tu ritual", text: "Recibes una receta con propósito diseñada para ese momento exacto." }
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
              Las explicaciones científicas de Food·Mood son simplificaciones divulgativas. Nuestro objetivo es traducir la investigación sobre el eje intestino-cerebro a un lenguaje claro y útil — no sustituir la literatura académica ni la opinión de profesionales.
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
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-cream/50 mb-6">Lo Dicen Ellos</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-cream">Historias reales</h3>
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
                quote: "Las recetas de Focus me salvaron la semana de exámenes. Simple, rico y funcional.",
                name: "Daniel R.",
                city: "Valencia",
                mood: "Focus"
              },
              {
                quote: "Mi hija de 10 años adora los snacks de la sección kids. Y yo como tranquila sabiendo que le hace bien.",
                name: "Marta G.",
                city: "Sevilla",
                mood: "Confort"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-cream/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-cream/10 relative"
              >
                <div className="text-4xl text-[#C9A84C]/30 font-serif leading-none mb-4">&ldquo;</div>
                <p className="text-cream/80 text-base leading-[1.8] font-light italic mb-6">
                  {t.quote}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cream/50 font-medium">— {t.name}, {t.city}</span>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] font-medium uppercase tracking-wider">
                    {t.mood}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Counter */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl font-serif text-cream/90 mb-2">+2.400 tests realizados</p>
            <p className="text-sm text-cream/40 font-light">y subiendo cada semana</p>
          </motion.div>
        </div>
      </section>

      {/* 4.75 QUIÉNES SOMOS */}
      <section className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header — left aligned */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mb-20"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Quiénes Somos</h2>
            <h3 className="text-4xl md:text-6xl font-serif italic text-aubergine-dark mb-8 leading-[1.2]">Ciencia con propósito</h3>
            <p className="text-base md:text-lg text-aubergine-dark/60 font-light leading-[1.8] max-w-3xl">
              Somos un equipo de psicólogos, tecnólogos alimentarios y especialistas en longevidad y envejecimiento saludable, con más de 10 años de experiencia clínica e investigadora en el eje intestino-cerebro.
            </p>
          </motion.div>

          {/* 3 Pillar Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Brain,
                title: "Psicología y neurociencia",
                text: "Especialistas en conducta alimentaria, psicobióticos y el impacto del estrés en el eje intestino-cerebro."
              },
              {
                icon: Leaf,
                title: "Tecnología alimentaria",
                text: "Formulación funcional, microbiota y diseño de recetas con ingredientes de eficacia demostrada."
              },
              {
                icon: Hourglass,
                title: "Longevidad y envejecimiento saludable",
                text: "Nutrición antienvejecimiento y gerontología nutricional basada en evidencia científica publicada."
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
                Todo está basado en evidencia científica publicada
              </h4>
              <p className="text-aubergine-dark/55 text-sm leading-[1.8] font-light mb-3">
                No tendencias. No creencias. Cada recomendación de Food·Mood se apoya en investigación revisada por pares sobre neurociencia nutricional, microbiota y longevidad.
              </p>
              <a href="#referencias" className="text-sm font-medium text-aubergine-dark/70 hover:text-aubergine-dark transition-colors inline-flex items-center gap-1.5">
                Ver referencias científicas <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-32 md:py-48 px-6 bg-[var(--background)]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="max-w-4xl mx-auto bg-cream rounded-2xl border border-aubergine-dark/20 shadow-luxury p-16 md:p-32 text-center"
        >
          <div className="space-y-12 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-serif font-semibold text-aubergine-dark leading-[1.2]">
              ¿Cuál es tu estado<br/><em className="font-light">hoy?</em>
            </h2>
            <p className="text-lg text-aubergine-dark/60 max-w-md font-light leading-[1.8]">
              Descubre tu estado y una receta diseñada para equilibrarte en menos de 2 minutos.
            </p>
            <Link href="/test">
              <Button variant="primary" size="lg" className="px-14 py-4 text-base rounded-[8px] mt-4">
                Comenzar Test
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 6. SUSANA & WAITLIST */}
      <section className="py-32 bg-aubergine-dark text-cream">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="space-y-8 flex flex-col items-center">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-cream/50">Tu Viaje</h2>
            <h3 className="text-4xl md:text-5xl font-serif leading-[1.2]">Empieza a escucharte.</h3>
            <p className="text-cream/60 text-lg md:text-xl leading-[1.8] font-light max-w-xl">
              Descubre qué necesita tu cuerpo hoy con nuestro test basado en neurociencia nutricional y recupera tu equilibrio.
            </p>
            <div className="pt-8">
              <Link href="/test">
                <Button variant="outline" className="bg-cream text-aubergine-dark hover:bg-cream/90 border-0 px-12 py-6 text-base font-medium rounded-full transition-all hover:scale-105">
                  Empieza el quiz
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. REFERENCIAS CIENTÍFICAS */}
      <section id="referencias" className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Evidencia</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-aubergine-dark mb-12">Referencias científicas</h3>

            <ol className="space-y-6">
              {[
                {
                  num: 1,
                  authors: "Mörkl S. et al.",
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
                  journal: "Physiological Reviews, 99(4), 1877–2013.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/31460832/"
                },
                {
                  num: 3,
                  authors: "Marx W. et al.",
                  year: "2025",
                  title: "Food and Mood: Current Evidence on Mental Health and the Microbiota-Gut-Brain Axis.",
                  journal: "Current Psychiatry Reports, 27(11), 632–641.",
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
                  <span className="text-aubergine-dark/40 font-medium">[{ref.num}]</span>{' '}
                  <span className="text-aubergine-dark font-semibold">{ref.authors}</span>{' '}
                  <span className="text-aubergine-dark/50">({ref.year}).</span>{' '}
                  <span className="text-aubergine-dark/70 italic">&ldquo;{ref.title}&rdquo;</span>{' '}
                  <span className="text-aubergine-dark/50">{ref.journal}</span>{' '}
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-aubergine-dark/60 hover:text-aubergine-dark font-medium transition-colors inline-flex items-center gap-1"
                  >
                    → Ver estudio
                  </a>
                </li>
              ))}
            </ol>

            <p className="mt-12 text-xs text-aubergine-dark/35 font-light leading-[1.8] border-t border-aubergine-dark/10 pt-8">
              Las referencias científicas se incluyen con fines informativos. Food·Mood no es un servicio médico ni sustituye el consejo de un profesional de la salud.
            </p>
          </motion.div>
        </div>
      </section>
      
    </main>
  )
}
