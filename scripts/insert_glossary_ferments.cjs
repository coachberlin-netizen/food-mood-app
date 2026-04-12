require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function formatRecipesForGlossary(slug, recipes) {
    return recipes.map(r => ({
      slug: r.slug || r.id || '',
      nombre_es: r.nombre_es || '',
      tipo_plato: r.tipo_plato || 'receta',
      premium_level: r.premium_level || 0,
      dificultad: r.dificultad || 'media',
      tiempo_preparacion_min: r.tiempo_preparacion_min || 0
    }));
}

const newIngredients = [
  {
    name: "Natto de garbanzos", slug: "natto", category: "fermentado",
    tagline: "Nattokinasa y K2 sin soja — fermentación japonesa con legumbre mediterránea",
    moods: ["focus"],
    mind_effect: "La nattokinasa mejora la circulación cerebral disolviendo microcoágulos. La vitamina K2 dirige el calcio fuera de las arterias cerebrales. Bacillus subtilis produce estos compuestos independientemente de la legumbre — la bacteria hace el trabajo, no la soja. Con garbanzos, además, obtienes más triptófano biodisponible para la síntesis de serotonina.",
    longevity_effect: "La K2 (MK-7) dirige el calcio a los huesos, protegiéndote de osteoporosis y calcificación arterial simultáneamente. La nattokinasa es fibrinolítica. La fermentación elimina antinutrientes del garbanzo, multiplicando la absorción de hierro, zinc y magnesio.",
    science_summary: "Garbanzos fermentados por Bacillus subtilis var. natto a 40°C durante 22-24h. La bacteria produce nattokinasa (enzima fibrinolítica), vitamina K2 (menaquinona-7) y ácido poliglutámico. El aceite de oliva añadido compensa el menor contenido graso del garbanzo respecto a la soja. Sin isoflavonas estrogénicas — apto para todo el mundo.",
    active_compounds: ["nattokinasa", "vitamina K2 (MK-7)", "ácido poliglutámico", "triptófano"],
    benefits: ["Circulación cerebral", "Salud ósea", "Fibrinolítico", "Serotonina", "Sin soja"],
    evidence_level: "alto"
  },
  {
    name: "Gochujang", slug: "gochujang", category: "fermentado",
    tagline: "Pasta de chile fermentada que enciende tu dopamina",
    moods: ["activacion"],
    mind_effect: "La capsaicina estimula receptores TRPV1 que liberan endorfinas y dopamina — la euforia del picante. La fermentación produce GABA que equilibra la activación: energía sin ansiedad.",
    longevity_effect: "Los capsaicinoides activan la termogénesis y mejoran la sensibilidad a la insulina. La fermentación predigiere las isoflavonas de la soja, haciéndolas más biodisponibles como antioxidantes.",
    science_summary: "Pasta de chile, soja y arroz glutinoso fermentados por Aspergillus oryzae y Lactobacillus. Contiene capsaicina, GABA producido por la fermentación e isoflavonas biodisponibles.",
    active_compounds: ["capsaicina", "GABA", "isoflavonas fermentadas", "carotenoides"],
    benefits: ["Estimulante dopaminérgico", "Termogénico", "Probiótico", "Antioxidante"],
    evidence_level: "moderado"
  },
  {
    name: "Doenjang", slug: "doenjang", category: "fermentado",
    tagline: "El miso coreano: umami ancestral para tu segundo cerebro",
    moods: ["calma"],
    mind_effect: "El ácido glutámico activa receptores umami que envían señales de saciedad profunda al cerebro vía nervio vago. Las melanoidinas protegen la mucosa intestinal.",
    longevity_effect: "La fermentación larga produce vitaminas B1, B2 y B12 biodisponibles. Las melanoidinas son antioxidantes potentes. Los coreanos consumen doenjang a diario y tienen una de las menores tasas de cáncer digestivo.",
    science_summary: "Pasta de soja fermentada por Bacillus subtilis y Aspergillus oryzae durante meses. Contiene ácido glutámico, melanoidinas, isoflavonas y vitaminas del grupo B.",
    active_compounds: ["ácido glutámico", "melanoidinas", "isoflavonas", "vitaminas B"],
    benefits: ["Saciedad vía nervio vago", "Neuroprotector", "Inmunomodulador"],
    evidence_level: "moderado"
  },
  {
    name: "Teff", slug: "teff", category: "cereal",
    tagline: "El cereal más pequeño del mundo con más hierro que cualquier otro",
    moods: ["activacion", "social"],
    mind_effect: "El cereal con más hierro del mundo. Sin hierro no hay oxígeno cerebral, sin oxígeno no hay concentración ni energía. También rico en triptófano para la síntesis de serotonina.",
    longevity_effect: "Sin gluten naturalmente. Rico en calcio (más que cualquier cereal), hierro, fibra y proteína. La base de la dieta etíope, una de las más longevas de África.",
    science_summary: "Eragrostis tef — grano diminuto etíope. Contiene hierro (7.6mg/100g), calcio (180mg/100g), proteína completa, fibra resistente. La fermentación en injera reduce fitatos multiplicando la absorción de hierro x3.",
    active_compounds: ["hierro", "calcio", "triptófano", "fibra resistente"],
    benefits: ["Oxigenación cerebral", "Salud ósea", "Sin gluten", "Energía sostenida"],
    evidence_level: "moderado"
  },
  {
    name: "Tepache", slug: "tepache", category: "fermentado",
    tagline: "Piña fermentada mexicana que activa tu microbiota",
    moods: ["social"],
    mind_effect: "La bromelina de la piña es antiinflamatoria sistémica y reduce la neuroinflamación. La fermentación produce ácidos orgánicos que alimentan bacterias productoras de serotonina. La canela estabiliza glucosa.",
    longevity_effect: "Los ácidos orgánicos producidos durante la fermentación alimentan las bacterias beneficiosas del colon. La bromelina mejora la digestión proteica y reduce inflamación articular.",
    science_summary: "Bebida mexicana fermentada a partir de cáscaras de piña con piloncillo y canela (48h). Contiene bromelina residual, ácidos orgánicos, Saccharomyces y Lactobacillus.",
    active_compounds: ["bromelina", "ácidos orgánicos", "vitamina C", "enzimas digestivas"],
    benefits: ["Antiinflamatorio", "Probiótico", "Digestivo", "Social"],
    evidence_level: "emergente"
  },
  {
    name: "Tkemali", slug: "tkemali", category: "fermentado",
    tagline: "Salsa de ciruela fermentada del Cáucaso",
    moods: ["activacion"],
    mind_effect: "Las ciruelas silvestres son riquísimas en ácido elágico — antiinflamatorio y neuroprotector. El ajo fermentado produce S-alil-cisteína, compuesto con evidencia en protección contra Alzheimer.",
    longevity_effect: "Georgia tiene una de las mayores concentraciones de centenarios del planeta. Su dieta fermentada es una de las razones estudiadas por la gerontología.",
    science_summary: "Salsa de ciruelas silvestres fermentadas con ajo, cilantro, eneldo y chile. Contiene ácido elágico, antocianinas, quercetina y S-alil-cisteína del ajo fermentado.",
    active_compounds: ["ácido elágico", "S-alil-cisteína", "antocianinas", "quercetina"],
    benefits: ["Neuroprotector", "Longevidad", "Antioxidante", "Antiinflamatorio"],
    evidence_level: "emergente"
  },
  {
    name: "Skyr", slug: "skyr", category: "fermentado",
    tagline: "El yogur vikingo: triple proteína, cero grasa",
    moods: ["reset"],
    mind_effect: "Triple proteína significa triple triptófano. La caseína micelar se digiere lentamente, liberando aminoácidos de forma sostenida — ideal para mantener la síntesis de serotonina durante toda la noche.",
    longevity_effect: "Calcio concentrado que regula la excitabilidad neuronal. Los probióticos termófilos son especialmente resistentes al ácido gástrico. Islandia tiene una de las poblaciones más longevas del mundo.",
    science_summary: "Técnicamente un queso fresco, no un yogur. Fermentado con Streptococcus thermophilus y Lactobacillus delbrueckii. Tres veces más proteína que el yogur griego y prácticamente cero grasa.",
    active_compounds: ["caseína micelar", "triptófano transcrito", "calcio", "probióticos termófilos"],
    benefits: ["Serotonina sostenida", "Salud ósea", "Saciante", "Recuperación"],
    evidence_level: "alto"
  },
  {
    name: "Injera", slug: "injera", category: "fermentado",
    tagline: "Pan fermentado etíope: hierro, probióticos y comunidad",
    moods: ["social"],
    mind_effect: "La fermentación de 3 días reduce fitatos que bloquean la absorción de hierro, multiplicando su biodisponibilidad x3. Los lactobacilos producen GABA. Comer con las manos activa circuitos de oxitocina.",
    longevity_effect: "El teff fermentado aporta más hierro biodisponible que cualquier cereal. Sin gluten. La fermentación láctica alimenta la microbiota con diversidad de lactobacilos africanos poco comunes en la dieta occidental.",
    science_summary: "Pan esponjoso de teff fermentado 3 días por Lactobacillus plantarum, L. brevis y Leuconostoc mesenteroides. La fermentación reduce fitatos y produce ácido láctico, GABA y vitaminas B.",
    active_compounds: ["hierro biodisponible", "GABA", "ácido láctico", "vitaminas B"],
    benefits: ["Hierro cerebral", "Probiótico", "Sin gluten", "Vínculo social"],
    evidence_level: "moderado"
  },
  {
    name: "Dosa", slug: "dosa", category: "fermentado",
    tagline: "Crêpe fermentado de arroz y lentejas: proteína completa viva",
    moods: ["focus"],
    mind_effect: "Arroz (metionina) + lentejas (lisina) = proteína completa. La fermentación aumenta la biodisponibilidad de hierro un 300% y produce vitaminas B12 y B6.",
    longevity_effect: "La fermentación nocturna predigiere los antinutrientes y aumenta la biodisponibilidad de todos los minerales. India del sur consume dosa a diario con una de las menores tasas de malnutrición proteica.",
    science_summary: "Masa de arroz y lentejas negras (urad dal) fermentada 12-24h por Leuconostoc mesenteroides y Lactobacillus fermentum. Proteína completa vegetal con hierro y B12 producidos por la fermentación.",
    active_compounds: ["proteína completa", "hierro biodisponible", "vitamina B12", "vitamina B6"],
    benefits: ["Proteína completa vegetal", "Hierro", "Sin gluten", "Focus cognitivo"],
    evidence_level: "moderado"
  },
  {
    name: "Nukazuke", slug: "nukazuke", category: "fermentado",
    tagline: "Encurtidos en salvado de arroz: el jardín microbiano japonés",
    moods: ["reset"],
    mind_effect: "El nukadoko transfiere vitaminas B del salvado a las verduras — especialmente B1 (metabolismo energético cerebral) y B6 (síntesis de serotonina y GABA). El ritual de remover el lecho cada día es mindfulness táctil.",
    longevity_effect: "Los lactobacilos del lecho de salvado son únicos y se heredan entre generaciones — algunos nukadokos tienen más de 100 años. Okinawa consume encurtidos fermentados a diario.",
    science_summary: "Verduras fermentadas en nukadoko (lecho de salvado de arroz con sal y kombu). Contiene Lactobacillus plantarum, L. brevis y Saccharomyces. Produce vitaminas B1, B2, B6 y GABA.",
    active_compounds: ["vitaminas B1, B2, B6", "GABA", "ácido láctico", "enzimas"],
    benefits: ["Vitaminas B cerebrales", "GABA intestinal", "Ritual mindfulness", "Reset digestivo"],
    evidence_level: "moderado"
  }
];

