-- ── user_journey ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_journey (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_start_date date NOT NULL DEFAULT CURRENT_DATE,
  journey_number     int  NOT NULL DEFAULT 1,
  completed          bool DEFAULT false,
  completed_at       timestamptz,
  created_at         timestamptz DEFAULT now(),
  UNIQUE (user_id, journey_number)
);

ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_journey_select_own" ON public.user_journey;
DROP POLICY IF EXISTS "user_journey_insert_own" ON public.user_journey;
DROP POLICY IF EXISTS "user_journey_update_own" ON public.user_journey;

CREATE POLICY "user_journey_select_own"
  ON public.user_journey FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_journey_insert_own"
  ON public.user_journey FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_journey_update_own"
  ON public.user_journey FOR UPDATE
  USING (auth.uid() = user_id);

-- ── correlations_cache ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.correlations_cache (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  correlation_type text NOT NULL,
  factor_a         text NOT NULL,
  factor_b         text NOT NULL,
  correlation_value numeric,
  insight_text     text NOT NULL,
  sample_size      int,
  confidence       text,
  week_number      int,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now(),
  UNIQUE (user_id, factor_a, factor_b)
);

ALTER TABLE public.correlations_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "correlations_cache_select_own" ON public.correlations_cache;

CREATE POLICY "correlations_cache_select_own"
  ON public.correlations_cache FOR SELECT
  USING (auth.uid() = user_id);
