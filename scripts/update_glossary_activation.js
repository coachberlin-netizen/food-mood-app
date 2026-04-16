const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const glossaryItems = [
  {
    name: "Guaraná",
    slug: "guarana",
    tagline: "Cafeína de liberación lenta: el combustible amazónico",
    category: "bebida",
    moods: ["activacion"],
    mind_effect: "Proporciona una liberación sostenida de cafeína que mejora el foco mental y la dopamina sin los picos de ansiedad del café tradicional.",
    longevity_effect: "Rico en antioxidantes que protegen contra el estrés oxidativo y la fatiga crónica.",
    science_summary: "Contiene guaranina, una molécula de cafeína unida a taninos que ralentiza su absorción, junto a teobromina y teofilina.",
    active_compounds: ["cafeína", "teobromina", "teofilina", "taninos"],
    benefits: ["Energía sostenida", "Foco mental agudo", "Antifatiga"],
    evidence_level: "alto",
    is_premium_detail: true
  },
  {
    name: "Maca",
    slug: "maca",
    tagline: "El adaptógeno andino para la vitalidad hormonal",
    category: "semilla",
    moods: ["activacion"],
    mind_effect: "Actúa como adaptógeno, regulando el sistema endocrino para mejorar la libido, el estado de ánimo y la resistencia al estrés.",
    longevity_effect: "Sostiene la salud ósea y el equilibrio hormonal durante el envejecimiento.",
    science_summary: "Rica en macamidas y macaenos, compuestos exclusivos que modulan el sistema de respuesta al estrés.",
    active_compounds: ["macamidas", "macaenos", "isotiocianatos", "zinc"],
    benefits: ["Equilibrio hormonal", "Aumento de libido", "Resistencia física"],
    evidence_level: "alto",
    is_premium_detail: true
  }
];

async function insertGlossary() {
  console.log('Inserting Guaraná and Maca into glossary...');
  const { data, error } = await supabase
    .from('glossary')
    .upsert(glossaryItems, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting glossary items:', error);
  } else {
    console.log('Successfully inserted Guaraná and Maca!');
  }
}

insertGlossary();
