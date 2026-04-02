import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.RECETAS_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY
);

const raw = JSON.parse(readFileSync('./public/data/food_mood_kids_1500.json', 'utf-8'));
const recetas = raw.recetas;

console.log(`📦 Total recetas kids en JSON: ${recetas.length}`);

// Map JSON fields → exact table columns
function mapReceta(r) {
  return {
    id: r.id,
    nombre_es: r.nombre_es,
    nombre_en: r.nombre_es,
    sexo: r.sexo || 'niño',
    grupo_edad: r.grupo_edad,
    mood_es: r.mood_es,
    mood_en: r.mood_label || r.mood_es,
    capitulo: 1,
    contexto_es: `Receta kids (${r.grupo_edad})`,
    contexto_en: `Kids recipe (${r.grupo_edad})`,
    base_acida: r.base_acida || 'alcalina',
    ingredientes_es: Array.isArray(r.ingredientes)
      ? r.ingredientes.map(i => typeof i === 'string' ? i : `${i.item} — ${i.cantidad}`)
      : [],
    preparacion_es: r.preparacion || [],
    variantes_es: r.variantes || [],
    nota_food_mood_es: r.nota_gut_brain || '',
    qr_es: '',
    qr_en: '',
    tags: r.tags || [],
    tiempo_preparacion_min: r.tiempo_minutos || 15,
    dificultad: 'fácil',
    temporada: 'todo el año',
    tipo_plato: r.tipo_plato || 'plato principal',
    premium_level: r.premium_level ?? 1,
    segmento: r.segmento || 'kids',
  };
}

const BATCH = 50;
let inserted = 0;
let errors = 0;

for (let i = 0; i < recetas.length; i += BATCH) {
  const batch = recetas.slice(i, i + BATCH).map(mapReceta);
  const { error } = await supabase
    .from('recetas')
    .upsert(batch, { onConflict: 'id' });

  if (error) {
    console.error(`❌ Batch ${Math.floor(i / BATCH) + 1}: ${error.message}`);
    // Show first record for debug
    if (errors === 0) {
      console.error('First record keys:', Object.keys(batch[0]));
    }
    errors++;
  } else {
    inserted += batch.length;
    process.stdout.write(`✅ ${inserted}/${recetas.length}\r`);
  }
}

console.log(`\n\n🏁 Insertadas: ${inserted} | Errores: ${errors}`);

// Verify count
const { count } = await supabase
  .from('recetas')
  .select('*', { count: 'exact', head: true })
  .eq('premium_level', 1);

console.log(`🔍 recetas premium_level=1: ${count}`);

const { count: totalCount } = await supabase
  .from('recetas')
  .select('*', { count: 'exact', head: true });

console.log(`🔍 Total recetas en Supabase: ${totalCount}`);
