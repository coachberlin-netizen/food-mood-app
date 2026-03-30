"use client";

import { Recipe } from "@/data/recipes";
import { RecipeCard } from "./RecipeCard";
import { motion, AnimatePresence } from "framer-motion";

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-xl font-serif text-aubergine-dark/50">No hemos encontrado recetas con estos filtros.</p>
        <p className="text-sm mt-2 text-aubergine-dark/40">Intenta buscar otro estado o ingrediente.</p>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="h-full"
          >
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
