-- Tabla de membresías gestionadas por Stripe
CREATE TABLE IF NOT EXISTS memberships (
  user_id                text PRIMARY KEY,
  stripe_customer_id     text NOT NULL UNIQUE,
  stripe_subscription_id text UNIQUE,
  status                 text NOT NULL,                 -- active | trialing | past_due | canceled | incomplete
  plan                   text NOT NULL,                 -- monthly | annual
  current_period_end     timestamptz,
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_memberships_subscription ON memberships(stripe_subscription_id);

-- Idempotencia de eventos Stripe (evita doble procesado)
CREATE TABLE IF NOT EXISTS stripe_events_processed (
  event_id     text PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: solo el propio usuario o el service role pueden leer/escribir
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "memberships_own_read" ON memberships;
CREATE POLICY "memberships_own_read" ON memberships
  FOR SELECT USING (auth.uid()::text = user_id);

-- stripe_events_processed: solo service role (sin RLS para usuarios)
ALTER TABLE stripe_events_processed ENABLE ROW LEVEL SECURITY;
