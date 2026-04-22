-- ── reto_purchases ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reto_purchases (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id           uuid REFERENCES public.challenges(id) ON DELETE CASCADE,
  stripe_session_id      text UNIQUE,
  stripe_payment_intent  text,
  amount_eur             decimal(10,2),
  status                 text DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'cancelled')),
  purchased_at           timestamptz DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_reto_purchases_user      ON public.reto_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_reto_purchases_challenge ON public.reto_purchases(challenge_id);

ALTER TABLE public.reto_purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reto_purchases_select_own" ON public.reto_purchases;
CREATE POLICY "reto_purchases_select_own" ON public.reto_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- ── reto_informes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reto_informes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE,
  informe      jsonb NOT NULL,
  generated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

ALTER TABLE public.reto_informes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reto_informes_all_own" ON public.reto_informes;
CREATE POLICY "reto_informes_all_own" ON public.reto_informes
  FOR ALL USING (auth.uid() = user_id);

-- ── Helper: verificar acceso a un reto ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.has_reto_access(p_user_id uuid, p_challenge_id uuid)
RETURNS boolean AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.challenges
    WHERE id = p_challenge_id AND (is_premium IS NULL OR is_premium = false)
  ) THEN RETURN true; END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.reto_purchases
    WHERE user_id    = p_user_id
      AND challenge_id = p_challenge_id
      AND status     = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
