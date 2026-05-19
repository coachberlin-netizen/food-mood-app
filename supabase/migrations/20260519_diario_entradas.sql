-- Diario integrado: mood + cuerpo + comida
-- Una entrada por usuario por día, campos libres para el agente

CREATE TABLE IF NOT EXISTS diario_entradas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha        date NOT NULL DEFAULT CURRENT_DATE,
  mood_id      text,               -- one of the 6 mood IDs (optional quick tag)
  estado_libre text,               -- "cómo me siento" free text
  comida_libre text,               -- "qué he comido" without weighing/measuring
  sueno_horas  numeric(3,1),       -- approximate sleep hours
  ciclo_info   text,               -- cycle day/phase, optional
  nota_libre   text,               -- free note
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (user_id, fecha)
);

ALTER TABLE diario_entradas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_diario_entradas" ON diario_entradas;
CREATE POLICY "own_diario_entradas" ON diario_entradas
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_diario_entradas_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_diario_entradas_updated_at ON diario_entradas;
CREATE TRIGGER trg_diario_entradas_updated_at
  BEFORE UPDATE ON diario_entradas
  FOR EACH ROW EXECUTE FUNCTION update_diario_entradas_updated_at();
