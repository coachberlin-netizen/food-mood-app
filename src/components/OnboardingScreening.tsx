"use client";
import { useState } from "react";

const QUESTIONS = [
  "¿Sientes que la comida te domina más de lo que querrías?",
  "¿Has tenido épocas donde comer o no comer se ha vuelto un eje central de tu día?",
  "¿Has perdido peso de forma marcada en los últimos meses sin proponértelo?",
  "¿Tu relación con tu cuerpo y la comida ha sido un terreno difícil?",
  "¿Hay momentos en que te provocas el vómito tras comer?",
] as const;

export type ScreeningResult = { proceed: boolean; positives: number };

export function OnboardingScreening({
  onComplete,
}: {
  onComplete: (result: ScreeningResult) => void;
}) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(QUESTIONS.length).fill(null)
  );

  const set = (i: number, v: boolean) =>
    setAnswers(prev => { const c = [...prev]; c[i] = v; return c; });

  const complete = answers.every(a => a !== null);
  const positives = answers.filter(a => a === true).length;

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-serif text-2xl text-stone-800">Antes de empezar</h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        Esto nos ayuda a que las propuestas te cuiden de verdad. Puedes contestar
        sin rodeos: nadie las verá excepto tú.
      </p>

      <div className="mt-8 space-y-6">
        {QUESTIONS.map((q, i) => (
          <div key={i}>
            <p className="text-stone-800">{q}</p>
            <div className="mt-2 flex gap-3" role="group" aria-label={q}>
              <button
                onClick={() => set(i, true)}
                aria-pressed={answers[i] === true}
                className={`flex-1 rounded-xl border px-4 py-2 transition focus-visible:outline-2 focus-visible:outline-stone-800 ${
                  answers[i] === true
                    ? "border-stone-800 bg-stone-50"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                Sí
              </button>
              <button
                onClick={() => set(i, false)}
                aria-pressed={answers[i] === false}
                className={`flex-1 rounded-xl border px-4 py-2 transition focus-visible:outline-2 focus-visible:outline-stone-800 ${
                  answers[i] === false
                    ? "border-stone-800 bg-stone-50"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!complete}
        onClick={() => onComplete({ proceed: positives < 2, positives })}
        className="mt-10 w-full rounded-xl bg-stone-800 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
