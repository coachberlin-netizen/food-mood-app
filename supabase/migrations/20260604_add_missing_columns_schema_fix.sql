-- Columnas faltantes detectadas en logs de Supabase (2026-06-04)

-- 1. oracle_checkins: secondary_emotion
ALTER TABLE oracle_checkins
  ADD COLUMN IF NOT EXISTS secondary_emotion text;

-- 2. oracle_checkins: patient_user_id como alias generado de user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'oracle_checkins'
      AND column_name  = 'patient_user_id'
  ) THEN
    ALTER TABLE oracle_checkins
      ADD COLUMN patient_user_id uuid GENERATED ALWAYS AS (user_id) STORED;
  END IF;
END $$;

-- 3. interoceptive_checkins: patient_user_id como alias generado de user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'interoceptive_checkins'
      AND column_name  = 'patient_user_id'
  ) THEN
    ALTER TABLE interoceptive_checkins
      ADD COLUMN patient_user_id uuid GENERATED ALWAYS AS (user_id) STORED;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_oracle_checkins_patient_user_id
  ON oracle_checkins(patient_user_id);

CREATE INDEX IF NOT EXISTS idx_interoceptive_checkins_patient_user_id
  ON interoceptive_checkins(patient_user_id);

-- 4. profiles: premium_level
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS premium_level integer NOT NULL DEFAULT 0;

-- 5. challenges: updated_at
ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE challenges SET updated_at = created_at WHERE updated_at IS NULL;

-- 6. recetas: updated_at
ALTER TABLE recetas
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE recetas SET updated_at = created_at WHERE updated_at IS NULL;
