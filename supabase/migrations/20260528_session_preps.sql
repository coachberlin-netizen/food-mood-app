CREATE TABLE IF NOT EXISTS public.session_preps (
  id                    uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at            timestamptz DEFAULT now() NOT NULL,
  professional_id       uuid        NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  patient_user_id       uuid        NOT NULL,
  period_start          date        NOT NULL,
  period_end            date        NOT NULL,
  weekly_summary        text,
  key_patterns          jsonb       DEFAULT '[]'::jsonb NOT NULL,
  suggested_questions   jsonb       DEFAULT '[]'::jsonb NOT NULL,
  intervention_points   jsonb       DEFAULT '[]'::jsonb NOT NULL,
  professional_notes    text,
  model_used            text        NOT NULL DEFAULT 'claude-sonnet-4-6'
);

ALTER TABLE public.session_preps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional can manage own session_preps" ON public.session_preps;
CREATE POLICY "professional can manage own session_preps"
  ON public.session_preps
  FOR ALL
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_session_preps_professional
  ON public.session_preps(professional_id, patient_user_id, created_at DESC);
