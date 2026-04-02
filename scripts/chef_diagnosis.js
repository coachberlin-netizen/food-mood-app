const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://hbiraafgjshhyjhpbqty.supabase.co',
  process.env.RECETAS_SUPABASE_KEY
);

async function diagnose() {
  // 1. Get all recipes with chef_inspiracion NOT NULL
  const { data: allChef, count } = await supabase
    .from('recetas')
    .select('id, nombre_es, nombre_en, mood_es, segmento, premium_level, dificultad, tiempo_preparacion_min, chef_inspiracion, tipo_plato, temporada, grupo_edad, sexo', { count: 'exact' })
    .not('chef_inspiracion', 'is', null)
    .order('id');

  console.log(`Total with chef_inspiracion NOT NULL: ${allChef?.length || 0}`);

  // 2. Find duplicates
  const nameCount = {};
  allChef?.forEach(r => {
    nameCount[r.nombre_es] = (nameCount[r.nombre_es] || 0) + 1;
  });
  const duplicates = Object.entries(nameCount).filter(([, c]) => c > 1);
  console.log(`\nDuplicate names: ${duplicates.length}`);
  duplicates.forEach(([name, c]) => console.log(`  [${c}x] ${name}`));

  // 3. Find still containing real chef names
  const chefPatterns = ['Adrià', 'Adria', 'Robuchon', 'Arzak', 'Blumenthal', 'Roca', 'Ducasse', 'Bocuse', 'Ferran', 'Bottura', 'Redzepi', 'Muñoz', 'Keller', 'Ramsay', 'Aduriz'];
  const withRealNames = allChef?.filter(r => 
    chefPatterns.some(p => r.nombre_es?.includes(p))
  );
  console.log(`\nStill with real chef names: ${withRealNames?.length || 0}`);
  withRealNames?.forEach(r => console.log(`  ${r.id}: ${r.nombre_es}`));

  // 4. Unique mood_es values
  const moods = [...new Set(allChef?.map(r => r.mood_es))];
  console.log(`\nMood distribution:`);
  moods.forEach(m => {
    const c = allChef?.filter(r => r.mood_es === m).length;
    console.log(`  ${m}: ${c}`);
  });

  // 5. Unique chef_inspiracion values
  const chefs = [...new Set(allChef?.map(r => r.chef_inspiracion))];
  console.log(`\nchef_inspiracion values:`);
  chefs.forEach(c => {
    const cnt = allChef?.filter(r => r.chef_inspiracion === c).length;
    console.log(`  ${c}: ${cnt}`);
  });

  // Save full list
  fs.writeFileSync('scripts/chef_recipes_full.json', JSON.stringify(allChef, null, 2), 'utf8');
  console.log('\nFull list saved to scripts/chef_recipes_full.json');
}

diagnose();
