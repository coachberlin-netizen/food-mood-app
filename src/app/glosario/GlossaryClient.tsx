"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, X, Sparkles, Leaf } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface GlossaryItem {
  id: string
  name: string
  slug: string
  tagline: string
  category: string
  moods: string[]
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
  { id: 'otro', label: 'Otros' }
];

const MOODS = [
  { id: "activacion", label: "Activación" },
  { id: "calma", label: "Calma" },
  { id: "focus", label: "Focus" },
  { id: "social", label: "Social" },
  { id: "recuperacion", label: "Recuperación" },
  { id: "reset", label: "Reset" }
];

export default function GlossaryClient({ initialData }: { initialData: GlossaryItem[] }) {
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterMood, setFilterMood] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = search ? (item.name.toLowerCase().includes(search.toLowerCase()) || (item.tagline && item.tagline.toLowerCase().includes(search.toLowerCase()))) : true;
      const matchCat = filterCategory ? item.category === filterCategory : true;
      const matchMood = filterMood ? item.moods && item.moods.includes(filterMood) : true;
      return matchSearch && matchCat && matchMood;
    })
  }, [initialData, search, filterCategory, filterMood])

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
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aubergine-dark/40" />
          <input
            type="text"
            placeholder="Busca por ingrediente o beneficio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-cream rounded-full border border-aubergine-dark/10 text-aubergine-dark placeholder:text-aubergine-dark/30 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] transition-shadow shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-aubergine-dark/30 hover:text-aubergine-dark p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mood Filters */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterMood(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${!filterMood ? 'bg-[#6B2737] text-white' : 'bg-transparent text-aubergine-dark/50 hover:bg-[#6B2737]/5'}`}
            >
              Todos
            </button>
            {MOODS.map(m => (
              <button 
                key={m.id}
                onClick={() => setFilterMood(m.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors border ${filterMood === m.id ? 'bg-[#6B2737]/10 border-[#6B2737] text-[#6B2737]' : 'bg-cream border-aubergine-dark/5 text-aubergine-dark/50 hover:border-aubergine-dark/20'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setFilterCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${!filterCategory ? 'text-[#C9A84C]' : 'text-aubergine-dark/40 hover:text-[#C9A84C]'}`}
            >
              Cualquiera
            </button>
            {CATEGORIES.map(c => (
              <button 
                key={c.id}
                onClick={() => setFilterCategory(c.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors ${filterCategory === c.id ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-aubergine-dark/50 hover:bg-[#C9A84C]/5'}`}
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
                <div className="h-full bg-transparent border border-[#6B2737]/10 p-8 rounded-[2rem] hover:border-[#6B2737]/30 hover:bg-[#6B2737]/[0.02] transition-all duration-500 shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col">
                  {item.category && (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] uppercase tracking-widest font-bold self-start mb-4">
                       {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                     </span>
                  )}
                  <h3 className="text-3xl font-serif text-aubergine-dark group-hover:text-[#6B2737] transition-colors mb-4">{item.name}</h3>
                  <p className="text-[15px] font-light text-aubergine-dark/70 italic leading-relaxed line-clamp-3 mb-6 flex-1">
                    "{item.tagline}"
                  </p>
                  
                  {item.moods && item.moods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto border-t border-[#6B2737]/5 pt-4">
                      {item.moods.slice(0, 3).map((mood) => (
                        <span key={mood} className="text-[10px] px-2 py-1 bg-white/40 text-aubergine-dark/50 rounded-md capitalize border border-[#6B2737]/5">
                          {mood}
                        </span>
                      ))}
                    </div>
                  )}
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
