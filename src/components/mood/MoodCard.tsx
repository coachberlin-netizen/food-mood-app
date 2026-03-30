"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MoodState } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"

interface MoodCardProps {
  mood: MoodState;
  className?: string;
  index?: number;
}

export function MoodCard({ mood, className, index = 0 }: MoodCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/recipes?mood=${mood.id}`)}
      className={cn(
        "group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative h-full flex flex-col",
        className
      )}
      style={{ backgroundColor: mood.fondo, borderColor: `${mood.color}20` }}
    >
      <div className="p-6 md:p-8 flex flex-col h-full z-10 relative">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl translate-y-0 group-hover:scale-110 transition-transform duration-300 origin-bottom-left">
              {mood.emoji}
            </div>
            {/* Optional decorative element */}
            <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: mood.color }}></div>
          </div>
          
          <h3 className="text-2xl font-serif font-bold mb-3" style={{ color: mood.color }}>
            {mood.nombre}
          </h3>
          
          <p className="text-sm font-medium text-aubergine-dark/80 dark:text-aubergine-dark/70 mb-4 transition-all duration-300 group-hover:line-clamp-none line-clamp-2">
            &quot;{mood.descripcion_corta}&quot;
          </p>
        </div>

        {/* Expandable ingredients list */}
        <div className="mt-auto overflow-hidden opacity-80 max-h-0 group-hover:max-h-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out">
          <div className="pt-4 border-t border-aubergine-dark/10 mt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: mood.color }}>
              Ingredientes Clave
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mood.ingredientes.map((ing) => (
                <span 
                  key={ing} 
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-cream/60 dark:bg-black/5 text-aubergine-dark border border-aubergine-dark/5 shadow-sm"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Background glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at bottom right, ${mood.color}, transparent 60%)` }}
      />
    </Card>
  )
}
