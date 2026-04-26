-- Permitir lectura pública de ediciones enviadas (archivo)
DROP POLICY IF EXISTS "curated_content_public_sent" ON public.curated_content;
CREATE POLICY "curated_content_public_sent"
  ON public.curated_content FOR SELECT
  USING (status = 'sent');
