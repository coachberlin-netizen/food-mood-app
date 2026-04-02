const { createClient } = require('@supabase/supabase-js');
const { RECIPES } = require('./new_recipes_data');

const supabase = createClient(
  'https://hbiraafgjshhyjhpbqty.supabase.co',
  process.env.RECETAS_SUPABASE_KEY
);

const BLOCK_SIZE = 20;
const DRY_RUN = process.argv.includes('--dry-run');
const BLOCK_NUM = parseInt(process.argv.find(a => a.startsWith('--block='))?.split('=')[1] || '0');

async function run() {
  // 1. Fetch all 200 IDs with chef_inspiracion
  const { data: existing } = await supabase
    .from('recetas')
    .select('id, mood_es, segmento, premium_level, dificultad, tiempo_preparacion_min, tipo_plato, temporada, grupo_edad, sexo')
    .not('chef_inspiracion', 'is', null)
    .order('id');

  if (!existing) { console.error('No data'); return; }
  console.log(`Total existing: ${existing.length}, New recipes: ${RECIPES.length}`);

  // 2. Group new recipes by mood
  const newByMood = {};
  RECIPES.forEach(r => {
    if (!newByMood[r.mood_es]) newByMood[r.mood_es] = [];
    newByMood[r.mood_es].push({ ...r, used: false });
  });

  // 3. Create assignment: match each existing recipe to a new one with same mood
  const assignments = [];
  const moodCounters = {};

  for (const old of existing) {
    const pool = newByMood[old.mood_es];
    if (!moodCounters[old.mood_es]) moodCounters[old.mood_es] = 0;
    const idx = moodCounters[old.mood_es];

    if (pool && idx < pool.length) {
      assignments.push({ old, new_recipe: pool[idx] });
      moodCounters[old.mood_es]++;
    } else {
      console.error(`NO RECIPE for mood "${old.mood_es}" (need index ${idx})`);
      assignments.push({ old, new_recipe: null });
    }
  }

  // Stats
  console.log('\nMood coverage:');
  for (const [mood, pool] of Object.entries(newByMood)) {
    const needed = existing.filter(e => e.mood_es === mood).length;
    console.log(`  ${mood}: ${pool.length} available, ${needed} needed ${pool.length >= needed ? 'OK' : 'SHORTFALL!'}`);
  }

  // 4. Process block
  const start = BLOCK_NUM * BLOCK_SIZE;
  const end = Math.min(start + BLOCK_SIZE, assignments.length);
  const block = assignments.slice(start, end);

  console.log(`\n=== BLOCK ${BLOCK_NUM} (rows ${start}-${end-1}) ===`);

  let successCount = 0;
  for (const { old, new_recipe } of block) {
    if (!new_recipe) {
      console.log(`  SKIP ${old.id}: no matching recipe for mood "${old.mood_es}"`);
      continue;
    }

    const updates = {
      nombre_es: new_recipe.nombre_es,
      nombre_en: new_recipe.nombre_en,
      chef_inspiracion: null,
    };

    if (DRY_RUN) {
      console.log(`  [DRY] ${old.id} (${old.mood_es}): "${new_recipe.nombre_es}"`);
      successCount++;
    } else {
      const { error } = await supabase
        .from('recetas')
        .update(updates)
        .eq('id', old.id);

      if (error) {
        console.error(`  ERR ${old.id}:`, error.message);
      } else {
        console.log(`  OK ${old.id}: "${new_recipe.nombre_es}"`);
        successCount++;
      }
    }
  }

  console.log(`\nBlock ${BLOCK_NUM}: ${successCount}/${block.length} processed`);

  if (end >= assignments.length) {
    console.log('\n=== ALL BLOCKS COMPLETE ===');
    if (!DRY_RUN) {
      const { data: check } = await supabase
        .from('recetas')
        .select('id')
        .not('chef_inspiracion', 'is', null);
      console.log(`Remaining with chef_inspiracion NOT NULL: ${check?.length || 0}`);
    }
  } else {
    console.log(`Next: --block=${BLOCK_NUM + 1}`);
  }
}

run();
