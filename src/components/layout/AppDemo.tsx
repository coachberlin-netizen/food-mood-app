"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle } from "lucide-react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";

const MOODS = [
  { label: "Ansiedad", color: "#8E4A8C", emoji: "🌀" },
  { label: "Cansancio", color: "#4A7AB5", emoji: "🌊" },
  { label: "Estrés",   color: "#C9623A", emoji: "🔥" },
  { label: "Calma",    color: "#4A7C59", emoji: "🌿" },
];

const STEPS = [
  {
    id: "quiz",
    label: "1 · Test",
    title: "¿Cómo te sientes ahora mismo?",
    subtitle: "Elige tu estado más cercano",
  },
  {
    id: "result",
    label: "2 · Paleta",
    title: "Tu paleta de hoy",
    subtitle: "Basada en tu eje intestino-cerebro",
  },
  {
    id: "recipe",
    label: "3 · Receta",
    title: "Tu receta para hoy",
    subtitle: "Diseñada para tu estado emocional",
  },
];

export function AppDemo() {
  const [step, setStep]         = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const chosenMood = selected !== null ? MOODS[selected] : MOODS[3];

  function handleMoodClick(i: number) {
    setSelected(i);
    trackEvent({ name: "demo_step", properties: { step: 1, mood: MOODS[i].label } });
    setTimeout(() => setStep(1), 420);
  }

  function reset() {
    setStep(0);
    setSelected(null);
  }

  return (
    <section
      aria-label="Demo interactiva de Food·Mood"
      className="py-24 px-6"
      style={{ backgroundColor: "#1a1118" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
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

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-0 mb-10" role="tablist" aria-label="Pasos del demo">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                role="tab"
                aria-selected={step === i}
                aria-controls={`demo-panel-${s.id}`}
                onClick={() => i <= step ? setStep(i) : undefined}
                className={`text-[11px] font-medium uppercase tracking-[0.18em] px-4 py-2 rounded-full transition-all duration-300 ${
                  step === i
                    ? 'bg-gold text-aubergine-dark'
                    : i < step
                    ? 'text-gold/70 cursor-pointer hover:text-gold'
                    : 'text-cream/20 cursor-default'
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

          {/* STEP 0 — Quiz */}
          {step === 0 && (
            <div
              id="demo-panel-quiz"
              role="tabpanel"
              aria-labelledby="tab-quiz"
              className="p-8 md:p-12"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/30 mb-6">
                Paso 1 de 3 · Tu estado emocional
              </p>
              <h3 className="text-2xl md:text-3xl font-serif text-cream mb-2">
                {STEPS[0].title}
              </h3>
              <p className="text-cream/40 text-sm font-light mb-10">
                {STEPS[0].subtitle}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOODS.map((mood, i) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => handleMoodClick(i)}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-cream/8 hover:border-cream/25 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{
                      backgroundColor: selected === i ? `${mood.color}22` : 'transparent',
                      borderColor: selected === i ? `${mood.color}66` : undefined,
                    }}
                    aria-pressed={selected === i}
                  >
                    <span className="text-3xl" aria-hidden="true">{mood.emoji}</span>
                    <span
                      className="text-xs font-medium uppercase tracking-[0.15em]"
                      style={{ color: selected === i ? mood.color : 'rgba(245,237,224,0.5)' }}
                    >
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-center text-cream/20 text-xs mt-8 font-light">
                Elige uno para continuar
              </p>
            </div>
          )}

          {/* STEP 1 — Resultado */}
          {step === 1 && (
            <div
              id="demo-panel-result"
              role="tabpanel"
              aria-labelledby="tab-result"
              className="p-8 md:p-12"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/30 mb-6">
                Paso 2 de 3 · Tu resultado
              </p>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Color card */}
                <div
                  className="w-full md:w-64 shrink-0 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center"
                  style={{ backgroundColor: `${chosenMood.color}22`, border: `1px solid ${chosenMood.color}44` }}
                  aria-label={`Estado seleccionado: ${chosenMood.label}`}
                >
                  <span className="text-5xl" aria-hidden="true">{chosenMood.emoji}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 mb-1">
                      Tu estado hoy
                    </p>
                    <p className="text-2xl font-serif" style={{ color: chosenMood.color }}>
                      {chosenMood.label}
                    </p>
                  </div>
                </div>
                {/* Explicación */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-serif text-cream">
                    Tu eje intestino-cerebro está procesando {chosenMood.label.toLowerCase()}
                  </h3>
                  <p className="text-cream/50 text-sm font-light leading-relaxed">
                    La microbiota intestinal produce el 90% de la serotonina del cuerpo.
                    Cuando sientes {chosenMood.label.toLowerCase()}, los fermentados, el magnesio
                    y ciertos adaptógenos pueden modularlo directamente desde el plato.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Microbiota", "Cortisol", "GABA", "Magnesio"].map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${chosenMood.color}18`, color: chosenMood.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="mt-4 inline-flex items-center gap-2 bg-gold hover:bg-[#b8953e] text-aubergine-dark font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Ver mi receta →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Receta */}
          {step === 2 && (
            <div
              id="demo-panel-recipe"
              role="tabpanel"
              aria-labelledby="tab-recipe"
              className="p-8 md:p-12"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream/30 mb-6">
                Paso 3 de 3 · Tu receta
              </p>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Receta card */}
                <div className="flex-1 space-y-5">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded"
                      style={{ backgroundColor: `${chosenMood.color}18`, color: chosenMood.color }}
                    >
                      Para tu {chosenMood.label.toLowerCase()}
                    </span>
                    <h3 className="text-2xl font-serif text-cream mt-3">
                      Bol de miso, aguacate y sésamo
                    </h3>
                    <p className="text-cream/40 text-sm font-light mt-2">
                      Rico en probióticos, magnesio y glicina — los tres activos clave
                      para regular tu estado emocional desde el intestino.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/30 mb-3">
                      Ingredientes clave
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Pasta de miso blanca (probióticos + GABA)",
                        "Aguacate (magnesio + grasas saludables)",
                        "Sésamo tostado (glicina + zinc)",
                        "Edamame (isoflavonas + proteína completa)",
                      ].map((ing, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-cream/60 font-light">
                          <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" aria-hidden="true" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* CTA */}
                <div
                  className="md:w-56 shrink-0 rounded-2xl p-6 flex flex-col gap-4 text-center border"
                  style={{ backgroundColor: '#1a1118', borderColor: 'rgba(201,168,76,0.2)' }}
                >
                  <p className="text-cream/40 text-xs font-light leading-relaxed">
                    Esta receta incluye preparación completa, variaciones y notas
                    científicas en la versión Premium.
                  </p>
                  <Link
                    href="/auth/register"
                    className="block bg-gold hover:bg-[#b8953e] text-aubergine-dark font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Crear cuenta gratis
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-cream/25 hover:text-cream/50 text-xs font-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
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
