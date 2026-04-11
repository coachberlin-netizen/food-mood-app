const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data } = await supabase.from('glossary').select('food_mood_recipes').eq('slug', 'cordyceps').single();
  const current = data?.food_mood_recipes || [];
  const newRecipes = [
    'Bowl de Vitalidad Celular (Cordyceps y Hierro)', 
    'Smoothie "Claridad y Brillo" (Antioxidante Cerebral)'
  ];
  const unique = [...new Set([...current, ...newRecipes])];
  const { error } = await supabase.from('glossary').update({ food_mood_recipes: unique }).eq('slug', 'cordyceps');
  if (error) {
    console.error('Error updating glossary:', error);
  } else {
    console.log('Updated glossary with:', unique);
  }
}
run();
