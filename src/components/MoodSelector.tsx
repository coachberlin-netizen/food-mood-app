"use client";
import { useState } from "react";

const MOODS = [
  { id: "Activación", subtitle: "energía y arranque" },
  { id: "Calma",      subtitle: "bajar revoluciones" },
  { id: "Focus",      subtitle: "atención clara" },
  { id: "Social",     subtitle: "estar con otras personas" },
  { id: "Reset",      subtitle: "limpiar y restaurar" },
  { id: "Confort",    subtitle: "abrigo y descanso" },
] as const;

export type Mood = (typeof MOODS)[number]["id"];

export function MoodSelector({ onSubmit }: { onSubmit: (mood: Mood, texto?: string) => void }) {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [texto, setTexto] = useState("");

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-serif text-3xl text-stone-800">¿Cómo te encuentras hoy?</h1>
      <p className="mt-2 text-stone-600">Elige el estado que más se parezca a este momento.</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            aria-pressed={selected === m.id}
            className={`rounded-2xl border px-4 py-5 text-left transition focus-visible:outline-2 focus-visible:outline-stone-800 ${
              selected === m.id
                ? "border-stone-800 bg-stone-50"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-serif text-lg text-stone-800">{m.id}</div>
            <div className="mt-1 text-sm text-stone-500">{m.subtitle}</div>
          </button>
        ))}
      </div>

      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Si quieres, cuéntame algo más (opcional)"
        aria-label="Texto libre adicional"
        className="mt-6 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none"
        rows={3}
      />

      <button
        disabled={!selected}
        onClick={() => selected && onSubmit(selected, texto.trim() || undefined)}
        className="mt-4 w-full rounded-xl bg-stone-800 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:opacity-40"
      >
        Ver mi propuesta
      </button>
    </div>
  );
}
