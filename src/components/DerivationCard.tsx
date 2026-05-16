import type { AgentResponse } from "@/agent/safety/schema";

type Derivation = Extract<AgentResponse, { modo: "derivar" }>;

export function DerivationCard({ d }: { d: Derivation }) {
  return (
    <article className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-serif text-2xl text-stone-800">Aquí me paro un momento</h1>
      <p className="mt-4 leading-relaxed text-stone-700">{d.mensaje}</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-stone-500">
          Personas que pueden acompañarte ahora
        </h2>
        <ul className="space-y-2">
          {d.recursos.map((r, i) => (
            <li
              key={i}
              className="rounded-xl border border-stone-200 p-4 text-stone-800"
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs text-stone-500">
        Cuando quieras, vuelve. Aquí estaré.
      </p>
    </article>
  );
}
