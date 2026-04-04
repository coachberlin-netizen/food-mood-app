"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, CheckCircle2 } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-aubergine-dark/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-cream rounded-[2rem] p-8 md:p-12 shadow-luxury z-50 overflow-hidden"
          >
            {/* Gold Decorative Line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-80" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-aubergine-dark/50 hover:text-aubergine-dark transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-black text-aubergine-dark">
                  Desbloquea el Placer Infinito
                </h2>
                <p className="text-aubergine-dark/70 font-light max-w-sm mx-auto">
                  Accede a la bóveda de recetas exclusivas y disfruta de tu propio Chef de IA cada día.
                </p>
              </div>

              <div className="w-full space-y-4 text-left bg-white/50 p-6 rounded-2xl border border-aubergine-dark/5">
                {[
                  "Acceso al catálogo exclusivo completo",
                  "Nueva receta con IA cada 24 horas",
                  "Historial ilimitado de recetas guardadas",
                  "Soporte premium personalizado"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0" />
                    <span className="text-aubergine-dark/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="w-full pt-4 space-y-3">
                <button 
                  onClick={() => alert("Redirigiendo al checkout...")}
                  className="w-full py-4 rounded-full bg-aubergine-dark text-white font-medium hover:bg-aubergine transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Hazte Premium — 9.99€/mes
                </button>
                <p className="text-xs text-aubergine-dark/50 font-medium">
                  Cancela cuando quieras. Sin compromisos.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
