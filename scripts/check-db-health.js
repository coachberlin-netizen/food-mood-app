
/**
 * DB Health Check Script
 * This script verifies that the 'recetas' table in Supabase contains all columns 
 * required by the application's select queries.
 * 
 * Usage: node scripts/check-db-health.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Config
const REQUIRED_COLUMNS = ['id', 'nombre_es', 'mood_es', 'tiempo_preparacion_min', 'tipo_plato', 'dificultad', 'temporada', 'segmento', 'premium_level'];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkHealth() {
  console.log('🔍 Checking database health...');
  
  try {
    const { data, error } = await supabase
      .from('recetas')
      .select(REQUIRED_COLUMNS.join(', '))
      .limit(1);

    if (error) {
      console.error('❌ HEALTH CHECK FAILED!');
      console.error(`Error Code: ${error.code}`);
      console.error(`Message: ${error.message}`);
      
      if (error.code === '42703') {
        const missingMatch = error.message.match(/column recetas\.(\w+) does not exist/);
        if (missingMatch) {
          console.error(`🚨 MISSING COLUMN: ${missingMatch[1]}`);
        }
      }
      process.exit(1);
    }

    console.log('✅ HEALTH CHECK PASSED: All required columns exist.');
    console.log('Columns verified:', Object.keys(data[0]).join(', '));
    
  } catch (err) {
    console.error('💥 Unexpected error during health check:', err);
    process.exit(1);
  }
}

checkHealth();
