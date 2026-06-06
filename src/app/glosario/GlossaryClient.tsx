"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, X, Sparkles, Leaf, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface GlossaryItem {
  id: string
  name: string
  slug: string
  tagline: string
  category: string
  moods: string[]
  active_compounds?: string[]
}

const CATEGORIES = [
  { id: 'especia', label: 'Especias' },
  { id: 'fruta', label: 'Frutas' },
  { id: 'verdura', label: 'Verduras' },
  { id: 'semilla', label: 'Semillas' },
  { id: 'cereal', label: 'Cereales' },
  { id: 'legumbre', label: 'Legumbres' },
  { id: 'fermentado', label: 'Fermentados' },
  { id: 'hongo', label: 'Hongos' },
  { id: 'aceite', label: 'Aceites' },
  { id: 'fruto_seco', label: 'Frutos secos' },
  { id: 'proteina', label: 'Proteínas' },
  { id: 'bebida', label: 'Bebidas' },
  { id: 'otro', label: 'Otros' }
];

const MOOD_COLORS: Record<string, { color: string, bg: string }> = {
  activacion: { color: '#FFB000', bg: '#FFB00015' },
  calma: { color: '#00D1FF', bg: '#00D1FF15' },
  focus: { color: '#00DD80', bg: '#00DD8015' },
  social: { color: '#FF2D55', bg: '#FF2D5515' },
  reset: { color: '#9D00FF', bg: '#9D00FF15' },
  confort: { color: '#FF6B00', bg: '#FF6B0015' },
};

const MOODS = [
  { id: "activacion", label: "Activación" },
  { id: "calma", label: "Calma" },
  { id: "focus", label: "Foco" },
  { id: "social", label: "Social" },
  { id: "reset", label: "Restauración" },
  { id: "confort", label: "Confort" },
];

