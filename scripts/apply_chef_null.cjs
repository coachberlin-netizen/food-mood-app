const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 1. Fix the payload file
const filePath = 'scripts/insert_women_plus45_chef_recipes.cjs';
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/grupo_edad: null/g, 'grupo_edad: ""');
fs.writeFileSync(filePath, content);
console.log('--- 1. File Updated ---');
console.log('Replaced grupo_edad: null with grupo_edad: "" in the insert payload.');

// 2. Update existing rows in the DB
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runDbUpdate() {
  console.log('\n--- 2. Updating Existing DB Rows ---');
  // First get a count
  const { data: dbData, error: dbError } = await supabase.from('recetas').select('id').eq('premium_level', 2);
  if (dbError) {
    console.error('Error fetching recipes:', dbError);
    return;
  }
  
  if (dbData.length === 0) {
    console.log('No recipes found with premium_level = 2.');
    return;
  }

  // Then update them
  const { error: updateError } = await supabase.from('recetas')
    .update({ grupo_edad: '', sexo: 'unisex' })
    .eq('premium_level', 2);
    
  if (updateError) {
    console.error('Error updating DB:', updateError);
  } else {
    console.log(`Success! Updated ${dbData.length} existing Chef recipes in the database.`);
  }
}

runDbUpdate();
