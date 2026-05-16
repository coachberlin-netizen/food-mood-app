import blocklist from "../data/brand-blocklist.json";
import type { AgentResponse } from "../schema";

export function sanitizeBrands(response: AgentResponse): AgentResponse {
  if (response.modo !== "recomendacion") return response;
  const replace = (s: string) => {
    let out = s;
    for (const { brand, generic } of blocklist as { brand: string; generic: string }[]) {
      out = out.replace(new RegExp(`\\b${brand}\\b`, "gi"), generic);
    }
    return out;
  };
  response.receta.ingredientes = response.receta.ingredientes.map(replace);
  response.receta.pasos = response.receta.pasos.map(replace);
  return response;
}
