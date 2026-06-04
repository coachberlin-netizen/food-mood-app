-- 1. Add secondary_emotion to oracle_checkins (was never applied)
ALTER TABLE public.oracle_checkins
  ADD COLUMN IF NOT EXISTS secondary_emotion text;

-- 2. Allow professionals to read their linked patients' oracle_checkins
DROP POLICY IF EXISTS "oracle_checkins_professional_select" ON public.oracle_checkins;
CREATE POLICY "oracle_checkins_professional_select"
  ON public.oracle_checkins
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- 3. Add updated_at to recetas (used by sitemap)
ALTER TABLE public.recetas
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 4. Add updated_at to challenges (used by sitemap)
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
