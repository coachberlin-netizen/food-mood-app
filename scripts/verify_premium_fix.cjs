require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Minimal implementation of the library to test logic directly
async function getPremiumStatus(supabase, userId) {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', userId)
    .maybeSingle();
  if (error) return false;
  return data?.is_premium === true;
}

async function verify() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const userId = 'f7064fcb-a83a-467f-a869-ef79dd57a4cb';
  console.log(`Verificando usuario: ${userId}`);
  
  const isPremium = await getPremiumStatus(supabase, userId);
  console.log(`Resultado getPremiumStatus: ${isPremium}`);
  
  if (isPremium) {
    console.log('✅ EXITO: El usuario es reconocido como PREMIUM.');
  } else {
    console.log('❌ FALLO: El usuario NO es reconocido como PREMIUM.');
  }
}

verify();
