const fs = require('fs');
const seed1 = require('./seed1.js');
const seed2 = require('./seed2.js');
const seed3 = require('./seed3.js');
const seed4 = require('./seed4.js');

const allItems = [...seed1, ...seed2, ...seed3, ...seed4];

let sql = `-- ==========================================
-- CREACIÓN DE TABLA Y CONFIGURACIÓN INICIAL
-- ==========================================

-- Tabla Base
CREATE TABLE IF NOT EXISTS public.glossary (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    tagline text,
    category text,
    subcategory text,
    moods jsonb,
    image_url text,
    mind_effect text,
    longevity_effect text,
    science_summary text,
    active_compounds jsonb,
    benefits jsonb,
    synergies jsonb,
    food_mood_recipes jsonb,
    evidence_level text,
    studies jsonb,
    nutrition_facts jsonb,
    seasonal_months jsonb,
    is_premium_detail boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_glossary_slug ON public.glossary (slug);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary (category);
CREATE INDEX IF NOT EXISTS idx_glossary_moods ON public.glossary USING GIN (moods);

-- Row Level Security (RLS)
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'glossary' AND policyname = 'Public profiles are viewable by everyone.'
    ) THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON public.glossary FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'glossary' AND policyname = 'Only service_role can modify glossary'
    ) THEN
        CREATE POLICY "Only service_role can modify glossary" ON public.glossary FOR ALL USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- ==========================================
-- INSERCIÓN DE DATOS (55+ Ingredientes)
-- ==========================================

`;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

for (const item of allItems) {
  sql += `INSERT INTO public.glossary (
    name, slug, tagline, category, subcategory, moods, 
    mind_effect, longevity_effect, science_summary, active_compounds, benefits, synergies, evidence_level, seasonal_months
  ) VALUES (
    ${escapeSql(item.name)},
    ${escapeSql(item.slug)},
    ${escapeSql(item.tagline)},
    ${escapeSql(item.category)},
    ${escapeSql(item.subcategory)},
    ${escapeJson(item.moods)},
    ${escapeSql(item.mind_effect)},
    ${escapeSql(item.longevity_effect)},
    ${escapeSql(item.science_summary)},
    ${escapeJson(item.active_compounds)},
    ${escapeJson(item.benefits)},
    ${escapeJson(item.synergies)},
    ${escapeSql(item.evidence_level)},
    ${escapeJson(item.seasonal_months)}
  ) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    moods = EXCLUDED.moods,
    mind_effect = EXCLUDED.mind_effect,
    longevity_effect = EXCLUDED.longevity_effect,
    science_summary = EXCLUDED.science_summary,
    active_compounds = EXCLUDED.active_compounds,
    benefits = EXCLUDED.benefits,
    synergies = EXCLUDED.synergies,
    evidence_level = EXCLUDED.evidence_level,
    seasonal_months = EXCLUDED.seasonal_months,
    updated_at = now();\n\n`;
}

fs.writeFileSync('supabase_glossary_seed.sql', sql);
console.log('✅ Generated supabase_glossary_seed.sql with ' + allItems.length + ' entries.');
