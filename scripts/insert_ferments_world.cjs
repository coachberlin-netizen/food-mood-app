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
    ingredients: [
      "250 g garbanzos secos",
      "1 cucharadita de esporas de Bacillus subtilis natto (natto starter)",
      "Agua filtrada"
    ],
    recipe_elaboration: "Remojar los garbanzos 12 horas. Cocer a fuego suave 40 min hasta tiernos pero enteros. Escurrir y dejar enfriar a 42 °C — si están más calientes la bacteria muere. Mezclar con el natto starter. Distribuir en recipiente tapado con papel de cocina (necesita airear). Fermentar a 40 °C durante 22-24 horas — en horno apagado con la luz encendida funciona bien. Guardar en nevera 24 horas antes de consumir. Se conserva 7 días en frío.",
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
    ingredients: [
      "150 g gochugaru (chile coreano en copos)",
      "100 g miso blanco o doenjang",
      "60 g arroz glutinoso cocido",
      "3 cucharadas de salsa de soja",
      "2 cucharadas de miel cruda",
      "1 cucharadita de sal marina"
    ],
    recipe_elaboration: "Mezclar bien todos los ingredientes hasta pasta homogénea. Trasladar a un tarro de cerámica o vidrio dejando 3 cm de espacio arriba. Cubrir con tela y asegurar con goma. Fermentar a temperatura ambiente 2-4 semanas, removiendo cada 2-3 días. Cuando el sabor sea profundo y ligeramente ácido está listo. Guardar en nevera hasta 6 meses.",
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
    ingredients: [
      "500 g soja amarilla seca",
      "Sal marina gruesa (1 kg aprox.)",
      "Agua filtrada",
      "Alga kombu (opcional, para mineralizar)"
    ],
    recipe_elaboration: "Cocer la soja 3-4 horas hasta muy blanda. Triturar caliente formando una pasta densa. Moldear en bloques rectangulares (meju) de unos 10 × 15 cm. Atar con paja y colgar 3 semanas en lugar seco y ventilado para que colonice moho natural. Preparar salmuera al 15-18% (150-180 g sal por litro). Sumergir los bloques en la salmuera con algas y dejar fermentar 2-3 meses al sol. Separar el líquido (ganjang) de la pasta (doenjang). La pasta continúa madurando en tarro cerrado otros 3-6 meses.",
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
    ingredients: [
      "250 g harina de teff integral",
      "350 ml agua filtrada a temperatura ambiente",
      "Pizca de sal marina"
    ],
    recipe_elaboration: "Mezclar la harina de teff con el agua hasta que no haya grumos. Cubrir el recipiente con un paño limpio y dejar fermentar a temperatura ambiente 48-72 horas — verás burbujas y olerá ligeramente ácido. Añadir la sal y remover. Calentar una sartén antiadherente a fuego medio-alto sin aceite. Verter un cucharón de masa y extender en círculo. Cocinar solo por un lado hasta que la superficie esté completamente mate y llena de agujeros (2-3 min). No dar la vuelta. Servir como plato y cubierto para los guisos.",
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
    ingredients: [
      "300 g maíz blanco, mijo o sorgo",
      "Agua filtrada abundante",
      "Leche, miel o canela para servir (opcional)"
    ],
    recipe_elaboration: "Remojar el cereal en agua durante 2-3 días, cambiando el agua una vez al día. La fermentación espontánea acidificará el grano — es normal que huela ligeramente ácido. Moler en húmedo o triturar con batidora potente añadiendo agua. Colar la masa con tela fina para obtener una pasta sedosa. Dejar reposar 12 horas más para que afine la fermentación. Cocer a fuego medio removiendo constantemente hasta obtener papilla cremosa (5-8 min). Servir con leche vegetal, miel y canela.",
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
    ingredients: [
      "200 g arroz de grano largo",
      "100 g urad dal (lenteja negra sin piel)",
      "1/4 cucharadita de sal marina",
      "Agua filtrada para remojar y moler",
      "Aceite de coco para la sartén"
    ],
    recipe_elaboration: "Remojar arroz y urad dal por separado en agua fría durante 6 horas. Escurrir. Moler cada uno por separado con poca agua hasta obtener pasta fina — el urad dal debe quedar muy suave y casi espumoso. Mezclar ambas pastas, añadir sal, y dejar fermentar 8-12 horas a temperatura cálida (cubierto con paño). La masa debe doblar su volumen y oler ligeramente ácido. Calentar sartén de hierro o antiadherente a fuego medio-alto. Engrasar con unas gotas de aceite de coco. Verter un cucharón y extender en espiral hasta crêpe fino. Cocinar 2-3 min por un lado hasta bordes dorados. Doblar y servir con chutney de coco.",
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
    ingredients: [
      "200 g yogur natural entero (o kéfir)",
      "100 ml agua fría",
      "1/4 cucharadita de cardamomo molido",
      "1 cucharadita de miel cruda",
      "Pizca de sal o azafrán (versión salada: comino tostado + menta)"
    ],
    recipe_elaboration: "Poner el yogur, el agua y el cardamomo en batidora. Batir a velocidad alta 1 minuto hasta que esté completamente espumoso y ligero — la textura cambia notablemente al airear. Añadir miel y batir 10 segundos más. Servir inmediatamente muy frío con hielo. Para lassi salado: sustituir miel por 1/2 cucharadita de comino tostado, menta fresca y pizca de sal. El secreto está en el batido prolongado, que incorpora aire y cambia la biodisponibilidad.",
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
    ingredients: [
      "Cáscaras y corazón de 1 piña madura (bien lavada)",
      "150 g piloncillo o azúcar moreno",
      "2 ramas de canela",
      "4 clavos de olor",
      "2 litros de agua filtrada"
    ],
    recipe_elaboration: "Lavar muy bien la piña con agua y cepillo — la cáscara es donde vive la levadura que lo fermenta. Poner cáscaras y corazón troceado en un tarro grande o jarra. Añadir el piloncillo, la canela y los clavos. Cubrir con agua filtrada — no usar agua del grifo con cloro. Tapar con tela o papel de cocina sujeto con goma. Dejar fermentar a temperatura ambiente 24-48 horas probando cada 12h. Cuando esté espumoso, ligeramente dulce y con acidez agradable está listo. Colar y refrigerar. Consumir en 3-4 días.",
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
    ingredients: [
      "1 col blanca mediana (aproximadamente 1 kg)",
      "10 g de sal marina sin yodo (1% del peso de la col)",
      "Opcional: semillas de alcaravea, eneldo seco o bayas de enebro"
    ],
    recipe_elaboration: "Retirar las hojas externas de la col y reservar una. Cortar en juliana muy fina. Pesar y calcular el 1% en sal. Mezclar col y sal en bol grande y amasar con fuerza 10-15 minutos hasta que suelte abundante jugo — no añadir agua. Añadir especias si se quieren. Compactar en tarro de vidrio presionando fuerte para que la col quede sumergida bajo su propio jugo. Colocar la hoja reservada encima como tapa. Cerrar sin apretar (necesita ventilar el CO₂). Fermentar a temperatura ambiente 2-4 semanas. Probar a los 5 días: ácido suave. A los 14: más complejo. A los 28: intenso y rico. Guardar en nevera una vez listo.",
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
    ingredients: [
      "500 g ciruelas silvestres o ciruelas ácidas (claudias verdes o amarillas)",
      "3 dientes de ajo",
      "1 cucharada de cilantro fresco picado",
      "1 cucharadita de eneldo seco",
      "1 chile rojo fresco (opcional)",
      "Sal marina al gusto",
      "Pizca de fenogreco molido (opcional, tradicional)"
    ],
    recipe_elaboration: "Cocer las ciruelas con un poco de agua a fuego suave 15-20 minutos hasta que se deshagan. Colar y separar la pulpa de los huesos y pieles. Mezclar la pulpa caliente con ajo machacado, hierbas, chile y sal. Dejar enfriar a temperatura ambiente. Trasladar a tarro de vidrio y fermentar 2-3 días a temperatura ambiente — el ácido natural de la ciruela inhibe patógenos. Probar: debe tener acidez viva, punto picante y aroma herbal intenso. Guardar en nevera hasta 3 semanas. Usar como salsa para carnes, legumbres o como aderezo.",
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
    ingredients: [
      "3 remolachas medianas (crudas o asadas)",
      "1 cebolla",
      "2 zanahorias",
      "1/4 col blanca",
      "1 patata (opcional)",
      "1 litro de caldo vegetal",
      "Sal, pimienta negra, eneldo fresco",
      "150 ml kéfir de leche (frío, directo de nevera)"
    ],
    recipe_elaboration: "Sofreír cebolla y zanahoria en aceite de oliva 5 minutos. Añadir col en juliana y caldo. Cocer 15 minutos. Incorporar remolacha rallada gruesa y patata en cubos. Cocer 15 minutos más. Salpimentar y añadir un chorrito de limón o vinagre de manzana para fijar el color rojo vivo de la remolacha. El truco es el contraste: servir el borscht humeante y en el momento de llevar a la mesa añadir una cucharada generosa de kéfir muy frío directamente. Se derrite lentamente formando espirales rosas. Espolvorear eneldo fresco.",
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
    ingredients: [
      "200 g yogur natural entero (griego o tradicional)",
      "100 ml agua muy fría",
      "1/4 cucharadita de sal marina"
    ],
    recipe_elaboration: "Poner el yogur, el agua y la sal en un recipiente alto. Batir con varillas eléctricas o batidora a velocidad máxima durante 60-90 segundos — el objetivo es incorporar el máximo de aire posible. Debe quedar con espuma abundante en la superficie y textura ligera, casi líquida. Servir inmediatamente en vaso alto con hielo. Añadir menta fresca si se quiere. El secreto es batir mucho y servir muy frío: el aire incorporado y la temperatura son parte de su efecto calmante.",
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
    ingredients: [
      "300 g soja amarilla seca (o garbanzos como alternativa)",
      "1 cucharada de vinagre blanco",
      "1 cucharadita de esporas de Rhizopus oligosporus (tempeh starter)",
      "Bolsas de plástico perforadas o hojas de plátano"
    ],
    recipe_elaboration: "Remojar la soja 12 horas. Escurrir y cocer 45 minutos hasta tierna pero no deshecha. Escurrir muy bien y extender en bandeja para que se seque completamente — la humedad excesiva pudre el tempeh. Dejar enfriar a menos de 35 °C. Mezclar con vinagre (acidifica el ambiente) y esporas homogéneamente. Distribuir en bolsas de plástico finas perforadas con aguja (cada 2 cm) o en hojas de plátano. El espesor no debe superar 3 cm. Fermentar a 30-32 °C durante 24-36 horas — en horno apagado con la luz funciona. Estará listo cuando esté completamente cubierto de micelio blanco firme. El olor debe ser a setas frescas y nuez.",
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
    ingredients: [
      "500 g maíz morado seco (granos y corontas)",
      "1/4 de piña (cáscara y corazón)",
      "2 ramas de canela",
      "6 clavos de olor",
      "Cáscara de 1 lima",
      "2 litros de agua",
      "Azúcar moreno al gusto",
      "Zumo de 2 limas"
    ],
    recipe_elaboration: "Hervir el maíz morado con la cáscara y corazón de piña, canela, clavos y cáscara de lima en los 2 litros de agua durante 50-60 minutos — el agua debe tener un color morado-negro intenso. Colar y descartar los sólidos. Añadir azúcar al gusto mientras está caliente y mezclar. Dejar enfriar completamente. Añadir el zumo de lima al final (el calor destruye la vitamina C). Para efecto probiótico: dejar fermentar tapado a temperatura ambiente 24-48 horas antes de refrigerar. Servir muy frío.",
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
    ingredients: [
      "2 litros de leche entera o desnatada",
      "2 cucharadas de skyr comercial o yogur natural como starter",
      "Opcional: cuajo animal o vegetal (pizca)"
    ],
    recipe_elaboration: "Calentar la leche en olla a 90 °C removiendo para evitar que se pegue. Apagar el fuego y dejar enfriar a 40 °C (la temperatura del starter es clave). Mezclar el starter con un poco de leche templada en taza, luego añadir al resto removiendo suavemente. Cubrir la olla con paños y mantener a 40 °C durante 5-8 horas — en horno con solo la luz encendida o en yogurtera. El resultado será una cuajada suave. Forrar un colador con tela de queso o paño limpio y verter la cuajada. Dejar escurrir en nevera 8-12 horas hasta consistencia muy espesa. Cuanto más tiempo escurra, más denso y proteico. Guardar en nevera hasta 10 días.",
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
    ingredients: [
      "1 kg salvado de arroz (nuka) tostado",
      "100 g sal marina",
      "700-800 ml agua filtrada",
      "2 trozos de alga kombu",
      "2 chiles rojos secos",
      "Trozo de jengibre fresco",
      "Verduras para encurtir: zanahoria, pepino, nabo, apio"
    ],
    recipe_elaboration: "Hervir el agua con la sal y dejar enfriar completamente. Mezclar el salvado con la salmuera fría hasta obtener textura de arcilla húmeda que se sostiene al apretarla. Añadir algas, chiles y jengibre. Trasladar a recipiente de cerámica o vidrio. Durante los primeros 7 días: remover el nukadoko con las manos cada día (mañana y noche) — la microbiota de tus manos coloniza el lecho y lo hace único. No encurtir nada aún. A partir del día 7-10: enterrar las verduras cortadas durante 12-24 horas. Extraer, lavar ligeramente y consumir. El nukadoko mejora con los años.",
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
