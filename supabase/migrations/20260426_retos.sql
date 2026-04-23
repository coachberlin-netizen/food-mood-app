-- ── challenges ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.challenges (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text    UNIQUE NOT NULL,
  title         text    NOT NULL,
  subtitle      text,
  description   text,
  category      text    NOT NULL,
  duration_days int     NOT NULL,
  price_eur     numeric NOT NULL,
  color         text    NOT NULL,
  emoji         text    NOT NULL,
  recipe_count  int     DEFAULT 0,
  audio_count   int     DEFAULT 0,
  is_active     bool    DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "challenges_select_public" ON public.challenges;
CREATE POLICY "challenges_select_public" ON public.challenges
  FOR SELECT USING (true);

-- ── user_challenges ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id      uuid REFERENCES public.challenges(id),
  start_date        date NOT NULL DEFAULT CURRENT_DATE,
  end_date          date,
  current_day       int  DEFAULT 1,
  completed         bool DEFAULT false,
  completed_at      timestamptz,
  fm_index_start    int,
  fm_index_end      int,
  paid              bool DEFAULT false,
  stripe_session_id text,
  created_at        timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_challenges_select_own" ON public.user_challenges;
CREATE POLICY "user_challenges_select_own" ON public.user_challenges
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_challenges_insert_any" ON public.user_challenges;
CREATE POLICY "user_challenges_insert_any" ON public.user_challenges
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "user_challenges_update_own" ON public.user_challenges;
CREATE POLICY "user_challenges_update_own" ON public.user_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- ── challenge_days ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.challenge_days (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES public.challenges(id),
  day_number   int  NOT NULL,
  title        text NOT NULL,
  recipe_id    uuid,
  tip          text,
  audio_url    text,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(challenge_id, day_number)
);

ALTER TABLE public.challenge_days ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "challenge_days_select_public" ON public.challenge_days;
CREATE POLICY "challenge_days_select_public" ON public.challenge_days
  FOR SELECT USING (true);

-- ── seed challenges ───────────────────────────────────────────────────────────
INSERT INTO public.challenges
  (slug, title, subtitle, description, category, duration_days, price_eur, color, emoji, recipe_count, audio_count)
VALUES
  ('mejora-tu-sueno',
   'Mejora tu sueño en 4 semanas',
   'Serotonina → melatonina. Magnesio, triptófano, fermentados nocturnos.',
   'Un protocolo de 28 días para transformar tu calidad de sueño desde la bioquímica. Cada día una receta diseñada para el eje intestino-cerebro nocturno.',
   'sueño', 28, 29, '#4A7AB5', '😴', 28, 4),
  ('recupera-tu-energia',
   'Recupera tu energía en 7 días',
   'Sin cafeína forzada, sin azúcares de rebote. Resultados medibles en 7 días.',
   'Siete días de reset energético con recetas y consejos diseñados para activar tus mitocondrias y romper el ciclo de fatiga crónica.',
   'energía', 7, 19, '#E8703A', '⚡', 30, 7),
  ('reset-antiinflamatorio',
   'Reset antiinflamatorio',
   'Cúrcuma, omega-3, fermentados. Reset completo en una semana.',
   'Siete días para reducir la inflamación sistémica con alimentos funcionales. Cúrcuma, omega-3 y fermentados como protagonistas.',
   'inflamación', 7, 19, '#5A9B8A', '🌿', 30, 7),
  ('equilibrio-hormonal-45',
   'Equilibrio hormonal — Protocolo de 28 días',
   'Perimenopausia, SOP, tiroides, estrés hormonal. Estrobioma, fitoestrógenos, urolitinas.',
   'Un programa de 28 días para equilibrar hormonas a través de la alimentación. Para la perimenopausia, desequilibrios por estrés crónico, SOP o tiroides.',
   'hormonas', 28, 29, '#C04878', '🌸', 28, 8)
ON CONFLICT (slug) DO NOTHING;
