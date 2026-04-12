"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  calculatePalette, 
  PaletteResult as PaletteResultType 
} from "@/lib/emotional-palette";
import EmotionalSlider from "@/components/palette/EmotionalSlider";
import { 
  EnergyLow, EnergyHigh, 
  SerenityLow, SerenityHigh, 
  ClarityLow, ClarityHigh, 
  ConnectionLow, ConnectionHigh 
} from "@/components/palette/PaletteIcons";
import PaletteResultView from "@/components/palette/PaletteResult";
import { createClient } from "@/lib/supabase/client";
import { usePalette } from "@/contexts/PaletteContext";
import { Lock, Clock, ArrowRight, RotateCcw, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InteractivePalettePage() {
  const [screen, setScreen] = useState<'intro' | 'sliders' | 'result'>('intro');
  
  // Dimensions
  const [energia, setEnergia] = useState(5);
  const [serenidad, setSerenidad] = useState(5);
  const [claridad, setClaridad] = useState(5);
  const [conexion, setConexion] = useState(5);
  
  const [movedSliders, setMovedSliders] = useState<Set<string>>(new Set());
  const [visibleSliders, setVisibleSliders] = useState(1);
  const [recetas, setRecetas] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingRecetas, setIsLoadingRecetas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paletteResult, setPaletteResult] = useState<PaletteResultType | null>(null);

  const { refreshPalette } = usePalette();
  const supabase = createClient();

  // ── Authentication & Status ──────────────────────────────────
  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .single();
        if (profile?.is_premium) setIsPremium(true);
      }
    }
    checkStatus();
  }, []);

  // ── Sequential Slider Logic ──────────────────────────────────
  useEffect(() => {
    if (screen === 'sliders') {
      if (movedSliders.has('energia') && visibleSliders < 2) {
        setTimeout(() => setVisibleSliders(2), 800);
      }
      if (movedSliders.has('serenidad') && visibleSliders < 3) {
        setTimeout(() => setVisibleSliders(3), 800);
      }
      if (movedSliders.has('claridad') && visibleSliders < 4) {
        setTimeout(() => setVisibleSliders(4), 800);
      }
    }
  }, [movedSliders, screen, visibleSliders]);

  // ── Calculation ─────────────────────────────────────────────
  const currentPalette = useMemo(() => {
    return calculatePalette({ energia, serenidad, claridad, conexion });
  }, [energia, serenidad, claridad, conexion]);

  // ── Luminance Check for Button Text ──────────────────────────
  const isDarkColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 140;
  };

  const markMoved = (id: string) => {
    setMovedSliders(prev => new Set(prev).add(id));
  };

  const handleShowResult = async () => {
    setPaletteResult(currentPalette);
    setScreen('result');
    setIsLoadingRecetas(true);
    
    try {
      // mood_es column confirmed
      const { data } = await supabase
        .from('recetas')
        .select('id, nombre_es, mood_es, tiempo_preparacion_min, tipo_plato')
        .eq('mood_es', currentPalette.moodDominante)
        .limit(3);
      
      if (data) setRecetas(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setIsLoadingRecetas(false);
    }
  };

  const savePalette = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth/login?redirect=/paleta";
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('emotional_palettes').insert({
        user_id: user.id,
        energia,
        serenidad,
        claridad,
        conexion,
        mood_dominante: currentPalette.moodDominante,
        mood_secundario: currentPalette.moodSecundario,
        color_resultado: currentPalette.colorMezclado,
        recetas_sugeridas: recetas.map(r => r.id)
      });
      if (error) throw error;
      
      // Update global context immediately
      await refreshPalette();
      
      alert("¡Paleta guardada en tu diario!");
    } catch (err) {
      console.error("Error saving palette:", err);
      alert("Error al guardar la paleta.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setEnergia(5);
    setSerenidad(5);
    setClaridad(5);
    setConexion(5);
    setMovedSliders(new Set());
    setVisibleSliders(1);
    setScreen('intro');
  };

  return (
    <main className="min-h-[100dvh] bg-[#FAF9F6]">
      <AnimatePresence mode="wait">
        
        {/* ── INTRO SCREEN ────────────────────────────────────── */}
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
          >
            <h1 className="font-serif text-[48px] text-[#6B2737] mb-4 leading-tight">
              Tu Paleta Emocional
            </h1>
            <p className="font-sans text-[20px] text-[#7a7974] font-light mb-8 max-w-md">
              Cuatro preguntas. Tu color de hoy. Las recetas que necesitas.
            </p>
            
            <div className="flex gap-2 mb-12">
              {["#E8A838", "#7BA7BC", "#5B8C5A", "#C97B84", "#9B8EC4", "#D4956A"].map(c => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>

            <button
              onClick={() => setScreen('sliders')}
              className="bg-[#6B2737] text-[#FAF9F6] rounded-[60px] px-12 py-4 font-sans text-[18px] font-medium transition-transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Descubrir mi color
            </button>
            <p className="mt-4 font-sans text-[14px] text-[#7a7974] opacity-50">
              Tarda menos de 30 segundos.
            </p>
          </motion.div>
        )}

        {/* ── SLIDERS SCREEN ──────────────────────────────────── */}
        {screen === 'sliders' && (
          <motion.div
            key="sliders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[600px] mx-auto py-20 px-6 flex flex-col items-center"
          >
            {/* Slider 1: Energía */}
            {visibleSliders >= 1 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Tu nivel de energía ahora mismo"
                  value={energia}
                  colorEnd="#E8A838"
                  iconLeft={<EnergyLow />}
                  iconRight={<EnergyHigh />}
                  onChange={(v) => { setEnergia(v); markMoved('energia'); }}
                />
              </motion.div>
            )}

            {/* Slider 2: Serenidad */}
            {visibleSliders >= 2 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Cuánta calma sientes en el cuerpo"
                  value={serenidad}
                  colorEnd="#7BA7BC"
                  iconLeft={<SerenityLow />}
                  iconRight={<SerenityHigh />}
                  onChange={(v) => { setSerenidad(v); markMoved('serenidad'); }}
                />
              </motion.div>
            )}

            {/* Slider 3: Claridad */}
            {visibleSliders >= 3 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Cómo está tu mente ahora"
                  value={claridad}
                  colorEnd="#5B8C5A"
                  iconLeft={<ClarityLow />}
                  iconRight={<ClarityHigh />}
                  onChange={(v) => { setClaridad(v); markMoved('claridad'); }}
                />
              </motion.div>
            )}

            {/* Slider 4: Conexión */}
            {visibleSliders >= 4 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Cuánta apertura sientes hacia los demás"
                  value={conexion}
                  colorEnd="#C97B84"
                  iconLeft={<ConnectionLow />}
                  iconRight={<ConnectionHigh />}
                  onChange={(v) => { setConexion(v); markMoved('conexion'); }}
                />
              </motion.div>
            )}

            {/* Real-time Preview HUD */}
            {movedSliders.size > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ 
                  backgroundColor: currentPalette.colorMezclado,
                  position: 'fixed' as const,
                  bottom: '24px',
                  right: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 50
                }}
              />
            )}

            {/* Ver mi color Button */}
            {movedSliders.size === 4 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleShowResult}
                style={{ 
                  backgroundColor: currentPalette.colorMezclado,
                  color: isDarkColor(currentPalette.colorMezclado) ? '#FAF9F6' : '#6B2737'
                }}
                className="mt-12 px-12 py-4 rounded-[60px] font-sans text-[18px] font-bold shadow-luxury transition-transform hover:scale-105 active:scale-95"
              >
                Ver mi color
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── RESULT SCREEN ───────────────────────────────────── */}
        {screen === 'result' && paletteResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pb-20"
            style={{ 
              background: `linear-gradient(to bottom, ${paletteResult.colorDominante}18, transparent)` 
            }}
          >
            <PaletteResultView result={paletteResult} animate={true} />

            <div className="max-w-2xl mx-auto px-6">
              <h3 className="font-serif text-[24px] text-[#6B2737] mb-8 text-center mt-12">
                Tus recetas de hoy
              </h3>

              {isLoadingRecetas ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-[#6B2737] w-8 h-8" />
                </div>
              ) : (
                <div className="space-y-4 mb-16">
                  {recetas.map((r) => (
                    <div key={r.id} className="relative group">
                      <div className="bg-white rounded-2xl p-6 border border-[#6B2737]/5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                              style={{ 
                                backgroundColor: paletteResult.colorDominante + '15',
                                color: paletteResult.colorDominante
                              }}
                            >
                              {r.mood_es}
                            </span>
                            <h4 className="font-serif text-lg text-[#6B2737] font-semibold">{r.nombre_es}</h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-[#7a7974] font-light">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.tiempo_preparacion_min} min</span>
                              <span className="capitalize">{r.tipo_plato}</span>
                            </div>
                          </div>
                          
                          {isPremium ? (
                            <Link href={`/recetas/${r.id}`} className="p-2 rounded-full bg-[#6B2737]/5 text-[#6B2737] hover:bg-[#6B2737]/10 transition-colors">
                              <ArrowRight className="w-5 h-5" />
                            </Link>
                          ) : (
                            <Link href="/pricing" className="flex items-center gap-2 p-2 px-4 rounded-full bg-[#6B2737]/5 text-[#6B2737] hover:bg-[#6B2737]/10 transition-colors text-xs font-semibold">
                              <Lock className="w-3.5 h-3.5" /> Desbloquea
                            </Link>
                          )}
                        </div>
                      </div>
                      
                      {!isPremium && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Link href="/pricing" className="bg-[#6B2737] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                             Hazte Premium →
                           </Link>
                        </div>
                      )}
                    </div>
                  ))}
                  {recetas.length === 0 && (
                    <p className="text-center text-[#7a7974] italic">Preparando sugerencias personalizadas...</p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={savePalette}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#6B2737] text-[#FAF9F6] px-8 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-[#5a212e] transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar en mi diario
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 border border-[#6B2737]/20 text-[#6B2737] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#6B2737]/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir test
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
