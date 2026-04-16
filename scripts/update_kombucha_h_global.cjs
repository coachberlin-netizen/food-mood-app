require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function updateKombuchaH() {
  console.log('🔄 Iniciando actualización de Kombuv+H a "vinagre de kombucha o de manzana cruda"...');

  // 1. Update the specific recipe by ID
  const targetId = 'cd83d1bf-c63b-4357-be70-b5025ddfc923';
  
  const { data: recipe, error: fetchError } = await supabase
    .from('recetas')
    .select('*')
    .eq('id', targetId)
    .single();

  if (fetchError) {
    console.error(`❌ Error buscando receta ${targetId}:`, fetchError);
  } else if (recipe) {
    console.log(`✅ Receta encontrada: ${recipe.nombre_es}`);
    
    // Replace in context
    let updatedContexto = recipe.contexto_es?.replace(/vinagre de kombucha/g, 'vinagre de kombucha o de manzana cruda');
    
    // Replace in ingredients (array of strings)
    let updatedIngredientes = recipe.ingredientes_es?.map(ing => 
      ing.replace(/vinagre de kombucha \(Kombuv\+H\)/g, 'vinagre de kombucha o de manzana cruda')
         .replace(/Kombuv\+H/g, 'vinagre de kombucha o de manzana cruda')
    );

    // Replace in preparation (array of strings)
    let updatedPreparacion = recipe.preparacion_es?.map(paso => 
      paso.replace(/Kombuv\+H/g, 'vinagre de kombucha o de manzana cruda')
    );

    // Replace in food mood note
    let updatedNota = recipe.nota_food_mood_es?.replace(/El Kombuv\+H/g, 'El vinagre de kombucha o de manzana cruda')
                                              .replace(/Kombuv\+H/g, 'vinagre de kombucha o de manzana cruda');

    const { error: updateError } = await supabase
      .from('recetas')
      .update({
        contexto_es: updatedContexto,
        ingredientes_es: updatedIngredientes,
        preparacion_es: updatedPreparacion,
        nota_food_mood_es: updatedNota
      })
      .eq('id', targetId);

    if (updateError) {
      console.error(`❌ Error actualizando receta ${targetId}:`, updateError);
    } else {
      console.log(`✨ Receta ${targetId} actualizada con éxito.`);
    }
  }

  // 2. Global replace for other recipes where 'Kombuv+H' appears in fields
  console.log('🔍 Buscando otras recetas con "Kombuv+H"...');
  
  // Note: Supabase doesn't support easy full-text replace on JSON columns directly without complex SQL
  // But we can try to fetch ones that contain the string in note or title
  
  const { data: others, error: fetchOthersError } = await supabase
    .from('recetas')
    .select('id, nombre_es, ingredientes_es, nota_food_mood_es')
    .or('nota_food_mood_es.ilike.%Kombuv+H%,ingredientes_es.cs.{"vinagre de kombucha (Kombuv+H)"}');

  if (fetchOthersError) {
    console.error('❌ Error buscando otras recetas:', fetchOthersError);
  } else if (others && others.length > 0) {
    console.log(`📦 Encontradas ${others.length} recetas adicionales.`);
    for (const r of others) {
       // Similar logic for replacements if needed
       // For now, let's just log them
       console.log(`- Sugerencia: Actualizar ${r.nombre_es} (${r.id})`);
    }
  } else {
    console.log('✅ No se encontraron más dependencias directas de string "Kombuv+H".');
  }

  process.exit(0);
}

updateKombuchaH();
