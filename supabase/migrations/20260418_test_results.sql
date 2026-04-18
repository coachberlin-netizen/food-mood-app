-- Migration: create test_results table for the color-based emotional state test
CREATE TABLE IF NOT EXISTS public.test_results (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  UUID         NOT NULL,
  energia     INTEGER      NOT NULL CHECK (energia  BETWEEN 0 AND 100),
  animo       INTEGER      NOT NULL CHECK (animo    BETWEEN 0 AND 100),
  tension     INTEGER      NOT NULL CHECK (tension  BETWEEN 0 AND 100),
  conexion    INTEGER      NOT NULL CHECK (conexion BETWEEN 0 AND 100),
  claridad    INTEGER      NOT NULL CHECK (claridad BETWEEN 0 AND 100),
  color_hex   VARCHAR(7)   NOT NULL,
  state_name  VARCHAR(50)  NOT NULL,
  subemocion_1 VARCHAR(50),
  subpct_1     INTEGER,
  subemocion_2 VARCHAR(50),
  subpct_2     INTEGER,
  subemocion_3 VARCHAR(50),
  subpct_3     INTEGER,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert results"
  ON public.test_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own results"
  ON public.test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS test_results_user_created
  ON public.test_results (user_id, created_at DESC);
