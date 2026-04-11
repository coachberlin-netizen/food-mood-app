const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_GLOSSARY_TERMS = [
  {
    slug: "berenjena",
    name: "Berenjena",
    tagline: "Un protector directo de la grasa de tus neuronas.",
    category: "Verduras y Hortalizas",
    subcategory: "Solanáceas",
    moods: ["Calma", "Focus"],
    mind_effect: "Al quemarla y cocinarla, activa compuestos olfativos que impactan el sistema límbico reduciendo el estrés. Su principal función cerebral es proteger los lípidos neuronales del estrés oxidativo.",
    longevity_effect: "Combate los radicales libres de forma radical, ayudando a expulsar el exceso de hierro cerebral. Alta quelación.",
    science_summary: "La berenjena es una hortaliza que alberga su mayor tesoro en la piel morada: la nasunina.",
    active_compounds: ["Nasunina"],
    benefits: [
      { "title": "Protector Lípido", "description": "Protege las membranas de grasa del cerebro del desgaste oxidativo." },
      { "title": "Quelante de Hierro", "description": "Reduce depósitos peligrosos de hierro en el cerebro." }
    ],
    synergies: [],
    food_mood_recipes: []
  },
  {
    slug: "granada",
    name: "Granada",
    tagline: "El corazón del árbol de la vida: polifenoles en estado puro.",
    category: "Frutas",
    subcategory: "Antioxidantes",
    moods: ["Focus"],
    mind_effect: "Asegura un bombeo limpio y rápido de sangre oxigenada a cada rincón del tejido cerebral, mejorando el foco sostenido.",
    longevity_effect: "Poder cardioprotector tres veces superior al del té verde. Estabiliza el estrés celular producido por las fluctuaciones hormonales.",
    science_summary: "Sus semillas son depósitos de punicalaginas, que previenen la inflamación y rigidez de los vasos sanguíneos.",
    active_compounds: ["Punicalaginas", "Polifenoles"],
    benefits: [
      { "title": "Protección Endotelial", "description": "Mejora la flexibilidad de los vasos sanguíneos para que no decaiga el oxígeno." }
    ],
    synergies: ["Aceite de Oliva", "Nueces"],
    food_mood_recipes: []
  },
  {
    slug: "coliflor",
    name: "Coliflor",
    tagline: "El escudo antioxidante silencioso más potente de la naturaleza.",
    category: "Verduras y Hortalizas",
    subcategory: "Crucíferas",
    moods: ["Focus", "Reset"],
    mind_effect: "Aporta niveles vitales de colina para regenerar la mielina y asegurar transmisiones neurales rápidas.",
    longevity_effect: "Contiene glucosinolatos que activan la vía Nrf2: el motor de limpieza antioxidante más importante de tus células.",
    science_summary: "Ya sea asada o cruda, sus precursores de sulforafano la convierten en una herramienta de protección clínica de primer grado.",
    active_compounds: ["Glucosinolatos", "Colina", "Vitamina C"],
    benefits: [
      { "title": "Vía Nrf2", "description": "Enciende los procesos internos del cuerpo para generar antioxidantes a demanda." }
    ],
    synergies: ["Cúrcuma", "Tahini"],
    food_mood_recipes: []
  },
  {
    slug: "remolacha",
    name: "Remolacha",
    tagline: "Vasodilatación roja inmediata para el lóbulo frontal.",
    category: "Verduras y Hortalizas",
    subcategory: "Tubérculos",
    moods: ["Focus", "Energía"],
    mind_effect: "Al consumir remolacha, tu cuerpo la convierte en óxido nítrico, el cual dilata los vasos sanguíneos en minutos. El resultado es claridad mental profunda.",
    longevity_effect: "Su antiinflamatorio (betalaína) protege contra lesiones microscópicas celulares y mejora tu rendimiento mitocondrial.",
    science_summary: "Una estrella atlética convertida en neurohacking: la remolacha aumenta físicamente la oxigenación de todo el cerebro superior.",
    active_compounds: ["Nitratos", "Betalaínas"],
    benefits: [
      { "title": "Claridad Cognitiva", "description": "El aumento de flujo sanguíneo disminuye la niebla mental de forma casi inmediata tras su digestión." }
    ],
    synergies: [],
    food_mood_recipes: []
  },
  {
    slug: "pulpo",
    name: "Pulpo",
    tagline: "El océano entregando Vitamina B12 cruda para tu sistema nervioso.",
    category: "Pescados y Mariscos",
    subcategory: "Mariscos",
    moods: ["Focus", "Fuerza"],
    mind_effect: "Reconstruye literalmente la mielina de tus terminaciones nerviosas gracias a concentraciones anormalmente altas de B12 biodisponible.",
    longevity_effect: "Oxigena tu sangre de inmediato mediante hierro hemo que no necesita conversión intestinal compleja.",
    science_summary: "De los alimentos marinos más densos nutricionalmente, capaz de entregar proteína pura baja en grasa más Zinc reparador y neurotransmisor.",
    active_compounds: ["Vitamina B12", "Zinc", "Hierro Hemo"],
    benefits: [
      { "title": "Mielinización", "description": "Las altas tasas de vitamina B12 mantienen los nervios aislados para pensar deprisa y sin cortes cognitivos." }
    ],
    synergies: ["Limón Negro", "Pimentón Ahumado"],
    food_mood_recipes: []
  },
  {
    slug: "hinojo",
    name: "Hinojo",
    tagline: "Fitoestrógenos mediterráneos con una capacidad digestiva legendaria.",
    category: "Verduras y Hortalizas",
    subcategory: "Aromáticas Terrosas",
    moods: ["Calma", "Reset"],
    mind_effect: "Relaja de inmediato la tensión inflamatoria del intestino. Un intestino relajado envía señales de paz directa al cerebro vía el nervio vago.",
    longevity_effect: "Equilibra desajustes hormonales en etapas maduras al emular estrógenos de forma natural, reduciendo sofocos y altibajos.",
    science_summary: "Destaca por el anetol, su compuesto activo de sabor ligeramente anisado que se prescribe clínicamente para problemas de inflamación estomacal severa.",
    active_compounds: ["Anetol", "Fitoestrógenos"],
    benefits: [
      { "title": "Eje Intestino-Cerebro", "description": "Elimina espasmos y reduce la hinchazón, quitando estrés del neuro-vago." }
    ],
    synergies: ["Cítricos", "Pescados Azules"],
    food_mood_recipes: []
  }
];

async function insertGlossary() {
  console.log('--- Inserting new Missing Glossary Terms ---');
  for (const term of NEW_GLOSSARY_TERMS) {
    const { error } = await supabase.from('glossary').upsert(term, { onConflict: 'slug' });
    if (error) {
      console.error(`Error inserting ${term.slug}:`, error.message);
    } else {
      console.log(`Successfully added/updated: ${term.name}`);
    }
  }
}

insertGlossary();
