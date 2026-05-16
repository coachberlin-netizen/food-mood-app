"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MoodSelector, type Mood } from "@/components/MoodSelector";
import { RecommendationCard } from "@/components/RecommendationCard";
import { DerivationCard } from "@/components/DerivationCard";
import { callAgent, PaywallRequired } from "@/lib/api-client";
import type { AgentResponse } from "@/agent/safety/schema";
import type { AgentRequest } from "@/agent/types";

type HealthProfile = {
  edad: number;
  sexo: "F" | "M" | "X";
  pais: string;
  alergias: string[];
  medicacion: string[];
  condiciones: string[];
  objetivos_longevidad: string[];
};

type PageState =
  | { phase: "loading" }
  | { phase: "ready"; userId: string; profile: HealthProfile }
  | { phase: "submitting" }
  | { phase: "result"; response: AgentResponse }
  | { phase: "error"; message: string };

function buildRequest(userId: string, profile: HealthProfile, categoria: Mood, texto?: string): AgentRequest {
  return {
    userId,
    userText: texto ?? categoria,
    mood: { categoria, texto_libre: texto },
    profile: {
      country: profile.pais ?? "ES",
      edad: profile.edad ?? 0,
      sexo: (profile.sexo as "F" | "M" | "X") ?? "F",
      allergies: profile.alergias ?? [],
      medications: profile.medicacion ?? [],
      conditions: profile.condiciones ?? [],
      objetivos: profile.objetivos_longevidad ?? [],
    },
  };
}

export default function InicioPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({ phase: "loading" });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user }, error }) => {
      if (error || !user) {
        router.replace("/auth/login");
        return;
      }
      const { data: hp } = await supabase
        .from("user_health_profile")
        .select("edad, sexo, pais, alergias, medicacion, condiciones, objetivos_longevidad, onboarding_completado")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!hp?.onboarding_completado) {
        router.replace("/onboarding");
        return;
      }

      setState({
        phase: "ready",
        userId: user.id,
        profile: {
          edad: hp.edad ?? 0,
          sexo: hp.sexo ?? "F",
          pais: hp.pais ?? "ES",
          alergias: hp.alergias ?? [],
          medicacion: hp.medicacion ?? [],
          condiciones: hp.condiciones ?? [],
          objetivos_longevidad: hp.objetivos_longevidad ?? [],
        },
      });
    });
  }, [router]);

  const submit = async (categoria: Mood, texto?: string) => {
    if (state.phase !== "ready") return;
    const { userId, profile } = state;
    setState({ phase: "submitting" });
    try {
      const response = await callAgent(buildRequest(userId, profile, categoria, texto));
      setState({ phase: "result", response });
    } catch (err) {
      if (err instanceof PaywallRequired) {
        router.push("/paywall");
      } else {
        setState({ phase: "error", message: "Ha ocurrido un error. Inténtalo de nuevo." });
      }
    }
  };

  const reset = () => {
    if (state.phase !== "result") return;
    // recover userId/profile from the previous ready state is not possible here;
    // reload from Supabase again
    setState({ phase: "loading" });
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/auth/login"); return; }
      const { data: hp } = await supabase
        .from("user_health_profile")
        .select("edad, sexo, pais, alergias, medicacion, condiciones, objetivos_longevidad")
        .eq("user_id", user.id)
        .maybeSingle();
      setState({
        phase: "ready",
        userId: user.id,
        profile: {
          edad: hp?.edad ?? 0,
          sexo: hp?.sexo ?? "F",
          pais: hp?.pais ?? "ES",
          alergias: hp?.alergias ?? [],
          medicacion: hp?.medicacion ?? [],
          condiciones: hp?.condiciones ?? [],
          objetivos_longevidad: hp?.objetivos_longevidad ?? [],
        },
      });
    });
  };

  if (state.phase === "loading" || state.phase === "submitting") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-stone-600">
        {state.phase === "submitting" ? "Preparando tu propuesta…" : "Cargando…"}
      </div>
    );
  }

  if (state.phase === "error") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-red-700">{state.message}</p>
        <button
          onClick={() => setState({ phase: "loading" })}
          className="mt-4 text-sm text-stone-500 underline"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  if (state.phase === "result") {
    const { response } = state;
    return (
      <>
        {response.modo === "recomendacion" && <RecommendationCard r={response} />}
        {response.modo === "derivar" && <DerivationCard d={response} />}
        {(response.modo === "respuesta_libre" || response.modo === "necesito_mas_contexto") && (
          <div className="mx-auto max-w-xl px-6 py-10 text-stone-700">
            {"texto" in response ? response.texto : response.pregunta}
          </div>
        )}
        <div className="mx-auto max-w-xl px-6 pb-10">
          <button onClick={reset} className="text-sm text-stone-500 underline underline-offset-2">
            ← Nuevo check-in
          </button>
        </div>
      </>
    );
  }

  // phase === "ready"
  return <MoodSelector onSubmit={submit} />;
}
