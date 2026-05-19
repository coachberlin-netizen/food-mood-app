-- ============================================================
-- KB Bookmarks — marcadores de secciones de la enciclopedia
-- ============================================================

CREATE TABLE IF NOT EXISTS kb_bookmarks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kb_slug      text        NOT NULL,
  section_anchor text      NOT NULL,
  section_title  text      NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kb_slug, section_anchor)
);

ALTER TABLE kb_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kb_bookmarks_own" ON kb_bookmarks;

CREATE POLICY "kb_bookmarks_own"
  ON kb_bookmarks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para listado rápido por usuario
CREATE INDEX IF NOT EXISTS kb_bookmarks_user_idx ON kb_bookmarks(user_id, created_at DESC);
