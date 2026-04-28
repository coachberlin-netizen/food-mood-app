CREATE TABLE IF NOT EXISTS public.oracle_checkins (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at       timestamptz DEFAULT now() NOT NULL,
  primary_emotion  text NOT NULL,
  energy_level     smallint NOT NULL CHECK (energy_level BETWEEN 1 AND 10),
  sleep_quality    smallint NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
  primary_symptom  text,
  craving_state    text,
  cycle_phase      text,
  notes            text,
  oracle_reading   text,
  suggested_action jsonb
);

ALTER TABLE public.oracle_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oracle_checkins_own" ON public.oracle_checkins;
CREATE POLICY "oracle_checkins_own"
  ON public.oracle_checkins
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
