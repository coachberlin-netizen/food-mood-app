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

const MOOD_COLORS: Record<string, string> = {
  activacion: '#E8A87C',
  calma:      '#7EC8C8',
  focus:      '#F4E285',
  social:     '#F4A7B9',
  reset:      '#B8A9C9',
  confort:    '#D4A574'
};

export default function PaletaClient({ initialIsPremium }: { initialIsPremium: boolean }) {
  const [screen, setScreen] = useState<'intro' | 'sliders' | 'result'>('intro');
  
  const [energia, setEnergia] = useState(5);
  const [serenidad, setSerenidad] = useState(5);
  const [claridad, setClaridad] = useState(5);
  const [conexion, setConexion] = useState(5);
  
  const [movedSliders, setMovedSliders] = useState<Set<string>>(new Set());
  const [visibleSliders, setVisibleSliders] = useState(1);
  const [recetas, setRecetas] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(initialIsPremium);
  const [isLoadingRecetas, setIsLoadingRecetas] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paletteResult, setPaletteResult] = useState<PaletteResultType | null>(null);

  const { refreshPalette } = usePalette();
  const supabase = createClient();

  useEffect(() => {
    setIsPremium(initialIsPremium);
  }, [initialIsPremium]);

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

  const currentPalette = useMemo(() => {
    return calculatePalette({ energia, serenidad, claridad, conexion });
  }, [energia, serenidad, claridad, conexion]);

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

  const EditorialIntro = () => (
    <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#6B2737]/40 mb-8 block font-bold">Concepto & Ciencia</span>
        <h1 className="font-serif text-5xl md:text-7xl text-[#6B2737] mb-12 leading-[1.1] italic">
          La nutrición no es combustible. <br className="hidden md:block" />
          <span className="not-italic font-light opacity-80">Es información.</span>
        </h1>
        <p className="font-sans text-xl md:text-2xl text-[#7a7974] font-light max-w-2xl mx-auto leading-relaxed">
          El eje intestino-cerebro es el diálogo más poderoso de tu cuerpo. Tu paleta emocional es la traducción visual de ese equilibrio bioquímico.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
        <div className="space-y-8">
          <h2 className="font-serif text-3xl text-[#6B2737] italic">El espejo de tu microbiota</h2>
          <p className="text-[#7a7974] leading-relaxed font-light">
            El 95% de tu serotonina y el 50% de tu dopamina se sintetizan en el entorno gastrointestinal. No comemos solo para nutrir células, sino para modular neurotransmisores. 
          </p>
          <div className="pl-6 border-l border-[#6B2737]/10 flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm text-[#6B2737]/60 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#E8A838]"></span> Activación vía Dopamina
            </div>
            <div className="flex items-center gap-4 text-sm text-[#6B2737]/60 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#7BA7BC]"></span> Calma vía GABA
            </div>
            <div className="flex items-center gap-4 text-sm text-[#6B2737]/60 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#5B8C5A]"></span> Enfoque vía Acetilcolina
            </div>
          </div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-10 border border-[#6B2737]/5 shadow-xl">
          <h3 className="font-serif text-[13px] uppercase tracking-widest text-[#6B2737]/40 mb-6">Lo que revelan tus colores</h3>
          <p className="text-sm text-[#7a7974] leading-[1.8] font-light italic">
            "Tu paleta de hoy no es estática. Es un paisaje vivo que responde a la inflamación, el cortisol y la diversidad bacteriana. Al identificar tu color dominante, podemos seleccionar los prebióticos y fitoquímicos precisos para restaurar la homeostasis."
          </p>
          <div className="mt-8 flex justify-end">
            <span className="text-[11px] font-serif italic text-[#6B2737]/60 font-bold">— Dirección Científica, Food Mood</span>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="flex flex-col items-center gap-8 py-16 border-t border-[#6B2737]/5"
      >
        <p className="text-[#7a7974] font-medium tracking-wide text-sm uppercase">Comienza tu diagnóstico visual</p>
        <button
          onClick={() => setScreen('sliders')}
          className="bg-[#6B2737] text-[#FAF9F6] rounded-[60px] px-12 py-5 font-sans text-[18px] font-medium transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl flex items-center gap-4"
        >
          Descubrir mi color de hoy <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-[100dvh] bg-[#FAF9F6]">
      <AnimatePresence mode="wait">
        
        {screen === 'intro' && <EditorialIntro />}

        {screen === 'sliders' && (
          <motion.div
            key="sliders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-[600px] mx-auto py-20 px-6 flex flex-col items-center"
          >
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
              <h3 className="font-serif text-[24px] text-[#6B2737] mb-8 text-center mt-12">Tus recetas de hoy</h3>
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
                           <Link href="/pricing" className="bg-[#6B2737] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">Hazte Premium →</Link>
                        </div>
                      )}
                    </div>
                  ))}
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
                <button onClick={resetAll} className="flex items-center gap-2 border border-[#6B2737]/20 text-[#6B2737] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#6B2737]/5 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Repetir test
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
