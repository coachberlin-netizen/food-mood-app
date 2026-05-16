import type { Receta } from "../schema";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function validateAllergies(receta: Receta, allergies: string[]): string[] {
  const allergySet = allergies.map(norm).filter(Boolean);
  const violations: string[] = [];
  for (const ingrediente of receta.ingredientes) {
    const n = norm(ingrediente);
    for (const a of allergySet) if (n.includes(a)) violations.push(`${ingrediente} contiene ${a}`);
  }
  return violations;
}
