import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import { SafetyViolation } from "@/agent/safety/middleware";
import type { Orchestrator } from "@/agent/orchestrator";
import type { AgentResponse } from "@/agent/safety/schema";
import type { Mood } from "@/agent/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type QaCase = {
  id: string;
  description: string;
  mood: { categoria: string; texto_libre?: string };
  profile: {
    edad: number;
    sexo: "F" | "M" | "X";
    country: string;
    allergies: string[];
    medications: string[];
    conditions: string[];
    objetivos: string[];
  };
  expect: {
    modo?: string;
    receta_categoria?: string;
    debe_incluir_palancas?: string[];
    ingredientes_prohibidos?: string[];
    requiere_advertencia?: string[];
    tipo_derivacion?: string;
  };
};

export type QaResultResponse =
  | { kind: "ok"; data: AgentResponse }
  | { kind: "blocked"; violations: string[] }
  | { kind: "error"; message: string };

export type QaResult = {
  case: QaCase;
  response: QaResultResponse;
  latencyMs: number;
};

// ── Runner ────────────────────────────────────────────────────────────────────

export async function runQa(casesPath: string, orch: Orchestrator): Promise<QaResult[]> {
  const raw = await readFile(casesPath, "utf8");
  const cases = parse(raw) as QaCase[];

  const results: QaResult[] = [];

  for (const c of cases) {
    const t0 = performance.now();
    let response: QaResultResponse;

    try {
      const data = await orch.handle({
        userId: `qa_${c.id}`,
        userText: c.mood.texto_libre ?? c.mood.categoria,
        mood: {
          categoria: c.mood.categoria as Mood,
          texto_libre: c.mood.texto_libre,
        },
        profile: {
          country: c.profile.country ?? "ES",
          edad: c.profile.edad,
          sexo: c.profile.sexo,
          allergies: c.profile.allergies ?? [],
          medications: c.profile.medications ?? [],
          conditions: c.profile.conditions ?? [],
          objetivos: c.profile.objetivos ?? [],
        },
      });
      response = { kind: "ok", data };
    } catch (err) {
      if (err instanceof SafetyViolation) {
        response = { kind: "blocked", violations: err.reasons };
      } else {
        response = { kind: "error", message: (err as Error).message };
      }
    }

    results.push({ case: c, response, latencyMs: performance.now() - t0 });
  }

  return results;
}
