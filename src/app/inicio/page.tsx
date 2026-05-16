"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoodSelector, type Mood } from "@/components/MoodSelector";
import { RecommendationCard } from "@/components/RecommendationCard";
import { DerivationCard } from "@/components/DerivationCard";
import { callAgent, PaywallRequired } from "@/lib/api-client";
import type { AgentResponse } from "@/agent/safety/schema";

export default function InicioPage() {
  const router = useRouter();
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (categoria: Mood, texto?: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await callAgent({
        userId: "",           // conectar con sesión real de Supabase Auth
        userText: texto ?? categoria,
        mood: { categoria, texto_libre: texto },
        profile: {
          country: "ES",     // obtener del perfil de usuario
          edad: 0,
          sexo: "F",
          allergies: [],
          medications: [],
          conditions: [],
          objetivos: [],
        },
      });
      setResponse(r);
    } catch (err) {
      if (err instanceof PaywallRequired) {
        router.push("/paywall");
      } else {
        setError("Ha ocurrido un error. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-stone-600">
        Preparando tu propuesta…
      </div>
    );
  }

  if (response?.modo === "recomendacion") {
    return (
      <>
        <RecommendationCard r={response} />
        <div className="mx-auto max-w-xl px-6 pb-10">
          <button
            onClick={() => setResponse(null)}
            className="text-sm text-stone-500 underline underline-offset-2"
          >
            ← Volver al check-in
          </button>
        </div>
      </>
    );
  }

  if (response?.modo === "derivar") {
    return <DerivationCard d={response} />;
  }

  return (
    <>
      <MoodSelector onSubmit={submit} />
      {error && (
        <p className="mx-auto max-w-xl px-6 text-sm text-red-700">{error}</p>
      )}
    </>
  );
}
