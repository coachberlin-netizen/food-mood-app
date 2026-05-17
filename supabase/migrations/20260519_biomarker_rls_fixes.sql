-- Fixes post-audit:
-- 1. Política UPDATE para biomarker_connections (el trigger updated_at la necesita)
-- 2. Constraint único en biomarker_samples para evitar duplicados en sync

-- ─────────────────────────────────────────
-- UPDATE policy en biomarker_connections
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "biomarker_connections_own_update" ON biomarker_connections;
CREATE POLICY "biomarker_connections_own_update"
  ON biomarker_connections FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.uid() = user_id)
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- ─────────────────────────────────────────
-- Unique constraint en biomarker_samples (permite ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────
ALTER TABLE biomarker_samples
  DROP CONSTRAINT IF EXISTS biomarker_samples_dedup;

ALTER TABLE biomarker_samples
  ADD CONSTRAINT biomarker_samples_dedup
  UNIQUE (user_id, provider, type, measured_at);
