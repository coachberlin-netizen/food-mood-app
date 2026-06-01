-- Professional attention flags: deterministic signal system for clinical patterns
-- No ML — all rules are explicit SQL/business logic (Art. 50 EU AI Act compliance)
-- Flags are ONLY visible to professionals; patients have zero access

CREATE TABLE IF NOT EXISTS professional_attention_flags (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id  UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  patient_user_id  UUID        NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  flag_type        TEXT        NOT NULL CHECK (flag_type IN (
    'guilt_language_pattern',
    'persistent_low_energy_state',
    'recurring_elevated_anxiety',
    'persistent_body_disconnection',
    'repeated_emotional_eating_episodes',
    'restriction_signals',
    'multiple_distress_indicators'
  )),
  severity         TEXT        NOT NULL CHECK (severity IN ('soft', 'moderate')),
  evidence         JSONB       NOT NULL DEFAULT '{}',
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  detected_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at      TIMESTAMPTZ,
  dismissed_at     TIMESTAMPTZ,
  dismissed_by     UUID        REFERENCES auth.users(id)
);

-- One active flag per patient+type combination
CREATE UNIQUE INDEX professional_attention_flags_active_unique
  ON professional_attention_flags (patient_user_id, flag_type)
  WHERE is_active = TRUE;

CREATE INDEX professional_attention_flags_pro_idx
  ON professional_attention_flags (professional_id, is_active, detected_at DESC);

CREATE INDEX professional_attention_flags_patient_idx
  ON professional_attention_flags (patient_user_id, is_active);

-- RLS: professionals see and update only their own patients' flags
ALTER TABLE professional_attention_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "paf_select" ON professional_attention_flags;
CREATE POLICY "paf_select" ON professional_attention_flags
  FOR SELECT USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "paf_update" ON professional_attention_flags;
CREATE POLICY "paf_update" ON professional_attention_flags
  FOR UPDATE USING (professional_id = auth.uid());

-- INSERT / DELETE are service_role only (cron detection runs server-side)
