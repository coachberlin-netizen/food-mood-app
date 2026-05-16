import interactions from "../data/drug-interactions.json";
import type { Receta } from "../schema";

type Entry = { drug: string; avoid: string[]; caution: string[] };

export function validateDrugInteractions(receta: Receta, medications: string[]) {
  const med = medications.map(s => s.toLowerCase());
  const ing = receta.ingredientes.map(s => s.toLowerCase());
  const blocking: string[] = [];
  const warnings: string[] = [];
  for (const entry of interactions as Entry[]) {
    if (!med.includes(entry.drug.toLowerCase())) continue;
    for (const a of entry.avoid) if (ing.some(i => i.includes(a.toLowerCase()))) blocking.push(`${a} interacciona con ${entry.drug}`);
    for (const c of entry.caution) if (ing.some(i => i.includes(c.toLowerCase()))) warnings.push(`${c} requiere precaución con ${entry.drug}`);
  }
  return { blocking, warnings };
}
