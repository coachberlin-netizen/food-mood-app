import { AgentResponseSchema, type AgentResponse } from "./schema";
import { detectCrisis } from "./detectors/crisis";
import { detectTCA } from "./detectors/tca";
import { validateAllergies } from "./validators/allergies";
import { validateDrugInteractions } from "./validators/drug-interactions";
import { sanitizeBrands } from "./sanitizers/brand-names";

export type UserProfile = {
  country: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
};

export class SafetyViolation extends Error {
  constructor(public reasons: string[]) { super(reasons.join("; ")); this.name = "SafetyViolation"; }
}

type Logger = (event: Record<string, unknown>) => void;

export async function runSafetyPipeline(args: {
  userText: string;
  profile: UserProfile;
  callLLM: () => Promise<unknown>;
  logger: Logger;
}): Promise<AgentResponse> {
  const { userText, profile, callLLM, logger } = args;

  if (detectCrisis(userText)) {
    logger({ event: "preflight_derive", tipo: "crisis_emocional" });
    return buildDerive("crisis_emocional", profile.country);
  }
  if (detectTCA(userText)) {
    logger({ event: "preflight_derive", tipo: "tca" });
    return buildDerive("tca", profile.country);
  }

  const raw = await callLLM();
  const parsed = AgentResponseSchema.parse(raw);

  if (parsed.modo === "derivar") {
    logger({ event: "llm_derive", tipo: parsed.tipo_derivacion });
    return parsed;
  }

  if (parsed.modo === "recomendacion") {
    const allergyViolations = validateAllergies(parsed.receta, profile.allergies);
    if (allergyViolations.length) throw new SafetyViolation(allergyViolations);
    const { blocking, warnings } = validateDrugInteractions(parsed.receta, profile.medications);
    if (blocking.length) throw new SafetyViolation(blocking);
    if (warnings.length) parsed.advertencias = [...parsed.advertencias, ...warnings];
  }

  return sanitizeBrands(parsed);
}

const RESOURCES: Record<string, Record<"crisis_emocional" | "tca", string[]>> = {
  ES: {
    crisis_emocional: ["024 — Línea de atención a la conducta suicida", "Teléfono de la Esperanza: 717 003 717"],
    tca: ["FEACAB — Federación Española contra Anorexia y Bulimia", "ACAB Cataluña: 93 433 50 90"],
  },
  MX: {
    crisis_emocional: ["SAPTEL: 55 5259-8121"],
    tca: ["Comenzar de Nuevo A.C.: 81 1234 0989"],
  },
};
const MESSAGES = {
  crisis_emocional: "Lo que me cuentas importa. Ahora mismo no soy la herramienta adecuada para acompañarte; estas personas sí lo son.",
  tca: "Lo que describes merece la mirada de alguien especializado, no una receta. Aquí tienes a quién acudir.",
};
function buildDerive(tipo: "crisis_emocional" | "tca", country: string): AgentResponse {
  const recursos = (RESOURCES[country] ?? RESOURCES["ES"])[tipo];
  return { modo: "derivar", mensaje: MESSAGES[tipo], tipo_derivacion: tipo, recursos };
}
