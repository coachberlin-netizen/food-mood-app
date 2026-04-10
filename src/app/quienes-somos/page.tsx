"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Brain, Leaf, Hourglass, FlaskConical, ArrowRight, ShieldCheck, Heart, Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"

// SEO Metadata (Client component fallback - usually handled in layout or parent)
// title: "Quiénes Somos | Food·Mood — Ciencia con propósito"

export default function QuienesSomosPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const references = [
    {
      id: 1,
      category: "Neurociencia",
      authors: "Mörkl S. et al.",
      year: "2020",
      title: "Probiotics and the Microbiome-Gut-Brain Axis: Focus on Psychiatry.",
      journal: "Current Nutrition Reports.",
      url: "https://pubmed.ncbi.nlm.nih.gov/32002813/"
    },
    {
      id: 2,
      category: "Microbiota",
      authors: "Cryan J.F. et al.",
      year: "2019",
      title: "The Microbiota-Gut-Brain Axis.",
      journal: "Physiological Reviews, 99(4), 1877–2013.",
      url: "https://pubmed.ncbi.nlm.nih.gov/31460832/"
    },
    {
      id: 3,
      category: "Neurociencia",
      authors: "Marx W. et al.",
      year: "2025",
      title: "Food and Mood: Current Evidence on Mental Health and the Microbiota-Gut-Brain Axis.",
      journal: "Current Psychiatry Reports, 27(11), 632–641.",
      url: "https://mdanderson.elsevierpure.com/en/publications/food-and-mood-current-evidence-on-mental-health-and-the-microbiot/"
    },
    {
      id: 4,
      category: "Longevidad",
      authors: "Badal V.D. et al.",
      year: "2020",
      title: "The Gut Microbiome, Aging, and Longevity: A Systematic Review.",
      journal: "Nutrients, 12(12), 3759.",
      url: "https://pubmed.ncbi.nlm.nih.gov/33297486/"
    },
    {
      id: 5,
      category: "Longevidad",
      authors: "Pan S. et al.",
      year: "2025",
      title: "Healthy Ageing and Gut Microbiota: A Study on Longevity in Adults.",
      journal: "PMC.",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12298205/"
    },
    {
      id: 6,
      category: "Microbiota",
      authors: "Huang C. et al.",
      year: "2026",
      title: "Aging and the microbiome: implications for health and disease.",
      journal: "PMC.",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12867172/"
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] font-sans font-light selection:bg-gold/20 selection:text-aubergine-dark">
      
      {/* 1. HERO CON PROPÓSITO */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 bg-aubergine overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/50 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            <motion.span variants={fadeIn} className="text-[11px] font-sans tracking-[0.3em] uppercase text-gold mb-8">
              Nuestra Historia
            </motion.span>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-7xl font-serif text-cream leading-[1.1] mb-12 max-w-4xl mx-auto">
              Ciencia con propósito:<br/>
              <span className="italic font-light text-cream/80">Unir el laboratorio con el tenedor.</span>
            </motion.h1>
            <motion.div variants={fadeIn} className="max-w-2xl mx-auto space-y-6 text-lg text-cream/70 leading-relaxed font-light">
              <p>
                Food·Mood no nació en una cocina, sino en la intersección de la clínica psicológica y la investigación biomédica. Observamos que el eslabón perdido en el bienestar de nuestros pacientes era, casi siempre, la desconexión entre sus emociones y su bioquímica digestiva.
              </p>
              <p>
                Hoy, tras más de una década de experiencia compartida, hemos creado esta plataforma para democratizar la neurociencia nutricional. No creemos en las dietas, creemos en el equilibrio del eje intestino-cerebro como motor de una vida plena.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. LOS 3 PILARES (EXPANDIDOS) */}
      <section className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Equipo</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-aubergine-dark leading-tight">Mentes unidas por<br/>una misma visión</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Brain,
                title: "Psicología y Neuroclínica",
                text: "Especialistas en trastornos de la conducta alimentaria (TCA) y psicobiología. Analizamos cómo los neurotransmisores como la serotonina —producida en un 90% en el intestino— dictan tu estado de ánimo diario.",
                detail: "Lideramos la integración de la salud mental en el plato, eliminando la culpa y activando la intuición biológica."
              },
              {
                icon: Leaf,
                title: "Tecnología Alimentaria",
                text: "Expertos en formulación funcional y microbiota. Seleccionamos ingredientes que actúan como prebióticos específicos, alimentando las bacterias que regulan tu gestión del estrés y tu vitalidad.",
                detail: "Cada receta es un diseño técnico orientado a maximizar la biodisponibilidad de los nutrientes esenciales."
              },
              {
                icon: Hourglass,
                title: "Longevidad y Salud Celular",
                text: "Gerontólogos nutricionales enfocados en el envejecimiento saludable. Aplicamos evidencia sobre la autofagia y la disminución de la neuroinflamación para que tu mente siga joven a través de lo que comes.",
                detail: "Nos enfocamos en el impacto a largo plazo: comer para el hoy es bueno; comer para siempre es vital."
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col h-full bg-cream rounded-2xl p-10 md:p-12 border border-aubergine-dark/10 shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-aubergine-dark/5 flex items-center justify-center mb-8">
                  <pillar.icon className="w-7 h-7 text-aubergine-dark/60" />
                </div>
                <h4 className="font-serif text-2xl font-semibold text-aubergine-dark mb-6">{pillar.title}</h4>
                <div className="space-y-4 flex-grow">
                  <p className="text-aubergine-dark/70 text-base leading-relaxed font-light">{pillar.text}</p>
                  <p className="text-aubergine-dark/40 text-sm italic leading-relaxed">{pillar.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MANIFIESTO / FILOSOFÍA */}
      <section className="py-32 md:py-48 bg-aubergine-dark relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none skew-x-12 translate-x-1/4">
          <div className="w-full h-full bg-gradient-to-l from-gold to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-cream/50 mb-10 block">Nuestra Filosofía</span>
            <h3 className="text-4xl md:text-6xl font-serif text-cream mb-16 italic font-light">
              &quot;No contamos proteínas, alimentamos estados de consciencia.&quot;
            </h3>
            
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 text-left max-w-4xl mx-auto">
              {[
                {
                  title: "Antidietas",
                  text: "El término 'dieta' es binario (éxito/fracaso). En Food·Mood usamos el término 'nutrición fluida' para adaptarnos a tus cambios hormonales, anímicos y estacionales."
                },
                {
                  title: "El Segundo Cerebro",
                  text: "Tu intestino tiene su propio sistema nervioso. Ignorarlo es ignorar el 50% de tu inteligencia emocional. Nosotros le damos voz."
                },
                {
                  title: "Soberanía Alimentaria",
                  text: "No te decimos qué 'tienes' que comer por obligación, sino qué ingredientes 'necesitas' para recuperar el mando de tu química interna."
                },
                {
                  title: "El Placer como Ciencia",
                  text: "Un plato saludable que no disfrutas genera cortisol (estrés). El sabor no es un lujo, es un requisito biológico para la absorción de nutrientes."
                }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="font-serif text-xl font-medium text-gold">{item.title}</h4>
                  <p className="text-cream/60 leading-relaxed font-light text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. REFERENCIAS CIENTÍFICAS (CON FILTRO) */}
      <section className="py-32 md:py-48 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> Evidencia Científica
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif text-aubergine-dark">Transparencia Radical</h3>
              <p className="text-aubergine-dark/60 mt-4 font-light">
                Cada decisión de nuestro algoritmo y cada ingrediente en nuestras recetas se apoya en investigación revisada por pares (peer-reviewed).
              </p>
            </div>
            {/* Simple Category Badges (static for now as requested) */}
            <div className="flex flex-wrap gap-2">
              {["Neurociencia", "Microbiota", "Longevidad"].map(cat => (
                <span key={cat} className="text-[10px] px-3 py-1 rounded-full border border-aubergine-dark/20 text-aubergine-dark/60 font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {references.map((ref) => (
              <motion.div
                key={ref.id}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="p-6 md:p-8 bg-cream border border-aubergine-dark/10 rounded-2xl hover:shadow-luxury transition-all group"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="w-10 h-10 rounded-lg bg-aubergine-dark/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-aubergine-dark/40">{ref.id}</span>
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2 block">
                      {ref.category}
                    </span>
                    <h4 className="text-lg md:text-xl font-serif font-semibold text-aubergine-dark mb-2 leading-relaxed">
                      &ldquo;{ref.title}&rdquo;
                    </h4>
                    <p className="text-sm text-aubergine-dark/60 font-light mb-4 leading-relaxed">
                      {ref.authors} ({ref.year}). <span className="font-medium">{ref.journal}</span>
                    </p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-aubergine-dark/80 hover:text-aubergine-dark transition-colors group"
                    >
                      Explorar estudio científico <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="relative rounded-[2.5rem] bg-gradient-to-br from-aubergine-dark to-[#301620] p-12 md:p-20 text-center text-cream overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-gold mb-8 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-serif text-cream mb-6 leading-tight">
                Empieza hoy tu viaje de<br/>
                <span className="italic font-light text-cream/80">nutrición consciente.</span>
              </h2>
              <p className="text-cream/60 max-w-xl mb-12 text-lg font-light leading-relaxed">
                Descubre cómo tu cuerpo habla a través de tus emociones y encuentra el equilibrio que la neurociencia puede ofrecerte.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                <Link href="/test" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-base px-12 py-4 rounded-xl shadow-xl hover:shadow-gold/20">
                    Hacer mi test gratis
                  </Button>
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-cream/70 hover:text-cream transition-colors py-4 px-8 border border-cream/10 rounded-xl hover:bg-cream/5">
                  Ver planes premium
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Teaser */}
      <div className="py-12 border-t border-aubergine-dark/5 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-aubergine-dark/40 hover:text-aubergine-dark transition-colors font-medium">
          <Heart className="w-3.5 h-3.5 text-gold" />
          Escucha a tu cuerpo. Food·Mood
        </Link>
      </div>

    </main>
  )
}
