require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ferments = [
  {
    slug: "natto", name: "Natto de Garbanzos", country: "Japón",
    country_code: "JP", region: "Asia Oriental", lat: 36.2, lng: 138.2,
    mood: "focus",
    tagline: "Nattokinasa y K2 sin soja — fermentación japonesa con legumbre mediterránea",
    ferment_type: "Fermentación bacteriana (Bacillus subtilis var. natto)",
    teaser: "Garbanzos fermentados con la misma bacteria milenaria japonesa. Nattokinasa para tu circulación cerebral, K2 para tus huesos, triptófano para tu serotonina. Sin soja.",
    probiotic_strains: ["Bacillus subtilis var. natto"],
    key_compounds: ["Nattokinasa", "Vitamina K2 (MK-7)", "Triptófano", "Ácido poliglutámico"],
    brain_connection: "Bacillus subtilis produce nattokinasa y K2 independientemente del sustrato — la bacteria no distingue entre soja y garbanzo. Con garbanzo mediterráneo ganas triptófano (más que en soja), pierdes isoflavonas estrogénicas, y la fibra prebiótica del garbanzo alimenta tu microbiota además de recibir los probióticos. El aceite de oliva añadido mejora la absorción de la K2 (liposoluble). Neuroprotección japonesa con ingredientes de tu mercado.",
    glossary_slug: "natto"
  },
  {
    slug: "gochujang", name: "Gochujang", country: "Corea",
    country_code: "KR", region: "Asia Oriental", lat: 36.5, lng: 127.0,
    mood: "activacion",
    tagline: "Pasta de chile fermentada que enciende tu dopamina",
    ferment_type: "Fermentación fúngica + láctica (Aspergillus oryzae, Lactobacillus)",
    teaser: "Chile, soja y arroz glutinoso fermentados durante meses. La capsaicina libera endorfinas y la fermentación produce GABA.",
    probiotic_strains: ["Aspergillus oryzae", "Bacillus subtilis", "Lactobacillus plantarum"],
    key_compounds: ["Capsaicina", "GABA", "Isoflavonas fermentadas"],
    brain_connection: "La capsaicina estimula receptores TRPV1 que liberan endorfinas y dopamina — la euforia del picante. La fermentación predigiere las isoflavonas. El GABA producido por los lactobacilos equilibra la activación: energía sin ansiedad.",
    glossary_slug: "gochujang"
  },
  {
    slug: "doenjang", name: "Doenjang", country: "Corea",
    country_code: "KR", region: "Asia Oriental", lat: 37.5, lng: 127.0,
    mood: "calma",
    tagline: "El miso coreano: umami ancestral para tu segundo cerebro",
    ferment_type: "Fermentación fúngica + bacteriana",
    teaser: "Pasta de soja fermentada con más profundidad que el miso. Meses de maduración producen un umami que activa receptores de saciedad conectados con el nervio vago.",
    probiotic_strains: ["Bacillus subtilis", "Aspergillus oryzae", "Lactobacillus"],
    key_compounds: ["Ácido glutámico", "Melanoidinas", "Vitaminas B"],
    brain_connection: "El ácido glutámico activa receptores umami que envían señales de saciedad profunda al cerebro vía nervio vago. Las melanoidinas protegen la mucosa intestinal. La fermentación larga produce vitaminas B1, B2 y B12 biodisponibles.",
    glossary_slug: "doenjang"
  },
  {
    slug: "injera", name: "Injera", country: "Etiopía",
    country_code: "ET", region: "África Oriental", lat: 9.0, lng: 38.7,
    mood: "social",
    tagline: "El pan esponjoso que se comparte con las manos",
    ferment_type: "Fermentación láctica natural (teff)",
    teaser: "Pan de teff fermentado 3 días — esponjoso, ácido, sin gluten. Se usa como plato y cubierto. Comer con las manos es comer con el corazón.",
    probiotic_strains: ["Lactobacillus plantarum", "L. brevis", "Leuconostoc mesenteroides"],
    key_compounds: ["Hierro (teff)", "Calcio", "Ácido láctico", "GABA"],
    brain_connection: "El teff es el cereal con más hierro del mundo. La fermentación reduce fitatos multiplicando la biodisponibilidad del hierro x3. Los lactobacilos producen GABA. Compartir comida con las manos activa circuitos de oxitocina — la hormona del vínculo social.",
    glossary_slug: "injera"
  },
  {
    slug: "ogi", name: "Ogi", country: "Nigeria",
    country_code: "NG", region: "África Occidental", lat: 9.0, lng: 7.5,
    mood: "confort",
    tagline: "Porridge fermentado que abraza desde dentro",
    ferment_type: "Fermentación láctica (maíz, mijo o sorgo)",
    teaser: "Cereal fermentado 2-3 días con acidez suave y textura sedosa. Uno de los probióticos más antiguos del continente africano.",
    probiotic_strains: ["Lactobacillus plantarum", "L. fermentum", "Saccharomyces cerevisiae"],
    key_compounds: ["Ácido láctico", "Triptófano biodisponible", "Niacina (B3)"],
    brain_connection: "La fermentación reduce antinutrientes y aumenta la biodisponibilidad de triptófano y niacina (B3). La niacina es esencial para la producción de NAD+ — la molécula de la energía celular y la longevidad. El triptófano liberado alimenta serotonina y melatonina.",
    glossary_slug: null
  },
  {
    slug: "dosa", name: "Dosa", country: "India",
    country_code: "IN", region: "Asia Meridional", lat: 13.0, lng: 77.6,
    mood: "focus",
    tagline: "Crêpe fermentado de arroz y lentejas: proteína completa viva",
    ferment_type: "Fermentación láctica natural (arroz + urad dal)",
    teaser: "Masa fermentada toda la noche. Crujiente por fuera, esponjoso por dentro. Proteína completa sin lácteos ni carne.",
    probiotic_strains: ["Leuconostoc mesenteroides", "Lactobacillus fermentum"],
    key_compounds: ["Proteína completa", "Hierro x3", "Vitamina B12", "Vitamina B6"],
    brain_connection: "Arroz (metionina) + lentejas (lisina) = proteína completa. La fermentación aumenta la biodisponibilidad de hierro un 300% y produce B12 y B6. El chutney de coco aporta TCM — combustible directo cerebral.",
    glossary_slug: "dosa"
  },
  {
    slug: "lassi", name: "Lassi", country: "India",
    country_code: "IN", region: "Asia Meridional", lat: 28.6, lng: 77.2,
    mood: "calma",
    tagline: "Yogur batido con especias: Ayurveda líquido",
    ferment_type: "Fermentación láctica (yogur)",
    teaser: "Yogur batido con agua, especias y fruta. El digestivo que India lleva bebiendo 5.000 años después de cada comida.",
    probiotic_strains: ["Lactobacillus delbrueckii", "Streptococcus thermophilus"],
    key_compounds: ["Calcio biodisponible", "Triptófano", "Cardamomo (cineol)"],
    brain_connection: "El yogur batido con agua tiene mayor biodisponibilidad de calcio. El cardamomo contiene cineol — terpeno ansiolítico que mejora circulación cerebral. El triptófano del yogur + especias = serotonina por dos vías.",
    glossary_slug: null
  },
  {
    slug: "tepache", name: "Tepache", country: "México",
    country_code: "MX", region: "América Central", lat: 19.4, lng: -99.1,
    mood: "social",
    tagline: "Piña fermentada que activa tu microbiota social",
    ferment_type: "Fermentación alcohólica-acética natural",
    teaser: "Cáscaras de piña, piloncillo y canela fermentados 48 horas. Espumoso, dulce-ácido. El aperitivo que México inventó antes de que existiera la palabra probiótico.",
    probiotic_strains: ["Saccharomyces cerevisiae", "Lactobacillus", "Acetobacter"],
    key_compounds: ["Bromelina", "Ácidos orgánicos", "Vitamina C"],
    brain_connection: "La bromelina reduce la neuroinflamación. La fermentación produce ácidos orgánicos que alimentan bacterias productoras de serotonina. La canela estabiliza glucosa. Compartir tepache frío activa dopamina de conexión humana.",
    glossary_slug: "tepache"
  },
  {
    slug: "sauerkraut", name: "Chucrut artesanal", country: "Alemania",
    country_code: "DE", region: "Europa Central", lat: 52.5, lng: 13.4,
    mood: "reset",
    tagline: "Col fermentada: la madre de todos los probióticos europeos",
    ferment_type: "Fermentación láctica natural",
    teaser: "Solo col y sal. La fermentación hace el resto: en 2-4 semanas, más diversidad microbiana que cualquier suplemento del mercado.",
    probiotic_strains: ["L. plantarum", "L. brevis", "Leuconostoc mesenteroides", "Pediococcus pentosaceus"],
    key_compounds: ["Ácido láctico", "Vitamina C", "Vitamina K2", "Sulforafano"],
    brain_connection: "El chucrut conserva los glucosinolatos de la col — precursores de sulforafano, el activador Nrf2 más potente para la defensa antioxidante cerebral. L. plantarum produce GABA directamente en el intestino. La vitamina C aumenta durante la fermentación.",
    glossary_slug: null
  },
  {
    slug: "tkemali", name: "Tkemali", country: "Georgia",
    country_code: "GE", region: "Cáucaso", lat: 41.7, lng: 44.8,
    mood: "activacion",
    tagline: "Salsa de ciruela silvestre fermentada del Cáucaso",
    ferment_type: "Fermentación láctica natural",
    teaser: "Ciruelas silvestres con ajo, cilantro, eneldo y chile fermentadas naturalmente. El Cáucaso tiene la mayor concentración de centenarios del mundo.",
    probiotic_strains: ["Lactobacillus", "Leuconostoc"],
    key_compounds: ["Ácido elágico", "S-alil-cisteína", "Antocianinas", "Quercetina"],
    brain_connection: "Las ciruelas silvestres son riquísimas en ácido elágico — neuroprotector. El ajo fermentado produce S-alil-cisteína — compuesto con evidencia en protección contra Alzheimer. Georgia tiene una de las mayores concentraciones de centenarios del planeta.",
    glossary_slug: "tkemali"
  },
  {
    slug: "borscht-kefir", name: "Borscht con Kéfir", country: "Ucrania",
    country_code: "UA", region: "Europa Oriental", lat: 50.4, lng: 30.5,
    mood: "reset",
    tagline: "Remolacha y kéfir: nitratos y probióticos en un plato",
    ferment_type: "Kéfir como acompañamiento probiótico",
    teaser: "Sopa de remolacha profunda con kéfir frío que se derrite formando espirales rosadas. El contraste caliente-frío es parte de la medicina.",
    probiotic_strains: ["Hasta 40 cepas distintas en el kéfir"],
    key_compounds: ["Betalaínas", "Nitratos / Óxido nítrico", "Probióticos del kéfir"],
    brain_connection: "La remolacha aporta nitratos que mejoran el flujo sanguíneo cerebral un 16%. Las betalaínas cruzan la barrera hematoencefálica. El kéfir añade la mayor diversidad probiótica de cualquier fermento (40+ cepas). Reset profundo para cerebro e intestino.",
    glossary_slug: "kefir"
  },
  {
    slug: "ayran", name: "Ayran", country: "Turquía",
    country_code: "TR", region: "Anatolia", lat: 39.9, lng: 32.9,
    mood: "calma",
    tagline: "Yogur salado batido: la calma turca",
    ferment_type: "Yogur batido con agua y sal",
    teaser: "Yogur, agua, sal. Batido hasta espumoso. Turquía lo bebe con cada comida. Simple. Ancestral. Funcional.",
    probiotic_strains: ["Lactobacillus bulgaricus", "Streptococcus thermophilus"],
    key_compounds: ["Calcio biodisponible", "Triptófano", "Electrolitos"],
    brain_connection: "El yogur batido repone electrolitos que regulan la transmisión nerviosa. El triptófano alimenta la vía serotonina. La textura espumosa y fría activa receptores orales conectados con el nervio vago — calmando el sistema parasimpático con cada sorbo.",
    glossary_slug: null
  },
  {
    slug: "tempeh-world", name: "Tempeh", country: "Indonesia",
    country_code: "ID", region: "Sudeste Asiático", lat: -6.2, lng: 106.8,
    mood: "focus",
    tagline: "Soja transformada por un hongo: proteína viva",
    ferment_type: "Fermentación fúngica (Rhizopus oligosporus)",
    teaser: "Soja inoculada con Rhizopus — un hongo que teje micelio blanco uniendo los granos. Proteína completa, vegetal, viva.",
    probiotic_strains: ["Rhizopus oligosporus"],
    key_compounds: ["Isoflavonas biodisponibles", "Vitamina B12 (trazas)", "Proteína completa"],
    brain_connection: "Rhizopus predigiere las isoflavonas de la soja aumentando su biodisponibilidad como fitoestrógenos — relevante para mujeres en menopausia. Proteína completa con todos los aminoácidos para neurotransmisores.",
    glossary_slug: null
  },
  {
    slug: "chicha-morada", name: "Chicha Morada", country: "Perú",
    country_code: "PE", region: "América del Sur", lat: -12.0, lng: -77.0,
    mood: "social",
    tagline: "Maíz morado fermentado: antocianinas para brindar",
    ferment_type: "Fermentación natural (maíz morado)",
    teaser: "Maíz morado con piña, canela, clavo y lima. Color violeta intenso que es pura antocianina — el pigmento más neuroprotector del mundo vegetal.",
    probiotic_strains: ["Lactobacillus", "Saccharomyces"],
    key_compounds: ["Antocianinas (cianidina-3-glucósido)", "Vitamina C", "Polifenoles"],
    brain_connection: "El maíz morado tiene la mayor concentración de antocianinas de cualquier cereal — cruzan la barrera hematoencefálica y protegen las neuronas. La fermentación multiplica la biodisponibilidad. La canela estabiliza glucosa. Brindis ancestral con beneficio neuronal.",
    glossary_slug: null
  },
  {
    slug: "skyr", name: "Skyr", country: "Islandia",
    country_code: "IS", region: "Europa Nórdica", lat: 64.1, lng: -21.9,
    mood: "reset",
    tagline: "El yogur vikingo: triple proteína, cero grasa",
    ferment_type: "Fermentación con bacterias termófilas",
    teaser: "Técnicamente un queso fresco. Tres veces más proteína que el yogur griego. Los vikingos lo llevaban en sus expediciones.",
    probiotic_strains: ["Streptococcus thermophilus", "Lactobacillus delbrueckii"],
    key_compounds: ["Caseína micelar", "Triptófano x3", "Calcio concentrado"],
    brain_connection: "Triple proteína = triple triptófano. La caseína micelar libera aminoácidos lentamente — síntesis de serotonina sostenida toda la noche. El calcio concentrado regula la excitabilidad neuronal. Los probióticos termófilos llegan vivos al colon.",
    glossary_slug: "skyr"
  },
  {
    slug: "nukazuke", name: "Nukazuke", country: "Japón",
    country_code: "JP", region: "Asia Oriental", lat: 35.0, lng: 135.8,
    mood: "reset",
    tagline: "Encurtidos en salvado de arroz: el jardín microbiano japonés",
    ferment_type: "Fermentación láctica en nukadoko (salvado de arroz)",
    teaser: "Verduras sumergidas en un lecho de salvado que se remueve cada día con las manos. Algunos nukadokos tienen más de 100 años.",
    probiotic_strains: ["L. plantarum", "L. brevis", "Saccharomyces"],
    key_compounds: ["Vitaminas B1, B2, B6", "GABA", "Ácido láctico"],
    brain_connection: "El nukadoko transfiere vitaminas B del salvado a las verduras — B1 (energía cerebral), B6 (síntesis de serotonina y GABA). El ritual diario de remover con las manos es mindfulness táctil — conexión con un ecosistema vivo.",
    glossary_slug: "nukazuke"
  }
];

async function run() {
  console.log("Iniciando inyección de fermentos del mundo...");
  
  for (const item of ferments) {
    const { data: inserted, error: insertErr } = await supabase
      .from('ferments_world')
      .upsert({ ...item, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
      .select();

    if (insertErr) {
      console.error(`❌ Error insertando ${item.slug}:`, insertErr.message);
      continue;
    }
    console.log(`✅ Fermento insertado: ${item.name}`);
  }

  console.log("Completado.");
}

run();
