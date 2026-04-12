require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function auditMoods() {
  const { data, error } = await supabase
    .from('glossary')
    .select('name, moods');

  if (error) {
    console.error('Error fetching glossary:', error);
    return;
  }

  const tagStats = {};

  data.forEach(item => {
    if (item.moods) {
      item.moods.forEach(mood => {
        if (!tagStats[mood]) {
          tagStats[mood] = { count: 0, example: item.name };
        }
        tagStats[mood].count++;
      });
    }
  });

  const officialMoods = ['activacion', 'calma', 'focus', 'social', 'reset', 'confort'];
  const inconsistencies = {};

  Object.keys(tagStats).forEach(mood => {
    if (!officialMoods.includes(mood)) {
      inconsistencies[mood] = tagStats[mood];
    }
  });

  console.log('--- Resumen de Inconsistencias en Moods ---');
  console.log(JSON.stringify(inconsistencies, null, 2));
}

auditMoods();
