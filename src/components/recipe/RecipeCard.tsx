import { Recipe } from "@/data/recipes";
import { moods } from "@/data/moods";
import Link from "next/link";
import { Clock, ChefHat, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import imageMapData from "@/data/recipe-image-map.json";

const imageMap = imageMapData as Record<string, string>;

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const mood = moods.find(m => m.id === recipe.moodId);
  const color = mood?.color || "#e07a5f";
  const imageUrl = imageMap[recipe.id];

  return (
    <Link href={`/recetas/${recipe.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -4 }}
        className="h-full bg-white border border-[#edeae3] rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 flex flex-col"
      >
        <div 
          className="relative w-full aspect-[4/3] bg-gray-50 border-b border-[#edeae3] overflow-hidden" 
          style={{ backgroundImage: imageUrl ? 'none' : `linear-gradient(to bottom right, ${color}10, ${color}30)` }}
        >
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={recipe.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
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
              <div className="flex items-center gap-4 text-navy/40 text-[11px] font-sans tracking-[0.1em] uppercase">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3"/> {recipe.prepTime}&apos;</span>
                <span className="flex items-center gap-1.5 capitalize"><ChefHat className="w-3 h-3"/> {recipe.difficulty}</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-serif text-navy mb-3 leading-[1.3] group-hover:text-gold transition-colors">
              {recipe.title}
            </h3>
            <p className="text-sm text-navy/50 italic font-light mb-5">&quot;{recipe.tagline}&quot;</p>
            <p className="text-sm text-navy/70 line-clamp-3 mb-8 leading-[1.8] font-light">
              {recipe.description}
            </p>
          </div>

          <div className="pt-6 border-t border-[#edeae3] mt-auto flex items-center justify-between group-hover:border-navy/10 transition-colors">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-navy/40 group-hover:text-navy/60 transition-colors">{recipe.ingredients.length} Ingredientes</span>
            <span className="w-10 h-10 rounded-full flex items-center justify-center border border-[#edeae3] bg-[var(--background)] group-hover:bg-navy group-hover:border-navy text-navy group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
