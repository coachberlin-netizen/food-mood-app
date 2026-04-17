const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const recipes = [
  /* ── BLOQUE I: TÉ VERDE ── */
  {
    id: "granita-te-verde-bergamota",
    nombre_es: "Granita de Té Verde, Bergamota y Miel de Acacia",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "500ml té verde ceremonial bien concentrado (doble cantidad de hojas)" },
      { ingrediente: "ralladura 1 bergamota o cáscara seca" },
      { ingrediente: "3 tbsp miel de acacia" },
      { ingrediente: "zumo ½ limón" },
      { ingrediente: "pizca sal marina" }
    ],
    preparacion_es: [
      { paso: "Prepara té verde muy concentrado, infusiona 3 min a 70°C." },
      { paso: "Añade bergamota + miel + limón. Enfría completamente." },
      { paso: "Vierte en bandeja y congela 3h. Rasca con tenedor cada hora para crear cristales." },
      { paso: "Sirve en copa con flor de lavanda encima." }
    ],
    nota_food_mood_es: "SORPRESA: Una granita italiana nootrópica. L-teanina (ondas alfa, calma activa) + bergamota (sistema nervioso parasimpático) + miel de acacia (glucosa estable). Foco sin ansiedad.",
    tags: ["alerta_tranquila", "L-teanina", "bergamota_ansiolitica", "activación"],
    tiempo_preparacion_min: 190,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "soba-caldo-te-verde-miso",
    nombre_es: "Fideos Soba en Caldo de Té Verde y Miso Blanco",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g fideos soba" },
      { ingrediente: "1L agua" },
      { ingrediente: "2 tbsp té verde en hojas" },
      { ingrediente: "3 tbsp miso blanco" },
      { ingrediente: "1 hoja nori" },
      { ingrediente: "4 setas shiitake" },
      { ingrediente: "1 cebolleta" },
      { ingrediente: "jengibre fresco" },
      { ingrediente: "aceite sésamo" },
      { ingrediente: "sésamo tostado" },
      { ingrediente: "1 huevo poché opcional" }
    ],
    preparacion_es: [
      { paso: "Hierve agua, apaga, infusiona té verde 3 min, cuela." },
      { paso: "Disuelve miso en el caldo (no hirviendo). Cuece soba aparte." },
      { paso: "Sirve fideos en caldo miso-té verde con setas, nori, cebolleta y huevo." }
    ],
    nota_food_mood_es: "SORPRESA: Caldo hecho con té verde (estilo kaiseki). L-teanina + glutamato (miso) = doble activación serena. Soba (rutina) para capilares cerebrales. Umami + serotonina intestinal.",
    tags: ["umami_mood", "L-teanina", "probiótico", "activación"],
    tiempo_preparacion_min: 20,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "helado-matcha-tahini-sin-heladera",
    nombre_es: "Helado de Matcha y Tahini (Sin heladera)",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "3 plátanos maduros congelados" },
      { ingrediente: "2 tsp matcha ceremonial" },
      { ingrediente: "3 tbsp tahini crudo" },
      { ingrediente: "1 tbsp miel" },
      { ingrediente: "pizca sal" },
      { ingrediente: "pizca vainilla" },
      { ingrediente: "nibs de cacao para decorar" }
    ],
    preparacion_es: [
      { paso: "Tritura plátanos congelados hasta cremoso." },
      { paso: "Añade matcha + tahini + miel + sal + vainilla. Mezcla hasta homogéneo." },
      { paso: "Sirve inmediatamente como soft-serve o congela 1h más. Decora con nibs de cacao." }
    ],
    nota_food_mood_es: "SORPRESA: Helado cremoso nootrópico sin lácteos ni azúcar. El tahini aporta el perfil más completo de aminoácidos. Matcha (L-teanina) + tahini (triptófano) + plátano (transporte).",
    tags: ["dopamina", "L-teanina", "placer_activo", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "kombucha-te-verde-hibisco-jengibre",
    nombre_es: "Kombucha de Té Verde, Hibisco y Jengibre",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1L kombucha base de té verde" },
      { ingrediente: "3 flores hibisco secas" },
      { ingrediente: "2cm jengibre fresco" },
      { ingrediente: "1 rodaja limón" },
      { ingrediente: "agua con gas" },
      { ingrediente: "hielo" },
      { ingrediente: "romero fresco" }
    ],
    preparacion_es: [
      { paso: "Infusiona hibisco + jengibre en la kombucha 24h en frío." },
      { paso: "Cuela. Sirve en copa de vino con hielo, gas, limón y rama romero." }
    ],
    nota_food_mood_es: "SORPRESA: Kombucha de autor pro-serotonínica. Hibisco (anti-cortisol) + jengibre (circulación) + kombucha (microbiota). Calma activa y salud intestinal.",
    tags: ["gut_brain", "probiótico", "antioxidante", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE II: ROMERO ── */
  {
    id: "aceite-romero-frio-memoria",
    nombre_es: "Aceite de Romero en Frío — 'El Aceite de la Memoria'",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "500ml aceite oliva virgen extra" },
      { ingrediente: "4 ramas romero fresco (secado al sol)" },
      { ingrediente: "3 dientes ajo" },
      { ingrediente: "1 tsp pimienta negra en grano" }
    ],
    preparacion_es: [
      { paso: "Seca el romero completamente (crucial para evitar botulismo)." },
      { paso: "Introduce en botella con ajo + pimienta. Cubre con aceite." },
      { paso: "Macera 2 semanas en oscuridad. Usa en crudo sobre platos calientes." }
    ],
    nota_food_mood_es: "SORPRESA: Aceite nootrópico en frío. El ácido rosmarínico inhibe la enzima que destruye la acetilcolina. Upgrade cognitivo inmediato en cada gota.",
    tags: ["acetilcolina", "memoria", "nootropical", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "acompañamiento",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "limonada-romero-azahar-miel",
    nombre_es: "Limonada de Romero, Miel y Agua de Azahar",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "Zumo de 4 limones" },
      { ingrediente: "1L agua fría" },
      { ingrediente: "2 ramas romero" },
      { ingrediente: "3 tbsp miel cruda" },
      { ingrediente: "2 tsp agua de azahar" }
    ],
    preparacion_es: [
      { paso: "Infusiona romero en 200ml agua caliente 30 min. Enfría." },
      { paso: "Mezcla con zumo limón + miel + agua de azahar (el ansiolítico más antiguo) + agua fría." }
    ],
    nota_food_mood_es: "SORPRESA: Agua de azahar (neroli → GABA-like) + romero (acetilcolina). Una bomba cognitivo-calmante del Mediterráneo ancestral.",
    tags: ["acetilcolina", "ansiolítico", "ritual_beverage", "activación"],
    tiempo_preparacion_min: 40,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "focaccia-romero-nueces-uva",
    nombre_es: "Focaccia de Romero, Nueces y Uva Negra",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "500g harina fuerza" },
      { ingrediente: "350ml agua tibia" },
      { ingrediente: "7g levadura seca" },
      { ingrediente: "80ml aceite oliva" },
      { ingrediente: "4 ramas romero" },
      { ingrediente: "150g uvas negras" },
      { ingrediente: "80g nueces" },
      { ingrediente: "flor de sal" }
    ],
    preparacion_es: [
      { paso: "Amansa masa básica, reposa 2h. Extiende en bandeja." },
      { paso: "Hunde uvas + nueces + romero. Riega con aceite y flor de sal." },
      { paso: "Hornea 25 min a 220°C." }
    ],
    nota_food_mood_es: "SORPRESA: El resveratrol de la uva horneada protege neuronas. El romero libera aceites esenciales volátiles que activan la memoria vía olfativa.",
    tags: ["resveratrol", "acetilcolina", "omega3", "activación"],
    tiempo_preparacion_min: 150,
    dificultad: "medio",
    tipo_plato: "pan",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE II CONTINUACIÓN: ROMERO + AJO NEGRO ── */
  {
    id: "pollo-romero-ajo-negro-limon",
    nombre_es: "Pollo al Romero, Ajo Negro y Limón Confitado",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 pollo troceado" },
      { ingrediente: "1 cabeza ajo negro (fermentado 40 días)" },
      { ingrediente: "4 ramas romero" },
      { ingrediente: "2 cuartos limón confitado" },
      { ingrediente: "200ml vino blanco seco" },
      { ingrediente: "aceite oliva" },
      { ingrediente: "flor de sal" },
      { ingrediente: "1 tsp miel" }
    ],
    preparacion_es: [
      { paso: "Sella pollo hasta dorado. Añade ajos negros enteros + romero + limón + vino." },
      { paso: "Tapa y cocina 35 min a fuego medio-bajo. Finaliza con miel y flor de sal." }
    ],
    nota_food_mood_es: "SORPRESA: El ajo negro duplica los antioxidantes del fresco. Activa dopamina (S-alilcisteína) + acetilcolina (romero) + placer umami simultáneamente.",
    tags: ["dopamina", "acetilcolina", "umami_profundo", "activación"],
    tiempo_preparacion_min: 45,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "mantequilla-romero-miso-miel",
    nombre_es: "Mantequilla de Romero, Miso y Miel — 'El Spread del Foco'",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "150g mantequilla sin sal (pomada)" },
      { ingrediente: "1 tbsp romero picado muy fino" },
      { ingrediente: "1 tbsp miso blanco" },
      { ingrediente: "1 tsp miel cruda" },
      { ingrediente: "ralladura limón" },
      { ingrediente: "pimienta negra" }
    ],
    preparacion_es: [
      { paso: "Bate mantequilla hasta pomada. Incorpora romero + miso + miel + ralladura + pimienta." },
      { paso: "Forma rulo en papel film. Refrigera 2h. Sirve sobre pan tostado o pasta." }
    ],
    nota_food_mood_es: "SORPRESA: La primera mantequilla nootrópica. Romero (inhibe destrucción de acetilcolina) + miso (probiótico → serotonina) + miel (energía cerebral).",
    tags: ["acetilcolina", "umami", "snack_cognitivo", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "acompañamiento",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE III: LAVANDA ── */
  {
    id: "tarta-limon-lavanda-provenzal",
    nombre_es: "Tarta de Limón y Lavanda al Estilo Provenzal",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g galletas digestive" },
      { ingrediente: "80g mantequilla derretida" },
      { ingrediente: "4 huevos" },
      { ingrediente: "150ml zumo limón" },
      { ingrediente: "150g azúcar" },
      { ingrediente: "100g mantequilla" },
      { ingrediente: "1 tsp flores lavanda culinary grade" }
    ],
    preparacion_es: [
      { paso: "Tritura galletas, prensa en molde. Cocina relleno (zumo+huevo+azúcar) sin hervir hasta espesar." },
      { paso: "Añade mantequilla + lavanda + vainilla. Vierte sobre base. Refrigera 4h." }
    ],
    nota_food_mood_es: "SORPRESA: El linalool de la lavanda actúa sobre receptores GABA como un ansiolítico natural. Calma profunda sin sedación.",
    tags: ["GABA", "ansiolítico", "calma_activa", "activación"],
    tiempo_preparacion_min: 270,
    dificultad: "medio",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "panna-cotta-lavanda-miel",
    nombre_es: "Panna Cotta de Lavanda y Miel de Flores Silvestres",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "500ml nata 35%" },
      { ingrediente: "3 tbsp miel flores silvestres" },
      { ingrediente: "1 tsp flores lavanda" },
      { ingrediente: "4 hojas gelatina" },
      { ingrediente: "frutos rojos" }
    ],
    preparacion_es: [
      { paso: "Calienta nata + lavanda + miel 5 min (sin hervir). Cuela." },
      { paso: "Añade gelatina hidratada. Vierte en moldes y refrigera 4h. Sirve con frutos rojos." }
    ],
    nota_food_mood_es: "SORPRESA: La panna cotta más serena. Activa la ruta triptófano → serotonina → melatonina justo antes de dormir. Ritual de sueño elegante.",
    tags: ["GABA", "melatonina", "postre_calma", "activación"],
    tiempo_preparacion_min: 250,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "latte-lavanda-avena-cardamomo",
    nombre_es: "Latte de Lavanda, Avena y Cardamomo",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "300ml leche avena" },
      { ingrediente: "1 tsp flores lavanda" },
      { ingrediente: "2 vainas cardamomo machacadas" },
      { ingrediente: "1 tbsp miel" }
    ],
    preparacion_es: [
      { paso: "Calienta leche con lavanda + cardamomo (abre receptores olfativos) a 70°C, infusiona 5 min. Cuela." },
      { paso: "Añade miel y espuma. Sirve con pizca de canela." }
    ],
    nota_food_mood_es: "SORPRESA: El late ritual de las cafeterías de Portland. Lavanda (GABA) + cardamomo (cineol → humor) + avena (triptófano prebiótico). Calma instantánea.",
    tags: ["GABA", "calma_activa", "ritual_tarde", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE IV: HIBISCO ── */
  {
    id: "agua-fresca-hibisco-rosa-mosqueta",
    nombre_es: "Agua Fresca de Hibisco, Rosa Mosqueta y Jengibre",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "10g flores hibisco secas" },
      { ingrediente: "5g rosa mosqueta seca (20x vit C que naranja)" },
      { ingrediente: "3cm jengibre fresco" },
      { ingrediente: "1L agua" },
      { ingrediente: "2 tbsp miel" }
    ],
    preparacion_es: [
      { paso: "Infusiona hibisco + rosa mosqueta + jengibre en agua caliente 15 min. Cuela." },
      { paso: "Añade miel + limón y enfría. Sirve con hielo y menta. Color rubí espectacular." }
    ],
    nota_food_mood_es: "SORPRESA: El cortisol se desploma ante las antocianinas del hibisco y la vit C de la rosa mosqueta. Activación dopaminérgica rubí.",
    tags: ["anti_cortisol", "vitamina_C", "hidratación_mood", "activación"],
    tiempo_preparacion_min: 20,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "gelatina-viva-hibisco-kefir",
    nombre_es: "Gelatina Viva de Hibisco y Kéfir de Agua",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "500ml infusión hibisco concentrada" },
      { ingrediente: "250ml kéfir de agua (frío)" },
      { ingrediente: "4g agar-agar" },
      { ingrediente: "2 tbsp miel" }
    ],
    preparacion_es: [
      { paso: "Hierve hibisco con agar-agar 2 min. Enfría a <40°C para preservar bacterias." },
      { paso: "Añade kéfir vivo + miel. Vierte en moldes y refrigera 2h. Decora con flores comestibles." }
    ],
    nota_food_mood_es: "SORPRESA: Una gelatina probiótica. Hibisco (cortisol) + kéfir (serotonina intestinal). Coloniza tu microbiota mientras disfrutas el postre.",
    tags: ["probiótico", "anti_cortisol", "gut_brain", "activación"],
    tiempo_preparacion_min: 140,
    dificultad: "medio",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "ensalada-remolacha-hibisco-queso-cabra",
    nombre_es: "Ensalada de Remolacha Asada, Hibisco y Queso de Cabra",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "4 remolachas medianas" },
      { ingrediente: "100ml reducción té hibisco" },
      { ingrediente: "vinagre frambuesa" },
      { ingrediente: "100g queso cabra (triptófano + probiótico)" },
      { ingrediente: "rúcula (folato) y nueces" }
    ],
    preparacion_es: [
      { paso: "Asa remolachas 45 min a 200°C. Reduce hibisco con vinagre + miel hasta almíbar." },
      { paso: "Emulsiona con aceite. Monta rúcula + remolacha + queso + nueces + vinagreta." }
    ],
    nota_food_mood_es: "SORPRESA: Aliño de alta cocina con reducción de hibisco. Remolacha (nitratos → vasodilatación) + hibisco (anti-cortisol) + rúcula (folato). Salud cerebral total.",
    tags: ["dopamina", "anti_cortisol", "folato", "activación"],
    tiempo_preparacion_min: 60,
    dificultad: "medio",
    tipo_plato: "ensalada",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE V: ASHWAGANDHA ── */
  {
    id: "bombones-ashwagandha-cacao-datil",
    nombre_es: "Bombones de Ashwagandha, Cacao y Dátil",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g chocolate 85% (magnesio)" },
      { ingrediente: "8 dátiles Medjool" },
      { ingrediente: "1 tsp ashwagandha KSM-66 (withanólidos)" },
      { ingrediente: "almendras y tahini" }
    ],
    preparacion_es: [
      { paso: "Tritura dátiles + almendras + ashwagandha + tahini. Forma bolitas y congela 20 min." },
      { paso: "Baña en chocolate derretido y añade flor de sal. Refrigera 30 min." }
    ],
    nota_food_mood_es: "SORPRESA: Confitería funcional de Berlín. Ashwagandha (cortisol -27%) + cacao (magnesio + triptófano). Adaptación al estrés crónico deliciosa.",
    tags: ["adaptógeno", "anti_estrés", "cortisol", "activación"],
    tiempo_preparacion_min: 60,
    dificultad: "medio",
    tipo_plato: "snack",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "golden-milk-ashwagandha-curcuma",
    nombre_es: "Golden Milk de Ashwagandha, Cúrcuma y Pimienta Larga",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "300ml leche coco" },
      { ingrediente: "1 tsp ashwagandha KSM-66" },
      { ingrediente: "1 tsp cúrcuma" },
      { ingrediente: "¼ tsp pimienta larga molida (biodisponibilidad x15)" },
      { ingrediente: "miel y vainilla" }
    ],
    preparacion_es: [
      { paso: "Calienta leche a 70°C. Añade especias + ashwagandha." },
      { paso: "Bate con espumador y añade miel + vainilla. Ritual nocturno anti-inflamatorio." }
    ],
    nota_food_mood_es: "SORPRESA: La pimienta larga multiplica x15 la absorción de los withanólidos. Serotonina → melatonina nocturna potenciada y cerebralmente tranquila.",
    tags: ["adaptógeno", "antiinflamatorio", "ritual_nocturno", "activación"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "overnight-oats-ashwagandha-cacao-almendra",
    nombre_es: "Overnight Oats de Ashwagandha, Cacao y Mantequilla de Almendra",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "80g copos avena finos" },
      { ingrediente: "250ml leche avena" },
      { ingrediente: "1 tsp ashwagandha KSM-66" },
      { ingrediente: "1 tbsp cacao 100%" },
      { ingrediente: "2 tbsp mantequilla almendra" },
      { ingrediente: "1 tbsp miel y canela" }
    ],
    preparacion_es: [
      { paso: "Mezcla todos los ingredientes la noche anterior. Tapa y refrigera." },
      { paso: "Por la mañana añade plátano + nibs de cacao + hilo de miel. Desayuno anti-estrés total." }
    ],
    nota_food_mood_es: "SORPRESA: Activa el eje HPA desde el despertar. Ashwagandha (modula cortisol matutino) + avena (triptófano + beta-glucano). Energía sostenida sin picos.",
    tags: ["adaptógeno", "triptófano", "desayuno_antiestrés", "activación"],
    tiempo_preparacion_min: 8,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "chai-adaptogenos-ashwagandha-rooibos",
    nombre_es: "Chai de Adaptógenos — Ashwagandha, Rooibos y Especias Antiguas",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 tbsp rooibos hoja" },
      { ingrediente: "1 tsp ashwagandha KSM-66" },
      { ingrediente: "3 vaninas cardamomo + canela + clavo + jengibre" },
      { ingrediente: "300ml agua + 100ml leche coco" }
    ],
    preparacion_es: [
      { paso: "Hierve agua con especias + jengibre 5 min. Añade rooibos + ashwagandha, infusiona 4 min." },
      { paso: "Cuela y añade leche de coco caliente + miel. Sin cafeína." }
    ],
    nota_food_mood_es: "SORPRESA: El rooibos inhibe la secreción de cortisol vía aspalathina. Con ashwagandha es la bebida anti-estrés definitiva del Cabo Occidental.",
    tags: ["adaptógeno", "anti_estrés", "ritual_beverage", "activación"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE VI: BERGAMOTA ── */
  {
    id: "risotto-bergamota-azafran-parmesano",
    nombre_es: "Risotto de Bergamota, Azafrán y Parmesano",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "320g arroz Carnaroli" },
      { ingrediente: "1 bergamota (zumo + ralladura)" },
      { ingrediente: "10 hebras azafrán (safranal)" },
      { ingrediente: "60g parmesano rallado" },
      { ingrediente: "40g mantequilla fría" },
      { ingrediente: "1 chalota + vino blanco" }
    ],
    preparacion_es: [
      { paso: "Infusiona azafrán en caldo. Sofríe chalota, nácar el arroz, desglasa con vino." },
      { paso: "Talla el risotto con caldo + azafrán + bergamota. Manteca al final con parmesano y mantequilla." }
    ],
    nota_food_mood_es: "SORPRESA: Bergamota (activa el parasimpático) + azafrán (antidepresivo clínico Prozac-like). Antidepresivo natural + dopamina umami + placer profundo.",
    tags: ["dopamina", "ansiolítico", "placer_profundo", "activación"],
    tiempo_preparacion_min: 30,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "coctel-bergamota-te-verde-rosas",
    nombre_es: "Cóctel Sin Alcohol — Bergamota, Té Verde y Agua de Rosas",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "150ml té verde concentrado frío" },
      { ingrediente: "30ml zumo bergamota (o sirope)" },
      { ingrediente: "1 tsp agua de rosas (geraniol)" },
      { ingrediente: "agua con gas + hielo" }
    ],
    preparacion_es: [
      { paso: "Mezcla té + bergamota + rosas en copa balón con hielo." },
      { paso: "Completa con agua con gas. Decora con pétalos de rosa y rodaja de bergamota." }
    ],
    nota_food_mood_es: "SORPRESA: La trinidad de la calma elegante. Bergamota (ansiolítico) + Té Verde (waves alfa) + Rosas (geraniol GABA-like). Relajación total visual.",
    tags: ["ansiolítico", "L-teanina", "GABA_like", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE VII: SORPRESAS GLOBALES ── */
  {
    id: "kefir-curcuma-pina",
    nombre_es: "Kéfir de Agua Fermentado con Cúrcuma y Piña",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1L kéfir de agua fermentado 48h" },
      { ingrediente: "200g piña fresca (bromelina)" },
      { ingrediente: "1 tsp cúrcuma + jengibre + miel" }
    ],
    preparacion_es: [
      { paso: "Licúa piña. Mezcla con kéfir + cúrcuma + jengibre + miel + limón." },
      { paso: "Sirve frío sin colar (bebe en ayunas) para conservar todo el probiótico vivo." }
    ],
    nota_food_mood_es: "SORPRESA: Coloniza bacterias productoras de serotonina intestinal (95% del total). Piña ayuda a digerir proteínas que liberan triptófano. Ciencia real.",
    tags: ["gut_brain", "serotonina_intestinal", "probiótico_vivo", "activación"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "poke-atun-wakame-matcha",
    nombre_es: "Poke Bowl de Atún, Alga Wakame y Aliño Matcha-Tamari",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "200g atún rojo (omega-3)" },
      { ingrediente: "30g alga wakame (iodo tiroideo)" },
      { ingrediente: "matcha ceremonial" },
      { ingrediente: "tamari + sésamo + jengibre" }
    ],
    preparacion_es: [
      { paso: "Disuelve matcha en tamari a Tª ambiente. Marina atún 10 min." },
      { paso: "Monta bol con arroz, wakame, aguacate, edamame y atún. Aliña con matcha-tamari." }
    ],
    nota_food_mood_es: "SORPRESA: El iodo del wakame regula la tiroides (humor de base). Atún (DHA neuroprotector) + Matcha (L-teanina). Umami sofisticado nutricional.",
    tags: ["omega3", "iodo", "dopamina", "L-teanina", "activación"],
    tiempo_preparacion_min: 25,
    dificultad: "medio",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "sopa-fria-melon-rosas-menta",
    nombre_es: "Sopa Fría de Melón, Agua de Rosas y Menta — 'Calma Líquida'",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "½ melón maduro (adenosina)" },
      { ingrediente: "1 tsp agua de rosas (geraniol)" },
      { ingrediente: "10 hojas menta + limón + aceite oliva" }
    ],
    preparacion_es: [
      { paso: "Licúa melón + menta + rosas + limón. Refrigera 2h." },
      { paso: "Sirve frío con un hilo de aceite oliva y flores comestibles. Ansiolítico líquido." }
    ],
    nota_food_mood_es: "SORPRESA: El melón contiene adenosina que activa receptores de calma del SNC. Agua de rosas (GABA-like). El plato más refrescante neurológicamente.",
    tags: ["GABA_like", "hidratación", "calma_sensorial", "activación"],
    tiempo_preparacion_min: 130,
    dificultad: "fácil",
    tipo_plato: "sopa",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "caldo-hongos-adaptogenos-lions-mane",
    nombre_es: "Caldo de Hongos Adaptógenos — Reishi, Lion's Mane y Romero",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "10g Lion's Mane seco (estimula NGF/BDNF)" },
      { ingrediente: "5g Reishi seco (adaptógeno calma)" },
      { ingrediente: "3 ramas romero + miso blanco" }
    ],
    preparacion_es: [
      { paso: "Rehidrata hongos. Hierve con romero 45 min. Cuela." },
      { paso: "Disuelve miso en el caldo caliente. El caldo más nootrópico del planeta." }
    ],
    nota_food_mood_es: "SORPRESA: El Lion's Mane es el único alimento que estimula la producción de NGF/BDNF para crecimiento de nuevas neuronas. Neuroplasticidad líquida.",
    tags: ["neuroprotección", "BDNF", "acetilcolina", "focus_profundo", "activación"],
    tiempo_preparacion_min: 60,
    dificultad: "medio",
    tipo_plato: "sopa",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  }
];

async function insertRecipes() {
  console.log(`Inserting ${recipes.length} specialized surprising recipes with full editorial content...`);
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
  console.log('Finished master recipe insertions.');
}

insertRecipes();
