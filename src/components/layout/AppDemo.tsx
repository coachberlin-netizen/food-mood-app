"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";

const MOODS = [
  {
    label: "Ansiedad",
    emoji: "🌀",
    color: "#8E4A8C",
    pantone: "Pantone 519 C",
    colorName: "Violeta Nervioso",
    description: "Exceso de cortisol y activación del eje HPA. El sistema nervioso entérico reduce la síntesis de GABA y eleva la histamina intestinal.",
    action: "Priorizar GABA (fermentados), magnesio (semillas de calabaza) y triptófano (huevo, queso fresco).",
    compounds: ["GABA", "Cortisol", "Histamina", "Triptófano"],
  },
  {
    label: "Cansancio",
    emoji: "🌊",
    color: "#4A7AB5",
    pantone: "Pantone 285 C",
    colorName: "Azul Agotado",
    description: "Déficit de dopamina y noradrenalina. Bajo ATP celular. La microbiota reduce la producción de B12 y folato disponibles.",
    action: "Activar con tirosina (legumbre, huevo), hierro no hemo (verduras de hoja oscura) y vitamina B12.",
    compounds: ["Dopamina", "ATP", "B12", "Tirosina"],
  },
  {
    label: "Estrés",
    emoji: "🔥",
    color: "#C9623A",
    pantone: "Pantone 1655 C",
    colorName: "Naranja Tensión",
    description: "Cortisol elevado con respuesta simpática activa. La permeabilidad intestinal aumenta, comprometiendo la barrera protectora.",
    action: "Reducir inflamación con omega-3 (nueces, lino), adaptógenos (jengibre) y probióticos para reparar la barrera intestinal.",
    compounds: ["Cortisol", "Omega-3", "Probióticos", "Adaptógenos"],
  },
  {
    label: "Calma",
    emoji: "🌿",
    color: "#4A7C59",
    pantone: "Pantone 356 C",
    colorName: "Verde Equilibrio",
    description: "Serotonina y GABA en niveles óptimos. Actividad parasimpática dominante. Microbiota diversa y estable.",
    action: "Mantener con prebióticos (fibra variada), fermentados diarios y AGCC (legumbre, plátano verde).",
    compounds: ["Serotonina", "GABA", "Prebióticos", "AGCC"],
  },
];

const STEPS = [
  { id: "quiz",   label: "1 · Test" },
  { id: "result", label: "2 · Paleta" },
  { id: "recipe", label: "3 · Receta" },
];

const RECIPE = {
  name: "Bol de miso, aguacate y sésamo",
  desc: "Rico en probióticos, magnesio y glicina — los tres activos clave para regular el estado emocional desde el intestino.",
  ingredients: [
    "Pasta de miso blanca (probióticos + GABA)",
    "Aguacate maduro (magnesio + grasas saludables)",
    "Sésamo tostado (glicina + zinc)",
    "Edamame (isoflavonas + proteína completa)",
  ],
};

