// Minimal interface — compatible with any Supabase client variant
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any }

export interface CorrelationInsight {
  correlation_type: "food_mood" | "food_symptom" | "symptom_mood"
  factor_a: string
  factor_b: string
  correlation_value: number
  insight_text: string
  sample_size: number
  confidence: "alta" | "media" | "baja"
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function getConfidence(n: number): "alta" | "media" | "baja" {
  if (n >= 14) return "alta"
  if (n >= 7)  return "media"
  return "baja"
}

function weekOfYear(date: string): number {
  const d = new Date(date)
  const start = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7)
}

function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split("T")[0]
}

export async function calculateCorrelations(
  userId: string,
  supabase: AnySupabase
): Promise<CorrelationInsight[]> {
  const since = addDays(new Date().toISOString().split("T")[0], -30)

  const [{ data: testsRaw }, { data: foodRaw }, { data: symptomsRaw }] = await Promise.all([
    supabase
      .from("test_results")
      .select("energia, animo, tension, conexion, claridad, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${since}T00:00:00`)
      .order("created_at", { ascending: true }),
    supabase
      .from("food_log")
      .select("fermented_count, protein_count, processed_count, log_date")
      .eq("user_id", userId)
      .gte("log_date", since),
    supabase
      .from("symptom_log")
      .select("sleep_level, brain_fog_level, bloating_level, log_date")
      .eq("user_id", userId)
      .gte("log_date", since),
  ])

  const tests     = (testsRaw     ?? []) as { energia: number; animo: number; tension: number; conexion: number; claridad: number; created_at: string }[]
  const food      = (foodRaw      ?? []) as { fermented_count: number; protein_count: number; processed_count: number; log_date: string }[]
  const symptoms  = (symptomsRaw  ?? []) as { sleep_level: number; brain_fog_level: number; bloating_level: number; log_date: string }[]

  // Not enough data overall
  if (tests.length < 7 && food.length < 7 && symptoms.length < 7) return []

  // Index by date — keep latest test per day
  const testByDate = new Map<string, typeof tests[0]>()
  for (const t of tests) {
    const date = t.created_at.split("T")[0]
    testByDate.set(date, t)
  }

  const foodByDate = new Map<string, typeof food[0]>()
  for (const f of food) foodByDate.set(f.log_date, f)

  const symptomByDate = new Map<string, typeof symptoms[0]>()
  for (const s of symptoms) symptomByDate.set(s.log_date, s)

  const insights: CorrelationInsight[] = []

  const testEntries    = Array.from(testByDate.entries())
  const symptomEntries = Array.from(symptomByDate.entries())

  // ── A. Fermentados → tensión ──────────────────────────────────────────────
  {
    const with_: number[] = []
    const without_: number[] = []
    for (const [date, test] of testEntries) {
      const f = foodByDate.get(date)
      if (!f) continue
      ;((f.fermented_count ?? 0) >= 1 ? with_ : without_).push(test.tension)
    }
    if (with_.length >= 3 && without_.length >= 3) {
      const diff = mean(without_) - mean(with_)
      if (diff > 10) {
        insights.push({
          correlation_type: "food_mood",
          factor_a: "fermentados",
          factor_b: "tension",
          correlation_value: Math.round(diff * 10) / 10,
          insight_text: `Los días que incluyes fermentados tu tensión baja ${Math.round(diff)} puntos de media. Tu microbioma regula tu estrés más rápido de lo que imaginas.`,
          sample_size: with_.length + without_.length,
          confidence: getConfidence(with_.length + without_.length),
        })
      }
    }
  }

  // ── B. Proteína → claridad ────────────────────────────────────────────────
  {
    const with_: number[] = []
    const without_: number[] = []
    for (const [date, test] of testEntries) {
      const f = foodByDate.get(date)
      if (!f) continue
      ;((f.protein_count ?? 0) >= 1 ? with_ : without_).push(test.claridad)
    }
    if (with_.length >= 3 && without_.length >= 3) {
      const diff = mean(with_) - mean(without_)
      if (diff > 8) {
        insights.push({
          correlation_type: "food_mood",
          factor_a: "proteina",
          factor_b: "claridad",
          correlation_value: Math.round(diff * 10) / 10,
          insight_text: `Con proteína en tu bol, tu claridad mental sube ${Math.round(diff)} puntos. Los aminoácidos son el combustible de tus neurotransmisores.`,
          sample_size: with_.length + without_.length,
          confidence: getConfidence(with_.length + without_.length),
        })
      }
    }
  }

  // ── C. Procesados → ánimo ─────────────────────────────────────────────────
  {
    const high: number[] = []
    const low: number[] = []
    for (const [date, test] of testEntries) {
      const f = foodByDate.get(date)
      if (!f) continue
      ;((f.processed_count ?? 0) >= 3 ? high : low).push(test.animo)
    }
    if (high.length >= 2 && low.length >= 2) {
      const highMean = mean(high)
      if (highMean < 40) {
        const diff = mean(low) - highMean
        insights.push({
          correlation_type: "food_mood",
          factor_a: "procesados",
          factor_b: "animo",
          correlation_value: Math.round(diff * 10) / 10,
          insight_text: `Los días con muchos ultraprocesados tu ánimo cae ${Math.round(diff)} puntos. La inflamación intestinal llega al cerebro en horas.`,
          sample_size: high.length + low.length,
          confidence: getConfidence(high.length + low.length),
        })
      }
    }
  }

  // ── D. Sueño bajo → niebla mental al día siguiente ────────────────────────
  {
    const fogBadSleep: number[] = []
    const fogGoodSleep: number[] = []
    const allSymDates = Array.from(symptomByDate.keys()).sort()

    for (let i = 0; i < allSymDates.length - 1; i++) {
      const todayD   = allSymDates[i]
      const tomorrow = allSymDates[i + 1]
      if (tomorrow !== addDays(todayD, 1)) continue

      const todaySym    = symptomByDate.get(todayD)!
      const tomorrowSym = symptomByDate.get(tomorrow)!

      const target = (todaySym.sleep_level ?? 0) <= 1 ? fogBadSleep : fogGoodSleep
      target.push(tomorrowSym.brain_fog_level ?? 0)
    }

    if (fogBadSleep.length >= 3) {
      const badMean = mean(fogBadSleep)
      if (badMean > 1.5) {
        const diff = badMean - mean(fogGoodSleep)
        insights.push({
          correlation_type: "symptom_mood",
          factor_a: "sueno_bajo",
          factor_b: "niebla_mental",
          correlation_value: Math.round(badMean * 10) / 10,
          insight_text: `Cuando duermes mal, al día siguiente tu niebla mental sube ${(Math.round(diff * 10) / 10).toFixed(1)} puntos de media. El sueño consolida los circuitos cognitivos.`,
          sample_size: fogBadSleep.length + fogGoodSleep.length,
          confidence: getConfidence(fogBadSleep.length),
        })
      }
    }
  }

  // ── E. Hinchazón → tensión con lag 1-2 días ──────────────────────────────
  {
    const tensionAfterBloat: number[] = []
    const tensionBaseline: number[] = []

    for (const [date, sym] of symptomEntries) {
      if ((sym.bloating_level ?? 0) < 2) continue
      for (const offset of [1, 2]) {
        const t = testByDate.get(addDays(date, offset))
        if (t) tensionAfterBloat.push(t.tension)
      }
    }

    for (const [date, test] of testEntries) {
      const s1 = symptomByDate.get(addDays(date, -1))
      const s2 = symptomByDate.get(addDays(date, -2))
      const bloatBefore = Math.max(s1?.bloating_level ?? 0, s2?.bloating_level ?? 0)
      if (bloatBefore < 2) tensionBaseline.push(test.tension)
    }

    if (tensionAfterBloat.length >= 3) {
      const bloatMean = mean(tensionAfterBloat)
      if (bloatMean > 60) {
        const diff = bloatMean - mean(tensionBaseline)
        insights.push({
          correlation_type: "food_symptom",
          factor_a: "hinchazon",
          factor_b: "ansiedad",
          correlation_value: Math.round(bloatMean * 10) / 10,
          insight_text: `Después de un día con hinchazón alta, tu tensión sube ${Math.round(diff)} puntos en los 2 días siguientes. El eje intestino-cerebro habla más rápido de lo que crees.`,
          sample_size: tensionAfterBloat.length,
          confidence: getConfidence(tensionAfterBloat.length),
        })
      }
    }
  }

  // ── Persist to correlations_cache ─────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0]
  const week  = weekOfYear(today)

  for (const ins of insights) {
    await supabase.from("correlations_cache").upsert(
      {
        user_id:           userId,
        correlation_type:  ins.correlation_type,
        factor_a:          ins.factor_a,
        factor_b:          ins.factor_b,
        correlation_value: ins.correlation_value,
        insight_text:      ins.insight_text,
        sample_size:       ins.sample_size,
        confidence:        ins.confidence,
        week_number:       week,
        updated_at:        new Date().toISOString(),
      },
      { onConflict: "user_id,factor_a,factor_b" }
    )
  }

  return insights
}
