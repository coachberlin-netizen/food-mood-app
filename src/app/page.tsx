"use client"

import { motion, useScroll, useTransform, Variants } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"


import { moods } from "@/data/moods"
import { ArrowRight, BookOpen } from "lucide-react"
import { useRef } from "react"

export default function Home() {
  
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
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-cream/50 mb-6">El Mapa Emocional</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-cream">Los 6 Estados Food·Mood</h3>
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
                <div className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/40 group-hover:text-aubergine-dark/80 transition-colors">
                  Descubrir &rarr;
                </div>
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
      
    </main>
  )
}
