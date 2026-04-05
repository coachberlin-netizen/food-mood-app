import { Recipe } from "@/data/recipes";
import { moods } from "@/data/moods";
import Link from "next/link";
import { Clock, ChefHat, ArrowRight, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import imageMapData from "@/data/recipe-image-map.json";

const imageMap = imageMapData as Record<string, string>;

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const mood = moods.find(m => m.id === recipe.moodId);
  const color = mood?.color || "#e07a5f";
  const imagePlaceholderMap: Record<string, string> = {
    "activacion": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(58).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg1OCkucG5nIiwiaWF0IjoxNzc0ODAxNjY3LCJleHAiOjE4MDYzMzc2Njd9.hHW079PfXq3_r3O9zjRQu9lxrSSrHKhTPCjrF_HXskQ",
    "calma": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(57).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg1NykucG5nIiwiaWF0IjoxNzc0ODAxNjkyLCJleHAiOjE4MDYzMzc2OTJ9.1LeeGWRPGhOyGOiuU5vfuPDw1vCvaccBQPFiwOAe8yY",
    "focus": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(59).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg1OSkucG5nIiwiaWF0IjoxNzc0ODAxNzM3LCJleHAiOjE4MDYzMzc3Mzd9.4kWlLiYvDco0tnxnsZ7vk6vVgChkIfg24IlyuMUwP0w",
    "social": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(60).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg2MCkucG5nIiwiaWF0IjoxNzc0ODAxNzU3LCJleHAiOjE4MDYzMzc3NTd9.-tpRW4BQDpG9cS0jRAI2GLNOrQQZBm6Nj1l854LnfvM",
    "reset": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(61).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg2MSkucG5nIiwiaWF0IjoxNzc0ODAxODE1LCJleHAiOjE4MDYzMzc4MTV9.77N2sScdMqw0WT7KiM-z8Z9kAvJd5Smo3S6uE_SSqbI",
    "familia": "https://hbiraafgjshhyjhpbqty.supabase.co/storage/v1/object/sign/placeholders/generated-image%20(62).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83ZTQxY2E0Yi1hYWIyLTQ4NDctOTBiMi0zZjY4M2EzOTExMzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwbGFjZWhvbGRlcnMvZ2VuZXJhdGVkLWltYWdlICg2MikucG5nIiwiaWF0IjoxNzc0ODAxODMwLCJleHAiOjE4MDYzMzc4MzB9.MR8uBTrTeV1W1hU0t5sXNz4qcxyT0zuDnoacK5g7OH4"
  };
  const previewPlaceholderUrl = imagePlaceholderMap[recipe.moodId || "social"] || imagePlaceholderMap["social"];

  return (
    <Link href={`/recetas/${recipe.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -4 }}
        className="h-full bg-cream border border-aubergine-dark/20 rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col"
      >
        <div className="relative w-full aspect-[4/3] border-b border-aubergine-dark/20 overflow-hidden">
          {/* Using img native specifically mapped as requested by the user */}
          <img 
            src={recipe.image || previewPlaceholderUrl} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <span 
                className="text-[10px] font-sans uppercase tracking-[0.2em] px-3 py-1.5 rounded-md"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                {mood?.emoji} {mood?.nombre}
              </span>
              <div className="flex items-center gap-4 text-aubergine-dark/40 text-[11px] font-sans tracking-[0.1em] uppercase">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {recipe.prepTime}&apos;</span>
                <span className="flex items-center gap-1.5 capitalize"><ChefHat className="w-3 h-3"/> {recipe.difficulty}</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-serif text-aubergine-dark mb-3 leading-[1.3] group-hover:text-gold transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-aubergine-dark/50 italic font-light mb-5">&quot;{recipe.tagline}&quot;</p>
            <p className="text-sm text-aubergine-dark/70 line-clamp-3 mb-8 leading-[1.8] font-light">
              {recipe.description}
            </p>
          </div>

          <div className="pt-6 border-t border-aubergine-dark/20 mt-auto flex items-center justify-between group-hover:border-aubergine-dark/10 transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 group-hover:text-aubergine-dark/60 transition-colors">{recipe.ingredients.length} Ingredientes</span>
            <span className="w-10 h-10 rounded-full flex items-center justify-center border border-aubergine-dark/20 bg-[var(--background)] group-hover:bg-aubergine-dark group-hover:border-aubergine-dark text-aubergine-dark group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
