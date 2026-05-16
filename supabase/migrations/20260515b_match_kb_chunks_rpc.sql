-- ============================================================
-- Agente Food·Mood — RPC: búsqueda vectorial en la KB
-- ============================================================
-- Llamada desde rag.ts: supabase.rpc('match_kb_chunks', {...})

CREATE OR REPLACE FUNCTION match_kb_chunks(
  query_embedding    vector(1024),
  chunk_type_filter  text    DEFAULT NULL,
  match_count        integer DEFAULT 5
)
RETURNS TABLE (
  id          uuid,
  content     text,
  source      text,
  chunk_type  text,
  similarity  float
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    id,
    content,
    source,
    chunk_type,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base_chunks
  WHERE
    chunk_type_filter IS NULL
    OR chunk_type = chunk_type_filter
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Acceso público: cualquier rol autenticado puede llamar la función
GRANT EXECUTE ON FUNCTION match_kb_chunks TO authenticated;
GRANT EXECUTE ON FUNCTION match_kb_chunks TO service_role;
