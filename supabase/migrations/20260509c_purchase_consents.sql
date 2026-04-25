-- Tabla de consentimientos de compra (art. 16m Directiva 2011/83/UE)
-- Guarda la aceptación explícita de renuncia al derecho de desistimiento
-- en compras de contenido digital de acceso inmediato.

CREATE TABLE IF NOT EXISTS public.purchase_consents (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid        NOT NULL REFERENCES public.challenges(id),
  accepted_at  timestamptz NOT NULL DEFAULT now(),
  user_agent   text,
  UNIQUE (user_id, challenge_id)
);

ALTER TABLE public.purchase_consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchase_consents: select own" ON public.purchase_consents;
CREATE POLICY "purchase_consents: select own" ON public.purchase_consents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "purchase_consents: insert own" ON public.purchase_consents;
CREATE POLICY "purchase_consents: insert own" ON public.purchase_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
