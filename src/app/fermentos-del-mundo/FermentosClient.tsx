"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"


const MOOD_COLORS: Record<string, string> = {
  activacion: "#FFB000",
  calma: "#00D1FF",
  focus: "#00DD80",
  social: "#FF2D55",
  reset: "#9D00FF",
  confort: "#FF6B00",
};

interface Ferment {
  id: string;
  slug: string;
  name: string;
  country: string;
  country_code: string;
  lat: number;
  lng: number;
  mood: string;
  teaser: string;
  ferment_type: string;
  tagline: string | null;
  brain_connection: string | null;
  ingredients: string[] | null;
  recipe_elaboration: string | null;
  key_compounds: string[] | null;
  probiotic_strains: string[] | null;
  image_url: string | null;
}

function getPosition(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

const WorldAbstractSVG = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full text-aubergine-dark/5" fill="currentColor">
    <path d="M 150 100 Q 250 50 300 150 Q 200 250 150 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
    <path d="M 130 90 Q 240 60 280 140 Q 180 230 140 190 Z" fill="currentColor" opacity="0.5"/>
    <path d="M 280 250 Q 350 250 330 400 Q 260 450 260 300 Z" fill="currentColor" opacity="0.5"/>
    <path d="M 450 120 Q 550 80 600 200 Q 550 400 480 350 Q 420 200 450 120 Z" fill="currentColor" opacity="0.5"/>
    <path d="M 580 100 Q 800 50 850 200 Q 750 300 600 250 Z" fill="currentColor" opacity="0.5"/>
    <path d="M 780 350 Q 850 300 900 400 Q 800 450 780 350 Z" fill="currentColor" opacity="0.5"/>
  </svg>
);

