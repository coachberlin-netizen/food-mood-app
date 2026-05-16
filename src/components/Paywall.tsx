"use client";
import { useState } from "react";
import { startCheckout } from "@/lib/api-client";

export function Paywall() {
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const go = async (plan: "monthly" | "annual") => {
    setLoading(plan);
    setError(null);
    try {
      await startCheckout(plan);
    } catch {
      setError("Ha ocurrido un error. Inténtalo de nuevo.");
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-serif text-3xl text-stone-800">Food·Mood Plus</h1>
      <p className="mt-3 leading-relaxed text-stone-700">
        Recomendaciones personalizadas según tu estado de ánimo y tus objetivos de longevidad.
        Recetas, microacciones y el porqué detrás de cada propuesta, con respaldo científico revisado.
      </p>

      <ul className="mt-8 space-y-3 text-stone-700">
        <li>· Mood check-in diario con propuesta adaptada</li>
        <li>· Agente conversacional de nutrición emocional</li>
        <li>· Integración opcional con tus biomarcadores</li>
        <li>· Base científica con nivel de evidencia en cada propuesta</li>
      </ul>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => go("monthly")}
          disabled={loading !== null}
          aria-busy={loading === "monthly"}
          className="rounded-2xl border border-stone-300 px-6 py-5 text-left transition hover:border-stone-500 disabled:opacity-50"
        >
          <div className="font-serif text-xl text-stone-800">Mensual</div>
          <div className="mt-1 text-stone-500">flexibilidad total</div>
        </button>
        <button
          onClick={() => go("annual")}
          disabled={loading !== null}
          aria-busy={loading === "annual"}
          className="rounded-2xl border-2 border-stone-800 bg-stone-50 px-6 py-5 text-left transition disabled:opacity-50"
        >
          <div className="font-serif text-xl text-stone-800">Anual</div>
          <div className="mt-1 text-stone-500">dos meses de regalo</div>
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-700">{error}</p>
      )}

      <p className="mt-6 text-xs text-stone-500">
        Puedes cancelar cuando quieras desde tu portal de cliente.
      </p>
    </div>
  );
}
