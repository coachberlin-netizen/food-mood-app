const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const item = {
  name: "Triptófano",
  slug: "triptofano",
  tagline: "El Nutriente del Buen Humor: precursor de la serotonina",
  category: "nutriente",
  moods: ["activacion"],
  mind_effect: "Es el precursor directo de la serotonina, el neurotransmisor del bienestar y la calma. Clave para reducir la ansiedad, mejorar el humor y facilitar un sueño reparador.",
  longevity_effect: "Al regular los ciclos circadianos a través de la melatonina (derivada de la serotonina), protege contra el envejecimiento prematuro y el estrés oxidativo.",
  science_summary: "Aminoácido esencial que sigue la ruta metabólica: TRIPTÓFANO → 5-HTP → SEROTONINA → MELATONINA. Requiere carbohidratos para cruzar la barrera hematoencefálica.",
  active_compounds: ["triptófano"],
  benefits: [
    "Precursor de la serotonina",
    "Regula el ciclo del sueño",
    "Reduce la ansiedad leve"
  ],
  evidence_level: "alto",
  is_premium_detail: true
};

async function insert() {
  console.log('Inserting Triptófano into glossary...');
  const { data, error } = await supabase
    .from('glossary')
    .upsert(item, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting Triptófano:', error);
  } else {
    console.log('Successfully inserted Triptófano!');
  }
}

insert();
