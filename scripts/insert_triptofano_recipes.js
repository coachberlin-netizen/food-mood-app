const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const recipes = [
  {
    id: "revuelto-huevo-esparragos-centeno",
    nombre_es: "Revuelto de Huevo, Espárragos y Pan de Centeno",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "3 huevos camperos" },
      { ingrediente: "6 espárragos verdes" },
      { ingrediente: "2 rebanadas pan centeno" },
      { ingrediente: "1 tsp cúrcuma" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "sal marina" },
      { ingrediente: "pimienta" },
      { ingrediente: "cebollino" }
    ],
    preparacion_es: [
      { paso: "Saltea espárragos cortados en aceite de oliva 3 min." },
      { paso: "Añade huevos batidos con cúrcuma a fuego mínimo. Revuelve despacio." },
      { paso: "Sirve sobre pan centeno tostado con cebollino." }
    ],
    nota_food_mood_es: "Huevos (triptófano + colina cerebral) + espárragos (folato antidepresivo) + centeno (carbohidrato de absorción lenta para transportar el triptófano). Serotonina matutina + energía cerebral + anti-inflamatorio.",
    tags: ["serotonina", "desayuno_activo", "folato", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "porridge-avena-platano-semillas",
    nombre_es: "Porridge de Avena con Plátano, Semillas de Calabaza y Miel",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "80g copos avena" },
      { ingrediente: "250ml leche de avena" },
      { ingrediente: "1 plátano maduro" },
      { ingrediente: "2 tbsp semillas calabaza tostadas" },
      { ingrediente: "1 tbsp miel cruda" },
      { ingrediente: "canela" },
      { ingrediente: "pizca sal" }
    ],
    preparacion_es: [
      { paso: "Cocina avena en leche 5 min revolviendo." },
      { paso: "Sirve con plátano en rodajas + semillas + miel + canela encima." }
    ],
    nota_food_mood_es: "Avena (triptófano + carbohidrato lento) + plátano (triptófano + azúcar natural transportador) + semillas calabaza (la fuente más concentrada de triptófano vegetal). Máximo triptófano biodisponible + serotonina.",
    tags: ["serotonina", "triptofano_maximo", "desayuno", "activación"],
    tiempo_preparacion_min: 8,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "bowl-pavo-asado-batata-rucula",
    nombre_es: "Bowl de Pavo Asado, Batata y Rúcula",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g pavo asado en tiras" },
      { ingrediente: "1 batata mediana asada" },
      { ingrediente: "1 puñado rúcula" },
      { ingrediente: "1 tsp tahini" },
      { ingrediente: "limón" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "semillas sésamo" },
      { ingrediente: "sal" }
    ],
    preparacion_es: [
      { paso: "Asa batata 35 min a 200°C." },
      { paso: "Monta bowl: rúcula + batata + pavo." },
      { paso: "Aliña con tahini diluido en limón + aceite + sésamo." }
    ],
    nota_food_mood_es: "Pavo = alimento más rico en triptófano animal + batata = carbohidrato que transporta el triptófano al cerebro + rúcula = folato + hierro. Serotonina + dopamina + energía sostenida.",
    tags: ["serotonina", "comida_mood", "proteina_completa", "activación"],
    tiempo_preparacion_min: 40,
    dificultad: "fácil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tostada-cottage-nueces-miel",
    nombre_es: "Tostada de Cottage, Nueces y Miel de Manuka",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 tostadas centeno" },
      { ingrediente: "150g queso cottage" },
      { ingrediente: "40g nueces" },
      { ingrediente: "1 tbsp miel manuka" },
      { ingrediente: "ralladura limón" },
      { ingrediente: "pizca canela" }
    ],
    preparacion_es: [
      { paso: "Tuesta el pan. Extiende cottage." },
      { paso: "Añade nueces rotas + miel + ralladura limón + canela." }
    ],
    nota_food_mood_es: "Queso cottage (triptófano + proteína) + pan de centeno (transporte al cerebro) + nueces (omega-3 para membrana neuronal). Triptófano + omega-3 + eje intestino-cerebro.",
    tags: ["serotonina", "snack_activo", "probiotico", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "snack",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "salmon-teriyaki-quinoa-brocoli",
    nombre_es: "Salmón Teriyaki con Quinoa y Brócoli",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 filetes salmón" },
      { ingrediente: "150g quinoa" },
      { ingrediente: "200g brócoli" },
      { ingrediente: "3 tbsp tamari" },
      { ingrediente: "1 tbsp miel" },
      { ingrediente: "1 tsp jengibre rallado" },
      { ingrediente: "aceite sésamo" },
      { ingrediente: "sésamo tostado" }
    ],
    preparacion_es: [
      { paso: "Marina salmón en tamari + miel + jengibre 20 min." },
      { paso: "Cocina quinoa. Saltea brócoli." },
      { paso: "Sella salmón en sartén 3 min por lado. Monta con aceite sésamo + sésamo." }
    ],
    nota_food_mood_es: "Salmón (triptófano + omega-3 neuroprotector) + quinoa (carbohidrato completo) + brócoli (sulforafano antidepresivo + B6). Serotonina + neuroprotección omega-3 + vitamina B6.",
    tags: ["omega3", "serotonina", "cena_mood", "activación"],
    tiempo_preparacion_min: 35,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "curry-tofu-boniato-coco",
    nombre_es: "Curry de Tofu y Boniato con Leche de Coco",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "300g tofu firme en cubos" },
      { ingrediente: "1 boniato" },
      { ingrediente: "1 lata leche de coco" },
      { ingrediente: "1 tbsp curry rojo" },
      { ingrediente: "1 tsp cúrcuma" },
      { ingrediente: "1 cebolla" },
      { ingrediente: "2 dientes ajo" },
      { ingrediente: "jengibre" },
      { ingrediente: "cilantro" },
      { ingrediente: "arroz basmati" }
    ],
    preparacion_es: [
      { paso: "Sofríe cebolla + ajo + jengibre. Añade especias + tofu + boniato + leche de coco." },
      { paso: "Cocina 20 min. Sirve con arroz + cilantro." }
    ],
    nota_food_mood_es: "Tofu (triptófano vegetal) + boniato (carbohidrato) + cúrcuma (antiinflamatoria) + coco (TCM energía cerebral). Triptófano vegetal + antiinflamatorio cerebral + serotonina.",
    tags: ["vegano", "serotonina", "gut_brain", "activación"],
    tiempo_preparacion_min: 30,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "ensalada-garbanzos-espinaca-girasol",
    nombre_es: "Ensalada Mediterránea de Garbanzos, Espinaca y Semillas de Girasol",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g garbanzos cocidos" },
      { ingrediente: "2 puñados espinaca baby" },
      { ingrediente: "3 tbsp semillas girasol tostadas" },
      { ingrediente: "tomates cherry" },
      { ingrediente: "pepino" },
      { ingrediente: "feta" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "vinagre balsámico" },
      { ingrediente: "orégano" }
    ],
    preparacion_es: [
      { paso: "Mezcla todos los ingredientes." },
      { paso: "Aliña con oliva + balsámico + orégano + sal." }
    ],
    nota_food_mood_es: "Garbanzos (triptófano + magnesio + B6) + espinaca (folato) + semillas girasol (triptófano + vitamina E). Folato antidepresivo + triptófano + minerales del sistema nervioso.",
    tags: ["folato", "triptofano", "almuerzo_ligero", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "ensalada",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "mousse-chocolate-aguacate",
    nombre_es: "Mousse de Chocolate Negro 85% con Aguacate",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "100g chocolate 85% derretido" },
      { ingrediente: "2 aguacates maduros" },
      { ingrediente: "2 tbsp cacao puro" },
      { ingrediente: "3 tbsp miel" },
      { ingrediente: "1 tsp vainilla" },
      { ingrediente: "pizca sal marina" },
      { ingrediente: "frutos rojos para decorar" }
    ],
    preparacion_es: [
      { paso: "Tritura aguacate + chocolate derretido + cacao + miel + vainilla + sal." },
      { paso: "Bate hasta cremoso. Refrigera 1h. Sirve con frutos rojos." }
    ],
    nota_food_mood_es: "Chocolate oscuro (triptófano + teobromina + magnesio) + aguacate (B6 cofactor serotonina). Serotonina + endorfinas + placer neurológico.",
    tags: ["serotonina", "endorfinas", "postre_activo", "activación"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "smoothie-noche-sleep-mood",
    nombre_es: "Smoothie Noche 'Sleep & Mood' — Plátano, Leche Tibia y Canela",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 plátano maduro" },
      { ingrediente: "200ml leche entera o avena tibia" },
      { ingrediente: "½ tsp canela" },
      { ingrediente: "pizca nuez moscada" },
      { ingrediente: "1 tsp miel" },
      { ingrediente: "pizca cúrcuma opcional" }
    ],
    preparacion_es: [
      { paso: "Licúa todo. Calienta ligeramente." },
      { paso: "Sirve en taza como ritual nocturno." }
    ],
    nota_food_mood_es: "Plátano (triptófano + potasio relajante muscular) + leche (caseína + triptófano) + canela (regula glucosa). Serotonina → melatonina → sueño reparador.",
    tags: ["melatonina", "serotonina", "ritual_nocturno", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tempeh-fermentado-arroz-miso",
    nombre_es: "Tempeh Fermentado Salteado con Arroz Integral y Miso",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g tempeh" },
      { ingrediente: "150g arroz integral cocido" },
      { ingrediente: "1 tbsp miso blanco" },
      { ingrediente: "1 tsp jengibre" },
      { ingrediente: "1 diente ajo" },
      { ingrediente: "tamari" },
      { ingrediente: "aceite sésamo" },
      { ingrediente: "cebollino" },
      { ingrediente: "sésamo" }
    ],
    preparacion_es: [
      { paso: "Saltea ajo + jengibre. Añade tempeh en dados, dora." },
      { paso: "Disuelve miso en poca agua tibia, añade al final. Sirve sobre arroz + cebollino + sésamo." }
    ],
    nota_food_mood_es: "Tempeh (triptófano + probióticos) + miso (probiótico eje intestino-cerebro) + arroz integral (carbohidrato + B vitaminas). Probiótico + triptófano + serotonina intestinal.",
    tags: ["probiotico", "triptofano", "gut_brain", "vegano", "activación"],
    tiempo_preparacion_min: 20,
    dificultad: "fácil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  }
];

async function insertRecipes() {
  console.log('Inserting 10 Triptófano recipes...');
  for (let i = 0; i < recipes.length; i += 5) {
    const batch = recipes.slice(i, i + 5);
    const { data, error } = await supabase
      .from('recetas')
      .upsert(batch, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error inserting batch ${i / 5 + 1}:`, error);
    } else {
      console.log(`Successfully inserted batch ${i / 5 + 1}!`);
    }
  }
  console.log('Finished insertions.');
}

insertRecipes();
