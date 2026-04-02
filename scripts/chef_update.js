const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hbiraafgjshhyjhpbqty.supabase.co',
  process.env.RECETAS_SUPABASE_KEY
);

// Simple approach: fetch ALL michelin recipes, replace chef names with regex
const CHEF_MAP = [
  { pattern: /de Ferran Adri[àa]/gi,    es: 'del Maestro Alquimista',   en: 'of the Master Alchemist' },
  { pattern: /de Albert Adri[àa]/gi,     es: 'de la Vanguardia Dulce',   en: 'of Sweet Avant-Garde' },
  { pattern: /de Elena Arzak/gi,          es: 'de la Tradición Creativa', en: 'of Creative Tradition' },
  { pattern: /de Andoni Aduriz/gi,        es: 'de la Vanguardia Natural', en: 'of Natural Avant-Garde' },
  { pattern: /de Dabiz Mu[ñn]oz/gi,       es: 'del Genio Irreverente',   en: 'of the Irreverent Genius' },
  { pattern: /de Joan Roca/gi,            es: 'de la Tradición Creativa', en: 'of Creative Tradition' },
  { pattern: /de Alain Ducasse/gi,        es: 'del Grand Chef',          en: 'of the Grand Chef' },
  { pattern: /de Jo[ëe]l Robuchon/gi,     es: 'del Grand Chef',          en: 'of the Grand Chef' },
  { pattern: /de Heston Blumenthal/gi,    es: 'de la Vanguardia',        en: 'of the Avant-Garde' },
  { pattern: /de Ren[ée] Redzepi/gi,      es: 'de la Nueva Naturaleza',  en: 'of New Nature' },
  { pattern: /de Massimo Bottura/gi,      es: 'del Arte Italiano',       en: 'of Italian Art' },
];

// Also replace standalone chef names in text fields
const CHEF_NAME_MAP = [
  { pattern: /Ferran Adri[àa]/g,    replace: 'el Maestro Alquimista' },
  { pattern: /Albert Adri[àa]/g,    replace: 'la Vanguardia Dulce' },
  { pattern: /Elena Arzak/g,         replace: 'la Tradición Creativa' },
  { pattern: /Andoni Aduriz/g,       replace: 'la Vanguardia Natural' },
  { pattern: /Dabiz Mu[ñn]oz/g,      replace: 'el Genio Irreverente' },
  { pattern: /Joan Roca/g,           replace: 'la Tradición Creativa' },
  { pattern: /Alain Ducasse/g,       replace: 'el Grand Chef' },
  { pattern: /Jo[ëe]l Robuchon/g,    replace: 'el Grand Chef' },
  { pattern: /Heston Blumenthal/g,   replace: 'la Vanguardia' },
  { pattern: /Ren[ée] Redzepi/g,     replace: 'la Nueva Naturaleza' },
  { pattern: /Massimo Bottura/g,     replace: 'el Arte Italiano' },
];

function replaceChefInName(text, isEn) {
  let result = text;
  for (const { pattern, es, en } of CHEF_MAP) {
    result = result.replace(pattern, isEn ? en : es);
  }
  return result;
}

function replaceChefInText(text) {
  if (!text) return text;
  let result = text;
  for (const { pattern, replace } of CHEF_NAME_MAP) {
    result = result.replace(pattern, replace);
  }
  return result;
}

async function run() {
  // Fetch ALL michelin recipes (premium_level = 2)
  const { data: recipes, error } = await supabase
    .from('recetas')
    .select('id, nombre_es, nombre_en, contexto_es, contexto_en, nota_food_mood_es')
    .eq('premium_level', 2);

  if (error) { console.error('Error:', error.message); return; }
  console.log('Total Michelin recipes:', recipes.length);

  let updated = 0;
  for (const r of recipes) {
    const newNombreEs = replaceChefInName(r.nombre_es || '', false);
    const newNombreEn = replaceChefInName(r.nombre_en || '', true);
    const newContextoEs = replaceChefInText(r.contexto_es);
    const newContextoEn = replaceChefInText(r.contexto_en);
    const newNotaEs = replaceChefInText(r.nota_food_mood_es);

    // Check if anything changed
    if (newNombreEs !== r.nombre_es || newNombreEn !== r.nombre_en ||
        newContextoEs !== r.contexto_es || newContextoEn !== r.contexto_en ||
        newNotaEs !== r.nota_food_mood_es) {
      
      const updates = {};
      if (newNombreEs !== r.nombre_es) updates.nombre_es = newNombreEs;
      if (newNombreEn !== r.nombre_en) updates.nombre_en = newNombreEn;
      if (newContextoEs !== r.contexto_es) updates.contexto_es = newContextoEs;
      if (newContextoEn !== r.contexto_en) updates.contexto_en = newContextoEn;
      if (newNotaEs !== r.nota_food_mood_es) updates.nota_food_mood_es = newNotaEs;

      const { error: updateError } = await supabase
        .from('recetas')
        .update(updates)
        .eq('id', r.id);

      if (updateError) {
        console.error('ERR', r.id, updateError.message);
      } else {
        updated++;
        if (updates.nombre_es) {
          console.log(`OK ${r.id}: ${r.nombre_es} -> ${updates.nombre_es}`);
        }
      }
    }
  }

  console.log('\nTotal updated:', updated);

  // VERIFICATION
  const { data: check } = await supabase
    .from('recetas')
    .select('id, nombre_es')
    .or('nombre_es.ilike.%adri%,nombre_es.ilike.%robuchon%,nombre_es.ilike.%arzak%,nombre_es.ilike.%blumenthal%,nombre_es.ilike.%roca%,nombre_es.ilike.%ducasse%,nombre_es.ilike.%bottura%,nombre_es.ilike.%redzepi%,nombre_es.ilike.%munoz%,nombre_es.ilike.%ferran%,nombre_es.ilike.%aduriz%');

  console.log('\nVERIFICATION - Remaining with chef names:', check?.length || 0);
  if (check) check.forEach(r => console.log('  STILL:', r.id, r.nombre_es));
}

run();
