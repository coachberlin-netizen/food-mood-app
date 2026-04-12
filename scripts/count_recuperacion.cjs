require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countRecuperacion() {
  const { data, error } = await supabase
    .from('glossary')
    .select('name, moods');

  if (error) {
    console.error('Error fetching glossary:', error);
    return;
  }

  const itemsWithRecuperacion = data.filter(item => 
    item.moods && item.moods.some(m => m.toLowerCase() === 'recuperacion')
  );

  console.log(`Found ${itemsWithRecuperacion.length} ingredients with 'recuperacion' mood:`);
  itemsWithRecuperacion.forEach(item => {
    console.log(`- ${item.name} (${item.moods.join(', ')})`);
  });
}

countRecuperacion();
