-- ============================================================
-- KB Documents — rastreo de documentos ingestados (idempotencia)
-- ============================================================
-- knowledge_base_chunks ya existe; esta tabla añade tracking
-- a nivel de documento para re-ingestas atómicas.

CREATE TABLE IF NOT EXISTS kb_documents (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  kb          text        NOT NULL CHECK (kb IN ('food-mood', 'longevity')),
  source      text        NOT NULL,
  title       text,
  metadata    jsonb       NOT NULL DEFAULT '{}',
  ingested_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kb, source)
);

-- Sólo service_role puede escribir; cualquier rol autenticado puede leer
ALTER TABLE kb_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kb_documents_read_all"      ON kb_documents;
DROP POLICY IF EXISTS "kb_documents_write_service" ON kb_documents;

CREATE POLICY "kb_documents_read_all"
  ON kb_documents FOR SELECT USING (true);

CREATE POLICY "kb_documents_write_service"
  ON kb_documents FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
