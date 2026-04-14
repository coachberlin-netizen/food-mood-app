require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

async function runDiagnostics() {
  try {
    console.log('--- 1. Recetas en total ---');
    const { count: total, error: e1 } = await supabase.from('recetas').select('*', { count: 'exact', head: true });
    if (e1) console.error(e1);
    console.log(`Total: ${total}`);

    console.log('\n--- 2. Valores de mood_es existentes ---');
    const { data: moods, error: e2 } = await supabase.from('recetas').select('mood_es');
    if (e2) console.error(e2);
    const distinctMoods = [...new Set(moods?.map(m => m.mood_es))];
    console.log(`Moods: ${distinctMoods.join(', ')}`);

    console.log('\n--- 3. Auditoría de Cobertura Gratuita por Mood ---');
    const { data: allMoods, error: e3 } = await supabase.from('recetas').select('mood_es, premium_level');
    if (e3) console.error(e3);
    
    const coverage = {};
    allMoods?.forEach(r => {
      const mood = r.mood_es || 'Sin Mood';
      if (!coverage[mood]) coverage[mood] = { total: 0, free: 0 };
      coverage[mood].total++;
      if (r.premium_level === 0 || r.premium_level === null) coverage[mood].free++;
    });
    
    console.log('Cobertura:', JSON.stringify(coverage, null, 2));
    
    const missing = Object.keys(coverage).filter(m => coverage[m].free === 0);
    console.log('\nMoods sin receta gratuita:', missing);

    if (missing.length > 0) {
      console.log('\n--- 4. Candidatos para liberar (id de la primera receta de cada mood faltante) ---');
      for (const m of missing) {
        const { data: candidate } = await supabase.from('recetas').select('id, nombre_es').eq('mood_es', m).limit(1).single();
        console.log(`Mood: ${m} -> Candidato: ${candidate?.id} (${candidate?.nombre_es})`);
      }
    }

  } catch (err) {
    console.error('Diagnostic error:', err);
  }
}

runDiagnostics();
