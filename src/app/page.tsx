"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/client"

import { moods } from "@/data/moods"
import { ArrowRight, BookOpen, Mail, Send, Brain, Leaf, Hourglass, FlaskConical, Loader2, CheckCircle2 } from "lucide-react"
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
                Tu estado emocional tiene un color.<br className="hidden md:block" />
                <span className="italic font-light text-cream/80">Y ese color tiene un sabor.</span>
              </motion.h1>
            </div>
            
            <motion.p variants={fadeIn} className="text-base text-cream/70 max-w-lg mx-auto text-center leading-[1.8] font-sans">
              Las emociones no son simples. Son mezclas, como una paleta de colores. Food Mood lee tu paleta emocional y te devuelve recetas funcionales diseñadas para lo que tu cuerpo realmente necesita.
            </motion.p>

            <motion.div variants={fadeIn} className="flex justify-center items-center gap-2 pt-2">
              {[
                '#E8A838',
                '#7BA7BC',
                '#5B8C5A',
                '#C97B84',
                '#9B8EC4',
                '#D4956A'
              ].map((hex) => (
                <div key={hex} className="w-3 h-3 rounded-full" style={{ backgroundColor: hex }} />
              ))}
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col gap-6 items-center pt-8 w-full justify-center">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/test" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-10 py-4 rounded-[8px] font-semibold">
                    Hacer mi test gratis
                    <ArrowRight className="ml-3 w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/paleta" className="w-full sm:w-auto">
                  <button 
                    className="w-full sm:w-auto text-[16px] px-[40px] py-[14px] rounded-[60px] border-[1.5px] border-[#6B2737] bg-transparent text-[#6B2737] font-medium transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Descubre tu color emocional
                  </button>
                </Link>
              </div>

              <div className="text-[13px] text-[#7a7974] opacity-60 text-center font-light mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                El test te da tu mood. La paleta te da tu color. Elige cómo empezar.
              </div>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div variants={fadeIn} className="w-full max-w-md h-12 flex items-center justify-center">
              {nlSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl text-[#C9A84C] font-medium shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>¡Suscrito con éxito!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-[12px] text-cream/40 font-light mb-1 sm:mb-0 w-full text-center sm:text-left">
                    O únete al Newsletter para un consejo semanal →
                  </p>
                  <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/30" />
                      <input
                        type="email"
                        value={nlEmail}
                        onChange={(e) => setNlEmail(e.target.value)}
                        placeholder="tu email"
                        className="w-full sm:w-48 pl-9 pr-3 py-2.5 rounded-lg bg-cream/10 border border-cream/15 text-white text-xs placeholder:text-cream/25 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40 transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={nlLoading}
                      className="px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-[#C9A84C]/20 active:scale-95 min-w-[110px] justify-center"
                    >
                      {nlLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          Suscribirse
                        </>
                      )}
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
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} variants={fadeIn}
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

      {/* 3. TU PALETA EMOCIONAL */}
      <section className="py-32 md:py-48 overflow-hidden bg-[var(--background)] relative">
        <div className="max-w-6xl mx-auto px-6 mb-24 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">Tu Paleta Emocional</h2>
            <h3 className="text-3xl md:text-5xl font-serif text-aubergine-dark mb-8 leading-tight max-w-4xl mx-auto">
              Las emociones no son casillas. Son espectros de color. Cada día tu paleta es distinta — y tu plato debe responder a ella.
            </h3>
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
                className="min-w-[300px] md:min-w-0 flex-1 p-8 rounded-xl snap-center relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(to right, ${mood.colorLight}, transparent)`,
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: mood.color
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="shrink-0" 
                    style={{ backgroundColor: mood.color, width: '20px', height: '20px', borderRadius: '50%' }}
                  />
                  <h4 className="font-serif text-xl md:text-2xl font-semibold text-aubergine-dark break-words">
                    {mood.label || mood.nombre}
                  </h4>
                </div>
                
                <p className="text-aubergine-dark/60 text-sm leading-[1.8] font-light">
                  {mood.descripcion_corta}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mt-16 text-center"
          >
            <p className="text-aubergine-dark/50 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Nadie es un solo color. Eres una mezcla que cambia cada día.<br className="hidden sm:block" />
              Y cada mezcla tiene su receta.
            </p>
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
              { num: "01", title: "El Check-in", text: "Cuéntanos cómo te sientes. Responde nuestro test visual o habla libremente con el Chat." },
              { num: "02", title: "Tu Mapa", text: "Nuestra tecnología mapea por ti tu estado digestivo y mental real." },
              { num: "03", title: "La Inspiración", text: "Obtienes una poderosa recomendación funcional (y si eres Premium, desbloqueas su receta íntegra)." }
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
              Food·Mood es una herramienta de autoconocimiento emocional a través de la alimentación funcional. No sustituye ninguna terapia psicológica, médica ni nutricional profesional. Lo que sí hace es ayudarte a escuchar lo que tu cuerpo pide — y responderle con ciencia, placer y comida real.
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
                mood: "Reset"
              },
              {
                quote: "Nunca había conectado mis antojos con el nervio vago. Ahora tiene todo el sentido.",
                mood: "Calma"
              },
              {
                quote: "Las recetas de Focus me salvaron la semana de exámenes. Simple, rico y funcional.",
                mood: "Focus"
              },
              {
                quote: "A todos nos encantan los snacks nutritivos de la sección Confort. Su digestión y la mía han agradecido el cambio sin que sientan 'dietas' extremas.",
                mood: "Confort"
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
                <p className="text-aubergine-dark/70 text-base leading-[1.8] font-light italic">
                  {t.quote}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Counter */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl font-serif text-aubergine-dark mb-2">+200 tests realizados</p>
            <p className="text-sm text-aubergine-dark/40 font-light italic">Impacto real en la comunidad</p>
          </motion.div>
        </div>
      </section>

      {/* 4.75 QUIÉNES SOMOS (RESUMEN) */}
      <section id="quienes-somos" className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mb-16 text-center"
          >
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Equipo</h2>
            <h3 className="text-4xl md:text-6xl font-serif italic text-aubergine-dark mb-8 leading-[1.2]">Psicología, ciencia y placer con propósito</h3>
            <p className="text-base md:text-lg text-aubergine-dark/60 font-light leading-[1.8] max-w-3xl mx-auto">
              Somos un equipo multidisciplinar de psicólogos y tecnólogos alimentarios con más de 10 años de experiencia clínica. Nuestra misión es unir la neurociencia con el bienestar diario a través de la nutrición funcional.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <Link href="/quienes-somos">
              <Button variant="outline" className="border-aubergine-dark/20 text-aubergine-dark hover:bg-aubergine-dark/5 px-8">
                Conocer la historia completa <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4.85 TEASER FERMENTOS DEL MUNDO */}
      <section className="py-24 md:py-32 px-6 bg-aubergine-dark border-t border-cream/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5" />
        <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/30 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-gold"></span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gold">
              Contenido Premium
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-black text-cream leading-[1.1] mb-6">
            Fermentos del <span className="italic font-light">Mundo</span>
          </h2>
          
          <p className="text-lg md:text-xl text-cream/70 font-light leading-relaxed max-w-2xl mb-12">
            Explora nuestro mapa interactivo con los 16 fermentos ancestrales más poderosos del planeta. De la Nattokinasa japonesa al ácido láctico etíope — la ciencia detrás del eje intestino-cerebro mundial.
          </p>
          
          <Link href="/pricing">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white px-8 py-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl">
              Descubrir con suscripción Premium <ArrowRight className="ml-3 w-4 h-4" />
            </Button>
          </Link>
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
              <span className="text-4xl font-serif text-aubergine-dark mb-3">0€</span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Test de mood + Paleta Emocional (resultado sin recetas)</p>
              <Link href="/test" className="mt-auto w-full py-3 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-medium text-center hover:bg-aubergine-dark/5 transition-colors">
                Hacer mi test →
              </Link>
            </motion.div>

            {/* Monthly */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}
              className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 flex flex-col items-start"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35 mb-2">Mensual</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-3">9€<span className="text-base font-light text-aubergine-dark/40">/mes</span></span>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Acceso completo a todas las recetas, el glosario científico, Fermentos del Mundo y tu paleta emocional personalizada.</p>
              <Link href="/pricing" className="mt-auto w-full py-3 rounded-xl bg-aubergine-dark text-cream text-sm font-medium text-center hover:bg-aubergine-dark/90 transition-colors">
                Suscribirme →
              </Link>
            </motion.div>

            {/* Quarterly — highlighted */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.2 }}
              className="relative bg-cream rounded-2xl border-2 border-[#C9A84C]/40 p-8 flex flex-col items-start shadow-luxury"
            >
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">Más popular</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2">Trimestral</span>
              <span className="text-4xl font-serif text-aubergine-dark mb-1">15€<span className="text-base font-light text-aubergine-dark/40">/ 3 meses</span></span>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">Solo 5€/mes</p>
              <p className="text-sm text-aubergine-dark/50 font-light mb-6">Tu paleta emocional completa. Recetas que responden a cada color. Ahorrando un 44%.</p>
              <Link href="/pricing" className="mt-auto w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-semibold text-center shadow-lg hover:shadow-xl transition-all">
                7 días gratis →
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-xs text-aubergine-dark/35 font-light">
            Sin permanencia · Cancela cuando quieras · Pago seguro
          </p>
        </div>
      </section>

      {/* SECCIÓN REFERENCIAS ELIMINADA DE HOME (MOVIDA A /QUIENES-SOMOS) */}
      
    </main>
  )
}
