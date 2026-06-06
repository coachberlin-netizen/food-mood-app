-- Add challenge_id FK to clinical_protocols and migrate existing retos as protocol rows.
-- This links reto content (served via challenge_days) to clinical_protocols without duplicating data.

ALTER TABLE public.clinical_protocols
  ADD COLUMN IF NOT EXISTS challenge_id UUID REFERENCES public.challenges(id);

-- Migrate 6 existing retos as protocol entries.
-- Content is served from challenge_days via the FK — no duplication.

INSERT INTO public.clinical_protocols (name, slug, description, duration_days, stages, is_active, challenge_id)
SELECT
  c.title,
  c.slug,
  COALESCE(c.description, ''),
  c.duration_days,
  '[]'::jsonb,
  true,
  c.id
FROM public.challenges c
WHERE c.slug IN (
  'activa-tu-longevidad',
  'equilibrio-hormonal-45',
  'microhabitos',
  'recupera-tu-energia',
  'reset-antiinflamatorio',
  'slow-food-mood'
)
ON CONFLICT (slug) DO NOTHING;
