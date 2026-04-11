const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const RECIPES = [
  // --- CALMA ---
  {
    id: "CAL-W45-salmon-tahini",
    nombre_es: "Salmón Glaseado con Tahini, Granada y Espinacas",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 20,
    contexto_es: "**Rico en omega-3 y magnesio.** Salmón jugoso con una salsa de tahini que se hace en 2 minutos. La granada aporta color y polifenoles. Una cena que baja las revoluciones sin sacrificar sabor.",
    ingredientes_es: ["2 lomos de salmón fresco", "2 cucharadas de tahini", "Zumo de medio limón", "1 cucharada de miel cruda", "100g espinacas frescas", "Semillas de granada", "1 cucharadita de semillas de sésamo", "Aceite de oliva virgen extra", "Sal marina y pimienta negra"],
    preparacion_es: ["Mezcla el tahini con el zumo de limón, la miel y una cucharada de agua tibia hasta obtener una salsa fluida.", "Sella el salmón en una sartén con aceite de oliva, piel hacia abajo, 4 minutos. Dale la vuelta y cocina 2 minutos más.", "En la misma sartén, saltea las espinacas 30 segundos con una pizca de sal.", "Sirve el salmón sobre las espinacas. Baña con la salsa de tahini. Corona con granada y sésamo."],
    nota_food_mood_es: "El salmón aporta DHA y EPA — los omega-3 que mantienen flexibles las membranas neuronales, especialmente importantes después de los 45 cuando la caída de estrógenos reduce la protección natural del cerebro. El tahini (sésamo) es una de las fuentes vegetales más ricas en calcio y triptófano — precursor directo de la serotonina y la melatonina. Las espinacas añaden magnesio, el mineral anti-estrés que relaja el sistema nervioso. La granada aporta punicalaginas, antioxidantes que protegen el endotelio vascular.",
    tags: ["cena", "facil", "salmon", "omega3", "con-carne", "bajo-en-azucar"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-coliflor-zaatar",
    nombre_es: "Coliflor Asada con Za'atar, Yogur de Cabra y Dátiles",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 30,
    contexto_es: "**Vegetariano y rico en calcio.** La coliflor se transforma en el horno: dorada, caramelizada, casi carnosa. El za'atar y el yogur de cabra la convierten en un plato que parece de restaurante pero se hace en una bandeja.",
    ingredientes_es: ["1 coliflor entera cortada en floretes gruesos", "2 cucharadas de za'atar", "3 cucharadas de aceite de oliva virgen extra", "150g yogur de cabra", "4 dátiles medjool deshuesados y troceados", "2 cucharadas de pistachos machacados", "Zumo de medio limón", "1 cucharadita de cúrcuma", "Sal marina en escamas"],
    preparacion_es: ["Precalienta el horno a 220°C.", "Mezcla los floretes con aceite de oliva, za'atar, cúrcuma y sal. Extiende en una bandeja sin amontonar.", "Asa 25 minutos hasta que los bordes estén dorados y casi crujientes.", "Mezcla el yogur con el zumo de limón y una pizca de sal.", "Sirve la coliflor caliente sobre el yogur frío. Añade dátiles y pistachos. Escamas de sal."],
    nota_food_mood_es: "La coliflor es una crucífera rica en sulforafano — activa la vía Nrf2, el sistema de defensa antioxidante más potente del cuerpo, incluyendo el cerebro. La cúrcuma amplifica esta acción antiinflamatoria (añade siempre pimienta negra o grasa para absorberla). El za'atar contiene tomillo y orégano, ricos en carvacrol con efecto ansiolítico demostrado. Los dátiles aportan triptófano y azúcar natural de liberación lenta. Los pistachos son el fruto seco con más vitamina B6 — esencial para convertir triptófano en serotonina. El yogur de cabra aporta probióticos de fácil digestión para mujeres con sensibilidad digestiva.",
    tags: ["cena", "facil", "vegetariano", "sin-harina", "calcio"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-pollo-miso-boniato",
    nombre_es: "Muslos de Pollo al Miso con Boniato Asado y Sésamo",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 35,
    contexto_es: "**Fermentado + prebiótico.** El miso glasea el pollo con umami profundo mientras el boniato se carameliza lentamente. Confort japonés sin complicaciones.",
    ingredientes_es: ["4 muslos de pollo deshuesados", "2 cucharadas de miso blanco (shiro miso)", "1 cucharada de miel cruda", "1 cucharadita de jengibre fresco rallado", "2 boniatos medianos cortados en rodajas gruesas", "Aceite de sésamo tostado", "Semillas de sésamo", "Cebolleta en aros"],
    preparacion_es: ["Precalienta horno a 200°C.", "Mezcla miso, miel, jengibre y una cucharada de agua tibia. Marina los muslos 10 minutos (o toda la noche si planificas).", "Coloca boniatos en una bandeja con aceite de oliva y sal. Pon los muslos encima.", "Asa 30 minutos hasta que el pollo esté dorado y el boniato tierno.", "Termina con aceite de sésamo, semillas y cebolleta."],
    nota_food_mood_es: "El miso fermentado aporta bacterias vivas que producen GABA directamente en el intestino — el neurotransmisor que calma la actividad neuronal excesiva. El boniato, al asarse, desarrolla almidón resistente (prebiótico) que alimenta esas mismas bacterias. El jengibre modula la serotonina intestinal. Es un plato diseñado como circuito cerrado: probiótico (miso) + prebiótico (boniato) + modulador (jengibre) = microbiota que produce calma. Tu segundo cerebro agradecido.",
    tags: ["cena", "facil", "con-carne", "fermentado", "bajo-en-azucar"],
    premium_level: 1,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-crema-calabaza-miso",
    nombre_es: "Crema de Calabaza con Miso, Leche de Coco y Pipas Tostadas",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 25,
    contexto_es: "**Vegetariano, prebiótico y reconfortante.** Terciopelo naranja con un toque de umami. Las pipas de calabaza añaden el crujiente y el triptófano que tu noche necesita.",
    ingredientes_es: ["500g calabaza cortada en cubos", "200ml leche de coco", "1 cucharada de miso blanco", "1 cebolla", "1 diente de ajo", "1 cucharadita de cúrcuma", "Semillas de calabaza tostadas", "Aceite de oliva virgen extra", "Pimienta negra"],
    preparacion_es: ["Sofríe cebolla y ajo en aceite de oliva a fuego suave.", "Añade calabaza y cúrcuma. Cubre con agua justa y cocina 15 minutos.", "Tritura con la leche de coco hasta textura sedosa.", "Retira del fuego. Disuelve el miso en un poco de caldo tibio (nunca hervir el miso — mata los probióticos) y añádelo.", "Sirve con un hilo de aceite, pipas tostadas y pimienta negra recién molida."],
    nota_food_mood_es: "La calabaza es rica en betacaroteno y triptófano. La leche de coco aporta triglicéridos de cadena media (TCM) que el cerebro puede usar como combustible directo, sin picos de glucosa. El miso (añadido fuera del fuego para preservar sus probióticos) aporta umami y bacterias vivas. Las pipas de calabaza son la fuente vegetal más concentrada de triptófano + magnesio + zinc — los tres pilares de la producción nocturna de serotonina y melatonina. Cena ideal para mujeres que buscan dormir mejor.",
    tags: ["cena", "facil", "vegetariano", "sin-harina", "prebiotico"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  // --- FOCUS ---
  {
    id: "FOC-W45-sardinas-gremolata",
    nombre_es: "Sardinas al Horno con Gremolata de Nuez y Limón",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "facil",
    tiempo_preparacion_min: 20,
    contexto_es: "**Omega-3 + calcio + vitamina D en un solo plato.** Las sardinas son el superalimento más infravalorado. Con esta gremolata de nuez y limón, también son el más delicioso.",
    ingredientes_es: ["8 sardinas frescas limpias", "30g nueces troceadas finas", "Ralladura y zumo de 1 limón", "1 diente de ajo picado fino", "Perejil fresco picado (un buen puñado)", "3 cucharadas de aceite de oliva virgen extra", "Sal marina en escamas", "Pan de centeno tostado (opcional, sin harina blanca)"],
    preparacion_es: ["Precalienta el horno a 200°C.", "Coloca las sardinas en una bandeja con un hilo de aceite de oliva y sal.", "Hornea 12 minutos.", "Mientras: mezcla nueces, ralladura de limón, ajo, perejil y aceite de oliva para la gremolata.", "Saca las sardinas y cúbrelas con la gremolata. Un chorrito de zumo de limón. Sirve con pan de centeno si quieres."],
    nota_food_mood_es: "Las sardinas son omega-3 + calcio + vitamina D en un solo alimento — los tres nutrientes más críticos para mujeres después de los 45. El DHA mantiene las membranas neuronales flexibles (focus = señal nerviosa rápida), el calcio protege los huesos sin necesidad de lácteos, y la vitamina D regula receptores cerebrales que afectan directamente al humor. Las nueces añaden ALA (omega-3 vegetal) y melatonina endógena. El limón multiplica la absorción de hierro ×6. Más inteligencia nutricional por euro, imposible.",
    tags: ["almuerzo", "facil", "con-pescado", "omega3", "calcio", "bajo-en-azucar"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-bowl-ottolenghi",
    nombre_es: "Bowl de Lentejas Negras con Berenjena Asada, Tahini y Sumac",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "facil",
    tiempo_preparacion_min: 30,
    contexto_es: "**Vegetariano, proteína completa, inspiración Ottolenghi.** Lentejas negras con la berenjena más sedosa que has probado, una cascada de tahini y un toque ácido de sumac. Medio Oriente en tu cocina.",
    ingredientes_es: ["200g lentejas negras (beluga) cocidas", "2 berenjenas cortadas en rodajas gruesas", "3 cucharadas de tahini", "Zumo de 1 limón", "1 cucharadita de sumac", "1 cucharadita de comino", "1 diente de ajo rallado", "Perejil fresco", "Semillas de granada", "Aceite de oliva virgen extra", "Sal marina"],
    preparacion_es: ["Precalienta horno a 220°C.", "Coloca las rodajas de berenjena en bandeja con aceite de oliva, comino y sal. Asa 20-25 minutos hasta que estén doradas y suaves.", "Prepara la salsa: tahini + limón + ajo + agua tibia hasta consistencia fluida.", "Monta el bowl: lentejas en la base, berenjena asada encima.", "Baña con tahini generosamente. Corona con sumac, granada y perejil."],
    nota_food_mood_es: "Las lentejas negras (beluga) son las más ricas en hierro y folatos entre todas las legumbres. Sin hierro no hay oxígeno cerebral, sin folatos no hay síntesis de neurotransmisores. El tahini aporta metionina (aminoácido limitante en legumbres) = proteína completa sin carne. El sumac es un potente antioxidante — su capacidad ORAC supera a la de la cúrcuma. La berenjena aporta nasunina, un antioxidante que protege las membranas de las células cerebrales. Plato completo, vegetal, con función neuroprotectora real.",
    tags: ["almuerzo", "facil", "vegetariano", "sin-harina", "hierro", "proteina-completa"],
    premium_level: 1,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-caballa-remolacha",
    nombre_es: "Caballa Ahumada con Remolacha Asada, Nueces y Eneldo",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "facil",
    tiempo_preparacion_min: 25,
    contexto_es: "**Omega-3 asequible + nitratos para flujo cerebral.** La caballa es el omega-3 más barato del mercado. Con remolacha asada y nueces, se convierte en un plato nórdico-mediterráneo que alimenta cada neurona.",
    ingredientes_es: ["2 filetes de caballa ahumada", "2 remolachas medianas asadas (puedes usar las de vacío)", "30g nueces", "Eneldo fresco", "1 cucharada de alcaparras", "Zumo de medio limón", "2 cucharadas de aceite de oliva virgen extra", "Pimienta negra", "Hojas verdes (rúcula o berros)"],
    preparacion_es: ["Corta la remolacha en cuartos o rodajas.", "Desmenuza la caballa en trozos grandes sobre una base de hojas verdes.", "Añade remolacha, nueces y alcaparras.", "Aliña con limón, aceite de oliva y pimienta. Decora con eneldo fresco.", "No necesita más. La sencillez es el lujo."],
    nota_food_mood_es: "La caballa tiene la misma concentración de DHA y EPA que el salmón pero cuesta tres veces menos. La remolacha aporta nitratos naturales que el cuerpo convierte en óxido nítrico — vasodilatador que mejora el flujo sanguíneo cerebral hasta un 16% según estudios. Más sangre al cerebro = más oxígeno = más focus. Las nueces añaden ALA y melatonina. El eneldo contiene flavonoides con efecto neuroprotector. Plato económico, rápido y con más ciencia por bocado que la mayoría de suplementos.",
    tags: ["almuerzo", "facil", "con-pescado", "omega3", "economico"],
    premium_level: 1,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-shakshuka-verde",
    nombre_es: "Shakshuka Verde con Espinacas, Kale y Huevos Ecológicos",
    mood_es: "Focus",
    tipo_plato: "desayuno",
    dificultad: "facil",
    tiempo_preparacion_min: 15,
    contexto_es: "**Vegetariano, hierro + colina + folatos.** No todo shakshuka es rojo. Esta versión verde está cargada de hojas oscuras, especias y huevos con la yema perfecta. Desayuno de fin de semana que alimenta la semana entera.",
    ingredientes_es: ["3 huevos ecológicos", "200g espinacas frescas", "100g kale troceado", "1 cebolla picada", "2 dientes de ajo", "1 cucharadita de comino", "1 cucharadita de cúrcuma", "50g queso feta desmenuzado", "Aceite de oliva virgen extra", "Chile seco en copos (opcional)", "Sal y pimienta"],
    preparacion_es: ["Sofríe cebolla y ajo en aceite de oliva a fuego medio.", "Añade comino y cúrcuma, tuesta 30 segundos hasta que perfumen.", "Incorpora kale y espinacas. Cocina 3-4 minutos hasta que reduzcan.", "Haz 3 huecos y casca los huevos. Tapa y cocina a fuego bajo 5-6 minutos hasta que las claras cuajen y las yemas queden cremosas.", "Termina con feta, chile en copos y un hilo de aceite de oliva. Sirve directo de la sartén."],
    nota_food_mood_es: "Los huevos aportan colina — el nutriente más olvidado y más necesario para el cerebro después de los 45. La colina es precursora de acetilcolina (memoria y aprendizaje) y de fosfatidilcolina (membranas neuronales). Las espinacas y el kale aportan hierro no hemo + folatos + vitamina K. La cúrcuma con la grasa del huevo y el aceite de oliva se absorbe correctamente. El feta aporta probióticos suaves (es un queso fermentado). Desayuno que activa la cognición desde la primera hora.",
    tags: ["desayuno", "facil", "vegetariano", "sin-harina", "hierro", "colina"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  // --- RESET ---
  {
    id: "RES-W45-caldo-largo-pollo",
    nombre_es: "Caldo Largo de Pollo con Cúrcuma, Jengibre y Shiitake",
    mood_es: "Reset",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 25,
    contexto_es: "**Antiinflamatorio + colágeno natural.** El caldo que las abuelas hacían por instinto y la ciencia ahora valida. Cúrcuma, jengibre, shiitake: la triple alianza antiinflamatoria en un líquido dorado.",
    ingredientes_es: ["500ml caldo de pollo casero (o de huesos)", "4-5 shiitakes frescos o secos (rehidratados)", "2cm jengibre fresco en rodajas", "1 cucharadita de cúrcuma", "1 diente de ajo entero aplastado", "1 cebolleta en aros", "Salsa de soja (tamari) al gusto", "Unas gotas de aceite de sésamo", "Pimienta negra recién molida"],
    preparacion_es: ["Calienta el caldo con jengibre, ajo y cúrcuma a fuego suave 15 minutos. No hiervas — que infusione.", "Añade los shiitakes cortados en láminas. Cocina 5 minutos más.", "Retira el ajo y el jengibre si prefieres.", "Sirve en un bol profundo. Añade tamari al gusto, cebolleta, aceite de sésamo y pimienta negra.", "Bebe despacio. Este caldo es medicina líquida."],
    nota_food_mood_es: "El caldo largo de huesos aporta colágeno, glicina y prolina — aminoácidos que reparan la mucosa intestinal (leaky gut). La glicina es además un neurotransmisor inhibitorio que favorece el sueño profundo. Los shiitakes contienen lentinano (beta-glucano inmunomodulador) y ergotioneína, un antioxidante que se acumula preferentemente en el cerebro y los ojos. La cúrcuma + pimienta negra + grasa del caldo = absorción óptima de curcumina. El jengibre modula la serotonina intestinal. Un reset completo para el eje intestino-cerebro.",
    tags: ["cena", "facil", "con-carne", "antiinflamatorio", "colágeno"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "RES-W45-arroz-coco-curcuma",
    nombre_es: "Arroz Integral al Coco con Cúrcuma, Kale y Garbanzos Crujientes",
    mood_es: "Reset",
    tipo_plato: "almuerzo",
    dificultad: "facil",
    tiempo_preparacion_min: 30,
    contexto_es: "**Vegetariano, prebiótico, proteína completa.** Arroz integral cocinado en leche de coco con cúrcuma dorada, kale salteado y garbanzos crujientes al horno. Comida que resetea sin dejar hambre.",
    ingredientes_es: ["200g arroz integral", "200ml leche de coco", "1 cucharadita de cúrcuma", "200g garbanzos cocidos", "1 cucharadita de pimentón ahumado", "150g kale troceado", "1 cucharada de aceite de coco", "Zumo de medio limón", "Aceite de oliva virgen extra", "Sal marina y pimienta"],
    preparacion_es: ["Cuece el arroz integral en una mezcla de agua y leche de coco con la cúrcuma y una pizca de sal (20-25 min).", "Mientras: seca los garbanzos, mézclalos con aceite de coco, pimentón y sal. Hornéalos a 200°C durante 20 minutos hasta que crujan.", "Saltea el kale con aceite de oliva y una pizca de sal 2-3 minutos.", "Monta: arroz dorado en la base, kale encima, garbanzos crujientes coronando. Limón y pimienta."],
    nota_food_mood_es: "Arroz integral (enfriado y recalentado) genera almidón resistente — prebiótico que alimenta bifidobacterias y lactobacilos. La leche de coco aporta TCM (triglicéridos de cadena media) que el cerebro usa como combustible directo. Los garbanzos + arroz = proteína completa (lisina + metionina). La cúrcuma con la grasa del coco se absorbe óptimamente. El kale aporta sulforafano, calcio y vitamina K. Plato completo, vegetal, que resetea tu microbiota y alimenta tu cerebro con combustible limpio.",
    tags: ["almuerzo", "facil", "vegetariano", "sin-harina", "prebiotico", "proteina-completa"],
    premium_level: 1,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "RES-W45-trucha-hierbas",
    nombre_es: "Trucha al Papillote con Hinojo, Limón y Hierbas Frescas",
    mood_es: "Reset",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 20,
    contexto_es: "**Omega-3 + digestión ligera.** Todo dentro de un papillote: trucha, hinojo, limón, hierbas. El horno hace el trabajo. Tú solo abres el paquete y respiras ese aroma que ya es terapia.",
    ingredientes_es: ["2 filetes de trucha fresca", "1 bulbo de hinojo en láminas finas", "1 limón en rodajas", "Eneldo y perejil frescos", "2 cucharadas de aceite de oliva virgen extra", "Alcaparras", "Sal marina y pimienta negra", "Papel de hornear"],
    preparacion_es: ["Precalienta horno a 190°C.", "Coloca cada filete sobre un trozo grande de papel de hornear.", "Cubre con láminas de hinojo, rodajas de limón, hierbas y alcaparras. Aceite de oliva, sal, pimienta.", "Cierra los paquetes dejando espacio para el vapor.", "Hornea 15 minutos. Abre en la mesa — el aroma es parte de la experiencia."],
    nota_food_mood_es: "La trucha es omega-3 de río, más sostenible y asequible que el salmón. El hinojo contiene anetol, compuesto con efecto carminativo (reduce gases) y estrogénico suave — especialmente útil en la transición menopáusica. El limón aporta vitamina C que protege los omega-3 de la oxidación durante la cocción. El papillote preserva todos los nutrientes al cocinar sin contacto directo con el calor. Cena ligera que resetea el sistema digestivo sin dejarte con hambre a medianoche.",
    tags: ["cena", "facil", "con-pescado", "omega3", "digestivo", "bajo-en-azucar"],
    premium_level: 1,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  },
  {
    id: "RES-W45-compota-especias",
    nombre_es: "Compota de Manzana Asada con Canela, Kéfir y Nueces",
    mood_es: "Reset",
    tipo_plato: "desayuno",
    dificultad: "facil",
    tiempo_preparacion_min: 15,
    contexto_es: "**Vegetariano, probiótico, prebiótico.** Manzana asada con canela que perfuma la cocina, kéfir cremoso y nueces crujientes. El desayuno más amable que existe para un sistema digestivo que necesita descanso.",
    ingredientes_es: ["2 manzanas cortadas en gajos gruesos", "1 cucharadita de canela de Ceilán", "1 cucharadita de ghee", "150g kéfir natural (de cabra o vaca)", "30g nueces", "1 cucharadita de miel cruda", "Ralladura de limón"],
    preparacion_es: ["Calienta el ghee en una sartén. Añade los gajos de manzana y la canela.", "Cocina a fuego medio 8-10 minutos, dando la vuelta una vez, hasta que estén dorados y tiernos.", "Sirve el kéfir frío en un bol.", "Corona con la manzana caliente, su jugo, las nueces y la ralladura de limón.", "Un hilo de miel cruda si quieres."],
    nota_food_mood_es: "La manzana asada desarrolla pectina — un prebiótico soluble que alimenta las bifidobacterias intestinales. El kéfir aporta hasta 40 cepas probióticas distintas (mucho más diverso que el yogur). La canela estabiliza la glucosa en sangre, evitando el bajón de media mañana que dispara antojos. Las nueces son el único fruto seco con omega-3 (ALA) y contienen melatonina endógena — regulador del reloj biológico. El ghee aporta butirato, ácido graso de cadena corta que nutre directamente las células del colon. Probiótico (kéfir) + prebiótico (manzana) + butirato (ghee) = tu microbiota empieza el día con todo lo que necesita.",
    tags: ["desayuno", "facil", "vegetariano", "sin-harina", "probiotico", "prebiotico"],
    premium_level: 0,
    sexo: "mujer",
    grupo_edad: "45-60",
    segmento: "adulto"
  }
];

async function apply() {
  try {
    console.log('--- 1. Backing up Recetas ---');
    const { data: bData, error: bError } = await supabase.from('recetas').select('*');
    if (bError) throw bError;
    fs.writeFileSync('recetas_backup_mujeres.json', JSON.stringify(bData, null, 2));
    console.log(`Backup saved to recetas_backup_mujeres.json (${bData.length} recipes)`);

    console.log('\n--- 2. Upserting 12 Women Recipes ---');
    const { error: upsertError } = await supabase.from('recetas').upsert(RECIPES, { onConflict: 'id' });
    if (upsertError) throw upsertError;
    console.log('Successfully upserted 12 recipes.');

    console.log('\n--- 3. Updating Glossary ---');
    const { data: glossaryData, error: gError } = await supabase.from('glossary').select('slug, food_mood_recipes');
    if (gError) throw gError;

    let updatedCount = 0;
    for (const term of glossaryData) {
      const slugMatch = term.slug.toLowerCase().replace(/-/g, ' ');
      let matches = [];
      
      for (const recipe of RECIPES) {
        const textToSearch = [
          recipe.nombre_es,
          ...(recipe.ingredientes_es || []),
          ...(recipe.tags || [])
        ].join(' ').toLowerCase();

        if (textToSearch.includes(slugMatch)) {
          matches.push(recipe.nombre_es);
        }
      }

      if (matches.length > 0) {
        const currentRecipes = term.food_mood_recipes || [];
        const uniqueRecipes = [...new Set([...currentRecipes, ...matches])];
        if (uniqueRecipes.length > currentRecipes.length) {
          await supabase.from('glossary').update({ food_mood_recipes: uniqueRecipes }).eq('slug', term.slug);
          console.log(`Updated glossary term: ${term.slug} (+${uniqueRecipes.length - currentRecipes.length} recipes)`);
          updatedCount++;
        }
      }
    }
    console.log(`Glossary update complete. Modified ${updatedCount} terms.`);

    console.log('\n--- 4. Final Data Verification ---');
    const { count, error: countError } = await supabase.from('recetas')
      .select('*', { count: 'exact', head: true })
      .eq('sexo', 'mujer')
      .eq('grupo_edad', '45-60');
    
    if (countError) throw countError;
    console.log(`Total recipes for mujeres + 45-60: ${count}`);

  } catch (err) {
    console.error('Task failed:', err);
  }
}
apply();
