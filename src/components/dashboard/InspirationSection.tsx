"use client";

import { useMemo } from "react";
import { Sparkles, Leaf, Timer } from "lucide-react";
import { moods } from "@/data/moods";

interface InspirationData {
  phrase: string;
  ingredient: string;
  benefit: string;
  ritual: string;
}

const INSPIRATION_MAP: Record<string, InspirationData[]> = {
  activacion: [
    {
      phrase: "Despierta a tu ritmo y cómete el día.",
      ingredient: "Jengibre",
      benefit: "Activa tu nervio vago y despierta tu visión.",
      ritual: "Respira 3 veces con la mano en el abdomen antes de comer."
    },
    {
      phrase: "Tu energía es tu mayor activo.",
      ingredient: "Limón",
      benefit: "Estimula la motilidad gástrica al instante.",
      ritual: "Estira los brazos hacia el cielo al terminar tu primer vaso de agua."
    }
  ],
  calma: [
    {
      phrase: "Baja las revoluciones y ponte muy cómodo.",
      ingredient: "Lavanda",
      benefit: "Calma el eje HPA y reduce el cortisol.",
      ritual: "Deja el móvil 5 minutos antes de sentarte a la mesa."
    }
  ],
  focus: [
    {
      phrase: "Afila la mente, no la ansiedad.",
      ingredient: "Té Matcha",
      benefit: "L-teanina para una concentración sin picos.",
      ritual: "Cierra los ojos 10 segundos y visualiza tu tarea más importante."
    }
  ],
  social: [
    {
      phrase: "Todo sabe mejor con alguien enfrente.",
      ingredient: "Fermentos",
      benefit: "Mejoran tu humor vía producción de serotonina.",
      ritual: "Sonríe internamente al primer bocado que compartas."
    }
  ],
  reset: [
    {
      phrase: "El cuerpo sabe cómo volver.",
      ingredient: "Cúrcuma",
      benefit: "Apoya la depuración hepática natural.",
      ritual: "Bebe un vaso de agua tibia con limón en ayunas."
    }
  ],
  familia: [
    {
      phrase: "Sabor que une. Calidez para todos.",
      ingredient: "Caldo de huesos",
      benefit: "Colágeno para reconstruir tu barrera intestinal.",
      ritual: "Agradece el alimento en silencio antes de empezar."
    }
  ]
};

export function InspirationSection({ currentMoodId }: { currentMoodId: string }) {
  const data = useMemo(() => {
    const options = INSPIRATION_MAP[currentMoodId] || INSPIRATION_MAP.social;
    const today = new Date().toISOString().split('T')[0];
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return options[hash % options.length];
  }, [currentMoodId]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-aubergine-dark/40 uppercase tracking-[0.2em]">
          Inspiración de hoy
        </h2>
        <div className="h-px bg-[#FF6B35] flex-1 opacity-20"></div>
      </div>

      <div className="bg-cream rounded-[1.5rem] p-8 border border-aubergine-dark/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B35]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-aubergine-dark/30 mb-1">
              <Sparkles className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Mood</span>
            </div>
            <p className="text-xl font-serif italic text-aubergine-dark leading-relaxed">
              &quot;{data.phrase}&quot;
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-aubergine-dark/30 mb-1">
              <Leaf className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Ingrediente</span>
            </div>
            <div>
              <p className="text-sm font-bold text-aubergine-dark">{data.ingredient}</p>
              <p className="text-xs text-aubergine-dark/50 font-light mt-1">{data.benefit}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-aubergine-dark/30 mb-1">
              <Timer className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Micro-ritual</span>
            </div>
            <p className="text-xs text-aubergine-dark/60 font-light leading-relaxed">
              {data.ritual}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
