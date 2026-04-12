-- Backup del glosario preventivo (opcional pero recomendado)
CREATE TABLE IF NOT EXISTS glossary_backup_ferments AS SELECT * FROM glossary;

-- Creación de la nueva tabla de fermentos del mundo
CREATE TABLE IF NOT EXISTS ferments_world (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  country text,
  country_code text,
  region text,
  lat float,
  lng float,
  mood text,
  tagline text,
  ferment_type text,
  teaser text,
  probiotic_strains jsonb,
  key_compounds jsonb,
  brain_connection text,
  recipe_slug text,
  glossary_slug text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE ferments_world ENABLE ROW LEVEL SECURITY;

-- Crear políticas de acceso
-- Todo el mundo puede leer el catálogo (el frontend filtrará el detalle a nivel aplicación/componente)
CREATE POLICY "Public read access" ON ferments_world FOR SELECT USING (true);

-- Solo el Service Role (Backend/NextJS API/Scripts) puede modificar
CREATE POLICY "Service role full access" ON ferments_world FOR ALL USING (auth.role() = 'service_role');

-- Crear índices para optimizar la carga del mapa interactivo
CREATE INDEX IF NOT EXISTS idx_ferments_world_slug ON ferments_world(slug);
CREATE INDEX IF NOT EXISTS idx_ferments_world_mood ON ferments_world(mood);
CREATE INDEX IF NOT EXISTS idx_ferments_world_country ON ferments_world(country);
