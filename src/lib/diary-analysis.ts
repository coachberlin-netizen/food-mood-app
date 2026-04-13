/**
 * Emotional Diary Analysis Logic (Phase 3)
 * Provides pure functions for pattern recognition and nutritional insights.
 */

export interface DiaryEntry {
  id: string;
  created_at: string;
  energia: number;
  calma: number; // Dimension formally known as 'serenidad' in logic, 'calma' in DB
  claridad: number;
  conexion: number;
  mood_dominante: string;
  mood_secundario: string;
  color_resultado: string;
  nota: string | null;
  receta_cocinada: string | null;
  dia_semana: string;
}

export interface WeeklyAnalysis {
  entries: DiaryEntry[];
  dominantMood: string;
  dominantColor: string;
  secondaryMood: string;
  daysLogged: number;
  averages: { energia: number; calma: number; claridad: number; conexion: number };
  pattern: string | null;
  recommendation: string;
  colorSequence: string[]; // 7 positions, 0=Monday, 6=Sunday
}

export interface MonthlyAnalysis {
  weeks: WeeklyAnalysis[];
  dominantMoodMonth: string;
  moodDistribution: Record<string, number>;
  colorGrid: string[][];
  trend: string;
  insight: string;
}

const MOOD_COLORS: Record<string, string> = {
  activacion: "#E8A87C",
  calma: "#7EC8C8",
  focus: "#F4E285",
  social: "#F4A7B9",
  reset: "#B8A9C9",
  confort: "#D4A574",
};

const MOOD_NEEDS: Record<string, string> = {
  activacion: "energía y movimiento",
  calma: "quietud y restauración",
  focus: "claridad y concentración",
  social: "conexión y pertenencia",
  reset: "descanso profundo",
  confort: "seguridad y arraigo",
};

const RECOMMENDATIONS: Record<string, string> = {
  activacion: "Semana de alta energía. Asegúrate de compensar con recetas de Calma o Reset al final del día para no agotar reservas.",
  calma: "Tu cuerpo pidió serenidad esta semana. Honra esa necesidad — el GABA y la serotonina se construyen con constancia, no con prisa.",
  focus: "Semana de claridad mental. Mantén el combustible cerebral: omega-3, colina, magnesio. Tu acetilcolina te lo agradece.",
  social: "Semana de conexión. La oxitocina que generaste compartiendo comida y tiempo protege tu sistema inmune más de lo que crees.",
  reset: "Semana de restauración. No es debilidad — es inteligencia biológica. Tu cuerpo está reparando. Dale melatonina y glicina.",
  confort: "Semana de buscar raíz. El confort no es indulgencia — es tu sistema nervioso pidiendo seguridad. Triptófano, endorfinas, y alimentos que saben a casa.",
  default: "Escucha a tu cuerpo esta semana. Cada color que eliges es información — no la ignorés.",
};

/**
 * Helper to get day index (0=Monday, 6=Sunday)
 */
function getDayIndex(dateStr: string): number {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0=Sunday, 1=Monday...
  return day === 0 ? 6 : day - 1;
}

export function analyzeWeek(entries: DiaryEntry[]): WeeklyAnalysis {
  if (entries.length === 0) {
    return {
      entries: [],
      dominantMood: "vago",
      dominantColor: "#E0E0E0",
      secondaryMood: "vago",
      daysLogged: 0,
      averages: { energia: 0, calma: 0, claridad: 0, conexion: 0 },
      pattern: null,
      recommendation: RECOMMENDATIONS.default,
      colorSequence: Array(7).fill("#E0E0E0"),
    };
  }

  // Averages
  const sums = entries.reduce(
    (acc, cur) => ({
      energia: acc.energia + cur.energia,
      calma: acc.calma + cur.calma,
      claridad: acc.claridad + cur.claridad,
      conexion: acc.conexion + cur.conexion,
    }),
    { energia: 0, calma: 0, claridad: 0, conexion: 0 }
  );

  const averages = {
    energia: Math.round(sums.energia / entries.length),
    calma: Math.round(sums.calma / entries.length),
    claridad: Math.round(sums.claridad / entries.length),
    conexion: Math.round(sums.conexion / entries.length),
  };

  // Frequencies
  const moodCounts: Record<string, number> = {};
  entries.forEach((e) => {
    moodCounts[e.mood_dominante] = (moodCounts[e.mood_dominante] || 0) + 1;
  });

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const dominantMood = sortedMoods[0][0];
  const secondaryMood = sortedMoods[1] ? sortedMoods[1][0] : dominantMood;

  // Color sequence
  const colorSequence = Array(7).fill("#E0E0E0");
  entries.forEach((e) => {
    const idx = getDayIndex(e.created_at);
    colorSequence[idx] = e.color_resultado;
  });

  // Pattern detection
  let pattern: string | null = null;
  const sortedEntries = [...entries].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // 1. Dominant mood 5+ days
  if (moodCounts[dominantMood] >= 5) {
    pattern = `Semana muy ${dominantMood}. Tu cuerpo mantuvo una necesidad constante de ${MOOD_NEEDS[dominantMood] || "equilibrio"}.`;
  }

  // 2. Energy drop 40+ points (assuming scale 0-10, so 4+ points? User said "40+ puntos", maybe they imply 0-100 internally or just 4.0? I'll use 4 if input is 0-10)
  // Wait, if sliders are 0-10, 40 points might mean total across days or just a decimal?
  // Let's assume 4 points if on scale 10.
  if (!pattern && sortedEntries.length > 1) {
    for (let i = 1; i < sortedEntries.length; i++) {
        const drop = sortedEntries[i-1].energia - sortedEntries[i].energia;
        if (drop >= 4) { // Interpreting 40 points as 4 on 0-10 scale
            pattern = `El ${sortedEntries[i].dia_semana} hubo una caída notable de energía. Observa qué pasó ese día — el cuerpo registra lo que la mente a veces ignora.`;
            break;
        }
    }
  }

  // 3. Transition in last 3 days
  if (!pattern && sortedEntries.length >= 3) {
    const last3 = sortedEntries.slice(-3);
    const firstMood = sortedEntries[0].mood_dominante;
    const lastMood = last3[2].mood_dominante;
    const allSameLast3 = last3.every(e => e.mood_dominante === lastMood);
    
    if (allSameLast3 && lastMood !== firstMood) {
        pattern = `Tu semana empezó en ${firstMood} y terminó en ${lastMood}. Hay una transición clara — tu cuerpo fue ajustándose.`;
    }
  }

  return {
    entries,
    dominantMood,
    dominantColor: MOOD_COLORS[dominantMood] || "#E0E0E0",
    secondaryMood,
    daysLogged: entries.length,
    averages,
    pattern,
    recommendation: RECOMMENDATIONS[dominantMood] || RECOMMENDATIONS.default,
    colorSequence,
  };
}

