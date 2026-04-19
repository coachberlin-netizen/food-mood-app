-- ============================================================
-- FM Index Migration — Food·Mood
-- Tablas: fm_index_log, user_streaks
-- Trigger: fn_update_streak → actualiza racha al insertar índice
-- ============================================================


-- ── user_streaks ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id        uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak int         NOT NULL DEFAULT 0,
  longest_streak int         NOT NULL DEFAULT 0,
  last_log_date  date,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "streaks: select own"  ON public.user_streaks;
DROP POLICY IF EXISTS "streaks: update own"  ON public.user_streaks;

CREATE POLICY "streaks: select own"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE is done by the trigger (SECURITY DEFINER) or directly by the user
CREATE POLICY "streaks: update own"
  ON public.user_streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── fm_index_log ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.fm_index_log (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid    REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id      text,
  log_date        date    NOT NULL DEFAULT CURRENT_DATE,
  index_value     int     NOT NULL CHECK (index_value BETWEEN 1 AND 100),
  emotional_score numeric,
  food_score      numeric,
  test_result_id  uuid,
  food_log_id     uuid,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);

-- Add FK to test_results if that table exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'test_results'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fm_index_log_test_result_fk' AND table_name = 'fm_index_log'
  ) THEN
    ALTER TABLE public.fm_index_log
      ADD CONSTRAINT fm_index_log_test_result_fk
      FOREIGN KEY (test_result_id) REFERENCES public.test_results(id) ON DELETE SET NULL;
  END IF;
END; $$;

-- Add FK to food_log if that table exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'food_log'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fm_index_log_food_log_fk' AND table_name = 'fm_index_log'
  ) THEN
    ALTER TABLE public.fm_index_log
      ADD CONSTRAINT fm_index_log_food_log_fk
      FOREIGN KEY (food_log_id) REFERENCES public.food_log(id) ON DELETE SET NULL;
  END IF;
END; $$;

CREATE INDEX IF NOT EXISTS fm_index_log_user_date_idx
  ON public.fm_index_log (user_id, log_date DESC);

ALTER TABLE public.fm_index_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fm_index: select own"  ON public.fm_index_log;
DROP POLICY IF EXISTS "fm_index: insert any"  ON public.fm_index_log;
DROP POLICY IF EXISTS "fm_index: update own"  ON public.fm_index_log;

CREATE POLICY "fm_index: select own"
  ON public.fm_index_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "fm_index: insert any"
  ON public.fm_index_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "fm_index: update own"
  ON public.fm_index_log FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Trigger: actualiza racha al insertar una nueva entrada en fm_index_log ───

CREATE OR REPLACE FUNCTION public.fn_update_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date date;
  v_current   int;
  v_longest   int;
BEGIN
  -- Ignora entradas anónimas
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT last_log_date, current_streak, longest_streak
    INTO v_last_date, v_current, v_longest
    FROM public.user_streaks
   WHERE user_id = NEW.user_id;

  IF NOT FOUND THEN
    -- Primera entrada del usuario
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_log_date)
    VALUES (NEW.user_id, 1, 1, NEW.log_date);
    RETURN NEW;
  END IF;

  -- Ya registrado hoy — sin cambio
  IF v_last_date = NEW.log_date THEN
    RETURN NEW;
  END IF;

  -- Día consecutivo → extiende
  IF v_last_date = NEW.log_date - INTERVAL '1 day' THEN
    v_current := v_current + 1;
  ELSE
    -- Ruptura de racha → reinicia
    v_current := 1;
  END IF;

  v_longest := GREATEST(v_longest, v_current);

  UPDATE public.user_streaks
     SET current_streak = v_current,
         longest_streak = v_longest,
         last_log_date  = NEW.log_date,
         updated_at     = NOW()
   WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_streak ON public.fm_index_log;
CREATE TRIGGER trg_update_streak
  AFTER INSERT ON public.fm_index_log
  FOR EACH ROW EXECUTE FUNCTION public.fn_update_streak();