export default function FermentosClient({
  initialFerments,
  isPremium
}: {
  initialFerments: Ferment[],
  isPremium: boolean
}) {
  const [hoveredFerment, setHoveredFerment] = useState<string | null>(null);
  const [selectedFerment, setSelectedFerment] = useState<Ferment | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleFermentClick = (ferment: Ferment) => {
    if (isPremium) {
      setSelectedFerment(ferment);
    } else {
      setShowUpgradeModal(true);
    }
  };

  return (
    <div className="w-full relative">

      {/* ── MAPA INTERACTIVO ── */}
      <section className="relative w-full max-w-6xl mx-auto h-[60vh] md:h-[70vh] bg-cream overflow-hidden border-y border-aubergine-dark/10">
        <div className="absolute inset-0 z-0">
          <WorldAbstractSVG />
        </div>

        {initialFerments.map((ferment) => {
          const color = MOOD_COLORS[ferment.mood] || "#6B2737";
          const isHovered = hoveredFerment === ferment.slug;
          const pos = getPosition(ferment.lat, ferment.lng);

          return (
            <motion.div
              key={ferment.slug}
              className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
              onMouseEnter={() => setHoveredFerment(ferment.slug)}
              onMouseLeave={() => setHoveredFerment(null)}
              onClick={() => handleFermentClick(ferment)}
            >
              <div className="relative flex items-center justify-center cursor-pointer group">
                <motion.div
                  className="absolute rounded-full"
                  style={{ backgroundColor: color, opacity: 0.2, width: '40px', height: '40px' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-md z-10 transition-transform duration-300 group-hover:scale-150"
                  style={{ backgroundColor: color }}
                />
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-8 bg-cream border border-aubergine-dark/10 shadow-luxury py-2 px-4 rounded-md flex flex-col items-center pointer-events-none whitespace-nowrap min-w-max z-50"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-aubergine-dark/50 font-bold mb-1">
                      {ferment.country}
                    </span>
                    <span className="text-sm font-serif text-aubergine-dark font-medium">
                      {ferment.name}
                    </span>
                    <span
                      className="mt-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: color }}
                    >
                      {ferment.mood}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>

      {/* ── GRID ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto bg-cream">
        <div className="text-center mb-16">
          <h2 className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-4">El Catálogo</h2>
          <h3 className="text-3xl md:text-4xl font-serif text-aubergine-dark italic">Descubre el índice vivo</h3>
        </div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {initialFerments.map((ferment, index) => {
            const color = MOOD_COLORS[ferment.mood] || "#6B2737";
            return (
              <motion.div
                key={ferment.slug}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="group relative bg-white rounded-xl border border-aubergine-dark/10 flex flex-col items-start cursor-pointer hover:shadow-luxury-hover transition-all duration-300 overflow-hidden"
                onClick={() => handleFermentClick(ferment)}
              >
                {/* Mood colour accent */}
                <div className="w-full h-1.5" style={{ backgroundColor: color }} />

                <div className="p-6 flex flex-col items-start w-full flex-1">
                <div className="flex justify-between items-center w-full mb-4">
                  <span className="text-[10px] font-sans tracking-[0.1em] uppercase text-aubergine-dark/40">
                    {ferment.country}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                </div>

                <h4 className="text-xl font-serif text-aubergine-dark font-medium mb-3 group-hover:text-[#C9A84C] transition-colors">
                  {ferment.name}
                </h4>

                <p className="text-sm font-light text-aubergine-dark/60 line-clamp-3 leading-relaxed mb-6">
                  {ferment.teaser}
                </p>

                <div className="mt-auto pt-4 w-full border-t border-aubergine-dark/5 flex items-center justify-between">
                  <span
                    className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    {ferment.mood}
                  </span>
                  {!isPremium && (
                    <span className="flex items-center justify-center p-1.5 rounded-full bg-aubergine-dark/5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-aubergine-dark/40">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                  )}
                </div>
                </div>{/* end inner padding */}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── MODAL DETALLE (PREMIUM) ── */}
      <AnimatePresence>
        {selectedFerment && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-aubergine-dark/80 backdrop-blur-sm"
              onClick={() => setSelectedFerment(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-2xl my-8 bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-[#2d0f16] px-8 pt-8 pb-6">
                <button
                  onClick={() => setSelectedFerment(null)}
                  className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors p-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: MOOD_COLORS[selectedFerment.mood] || "#C9A84C" }}>
                  {selectedFerment.country} · {selectedFerment.ferment_type}
                </p>
                <h2 className="font-serif text-3xl font-bold text-[#F5F0E8] leading-tight mb-2">
                  {selectedFerment.name}
                </h2>
                {selectedFerment.tagline && (
                  <p className="text-sm font-light text-[#F5F0E8]/60 italic">{selectedFerment.tagline}</p>
                )}
              </div>

              <div className="px-8 py-6 space-y-6">

                {/* Eje intestino-cerebro */}
                {selectedFerment.brain_connection && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-2">Eje intestino — cerebro</p>
                    <p className="text-sm font-light leading-relaxed text-aubergine-dark/80">
                      {selectedFerment.brain_connection}
                    </p>
                  </div>
                )}

                {/* Compuestos clave */}
                {selectedFerment.key_compounds && selectedFerment.key_compounds.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-2">Compuestos clave</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFerment.key_compounds.map((c, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-[#2d0f16]/8 text-aubergine-dark/70 border border-aubergine-dark/10">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredientes */}
                {selectedFerment.ingredients && selectedFerment.ingredients.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-3">Ingredientes</p>
                    <ul className="space-y-1.5">
                      {selectedFerment.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-light text-aubergine-dark/80">
                          <span className="text-[#C9A84C] mt-0.5 shrink-0">—</span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Elaboración */}
                {selectedFerment.recipe_elaboration && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-3">Elaboración</p>
                    <p className="text-sm font-light leading-relaxed text-aubergine-dark/80 whitespace-pre-line">
                      {selectedFerment.recipe_elaboration}
                    </p>
                  </div>
                )}

                {/* Cepas probióticas */}
                {selectedFerment.probiotic_strains && selectedFerment.probiotic_strains.length > 0 && (
                  <div className="bg-[#2d0f16]/5 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-2">Cepas probióticas</p>
                    <p className="text-[11px] font-light text-aubergine-dark/60 italic">
                      {selectedFerment.probiotic_strains.join(' · ')}
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL UPGRADE (NO PREMIUM) ── */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-aubergine-dark/80 backdrop-blur-sm"
              onClick={() => setShowUpgradeModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#6B2737] to-[#1a1118] rounded-[2rem] p-10 shadow-2xl border border-[#C9A84C]/30 text-center"
            >
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-6 right-6 text-cream/40 hover:text-cream transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>

              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6 text-[#C9A84C]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"></path>
                </svg>
              </div>

              <h2 className="text-3xl font-serif font-black text-cream/95 mb-4 leading-tight">
                Este viaje es para exploradores Premium
              </h2>
              <p className="text-cream/60 font-light text-base leading-relaxed mb-8">
                Desbloquea 16 fermentos ancestrales, sus ingredientes, recetas de elaboración y la ciencia detrás de cada cultivo vivo.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-white text-sm font-bold rounded-full shadow-lg hover:bg-[#b8953e] transition-colors"
                >
                  Explorar con Premium — Desde 7€/mes
                </Link>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-4 text-cream/40 hover:text-cream text-xs font-light tracking-wide transition-colors"
                >
                  Seguir mirando el mapa abierto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
