import type { AgentResponse } from "@/agent/safety/schema";

type Recommendation = Extract<AgentResponse, { modo: "recomendacion" }>;

const EVIDENCE_LABEL: Record<string, string> = {
  A: "Evidencia A · RCT o meta-análisis",
  B: "Evidencia B · estudios de cohorte",
  C: "Evidencia C · mecanístico",
  D: "Evidencia D · emergente",
};

export function RecommendationCard({ r }: { r: Recommendation }) {
  return (
    <article className="mx-auto max-w-xl space-y-8 px-6 py-10">
      <header>
        <span className="text-xs uppercase tracking-wide text-stone-500">
          {r.receta.categoria_food_mood}
        </span>
        <h1 className="mt-1 font-serif text-3xl text-stone-800">{r.receta.titulo}</h1>
        <p className="mt-2 text-sm text-stone-500">{r.receta.tiempo_min} min</p>
      </header>

      <section>
        <h2 className="font-serif text-lg text-stone-800">Ingredientes</h2>
        <ul className="mt-2 space-y-1 text-stone-700">
          {r.receta.ingredientes.map((ing, i) => (
            <li key={i}>· {ing}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-lg text-stone-800">Preparación</h2>
        <ol className="mt-2 space-y-2 text-stone-700">
          {r.receta.pasos.map((paso, i) => (
            <li key={i}>
              <span className="text-stone-400">{i + 1}.</span> {paso}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl bg-stone-50 p-5">
        <h2 className="font-serif text-lg text-stone-800">Además</h2>
        <p className="mt-1 text-stone-700">
          <span className="font-medium">{r.microaccion.titulo}</span> ·{" "}
          {r.microaccion.descripcion} ({r.microaccion.duracion_min} min)
        </p>
      </section>

      <section className="border-t border-stone-200 pt-6">
        <h2 className="font-serif text-lg text-stone-800">{r.microcontenido.titulo}</h2>
        <p className="mt-2 text-stone-700">{r.microcontenido.porque}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {r.microcontenido.palancas_longevidad.map(p => (
            <span
              key={p}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
            >
              {p}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500">
          {EVIDENCE_LABEL[r.microcontenido.nivel_evidencia]}
        </p>
        {r.microcontenido.fuentes.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-stone-500">Fuentes</summary>
            <ul className="mt-2 space-y-1 text-xs text-stone-500">
              {r.microcontenido.fuentes.map((f, i) => (
                <li key={i}>· {f}</li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {r.advertencias.length > 0 && (
        <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {r.advertencias.map((a, i) => (
            <p key={i}>{a}</p>
          ))}
        </aside>
      )}
    </article>
  );
}