export function analyzeMonth(weeks: WeeklyAnalysis[]): MonthlyAnalysis {
  if (weeks.length === 0) {
    return {
      weeks: [],
      dominantMoodMonth: "vago",
      moodDistribution: {},
      colorGrid: [],
      trend: "Sin datos suficientes.",
      insight: "Empieza tu diario para ver descubrir tus patrones.",
    };
  }

  const moodDistribution: Record<string, number> = {};
  const weeklyMoodCounts: Record<string, number> = {};
  const allEntries: DiaryEntry[] = [];

  weeks.forEach(w => {
    weeklyMoodCounts[w.dominantMood] = (weeklyMoodCounts[w.dominantMood] || 0) + 1;
    w.entries.forEach(e => {
        moodDistribution[e.mood_dominante] = (moodDistribution[e.mood_dominante] || 0) + 1;
        allEntries.push(e);
    });
  });

  const dominantMoodMonth = Object.entries(weeklyMoodCounts).sort((a,b) => b[1] - a[1])[0][0];
  const colorGrid = weeks.slice(0, 5).map(w => w.colorSequence);

  // Trend
  let trend = "Mes consistente.";
  if (weeks.length >= 2) {
    const mid = Math.ceil(weeks.length / 2);
    const firstHalf = weeks.slice(0, mid);
    const secondHalf = weeks.slice(mid);
    
    const countHalf = (wList: WeeklyAnalysis[]) => {
        const counts: Record<string, number> = {};
        wList.forEach(w => counts[w.dominantMood] = (counts[w.dominantMood] || 0) + 1);
        return Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0];
    };

    const firstMood = countHalf(firstHalf);
    const secondMood = countHalf(secondHalf);

    if (firstMood !== secondMood) {
        trend = `Tu mes empezó en ${firstMood} y evolucionó hacia ${secondMood}. Algo cambió a mitad de camino.`;
    } else {
        trend = `Mes consistente en ${firstMood}. Tu cuerpo supo lo que necesitaba y lo mantuvo.`;
    }
  }

  // Insight
  const totalDays = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
  const sortedDistribution = Object.entries(moodDistribution).sort((a,b) => b[1] - a[1]);
  const topMood = sortedDistribution[0][0];
  const topPercent = (sortedDistribution[0][1] / totalDays) * 100;

  let insight = "";
  if (topPercent >= 50) {
    insight = `Tu color dominante este mes fue ${topMood}. Eso significa que tu necesidad principal fue ${MOOD_NEEDS[topMood] || "equilibrio"}. El mes que viene, observa si se mantiene o si tu paleta evoluciona.`;
  } else if (sortedDistribution.every(m => (m[1] / totalDays) < 0.3)) {
    insight = "Mes emocionalmente diverso. Tu paleta fue rica en matices — señal de adaptabilidad emocional.";
  } else {
    insight = `Tu mes tuvo un color protagonista: ${topMood}. No dominó del todo, pero tu cuerpo lo pedía más que el resto.`;
  }

  return {
    weeks,
    dominantMoodMonth,
    moodDistribution,
    colorGrid,
    trend,
    insight,
  };
}
