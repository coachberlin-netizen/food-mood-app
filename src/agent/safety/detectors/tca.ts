const PATTERNS: RegExp[] = [
  /\b(d[íi]as|semanas) sin comer\b/i,
  /\bno (he comido|como) (nada|casi nada)\b/i,
  /\bme siento (m[áa]s )?(limpia|limpio|pura|puro) (cuando|porque) no com[oi]\b/i,
  /\b(purgar|vomitar (despu[ée]s)?|provocarme el v[óo]mito)\b/i,
  /\bcompensar (lo que com[íi]|el atrac[óo]n)\b/i,
  /\bquemar (las )?calor[íi]as\b/i,
  /\bcomida (sucia|prohibida|asquerosa)\b/i,
  /\bmenos de \d+ (g|gr|gramos|kcal|calor[íi]as)\b/i,
  /\bno merezco comer\b/i,
];
export function detectTCA(text: string): boolean {
  return !!text && PATTERNS.some(p => p.test(text));
}
