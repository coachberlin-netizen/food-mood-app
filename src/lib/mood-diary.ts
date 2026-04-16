import { SupabaseClient } from '@supabase/supabase-js';

export type DiaryDay = {
  date: string;           // "YYYY-MM-DD"
  color: string;          // hex del color mezclado, "#E0E0E0" si no hay dato
  moodName: string;       // label visual (ej: "Lavanda"), "" si no hay dato
  moodDominante: string;  // id del mood (ej: "reset"), "" si no hay dato
  hasNote: boolean;       // si tiene nota guardada
};

export type WeekData = {
  days: DiaryDay[];         // siempre 7 elementos, L→D
  dominantMood: string;     // mood más frecuente de la semana
  dominantColor: string;    // hex del mood dominante
  dominantLabel: string;    // label visual del mood dominante
};

const MOOD_COLOR_LABELS: Record<string, string> = {
  activacion: "Oro Líquido",
  calma: "Azul Infinito",
  focus: "Esmeralda Viva",
  social: "Rubí Profundo",
  reset: "Amatista Eléctrica",
  confort: "Ámbar Radiante",
};

const MOOD_COLORS: Record<string, string> = {
  activacion: "#FFB000",
  calma: "#00D1FF",
  focus: "#00DD80",
  social: "#FF2D55",
  reset: "#9D00FF",
  confort: "#FF6B00",
};

/**
 * Returns the Monday of the current week at 00:00:00 local time.
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Fetches and processes mood data for a specific week starting on Monday.
 */
export async function getWeekData(
  supabase: SupabaseClient,
  userId: string,
  weekStart: Date
): Promise<WeekData> {
  const startDate = weekStart.toISOString().split('T')[0];
  const endDate = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('emotional_palettes')
    .select('session_date, color_resultado, mood_dominante, nota')
    .eq('user_id', userId)
    .gte('session_date', startDate)
    .lte('session_date', endDate)
    .order('session_date', { ascending: true });

  if (error) {
    console.error('Error fetching week data:', error);
  }

  const days: DiaryDay[] = [];
  const moodCounts: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Find entry for this date (taking the last one if multiple exist per day)
    const entry = data?.filter(d => d.session_date === dateStr).pop();

    if (entry) {
      const moodId = entry.mood_dominante;
      days.push({
        date: dateStr,
        color: entry.color_resultado || "#E0E0E0",
        moodName: MOOD_COLOR_LABELS[moodId] || "",
        moodDominante: moodId || "",
        hasNote: !!entry.nota,
      });

      if (moodId) {
        moodCounts[moodId] = (moodCounts[moodId] || 0) + 1;
      }
    } else {
      days.push({
        date: dateStr,
        color: "#E0E0E0",
        moodName: "",
        moodDominante: "",
        hasNote: false,
      });
    }
  }

  // Calculate dominant mood
  let dominantMood = "";
  let maxCount = 0;
  
  // We use the first found in case of tie as per instructions
  for (const mood of Object.keys(MOOD_COLOR_LABELS)) {
    if ((moodCounts[mood] || 0) > maxCount) {
      maxCount = moodCounts[mood];
      dominantMood = mood;
    }
  }

  return {
    days,
    dominantMood: dominantMood || "vago",
    dominantColor: MOOD_COLORS[dominantMood] || "#E0E0E0",
    dominantLabel: MOOD_COLOR_LABELS[dominantMood] || "Sin datos",
  };
}

/**
 * Fetches all days of a specific month.
 * month is 1-indexed (1=Jan, 12=Dec)
 */
export async function getMonthData(
  supabase: SupabaseClient,
  userId: string,
  year: number,
  month: number
): Promise<DiaryDay[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('emotional_palettes')
    .select('session_date, color_resultado, mood_dominante, nota')
    .eq('user_id', userId)
    .gte('session_date', startStr)
    .lte('session_date', endStr)
    .order('session_date', { ascending: true });

  if (error) {
    console.error('Error fetching month data:', error);
  }

  const days: DiaryDay[] = [];
  const numDays = endDate.getDate();

  for (let i = 1; i <= numDays; i++) {
    const currentDate = new Date(year, month - 1, i);
    // Use local date conversion to avoid timezone shifts
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const entry = data?.filter(e => e.session_date === dateStr).pop();

    if (entry) {
      const moodId = entry.mood_dominante;
      days.push({
        date: dateStr,
        color: entry.color_resultado || "#E0E0E0",
        moodName: MOOD_COLOR_LABELS[moodId] || "",
        moodDominante: moodId || "",
        hasNote: !!entry.nota,
      });
    } else {
      days.push({
        date: dateStr,
        color: "#E0E0E0",
        moodName: "",
        moodDominante: "",
        hasNote: false,
      });
    }
  }

  return days;
}
