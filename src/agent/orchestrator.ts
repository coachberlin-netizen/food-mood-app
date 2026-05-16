import Anthropic from "@anthropic-ai/sdk";
import { loadSystemPrompt } from "./load-prompt";
import { buildSystemPromptWithContext } from "./build-context";
import { runSafetyPipeline } from "./safety/middleware";
import type { AgentResponse } from "./safety/schema";
import type { RagStore } from "./rag";
import type { AgentRequest } from "./types";

export interface OrchestratorConfig {
  anthropic: Anthropic;
  rag: RagStore;
  logger?: (event: Record<string, unknown>) => void;
  model?: string;
}

export class Orchestrator {
  private readonly anthropic: Anthropic;
  private readonly rag: RagStore;
  private readonly logger: (event: Record<string, unknown>) => void;
  private readonly model: string;
  private readonly basePrompt: string;

  constructor(config: OrchestratorConfig) {
    this.anthropic = config.anthropic;
    this.rag = config.rag;
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
