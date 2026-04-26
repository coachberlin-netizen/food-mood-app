-- Asegurar que status y sent_at existen (pueden ya estar si se ejecutó 20260506)
ALTER TABLE public.curated_content
  ADD COLUMN IF NOT EXISTS status  text        NOT NULL DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_curated_content_queue
  ON public.curated_content (status, week_start);

-- Reemplazar la política pública amplia por una que solo expone ítems enviados
DROP POLICY IF EXISTS "curated_content_select_public" ON public.curated_content;
DROP POLICY IF EXISTS "curated_content_public_sent"   ON public.curated_content;
CREATE POLICY "curated_content_public_sent"
  ON public.curated_content FOR SELECT
  USING (status = 'sent');
