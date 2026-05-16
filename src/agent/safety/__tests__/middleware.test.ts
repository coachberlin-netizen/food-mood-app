import { describe, it, expect, vi } from "vitest";
import { runSafetyPipeline, SafetyViolation } from "../middleware";

const baseProfile = { country: "ES", allergies: [], medications: [], conditions: [] };
const logger = vi.fn();
const valid = {
  modo: "recomendacion",
  receta: { titulo: "Bowl matcha", ingredientes: ["matcha", "arándanos", "kefir"], pasos: ["batir"], categoria_food_mood: "Focus", tiempo_min: 5 },
  microaccion: { titulo: "Respira", descripcion: "4-7-8", duracion_min: 3 },
  microcontenido: { titulo: "Por qué", porque: "L-teanina + polifenoles", palancas_longevidad: ["BDNF"], nivel_evidencia: "B", fuentes: ["Food·Mood, cap. Focus"] },
  advertencias: [],
};

describe("safety pipeline", () => {
  it("deriva ante crisis sin llamar al LLM", async () => {
    const callLLM = vi.fn();
    const out = await runSafetyPipeline({ userText: "no quiero seguir aquí", profile: baseProfile, callLLM, logger });
    expect(callLLM).not.toHaveBeenCalled();
    expect(out.modo).toBe("derivar");
  });

  it("bloquea recomendación con alergia presente", async () => {
    const callLLM = vi.fn().mockResolvedValue(valid);
    await expect(
      runSafetyPipeline({ userText: "hoy Focus", profile: { ...baseProfile, allergies: ["arándano"] }, callLLM, logger })
    ).rejects.toBeInstanceOf(SafetyViolation);
  });

  it("convierte interacción en advertencia, no bloqueo", async () => {
    const callLLM = vi.fn().mockResolvedValue(valid);
    const out = await runSafetyPipeline({ userText: "hoy Focus", profile: { ...baseProfile, medications: ["warfarina"] }, callLLM, logger });
    expect(out.modo).toBe("recomendacion");
    if (out.modo === "recomendacion") expect(out.advertencias.length).toBeGreaterThan(0);
  });

  it("sanitiza marcas en ingredientes y pasos", async () => {
    const withBrand = { ...valid, receta: { ...valid.receta, ingredientes: ["UMYKO", "matcha", "kefir"], pasos: ["servir con UMYKO frío"] } };
    const out = await runSafetyPipeline({ userText: "hoy Focus", profile: baseProfile, callLLM: vi.fn().mockResolvedValue(withBrand), logger });
    if (out.modo === "recomendacion") {
      expect(out.receta.ingredientes.join(" ")).not.toMatch(/UMYKO/i);
      expect(out.receta.pasos.join(" ")).not.toMatch(/UMYKO/i);
    }
  });
});
