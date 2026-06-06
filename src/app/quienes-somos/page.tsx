"use client"

import { useState, useMemo } from "react"
import { Variants, motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Brain, Leaf, Hourglass, FlaskConical, ArrowRight, Heart, Search, BookOpen, Award, GraduationCap, ExternalLink } from "lucide-react"

// ─── Person schema (embedded so it renders server-side via Next.js RSC serialisation) ─
const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Susana Ferreras Díez",
  jobTitle: "Psicóloga · Tecnóloga de alimentos",
  url: "https://www.food-mood.app/quienes-somos",
  worksFor: {
    "@type": "Organization",
    name: "Food·Mood Pro",
    url: "https://www.food-mood.app",
  },
  knowsAbout: [
    "Psiconutrición",
    "Alimentación emocional",
    "Tecnología de alimentos",
    "Psicología clínica",
    "Fermentación",
    "Eje intestino-cerebro",
    "Longevidad saludable",
  ],
}

export default function QuienesSomosPage() {
  const [activeCategory, setActiveCategory] = useState("Todas")
  const [searchQuery, setSearchQuery] = useState("")

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer: Variants = {
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
  ]

  const categories = ["Todas", ...Array.from(new Set(references.map(r => r.category)))]

  const filteredReferences = useMemo(() => {
    return references.filter(ref => {
      const matchesCategory = activeCategory === "Todas" || ref.category === activeCategory
      const matchesSearch = searchQuery === "" ||
        ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.authors.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[var(--background)] font-sans font-light selection:bg-gold/20 selection:text-aubergine-dark">

      {/* Person schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />

      {/* 1. HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-6 bg-aubergine overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/50 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            <motion.span variants={fadeIn} className="text-[11px] font-sans tracking-[0.3em] uppercase text-gold mb-8">
              Quiénes somos
            </motion.span>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-serif text-cream leading-[1.1] mb-10 max-w-4xl mx-auto">
              Ciencia con propósito:<br/>
              <span className="italic font-light text-cream/80">unir el laboratorio con el tenedor.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-cream/60 font-light leading-relaxed max-w-2xl">
              Food·Mood Pro nació en la intersección de la psicología clínica y la tecnología de alimentos.
              El eslabón perdido en el bienestar de los pacientes era casi siempre el mismo: la desconexión entre sus emociones y su bioquímica digestiva.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. SUSANA FERRERAS DÍEZ — sección de autoridad */}
      <section className="py-24 md:py-32 bg-cream border-b border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-20 items-start"
          >
            {/* Foto */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div
                className="w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden bg-aubergine-dark/5 flex items-center justify-center border border-aubergine-dark/10 shadow-luxury"
                aria-label="Foto de Susana Ferreras Díez"
              >
                {/* [SUSANA COMPLETAR] — Sustituir con <Image> cuando tengas la foto */}
                <div className="text-center text-aubergine-dark/30 p-8">
                  <div className="w-20 h-20 rounded-full bg-aubergine-dark/10 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl font-serif text-aubergine-dark/40">S</span>
                  </div>
                  <p className="text-xs font-light">Foto próximamente</p>
                </div>
              </div>

              {/* Credenciales tipo badge */}
              <div className="flex flex-col gap-2 w-full max-w-[260px]">
                {[
                  { icon: GraduationCap, text: "Psicóloga" },
                  { icon: Leaf,          text: "Tecnóloga de alimentos" },
                  { icon: Hourglass,     text: "Especialista en gerontología" },
                  { icon: BookOpen,      text: "Autora — Food·Mood" },
                  { icon: Award,         text: "Fundadora UMYKO" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-aubergine-dark/70">
                    <Icon className="w-4 h-4 text-gold shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-gold mb-4">Fundadora</p>
              <h2 className="text-3xl md:text-4xl font-serif text-aubergine-dark font-semibold mb-2">
                Susana Ferreras Díez
              </h2>
              <p className="text-sm text-aubergine-dark/45 font-light mb-8">
                Psicóloga · Tecnóloga de alimentos · Especialista en gerontología
              </p>

              <div className="space-y-5 text-aubergine-dark/75 leading-relaxed text-base font-light">
                <p>
                  Soy psicóloga y tecnóloga de alimentos, con formación en gerontología y más de una década dedicada a entender cómo lo que comemos y lo que sentimos se influyen mutuamente. Mi carrera nació en la intersección entre la ciencia de los alimentos, la psicología del comportamiento y el eje intestino-cerebro — un cruce que sigue siendo poco frecuente en el mundo clínico y que es exactamente el fundamento de Food·Mood.
                </p>
                <p>
                  Construí Food·Mood Pro porque los profesionales que ya trabajan la dimensión emocional de la alimentación merecen herramientas que estén a la altura de su enfoque. El software nutricional clásico captura macros, medidas y citas. Lo que ocurre entre sesiones — el estado del sistema nervioso, la hambre emocional, los pensamientos alrededor de la comida, los patrones que se repiten — sigue quedando en notas sueltas y en lo que el paciente recuerda contarte. Food·Mood Pro existe para cambiar eso.
                </p>
                <p>
                  Antes de Food·Mood, fundé UMYKO, una empresa de kombucha artesanal que me enseñó todo lo que la academia no enseña sobre fermentación, microbiota y la relación entre el intestino y el bienestar cotidiano. Soy autora de <em>Food·Mood — El placer de estar bien</em> y <em>Food·Mood: Síntomas &amp; Soluciones</em>. Trabajo desde Ibiza.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-aubergine-dark/10">
                <p className="text-xs text-aubergine-dark/45 font-light mb-3 uppercase tracking-widest">Publicaciones</p>
                <ul className="space-y-1.5 text-sm text-aubergine-dark/65 font-light">
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span><em>Food·Mood: Síntomas &amp; Soluciones</em></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span><em>Food·Mood — El placer de estar bien</em></span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. LOS PILARES DEL EQUIPO */}
      <section className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6">El Equipo</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-aubergine-dark leading-tight">Disciplinas que convergen<br/>en un mismo propósito</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                icon: Brain,
                title: "Psicología y Neuroclínica",
                text: "Especialistas en trastornos de la conducta alimentaria (TCA) y psicobiología. Analizamos cómo los neurotransmisores como la serotonina —producida en un 90% en el intestino— dictan el estado de ánimo diario.",
                detail: "Integramos la salud mental en el plato, eliminando la culpa y activando la intuición biológica."
              },
              {
                icon: Leaf,
                title: "Tecnología Alimentaria",
                text: "Expertos en formulación funcional y microbiota. Seleccionamos ingredientes que actúan como prebióticos específicos, alimentando las bacterias que regulan el estrés y la vitalidad.",
                detail: "Cada receta es un diseño técnico orientado a maximizar la biodisponibilidad de los nutrientes esenciales."
              },
              {
                icon: Hourglass,
                title: "Longevidad y Salud Celular",
                text: "Gerontólogos nutricionales enfocados en el envejecimiento saludable. Aplicamos evidencia sobre la autofagia y la disminución de la neuroinflamación para la salud cognitiva a largo plazo.",
                detail: "Comer para el hoy es bueno; comer para siempre es vital."
              },
              {
                icon: Heart,
                title: "Cambio de Hábitos",
                text: "Especialistas en acompañamiento conductual. Aplicamos técnicas de refuerzo positivo y sostenibilidad para que la relación del paciente con la comida evolucione sin fricción.",
                detail: "Transformamos la intención en acción, asegurando que cada cambio sea un paso firme."
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

      {/* 4. FILOSOFÍA */}
      <section className="py-24 md:py-32 bg-aubergine-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none skew-x-12 translate-x-1/4">
          <div className="w-full h-full bg-gradient-to-l from-gold to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-cream/50 mb-10 block">Filosofía</span>
            <h3 className="text-4xl md:text-5xl font-serif text-cream mb-16 italic font-light">
              &quot;No contamos proteínas,<br/>alimentamos estados de consciencia.&quot;
            </h3>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 text-left max-w-4xl mx-auto">
              {[
                {
                  title: "Antidietas",
                  text: "El término 'dieta' es binario (éxito/fracaso). En Food·Mood usamos 'nutrición fluida' para adaptarnos a los cambios hormonales, anímicos y estacionales del paciente."
                },
                {
                  title: "El Segundo Cerebro",
                  text: "El intestino tiene su propio sistema nervioso. Ignorarlo es ignorar el 50% de la inteligencia emocional del paciente. Nosotros le damos voz clínica."
                },
                {
                  title: "Datos reales entre sesiones",
                  text: "Lo que ocurre entre consultas es tan clínicamente relevante como lo que ocurre dentro. Food·Mood Pro captura ese intervalo con precisión."
                },
                {
                  title: "El Placer como Ciencia",
                  text: "Un plato saludable que no se disfruta genera cortisol. El sabor no es un lujo, es un requisito biológico para la absorción de nutrientes y la adherencia terapéutica."
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

      {/* 5. REFERENCIAS CIENTÍFICAS */}
      <section className="py-24 md:py-32 bg-cream border-t border-aubergine-dark/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 flex items-center gap-2">
                <FlaskConical className="w-4 h-4" /> Evidencia Científica
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif text-aubergine-dark">Transparencia Radical</h3>
              <p className="text-aubergine-dark/60 mt-4 font-light">
                Cada decisión de la plataforma y cada ingrediente en las recetas se apoya en investigación revisada por pares.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                      activeCategory === cat
                        ? "bg-aubergine-dark text-white border-aubergine-dark shadow-md"
                        : "border-aubergine-dark/20 text-aubergine-dark/60 hover:border-aubergine-dark/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aubergine-dark/30" />
                <input
                  type="text"
                  placeholder="Buscar estudio o autor..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream border border-aubergine-dark/10 rounded-xl text-sm text-aubergine-dark focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-aubergine-dark/25"
                />
              </div>
            </div>
          </div>

          <motion.div layout className="space-y-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredReferences.length > 0 ? (
                filteredReferences.map(ref => (
                  <motion.div
                    key={ref.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 md:p-8 bg-cream border border-aubergine-dark/10 rounded-2xl hover:shadow-luxury transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                      <div className="w-10 h-10 rounded-lg bg-aubergine-dark/5 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-aubergine-dark/40">{ref.id}</span>
                      </div>
                      <div className="flex-grow">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B35] mb-2 block">
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
                          className="inline-flex items-center gap-2 text-xs font-semibold text-aubergine-dark/80 hover:text-aubergine-dark transition-colors"
                        >
                          Ver estudio <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <p className="text-aubergine-dark/40 font-light italic">No se encontraron referencias para tu búsqueda.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 6. CTA PRO */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="relative rounded-[2.5rem] bg-gradient-to-br from-aubergine-dark to-[#301620] p-12 md:p-20 text-center text-cream overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-serif text-cream mb-6 leading-tight">
                ¿Eres profesional de la salud?
              </h2>
              <p className="text-cream/60 max-w-xl mb-10 text-lg font-light leading-relaxed">
                Solicita acceso anticipado a Food·Mood Pro y empieza a capturar datos emocionales
                e interoceptivos de tus pacientes entre sesiones.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gold text-aubergine-dark font-semibold rounded-xl px-10 py-4 text-sm hover:bg-gold/90 transition-colors shadow-xl"
              >
                Solicitar acceso anticipado
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="py-12 border-t border-aubergine-dark/5 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-aubergine-dark/40 hover:text-aubergine-dark transition-colors font-medium">
          <Heart className="w-3.5 h-3.5 text-gold" />
          Food·Mood Pro — Para profesionales de la salud
        </Link>
      </div>
    </main>
  )
}
