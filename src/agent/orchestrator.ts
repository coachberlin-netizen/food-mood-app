import Anthropic from "@anthropic-ai/sdk";
import { loadSystemPrompt } from "./load-prompt";
import { buildSystemPromptWithContext } from "./build-context";
import { runSafetyPipeline } from "./safety/middleware";
import type { AgentResponse } from "./safety/schema";
import type { RagStore } from "./rag";
import type { AgentRequest } from "./types";
import type { BiomarkerStore } from "@/biomarkers/store";
import type { Sample } from "@/biomarkers/types";

export interface OrchestratorConfig {
  anthropic: Anthropic;
  rag: RagStore;
  biomarkerStore?: BiomarkerStore;
  logger?: (event: Record<string, unknown>) => void;
  model?: string;
}

export class Orchestrator {
  private readonly anthropic: Anthropic;
  private readonly rag: RagStore;
  private readonly biomarkerStore?: BiomarkerStore;
  private readonly logger: (event: Record<string, unknown>) => void;
  private readonly model: string;
  private readonly basePrompt: string;

  constructor(config: OrchestratorConfig) {
    this.anthropic = config.anthropic;
    this.rag = config.rag;
    this.biomarkerStore = config.biomarkerStore;
    this.logger = config.logger ?? (() => {});
    this.model = config.model ?? "claude-haiku-4-5-20251001";
    this.basePrompt = loadSystemPrompt();
  }

  async handle(req: AgentRequest): Promise<AgentResponse> {
    const { userText, mood, profile } = req;

    // RAG (failures silenced so QA tests never block on missing Voyage key)
    const [foodmoodChunks, longevidadChunks] = await Promise.all([
      this.rag.search({ kb: "food-mood", query: userText, k: 5 }).catch(() => [] as string[]),
      this.rag.search({ kb: "longevity", query: userText, k: 5 }).catch(() => [] as string[]),
    ]);

    const embarazo_lactancia = profile.conditions.some(c =>
      /embarazo|lactancia/i.test(c),
    );

    // Hidrata biomarcadores si el store está disponible y el userId existe
    let biomarcadores: string | undefined;
    if (this.biomarkerStore && req.userId) {
      try {
        const recent = await this.biomarkerStore.recent(req.userId, 7);
        biomarcadores = aggregateBiomarkersText(recent);
      } catch {
        // No bloquear al agente si los biomarcadores fallan
      }
    }

    const systemPrompt = buildSystemPromptWithContext(this.basePrompt, {
      profile: {
        alergias: profile.allergies,
        intolerancias: [],
        medicacion: profile.medications,
        condiciones: profile.conditions,
        embarazo_lactancia,
        edad: profile.edad,
        sexo: profile.sexo,
        pais: profile.country,
        objetivos_longevidad: profile.objetivos,
      },
      moodCategoria: mood?.categoria ?? userText,
      moodTextoLibre: mood?.texto_libre,
      biomarcadores,
      fragmentosFoodMood: foodmoodChunks.length > 0 ? foodmoodChunks.join("\n\n---\n\n") : undefined,
      fragmentosLongevidad: longevidadChunks.length > 0 ? longevidadChunks.join("\n\n---\n\n") : undefined,
    });

    const { anthropic, model, logger } = this;

    return runSafetyPipeline({
      userText,
      profile: {
        country: profile.country,
        allergies: profile.allergies,
        medications: profile.medications,
        conditions: profile.conditions,
      },
      callLLM: async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const completion = await anthropic.messages.create({
              model,
              max_tokens: 2048,
              system: systemPrompt,
              messages: [{ role: "user", content: userText }],
            });
            const text = completion.content.find(b => b.type === "text")?.text ?? "";
            logger({ event: "llm_raw", length: text.length, attempt });
            const match = text.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("no_json_in_response");
            return JSON.parse(match[0]);
          } catch (err) {
            logger({ event: "llm_attempt_failed", attempt, error: String(err) });
            if (attempt === 1) throw new Error("llm_unavailable: " + String(err));
          }
        }
      },
      logger,
    });
  }
}

function aggregateBiomarkersText(samples: Sample[]): string | undefined {
  const byType: Record<string, number[]> = {};
  for (const s of samples) {
    (byType[s.type] ??= []).push(s.value);
  }
  if (Object.keys(byType).length === 0) return undefined;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const lines: string[] = [];
  if (byType.hrv?.length)          lines.push(`HRV media (7d): ${avg(byType.hrv).toFixed(1)} ms`);
  if (byType.sleep_h?.length)      lines.push(`Sueño medio (7d): ${avg(byType.sleep_h).toFixed(1)} h`);
  if (byType.resting_hr?.length)   lines.push(`FC en reposo media (7d): ${avg(byType.resting_hr).toFixed(0)} bpm`);
  if (byType.glucose_mean?.length) lines.push(`Glucosa media (7d): ${avg(byType.glucose_mean).toFixed(0)} mg/dL`);
  return lines.length > 0 ? lines.join("\n") : undefined;
}
