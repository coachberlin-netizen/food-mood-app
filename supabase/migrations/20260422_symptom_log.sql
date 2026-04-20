-- symptom_log: daily tap-based symptom diary
CREATE TABLE IF NOT EXISTS public.symptom_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id      text,
  log_date        date NOT NULL DEFAULT CURRENT_DATE,
  bloating_level  int DEFAULT 0 CHECK (bloating_level BETWEEN 0 AND 3),
  sleep_level     int DEFAULT 0 CHECK (sleep_level BETWEEN 0 AND 3),
  brain_fog_level int DEFAULT 0 CHECK (brain_fog_level BETWEEN 0 AND 3),
  energy_level    int DEFAULT 0 CHECK (energy_level BETWEEN 0 AND 3),
  cycle_level     int DEFAULT 0 CHECK (cycle_level BETWEEN 0 AND 3),
  anxiety_level   int DEFAULT 0 CHECK (anxiety_level BETWEEN 0 AND 3),
  headache_level  int DEFAULT 0 CHECK (headache_level BETWEEN 0 AND 3),
  digestion_level int DEFAULT 0 CHECK (digestion_level BETWEEN 0 AND 3),
  mood_level      int DEFAULT 0 CHECK (mood_level BETWEEN 0 AND 3),
  cycle_encrypted text,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, log_date)
);

ALTER TABLE public.symptom_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "symptom_log_select_own"
  ON public.symptom_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "symptom_log_insert_any"
  ON public.symptom_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "symptom_log_update_own"
  ON public.symptom_log FOR UPDATE
  USING (auth.uid() = user_id);

-- pattern_insights: read-only patterns detected by background jobs
CREATE TABLE IF NOT EXISTS public.pattern_insights (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type text NOT NULL,
  pattern_text text NOT NULL,
  confidence   numeric,
  detected_at  timestamptz DEFAULT now(),
  is_active    bool DEFAULT true
);

ALTER TABLE public.pattern_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pattern_insights_select_own"
  ON public.pattern_insights FOR SELECT
  USING (auth.uid() = user_id);