export default function GlossaryClient({ initialData, isPremium }: { initialData: GlossaryItem[], isPremium: boolean }) {
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterMood, setFilterMood] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = search ? (
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        (item.tagline && item.tagline.toLowerCase().includes(search.toLowerCase())) ||
        (item.active_compounds && item.active_compounds.some(c => c.toLowerCase().includes(search.toLowerCase())))
      ) : true;
      const matchCat = filterCategory ? item.category?.toLowerCase() === filterCategory.toLowerCase() : true;
      const matchMood = filterMood ? item.moods && item.moods.includes(filterMood) : true;
      return matchSearch && matchCat && matchMood;
    })
  }, [initialData, search, filterCategory, filterMood])

  const categoryLabels: Record<string, string> = {
    aceite: "Aceites",
    fruto_seco: "Frutos secos",
    proteina: "Proteínas",
    bebida: "Bebidas",
    otro: "Otros",
    especia: "Especias",
    fruta: "Frutas",
    verdura: "Verduras",
    semilla: "Semillas",
    cereal: "Cereales",
    legumbre: "Legumbres",
    fermentado: "Fermentados",
    hongo: "Hongos",
  };

  if (!isPremium) {
    const teaserItems = initialData.slice(0, 6)
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="text-center md:text-left mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6 leading-tight">
            El poder de tus <br className="hidden md:block" /> ingredientes
          </h1>
          <p className="text-xl text-aubergine-dark/60 font-serif italic max-w-2xl">
            Descubre la ciencia interactiva detrás de la comida real. Cómo cada especia, semilla y alimento vivo influye en cómo te sientes — y por qué.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)',
          }}
        >
          {teaserItems.map((item) => {
            const firstMood = item.moods?.[0]
            const color = firstMood ? (MOOD_COLORS[firstMood]?.color ?? '#FF6B35') : '#FF6B35'
            return (
              <div
                key={item.id}
                className="pointer-events-none select-none h-full bg-transparent border border-[#6B2737]/10 rounded-[2rem] flex flex-col overflow-hidden shadow-sm"
              >
                <div className="w-full h-2 rounded-t-[2rem]" style={{ backgroundColor: color }} />
                <div className="p-8 flex flex-col flex-1">
                  {item.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] uppercase tracking-widest font-bold self-start mb-4">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  )}
                  <h3 className="text-3xl font-serif text-aubergine-dark mb-4">{item.name}</h3>
                  <p className="text-[15px] font-light text-aubergine-dark/70 italic leading-relaxed line-clamp-3 mb-6 flex-1">
                    &ldquo;{item.tagline}&rdquo;
                  </p>
                  {item.moods && item.moods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto border-t border-[#6B2737]/5 pt-4">
                      {item.moods.slice(0, 3).map((mood) => {
                        const colors = MOOD_COLORS[mood] || { color: '#888', bg: '#88815' }
                        return (
                          <span
                            key={mood}
                            className="text-[10px] px-2 py-1 rounded-md capitalize border border-transparent font-medium"
                            style={{ backgroundColor: colors.bg, color: colors.color }}
                          >
                            {mood}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <section className="py-24 px-8 md:px-12 bg-[#6B2737] rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl -mt-32">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20">
              <Lock className="w-3 h-3" /> Contenido Premium
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F0E8] leading-tight">
              El glosario completo, sólo para miembros
            </h2>
            <p className="text-[#F5F0E8]/70 text-lg font-light leading-[1.8]">
              {initialData.length > 0 ? `${initialData.length}+` : '50+'} ingredientes funcionales explicados: su ciencia, sus sinergias y cómo afectan tu cuerpo y tu estado de ánimo.
            </p>
            <div className="pt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 bg-[#FF6B35] hover:bg-[#b8953e] text-white px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#FF6B35]/20 transition-all transform hover:-translate-y-1"
              >
                <Sparkles className="w-5 h-5 opacity-80" />
                Ver planes de acceso
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">

      {/* Hero Section */}
      <div className="text-center md:text-left mb-16">
        <h1 className="text-5xl md:text-7xl font-serif text-aubergine-dark mb-6 leading-tight">
          El poder de tus <br className="hidden md:block"/> ingredientes
        </h1>
        <p className="text-xl text-aubergine-dark/60 font-serif italic max-w-2xl">
          Descubre la ciencia interactiva detrás de la comida real. Cómo cada especia, semilla y alimento vivo modula tu biología y tu estado de ánimo.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="sticky top-20 z-30 bg-[var(--background)]/90 backdrop-blur-md py-6 border-b border-aubergine-dark/10 mb-12 space-y-6">
        <form action="/glosario" method="GET" onSubmit={e => e.preventDefault()} className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aubergine-dark/40" aria-hidden="true" />
          <input
            type="text"
            name="q"
            placeholder="Busca por ingrediente o beneficio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-cream rounded-full border border-aubergine-dark/10 text-aubergine-dark placeholder:text-aubergine-dark/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 transition-shadow shadow-sm"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-aubergine-dark/30 hover:text-aubergine-dark p-1" aria-label="Limpiar búsqueda">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mood Filters */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterMood(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${!filterMood ? 'bg-[#6B2737] text-white' : 'bg-transparent text-aubergine-dark/50 hover:bg-[#6B2737]/5'}`}
            >
              Todos
            </button>
            {MOODS.map(m => {
              const colors = MOOD_COLORS[m.id];
              return (
                <button 
                  key={m.id}
                  onClick={() => setFilterMood(m.id)}
                  className="shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors border"
                  style={filterMood === m.id 
                    ? { backgroundColor: colors.color, borderColor: colors.color, color: '#3D1517' } 
                    : { backgroundColor: 'transparent', borderColor: colors.color, color: colors.color }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Category Filters */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${!filterCategory ? 'text-[#FF6B35]' : 'text-aubergine-dark/40 hover:text-[#FF6B35]'}`}
            >
              Cualquiera
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${filterCategory === c.id ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'text-aubergine-dark/50 hover:bg-[#FF6B35]/5'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={item.id}
            >
              <Link href={`/glosario/${item.slug}`} className="group block h-full">
                <div className="h-full bg-transparent border border-[#6B2737]/10 rounded-[2rem] hover:border-[#6B2737]/30 hover:bg-[#6B2737]/[0.02] transition-all duration-500 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col">
                  {/* Mood colour header — instant render */}
                  {(() => {
                    const firstMood = item.moods?.[0]
                    const color = firstMood ? (MOOD_COLORS[firstMood]?.color ?? "#FF6B35") : "#FF6B35"
                    return (
                      <div className="w-full h-2 rounded-t-[2rem]" style={{ backgroundColor: color }} />
                    )
                  })()}
                  <div className="p-8 flex flex-col flex-1">
                  {item.category && (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-[10px] uppercase tracking-widest font-bold self-start mb-4">
                       {categoryLabels[item.category] || item.category}
                     </span>
                  )}
                  <h3 className="text-3xl font-serif text-aubergine-dark group-hover:text-[#6B2737] transition-colors mb-4">{item.name}</h3>
                  <p className="text-[15px] font-light text-aubergine-dark/70 italic leading-relaxed line-clamp-3 mb-6 flex-1">
                    &ldquo;{item.tagline}&rdquo;
                  </p>
                  
                  {item.moods && item.moods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto border-t border-[#6B2737]/5 pt-4">
                      {item.moods.slice(0, 3).map((mood) => {
                        const colors = MOOD_COLORS[mood] || { color: '#888', bg: '#88815' };
                        return (
                          <span 
                            key={mood} 
                            className="text-[10px] px-2 py-1 rounded-md capitalize border border-transparent font-medium"
                            style={{ backgroundColor: colors.bg, color: colors.color }}
                          >
                            {mood}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Leaf className="w-12 h-12 text-aubergine-dark/10 mx-auto mb-6" />
          <h3 className="text-2xl font-serif text-aubergine-dark mb-2">Ningún ingrediente coincide</h3>
          <p className="text-aubergine-dark/50 font-light">Prueba relajando los filtros o buscando con otra palabra.</p>
        </div>
      )}
    </div>
  )
}
