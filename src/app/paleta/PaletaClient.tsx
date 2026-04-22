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

import GutBrainInfographic from "@/components/palette/GutBrainInfographic";

const MOOD_COLORS: Record<string, string> = {
  activacion: '#FFB000',
  calma:      '#00D1FF',
  focus:      '#00DD80',
  social:     '#FF2D55',
  reset:      '#9D00FF',
  confort:    '#FF6B00'
};

const EditorialIntro = ({ onStart }: { onStart: () => void }) => (
  <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">

    {/* HEADLINE */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16 md:mb-20"
    >
      <span className="text-[10px] tracking-[0.4em] uppercase text-[#6B2737]/50 mb-8 block font-bold">
        Tu barriga y tu cabeza hablan constantemente.
      </span>
      <h2 className="font-serif text-4xl md:text-7xl text-[#6B2737] leading-[1.1] font-bold mb-6">
        Tus emociones no son solo psicológicas.<br className="hidden md:block" />{" "}
        <span className="italic font-light">También son bioquímica en movimiento.</span>
      </h2>
      <p className="text-base md:text-lg text-[#4A4A4A] font-light max-w-2xl mx-auto leading-relaxed">
        Lo que comes cambia cómo te sientes. Y lo que sientes cambia cómo digiere tu cuerpo. No van separados. Van juntos.
      </p>
    </motion.div>

    {/* STAT CARDS */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20 md:mb-28"
    >
      {/* Serotonina */}
      <div className="bg-white rounded-3xl border border-[#6B2737]/8 p-8 text-center shadow-sm">
        <dl>
          <dt className="font-serif text-[5rem] leading-none text-[#6B2737] italic font-bold block mb-2">
            95%
          </dt>
          <dd className="text-base font-serif text-[#6B2737] italic mb-3">
            de la serotonina — la hormona que te hace sentir bien — la fabrica tu barriga, no tu cabeza.
          </dd>
          <dd className="text-xs text-[#4A4A4A]/70 font-light leading-relaxed">
            Lo que comes hoy decide tu estado de ánimo de mañana.
          </dd>
        </dl>
        <p className="text-[9px] text-[#4A4A4A]/30 font-light mt-4 italic">
          Cryan et al., <cite>Physiological Reviews</cite>, 2019
        </p>
      </div>

      {/* Dopamina */}
      <div className="bg-white rounded-3xl border border-[#6B2737]/8 p-8 text-center shadow-sm">
        <dl>
          <dt className="font-serif text-[5rem] leading-none text-[#6B2737] italic font-bold block mb-2">
            50%
          </dt>
          <dd className="text-base font-serif text-[#6B2737] italic mb-3">
            de la dopamina — lo que te da ganas de hacer cosas — depende de las bacterias de tu intestino.
          </dd>
          <dd className="text-xs text-[#4A4A4A]/70 font-light leading-relaxed">
            Tu energía del lunes empieza en lo que cenaste el domingo.
          </dd>
        </dl>
        <p className="text-[9px] text-[#4A4A4A]/30 font-light mt-4 italic">
          Yano et al., <cite>Cell</cite>, 2015
        </p>
      </div>
    </motion.div>

    {/* ANSIEDAD MECANISMO — bloque destacado */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto mb-24 md:mb-32 rounded-3xl overflow-hidden border border-[#6B2737]/10"
    >
      <div className="bg-[#2d0f16] px-8 md:px-12 py-8">
        <p className="font-serif text-2xl md:text-4xl text-[#F5F0E8] leading-[1.2] font-light italic">
          &ldquo;Cuando comes con el estómago encogido de estrés, hasta la ensalada más sana inflama.&rdquo;
        </p>
      </div>
      <div className="bg-white px-8 md:px-12 py-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-4">
          El mecanismo
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          {[
            { step: "01", text: "Tu cuerpo entra en modo alarma (estrés)" },
            { step: "02", text: "La digestión se para en seco — tu cuerpo prioriza escapar, no digerir" },
            { step: "03", text: "Tu barriga se desequilibra y las bacterias buenas se resienten" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 flex-1">
              <span className="font-serif text-2xl font-bold text-[#6B2737]/20 shrink-0 leading-tight">
                {item.step}
              </span>
              <p className="text-sm text-[#4A4A4A] font-light leading-relaxed pt-0.5">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    {/* INFOGRAPHIC */}
    <GutBrainInfographic />

    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-8 py-16 border-t border-[#6B2737]/5 mt-20 md:mt-32"
    >
      <p className="text-[#4A4A4A] font-medium tracking-wide text-[10px] uppercase tracking-[0.3em]">Comienza tu exploración</p>
      <button
        onClick={onStart}
        className="bg-[#6B2737] text-[#FAF9F6] rounded-[60px] px-12 py-5 font-sans text-[18px] font-medium transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl flex items-center gap-4"
      >
        Descubrir mi color de hoy <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  </div>
);

export default function PaletaClient({
  initialIsPremium,
  initialScreen = 'intro',
}: {
  initialIsPremium: boolean;
  initialScreen?: 'intro' | 'sliders' | 'result';
}) {
  const [screen, setScreen] = useState<'intro' | 'sliders' | 'result'>(initialScreen);
  
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

  return (
    <main className="min-h-[100dvh] bg-[#FAF9F6]">
      <AnimatePresence mode="wait">
        
        {screen === 'intro' && <EditorialIntro onStart={() => setScreen('sliders')} />}

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
                  label="Tu impulso de moverte y actuar"
                  value={energia}
                  colorEnd="#FFB000"
                  iconLeft={<EnergyLow />}
                  iconRight={<EnergyHigh />}
                  onChange={(v) => { setEnergia(v); markMoved('energia'); }}
                />
              </motion.div>
            )}
            {visibleSliders >= 2 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Tu necesidad de quietud y silencio"
                  value={serenidad}
                  colorEnd="#00D1FF"
                  iconLeft={<SerenityLow />}
                  iconRight={<SerenityHigh />}
                  onChange={(v) => { setSerenidad(v); markMoved('serenidad'); }}
                />
              </motion.div>
            )}
            {visibleSliders >= 3 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Tu búsqueda de dirección y nitidez"
                  value={claridad}
                  colorEnd="#00DD80"
                  iconLeft={<ClarityLow />}
                  iconRight={<ClarityHigh />}
                  onChange={(v) => { setClaridad(v); markMoved('claridad'); }}
                />
              </motion.div>
            )}
            {visibleSliders >= 4 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <EmotionalSlider
                  label="Tu deseo de conexión y pertenencia"
                  value={conexion}
                  colorEnd="#FF2D55"
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
