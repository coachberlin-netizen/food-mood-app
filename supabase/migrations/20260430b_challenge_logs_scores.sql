-- Añadir scores opcionales al registro diario
ALTER TABLE public.challenge_logs
  ADD COLUMN IF NOT EXISTS energia_score int CHECK (energia_score BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS animo_score   int CHECK (animo_score   BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_challenge_logs_user      ON public.challenge_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_logs_challenge ON public.challenge_logs(challenge_id);
