CREATE TABLE IF NOT EXISTS public.oracle_checkins (
  id                uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid    REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at        timestamptz DEFAULT now() NOT NULL,
  primary_emotion   text    NOT NULL,
  secondary_emotion text,
  energy_level      smallint NOT NULL CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality     smallint NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
  primary_symptom   text,
  craving_state     text,
  cycle_phase       text,
  notes             text,
  oracle_reading    text,
  emotional_mix     jsonb,   -- { emotions: string[], weights: Record<string,number>, mixed_color: string }
  suggested_action  jsonb    -- { focus: string[], ritual: string }
);

-- Index for fast "latest checkin" and history queries
CREATE INDEX IF NOT EXISTS oracle_checkins_user_date
  ON public.oracle_checkins (user_id, created_at DESC);

ALTER TABLE public.oracle_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oracle_checkins_select" ON public.oracle_checkins;
DROP POLICY IF EXISTS "oracle_checkins_insert" ON public.oracle_checkins;
DROP POLICY IF EXISTS "oracle_checkins_delete" ON public.oracle_checkins;
DROP POLICY IF EXISTS "oracle_checkins_own"    ON public.oracle_checkins;

-- SELECT: solo el propio usuario
CREATE POLICY "oracle_checkins_select"
  ON public.oracle_checkins FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: solo con su propio user_id
CREATE POLICY "oracle_checkins_insert"
  ON public.oracle_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DELETE: solo sus propios registros
CREATE POLICY "oracle_checkins_delete"
  ON public.oracle_checkins FOR DELETE
  USING (auth.uid() = user_id);
