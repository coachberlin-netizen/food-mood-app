-- ══════════════════════════════════════════════════════════════════════════════
-- Migración: Fase B conductual — extensiones de schema
-- Tools: termómetro triangulado, registro emocional mejorado, valores MI,
--        implementation intentions, JITAI nudges
-- ══════════════════════════════════════════════════════════════════════════════

-- ── 1. emotional_meal_logs: estado polivagal post-comida + cambio corporal ──
ALTER TABLE public.emotional_meal_logs
  ADD COLUMN IF NOT EXISTS post_nervous_system_state text
    CHECK (post_nervous_system_state IN (
      'ventral','sympathetic_active','sympathetic_anxious',
      'dorsal_freeze','dorsal_collapse','mixed'
    )),
  ADD COLUMN IF NOT EXISTS body_change text
    CHECK (body_change IN ('mejor','igual','peor')),
  ADD COLUMN IF NOT EXISTS pre_checkin_id uuid
    REFERENCES public.interoceptive_checkins(id) ON DELETE SET NULL;

-- ── 2. values_clarifications: guardar la conversación MI y narrativa ─────────
ALTER TABLE public.values_clarifications
  ADD COLUMN IF NOT EXISTS ai_dialogue_turns jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS narrative_vision   text;
