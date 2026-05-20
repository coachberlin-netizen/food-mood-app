import { Recipe } from "@/data/recipes";
import { moods } from "@/data/moods";
import Link from "next/link";
import { Clock, ChefHat, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Mood-specific emoji decorations for the card header
const MOOD_EMOJI: Record<string, string> = {
  activacion: "⚡", calma: "🌊", focus: "🎯",
  social: "✨",    reset: "🌿", familia: "🕯️",
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const mood  = moods.find(m => m.id === recipe.moodId)
  const color = mood?.color || "#e07a5f"
  const emoji = MOOD_EMOJI[recipe.moodId || ""] || "🍽️"

  return (
    <Link href={`/recetas/${recipe.id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="h-full bg-cream border border-aubergine-dark/20 rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col"
      >
        {/* ── Instant-render mood header (no image request) ── */}
        <div
          className="relative w-full h-32 flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${color}22 0%, ${color}08 100%)`,
            borderBottom: `1px solid ${color}20`,
          }}
        >
          {/* Large decorative emoji */}
          <span className="text-6xl opacity-20 select-none group-hover:opacity-30 transition-opacity duration-500">
            {emoji}
          </span>
          {/* Subtle colour accent bar at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: color }} />
        </div>

        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span
                className="text-[10px] font-sans uppercase tracking-[0.2em] px-3 py-1.5 rounded-md"
                style={{ backgroundColor: `${color}15`, color }}
              >
                {mood?.emoji} {mood?.nombre}
              </span>
              <div className="flex items-center gap-4 text-aubergine-dark/40 text-[11px] font-sans tracking-[0.1em] uppercase">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {recipe.prepTime}&apos;</span>
                <span className="flex items-center gap-1.5 capitalize"><ChefHat className="w-3 h-3" /> {recipe.difficulty}</span>
              </div>
            </div>

            <h3 className="text-2xl font-serif text-aubergine-dark mb-3 leading-[1.3] group-hover:text-gold transition-colors">
              {recipe.nombre_es || recipe.title}
            </h3>
            <p className="text-sm text-aubergine-dark/50 italic font-light mb-5">&quot;{recipe.tagline || recipe.contexto_es}&quot;</p>
            <p className="text-sm text-aubergine-dark/70 line-clamp-3 mb-8 leading-[1.8] font-light">
              {recipe.description}
            </p>
          </div>

          <div className="pt-6 border-t border-aubergine-dark/20 mt-auto flex items-center justify-between group-hover:border-aubergine-dark/10 transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 group-hover:text-aubergine-dark/60 transition-colors">
              {recipe.ingredients.length} Ingredientes
            </span>
            <span className="w-10 h-10 rounded-full flex items-center justify-center border border-aubergine-dark/20 bg-[var(--background)] group-hover:bg-aubergine-dark group-hover:border-aubergine-dark text-aubergine-dark group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
