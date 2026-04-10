const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { count, error } = await supabase
    .from('recetas')
    .select('*', { count: 'exact', head: true })
    .eq('sexo', 'hombre')
    .ilike('mood_es', '%Activacion%');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Total Hombres + Activación Recipes now:', count);
  }

  const { data: glossary } = await supabase.from('glossary').select('food_mood_recipes').eq('slug', 'cordyceps').single();
  console.log('Glossary Cordyceps links:', glossary.food_mood_recipes);
}

check();
