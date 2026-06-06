"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Lock, Sparkles } from "lucide-react";
import { moods as MOODS } from "@/data/moods";

interface LockedReceta {
  id: string;
  nombre_es: string;
  mood_es?: string;
  moodId?: string;
}

const MOOD_PHRASES: Record<string, string> = {
  activacion: "Energía y placer desde el primer bocado.",
  calma:      "Una receta que invita al descanso y a recuperar el centro.",
  focus:      "Cada ingrediente apoya tu concentración sostenida.",
  social:     "Un plato que nutre la conexión — y el placer de compartir.",
  reset:      "Ingredientes que cuidan tu microbiota y te ayudan a restaurar.",
  confort:    "El abrazo nutricional que tu sistema nervioso pide.",
};

interface Props {
  receta: LockedReceta | null;
  onClose: () => void;
}

export function PaywallModal({ receta, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!receta) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [receta, onClose]);

  const mood = MOODS.find(m =>
    receta?.moodId === m.id ||
    receta?.mood_es?.toLowerCase().includes(m.id)
  ) || MOODS[0];

  const phrase = MOOD_PHRASES[mood.id] ?? "Accede a esta receta y descubre su poder nutricional.";

  return (
    <AnimatePresence>
      {receta && (
        <motion.div
          ref={overlayRef}
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="paywall-title"
          >
            {/* Color top bar */}
            <div className="h-1" style={{ backgroundColor: mood.color }} />

            <div className="p-8 flex flex-col items-center text-center gap-5">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-[#6B2737]/40 hover:text-[#6B2737] hover:bg-[#6B2737]/5 transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>

              {/* Lock icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${mood.color}15` }}
              >
                <Lock size={22} style={{ color: mood.color }} />
              </div>

              {/* Mood badge */}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ color: mood.color, backgroundColor: `${mood.color}15` }}
              >
                {mood.emoji} {mood.nombre}
              </span>

              {/* Recipe name */}
              <h2
                id="paywall-title"
                className="font-serif text-xl font-bold leading-snug"
                style={{ color: "#2d0f16" }}
              >
                {receta.nombre_es}
              </h2>

              {/* Contextual phrase */}
              <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.65)" }}>
                {phrase}
              </p>

              {/* CTA */}
              <Link
                href="/pricing"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#FF6B35" }}
              >
                <Sparkles size={15} />
                Desbloquear — desde 7€/mes
              </Link>

              {/* Secondary */}
              <Link
                href="/registro"
                className="text-xs font-light transition-colors"
                style={{ color: "rgba(107,39,55,0.45)" }}
              >
                ¿Sin cuenta? Crear una gratis →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
