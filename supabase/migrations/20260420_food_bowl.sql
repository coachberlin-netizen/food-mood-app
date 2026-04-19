-- ============================================================
-- Food Bowl Migration — Food·Mood
-- Tabla food_log para el Bol del día
-- ============================================================

CREATE TABLE IF NOT EXISTS public.food_log (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id       text,
  log_date         date        NOT NULL DEFAULT CURRENT_DATE,
  protein_count    int         NOT NULL DEFAULT 0,
  fish_count       int         NOT NULL DEFAULT 0,
  vegetables_count int         NOT NULL DEFAULT 0,
  fruits_count     int         NOT NULL DEFAULT 0,
  grains_count     int         NOT NULL DEFAULT 0,
  fermented_count  int         NOT NULL DEFAULT 0,
  nuts_count       int         NOT NULL DEFAULT 0,
  processed_count  int         NOT NULL DEFAULT 0,
  water_count      int         NOT NULL DEFAULT 0,
  bowl_color_hex   text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

-- Fast lookup by user + date
CREATE INDEX IF NOT EXISTS food_log_user_date_idx
  ON public.food_log (user_id, log_date DESC);

-- Auto-update updated_at on every update
CREATE OR REPLACE FUNCTION public.fn_food_log_touch()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_food_log_touch ON public.food_log;
CREATE TRIGGER trg_food_log_touch
  BEFORE UPDATE ON public.food_log
  FOR EACH ROW EXECUTE FUNCTION public.fn_food_log_touch();

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.food_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "food_log: select own"  ON public.food_log;
DROP POLICY IF EXISTS "food_log: insert any"  ON public.food_log;
DROP POLICY IF EXISTS "food_log: update own"  ON public.food_log;
DROP POLICY IF EXISTS "food_log: delete own"  ON public.food_log;

-- Authenticated users see only their own rows
CREATE POLICY "food_log: select own"
  ON public.food_log FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert (anon sessions get user_id = NULL)
CREATE POLICY "food_log: insert any"
  ON public.food_log FOR INSERT
  WITH CHECK (true);

-- Only the owner can update
CREATE POLICY "food_log: update own"
  ON public.food_log FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete
CREATE POLICY "food_log: delete own"
  ON public.food_log FOR DELETE
  USING (auth.uid() = user_id);
