require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

const RECETAS_A_LIBERAR = [
  'SOC-01', // Social & Placer Compartido
  'CON-01', // Confort & Calidez
  'EXT-I-04', // Introducción
  '712a6171-0621-46ed-a764-73208ae624a1', // activacion
  '09892cd0-85fc-47a7-94d0-6b1dd8856c57', // calma
  'b041bf87-8f71-4b4f-aedb-9b48bc2f5060', // focus
  'cd83d1bf-c63b-4357-be70-b5025ddfc923', // social
  '0448c805-e886-4991-8a06-0f40f87627e8', // reset
  '7cc5d9d3-4bdd-4d6b-8634-42113a14d0b0' // confort
];

async function fixFreeRecipes() {
  console.log('Liberando recetas (set premium_level = 0)...');
  
  for (const id of RECETAS_A_LIBERAR) {
    const { data, error } = await supabase
      .from('recetas')
      .update({ premium_level: 0 })
      .eq('id', id)
      .select();
      
    if (error) {
      console.error(`Error liberando ${id}:`, error);
    } else {
      console.log(`✅ Liberada: ${id} (${data[0]?.nombre_es}) - Mood: ${data[0]?.mood_es}`);
    }
  }
}

fixFreeRecipes();
