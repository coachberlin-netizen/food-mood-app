-- SQL Migration for Phase 2: Emotional Palettes
-- Description: Creates the table to store results from the new interactive palette sliders.

CREATE TABLE IF NOT EXISTS emotional_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  energia integer NOT NULL CHECK (energia >= 0 AND energia <= 10),
  serenidad integer NOT NULL CHECK (serenidad >= 0 AND serenidad <= 10),
  claridad integer NOT NULL CHECK (claridad >= 0 AND claridad <= 10),
  conexion integer NOT NULL CHECK (conexion >= 0 AND conexion <= 10),
  mood_dominante text NOT NULL,
  mood_secundario text,
  color_resultado text,
  recetas_sugeridas jsonb,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emotional_palettes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users read own palettes"
  ON emotional_palettes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own palettes"
  ON emotional_palettes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access"
  ON emotional_palettes FOR ALL
  USING (auth.role() = 'service_role');

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_palettes_user ON emotional_palettes(user_id);
CREATE INDEX IF NOT EXISTS idx_palettes_date ON emotional_palettes(created_at);
CREATE INDEX IF NOT EXISTS idx_palettes_session_date ON emotional_palettes(user_id, session_date);
