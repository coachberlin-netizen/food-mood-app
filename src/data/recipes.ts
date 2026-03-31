export type Difficulty = "facil" | "medio";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  note?: string;
}

export interface Recipe {
  id: string;
  moodId: string;
  title: string;
  title_en: string;
  tagline: string;
  description: string;
  acidBase: string;
  prepTime: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  foodMoodNote: string;
  scienceQR: string;
  tags: string[];
  imagePrompt: string;
  image?: string;
  season: string[];
}

export const recipesData: Recipe[] = [
  // ACTIVACION
  {
    id: "r1",
    moodId: "activacion",
    title: "Shot de Jengibre, Limón y Kombucha",
    title_en: "Ginger, Lemon & Kombucha Shot",
    tagline: "El primer latido del día",
    description: "Un tónico vivo que enciende tu digestión y metabolismo desde el primer sorbo, ideal para comenzar la mañana.",
    acidBase: "Kombuv+H",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Jengibre fresco", quantity: "1 trozo (2cm)", note: "Rallado fino" },
      { name: "Limón", quantity: "1/2", note: "Zumo recién exprimido" },
      { name: "Kombucha original (Kombuv+H)", quantity: "30ml" },
      { name: "Pimienta cayena", quantity: "1 pizca" }
    ],
    steps: [
      "Ralla el jengibre fresco y exprime su jugo directamente en un vaso pequeño.",
      "Añade el zumo de medio limón recién exprimido.",
      "Vierte orgánicamente la kombucha viva (Kombuv+H).",
      "Agrega una pequeña pizca de pimienta cayena para activar la circulación.",
      "Bebe de un solo trago, sintiendo el calor bajar por el sistema."
    ],
    foodMoodNote: "Siente un calor inmediato y un chispazo de alerta vital. La acidez cítrica viva estimula el nervio vago, mientras el jengibre acelera el vaciado gástrico, enviando señales de 'acción' desde tu intestino al cerebro sin picos de cortisol.",
    scienceQR: "Los gingeroles estimulan la termogénesis y aceleran la digestión.",
    tags: ["Despertar", "Metabolismo", "Probiótico"],
    imagePrompt: "Un vaso de chupito corto lleno de un líquido amarillo dorado vibrante con pequeñas burbujas, sobre una encimera de mármol negro con rodajas de limón fresco y jengibre al lado, luz dura oblicua de la mañana.",
    image: "/images/recetas/r1.png.png",
    season: ["Todo el año"]
  },
  {
    id: "r2",
    moodId: "activacion",
    title: "Ensalada Cítrica con Vinagreta de Kombuv+H",
    title_en: "Citrus Salad with Kombuv+H Vinaigrette",
    tagline: "Frescura que despierta",
    description: "Una explosión de colores y texturas diseñada para romper el letargo con crujientes vivos y ácidos suaves.",
    acidBase: "Vinagre de kombucha",
    prepTime: 10,
    difficulty: "facil",
    servings: 2,
    ingredients: [
      { name: "Pomelo y naranja", quantity: "1 de cada", note: "Cortados a vivo" },
      { name: "Hinojo crudo", quantity: "1/2 bulbo", note: "Laminado muy fino" },
      { name: "Aceite de oliva AOVE", quantity: "2 cdas" },
      { name: "Vinagre de kombucha", quantity: "1 cda" },
      { name: "Pistachos", quantity: "1 puñado" }
    ],
    steps: [
      "Corta el hinojo en láminas traslúcidas (si es posible con mandolina) y remójalo en agua con hielo 5 min para extra crujiente.",
      "Pela y corta a vivo (sin membranas) el pomelo y la naranja.",
      "En un bol pequeño, emulsiona el AOVE con el vinagre de kombucha y sal en escamas.",
      "Seca el hinojo y mézclalo suavemente con los cítricos.",
      "Aliña, espolvorea pistachos tostados picados groseramente y sirve al instante."
    ],
    foodMoodNote: "El crujido del hinojo junto con el estallido ácido rompen la niebla mental. Estos ácidos orgánicos vivos previenen letargos postprandiales, asegurando que tu sistema digestivo mantenga un flujo energético alto hacia el torrente sanguíneo.",
    scienceQR: "El ácido acético de la kombucha modula la curva de glucosa post-comida.",
    tags: ["Crujiente", "Ligero", "Energía sostenida"],
    imagePrompt: "Una ensalada colorida de cítricos rosas y naranjas con hinojo blanco translúcido en un bol de cerámica rústica blanca plana, pistachos esparcidos, vinagreta dorada brillando, fotografía cenital minimalista.",
    image: "/images/recetas/r2.png.png",
    season: ["Invierno", "Primavera"]
  },
  {
    id: "r3",
    moodId: "activacion",
    title: "Tostada de Miel Cruda, Pimienta y Limón",
    title_en: "Raw Honey, Pepper & Lemon Toast",
    tagline: "Dulce con mordisco",
    description: "El snack rápido perfecto para la media mañana: energía rápida pero respaldada por bioflavonoides que la sostienen.",
    acidBase: "Limón natural",
    prepTime: 3,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Pan de masa madre", quantity: "1 rebanada gruesa" },
      { name: "Miel cruda (no pasteurizada)", quantity: "1 cda" },
      { name: "Ralladura de limón", quantity: "1 cdta" },
      { name: "Pimienta negra", quantity: "1 pizca", note: "Recién molida gruesa" },
      { name: "Mantequilla fermentada", quantity: "1 cdta", note: "Opcional" }
    ],
    steps: [
      "Tuesta la rebanada de pan de masa madre hasta que esté muy dorada y crujiente.",
      "Unta la mantequilla fermentada en caliente para que se funda en los alvéolos.",
      "Deja caer hijos de miel cruda irregularmente sobre la tostada.",
      "Ralla limón fresco por encima (solo la parte amarilla).",
      "Termina con un par de giros de molinillo de pimienta negra."
    ],
    foodMoodNote: "Te invade un placer cálido que rápidamente escala a concentración aguda. La piperina de la pimienta y la miel cruda ofrecen un impulso dopaminérgico rápido, mientras la acidez del limón en la lengua actúa como ancla sensorial de vigilia.",
    scienceQR: "La piperina aumenta drásticamente la absorción gástrica de nutrientes.",
    tags: ["Rápido", "Snack", "Dopamina"],
    imagePrompt: "Rebanada crujiente de pan de masa madre rústico con mantequilla derretida y miel dorada cayendo, salpicada de cáscara de limón amarilla brillante y pimienta negra gruesa, primerísimo plano texturizado.",
    image: "/images/recetas/r3.png.png",
    season: ["Todo el año"]
  },

  // CALMA
  {
    id: "r4",
    moodId: "calma",
    title: "Caldo Dashi con Miso y Tofu Sedoso",
    title_en: "Dashi Broth with Miso & Silken Tofu",
    tagline: "Silencio en un bol",
    description: "Un bálsamo líquido que asienta el estómago y envuelve el sistema nervioso en un velo tibio de umami.",
    acidBase: "Kombuv+H",
    prepTime: 15,
    difficulty: "facil",
    servings: 2,
    ingredients: [
      { name: "Agua filtrada", quantity: "500ml" },
      { name: "Alga kombu", quantity: "1 tira pequeña" },
      { name: "Pasta de miso blanco", quantity: "1-2 cdas", note: "Importante: sin pasteurizar" },
      { name: "Tofu sedoso", quantity: "100g", note: "En cubos minúsculos" },
      { name: "Cebolleta", quantity: "1 rama", note: "Solo la parte verde, cortada fina" }
    ],
    steps: [
      "Infusiona el alga kombu en el agua a fuego suave durante 10 minutos (sin que llegue a hervir fuerte).",
      "Retira el kombu, añade los cubos de tofu y apaga el fuego.",
      "En un cucharón o cuenco aparte, disuelve la pasta de miso con un poco de caldo caliente.",
      "Devuelve la mezcla de miso a la olla (esto mantiene vivos los probióticos al no hervir).",
      "Sirve en cuencos y espolvorea la cebolleta fresca."
    ],
    foodMoodNote: "Sientes un pesado manto de alivio desde el pecho hasta el bajo vientre. Los aminoácidos del dashi (especialmente el ácido glutámico) envían señales calmantes al intestino, reduciendo inmediatamente la motilidad espástica relacionada con la ansiedad.",
    scienceQR: "El miso vivo aporta bacterias que modulan el nervio simpático bajando la frecuencia cardíaca.",
    tags: ["Bálsamo", "Umami", "Cena"],
    imagePrompt: "Un cuenco de cerámica negra profunda humeante con caldo miso translúcido, diminutos y perfectos cubos de tofu sedoso blanco y finos anillos verdes de cebolleta en la superficie, luz tenue de cena cálida.",
    image: "/images/recetas/r4.png.png",
    season: ["Otoño", "Invierno"]
  },
  {
    id: "r5",
    moodId: "calma",
    title: "Leche Dorada de Cúrcuma y Ghee",
    title_en: "Turmeric & Ghee Golden Milk",
    tagline: "El abrazo líquido",
    description: "Una poción ancestral antiinflamatoria para desactivar los estresores diarios antes de dormir.",
    acidBase: "No aplica",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Bebida de avena o almendra", quantity: "250ml" },
      { name: "Cúrcuma en polvo", quantity: "1 cdta" },
      { name: "Ghee (mantequilla clarificada)", quantity: "1 cdta" },
      { name: "Pimienta negra", quantity: "1 pizca" },
      { name: "Canela en polvo", quantity: "1/2 cdta" }
    ],
    steps: [
      "Calienta la leche suavemente en un cazo.",
      "Añade la cúrcuma, canela y pimienta negra batiendo con unas varillas.",
      "Justo antes del hervor, apaga el fuego e incorpora el ghee.",
      "Bate enérgicamente (o espumador) hasta que se cree una emulsión dorada y espumosa.",
      "Sírvelo muy caliente en una taza gruesa que puedas sostener con ambas manos."
    ],
    foodMoodNote: "La densidad táctil del ghee y el calor terroso de la cúrcuma ofrecen profunda protección. Las grasas buenas sellan la barrera intestinal y la curcumina desinflama las mucosas, propiciando directamente una bajada en el cortisol sérico.",
    scienceQR: "La cúrcuma unida a las grasas del ghee cruza la barrera intestinal eficientemente bajando marcadores proinflamatorios autonómicos.",
    tags: ["Ritual de noche", "Antiinflamatorio", "Emulsión"],
    imagePrompt: "Taza de cerámica artesanal gruesa sostenida por dos manos, llena de un líquido espeso, espumoso y amarillo dorado (leche dorada), salpicada de canela por encima, atmósfera de interior nocturno acogedor.",
    image: "/images/recetas/r5.png.png",
    season: ["Todo el año"]
  },
  {
    id: "r6",
    moodId: "calma",
    title: "Infusión de Manzanilla con Lavanda y Miel",
    title_en: "Chamomile, Lavender & Honey Infusion",
    tagline: "Respira, suelta, bebe",
    description: "La decocción definitiva para apagar el ruido mental. Floral, dulce y suavemente sedante.",
    acidBase: "No aplica",
    prepTime: 8,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Flores de manzanilla enteras", quantity: "1 cda" },
      { name: "Lavanda culinaria seca", quantity: "1/2 cdta" },
      { name: "Agua mineral", quantity: "250ml" },
      { name: "Miel suave", quantity: "1 cdta" }
    ],
    steps: [
      "Lleva el agua a ebullición y apaga el fuego.",
      "Añade la manzanilla y la lavanda al agua (no hiervas las hojas para no extraer taninos amargos).",
      "Tapa y deja reposar entre 5 y 7 minutos según tu gusto.",
      "Cuela en una taza de cristal para ver el color ambarino.",
      "Mezcla la miel cuando la temperatura haya bajado a un estado bebible."
    ],
    foodMoodNote: "Siente cómo tu musculatura abdominal se suelta involuntariamente al percibir los vapores de lavanda. La apigenina de la manzanilla se adhiere a los mismos receptores cerebrales (GABA) que los ansiolíticos, dictando 'tranquilidad' desde tu mucosa gástrica.",
    scienceQR: "Los receptores GABA intestinales detectan apigenina e inducen relajación sistémica.",
    tags: ["Sedante herbal", "Sin teína", "Antes de dormir"],
    imagePrompt: "Una taza de cristal transparente que muestra una infusión de color amarillo ámbar suave, vapores de agua cálidos elevándose, un par de pequeñas flores púrpuras de lavanda enteras flotando, iluminación muy suave, relajante.",
    image: "/images/recetas/r6.png.png",
    season: ["Todo el año"]
  },

  // FOCUS
  {
    id: "r7",
    moodId: "focus",
    title: "Bowl de Matcha, Semillas y Cacao Puro",
    title_en: "Matcha, Seeds & Pure Cacao Bowl",
    tagline: "Combustible para la mente",
    description: "Densidad nutritiva extrema. Aporta energía lipídica estable para jornadas de alta concentración.",
    acidBase: "No aplica",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Yogur de coco o kéfir espeso", quantity: "150g" },
      { name: "Té matcha ceremonial", quantity: "1 cdta rasa" },
      { name: "Nibs de cacao crudo", quantity: "1 cda" },
      { name: "Semillas de calabaza", quantity: "1 cda" },
      { name: "Arándanos frescos", quantity: "1 puñado" }
    ],
    steps: [
      "En un bol mediano, mezcla enérgicamente el yogur con el polvo matcha hasta lograr un color verde pistacho homogéneo.",
      "Añade las semillas de calabaza tostadas.",
      "Incorpora los nibs de cacao en un lado para asegurar textura crujiente constante.",
      "Coloca los arándanos coronando el borde del bol.",
      "Come muy lentamente, masticando bien las semillas."
    ],
    foodMoodNote: "Claridad aguda sin la ansiedad del café. El magnesio de las semillas apoya la neuroplasticidad mientras que el té verde regula la liberación de glucosa de la base lipídica del coco, manteniendo tu cerebro nutrido por horas sin picos de insulina.",
    scienceQR: "L-teanina + Cafeína (Matcha) generan ondas cerebrales alfa asociadas al hiper-foco calmo.",
    tags: ["Densidad", "Superalimentos", "Desayuno"],
    imagePrompt: "Un bol de desayuno redondo y liso color hueso lleno de un yogur grueso color verde matcha pastel, espolvoreado con nibs de cacao crudos oscuros y semillas de calabaza planas brillantes, arándanos azules regordetes a un lado, luz de estudio brillante.",
    image: "/images/recetas/r7.png.png",
    season: ["Todo el año"]
  },
  {
    id: "r8",
    moodId: "focus",
    title: "Ensalada de Hojas Amargas con Nueces y Vinagreta Verde",
    title_en: "Bitter Greens Salad with Walnuts",
    tagline: "Verde que aclara",
    description: "Amargos intensos para reiniciar el paladar y activar el flujo biliar, clave para limpiar el sistema antes de pensar.",
    acidBase: "Limón natural",
    prepTime: 12,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Rúcula y endivias", quantity: "2 puñados" },
      { name: "Nueces picadas", quantity: "30g" },
      { name: "Manzana verde ácida", quantity: "1/4", note: "Cortada en bastones extra finos" },
      { name: "Zumo de limón", quantity: "1 cda" },
      { name: "Aceite de oliva virgen extra", quantity: "1 cda" }
    ],
    steps: [
      "Separa las hojas de endivia y disponlas como barcas. Mezcla con rúcula salvaje.",
      "Corta la manzana verde en finos bastones y añádelos aporta un dulzor tirante.",
      "Tuesta ligeramente las nueces un minuto a la sartén seca para liberar aceites.",
      "Emulsiona AOVE con mucho limón y un mínimo de sal marina.",
      "Vierte por encima y masajea las hojas unos segundos."
    ],
    foodMoodNote: "Te hace sentir limpio y ligero. El toque amargo desencadena respuestas vagales desde la lengua hasta el hígado, promoviendo claridad mental al no requerir a tu intestino lidiar con digestiones lentas y somnolientas.",
    scienceQR: "Los alimentos amargos optimizan la digestión péptica reduciendo la niebla cerebral post-comida.",
    tags: ["Comida de trabajo", "Low-carb", "Ligero"],
    imagePrompt: "Plato de ensalada elegante con hojas de rúcula de color verde oscuro, barquillos de hojas de endivia pálida brillante, bastones muy finos de manzana crujiente verde y trozos dorados de nueces, bañado en una ligera vinagreta de limón, iluminación fresca brillante orientada de lado a lado.",
    image: "/images/recetas/r8.png.png",
    season: ["Primavera", "Verano"]
  },
  {
    id: "r9",
    moodId: "focus",
    title: "Batido de Arándanos, Espinacas y Té Verde",
    title_en: "Blueberry, Spinach & Green Tea Smoothie",
    tagline: "Nitidez morada",
    description: "Un vaso de antioxidantes de rápida asimilación pensado para maratones cognitivas sin pausar para masticar.",
    acidBase: "No aplica",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Arándanos congelados", quantity: "1 taza" },
      { name: "Espinacas baby", quantity: "1 puñado abundante" },
      { name: "Té verde frío", quantity: "200ml" },
      { name: "Proteína de cáñamo o suero aislada", quantity: "1 cazo" }
    ],
    steps: [
      "Prepara previamente un té verde y déjalo enfriar completamente.",
      "Añade en una licuadora de alta potencia el té verde.",
      "Incorpora las espinacas, batir unos segundos para triturar los tallos.",
      "Agrega los arándanos helados y la proteína.",
      "Licúa hasta obtener una textura hiper-suave color violeta denso."
    ],
    foodMoodNote: "Trago frío y fluido que electrifica tu atención. El aporte alto en antocianinas protege de la neuroinflamación generada por el estrés mental, sosteniendo el flujo sanguíneo cerebral de forma constante.",
    scienceQR: "Las antocianinas de arándanos salvajes mejoran transitoriamente el rendimiento ejecutivo frontal.",
    tags: ["Líquido", "Antioxidantes", "Rápido"],
    imagePrompt: "Un vaso alto lleno de un vibrante batido morado profundo perlado por la condensación fría en el cristal. Un par de arándanos congelados asoman por la superficie espesa. Luz dura cinematográfica moderna.",
    image: "/images/recetas/r9.png.png",
    season: ["Todo el año"]
  },

  // SOCIAL
  {
    id: "r10",
    moodId: "social",
    title: "Tabla de Pickles Fermentados y Hummus",
    title_en: "Fermented Pickles & Hummus Board",
    tagline: "Para compartir y discutir",
    description: "El aperitivo definitivo. Microbios vivos cruzándose con texturas cremosas mientras habláis de la vida.",
    acidBase: "Vinagre de kombucha",
    prepTime: 10,
    difficulty: "facil",
    servings: 4,
    ingredients: [
      { name: "Hummus de garbanzos tradicional", quantity: "1 bol generoso" },
      { name: "Pickles probióticos de rábano y zanahoria", quantity: "Variado (100g)" },
      { name: "Aceite de oliva AOVE y Pimentón", quantity: "Para coronar" },
      { name: "Pan pita artesanal tostado", quantity: "Varios" }
    ],
    steps: [
      "Extiende el hummus en un plato llano creando espirales profundas con la cuchara.",
      "Inunda los surcos del hummus con AOVE generoso y espolvorea buen pimentón.",
      "Acomoda al lado montoncitos coloridos de tus fermentos caseros (rábanos rosados, chirivías, zanahorias).",
      "Calienta el pan pita hasta que esté crujiente.",
      "Coloca en el centro de la mesa."
    ],
    foodMoodNote: "El picar fomenta la sincronía social. Los lactobacillus de los pickles sumados a la charla estimulan activamente el nervio vago y elevan la producción de serotonina intestinal. Sentirse en manada da seguridad fisiológica.",
    scienceQR: "Compartir comida rica en simbiontes baja la respuesta de amenaza en la amígdala vía conexión entérica.",
    tags: ["Picoteo", "Encuentro", "Pre+Probiótico"],
    imagePrompt: "Una rústica tabla de madera de olivo llena de humus cremoso con espirales de aceite de oliva virgen extra dorado, chispas rojas de pimentón brillante, rodeada por palitos de rábano de un vibrante color rosa magenta y crujientes panes de pita calientes rotos al azar. Luz dorada de atardecer, cenital.",
    image: "/images/recetas/r10.png.png",
    season: ["Todo el año"]
  },
  {
    id: "r11",
    moodId: "social",
    title: "Shrub de Frutas con Soda",
    title_en: "Fruit Shrub with Soda",
    tagline: "El brindis probiótico",
    description: "Una alternativa sin alcohol compleja, ácida, festiva y protectora de la barrera estomacal.",
    acidBase: "Vinagre de kombucha",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Shrub base (sirope ácido de fruta)", quantity: "30ml" },
      { name: "Vinagre de kombucha (si no está incluido en el shrub)", quantity: "1 cdta extra" },
      { name: "Agua con gas muy fría", quantity: "200ml" },
      { name: "Hielo en cubo grande", quantity: "1 unidad" },
      { name: "Romero fresco", quantity: "1 ramita, machacada para aroma" }
    ],
    steps: [
      "Coloca el hielo macizo en un vaso bajo elegante (tipo rocks).",
      "Vierte el shrub base (mora, melocotón o frambuesa) en el fondo.",
      "Golpea el romero contra tu mano para liberar sus aceites esenciales y ponlo en el vaso.",
      "Añade lentamente agua con gas para mantener máxima efervescencia.",
      "Remueve ligeramente con una cucharilla larga."
    ],
    foodMoodNote: "Una efervescencia celebratoria sin resaca ni letargo. Los ácidos orgánicos de esta bebida promueven enzimas digestivas preparándote para cualquier cena copiosa sin que tu sistema se estanque ni te sientas pesado, dejándote presente en tu charla y conexión con los demás.",
    scienceQR: "Las burbujas estimulan terminaciones nerviosas digestivas aumentando la producción temprana de ácido clorhídrico y facilitando las digestiones pesadas.",
    tags: ["Bebida", "Celebración", "Aperitivo líquido"],
    imagePrompt: "En un vaso de cóctel corto clásico sobre una superficie festiva, un cubito de hielo cristalino extra grande flota rodeado de un líquido esfervescente rosa rojizo oscuro y una ramita muy verde de romero fresco sobresaliendo, con delicadas burbujitas ascendiendo y condensación lateral.",
    image: "/images/recetas/r11.png.png",
    season: ["Verano", "Otoño"]
  },
  {
    id: "r12",
    moodId: "social",
    title: "Bruschetta de Aceitunas y Fermentos",
    title_en: "Olive & Ferments Bruschetta",
    tagline: "Aperitivo con historia",
    description: "Un bocado estructurado de pan denso, grasas buenas del olivo y acentos ácidos para estimular las glándulas salivares.",
    acidBase: "Limón natural",
    prepTime: 10,
    difficulty: "facil",
    servings: 2,
    ingredients: [
      { name: "Aceitunas Kalamata", quantity: "50g", note: "Sin hueso y muy picadas" },
      { name: "Alcaparras pequeñas", quantity: "1 cdta" },
      { name: "Ralladura de limón", quantity: "Al gusto" },
      { name: "Ajo crudo", quantity: "1/2 diente", note: "Frotado despues de tostar" },
      { name: "Rebanadas de focaccia", quantity: "2-4" }
    ],
    steps: [
      "Garantiza que el pan (focaccia o pan rústico) pase por la parrilla o plancha hasta marcar líneas crocantes.",
      "Aprovechando que está muy caliente, frota la cara superior ligeramente con medio ajo.",
      "Pica alcaparras, aceitunas y un hilo de aceite creando un tapenade grueso e imperfecto.",
      "Sirve una buena cucharada esparcida pero apilada sobre la rebanada.",
      "Ralla limón fresco por encima cual nieve."
    ],
    foodMoodNote: "Crocante, intenso y salado, provoca una fuerte palatabilidad que incita a compartir el siguiente trago y seguir la conversación. Estimula intensamente desde las glándulas de la boca abriendo completamente el tracto gástrico para la ingesta.",
    scienceQR: "Los componentes del ajo rinden como potentes pre-bióticos y los polifenoles de la aceituna oscura combaten inflamación colateral.",
    tags: ["Bocado directo", "Intenso", "Salado"],
    imagePrompt: "Una crujiente bruschetta rectangular dorada en la parrilla generosamente cargada de tapenade grueso de aceitunas calamata moradas brillantes, trocitos de alcaparras verde pálido, y ralladura de limón amarillo canario fresca sobre la superficie superior con un fondo difuso del resto de la mesa y una copa a lo lejos, cálida luz natural.",
    image: "/images/recetas/r12.png.png",
    season: ["Todo el año"]
  },

  // RESET
  {
    id: "r13",
    moodId: "reset",
    title: "Caldo Depurativo de Cúrcuma y Jengibre",
    title_en: "Detox Turmeric & Ginger Broth",
    tagline: "Volver a cero",
    description: "Para días siguientes a excesos o viajes. Ligero pero potentemente activador hepático.",
    acidBase: "Kombuv+H",
    prepTime: 20,
    difficulty: "medio",
    servings: 2,
    ingredients: [
      { name: "Agua o caldo mineral tenue", quantity: "500ml" },
      { name: "Jengibre crudo", quantity: "1 rodaja gruesa machacada" },
      { name: "Cúrcuma cruda", quantity: "1 rodajita machacada" },
      { name: "Apio, hojas y tallo pálido", quantity: "2 ramas troceadas" },
      { name: "Sal de roca", quantity: "1/2 cdta" }
    ],
    steps: [
      "Machaca ligeramente la cúrcuma y el jengibre frescos para romper fibras pero no hacerlos papilla.",
      "Simmer (hervir a burbuja minúscula) el tallo de apio, el jengibre y la cúrcuma curativa en el agua durante 15 minutos.",
      "El agua adquirirá un dolor dorado profundo y un aroma leñoso y limpio.",
      "Cuela cuidadosamente apretando las raíces para extraer la resina.",
      "Añade la sal justa en taza y consume muy caliente."
    ],
    foodMoodNote: "Te hace sentir internamente aseado y en paz con tu cuerpo. Este líquido acelera fases de desintoxicación hepática (citocromos) eliminando metales pesados o estrés oxidativo y relajando la pesadez estomacal inmediata.",
    scienceQR: "Activa enzimas glutatión permitiendo procesos eficientes de regeneración celular hepática nocturna.",
    tags: ["Ayuno", "Calor ligero", "Depurador"],
    imagePrompt: "Un austero y refinado caldo limpiador totalmente claro y reluciente en amarillo pajizo en un vaso grueso transparente, donde se puede ver el fondo. Humo asciende lentamente desde la superficie. Fondo oscuro y limpio, sensación clínica pero elegante y espiritual.",
    image: "/images/recetas/r13.png.png",
    season: ["Invierno", "Primavera"]
  },
  {
    id: "r14",
    moodId: "reset",
    title: "Agua de Limón con Kombucha y Pepino",
    title_en: "Lemon Water with Kombucha & Cucumber",
    tagline: "El río interior",
    description: "Una hidratación celular de fondo que resetea el ph estomacal y despierta tejidos.",
    acidBase: "Kombuv+H",
    prepTime: 3,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Agua muy purificada / manantial", quantity: "300ml" },
      { name: "Zumo de medio limón", quantity: "15ml" },
      { name: "Pepino crudo orgánico", quantity: "4 cintas muy finas" },
      { name: "Kombucha original (Kombuv+H)", quantity: "Un chorrito generoso" }
    ],
    steps: [
      "Usa un pelador ancho para sacar 3 o 4 cintas o lazos finísimos y traslúcidos del pepino con su piel oscura fina.",
      "Pon las cintas en el vaso y vierte agua mineral purificada fresca pero no helada.",
      "Agrega el zumo del limón natural recién prensado sin exprimir su amargor.",
      "Culmina agregando ese chorro concentrado de tu kombucha viva para aportar destellos sutiles e inocular la pared celular estomacal.",
      "Bebe de inmediato dejándolo circular por el paladar."
    ],
    foodMoodNote: "Refresco sin azúcar que infunde vida cristalina y orden al sentirte sobrecargado. Aporta minerales y vitamina C estabilizada que limpia de retención hídrica favoreciendo una diuresis calmada tras periodos densos.",
    scienceQR: "Promueve alcalinidad plasmática a través de quelantes de ácidos débiles orgánicos e hidrata a nivel intracelular sin insulina.",
    tags: ["Temprano", "Líquido total", "Frescura extrema"],
    imagePrompt: "Un vaso extra alto lleno de agua transparente, iluminada a contraluz donde se ven largas y delicadas cintas retorcidas de pepino verde vibrante y una mínima rodaja circular de limón, con refracciones de luz espectaculares en el agua. Macro muy estético de hidratación pura.",
    image: "/images/recetas/r14.png.png",
    season: ["Verano", "Primavera"]
  },
  {
    id: "r15",
    moodId: "reset",
    title: "Ensalada de Raíces Amargas con Cítricos",
    title_en: "Bitter Roots & Citrus Salad",
    tagline: "La limpieza amable",
    description: "Bocado firme que rasca la pesadez de tu tracto aportando prebióticos limpios.",
    acidBase: "Vinagre de kombucha",
    prepTime: 12,
    difficulty: "medio",
    servings: 1,
    ingredients: [
      { name: "Daikon (Rábano blanco) pequeño", quantity: "1/4", note: "Rallado a tiras gruesas" },
      { name: "Zanahoria", quantity: "1/2", note: "Cortada transversal fina" },
      { name: "Radicchio (achicoria púrputra)", quantity: "3 hojas" },
      { name: "Naranja sanguina", quantity: "1/2, gajos limpios" },
      { name: "Aceite de Oliva y Vinagre Kombucha", quantity: "Emulsión ligera 2:1" }
    ],
    steps: [
      "Raspa y corta el rábano daikon en tiras gruesas y la zanahoria.",
      "Rompe toscamente con las manos las preciosas hojas marmoleadas de radicchio.",
      "Pon las raíces y hojas amargas en un bol.",
      "Mezcla agresivamente con la vinagreta de vinagre de kombucha para domeñar tenuemente las estructuras de la celulosa cruda.",
      "Sitúa los sangrientos gajos de naranja en los laterales."
    ],
    foodMoodNote: "Produce un restablecimiento total: cada mordida fresca empuja de manera decidida pero no invasiva todo el sistema hacia el movimiento. Estos almidones crudos alimentan bacterias colonizadoras positivas y la amargura del radicchio espabila de la pesadez letárgica mental.",
    scienceQR: "El efecto de rastreo mecánico por celulosa insoluble limpia los pliegues mucosos preparando base para absorción fina futura.",
    tags: ["Crudo vibrante", "Mediodía", "Vegano"],
    imagePrompt: "Un extravagante mosaico visual en bol cerámico: cintas finas pálidas de rábano y zanahoria cruzándose salvajemente con grandes trozos rojo carmesí-violeta de radicchio marmoleado y rubíes triangulares anaranjados brillantes de naranja sanguina, bañados de luz directa contrastada y atractiva, sobre fondo de granito gris.",
    image: "/images/recetas/r15.png.png",
    season: ["Invierno", "Otoño"]
  },

  // CONFORT
  {
    id: "r16",
    moodId: "confort",
    title: "Sopa Miso con Verduras de Raíz",
    title_en: "Miso Soup with Root Vegetables",
    tagline: "Calor desde dentro",
    description: "Espesa, redonda, maternal. Aúna los fermentos estables con el gran poder nutritivo que crece bajo tierra.",
    acidBase: "No aplica",
    prepTime: 25,
    difficulty: "medio",
    servings: 2,
    ingredients: [
      { name: "Boniato o chirivía pequeña", quantity: "1 u", note: "1 cm cubos" },
      { name: "Kombu y bonito seco o espinas suaves", quantity: "Base para un dashi denso" },
      { name: "Pasta de miso rojo oscuro (Aka Miso)", quantity: "2 cdas generosas" },
      { name: "Setas shiitake, remojadas", quantity: "3 enteras y troceadas" }
    ],
    steps: [
      "Hierve a fuego muy lento los bloques del tubérculo duro durante 15 minutos en el propio dashi o caldo claro base.",
      "Al mismo tiempo el hongo shiitake aportará un intenso, a tierra profunda líquido.",
      "Una vez que el boniato está totalmente cedido y mantecoso (pinchable con facilidad), retira del ardor final de la hornilla.",
      "Disuelve el espeso, añejo e invernal miso rojo para darle color a tierra arcillo, revuelve.",
      "Opcionalmente añade gotitas de aceite de sésamo."
    ],
    foodMoodNote: "Abraza el estómago con temperatura y viscosidad espesa reconfortante. El miso de larga fermentación genera un abrazo bioquímico denso que asienta emocionalmente la fragilidad de un estado nervioso hiper-estimulado que ansía refugio.",
    scienceQR: "Fermentos tipo Aka-miso concentran melanoidinas protectoras potentes que desinflaman tejidos de forma calmante y lenta.",
    tags: ["Abrazo cálido", "Invierno denso", "Mediodía o Cena"],
    imagePrompt: "En un tazón rústico de cerámica marrón tierra moteada, un denso, oscuro líquido rojo opaco de miso enmarca pedazos irregulares supertiernos de moniato color naranja quemado hundidos. Un hilo minúsculo de de sésamo dorado brilla. Fotografía hogareña y de cerca que huele cálido y acogedor.",
    image: "/images/recetas/r16.png.png",
    season: ["Invierno", "Otoño"]
  },
  {
    id: "r17",
    moodId: "confort",
    title: "Pan de Masa Madre con Mantequilla Fermentada",
    title_en: "Sourdough Toast with Cultured Butter",
    tagline: "La memoria del hogar",
    description: "Lo fundamental para frenar en un día hostil, volviendo rápido y sencillo a sensaciones infantiles pero nutricionalmente sofisticado.",
    acidBase: "No aplica",
    prepTime: 5,
    difficulty: "facil",
    servings: 1,
    ingredients: [
      { name: "Un gran bloque final de pan de hogaza o espelta rústico casero madre", quantity: "1 loncha extra gruesa" },
      { name: "Mantequilla tipo Beurre Baratte fermentada buena", quantity: "A trozos asimétricos y generosa" },
      { name: "Sal cristalina de mar", quantity: "1 buen pellizco" }
    ],
    steps: [
      "Saca con mucha antelación un trozo grosero de mantequilla pura y déjalo asentar ambiente en la temperatura natural (nunca hielo).",
      "Calienta poderosamente la tostada en tostadora hasta que marque en negro y esté dura como la costra exterior.",
      "Añade en los alvéolos la mantequilla dejando islas macizas y otras semiderretidas amarillas.",
      "Rompa, apriete y unte un copo o cristales inmaculados de Sal del Atlántico o Himalaya."
    ],
    foodMoodNote: "Inunda las percepciones gustativas de indulgencia calmante: te reconecta con lo seguro. La masa madre ha reducido el nivel glicémico haciendo los almidones gentiles al digestivo y el ácido butírico directo de la mantequilla abraza la permeabilidad celular.",
    scienceQR: "Las grasas estables untadas sobre los almidones pre-digeridos envían endorfinas protectoras del eje recompensa cerebral apagando alarma visceral.",
    tags: ["Placer instantáneo", "Recarga emocional", "Grasas amigas"],
    imagePrompt: "Miga extra alveolada rústica tostada intensivamente exhibiendo islas amarillas muy brillantes semiderretidas de mantequilla fermentada y cristales reflectantes miniatura y texturados de sal marina arriba. Enfoque hiper detalista e hiper estético de panadería gourmet en luz lateral rica de cocina interior tradicional.",
    image: "/images/recetas/r17.png.png",
    season: ["Todo el año"]
  },
  {
    id: "r18",
    moodId: "confort",
    title: "Raíces Asadas con Marinada de Kombucha",
    title_en: "Roasted Roots & Kombucha Glaze",
    tagline: "Lento, profundo, bueno",
    description: "Una sinfonía de raíces subterráneas que asadas largamente caramelizan sus azúcares en profunda compasión terrosa.",
    acidBase: "Vinagre de kombucha",
    prepTime: 45,
    difficulty: "medio",
    servings: 2,
    ingredients: [
      { name: "Mix crudo: Remolacha, boniatos, chirivía, cebollitas perladas", quantity: "Trozos grandes mixtos 300g" },
      { name: "Grasa estable animal (Pato) o AOVE", quantity: "2 cdas generosas" },
      { name: "Concentrado o sirope oscuro con kombucha reducida amarga salada", quantity: "Un glaseado pringoso 2 cdas" },
      { name: "Tomillo leñoso fresco", quantity: "2 tallos" }
    ],
    steps: [
      "Recubre en la bandeja en crudo todas las duras rocas cortadas irregularmente con la grasa saturada protectora, mucha pimienta y tomillo.",
      "Asa muy prolongadamente entre 40 a 50 min en torno a 190ºC (restando prisa, paciencia de asado).",
      "Observa el borde oscuro ennegrecido, quemado ligeramente, lo que genera sabrosos perfiles caramelizados.",
      "A falta de final, pintar o remojar todo con reducción ácida profunda (balsámica o de kombucha ácida) para que chispee el dulzor pegajoso.",
      "Come caliente y terrenal."
    ],
    foodMoodNote: "Es puro arraigo y densidad energética invernal. Los azúcares densos y quemados lentamente te llenan y protegen al tracto final colónico generando cadenas cortas energéticas potentes e inflamatorias bajas propiciando somnolencia placentera reparadora profunda.",
    scienceQR: "Las fibras mas espesas celulósicas asadas lenta y grasamente crean la perfecta matriz pre-biótica calmante para el lecho del microbioma final de larga digestión.",
    tags: ["Plato Lento", "Para el Alma", "Densidad vegetal asada"],
    imagePrompt: "Una bandeja rústica de acero u horno oscura conteniendo gruesos e irregulares vegetales de raíz rústicos y terrosos muy dorados y en un borde glaseados brillantes con sirope espeso muy oscuro. Se ve tomillo chamuscado rústico. Una sensación visual cálida e irresistible de asado dominguero orgánico y moderno.",
    image: "/images/recetas/r18.png.png",
    season: ["Invierno", "Otoño"]
  }
];
