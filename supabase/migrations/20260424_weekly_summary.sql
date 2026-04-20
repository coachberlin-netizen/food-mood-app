-- ── weekly_digest ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_digest (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start        date NOT NULL,
  week_end          date NOT NULL,
  fm_index_avg      numeric,
  fm_index_change   numeric,
  best_day          date,
  best_day_index    int,
  top_correlation_1 text,
  top_correlation_2 text,
  top_correlation_3 text,
  record_broken     bool DEFAULT false,
  record_type       text,
  email_sent        bool DEFAULT false,
  email_sent_at     timestamptz,
  created_at        timestamptz DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE public.weekly_digest ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_digest_select_own" ON public.weekly_digest;

CREATE POLICY "weekly_digest_select_own"
  ON public.weekly_digest FOR SELECT
  USING (auth.uid() = user_id);

-- ── curated_content ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.curated_content (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  category   text NOT NULL,
  title      text NOT NULL,
  summary    text,
  url        text,
  is_active  bool DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.curated_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "curated_content_select_public" ON public.curated_content;

CREATE POLICY "curated_content_select_public"
  ON public.curated_content FOR SELECT
  USING (true);
