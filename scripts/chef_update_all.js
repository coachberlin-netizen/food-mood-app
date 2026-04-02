const { createClient } = require('@supabase/supabase-js');
const { RECIPES } = require('./new_recipes_data');

const supabase = createClient(
  'https://hbiraafgjshhyjhpbqty.supabase.co',
  process.env.RECETAS_SUPABASE_KEY
);

async function run() {
  // 1. Fetch ALL remaining with chef_inspiracion NOT NULL
  const { data: existing } = await supabase
    .from('recetas')
    .select('id, mood_es')
    .not('chef_inspiracion', 'is', null)
    .order('id');

  if (!existing) { console.error('No data'); return; }
  console.log(`Remaining to update: ${existing.length}`);

  // 2. Group new recipes by mood (only use unused ones)
  const newByMood = {};
  RECIPES.forEach(r => {
    if (!newByMood[r.mood_es]) newByMood[r.mood_es] = [];
    newByMood[r.mood_es].push(r);
  });

  // Track which new recipes have been used (index per mood)
  const usedIdx = {};

  // 3. Check which new recipes are already in the DB (from previous run)
  for (const [mood, pool] of Object.entries(newByMood)) {
    usedIdx[mood] = 0;
    for (const recipe of pool) {
      const { data: exists } = await supabase
        .from('recetas')
        .select('id')
        .eq('nombre_es', recipe.nombre_es)
        .limit(1);
      if (exists && exists.length > 0) {
        usedIdx[mood]++;
      } else {
        break; // first unused recipe for this mood
      }
    }
    console.log(`  ${mood}: starting at index ${usedIdx[mood]}/${pool.length}`);
  }

  // 4. Assign and update
  let updated = 0;
  let skipped = 0;
  for (const old of existing) {
    const pool = newByMood[old.mood_es];
    const idx = usedIdx[old.mood_es] || 0;

    if (!pool || idx >= pool.length) {
      console.log(`  SKIP ${old.id}: no more recipes for "${old.mood_es}" (idx=${idx})`);
      skipped++;
      continue;
    }

    const recipe = pool[idx];
    usedIdx[old.mood_es] = idx + 1;

    const { error } = await supabase
      .from('recetas')
      .update({
        nombre_es: recipe.nombre_es,
        nombre_en: recipe.nombre_en,
        chef_inspiracion: null,
      })
      .eq('id', old.id);

    if (error) {
      console.error(`  ERR ${old.id}:`, error.message);
    } else {
      updated++;
    }
  }

  console.log(`\nUpdated: ${updated}, Skipped: ${skipped}`);

  // 5. Final verification
  const { data: check } = await supabase
    .from('recetas')
    .select('id')
    .not('chef_inspiracion', 'is', null);
  console.log(`Remaining with chef_inspiracion NOT NULL: ${check?.length || 0}`);
}

run();
