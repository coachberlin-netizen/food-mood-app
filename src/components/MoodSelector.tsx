"use client";
import { useState } from "react";
import type { Mood } from "@/agent/types";

export type { Mood };

type Estado = {
  label: string;
  desc: string;
  mood: Mood;
};

const ESTADOS: Estado[] = [
  // Estados difíciles / bajos
  { label: "Agotado/a",            desc: "sin fuerzas para nada",              mood: "Reset"      },
  { label: "Ansioso/a",            desc: "nervios, pensamientos acelerados",   mood: "Calma"      },
  { label: "Triste o vacío/a",     desc: "me falta algo que no sé nombrar",    mood: "Confort"    },
  { label: "Irritable",            desc: "todo me molesta más de lo normal",   mood: "Calma"      },
  { label: "Abrumado/a",           desc: "demasiado a la vez",                 mood: "Reset"      },
  { label: "Bloqueado/a",          desc: "no consigo arrancar con nada",       mood: "Activación" },
  { label: "Solo/a",               desc: "desconectado/a, quiero presencia",   mood: "Social"     },
  { label: "Aburrido/a",           desc: "nada me despierta interés, todo plano", mood: "Activación" },
  { label: "Con niebla mental",    desc: "lento/a, confuso/a, disperso/a",     mood: "Focus"      },
  { label: "Con el cuerpo pesado", desc: "digestión lenta, hinchazón",         mood: "Reset"      },
  // Sin saber
  { label: "Sin saber qué quiero", desc: "necesito que algo me oriente",       mood: "Focus"      },
  // Estados funcionales / positivos
  { label: "Con energía",          desc: "listo/a para arrancar",              mood: "Activación" },
  { label: "Tranquilo/a",          desc: "quiero mantenerlo así",              mood: "Calma"      },
  { label: "En modo trabajo",      desc: "quiero rendir y estar presente",     mood: "Focus"      },
  { label: "Con ganas de compartir", desc: "me apetece gente y mesa llena",   mood: "Social"     },
  { label: "En reset",             desc: "limpiando, restaurando el cuerpo",   mood: "Reset"      },
  { label: "Necesito mimos",       desc: "calor, abrigo, descanso",            mood: "Confort"    },
];

export function MoodSelector({
  onSubmit,
}: {
  onSubmit: (mood: Mood, texto?: string) => void;
}) {
  const [selected, setSelected] = useState<Estado | null>(null);
  const [texto, setTexto] = useState("");

  function handleSubmit() {
    if (!selected) return;
    const raw = selected.label;
    const combined = texto.trim()
      ? `Me siento: ${raw}. ${texto.trim()}`
      : `Me siento: ${raw}`;
    onSubmit(selected.mood, combined);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-serif text-3xl text-stone-800">¿Cómo estás ahora mismo?</h1>
      <p className="mt-2 text-stone-500">Elige lo que más se parezca a este momento.</p>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ESTADOS.map(e => (
          <button
            key={e.label}
            onClick={() => setSelected(e)}
            aria-pressed={selected?.label === e.label}
            className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-2 focus-visible:outline-stone-800 ${
              selected?.label === e.label
                ? "border-[#6B2737] bg-[#6B2737]/5"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <div className="font-serif text-base leading-tight text-stone-800">{e.label}</div>
            <div className="mt-1 text-xs leading-snug text-stone-400">{e.desc}</div>
          </button>
        ))}
      </div>

      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="¿Qué más quieres contarme? (opcional)"
        aria-label="Contexto adicional"
        className="mt-6 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none"
        rows={3}
      />

      <button
        disabled={!selected}
        onClick={handleSubmit}
        className="mt-4 w-full rounded-xl bg-[#6B2737] px-6 py-3 font-medium text-white transition hover:bg-[#5a1f2e] disabled:opacity-40"
      >
        Ver mi propuesta
      </button>
    </div>
  );
}
