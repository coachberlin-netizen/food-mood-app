require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllMoods() {
  const { data, error } = await supabase
    .from('glossary')
    .select('moods');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const allMoods = new Set();
  data.forEach(item => {
    if (item.moods) {
      item.moods.forEach(m => allMoods.add(m));
    }
  });

  console.log('All moods found in glossary:', Array.from(allMoods));
}

listAllMoods();
