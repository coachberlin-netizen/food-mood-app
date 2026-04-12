/**
 * Core logic for the Emotional Palette (Phase 2)
 * Pure TypeScript functions for multi-dimensional emotion mixing.
 */

export interface PaletteInput {
  energia: number;
  serenidad: number;
  claridad: number;
  conexion: number;
}

export interface PaletteResult {
  moodDominante: string;
  moodSecundario: string;
  colorLabelDominante: string;
  colorLabelSecundario: string;
  pesosOrdenados: Array<{ mood: string; peso: number }>;
  colorDominante: string;
  colorSecundario: string;
  colorMezclado: string;
  descripcion: string;
  necesidades: string;
}

const MOOD_DATA = {
  activacion: {
    color: "#E8A838",
    label: "Ámbar",
    desc: "vitalidad que se enciende",
    needs: "Dopamina y norepinefrina. Alimentos que encienden sin quemar.",
  },
  calma: {
    color: "#7BA7BC",
    label: "Azul Sereno",
    desc: "serenidad sin esfuerzo",
    needs: "GABA y serotonina. Alimentos que sueltan sin adormecer.",
  },
  focus: {
    color: "#5B8C5A",
    label: "Verde Bosque",
    desc: "claridad que corta la niebla",
    needs: "Acetilcolina y oxígeno cerebral. Combustible limpio para pensar.",
  },
  social: {
    color: "#C97B84",
    label: "Rosa Coral",
    desc: "apertura que conecta",
    needs: "Oxitocina y dopamina compartida. Platos para disfrutar con alguien.",
  },
  reset: {
    color: "#9B8EC4",
    label: "Lavanda",
    desc: "restauración profunda",
    needs: "Melatonina y glicina. Alimentos que restauran mientras descansas.",
  },
  confort: {
    color: "#D4956A",
    label: "Terracota",
    desc: "raíz y seguridad",
    needs: "Serotonina y endorfinas. Comida que te hace sentir en casa.",
  },
};

/**
 * Mixes two hex colors with a given ratio.
 */
export function mixColors(color1: string, color2: string, ratio: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
}

/**
 * Calculates the emotional palette based on 4 psychological dimensions.
 */
export function calculatePalette(input: PaletteInput): PaletteResult {
  const { energia, serenidad, claridad, conexion } = input;

  // Weighted formulas
  const pesos = [
    { mood: "activacion", peso: energia * 0.7 + (10 - serenidad) * 0.2 + claridad * 0.1 },
    { mood: "calma", peso: serenidad * 0.6 + (10 - energia) * 0.2 + conexion * 0.2 },
    { mood: "focus", peso: claridad * 0.6 + energia * 0.2 + serenidad * 0.2 },
    { mood: "social", peso: conexion * 0.6 + energia * 0.2 + serenidad * 0.2 },
    { mood: "reset", peso: (10 - energia) * 0.4 + serenidad * 0.3 + (10 - claridad) * 0.3 },
    { mood: "confort", peso: serenidad * 0.3 + (10 - energia) * 0.3 + (10 - conexion) * 0.2 + (10 - claridad) * 0.2 },
  ];

  // Sort by weight descending
  const pesosOrdenados = [...pesos].sort((a, b) => b.peso - a.peso);

  const domId = pesosOrdenados[0].mood as keyof typeof MOOD_DATA;
  const secId = pesosOrdenados[1].mood as keyof typeof MOOD_DATA;

  const dom = MOOD_DATA[domId];
  const sec = MOOD_DATA[secId];

  const descripcion = `Tu cuerpo pide ${dom.desc} con ${sec.desc}.`;
  
  // Combine needs in a natural way
  const necesidades = `${dom.needs} ${sec.needs}`;

  return {
    moodDominante: domId,
    moodSecundario: secId,
    colorLabelDominante: dom.label,
    colorLabelSecundario: sec.label,
    pesosOrdenados,
    colorDominante: dom.color,
    colorSecundario: sec.color,
    colorMezclado: mixColors(dom.color, sec.color, 0.7),
    descripcion,
    necesidades,
  };
}