export function AppDemo() {
  const [step, setStep]           = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [paletteIdx, setPaletteIdx] = useState<number>(3);

  const activeMood = step === 0
    ? (selected !== null ? MOODS[selected] : null)
    : MOODS[paletteIdx];

  function handleMoodClick(i: number) {
    setSelected(i);
    setPaletteIdx(i);
    try { trackEvent({ name: "demo_step", properties: { step: 1 } }); } catch {}
  }

  function goToPalette() {
    if (selected === null) return;
    setStep(1);
  }

  function reset() {
    setStep(0);
    setSelected(null);
    setPaletteIdx(3);
  }

  return (
    <section
      aria-label="Demo interactiva de Food·Mood"
      className="py-24 px-6"
      style={{ backgroundColor: "#1a1118" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold/60">
            Pruébalo ahora · sin registro
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-cream mt-3 mb-3">
            Así funciona en 3 pasos
          </h2>
          <p className="text-cream/40 font-light text-sm">
            Una simulación real del flujo de la app
          </p>
        </div>

        {/* Progress tabs */}
        <div className="flex items-center justify-center gap-0 mb-10" role="tablist">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                role="tab"
                aria-selected={step === i}
                onClick={() => i < step ? setStep(i) : undefined}
                className={`text-[11px] font-medium uppercase tracking-[0.18em] px-4 py-2 rounded-full transition-all duration-300 ${
                  step === i
                    ? "bg-gold text-aubergine-dark"
                    : i < step
                    ? "text-gold/70 cursor-pointer hover:text-gold"
                    : "text-cream/20 cursor-default"
                }`}
              >
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-cream/15 mx-1" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Panel */}
        <div
          className="rounded-3xl overflow-hidden border border-cream/8"
          style={{ backgroundColor: "#0f0608", minHeight: 340 }}
        >

          {/* ── STEP 0 · Test ── */}
          {step === 0 && (
            <div className="p-8 md:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-6" style={{ color: "#FF6B35" }}>
                Paso 1 de 3 · Tu estado emocional
              </p>
              <h3 className="text-2xl md:text-3xl font-serif text-cream mb-2">
                ¿Cómo te sientes ahora mismo?
              </h3>
              <p className="text-sm font-light mb-10" style={{ color: "rgba(245,237,224,0.90)" }}>
                Elige tu estado más cercano
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOODS.map((mood, i) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => handleMoodClick(i)}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{
                      backgroundColor: selected === i ? `${mood.color}28` : "transparent",
                      borderColor: selected === i ? `${mood.color}80` : "rgba(245,237,224,0.08)",
                      transform: selected === i ? "translateY(-2px)" : undefined,
                    }}
                    aria-pressed={selected === i}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: mood.color,
                        boxShadow: selected === i
                          ? `0 0 22px ${mood.color}80, 0 0 8px ${mood.color}55`
                          : `0 0 10px ${mood.color}44`,
                        transition: "all 0.25s",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="text-xs font-medium uppercase tracking-[0.15em]"
                      style={{ color: selected === i ? mood.color : "rgba(245,237,224,0.88)" }}
                    >
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={goToPalette}
                  disabled={selected === null}
                  className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: selected !== null ? MOODS[selected].color : "rgba(245,237,224,0.12)",
                    color: "#F5F0E8",
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  Ver mi paleta →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1 · Paleta ── */}
          {step === 1 && activeMood && (
            <div className="p-8 md:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/65 mb-6">
                Paso 2 de 3 · Tu paleta emocional
              </p>
              <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Columna izquierda — color + swatches */}
                <div className="shrink-0 flex flex-col items-center gap-4 w-full md:w-48">
                  {/* Esfera de color */}
                  <div
                    className="w-32 h-32 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: activeMood.color,
                      boxShadow: `0 0 48px ${activeMood.color}55, 0 0 16px ${activeMood.color}33`,
                    }}
                  />
                  {/* Datos del color */}
                  <div className="text-center">
                    <p className="text-cream text-sm font-semibold">{activeMood.colorName}</p>
                    <p className="text-cream/35 text-[10px] font-mono mt-0.5">{activeMood.pantone}</p>
                    <p className="text-cream/25 text-[10px] font-mono">{activeMood.color}</p>
                  </div>

                  {/* Swatches — cambia según tu ánimo */}
                  <div className="w-full">
                    <p className="text-cream/25 text-[9px] uppercase tracking-widest text-center mb-2">
                      Cambia según tu ánimo
                    </p>
                    <div className="flex justify-center gap-2">
                      {MOODS.map((m, i) => (
                        <button
                          key={m.label}
                          type="button"
                          onClick={() => setPaletteIdx(i)}
                          title={m.label}
                          className="transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-full"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            backgroundColor: m.color,
                            border: paletteIdx === i
                              ? `2px solid rgba(245,237,224,0.8)`
                              : `2px solid transparent`,
                            transform: paletteIdx === i ? "scale(1.2)" : "scale(1)",
                            boxShadow: paletteIdx === i ? `0 0 8px ${m.color}88` : "none",
                          }}
                          aria-label={m.label}
                          aria-pressed={paletteIdx === i}
                        />
                      ))}
                    </div>
                    <div className="flex justify-center mt-1.5">
                      <p className="text-[10px] font-medium" style={{ color: activeMood.color }}>
                        {activeMood.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna derecha — descripción factual */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/65 mb-1">
                      Qué ocurre en tu intestino
                    </p>
                    <p className="text-cream/70 text-sm font-light leading-relaxed">
                      {activeMood.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/65 mb-1">
                      Acción nutricional recomendada
                    </p>
                    <p className="text-cream/70 text-sm font-light leading-relaxed">
                      {activeMood.action}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeMood.compounds.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${activeMood.color}1A`, color: activeMood.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      try { trackEvent({ name: "demo_step", properties: { step: 2 } }); } catch {}
                      setStep(2);
                    }}
                    className="mt-2 inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{ backgroundColor: "#FF6B35", color: "#0f0608" }}
                  >
                    Ver mi receta para {activeMood.label.toLowerCase()} →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 · Receta ── */}
          {step === 2 && activeMood && (
            <div className="p-8 md:p-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/65 mb-6">
                Paso 3 de 3 · Tu receta
              </p>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-5">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded"
                      style={{ backgroundColor: `${activeMood.color}1A`, color: activeMood.color }}
                    >
                      Para tu {activeMood.label.toLowerCase()}
                    </span>
                    <h3 className="text-2xl font-serif text-cream mt-3">{RECIPE.name}</h3>
                    <p className="text-sm font-light mt-2" style={{ color: "rgba(245,237,224,0.72)" }}>{RECIPE.desc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/65 mb-3">
                      Ingredientes clave
                    </p>
                    <ul className="space-y-2">
                      {RECIPE.ingredients.map((ing) => (
                        <li key={ing} className="flex items-start gap-2 text-sm font-light" style={{ color: "rgba(245,237,224,0.85)" }}>
                          <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className="md:w-56 shrink-0 rounded-2xl p-6 flex flex-col gap-4 text-center border"
                  style={{ backgroundColor: "#1a1118", borderColor: "rgba(255,107,53,0.2)" }}
                >
                  <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(245,237,224,0.72)" }}>
                    Esta receta incluye preparación completa, variaciones y notas
                    científicas en la versión Premium.
                  </p>
                  <Link
                    href="/auth/register"
                    className="block font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{ backgroundColor: "#FF6B35", color: "#0f0608" }}
                  >
                    Crear cuenta gratis
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-cream/25 hover:text-cream/50 text-xs font-light transition-colors focus:outline-none"
                  >
                    Volver al inicio del demo
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
