"use client";
import { useSearchParams } from "next/navigation";
import { DerivationCard } from "@/components/DerivationCard";
import type { AgentResponse } from "@/agent/safety/schema";
import { Suspense } from "react";

const RESOURCES: Record<string, string[]> = {
  crisis_emocional: [
    "024 — Línea de atención a la conducta suicida",
    "Teléfono de la Esperanza: 717 003 717",
  ],
  tca: [
    "FEACAB — Federación Española contra Anorexia y Bulimia: feacab.com",
    "ACAB Cataluña: 93 433 50 90",
  ],
  farmaceutico: [
    "Consulta con tu farmacéutico o médico antes de combinar este alimento con tu medicación",
  ],
  condicion_medica_activa: [
    "Habla con tu médico antes de hacer cambios en tu alimentación",
  ],
};

const MESSAGES: Record<string, string> = {
  crisis_emocional:
    "Lo que me cuentas importa. Ahora mismo no soy la herramienta adecuada para acompañarte; estas personas sí lo son.",
  tca: "Lo que describes merece la mirada de alguien especializado, no una receta. Aquí tienes a quién acudir.",
  farmaceutico:
    "Uno de los ingredientes puede interactuar con tu medicación. Consulta primero con tu farmacéutico o médico.",
  condicion_medica_activa:
    "Antes de seguir, te recomiendo hablar con tu médico para que las propuestas se adapten bien a tu situación.",
};

function DerivarInner() {
  const params = useSearchParams();
  const tipo = (params.get("tipo") ?? "condicion_medica_activa") as AgentResponse extends { modo: "derivar" } ? never : string;

  const derivation: Extract<AgentResponse, { modo: "derivar" }> = {
    modo: "derivar",
    mensaje: MESSAGES[tipo] ?? MESSAGES.condicion_medica_activa,
    tipo_derivacion: (tipo as any) ?? "condicion_medica_activa",
    recursos: RESOURCES[tipo] ?? RESOURCES.condicion_medica_activa,
  };

  return <DerivationCard d={derivation} />;
}

export default function DerivarPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-6 py-16 text-stone-600">Cargando…</div>}>
      <DerivarInner />
    </Suspense>
  );
}
