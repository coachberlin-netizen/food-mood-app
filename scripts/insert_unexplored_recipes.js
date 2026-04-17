const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const recipes = [
  /* ── BLOQUE I: FERMENTADOS MOOD DE AUTOR ── */
  {
    id: "kimchi-remolacha-jengibre-carmesi",
    nombre_es: "Kimchi de Remolacha y Jengibre — 'El Probiótico Carmesí'",
    mood_es: "Reset",
    ingredientes_es: [
      { ingrediente: "500g remolacha cruda pelada en juliana fina" },
      { ingrediente: "3cm jengibre fresco rallado" },
      { ingrediente: "4 dientes ajo picados" },
      { ingrediente: "1 tsp guindilla en copos (gochugaru)" },
      { ingrediente: "1 tsp sal marina sin yodo" },
      { ingrediente: "1 tsp azúcar de caña" },
      { ingrediente: "3 cebolletas en rodajas" },
      { ingrediente: "1 tsp semillas de sésamo tostado" }
    ],
    preparacion_es: [
      { paso: "Mezcla remolacha con sal, reposa 1h y escurre conservando el jugo." },
      { paso: "Integra jengibre, ajo, guindilla, azúcar y cebolleta. Masajea 3 min." },
      { paso: "Presiona en tarro esterilizado (que el líquido cubra todo) y fermenta 48h a Tª ambiente. Luego refrigera." }
    ],
    nota_food_mood_es: "SORPRESA: Un kimchi carmesí que fusiona el probiótico coreano con la vasodilatación cerebral de la remolacha (nitratos). Microbiota activa + dopamina + endorfinas.",
    tags: ["gut_brain", "dopamina", "probiótico", "microbiota", "fermentado"],
    tiempo_preparacion_min: 20,
    dificultad: "fácil",
    tipo_plato: "acompañamiento",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tepache-pina-curcuma-azteca",
    nombre_es: "Tepache de Piña y Cúrcuma — Fermentado Azteca Mood",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "Cáscara + corazón de 1 piña grande" },
      { ingrediente: "1.5L agua filtrada" },
      { ingrediente: "100g piloncillo o panela" },
      { ingrediente: "1 tsp cúrcuma en polvo" },
      { ingrediente: "1 rama canela" },
      { ingrediente: "4 clavos de olor" },
      { ingrediente: "1 rodaja jengibre" }
    ],
    preparacion_es: [
      { paso: "Disuelve panela en agua fría. Añade cáscaras, cúrcuma y especias." },
      { paso: "Cubre con un paño (que respire) y fermenta 48-72h a Tª ambiente hasta que burbujee." },
      { paso: "Cuela y sirve muy frío. Cero desperdicio, máximo mood." }
    ],
    nota_food_mood_es: "SORPRESA: Bebida fermentada ancestral. Bromelina (enzima piña) + Cúrcuma (anti-estrés). Probiótico artesanal que activa el eje intestino-cerebro.",
    tags: ["probiótico", "gut_brain", "antiinflamatorio", "azteca", "bromelina"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "labneh-cabra-romero-zatar",
    nombre_es: "Labneh de Cabra con Aceite de Romero y Zatar — Fermentado Levantino",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "500g yogur griego de cabra entero" },
      { ingrediente: "1 tsp sal marina" },
      { ingrediente: "Aceite de romero en frío" },
      { ingrediente: "Zatar libanés (tomillo, sésamo, sumac)" },
      { ingrediente: "Tomates cherry y pan de pita integral" }
    ],
    preparacion_es: [
      { paso: "Mezcla yogur y sal. Escurre en colador con gasa en el frigorífico 12-24h." },
      { paso: "Extiende el labneh espeso en un plato. Vierte aceite de romero generosamente." },
      { paso: "Espolvorea zatar y sirve con tomates y pita tostada." }
    ],
    nota_food_mood_es: "SORPRESA: El labneh es un 'super-queso' probiótico. Con aceite de romero (memoria) y zatar (neuroprotección). Acetilcolina + probiótico + foco mediterráneo.",
    tags: ["acetilcolina", "probiótico", "focus", "libanes", "triptófano"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE II: HONGOS MOOD DE VANGUARDIA ── */
  {
    id: "croquetas-lions-mane-parmesano",
    nombre_es: "Croquetas de Lion's Mane y Parmesano — 'Las Croquetas que hacen crecer neuronas'",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "300g Lion's Mane fresco" },
      { ingrediente: "50g mantequilla y 50g harina" },
      { ingrediente: "500ml leche entera" },
      { ingrediente: "60g parmesano rallado" },
      { ingrediente: "1 chalota y 2 dientes ajo" },
      { ingrediente: "Pan rallado con romero picado fino" }
    ],
    preparacion_es: [
      { paso: "Saltea Lion's Mane picado con chalota y ajo hasta dorar. Prepara bechamel en la misma sartén." },
      { paso: "Añade parmesano, estira la masa en bandeja y enfría 3h." },
      { paso: "Forma, reboza (añadiendo romero al pan) y fríe a 180°C o usa airfyer." }
    ],
    nota_food_mood_es: "SORPRESA: Snack neurológico de autor. Lion's Mane estimula NGF (Factor de Crecimiento Nervioso). Neuroplasticidad + acetilcolina en formato tapa.",
    tags: ["BDNF", "NGF", "acetilcolina", "neuroplasticidad", "chef"],
    tiempo_preparacion_min: 45,
    dificultad: "medio",
    tipo_plato: "tapa",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "caldo-dorado-shiitake-curcuma",
    nombre_es: "Caldo Dorado de Shiitake, Miso y Cúrcuma — 'El Caldo de la Longevidad'",
    mood_es: "Reset",
    ingredientes_es: [
      { ingrediente: "10 setas shiitake secas" },
      { ingrediente: "1 trozo alga kombu" },
      { ingrediente: "3 tbsp miso rojo o blanco" },
      { ingrediente: "1 tsp cúrcuma" },
      { ingrediente: "Jengibre fresco y cebolleta" },
      { ingrediente: "Aceite sésamo" }
    ],
    preparacion_es: [
      { paso: "Infusiona shiitake y kombu en frío 30 min. Luego calienta sin hervir (retira kombu antes)." },
      { paso: "Añade jengibre y cúrcuma. Deja a 80°C 10 min. Apaga fuego." },
      { paso: "Disuelve miso cuando baje la Tª (<60°C). Sirve con cebollina y aceite sésamo." }
    ],
    nota_food_mood_es: "SORPRESA: El ritual de longevidad japonés mejorado con cúrcuma. Probiótico vivo + antiinflamatorio intestinal + gut-brain activo.",
    tags: ["gut_brain", "probiótico", "antiinflamatorio", "longevidad", "japonesa"],
    tiempo_preparacion_min: 30,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE III: FLORES COMESTIBLES MOOD ── */
  {
    id: "arroz-leche-azahar-pistachos",
    nombre_es: "Arroz con Leche de Azahar y Pistachos — Estilo Persa",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "150g arroz redondo" },
      { ingrediente: "800ml leche entera + 200ml coco" },
      { ingrediente: "2 tsp agua de azahar" },
      { ingrediente: "4 vainas cardamomo machacadas" },
      { ingrediente: "3 tbsp miel" },
      { ingrediente: "60g pistachos tostados (melatonina vegetal)" }
    ],
    preparacion_es: [
      { paso: "Cocina arroz en las leches con cardamomo a fuego suave 30 min hasta cremosidad total." },
      { paso: "Fuera del fuego añade miel, azahar y agua de rosas opcional." },
      { paso: "Sirve con pistachos picados (la fuente más alta de melatonina vegetal)." }
    ],
    nota_food_mood_es: "SORPRESA: Azahar (GABA-like) + Pistachos (melatonina). El postre de mayor sofisticación neurológica para la calma nocturna.",
    tags: ["GABA", "serotonina", "triptófano", "persa", "ritual_nocturno"],
    tiempo_preparacion_min: 35,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "vinagreta-sauco-limon-miel",
    nombre_es: "Vinagreta de Flores de Saúco, Limón y Miel — 'El Aliño que nadie conoce'",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "100ml infusión concentrada de flores de saúco" },
      { ingrediente: "Zumo 1 limón grande" },
      { ingrediente: "1 tbsp miel cruda" },
      { ingrediente: "4 tbsp AOVE" },
      { ingrediente: "1 tsp vinagre de manzana sin filtrar" }
    ],
    preparacion_es: [
      { paso: "Prepara infusión de saúco (10g flores en 120ml agua). Enfría." },
      { paso: "Mezcla con limón, miel y vinagre. Emulsiona agitando con el AOVE." },
      { paso: "Macera 24h en nevera para integrar polifenoles ansidíticos del saúco." }
    ],
    nota_food_mood_es: "SORPRESA: Ingrediente estrella de la cocina nórdica (Saúco). Contiene rutina que refuerza capilares cerebrales. Ansiolítico floral sofisticado.",
    tags: ["GABA_like", "ansiolítico", "rutina_flavonoide", "nordico", "flores"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "acompañamiento",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "pannacotta-hibisco-rosas-viva",
    nombre_es: "Panna Cotta de Hibisco y Agua de Rosas con Gelatina Viva",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "400ml nata 35%" },
      { ingrediente: "200ml infusión hibisco concentrada" },
      { ingrediente: "1 tsp agua de rosas" },
      { ingrediente: "3g agar-agar" },
      { ingrediente: "2 tbsp miel" }
    ],
    preparacion_es: [
      { paso: "Hierve nata, infusión y agar-agar 2 min. Retira del fuego." },
      { paso: "Cuando baje a 50°C incorpora rosas y miel. Refrigera 4h." },
      { paso: "Decora con frambuesas y pétalos. Un ansiolítico en formato arte carmesí." }
    ],
    nota_food_mood_es: "SORPRESA: Impacto visual carmesí. Hibisco (anti-cortisol) + Rosas (GABA-like). Neurológicamente perfecto para desactivar el estrés.",
    tags: ["GABA_like", "anti_cortisol", "antocianinas", "ritual_beauty"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE IV: ESPECIAS OLVIDADAS MOOD ── */
  {
    id: "mole-negro-chocolate-calabaza",
    nombre_es: "Mole Negro de Chocolate, Chile Mulato y Semillas de Calabaza",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "4 chiles mulatos secos" },
      { ingrediente: "50g semillas de calabaza tostadas" },
      { ingrediente: "60g chocolate 85% y 2 tbsp cacao" },
      { ingrediente: "Cebolla, ajo, tomates asados" },
      { ingrediente: "Canela, clavo, comino" }
    ],
    preparacion_es: [
      { paso: "Hidrata chiles tostados. Tuesta semillas de calabaza (máximo triptófano vegetal)." },
      { paso: "Licúa chiles, semillas, vegetales asados y especias. Fríe la salsa 5 min." },
      { paso: "Cocina 30 min suave añadiendo chocolate. La mayor densidad neuroactiva del mundo." }
    ],
    nota_food_mood_es: "SORPRESA: Cinco compuestos mood juntos: triptófano, capsaicina (endorfinas), teobromina, anandamida y feniletilamina. Un plato maestro de neurociencia.",
    tags: ["serotonina", "endorfinas", "triptófano_máximo", "mexicano", "chef"],
    tiempo_preparacion_min: 90,
    dificultad: "alta",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "halva-sesamo-azafran-cardamomo",
    nombre_es: "Halva de Sésamo, Azafrán y Cardamomo — Dulce Persa de la Serenidad",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "250g tahini crudo de sésamo blanco" },
      { ingrediente: "100g miel cruda" },
      { ingrediente: "12 hebras azafrán hidratadas" },
      { ingrediente: "Cardamomo molido y agua de rosas" },
      { ingrediente: "Pistachos picados" }
    ],
    preparacion_es: [
      { paso: "Tuesta tahini suave 3 min. Incorpora miel e infusión de azafrán (ISRS natural)." },
      { paso: "Mezcla hasta denso. Vierte en molde con pistachos y sésamo. Refrigera 2h." },
      { paso: "Corte en rombos. El dulce más completo neurológicamente de la antigüedad." }
    ],
    nota_food_mood_es: "SORPRESA: Tahini (triptófano + magnesio + zinc) + Azafrán (antidepresivo natural). Serotonina y GABA en textura de fudge persa.",
    tags: ["serotonina", "GABA", "magnesio", "antidepresivo_natural", "persa"],
    tiempo_preparacion_min: 20,
    dificultad: "medio",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE V: BEBIDAS FRÍAS ACTIVADORAS INÉDITAS ── */
  {
    id: "jugo-apio-manzana-espirulina",
    nombre_es: "Jugo de Apio, Manzana Verde y Espirulina — 'El Verde de la Claridad'",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "4 tallos apio completo" },
      { ingrediente: "2 manzanas verdes" },
      { ingrediente: "1 tsp espirulina" },
      { ingrediente: "2cm jengibre fresco" },
      { ingrediente: "Pepino y limón" }
    ],
    preparacion_es: [
      { paso: "Licúa en frío apio, manzana, pepino y jengibre." },
      { paso: "Disuelve espirulina en limón y añade al jugo. Beber en ayunas inmediatamente." },
      { paso: "Apigenina para neurogénesis hipocampal + fenilalanina para dopamina." }
    ],
    nota_food_mood_es: "SORPRESA: El apio estimula el crecimiento de nuevas neuronas (apigenina). Dopamina (espirulina) + claridad mental alcalina.",
    tags: ["focus", "detox_cerebral", "clorofila", "apigenina", "alkalino"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "shrub-arandano-vinagre-romero",
    nombre_es: "Shrub de Arándano, Vinagre de Madre y Romero — 'El Tónico del Foco'",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "200g arándanos" },
      { ingrediente: "200ml vinagre manzana con madre" },
      { ingrediente: "150g miel cruda" },
      { ingrediente: "3 ramas romero" }
    ],
    preparacion_es: [
      { paso: "Machaca arándanos con miel y romero. Añade vinagre. Macera 72h en nevera." },
      { paso: "Cuela apretando bien para extraer todo el elixir nootrópico." },
      { paso: "Sirve 30ml de base con agua con gas y mucho hielo. Foco mental sostenido." }
    ],
    nota_food_mood_es: "SORPRESA: Tónico colonial americano. Arándanos (protege hipocampo) + Vinagre (glucemia estable) + Romero (acetilcolina). Memoria + foco.",
    tags: ["acetilcolina", "antocianinas", "probiótico", "focus", "tónico"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "agua-cold-brew-verde-pepino",
    nombre_es: "Agua Mineral Cold Brew — Té Verde, Pepino y Menta 12H",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "1.5L agua mineral" },
      { ingrediente: "2 tsp té verde en hoja de calidad" },
      { ingrediente: "½ pepino en rodajas finas" },
      { ingrediente: "Hojas de menta fresca y limón" }
    ],
    preparacion_es: [
      { paso: "Introduce té, pepino, menta y limón en agua fría. Tapa y refrigera 12h." },
      { paso: "La extracción fría dobla la L-teanina y elimina taninos amargos. Hidratación inteligente." }
    ],
    nota_food_mood_es: "SORPRESA: Extrae L-teanina pura máxima sin amargor. Calma cognitiva continua y foco sensorial suave todo el día.",
    tags: ["L-teanina", "hidratación_mood", "focus_suave", "cold_brew"],
    tiempo_preparacion_min: 2,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE VI: DESAYUNOS MOOD DE AUTOR INÉDITOS ── */
  {
    id: "huevos-escoceses-miso-sesamo",
    nombre_es: "Huevos Escoceses de Codorniz con Miso y Sésamo",
    mood_es: "Focus",
    ingredientes_es: [
      { ingrediente: "12 huevos de codorniz" },
      { ingrediente: "200g carne de salchicha ibérica mezclada con miso" },
      { ingrediente: "Hierbas finas picadas" },
      { ingrediente: "Rebozado: pan centeno + sésamo negro" }
    ],
    preparacion_es: [
      { paso: "Cuece huevos de codorniz 2.5 min. Enfría y pela. Envuelve con carne." },
      { paso: "Pasa por harina, huevo y pan-sésamo. Fríe a 180°C o usa airfryer 10 min." },
      { paso: "Colina triple que de gallina. Precursor directo de la acetilcolina (memoria)." }
    ],
    nota_food_mood_es: "SORPRESA: Desayuno cognitivo de alta cocina. Triple colina + Miso probiótico. Aprendizaje y enfoque en un bocado de autor.",
    tags: ["colina", "acetilcolina", "probiótico", "umami", "chef"],
    tiempo_preparacion_min: 25,
    dificultad: "medio",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tostada-platano-macho-tahini-polen",
    nombre_es: "Tostada de Plátano Macho Asado, Tahini y Polen de Abeja",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "1 plátano macho muy maduro" },
      { ingrediente: "2 tbsp tahini crudo" },
      { ingrediente: "1 tsp polen de abeja (22 aminoácidos)" },
      { ingrediente: "Miel cruda y flor de sal" },
      { ingrediente: "Sésamo negro y canela" }
    ],
    preparacion_es: [
      { paso: "Asa rodajas de plátano macho 3 min por lado hasta caramelizar en sartén." },
      { paso: "Dispón en plato y cubre con tahini, miel y polen. Tostón wellness caribeño." },
      { paso: "Un multivitamínico natural para activar todos los neurotransmisores." }
    ],
    nota_food_mood_es: "SORPRESA: Triptófano máximo + complejo B completo. El polen activa los cofactores de todos los neurotransmisores. Energía real.",
    tags: ["triptófano", "serotonina", "superalimento", "B_vitaminas", "activación"],
    tiempo_preparacion_min: 15,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE VII: RITUALES NOCTURNOS MOOD ── */
  {
    id: "shot-cerezas-magnesio-ashwagandha",
    nombre_es: "Shot Nocturno de Cerezas, Magnesio y Ashwagandha — 'El Disparo del Sueño'",
    mood_es: "Reset",
    ingredientes_es: [
      { ingrediente: "60ml zumo cereza ácida (Montmorency)" },
      { ingrediente: "½ tsp ashwagandha KSM-66" },
      { ingrediente: "½ tsp magnesio en polvo (glycinato)" },
      { ingrediente: "Miel y canela" }
    ],
    preparacion_es: [
      { paso: "Mezcla zumo con ashwagandha y magnesio en un shot glass." },
      { paso: "Remueve hasta disolución completa. Tomar 30 min antes de dormir." },
      { paso: "Melatonina biodisponible máxima + reducción de cortisol nocturno." }
    ],
    nota_food_mood_es: "SORPRESA: Las cerezas ácidas tienen x10 melatonina que otros alimentos. Sueño profundo reparador para un mejor humor mañana.",
    tags: ["melatonina", "magnesio", "adaptógeno", "ritual_nocturno", "sueño"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "decoccion-pasiflora-tila-cacao",
    nombre_es: "Decocción de Pasiflora, Tila y Cacao — 'El Té del Descanso Profundo'",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "1 tbsp pasiflora seca (crisina)" },
      { ingrediente: "1 tbsp tila seca" },
      { ingrediente: "1 tsp cacao 100% (magnesio)" },
      { ingrediente: "Miel cruda y vainilla" }
    ],
    preparacion_es: [
      { paso: "Infusiona pasiflora y tila en agua a 90°C 8 min (tapado para conservar terpenos)." },
      { paso: "Disuelve cacao y miel en la infusión caliente. Ritual de cierre absoluto." },
      { paso: "La crisina de la pasiflora tiene la mayor afinidad GABA-A botánica." }
    ],
    nota_food_mood_es: "SORPRESA: La alternativa botánica más potente a los somníferos. GABA máximo + magnesio relajante SNC.",
    tags: ["GABA", "ansiolítico", "melatonina", "ritual_nocturno", "calma_profunda"],
    tiempo_preparacion_min: 10,
    dificultad: "fácil",
    tipo_plato: "bebida",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "trufas-chocolate-cardamomo-sal",
    nombre_es: "Trufas de Chocolate Negro, Cardamomo y Flor de Sal",
    mood_es: "Calma",
    ingredientes_es: [
      { ingrediente: "200g chocolate 85% picado" },
      { ingrediente: "100ml nata 35% o crema coco" },
      { ingrediente: "½ tsp cardamomo molido" },
      { ingrediente: "Flor de sal de calidad" },
      { ingrediente: "Cacao 100% para rebozar" }
    ],
    preparacion_es: [
      { paso: "Vierte nata hirviendo sobre chocolate. Deja 1 min y remueve hasta brillo total." },
      { paso: "Añade cardamomo y refrigera 1.5h. Forma bolitas y reboza en cacao." },
      { paso: "Acaba con un cristal de flor de sal. El cierre elegante del día." }
    ],
    nota_food_mood_es: "SORPRESA: Entrega elegante de triptófano y anandamida. Dos trufas antes de dormir activan la serotonina nocturna de forma consciente.",
    tags: ["serotonina", "anandamida", "magnesio", "endorfinas", "ritual_nocturno"],
    tiempo_preparacion_min: 20,
    dificultad: "fácil",
    tipo_plato: "postre",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },

  /* ── BLOQUE VIII: COCINAS DEL MUNDO MOOD INÉDITAS ── */
  {
    id: "dal-lentejas-coco-curcuma",
    nombre_es: "Dal de Lentejas Rojas, Coco y Cúrcuma — Ayurveda Mood",
    mood_es: "Social",
    ingredientes_es: [
      { ingrediente: "250g lentejas rojas y 400ml leche coco" },
      { ingrediente: "Cúrcuma, comino y jengibre" },
      { ingrediente: "Tadka: ghee, mostaza negra y chiles secos" },
      { ingrediente: "Cebolla y tomates" }
    ],
    preparacion_es: [
      { paso: "Cocina lentejas con especias y leche coco 20 min hasta textura cremosa." },
      { paso: "Prepara el Tadka (sofrito final de ghee y especias saltando) y vierte sobre el Dal." },
      { paso: "Triptófano + B9 + TCM cerebral + Ghee (ácido butírico gut-brain)." }
    ],
    nota_food_mood_es: "SORPRESA: El plato reconfortante más completo. Ayurveda como neurociencia antigua: antiinflamatorio cerebral y precursor de serotonina intestinal.",
    tags: ["serotonina", "triptófano", "antiinflamatorio", "ayurveda", "gut_brain"],
    tiempo_preparacion_min: 30,
    dificultad: "fácil",
    tipo_plato: "plato principal",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  },
  {
    id: "tamago-gohan-nori-sesamo",
    nombre_es: "Tamago Gohan con Alga Nori, Sésamo y Aceite de Sésamo",
    mood_es: "Activación",
    ingredientes_es: [
      { ingrediente: "Arroz japonés recién cocido y MUY caliente" },
      { ingrediente: "1 huevo campero" },
      { ingrediente: "Alga nori en tiras (iodo)" },
      { ingrediente: "Tamari y aceite de sésamo" },
      { ingrediente: "Sésamo negro y cebollino" }
    ],
    preparacion_es: [
      { paso: "Pon el huevo sobre el arroz hirviendo. Remueve enérgicamente 1 min hasta emulsionar." },
      { paso: "Añade tamari, aceite de sésamo, nori y sésamo negro. Servir inmediatamente." },
      { paso: "Huevo semicrudo aumenta x40% biodisponibilidad de colina (cerebro)." }
    ],
    nota_food_mood_es: "SORPRESA: Desayuno japonés de 5 minutos. Colina máxima para la memoria + Iodo tiroideo. Eficiencia cognitiva japonesa en tu plato.",
    tags: ["colina", "acetilcolina", "iodo", "dopamina", "japones", "ritual"],
    tiempo_preparacion_min: 5,
    dificultad: "fácil",
    tipo_plato: "desayuno",
    premium_level: 2,
    segmento: "adulto",
    sexo: "unisex",
    grupo_edad: "31-50"
  }
];

async function insertUnexploredRecipes() {
  console.log(`Inserting ${recipes.length} unexplored surprising recipes...`);
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
  console.log('Finished unexplored recipe insertions.');
}

insertUnexploredRecipes();
