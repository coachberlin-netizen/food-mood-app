const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const recipes = [
  // CATEGORÍA 1 — Bebidas Energéticas con Guaraná
  {
    id: "adrenalino-guarana-espresso",
    nombre_es: "Adrenalino Guaraná Espresso",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2g guaraná en polvo" },
      { ingrediente: "60ml doble espresso" },
      { ingrediente: "25ml sirope de cítricos" },
      { ingrediente: "100ml agua tónica" },
      { ingrediente: "hielo" },
      { ingrediente: "1 tsp azúcar de caña" }
    ],
    preparacion_es: [
      { paso: "Agita en coctelera hielo + sirope + guaraná + espresso + tónica." },
      { paso: "Sirve en vaso alto." }
    ],
    nota_food_mood_es: "Guaraná contiene cafeína de liberación lenta (doble potencia que el café normal) + doble espresso para activación inmediata. Energía + foco mental + dopamina.",
    tags: ["activación", "guaraná", "energía"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "te-amazonico-guarana",
    nombre_es: "Té Amazónico de Guaraná",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2g guaraná en polvo" },
      { ingrediente: "250ml agua caliente" },
      { ingrediente: "1 rodaja jengibre fresco" },
      { ingrediente: "1 tsp miel cruda" },
      { ingrediente: "zumo de ½ limón" }
    ],
    preparacion_es: [
      { paso: "Hierve el agua, añade guaraná + jengibre, infusiona 5 min." },
      { paso: "Añade miel y limón al servir." }
    ],
    nota_food_mood_es: "Guaraná duplica la energía del té verde; antioxidantes 10x superiores al té verde. Claridad mental + antioxidante + anti-fatiga.",
    tags: ["activación", "guaraná", "té"],
    tiempo_preparacion_min: 8,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "latte-curcuma-guarana",
    nombre_es: "Latte de Cúrcuma & Guaraná (Golden Energy)",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2g guaraná" },
      { ingrediente: "1 tsp cúrcuma" },
      { ingrediente: "½ tsp canela" },
      { ingrediente: "pizca de pimienta negra" },
      { ingrediente: "200ml leche de cáñamo" },
      { ingrediente: "1 tsp miel" },
      { ingrediente: "pizca vainilla" }
    ],
    preparacion_es: [
      { paso: "Calienta la leche, bate con cúrcuma + canela + guaraná + pimienta." },
      { paso: "Añade miel y vainilla. Espuma al servir." }
    ],
    nota_food_mood_es: "Cúrcuma antiinflamatoria + guaraná estimulante + leche de cáñamo con omega-3. Energía antiinflamatoria + enfoque sostenido.",
    tags: ["activación", "cúrcuma", "guaraná"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "cacao-especiado-amazonico",
    nombre_es: "Cacao Especiado Amazónico",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tbsp nibs de cacao" },
      { ingrediente: "2g guaraná" },
      { ingrediente: "1 palo canela" },
      { ingrediente: "pizca cayena" },
      { ingrediente: "150ml leche vegetal" },
      { ingrediente: "pizca vainilla" },
      { ingrediente: "1 tsp miel" }
    ],
    preparacion_es: [
      { paso: "Infusiona nibs + canela en leche caliente 10 min. Cuela, añade guaraná + cayena + miel. Bate." }
    ],
    nota_food_mood_es: "Cacao con teobromina + guaraná + cayena activa circulación y endorfinas. Endorfinas + calor + activación sensorial.",
    tags: ["activación", "cacao", "guaraná"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "diy-energy-drink-guarana",
    nombre_es: "DIY Energy Drink Guaraná & Té Verde Frambuesa",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "¼ tsp guaraná en polvo" },
      { ingrediente: "¼ tsp té verde matcha" },
      { ingrediente: "sirope de frambuesa natural" },
      { ingrediente: "350ml agua fría" },
      { ingrediente: "hielo" },
      { ingrediente: "zumo ½ limón" }
    ],
    preparacion_es: [
      { paso: "Disuelve guaraná + matcha en 50ml agua caliente." },
      { paso: "Añade resto agua fría + sirope + limón + hielo. Remueve bien." }
    ],
    nota_food_mood_es: "Sinergia cafeína + L-teanina del té verde = energía sin ansiedad. Foco calmado + energía limpia.",
    tags: ["activación", "guaraná", "matcha"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  // CATEGORÍA 2 — Smoothies & Bowls Activadores
  {
    id: "smoothie-tropical-guarana-mango",
    nombre_es: "Smoothie Tropical Guaraná & Mango",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tsp guaraná" },
      { ingrediente: "1 mango maduro" },
      { ingrediente: "zumo de 1 lima" },
      { ingrediente: "150ml leche de coco" },
      { ingrediente: "1 tsp miel" },
      { ingrediente: "hielo" }
    ],
    preparacion_es: [
      { paso: "Bate todo en licuadora. Sirve inmediatamente con rodaja de lima." }
    ],
    nota_food_mood_es: "Vitamina C + triptófano del mango + guaraná = serotonina + energía. Serotonina + activación tropical.",
    tags: ["activación", "smoothie", "mango"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "smoothie",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "power-smoothie-verde-guarana",
    nombre_es: "Power Smoothie Verde Guaraná-Aguacate",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tsp guaraná" },
      { ingrediente: "1 puñado espinacas" },
      { ingrediente: "½ aguacate maduro" },
      { ingrediente: "1 plátano" },
      { ingrediente: "200ml leche almendras" },
      { ingrediente: "1 tsp spirulina opcional" }
    ],
    preparacion_es: [
      { paso: "Licúa todo. Sirve en vaso alto. Decora con semillas de cáñamo." }
    ],
    nota_food_mood_es: "Magnesio del aguacate + espinaca con hierro + guaraná = calma activa. Magnesio + energía sin estimulación excesiva.",
    tags: ["activación", "aguacate", "verde"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "smoothie",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "bowl-acai-guarana-amazonico",
    nombre_es: "Bowl Açai & Guaraná Amazónico",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "100g açai congelado" },
      { ingrediente: "1 tsp guaraná" },
      { ingrediente: "½ plátano" },
      { ingrediente: "granola" },
      { ingrediente: "miel" },
      { ingrediente: "coco rallado" },
      { ingrediente: "frutos rojos frescos" }
    ],
    preparacion_es: [
      { paso: "Bate açai + guaraná + plátano hasta cremoso. Vierte en bowl." },
      { paso: "Decora con granola + frutos + miel." }
    ],
    nota_food_mood_es: "Açai con antocianinas para dopamina + guaraná para activación prolongada. Dopamina + antioxidantes + energía amazónica.",
    tags: ["activación", "açai", "guaraná"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "bowl",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "matcha-guarana-breakfast-bowl",
    nombre_es: "Matcha Guaraná Breakfast Bowl",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tsp matcha" },
      { ingrediente: "1 tsp guaraná" },
      { ingrediente: "80g avena" },
      { ingrediente: "200ml leche de avena" },
      { ingrediente: "almendras" },
      { ingrediente: "plátano" },
      { ingrediente: "miel" }
    ],
    preparacion_es: [
      { paso: "Prepara la avena con leche + matcha + guaraná revueltos." },
      { paso: "Sirve caliente con almendras + plátano + miel encima." }
    ],
    nota_food_mood_es: "Matcha L-teanina + cafeína guaraná = el estado de activación más limpio posible. Sinergia L-teanina + cafeína = foco zen.",
    tags: ["activación", "matcha", "avena"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "bowl",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "budin-chia-tropical-guarana",
    nombre_es: "Budín de Chía Tropical con Guaraná",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tsp guaraná" },
      { ingrediente: "3 tbsp semillas chía" },
      { ingrediente: "250ml leche de coco" },
      { ingrediente: "mango en cubos" },
      { ingrediente: "maracuyá" },
      { ingrediente: "1 tsp miel" }
    ],
    preparacion_es: [
      { paso: "Mezcla guaraná + chía + leche de coco. Refrigera 4h o noche." },
      { paso: "Sirve con mango + maracuyá + miel encima." }
    ],
    nota_food_mood_es: "Omega-3 de chía para cerebro + serotonina del coco + guaraná sostenido. Serotonina + omega-3 cerebral + energía tropical.",
    tags: ["activación", "chía", "coco"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  // CATEGORÍA 3 — Recetas de Chef con Estimulantes Naturales
  {
    id: "cafe-etiope-ceremonia-spiced",
    nombre_es: "Café Etíope de Ceremonia Spiced Latte",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 shot espresso doble origen etíope" },
      { ingrediente: "3 vainas cardamomo molido" },
      { ingrediente: "½ tsp jengibre fresco rallado" },
      { ingrediente: "200ml leche de cabra o coco" },
      { ingrediente: "1 tsp azúcar de caña" }
    ],
    preparacion_es: [
      { paso: "Infusiona cardamomo + jengibre en leche caliente 5 min. Agrega espresso. Espuma. Sirve con pizca canela encima." }
    ],
    nota_food_mood_es: "Café de origen + cardamomo + jengibre = ritual activador ancestral. Ritual sensorial + dopamina + calor activador.",
    tags: ["activación", "café", "especias"],
    tiempo_preparacion_min: 12,
    dificultad: "medio",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tiramisu-activador-espresso-cacao",
    nombre_es: "Tiramisu Activador con Espresso & Cacao Raw",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 shots espresso frío" },
      { ingrediente: "200g mascarpone" },
      { ingrediente: "2 tbsp cacao 100% en polvo" },
      { ingrediente: "bizcochos savoiardi" },
      { ingrediente: "1 tbsp miel" },
      { ingrediente: "pizca sal" }
    ],
    preparacion_es: [
      { paso: "Bate mascarpone + miel + sal. Sumerge bizcochos en espresso. Monta en capas. Finaliza con cacao tamizado. Refrigera 2h." }
    ],
    nota_food_mood_es: "Espresso + cacao raw con teobromina + mascarpone con triptófano. Endorfinas + cafeína + comfort elegante.",
    tags: ["activación", "postre", "cacao"],
    tiempo_preparacion_min: 20,
    dificultad: "medio",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "ceviche-peruano-maca",
    nombre_es: "Ceviche Peruano con Leche de Tigre y Maca",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "300g corvina o lubina" },
      { ingrediente: "zumo 6 limas" },
      { ingrediente: "1 tsp maca en polvo" },
      { ingrediente: "1 ají amarillo" },
      { ingrediente: "½ cebolla morada" },
      { ingrediente: "cilantro" },
      { ingrediente: "sal" },
      { ingrediente: "1 tsp jengibre" }
    ],
    preparacion_es: [
      { paso: "Corta el pescado en cubos. Marina en leche de tigre (lima + maca + jengibre + ají). Reposa 10 min. Sirve con maíz cancha y camote." }
    ],
    nota_food_mood_es: "Maca peruana adaptógena + capsaicina ají amarillo + omega-3 del pescado. Adaptógeno + libido + activación sensorial peruana.",
    tags: ["activación", "ceviche", "maca"],
    tiempo_preparacion_min: 25,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "ramen-japones-miso-shiitake",
    nombre_es: "Ramen Japonés del Alma (Miso + Algas + Setas Shiitake)",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 tbsp miso rojo" },
      { ingrediente: "1 L caldo dashi" },
      { ingrediente: "fideos ramen" },
      { ingrediente: "setas shiitake" },
      { ingrediente: "alga nori" },
      { ingrediente: "1 huevo cocido" },
      { ingrediente: "cebollino" },
      { ingrediente: "aceite sésamo" },
      { ingrediente: "1 tsp jengibre" }
    ],
    preparacion_es: [
      { paso: "Calienta dashi. Disuelve miso. Añade setas + fideos cocidos. Sirve con huevo + nori + cebollino + aceite sésamo." }
    ],
    nota_food_mood_es: "Miso probiótico eje intestino-cerebro + glutamato umami = satisfacción profunda. Probióticos + umami + serotonina intestinal.",
    tags: ["activación", "ramen", "miso"],
    tiempo_preparacion_min: 30,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tagine-marroqui-azafran",
    nombre_es: "Tagine Marroquí de Cordero con Azafrán y Almendras",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "600g cordero" },
      { ingrediente: "½ tsp azafrán" },
      { ingrediente: "1 tsp ras el hanout" },
      { ingrediente: "1 cebolla" },
      { ingrediente: "100g almendras tostadas" },
      { ingrediente: "80g ciruelas pasas" },
      { ingrediente: "cilantro" },
      { ingrediente: "aceite oliva" }
    ],
    preparacion_es: [
      { paso: "Sofríe cebolla + especias + azafrán. Añade cordero, sella. Agrega agua y cocina 1h a fuego lento. Finaliza con almendras + ciruelas + cilantro." }
    ],
    nota_food_mood_es: "Azafrán (antidepresivo clínico probado) + especias + frutos secos ricos en magnesio. Azafrán antidepresivo + comfort profundo.",
    tags: ["activación", "tagine", "azafrán"],
    tiempo_preparacion_min: 75,
    dificultad: "difícil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  // CATEGORÍA 4 — Mediterráneo Activador
  {
    id: "nicoise-power-sardinas",
    nombre_es: "Ensalada Niçoise Power con Sardinas y Huevo",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 huevos duros" },
      { ingrediente: "1 lata sardinas en aceite oliva" },
      { ingrediente: "judías verdes" },
      { ingrediente: "tomates cherry" },
      { ingrediente: "aceitunas negras" },
      { ingrediente: "anchoas" },
      { ingrediente: "mostaza Dijon" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "limón" }
    ],
    preparacion_es: [
      { paso: "Blanquea judías. Monta ensalada con todos los ingredientes. Aliña con vinagreta mostaza-limón-oliva." }
    ],
    nota_food_mood_es: "Sardinas omega-3 anti-depresión + huevo con colina para memoria + oliva polifenoles. Omega-3 + colina cerebral + vitalidad mediterránea.",
    tags: ["activación", "omega-3", "mediterráneo"],
    tiempo_preparacion_min: 20,
    dificultad: "fácil",
    tipo_plato: "ensalada",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "salmon-pesto-rucula",
    nombre_es: "Salmón al Horno con Pesto de Rúcula y Nueces",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2 filetes salmón" },
      { ingrediente: "1 puñado rúcula" },
      { ingrediente: "50g nueces" },
      { ingrediente: "30g parmesano" },
      { ingrediente: "1 diente ajo" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "limón" },
      { ingrediente: "sal" }
    ],
    preparacion_es: [
      { paso: "Tritura rúcula + nueces + parmesano + ajo + aceite. Cubre salmón con pesto. Hornea 18 min a 180°C." }
    ],
    nota_food_mood_es: "Omega-3 del salmón + nueces con ácido alfa-linolénico + rúcula con hierro. Omega-3 + serotonina + energía sostenida.",
    tags: ["activación", "omega-3", "salmón"],
    tiempo_preparacion_min: 25,
    dificultad: "fácil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "gazpacho-andaluz",
    nombre_es: "Gazpacho Andaluz con Pimientos y Pepino",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1kg tomates maduros" },
      { ingrediente: "1 pimiento rojo" },
      { ingrediente: "1 pepino" },
      { ingrediente: "1 diente ajo" },
      { ingrediente: "aceite oliva virgen extra" },
      { ingrediente: "vinagre jerez" },
      { ingrediente: "sal" },
      { ingrediente: "agua fría" }
    ],
    preparacion_es: [
      { paso: "Licúa todo. Cuela finamente. Refrigera 2h. Sirve con hielo y un chorro de buen aceite oliva encima." }
    ],
    nota_food_mood_es: "Licopeno del tomate antiestrés + vitamina C pimiento para cortisol + hidratación profunda. Anti-cortisol + hidratación celular + bienestar mediterráneo.",
    tags: ["activación", "mediterráneo", "hidratación"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "sopa fría",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "espagueti-almejas-guindilla",
    nombre_es: "Espagueti con Almejas, Guindilla y Vino Blanco",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "300g espagueti" },
      { ingrediente: "500g almejas" },
      { ingrediente: "1 guindilla" },
      { ingrediente: "3 dientes ajo" },
      { ingrediente: "100ml vino blanco seco" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "perejil fresco" },
      { ingrediente: "sal" }
    ],
    preparacion_es: [
      { paso: "Saltea ajo + guindilla. Añade almejas + vino. Tapa 3 min. Mezcla con pasta cocida al dente. Perejil y aceite oliva al servir." }
    ],
    nota_food_mood_es: "Almejas con zinc para testosterona y ánimo + guindilla capsaicina + vino polifenoles. Zinc + capsaicina + placer sensorial.",
    tags: ["activación", "placer", "zinc"],
    tiempo_preparacion_min: 25,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "revuelto-esparragos-trufa",
    nombre_es: "Revuelto de Espárragos, Setas y Trufa",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "6 huevos" },
      { ingrediente: "200g espárragos verdes" },
      { ingrediente: "100g setas variadas" },
      { ingrediente: "aceite de trufa unas gotas" },
      { ingrediente: "mantequilla" },
      { ingrediente: "sal" },
      { ingrediente: "pimienta" },
      { ingrediente: "cebollino" }
    ],
    preparacion_es: [
      { paso: "Saltea espárragos + setas en mantequilla. Añade huevos batidos a fuego mínimo, revuelve despacio. Finaliza con aceite trufa + cebollino." }
    ],
    nota_food_mood_es: "Espárragos con folato anti-depresión + huevo con triptófano + trufa umami dopaminérgico. Folato + triptófano + dopamina umami.",
    tags: ["activación", "desayuno", "folato"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  // CATEGORÍA 5 — Snacks & Dulces Activadores
  {
    id: "bocados-energeticos-maca",
    nombre_es: "Bocados Energéticos Cacao-Dátil-Maca",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "10 dátiles Medjool" },
      { ingrediente: "2 tbsp cacao 100%" },
      { ingrediente: "1 tsp maca en polvo" },
      { ingrediente: "50g almendras" },
      { ingrediente: "1 tsp canela" },
      { ingrediente: "pizca sal marina" },
      { ingrediente: "coco rallado para rebozar" }
    ],
    preparacion_es: [
      { paso: "Tritura dátiles + almendras + cacao + maca + canela + sal. Forma bolitas. Reboza en coco. Refrigera 1h." }
    ],
    nota_food_mood_es: "Maca adaptógena + cacao teobromina + dátiles azúcar natural sostenido. Adaptógeno + endorfinas + energía natural.",
    tags: ["activación", "snack", "maca"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "snack",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "granola-activadora-guarana",
    nombre_es: "Granola Activadora con Guaraná y Cacao",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g copos avena" },
      { ingrediente: "1 tsp guaraná polvo" },
      { ingrediente: "2 tbsp cacao nibs" },
      { ingrediente: "50g nueces pecanas" },
      { ingrediente: "3 tbsp miel" },
      { ingrediente: "2 tbsp aceite coco" },
      { ingrediente: "1 tsp vainilla" },
      { ingrediente: "pizca sal" }
    ],
    preparacion_es: [
      { paso: "Mezcla todo. Hornea 25 min a 160°C removiendo cada 10 min. Deja enfriar. Guarda en tarro hermético." }
    ],
    nota_food_mood_es: "Avena con triptófano + guaraná sostenido + cacao teobromina = desayuno perfecto. Desayuno activador + triptófano + energía guaraná.",
    tags: ["activación", "snack", "granola"],
    tiempo_preparacion_min: 35,
    dificultad: "fácil",
    tipo_plato: "snack",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "chocolate-negro-cayena",
    nombre_es: "Chocolate Negro 85% con Pimiento de Cayena y Sal Rosa",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g chocolate 85% cacao" },
      { ingrediente: "1 tsp cayena" },
      { ingrediente: "flor de sal" },
      { ingrediente: "ralladura naranja opcional" }
    ],
    preparacion_es: [
      { paso: "Derrite chocolate al baño maría. Extiende en papel. Espolvorea cayena + sal + naranja. Refrigera 30 min. Rompe en piezas." }
    ],
    nota_food_mood_es: "Chocolate oscuro con serotonina + cayena capsaicina activa circulación + sal minerales. Serotonina + endorfinas + activación sensorial.",
    tags: ["activación", "snack", "cacao"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "snack",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "parfait-yogur-pistachos",
    nombre_es: "Parfait de Yogur Griego, Pistachos y Miel de Manuka",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g yogur griego entero" },
      { ingrediente: "40g pistachos tostados sin sal" },
      { ingrediente: "2 tbsp miel de manuka" },
      { ingrediente: "arándanos frescos" },
      { ingrediente: "1 tsp canela" }
    ],
    preparacion_es: [
      { paso: "Monta en vaso: yogur + miel + pistachos + arándanos. Espolvorea canela encima. Sirve frío." }
    ],
    nota_food_mood_es: "Yogur griego probiótico eje intestino-cerebro + pistachos con melatonina + miel de manuka antibacteriana. Probióticos + melatonina + microbiota.",
    tags: ["activación", "yogur", "probiótico"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "te-marroqui-azafran",
    nombre_es: "Té Marroquí de Menta con Azafrán y Guaraná",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "2g guaraná en polvo" },
      { ingrediente: "6 hebras azafrán" },
      { ingrediente: "1 puñado hojas menta fresca" },
      { ingrediente: "300ml agua caliente" },
      { ingrediente: "2 tsp azúcar de caña o miel" },
      { ingrediente: "1 palo canela" }
    ],
    preparacion_es: [
      { paso: "Infusiona azafrán + canela 3 min en agua caliente. Añade menta + guaraná. Reposa 3 min. Endulza. Sirve en vaso de cristal." }
    ],
    nota_food_mood_es: "Azafrán (antidepresivo probado clínicamente) + menta estimulante + guaraná sostenido. Antidepresivo natural + activación ceremonial + ritual de bienestar.",
    tags: ["activación", "té", "azafrán"],
    tiempo_preparacion_min: 8,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  }
];

async function insertRecipes() {
  console.log('Inserting 25 recipes in batches of 5...');
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
