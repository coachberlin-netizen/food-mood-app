const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://hbiraafgjshhyjhpbqty.supabase.co',
  process.env.RECETAS_SUPABASE_KEY
);

async function run() {
  const { data, count } = await supabase
    .from('recetas')
    .select('id, nombre_es, nombre_en')
    .or('nombre_es.ilike.%adri%,nombre_es.ilike.%robuchon%,nombre_es.ilike.%arzak%,nombre_es.ilike.%blumenthal%,nombre_es.ilike.%roca%,nombre_es.ilike.%ducasse%,nombre_es.ilike.%bocuse%,nombre_es.ilike.%ferran%,nombre_es.ilike.%bottura%,nombre_es.ilike.%redzepi%,nombre_es.ilike.%keller%,nombre_es.ilike.%ramsay%,nombre_es.ilike.%subijana%,nombre_es.ilike.%berasategui%,nombre_es.ilike.%aduriz%,nombre_es.ilike.%munoz%,nombre_es.ilike.%muñoz%');

  fs.writeFileSync('scripts/chef_hits.json', JSON.stringify({ total: count, recetas: data }, null, 2), 'utf8');
  console.log('Done. Total:', count);
}
run();
