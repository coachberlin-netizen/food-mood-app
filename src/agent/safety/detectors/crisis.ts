// Reglas duras. False positives son aceptables; false negatives no.
// Completa la lista con la curaduría de la autora.
const PATTERNS: RegExp[] = [
  /\b(quiero|querr[íi]a) (morir|desaparecer|no estar)\b/i,
  /\bno quiero (seguir|vivir|estar (aqu[íi]|viva|vivo))\b/i,
  /\b(acabar|terminar) con (todo|esto|mi vida)\b/i,
  /\bhacerme da[ñn]o\b/i,
  /\bquitarme la vida\b/i,
  /\bno (vale|merece) la pena seguir\b/i,
  /\bno me importar[íi]a (no )?despertar\b/i,
];
export function detectCrisis(text: string): boolean {
  return !!text && PATTERNS.some(p => p.test(text));
}
