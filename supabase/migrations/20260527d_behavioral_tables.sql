-- ══════════════════════════════════════════════════════════════════════════════
-- Migración: tablas conductuales avanzadas — Fase A (Prompt 5)
-- Frameworks: Barrett (granularidad), Porges (polivagal), Hayes (ACT),
--             Neff (autocompasión), Gollwitzer (implementation intentions)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. interoceptive_checkins ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.interoceptive_checkins (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at             timestamptz NOT NULL DEFAULT now(),
  nervous_system_state  text        NOT NULL,
  secondary_state       text,
  body_locations        jsonb       NOT NULL DEFAULT '[]'::jsonb,
  interoceptive_clarity int         NOT NULL CHECK (interoceptive_clarity BETWEEN 0 AND 10),
  dominant_sensation    text,
  pre_meal              boolean     NOT NULL DEFAULT false,

  CONSTRAINT chk_ic_nss CHECK (nervous_system_state IN (
    'ventral','sympathetic_active','sympathetic_anxious',
    'dorsal_freeze','dorsal_collapse','mixed'
  )),
  CONSTRAINT chk_ic_secondary CHECK (
    secondary_state IS NULL OR secondary_state IN (
      'ventral','sympathetic_active','sympathetic_anxious',
      'dorsal_freeze','dorsal_collapse'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_ic_user_logged ON public.interoceptive_checkins (user_id, logged_at DESC);

ALTER TABLE public.interoceptive_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ic_patient_all" ON public.interoceptive_checkins;
CREATE POLICY "ic_patient_all" ON public.interoceptive_checkins
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "ic_professional_select" ON public.interoceptive_checkins;
CREATE POLICY "ic_professional_select" ON public.interoceptive_checkins
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── 2. emotion_granularity_logs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.emotion_granularity_logs (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at            timestamptz NOT NULL DEFAULT now(),
  initial_emotion_word text        NOT NULL,
  final_emotion_words  text[]      NOT NULL DEFAULT '{}',
  granularity_score    int         NOT NULL CHECK (granularity_score BETWEEN 1 AND 5),
  context              text,
  ai_dialogue_turns    jsonb       NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_egl_user_logged ON public.emotion_granularity_logs (user_id, logged_at DESC);

ALTER TABLE public.emotion_granularity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "egl_patient_all" ON public.emotion_granularity_logs;
CREATE POLICY "egl_patient_all" ON public.emotion_granularity_logs
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "egl_professional_select" ON public.emotion_granularity_logs;
CREATE POLICY "egl_professional_select" ON public.emotion_granularity_logs
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── 3. socratic_dialogues ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.socratic_dialogues (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at                timestamptz NOT NULL DEFAULT now(),
  ended_at                  timestamptz,
  initial_thought           text        NOT NULL,
  conversation              jsonb       NOT NULL DEFAULT '[]'::jsonb,
  final_alternative_thought text,
  emotion_before            text,
  emotion_after             text,
  intensity_before          int         CHECK (intensity_before BETWEEN 1 AND 10),
  intensity_after           int         CHECK (intensity_after BETWEEN 1 AND 10),
  techniques_used           text[]      NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_sd_user_started ON public.socratic_dialogues (user_id, started_at DESC);

ALTER TABLE public.socratic_dialogues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sd_patient_all" ON public.socratic_dialogues;
CREATE POLICY "sd_patient_all" ON public.socratic_dialogues
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "sd_professional_select" ON public.socratic_dialogues;
CREATE POLICY "sd_professional_select" ON public.socratic_dialogues
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── 4. implementation_intentions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.implementation_intentions (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  trigger_situation text        NOT NULL,
  intended_action   text        NOT NULL,
  linked_value      text,
  times_triggered   int         NOT NULL DEFAULT 0,
  times_completed   int         NOT NULL DEFAULT 0,
  is_active         boolean     NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_ii_user_active ON public.implementation_intentions (user_id, is_active);

ALTER TABLE public.implementation_intentions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ii_patient_all" ON public.implementation_intentions;
CREATE POLICY "ii_patient_all" ON public.implementation_intentions
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "ii_professional_select" ON public.implementation_intentions;
CREATE POLICY "ii_professional_select" ON public.implementation_intentions
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── 5. adaptive_nudges_log ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.adaptive_nudges_log (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_at     timestamptz NOT NULL DEFAULT now(),
  delivered_at     timestamptz,
  opened_at        timestamptz,
  pattern_detected text        NOT NULL,
  nudge_type       text        NOT NULL,
  nudge_content    text        NOT NULL,
  action_taken     boolean     NOT NULL DEFAULT false,
  action_type      text
);

CREATE INDEX IF NOT EXISTS idx_anl_user_generated ON public.adaptive_nudges_log (user_id, generated_at DESC);

ALTER TABLE public.adaptive_nudges_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anl_patient_all" ON public.adaptive_nudges_log;
CREATE POLICY "anl_patient_all" ON public.adaptive_nudges_log
  FOR ALL TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "anl_professional_select" ON public.adaptive_nudges_log;
CREATE POLICY "anl_professional_select" ON public.adaptive_nudges_log
  FOR SELECT TO authenticated
  USING (is_linked_professional(user_id));

-- ── 6. Extender hunger_thermometer_logs ───────────────────────────────────────
ALTER TABLE public.hunger_thermometer_logs
  ADD COLUMN IF NOT EXISTS interoceptive_clarity int
  CHECK (interoceptive_clarity BETWEEN 0 AND 10);
