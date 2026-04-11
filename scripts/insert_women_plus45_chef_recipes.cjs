const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const RECIPES_CHEF = [
  // --- CALMA ---
  {
    id: "CAL-W45-CH-berenjena-miso-granada",
    nombre_es: "Berenjena Quemada con Crema de Miso, Granada y Zanóbita",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "media",
    tiempo_preparacion_min: 40,
    contexto_es: "La berenjena se asa directamente sobre la llama hasta que la piel se carboniza y la carne interior se convierte en seda pura. Se abre, se baña en una crema de miso blanco con tahini, y se corona con granada que estalla en la boca. Medio Oriente en tu mesa de noche.",
    ingredientes_es: ["2 berenjenas grandes", "2 cucharadas de miso blanco", "2 cucharadas de tahini", "Zumo de 1 limón", "1 diente de ajo rallado", "Semillas de granada (medio fruto)", "2 cucharadas de piñones tostados", "Za'atar", "Aceite de oliva virgen extra", "Menta fresca y perejil", "Sal marina en escamas"],
    preparacion_es: ["Pincha las berenjenas con un tenedor. Colócalas directamente sobre la llama del fogón (o bajo el grill del horno al máximo) y asa girando cada 5 minutos hasta que la piel esté completamente negra y el interior blando — unos 20 minutos.", "Déjalas reposar 5 minutos. Ábrelas por la mitad y extrae la carne con una cuchara, dejando la piel atrás.", "Prepara la crema: bate miso + tahini + limón + ajo + 2 cucharadas de agua tibia hasta textura fluida.", "Extiende la crema en el fondo de una fuente. Coloca la carne de berenjena encima formando montañas irregulares.", "Corona: granada, piñones tostados, za'atar generoso, hierbas frescas rasgadas con las manos, un hilo de aceite de oliva, escamas de sal.", "Sirve tibia. Que cada comensal arrastre su cuchara por todos los estratos."],
    nota_food_mood_es: "La berenjena contiene nasunina — un antioxidante exclusivo que protege los lípidos de las membranas neuronales (literalmente protege la grasa de tu cerebro). Al quemarla, se liberan compuestos aromáticos que activan receptores olfativos conectados directamente con el sistema límbico (emociones). El miso aporta bacterias vivas que producen GABA en tu intestino. El tahini es triptófano + calcio + magnesio. Los piñones aportan ácido pinolénico, un omega insaturado que estimula la colecistoquinina — hormona de saciedad. La granada cierra con punicalaginas cardioprotectoras. Este plato calma desde el aroma hasta el último neurotransmisor.",
    tags: ["cena", "media", "vegetariano", "chef", "ottolenghi", "fermentado"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-CH-cordero-yogur-pistachos",
    nombre_es: "Paletilla de Cordero Deshilachada con Yogur Especiado, Pistacho y Menta",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "media",
    tiempo_preparacion_min: 35,
    contexto_es: "Cordero que se deshace con un tenedor sobre un lago de yogur frío con comino y ajo. El contraste caliente-frío, carnoso-ácido, tierno-crujiente es puro Ottolenghi. Y los pistachos lo coronan todo como joyas verdes.",
    ingredientes_es: ["400g paletilla de cordero deshuesada en trozos", "1 cucharadita de comino molido", "1 cucharadita de canela", "1 cucharadita de cúrcuma", "200g yogur griego (o de cabra)", "1 diente de ajo rallado en el yogur", "40g pistachos machacados", "Hojas de menta fresca (abundante)", "1 cucharada de miel cruda", "Aceite de oliva virgen extra", "Sal marina y pimienta negra", "Zumo de medio limón"],
    preparacion_es: ["Mezcla el cordero con comino, canela, cúrcuma, aceite de oliva, sal y pimienta. Marina 15 minutos (o toda la noche).", "Sella el cordero en una sartén de hierro muy caliente — que coja color intenso por todos lados. Baja el fuego, tapa y cocina 20 minutos hasta que se deshilache.", "Prepara la base: yogur + ajo rallado + zumo de limón + pizca de sal. Extiende en una fuente como un lago blanco.", "Coloca el cordero deshilachado sobre el yogur. Rocía con los jugos de la sartén.", "Corona: pistachos machacados, menta rasgada a mano, un hilo de miel cruda y pimienta negra recién molida."],
    nota_food_mood_es: "El cordero es una de las carnes más ricas en zinc y hierro hemo (biodisponibilidad directa). El zinc es esencial para la síntesis de GABA y la regulación del sistema inmune — ambos se debilitan con la caída de estrógenos. La canela estabiliza la glucosa (no habrá bajón después de cenar). El yogur aporta probióticos + la grasa facilita la absorción de la curcumina. Los pistachos son el fruto seco más rico en vitamina B6 — cofactor obligatorio para convertir triptófano en serotonina. La menta contiene mentol y rosmarinic acid con efecto ansiolítico. Confort profundo con arquitectura neuronal.",
    tags: ["cena", "media", "con-carne", "chef", "ottolenghi"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-CH-risotto-azafran-burrata",
    nombre_es: "Risotto de Azafrán con Burrata, Pistacho y Limón Confitado",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "media",
    tiempo_preparacion_min: 30,
    contexto_es: "El risotto de azafrán llevado al siguiente nivel: cuando la mantecatura está perfecta, pones una burrata entera en el centro. Se abre, se derrama, y todo cambia. Pistachos y limón confitado rematan la obra maestra.",
    ingredientes_es: ["200g arroz arborio", "0.5g azafrán en hebras", "750ml caldo de verduras caliente", "80ml vino blanco seco", "1 burrata fresca", "30g pistachos machacados", "Piel de limón confitado picada fina (o ralladura de limón fresco)", "40g parmesano rallado", "20g mantequilla (o ghee)", "1 cebolla pequeña picada fina", "Aceite de oliva virgen extra", "Pimienta negra", "Sal marina en escamas"],
    preparacion_es: ["Infusiona el azafrán en 100ml del caldo caliente 10 minutos.", "Sofríe la cebolla en aceite de oliva a fuego suave. Añade el arroz, tuesta 2 minutos.", "Vierte el vino. Cuando absorba, empieza con el caldo — primero el del azafrán, luego el resto, cucharón a cucharón.", "A los 18-20 minutos, retira del fuego. Añade mantequilla y parmesano. Remueve con energía — la mantecatura es la magia.", "Sirve en plato hondo. Coloca la burrata entera en el centro. Córtala — que se derrame.", "Corona con pistachos, limón confitado, pimienta negra y escamas de sal."],
    nota_food_mood_es: "La crocina del azafrán inhibe la recaptación de serotonina y dopamina — efecto antidepresivo documentado en ensayos clínicos, comparable a fluoxetina en depresión leve. La burrata aporta caseína, que contiene casomorfinas — péptidos con efecto opiode suave que inducen calma y bienestar (por eso el queso reconforta). Los pistachos: vitamina B6 para la síntesis de serotonina. El limón confitado aporta d-limoneno, terpeno con efecto ansiolítico demostrado en aromaterapia — aquí lo comes directamente. El parmesano es uno de los quesos más ricos en tirosina (precursor de dopamina). Cada capa de este risotto tiene una capa de neuroquímica.",
    tags: ["cena", "media", "vegetariano", "chef", "ottolenghi", "azafran"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "CAL-W45-CH-salmon-chermoula",
    nombre_es: "Salmón con Chermoula Verde, Cebolla Caramelizada y Yogur de Limón",
    mood_es: "Calma",
    tipo_plato: "cena",
    dificultad: "media",
    tiempo_preparacion_min: 25,
    contexto_es: "Chermoula es la salsa verde del norte de África: cilantro, comino, ajo, limón, pimentón. Cubre el salmón como un manto esmeralda, y el contraste con la cebolla dulce caramelizada y el yogur ácido crea capas de sabor que no quieres que terminen.",
    ingredientes_es: ["2 lomos de salmón fresco", "Para la chermoula: cilantro fresco (un manojo grande), comino molido (1 cdt), pimentón dulce (1 cdt), 2 dientes de ajo, zumo de 1 limón, 4 cdas aceite de oliva", "2 cebollas grandes cortadas en medias lunas finas", "1 cucharada de miel cruda (para caramelizar)", "150g yogur griego", "Ralladura de limón", "Semillas de sésamo negro", "Sal y pimienta"],
    preparacion_es: ["Prepara la chermoula: tritura todos los ingredientes de la salsa hasta textura de pesto rústico. Reserva.", "Carameliza las cebollas: cocina a fuego muy bajo con aceite de oliva, sal y miel 20 minutos, removiendo cada 5 min. Deben quedar oscuras y pegajosas.", "Mientras: sella el salmón piel abajo en sartén caliente 4 minutos. Dale la vuelta, cubre con una capa generosa de chermoula y cocina 3 minutos más.", "Mezcla yogur con ralladura de limón y sal.", "Monta: base de yogur, cebolla caramelizada encima, salmón con chermoula coronando. Sésamo negro y un hilo de aceite."],
    nota_food_mood_es: "El salmón: DHA y EPA para membranas neuronales + vitamina D para receptores cerebrales del humor. El cilantro contiene linalol (el mismo terpeno ansiolítico de la albahaca y la lavanda) y tiene propiedades quelantes de metales pesados. El comino estimula enzimas digestivas y modula la flora intestinal. La cebolla caramelizada aporta fructo-oligosacáridos (FOS) — prebióticos poderosos que alimentan bifidobacterias. El yogur cierra el circuito probiótico. DHA + terpenos ansiolíticos + prebióticos + probióticos = calma funcional con sabor a norte de África.",
    tags: ["cena", "media", "con-pescado", "chef", "ottolenghi", "omega3"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  // --- FOCUS ---
  {
    id: "FOC-W45-CH-pulpo-garbanzos",
    nombre_es: "Pulpo a la Brasa sobre Hummus Caliente con Pimentón y Limón Negro",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "media",
    tiempo_preparacion_min: 30,
    contexto_es: "Hummus caliente — no frío, caliente — como base. Pulpo chamuscado con pimentón ahumado encima. Limón negro (o ralladura de limón + sumac) como acento final. Esto es lo que pasa cuando el Mediterráneo y el Golfo Pérsico se encuentran en tu cocina.",
    ingredientes_es: ["300g patas de pulpo cocido", "200g garbanzos cocidos", "3 cucharadas de tahini", "Zumo de 1 limón", "1 diente de ajo", "1 cucharadita de pimentón ahumado de la Vera", "Limón negro en polvo (o 1 cdt sumac + ralladura de limón)", "Aceite de oliva virgen extra (generoso)", "Perejil fresco", "Sal marina en escamas"],
    preparacion_es: ["Prepara el hummus: tritura garbanzos + tahini + limón + ajo + 3 cucharadas de aceite de oliva + agua tibia hasta textura muy cremosa. Caliéntalo en un cazo a fuego suave.", "Seca el pulpo. En una sartén de hierro ardiente (sin aceite), marca las patas hasta que la superficie esté crujiente y chamuscada — 2 minutos por lado.", "Extiende el hummus caliente en un plato hondo.", "Coloca el pulpo encima. Espolvorea pimentón ahumado y limón negro (o sumac + ralladura).", "Termina con aceite de oliva crudo, perejil y escamas de sal."],
    nota_food_mood_es: "El pulpo es extraordinariamente rico en vitamina B12 (esencial para la mielina que recubre los nervios — sin ella, la transmisión neural se ralentiza), hierro hemo y zinc. Los garbanzos del hummus + tahini = proteína completa con triptófano. El pimentón ahumado contiene capsantina, carotenoide con propiedades neuroprotectoras. El ajo aporta FOS prebióticos y aliina (convertida en alicina al triturarse — antimicrobiana). Un plato que sabe a fiesta pero que tu cerebro procesa como combustible de alta octanaje.",
    tags: ["almuerzo", "media", "con-marisco", "chef", "ottolenghi", "proteina-completa"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-CH-coliflor-entera",
    nombre_es: "Coliflor Entera Asada con Salsa de Tahini Tostado y Almendras",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "media",
    tiempo_preparacion_min: 45,
    contexto_es: "La reina de las verduras según Ottolenghi. Una coliflor entera, asada hasta dorada y casi caramelizada, servida como pieza central con tahini tostado que chorrea por los lados. El plato que convierte a cualquier verdura-escéptico.",
    ingredientes_es: ["1 coliflor entera (mediana)", "3 cucharadas de tahini", "2 cucharadas de aceite de oliva", "1 cucharadita de cúrcuma", "1 cucharadita de comino", "30g almendras laminadas tostadas", "Zumo de 1 limón", "1 diente de ajo rallado", "Perejil fresco (abundante)", "Chile seco en copos", "Sal marina"],
    preparacion_es: ["Hierve agua con sal en una olla grande. Sumerge la coliflor entera y blanquea 8 minutos. Saca y seca bien.", "Mezcla aceite de oliva, cúrcuma, comino y sal. Unta toda la coliflor.", "Asa en horno a 200°C durante 30-35 minutos hasta dorada y tierna (puedes insertar un cuchillo sin resistencia).", "Prepara la salsa: tahini + limón + ajo + agua tibia hasta consistencia de crema fluida.", "Sirve la coliflor entera en una fuente. Vierte el tahini encima dejando que caiga por los lados. Corona con almendras, perejil abundante y chile en copos."],
    nota_food_mood_es: "La coliflor es la crucífera con más glucosinolatos por gramo — precursores de sulforafano, el activador más potente de la vía Nrf2 (defensa antioxidante del cerebro). Al asarla entera, concentras los azúcares naturales creando compuestos de Maillard que potencian el sabor umami. El tahini tostado aporta sesaminol, un lignano con efecto neuroprotector demostrado en modelos de Alzheimer. Las almendras: vitamina E (antioxidante liposoluble que protege las neuronas), magnesio y riboflavina. La cúrcuma en la corteza dorada de la coliflor se absorbe con la grasa del aceite y el tahini. Plato completo, impresionante, vegetal y con más neuroprotección por centímetro cuadrado que cualquier suplemento.",
    tags: ["almuerzo", "media", "vegetariano", "chef", "ottolenghi", "sin-harina"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-CH-dorada-harissa",
    nombre_es: "Dorada al Horno con Harissa Casera, Garbanzos y Hierbas",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "media",
    tiempo_preparacion_min: 30,
    contexto_es: "Un plato que se hace en una sola bandeja y explota en color rojo: la harissa pinta la dorada como un cuadro, los garbanzos absorben todos los jugos, y las hierbas frescas ponen el punto verde final. Norte de África en 30 minutos.",
    ingredientes_es: ["1 dorada entera limpia (o 2 filetes)", "200g garbanzos cocidos", "2 cucharadas de harissa (comprada o casera)", "1 limón cortado en rodajas finas", "1 cucharadita de comino", "Cilantro y perejil frescos (abundantes)", "1 cebolla roja en medias lunas", "Aceite de oliva virgen extra", "Sal marina"],
    preparacion_es: ["Precalienta horno a 210°C.", "Extiende garbanzos y cebolla en una bandeja. Mezcla con aceite de oliva, comino y sal.", "Coloca la dorada (o filetes) encima. Unta con harissa por toda la superficie. Coloca rodajas de limón encima y alrededor.", "Hornea 20-25 minutos (dorada entera) o 15 (filetes) hasta que la piel esté crujiente y la carne se separe fácil.", "Saca del horno. Cubre con cilantro y perejil rasgados. Sirve directo de la bandeja en la mesa."],
    nota_food_mood_es: "La dorada aporta proteína magra + selenio (cofactor del glutatión, el antioxidante maestro del cerebro) + yodo para la tiroides. La harissa contiene capsaicina que estimula la liberación de endorfinas + carotenoides de los pimientos. Los garbanzos absorben los jugos del pescado y aportan triptófano + hierro + folatos. El cilantro contiene linalol (ansiolítico natural) y tiene capacidad quelante de metales pesados. El comino tostado estimula enzimas digestivas que mejoran la absorción de todos los nutrientes. Una sola bandeja, un solo horno, máximo impacto neurofuncional.",
    tags: ["almuerzo", "media", "con-pescado", "chef", "ottolenghi"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "FOC-W45-CH-ensalada-tibia-lentejas",
    nombre_es: "Ensalada Tibia de Lentejas con Remolacha Asada, Queso de Cabra y Nueces",
    mood_es: "Focus",
    tipo_plato: "almuerzo",
    dificultad: "facil",
    tiempo_preparacion_min: 25,
    contexto_es: "Tibia — ni fría ni caliente. Las lentejas tienen cuerpo, la remolacha dulzor terroso, el queso de cabra acidez cremosa y las nueces crujiente. Es la ensalada que te hace olvidar que es una ensalada.",
    ingredientes_es: ["200g lentejas pardinas o de Puy cocidas", "2 remolachas asadas cortadas en cuartos", "80g queso de cabra fresco", "30g nueces", "Un manojo de rúcula", "Eneldo fresco", "Para la vinagreta: 3 cdas AOVE, 1 cda vinagre de sidra, 1 cdt mostaza de Dijon, 1 cdt miel cruda, sal y pimienta"],
    preparacion_es: ["Mezcla las lentejas tibias con la vinagreta en un bol grande.", "Añade la remolacha asada y la rúcula. Mezcla suavemente.", "Sirve en una fuente. Desmenuza el queso de cabra por encima en trozos irregulares. Añade nueces y eneldo generoso.", "Un último hilo de aceite de oliva. No revuelvas más — los estratos son parte del diseño."],
    nota_food_mood_es: "Las lentejas pardinas son las más ricas en hierro y folatos entre las legumbres — sin hierro no hay oxígeno cerebral, sin folatos no hay síntesis de dopamina ni serotonina. La remolacha aporta nitratos que el cuerpo convierte en óxido nítrico — vasodilatador que mejora el flujo sanguíneo cerebral. Las nueces: omega-3 (ALA) + melatonina + ácido elágico (antioxidante). El queso de cabra aporta probióticos suaves + proteína de fácil digestión. El vinagre de sidra mantiene el pH intestinal en rango óptimo para la microbiota. Cada ingrediente tiene una función. El sabor es el bonus.",
    tags: ["almuerzo", "facil", "vegetariano", "chef", "ottolenghi", "hierro"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  // --- RESET ---
  {
    id: "RES-W45-CH-gazpacho-cereza",
    nombre_es: "Gazpacho de Cereza con Burrata, Almendras y Albahaca",
    mood_es: "Reset",
    tipo_plato: "cena",
    dificultad: "facil",
    tiempo_preparacion_min: 15,
    contexto_es: "Gazpacho, pero no como lo conoces. La cereza le da un color rubí intenso y una dulzura natural que contrasta con la acidez del tomate y el vinagre. La burrata en el centro lo convierte en un espectáculo. Plato frío de verano que resetea.",
    ingredientes_es: ["250g cerezas frescas deshuesadas", "3 tomates maduros", "1 trozo de pimiento rojo", "1 diente de ajo pequeño", "2 cucharadas de AOVE", "1 cucharada de vinagre de kombucha (Kombuv+H)", "1 burrata pequeña", "Almendras laminadas tostadas", "Hojas de albahaca fresca", "Sal marina en escamas", "Pimienta negra"],
    preparacion_es: ["Tritura cerezas + tomates + pimiento + ajo + aceite + vinagre + sal hasta textura sedosa. Prueba y ajusta acidez/sal.", "Refrigera mínimo 30 minutos (mejor 2 horas).", "Sirve en platos hondos fríos. Coloca la burrata en el centro.", "Corona con almendras, albahaca rasgada, un hilo de AOVE, escamas de sal y pimienta negra.", "Rómpela con la cuchara delante del comensal."],
    nota_food_mood_es: "Las cerezas contienen melatonina endógena y antocianinas que cruzan la barrera hematoencefálica con efecto neuroprotector. El tomate aporta licopeno (potenciado por el aceite de oliva = absorción ×5). El Kombuv+H añade ácidos orgánicos que alimentan bifidobacterias. La burrata: casomorfinas — péptidos calmantes. La albahaca: linalol ansiolítico. Las almendras: vitamina E neuroprotectora + magnesio relajante. Un plato frío con una arquitectura caliente de neurotransmisores.",
    tags: ["cena", "facil", "vegetariano", "chef", "ottolenghi", "verano", "cereza"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "RES-W45-CH-lubina-hinojo-citricos",
    nombre_es: "Lubina Cruda Marinada con Hinojo Afeitado, Cítricos y Aceite de Pistacho",
    mood_es: "Reset",
    tipo_plato: "cena",
    dificultad: "media",
    tiempo_preparacion_min: 20,
    contexto_es: "Crudo, fresco, vibrante. Láminas translúcidas de lubina marinadas en cítricos, hinojo cortado tan fino que se transparenta, pistachos triturados y un aceite verde intenso. El plato más ligero y más elegante que puedes servir.",
    ingredientes_es: ["300g lomo de lubina fresca (sashimi grade)", "1 bulbo de hinojo con sus hojas verdes", "1 naranja sanguina (o naranja normal)", "1 pomelo rosa", "30g pistachos", "3 cucharadas de AOVE", "Zumo de 1 lima", "Sal marina en escamas", "Pimienta rosa en grano"],
    preparacion_es: ["Congela la lubina 24h antes (elimina anisakis). Descongela en nevera 8h.", "Corta en láminas finas tipo sashimi con cuchillo muy afilado.", "Lamina el hinojo lo más fino posible (usa mandolina si tienes).", "Pela los cítricos a vivo y separa en gajos limpios sin piel blanca.", "Monta: extiende lubina en plato frío. Hinojo, gajos de cítricos alternados. Pistachos machacados.", "Aliña con lima, AOVE y sal justo antes de servir. Pimienta rosa y hojas de hinojo como toque final."],
    nota_food_mood_es: "La lubina es rica en selenio (cofactor del glutatión) y proteína de altísima digestibilidad. Al no cocinarse, preserva todos los omega-3 intactos. El hinojo contiene anetol — fitoestrógeno suave especialmente útil en la transición menopáusica, además de ser carminativo (reduce gases e hinchazón). Los cítricos aportan hesperidina y vitamina C que protege los omega-3 del pescado. Los pistachos: vitamina B6 + luteína (protección retiniana). Este plato no genera ningún trabajo digestivo — todo se absorbe rápido y limpio. Reset puro.",
    tags: ["cena", "media", "con-pescado", "chef", "ottolenghi", "crudo"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "RES-W45-CH-verduras-harissa-huevo",
    nombre_es: "Bandeja de Verduras Asadas con Harissa, Labneh y Huevo Pochado",
    mood_es: "Reset",
    tipo_plato: "almuerzo",
    dificultad: "media",
    tiempo_preparacion_min: 35,
    contexto_es: "Una bandeja donde cada verdura ha encontrado su mejor versión en el horno: bordes dorados, centros tiernos. El labneh (yogur colado) aporta frescura, la harissa fuego suave, y el huevo pochado — cuando lo rompes — lo une todo con oro líquido.",
    ingredientes_es: ["1 boniato en rodajas gruesas", "1 calabacín en medias lunas", "1 pimiento rojo en tiras", "200g garbanzos cocidos", "1 cucharada de harissa", "4 cucharadas de AOVE", "150g labneh (o yogur griego colado con paño 4h)", "2 huevos ecológicos", "Za'atar", "Cilantro y menta frescos", "Semillas de sésamo", "Sal marina"],
    preparacion_es: ["Precalienta horno a 220°C.", "Mezcla verduras y garbanzos con aceite de oliva, harissa y sal en una bandeja grande. No amontonar.", "Asa 25 minutos hasta bordes dorados.", "Mientras: pocha los huevos en agua con un chorrito de vinagre (3 minutos para yema líquida).", "Sirve: base de labneh extendido en la fuente, verduras asadas encima, huevos pochados coronando. Za'atar, sésamo, hierbas frescas y aceite crudo."],
    nota_food_mood_es: "El boniato asado desarrolla almidón resistente (prebiótico). Los garbanzos + labneh = probiótico + prebiótico + proteína completa. La harissa aporta capsaicina (endorfinas) y carotenoides. El huevo pochado preserva la colina intacta (el calor excesivo la degrada). El za'atar contiene tomillo (carvacrol ansiolítico) + sésamo (triptófano + calcio). Una bandeja, un horno, múltiples capas de reset intestinal y neuronal.",
    tags: ["almuerzo", "media", "vegetariano", "chef", "ottolenghi", "prebiotico"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  },
  {
    id: "RES-W45-CH-compota-azafran-kefir",
    nombre_es: "Compota Persa de Albaricoques al Azafrán con Kéfir y Cardamomo",
    mood_es: "Reset",
    tipo_plato: "desayuno",
    dificultad: "facil",
    tiempo_preparacion_min: 15,
    contexto_es: "Orejones de albaricoque cocidos lentamente con azafrán y cardamomo hasta que el almíbar se vuelve dorado y perfumado. Sobre un lago de kéfir frío, con pistachos y pétalos de rosa si los tienes. Persia en tu desayuno.",
    ingredientes_es: ["150g orejones de albaricoque (deshidratados, sin sulfitos)", "0.3g azafrán en hebras", "3 vainas de cardamomo abiertas", "200ml agua", "1 cucharada de miel cruda", "200g kéfir natural", "20g pistachos", "Pétalos de rosa secos (opcional)", "Ralladura de naranja"],
    preparacion_es: ["Pon orejones, azafrán, cardamomo, agua y miel en un cazo pequeño.", "Cocina a fuego muy bajo 10-12 minutos hasta que los orejones se hinchen y el líquido se convierta en almíbar dorado y perfumado.", "Deja entibiar 5 minutos.", "Sirve kéfir frío en un bol. Vierte la compota tibia encima con todo su almíbar.", "Corona con pistachos, ralladura de naranja y pétalos de rosa si los tienes."],
    nota_food_mood_es: "Los orejones de albaricoque son la fuente más concentrada de betacaroteno entre las frutas secas + hierro + potasio. El azafrán: crocina y safranal con efecto antidepresivo documentado (actúa sobre serotonina y dopamina). El cardamomo contiene cineol, terpeno que mejora el flujo sanguíneo cerebral y tiene propiedades digestivas. El kéfir aporta hasta 40 cepas probióticas. Los pistachos: B6 + melatonina. Un desayuno que huele a Persia y le habla directamente a tu eje intestino-cerebro desde la primera cucharada.",
    tags: ["desayuno", "facil", "vegetariano", "chef", "ottolenghi", "azafran", "probiotico"],
    premium_level: 2,
    sexo: "unisex",
    grupo_edad: "",
    segmento: "adulto"
  }
];

async function apply() {
  try {
    console.log('--- 1. Backing up Recetas ---');
    const { data: bData, error: bError } = await supabase.from('recetas').select('*');
    if (bError) throw bError;
    fs.writeFileSync('recetas_backup_chef.json', JSON.stringify(bData, null, 2));
    console.log(`Backup saved to recetas_backup_chef.json (${bData.length} recipes)`);

    console.log('\n--- 2. Upserting 12 Chef Recipes ---');
    const { error: upsertError } = await supabase.from('recetas').upsert(RECIPES_CHEF, { onConflict: 'id' });
    if (upsertError) throw upsertError;
    console.log('Successfully upserted 12 chef recipes.');

    console.log('\n--- 3. Updating Glossary Links ---');
    // We update existing glossary slugs if they are found in the text
    const { data: glossaryData, error: gError } = await supabase.from('glossary').select('slug, food_mood_recipes');
    if (gError) throw gError;

    let updatedCount = 0;
    for (const term of glossaryData) {
      const slugMatch = term.slug.toLowerCase().replace(/-/g, ' ');
      let matches = [];
      
      for (const recipe of RECIPES_CHEF) {
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
    console.log(`Glossary update complete. Modified ${updatedCount} existing terms.`);

  } catch (err) {
    console.error('Task failed:', err);
  }
}

// IF I WERE TO RUN THIS, THIS CODE WOULD BE EXECUTED:
apply();
