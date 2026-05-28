-- Tabla de solicitudes de acceso anticipado para profesionales (Food·Mood Pro B2B)
CREATE TABLE IF NOT EXISTS public.early_access_requests (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      timestamptz DEFAULT now() NOT NULL,
  name            text        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email           text        NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  professional_type text      NOT NULL,
  patient_count   text,
  current_tool    text,
  status          text        DEFAULT 'pending' NOT NULL
                              CHECK (status IN ('pending','contacted','onboarded','declined')),
  notes           text
);

ALTER TABLE public.early_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon can insert early_access_requests" ON public.early_access_requests;
CREATE POLICY "anon can insert early_access_requests"
  ON public.early_access_requests
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_early_access_created_at
  ON public.early_access_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_early_access_status
  ON public.early_access_requests(status);
