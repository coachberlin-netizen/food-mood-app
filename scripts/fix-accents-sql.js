const { createClient } = require('@supabase/supabase-js');

async function runUpdate() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_RECETAS_SUPABASE_URL || 'https://hbiraafgjshhyjhpbqty.supabase.co',
    process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log('--- Running Tarea 4: SQL Accents UPDATE ---');
  
  const { data, error } = await supabase
    .from('recetas')
    .update({ mood_es: 'Activaci\u00f3n' })
    .eq('mood_es', 'Activacion');

  if (error) {
    console.error('Error updating mood_es:', error);
  } else {
    console.log('Successfully updated "Activacion" to "Activaci\u00f3n" in recetas.');
  }

}

runUpdate();
