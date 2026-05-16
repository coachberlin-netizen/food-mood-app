-- Migración: tablas de conexiones y muestras de biomarcadores
-- Tokens almacenados como TEXT (base64 de IV + authTag + ciphertext cifrado AES-256-GCM)

-- ─────────────────────────────────────────
-- Tabla: biomarker_connections
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS biomarker_connections (
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider        text NOT NULL CHECK (provider IN ('oura', 'whoop', 'fitbit', 'healthkit', 'googlefit')),
  access_token    text NOT NULL,
  refresh_token   text,
  expires_at      timestamptz,
  scopes          text[] DEFAULT '{}',
  connected_at    timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider)
);

-- ─────────────────────────────────────────
-- Tabla: biomarker_samples
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS biomarker_samples (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider    text NOT NULL,
  type        text NOT NULL,
  value       numeric NOT NULL,
  unit        text NOT NULL,
  measured_at timestamptz NOT NULL,
  ingested_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS biomarker_samples_user_type
  ON biomarker_samples (user_id, type, measured_at DESC);

-- ─────────────────────────────────────────
-- RLS: biomarker_connections
-- ─────────────────────────────────────────
ALTER TABLE biomarker_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "biomarker_connections_service_all" ON biomarker_connections;
CREATE POLICY "biomarker_connections_service_all"
  ON biomarker_connections FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "biomarker_connections_own_read" ON biomarker_connections;
CREATE POLICY "biomarker_connections_own_read"
  ON biomarker_connections FOR SELECT
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- RLS: biomarker_samples
-- ─────────────────────────────────────────
ALTER TABLE biomarker_samples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "biomarker_samples_service_insert" ON biomarker_samples;
CREATE POLICY "biomarker_samples_service_insert"
  ON biomarker_samples FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "biomarker_samples_service_read" ON biomarker_samples;
CREATE POLICY "biomarker_samples_service_read"
  ON biomarker_samples FOR SELECT
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "biomarker_samples_own_read" ON biomarker_samples;
CREATE POLICY "biomarker_samples_own_read"
  ON biomarker_samples FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger para updated_at en biomarker_connections
CREATE OR REPLACE FUNCTION touch_biomarker_connections_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS biomarker_connections_updated_at ON biomarker_connections;
CREATE TRIGGER biomarker_connections_updated_at
  BEFORE UPDATE ON biomarker_connections
  FOR EACH ROW EXECUTE FUNCTION touch_biomarker_connections_updated_at();
