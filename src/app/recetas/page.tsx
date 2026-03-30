"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { recipesData } from "@/data/recipes";
import { RecipeFilter } from "@/components/recipe/RecipeFilter";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

function RecipesContent() {
  const searchParams = useSearchParams();
  const initialMood = searchParams.get("mood");
  
  const [activeMood, setActiveMood] = useState<string | null>(initialMood);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = recipesData.filter((recipe) => {
    const matchesMood = activeMood ? recipe.moodId === activeMood : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.ingredients.some(i => i.name.toLowerCase().includes(searchLower)) ||
      recipe.tags.some(t => t.toLowerCase().includes(searchLower));
      
    return matchesMood && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 md:py-20 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-cream mb-6 leading-[1.2]">
            Recetas con superpoderes
          </h1>
          <p className="text-xl text-cream/70 font-light max-w-2xl">
            Encuentra lo que tu cuerpo necesita hoy. Puro placer, cero culpa.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-10">
          <RecipeFilter activeMood={activeMood} onSelectMood={setActiveMood} />
          
          <div className="w-full md:w-80 relative">
            <input 
              type="text"
              placeholder="Buscar ingrediente o receta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-cream border border-aubergine-dark/20 shadow-sm focus:outline-none focus:border-aubergine-dark/30 focus:shadow-luxury transition-all font-light text-aubergine-dark placeholder:text-aubergine-dark/40"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aubergine-dark/30 w-5 h-5" />
          </div>
        </div>

        <RecipeGrid recipes={filteredRecipes} />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando recetas...</div>}>
      <RecipesContent />
    </Suspense>
  );
}
