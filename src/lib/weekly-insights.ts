type AnySupabase = { from: (table: string) => any } // eslint-disable-line

export interface WeeklyDigest {
  user_id:           string
  week_start:        string
  week_end:          string
  fm_index_avg:      number | null
  fm_index_change:   number | null
  best_day:          string | null
  best_day_index:    number | null
  top_correlation_1: string | null
  top_correlation_2: string | null
  top_correlation_3: string | null
  record_broken:     boolean
  record_type:       string | null
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function getWeekBounds(date = new Date()): { weekStart: string; weekEnd: string } {
  const d   = new Date(date)
  const day = d.getDay() // 0=Sun … 6=Sat
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd:   sunday.toISOString().split("T")[0],
  }
}

function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split("T")[0]
}

function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length
}

// ── Main function ─────────────────────────────────────────────────────────────

export async function generateWeeklyDigest(
  userId: string,
  supabase: AnySupabase
): Promise<WeeklyDigest | null> {
  const { weekStart, weekEnd } = getWeekBounds()
  const prevWeekStart = addDays(weekStart, -7)
  const prevWeekEnd   = addDays(weekEnd,   -7)

  // Parallel fetch: this week + prev week fm_index + correlations
  const [
    { data: thisWeekRaw },
    { data: prevWeekRaw },
    { data: corrRaw },
  ] = await Promise.all([
    supabase
      .from("fm_index_log")
      .select("log_date, index_value")
      .eq("user_id", userId)
      .gte("log_date", weekStart)
      .lte("log_date", weekEnd),
    supabase
      .from("fm_index_log")
      .select("log_date, index_value")
      .eq("user_id", userId)
      .gte("log_date", prevWeekStart)
      .lte("log_date", prevWeekEnd),
    supabase
      .from("correlations_cache")
      .select("insight_text, confidence, sample_size")
      .eq("user_id", userId)
      .order("sample_size", { ascending: false })
      .limit(3),
  ])

  const thisWeek = (thisWeekRaw ?? []) as { log_date: string; index_value: number }[]
  const prevWeek = (prevWeekRaw ?? []) as { log_date: string; index_value: number }[]
  const corr     = (corrRaw     ?? []) as { insight_text: string; confidence: string; sample_size: number }[]

  // Need at least 1 data point to generate
  if (thisWeek.length === 0 && corr.length === 0) return null

  // Metrics
  const thisValues = thisWeek.map(r => r.index_value).filter(v => v != null)
  const prevValues = prevWeek.map(r => r.index_value).filter(v => v != null)

  const fm_index_avg    = thisValues.length > 0 ? Math.round(mean(thisValues) * 10) / 10 : null
  const fm_index_change = thisValues.length > 0 && prevValues.length > 0
    ? Math.round((mean(thisValues) - mean(prevValues)) * 10) / 10
    : null

  const best = thisWeek.reduce<{ log_date: string; index_value: number } | null>(
    (acc, cur) => (!acc || cur.index_value > acc.index_value ? cur : acc),
    null
  )

  // Detect record (best ever)
  const { data: allTimeRaw } = await supabase
    .from("fm_index_log")
    .select("index_value")
    .eq("user_id", userId)
    .order("index_value", { ascending: false })
    .limit(1)
    .maybeSingle()

  const allTimeBest = (allTimeRaw as { index_value: number } | null)?.index_value ?? 0
  const record_broken = best ? best.index_value >= allTimeBest : false

  const digest: WeeklyDigest = {
    user_id:           userId,
    week_start:        weekStart,
    week_end:          weekEnd,
    fm_index_avg,
    fm_index_change,
    best_day:          best?.log_date ?? null,
    best_day_index:    best ? Math.round(best.index_value) : null,
    top_correlation_1: corr[0]?.insight_text ?? null,
    top_correlation_2: corr[1]?.insight_text ?? null,
    top_correlation_3: corr[2]?.insight_text ?? null,
    record_broken,
    record_type:       record_broken ? "indice" : null,
  }

  // Upsert
  await supabase
    .from("weekly_digest")
    .upsert(digest, { onConflict: "user_id,week_start" })

  return digest
}