async function run() {
  console.log("Iniciando inyección de glosario y mapeo de recetas...");

  // Backup en memoria (imprimiento en consola si se desea o insertando en otra tabla)
  // Como no podemos hacer DDL create table, hacemos insert
  
  for (const item of newIngredients) {
    const { data: inserted, error: insertErr } = await supabase
      .from('glossary')
      .upsert({ ...item, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
      .select();

    if (insertErr) {
      console.error(`Error insertando ${item.slug}:`, insertErr.message);
      continue;
    }
    console.log(`✅ Glosario insertado: ${item.name}`);

    // Mapearemos recetas buscando ocurrencias en 'ingredientes_es' o titulo
    const { data: recipes, error: recErr } = await supabase
      .from('recetas')
      .select('id, slug, nombre_es, tipo_plato, premium_level, dificultad, tiempo_preparacion_min')
      .ilike('ingredientes_es', `%${item.name.split(' ')[0]}%`); // Simple match to finding base ingredient
      
    if (!recErr && recipes && recipes.length > 0) {
       console.log(`  Encontradas ${recipes.length} recetas relacionadas para ${item.slug}`);
       const fmRecipes = await formatRecipesForGlossary(item.slug, recipes);
       await supabase.from('glossary').update({ food_mood_recipes: fmRecipes }).eq('slug', item.slug);
    } else {
       console.log(`  Ninguna receta actual utiliza: ${item.name}. Dejando el array vacío.`);
       await supabase.from('glossary').update({ food_mood_recipes: [] }).eq('slug', item.slug);
    }
  }

  console.log("Completado inserción glosario.");
}

run();
