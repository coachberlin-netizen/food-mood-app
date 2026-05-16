-- ============================================================
-- Agente Food·Mood — Fase 0: tablas e índices de infraestructura
-- ============================================================

-- 1. pgvector (voyage-3 usa 1024 dims)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Chunks de las bases de conocimiento (RAG)
CREATE TABLE IF NOT EXISTS knowledge_base_chunks (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  content     TEXT        NOT NULL,
  embedding   vector(1024),
  source      TEXT        NOT NULL,            -- ej. "foodmood/cap3_fermentacion.md"
  chunk_type  TEXT        NOT NULL CHECK (chunk_type IN ('foodmood', 'longevidad')),
  metadata    JSONB       DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice IVFFlat para búsqueda ANN; ajustar lists si el corpus crece > 100 k filas
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx
  ON knowledge_base_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 3. Log de interacciones — observabilidad + cupo mensual
CREATE TABLE IF NOT EXISTS agent_interactions (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tokens_in       INTEGER,
  tokens_out      INTEGER,
  cost_eur        NUMERIC(10, 6),
  latency_ms      INTEGER,
  model           TEXT,
  modo            TEXT,
  nivel_evidencia TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agent_interactions_user_month_idx
  ON agent_interactions (user_id, created_at DESC);

-- 4. Perfil de salud del usuario
CREATE TABLE IF NOT EXISTS user_health_profile (
  user_id                  UUID     REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  edad                     INTEGER,
  sexo                     TEXT,
  pais                     TEXT     DEFAULT 'ES',
  alergias                 TEXT[]   DEFAULT '{}',
  intolerancias            TEXT[]   DEFAULT '{}',
  medicacion               TEXT[]   DEFAULT '{}',
  condiciones              TEXT[]   DEFAULT '{}',
  embarazo_lactancia       BOOLEAN  DEFAULT FALSE,
  restricciones_dieteticas TEXT[]   DEFAULT '{}',
  objetivos_longevidad     TEXT[]   DEFAULT '{}',
  habitos_ayuno            TEXT,
  onboarding_completado    BOOLEAN  DEFAULT FALSE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS user_health_profile_updated_at ON user_health_profile;
CREATE TRIGGER user_health_profile_updated_at
  BEFORE UPDATE ON user_health_profile
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE knowledge_base_chunks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kb_chunks_read_all"        ON knowledge_base_chunks;
DROP POLICY IF EXISTS "kb_chunks_write_service"   ON knowledge_base_chunks;
CREATE POLICY "kb_chunks_read_all"      ON knowledge_base_chunks FOR SELECT USING (true);
CREATE POLICY "kb_chunks_write_service" ON knowledge_base_chunks FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_interactions_own"    ON agent_interactions;
DROP POLICY IF EXISTS "agent_interactions_service" ON agent_interactions;
CREATE POLICY "agent_interactions_own"     ON agent_interactions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "agent_interactions_service" ON agent_interactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

ALTER TABLE user_health_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_health_profile_own" ON user_health_profile;
CREATE POLICY "user_health_profile_own" ON user_health_profile FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role puede leer perfiles para el agente
DROP POLICY IF EXISTS "user_health_profile_service_read" ON user_health_profile;
CREATE POLICY "user_health_profile_service_read" ON user_health_profile FOR SELECT
  USING (auth.role() = 'service_role');
