require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAPPING = {
  'Calma': 'calma',
  'Focus': 'focus',
  'Reset': 'reset',
  'Energía': 'activacion',
  'Fuerza': 'activacion'
};

async function previewAndNormalize() {
  const { data: ingredients, error } = await supabase
    .from('glossary')
    .select('id, name, moods');

  if (error) {
    console.error('Error fetching glossary:', error);
    return;
  }

  const updates = [];

  ingredients.forEach(item => {
    if (!item.moods || !Array.isArray(item.moods)) return;

    let changed = false;
    const newMoods = item.moods.map(m => {
      if (MAPPING[m]) {
        changed = true;
        return MAPPING[m];
      }
      return m;
    });

    // Remove duplicates
    const finalMoods = [...new Set(newMoods)];
    if (finalMoods.length !== item.moods.length) changed = true;

    if (changed) {
      updates.push({
        id: item.id,
        name: item.name,
        old: item.moods,
        new: finalMoods
      });
    }
  });

  console.log('--- PREVIEW DE ACTUALIZACIONES ---');
  console.log(`Se actualizarán ${updates.length} ingredientes.`);
  updates.forEach(u => {
    console.log(`- ${u.name}: [${u.old.join(', ')}] -> [${u.new.join(', ')}]`);
  });

  // Solo ejecutar si se pasa el flag --execute
  if (process.argv.includes('--execute')) {
    console.log('\n--- EJECUTANDO ACTUALIZACIONES ---');
    let count = 0;
    for (const u of updates) {
      const { error: updateErr } = await supabase
        .from('glossary')
        .update({ moods: u.new })
        .eq('id', u.id);
      
      if (updateErr) {
        console.error(`Error actualizando ${u.name}:`, updateErr);
      } else {
        count++;
      }
    }
    console.log(`\nÉXITO: Se han actualizado ${count} filas.`);
  } else {
    console.log('\nPara ejecutar los cambios, corre: node scripts/normalize_glossary_moods.cjs --execute');
  }
}

previewAndNormalize();
