import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const CHALLENGE = {
  slug:          'activa-tu-longevidad',
  title:         'Activa tu longevidad',
  subtitle:      'Come joven. Siente todo.',
  description:   'Telómeros, autofagia, colágeno, NAD+ y microbioma. 10 mecanismos antiaging. 10 recetas que los activan. Sin restricciones. Sin sufrimiento. Basado en la ciencia de las zonas azules y el eje intestino-cerebro.',
  category:      'longevidad',
  duration_days: 10,
  price_eur:     19,
  color:         '#2D6B55',
  emoji:         '🌿',
  recipe_count:  10,
  audio_count:   10,
  is_active:     true,
  incluye: [
    '10 recetas antiaging con explicación científica integrada',
    '10 audios guiados — educativos, rituales y cierre',
    '10 consejos científicos diarios — el mecanismo del día',
    'Tracking diario de cómo te sientes y qué notas',
    'Acceso permanente al contenido'
  ],
  hitos_landing: [
    { dia: 1,  texto: 'Activas la señalización de longevidad desde el primer bocado' },
    { dia: 3,  texto: 'Autofagia, colágeno y NAD+ en marcha simultánea' },
    { dia: 7,  texto: 'Cerebro, piel, microbioma — el protocolo completo' },
    { dia: 10, texto: 'El patrón de las zonas azules, integrado. El protocolo es tuyo.' }
  ],
  al_completar: {
    titulo:    '10 mecanismos antiaging activados',
    subtitulo: 'Tienes el mapa. Ahora es un estilo de vida, no una dieta.',
    cta:       'Ver Reto Recupera tu energía — potencia mitocondrial',
    cta_slug:  'recupera-tu-energia'
  },
  lista_compra: [
    {
      categoria: 'Fermentados y probióticos',
      items: [
        'Kéfir cremoso — 500ml',
        'Miso blanco (shiro miso) — 1 tarro pequeño',
        'Chucrut vivo (no pasteurizado) — 1 bote',
        'Kimchi suave — 1 bote',
        'Vinagre de kombucha o de manzana — 1 botella',
        'Pepino fermentado (o pepino fresco) — 1 unidad',
      ],
    },
    {
      categoria: 'Proteínas y grasas nobles',
      items: [
        'Atún rojo o salmón fresco — 300g (para días 4 y 7)',
        'Sardinas en aceite de oliva virgen extra — 2 latas',
        'Huesos de pollo o ternera (rodilla, espinazo) — 500g',
        'Tofu firme o pavo en láminas — 200g',
        'Huevos ecológicos — 6 unidades',
        'Edamame cocido — 200g',
        'Nueces del Brasil — 50g',
        'Nueces y pistachos troceados — 100g',
      ],
    },
    {
      categoria: 'Frutas, verduras y raíces',
      items: [
        'Fresas maduras — 300g',
        'Arándanos y frambuesas — 200g',
        'Granada o zumo de granada puro — 1 unidad',
        'Aguacate maduro — 2 unidades',
        'Boniato grande — 2 unidades',
        'Zanahoria — 4 unidades',
        'Pimiento rojo — 2 unidades',
        'Calabaza — ½ unidad',
        'Remolacha — 2 unidades',
        'Rúcula o mizuna — 200g',
        'Espinacas frescas — 300g',
        'Puerro — 1 unidad',
        'Rábanos — 1 manojo',
        'Cebolla — 2 unidades',
        'Apio — 2 tallos',
        'Pak choi (o más espinacas) — 1 manojo',
        'Alga kombu seca — 1 paquete pequeño',
        'Setas shitake secas — 50g',
        'Pepino — 1 unidad',
      ],
    },
    {
      categoria: 'Especias, semillas y aromas',
      items: [
        'Cúrcuma en polvo o fresca',
        'Jengibre fresco — 1 raíz grande',
        'Pimienta negra en grano',
        'Comino en polvo',
        'Cilantro molido y cilantro fresco',
        'Canela en polvo',
        'Semillas de sésamo negro — 50g',
        'Semillas de calabaza — 100g',
        'Semillas de girasol — 100g',
        'Cacao puro en polvo (≥70%) — 50g',
        'Chocolate negro 85%+ — 1 tableta',
        'Wasabi (pasta o polvo, opcional)',
        'Jengibre cristalizado — 50g (para día 10)',
        'Aceitunas en salmuera natural — 1 tarro',
      ],
    },
    {
      categoria: 'Legumbres, cereales y pan',
      items: [
        'Garbanzos cocidos — 400g (o secos para cocer)',
        'Arroz integral — 200g',
        'Edamame con sal marina — 200g',
        'Crackers de semillas (lino, girasol, sésamo) — 1 paquete',
        'Pan de masa madre — 1 barra',
        'Tahini (pasta de sésamo) — 1 bote pequeño',
        'Berenjenas — 2 unidades (para baba ganoush día 10)',
      ],
    },
    {
      categoria: 'Aceites, salsas y extras',
      items: [
        'Aceite de oliva virgen extra — botella',
        'Aceite de sésamo tostado — 1 botellín',
        'Aceite de coco — 1 bote pequeño',
        'Tamari o salsa de soja sin gluten — 1 botella',
        'Mirin (o miel + vinagre) — pequeño',
        'Mostaza de Dijon — 1 bote',
        'Leche de coco — 1 lata',
        'Miel cruda — 1 tarro',
        'Limones ecológicos — 6 unidades',
        'Té verde matcha (polvo o bolsitas) — 1 paquete',
      ],
    },
  ],
}

const DAYS = [
  {
    day_number: 1,
    title: 'Telómeros & Antioxidantes',
    tip: 'Cada bocado que eliges es una carta a tu futuro',
    recipe_data: {
      idea_clara: {
        titulo: 'Los relojes moleculares de tu ADN',
        texto: 'Los telómeros son los capuchones protectores del ADN. Se acortan con cada división celular — y más rápido si hay estrés oxidativo, inflamación crónica o déficit de polifenoles. Vitamina C, licopeno, resveratrol y quercetina protegen los telómeros mediblemente. La alimentación es el único factor que puedes controlar de forma directa. Empieza hoy.',
        concepto_clave: 'Señalización de longevidad — Nrf2'
      },
      receta: {
        titulo: 'Bowl Rojo de los Telómeros — Activación & Escudo',
        descripcion: 'Desayuno o almuerzo. Cuando quieres empezar el reto sintiendo que algo ya está cambiando dentro.',
        ingredientes: [
          '1 taza de fresas maduras',
          '1 puñado de arándanos y frambuesas',
          '1 cda de semillas de granada fresca (o 2 cdas de zumo de granada puro)',
          '1 cdta de cacao puro en polvo (≥70% polifenoles)',
          '3 cdas de kéfir cremoso',
          '1 cdta de miel cruda (de abeja, sin calentar)',
          '1 cdta de vinagre de kombucha o de manzana',
          'Ralladura de ½ limón ecológico',
          'Hojitas de menta fresca',
        ],
        pasos: [
          'Coloca el kéfir en el fondo del bol, frío y denso.',
          'Dispón las fresas, arándanos y frambuesas encima.',
          'Espolvorea el cacao puro y la ralladura de limón.',
          'Añade las semillas de granada — son pequeñas joyas de licopeno.',
          'Termina con el vinagre de kombucha o de manzana, la miel cruda y las hojas de menta.',
        ],
        por_que: 'La combinación de quercetina (fresas), resveratrol (granada), antocianinas (arándanos) y probióticos vivos (kéfir) activa vías de respuesta antioxidante (Nrf2) que protegen el ADN a nivel celular — lo que los científicos llaman señalización de longevidad. El eje intestino-cerebro empieza a comunicar longevidad desde el primer bocado.',
      },
      psicobiotico: {
        titulo: 'Versiones',
        texto: 'Vegana: sustituye el kéfir por yogur de coco fermentado. Versión invierno: fresas y granada en zumo, cacao caliente encima.',
        alimento_estrella: 'Fresas + granada + kéfir',
      },
      audio: {
        titulo: 'El tiempo que vive en tus células',
        descripcion: 'Qué son los telómeros, cómo los acorta el estilo de vida y cómo los protege la comida. Ciencia accesible, ningún tecnicismo sin explicación.',
        duracion_min: 6,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia01-telomeros-antioxidantes.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Qué sientes físicamente esta mañana? ¿Energía, pesadez, claridad?',
        pregunta_tarde:  '¿Notaste algo diferente después del bowl de hoy?',
        pregunta_noche:  '¿Qué alimentos antiaging ya tienes en tu vida habitual?',
      },
    },
  },

  {
    day_number: 2,
    title: 'Autofagia — Limpieza celular profunda',
    tip: 'Tu cuerpo sabe limpiar. Solo necesita que le dejes espacio.',
    recipe_data: {
      idea_clara: {
        titulo: 'La célula que se recicla a sí misma',
        texto: 'La autofagia (del griego: "comerse a sí mismo") es el mecanismo de limpieza celular más potente que existe. Elimina proteínas dañadas, mitocondrias viejas y patógenos intracelulares. Se activa con ayuno intermitente, ejercicio, y ciertos alimentos: spermidina (trigo germinado, setas shitake), polifenoles del té verde (EGCG) y resveratrol. El Nobel de 2016 fue por este descubrimiento. Activarlo con comida es elegante.',
        concepto_clave: 'Spermidina — activador de autofagia'
      },
      receta: {
        titulo: 'Caldo Dorado de Autofagia — Reset & Claridad',
        descripcion: 'Para tomar entre las 18:00 y las 20:00, como cena ligera que activa la limpieza celular nocturna.',
        ingredientes: [
          '1 litro de agua filtrada o mineral',
          '1 trozo de alga kombu seca de 5 cm',
          '4 setas shitake secas (ricas en spermidina)',
          '1 trozo de jengibre fresco (3 cm), en láminas',
          '½ cúrcuma fresca o 1 cdta de cúrcuma en polvo',
          '1 diente de ajo (entero, aplastado)',
          '1 cdta de miso blanco — añadir fuera del fuego',
          '1 cda de vinagre de kombucha o de manzana',
          'Pimienta negra recién molida',
          'Cebollino fresco',
        ],
        pasos: [
          'Pon el agua fría con el alga kombu y las shitake desde el principio — activan sus compuestos en agua fría.',
          'Calienta sin llegar a hervir (80°C). Mantén 15 min a fuego suave.',
          'Retira el kombu (puedes cortarlo y comerlo).',
          'Añade jengibre, cúrcuma y ajo. Otros 10 min a fuego mínimo.',
          'Fuera del fuego: disuelve el miso con un poco del caldo caliente antes de añadir. Nunca hiervas el miso.',
          'Añade el vinagre de kombucha o de manzana y la pimienta.',
          'Sirve con cebollino.',
        ],
        por_que: 'Las shitake aportan spermidina — uno de los activadores de autofagia más potentes que existen en los alimentos. El miso (fermentado) protege la microbiota mientras el cuerpo hace la limpieza. El kombu aporta yodo, fucoidan y minerales alcalinizantes. El eje intestino-cerebro se beneficia de la restricción calórica nocturna: el nervio vago transmite señales de calma y regeneración durante las horas de limpieza celular.',
      },
      audio: {
        titulo: 'La noche que te limpia por dentro',
        descripcion: 'Cómo funciona la autofagia, cuándo se activa, qué alimentos la potencian y cómo estructurar la noche para maximizarla.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia02-autofagia-limpieza.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Cuántas horas pasaron desde tu última comida hasta levantarte?',
        pregunta_tarde:  '¿Has sentido el caldo de esta noche como algo distinto a una cena normal?',
        pregunta_noche:  '¿Qué sensación física te deja el ayuno nocturno suave?',
      },
    },
  },

  {
    day_number: 3,
    title: 'Colágeno — La arquitectura invisible',
    tip: 'La arquitectura de tu cuerpo se construye en la cocina.',
    recipe_data: {
      idea_clara: {
        titulo: 'El andamiaje de tu cuerpo se puede reconstruir',
        texto: 'El colágeno no se obtiene directamente de los alimentos — se sintetiza. Y necesita materia prima precisa: vitamina C (imprescindible), glicina y prolina (del caldo de huesos), cobre (semillas de girasol), silicio (puerro, avena) y zinc (semillas de calabaza). Los inhibidores más potentes son azúcar refinado (glicación), tabaco y déficit de vitamina C. La síntesis de colágeno cae un 1% por año a partir de los 25. La buena noticia: es estimulable a cualquier edad.',
        concepto_clave: 'Hidroxiprolina — bloque de construcción del colágeno'
      },
      receta: {
        titulo: 'Caldo Blanco de Colágeno — Firmeza & Brillo',
        descripcion: 'Cena reparadora o primera toma matinal. El ritual de 20 minutos que tu piel agradece más que cualquier crema.',
        ingredientes: [
          '500g de huesos de pollo o de ternera (rodilla, pie, espinazo)',
          '1 litro y medio de agua fría',
          '2 cdas de vinagre de kombucha o de manzana (extrae colágeno de los huesos)',
          '1 cebolla entera, cortada por la mitad',
          '2 zanahorias',
          '2 ramas de apio',
          '1 puerro (rico en silicio)',
          'Perejil fresco (vitamina C intacta — añadir al final)',
          'Pimienta negra',
          'Sal marina',
          'Opcional: cáscara de limón ecológico (al final)',
        ],
        pasos: [
          'Hierve los huesos 5 minutos, tira esa agua y lava los huesos — elimina impurezas.',
          'Cubre con 1,5 litros de agua fría. Añade el vinagre de kombucha o de manzana. Deja reposar 30 min antes de encender el fuego.',
          'Lleva a ebullición. Baja a fuego mínimo. Espuma si hace falta.',
          'Añade todas las verduras. Cocina entre 3 y 6 horas.',
          'Fuera del fuego: añade el perejil fresco y la cáscara de limón. Reposa 5 min antes de colar.',
          'Sirve caliente con una gota extra de vinagre de kombucha o de manzana.',
        ],
        por_que: 'Cuando el caldo se enfría y forma una gelatina densa, sabes que está lleno de glicina y prolina — los aminoácidos estructurales del colágeno. El vinagre de kombucha o de manzana no es accidental: el ácido acético rompe la matriz mineral de los huesos y libera el precursor del colágeno tipo I al agua. El caldo de huesos mejora el sueño profundo — la síntesis de colágeno ocurre precisamente durante las fases NREM3.',
      },
      audio: {
        titulo: 'El ritual de los 20 minutos que tu piel espera',
        descripcion: 'Cómo funciona la síntesis de colágeno, qué cofactores necesita y cómo el caldo de huesos se convierte en el suplemento de colágeno más biodisponible y barato del mercado.',
        duracion_min: 5,
        tipo: 'ritual',
        archivo: 'audio/antiaging/dia03-colageno-ritual.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Tu piel o articulaciones te han dado señales hoy?',
        pregunta_tarde:  '¿Has podido preparar el caldo o has hecho alguna adaptación?',
        pregunta_noche:  '¿Cómo defines la diferencia entre "suplemento" y "alimento funcional"?',
      },
    },
  },

  {
    day_number: 4,
    title: 'NAD+ & Energía Celular',
    tip: 'Las mitocondrias no envejecen. Se abandonan.',
    recipe_data: {
      idea_clara: {
        titulo: 'El cofactor energético que desaparece con la edad',
        texto: 'El NAD+ (nicotinamida adenina dinucleótido) es el cofactor energético más importante del organismo. Sus niveles caen hasta un 50% entre los 40 y los 60 años. Sin NAD+: las sirtuinas (genes de la longevidad) se apagan, la reparación del ADN cae y las mitocondrias se deterioran. Los precursores dietéticos del NAD+ incluyen niacina (B3) en atún, pollo y setas; triptófano en proteína animal; y NMN en brócoli, aguacate y edamame.',
        concepto_clave: 'Sirtuinas — genes de la longevidad activados por NAD+'
      },
      receta: {
        titulo: 'Sashimi Energético con Aliño de Longevidad — Focus & Vitalidad',
        descripcion: 'Almuerzo de mediodía cuando necesitas que el cerebro trabaje a pleno rendimiento. Elegante, rápido, poderoso.',
        ingredientes: [
          '120g de atún rojo o salmón fresco (sashimi grade si es posible)',
          '½ aguacate maduro',
          '1 puñado de edamame cocido',
          '4 rábanos, en láminas finas',
          '1 cdta de semillas de sésamo negro',
          'Hojas de rúcula o mizuna',
          '2 cdas de tamari o salsa de soja sin gluten',
          '1 cdta de vinagre de kombucha o de manzana',
          '1 cdta de aceite de sésamo tostado',
          '½ cdta de jengibre rallado fresco',
          '1 pizca de wasabi (opcional)',
        ],
        pasos: [
          'Corta el pescado en láminas gruesas. El cuchillo debe ser limpio — no aprietes.',
          'Dispón sobre la rúcula o mizuna.',
          'Añade el aguacate en láminas, el edamame, los rábanos.',
          'Mezcla el aliño y vierte en hilo fino por encima.',
          'Termina con el sésamo negro. Siéntate. Come despacio.',
        ],
        por_que: 'El atún es de los alimentos más densos en niacina (B3) que existen — el precursor directo del NAD+. El edamame y el aguacate aportan NMN natural. El omega-3 del pescado mejora la fluidez de las membranas mitocondriales. Todo junto activa lo que los investigadores de longevidad llaman "el eje sirtuina" — genes que ralentizan el envejecimiento celular cuando el NAD+ sube.',
      },
      audio: {
        titulo: 'Las mitocondrias que no envejecen',
        descripcion: 'Qué es el NAD+, por qué cae con la edad y cómo la comida puede ser la intervención más potente para recuperarlo.',
        duracion_min: 6,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia04-nad-energia-celular.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Cómo está tu nivel de energía en comparación con el día 1?',
        pregunta_tarde:  '¿Has notado diferencia en la claridad mental hoy?',
        pregunta_noche:  '¿Qué fuentes de niacina ya tienes en tu dieta habitual?',
      },
    },
  },

  {
    day_number: 5,
    title: 'Microbioma Joven — La biodiversidad interior',
    tip: 'Tu flora envejece contigo. O no, si la cuidas.',
    recipe_data: {
      idea_clara: {
        titulo: 'Los centenarios tienen microbiomas de 30 años',
        texto: 'La diversidad microbiana intestinal cae de forma consistente con la edad. Los centenarios tienen microbiomas más parecidos a personas de 30 años que a personas de su misma edad. Los impulsores de la diversidad: fibra diversa (FOS, inulina, arabinoxilano, pectina), fermentados vivos, polifenoles como prebióticos. El microbioma joven produce más butirato — antiinflamatorio, anticáncer, neuroprotector — y regula mejor la barrera intestinal.',
        concepto_clave: 'Butirato — el metabolito antiaging del microbioma'
      },
      receta: {
        titulo: 'Ensalada Fermentada de las 100 Bacterias — Reset & Diversidad',
        descripcion: 'Almuerzo o cena. Una explosión de texturas, colores y bacterias vivas. La ensalada más biodiversa de tu vida.',
        ingredientes: [
          '1 puñado de rúcula',
          '1 puñado de chucrut vivo (no pasteurizado)',
          '1 zanahoria rallada finamente',
          '½ remolacha cruda rallada',
          '2 cdas de kimchi (suave o picante)',
          '1 trozo de pepino fermentado (o pepino fresco)',
          '1 cda de semillas de girasol tostadas',
          '1 cda de semillas de calabaza',
          '1 cda de nueces picadas',
          '3 cdas de kéfir cremoso',
          '1 cda de vinagre de kombucha o de manzana',
          '1 cda de tahini',
          '½ cdta de cúrcuma en polvo',
          'Zumo de ½ limón',
          'Sal y pimienta',
          'Opcional: 1 cdta de miso blanco disuelto en el aliño',
        ],
        pasos: [
          'Extiende la rúcula como base.',
          'Coloca el chucrut, el kimchi y el pepino fermentado en montículos separados — no los mezcles desde el principio para conservar sus bacterias.',
          'Añade la zanahoria y remolacha ralladas, las semillas y las nueces.',
          'Bate el aliño (kéfir + vinagre + tahini + cúrcuma + limón) hasta emulsionar.',
          'Vierte justo antes de servir. Come inmediatamente — los fermentados pierden bacterias con el calor.',
        ],
        por_que: 'Esta ensalada puede contener más de 15 especies bacterianas vivas diferentes si usas fermentados de calidad. La variedad de fibras (inulina del kimchi, arabinoxilano de las semillas, pectina de la zanahoria y remolacha) alimenta microorganismos distintos, generando butirato y propionato — ácidos grasos de cadena corta con efectos antiinflamatorios, neuroprotectores y anticáncer.',
      },
      audio: {
        titulo: 'La flora que tiene 30 años a los 60',
        descripcion: 'La ciencia del microbioma y la longevidad. Qué comen los centenarios sanos. Por qué la diversidad microbiana es el marcador más olvidado del envejecimiento.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia05-microbioma-joven.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Cuántos tipos diferentes de fermentados tienes en casa?',
        pregunta_tarde:  '¿Cómo ha sentado el intestino después de la ensalada?',
        pregunta_noche:  '¿Qué relación tienes con los alimentos fermentados antes de este reto?',
      },
    },
  },

  {
    day_number: 6,
    title: 'Inflamación Silenciosa — El fuego invisible',
    tip: 'El fuego que no ves es el que más envejece.',
    recipe_data: {
      idea_clara: {
        titulo: 'La inflamación crónica es el denominador común del envejecimiento',
        texto: 'La inflammaging (inflamación crónica de bajo grado asociada al envejecimiento) es el denominador común de las enfermedades degenerativas: cardiovascular, Alzheimer, diabetes tipo 2, cáncer. Sus principales inductores alimentarios: omega-6 en exceso, azúcar refinado, harinas refinadas, carnes procesadas. Sus principales resolutores: omega-3 (resolvinas y protectinas), polifenoles (curcumina, quercetina, EGCG), fibra prebiótica y fermentados.',
        concepto_clave: 'Curcumina + piperina — inhibición de NF-κB'
      },
      receta: {
        titulo: 'Curry Dorado Antiinflamatorio — Calma & Escudo',
        descripcion: 'Cena reconfortante. El olor de la cúrcuma calentando aceite es ya una señal para el sistema nervioso de que algo bueno viene.',
        ingredientes: [
          '200g de garbanzos cocidos (o lentejas rojas)',
          '1 lata de leche de coco',
          '2 tomates maduros en dados (o 1 lata de tomate natural)',
          '1 cebolla picada',
          '3 dientes de ajo',
          '1 trozo de jengibre fresco (3cm) rallado',
          '2 cdtas de cúrcuma en polvo',
          '1 cdta de comino',
          '1 cdta de cilantro molido',
          '½ cdta de pimienta negra recién molida (imprescindible para la curcumina)',
          '½ cdta de canela',
          '1 cda de aceite de coco o de oliva virgen extra',
          'Espinacas frescas (añadir al final)',
          'Arroz integral o quinoa',
          'Cilantro fresco y zumo de limón para servir',
          '1 cdta de vinagre de kombucha o de manzana (al servir)',
        ],
        pasos: [
          'Sofríe la cebolla en aceite hasta que sea transparente y dorada — sin prisas.',
          'Añade ajo y jengibre rallado. 2 min.',
          'Incorpora las especias: cúrcuma, comino, cilantro, canela, pimienta. Tuesta 1 min a fuego medio.',
          'Añade el tomate. Cocina hasta que se deshaga, unos 8-10 min.',
          'Vierte la leche de coco y los garbanzos. Cocina 15 min a fuego suave.',
          'Fuera del fuego: añade las espinacas — se marchitan en el calor residual.',
          'Sirve con arroz integral. Zumo de limón, cilantro fresco y una gota de vinagre de kombucha o de manzana encima.',
        ],
        por_que: 'La curcumina de la cúrcuma inhibe NF-κB, el principal regulador de genes proinflamatorios. La pimienta negra (piperina) aumenta su absorción hasta 2.000%. Nunca cúrcuma sin pimienta. El aceite potencia aún más su absorción — es liposoluble. Los garbanzos aportan fibra fermentable y la leche de coco aporta ácido láurico, antiinflamatorio.',
      },
      audio: {
        titulo: 'El fuego invisible que te envejece',
        descripcion: 'Qué es la inflammaging, cómo se mide, y cómo una forma de cocinar puede cambiar marcadores inflamatorios en 4 semanas.',
        duracion_min: 6,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia06-inflamacion-silenciosa.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Tienes síntomas que podrían indicar inflamación crónica? (fatiga, niebla mental, dolores articulares)',
        pregunta_tarde:  '¿Qué alimentos proinflamatorios has reducido esta semana sin proponértelo?',
        pregunta_noche:  '¿Cómo ha sido el sabor del curry? ¿Lo has notado potente, equilibrado?',
      },
    },
  },

  {
    day_number: 7,
    title: 'Cerebro & Neuroplasticidad',
    tip: 'El cerebro que no crece, envejece.',
    recipe_data: {
      idea_clara: {
        titulo: 'BDNF — la proteína que hace crecer el cerebro',
        texto: 'El BDNF (factor neurotrófico derivado del cerebro) es la proteína clave de la neuroplasticidad — permite que el cerebro forme nuevas conexiones y regenere neuronas. Sus principales activadores alimentarios: DHA (omega-3 de pescado azul), flavonoides del chocolate negro, EGCG del té verde, curcumina y el ayuno intermitente suave. El déficit crónico de DHA se asocia a mayor riesgo de deterioro cognitivo. La dieta mediterránea es la única dieta con evidencia robusta de protección cognitiva.',
        concepto_clave: 'BDNF — factor de crecimiento neuronal activable desde el plato'
      },
      receta: {
        titulo: 'Salmón con Cacao y Vinagreta de Té Verde — Claridad & Memoria',
        descripcion: 'Almuerzo. La combinación más elegante de neurociencia y placer. Para el día que necesitas pensar bien.',
        ingredientes: [
          '150g de salmón (lomo, fresco)',
          '1 cda de aceite de oliva virgen extra',
          'Ralladura de naranja',
          'Sal y pimienta',
          '1 taza de té verde matcha (frío) — para la vinagreta',
          '2 cdas de aceite de oliva virgen extra',
          '1 cda de vinagre de kombucha o de manzana',
          '½ cdta de mostaza de Dijon',
          'Ralladura de limón',
          '1 cdta de miel cruda',
          '1 puñado de espinacas salteadas con ajo',
          '1 puñado de nueces del Brasil (selenio neuroprotector)',
          '3-4 cuadraditos de chocolate negro 85%+',
        ],
        pasos: [
          'Seca el salmón con papel. Marina 15 min con aceite, ralladura de naranja, sal y pimienta.',
          'Cocina en sartén a fuego medio-alto, 3 min por lado. Que quede rosado por dentro.',
          'Mezcla los ingredientes de la vinagreta en bote de cristal. Agita.',
          'Sirve el salmón sobre las espinacas salteadas. Vierte la vinagreta en hilo.',
          'Añade las nueces del Brasil y los trozos de chocolate al lado. Ese contraste es intencional y delicioso.',
        ],
        por_que: 'El DHA del salmón es el ácido graso estructural más importante del cerebro. Los flavonoides del cacao (epicatequina) aumentan el flujo sanguíneo cerebral y los niveles de BDNF de forma aguda y medible. La vinagreta de té verde aporta EGCG, que protege las neuronas de la inflamación. Las nueces del Brasil (2 al día) cubren el 100% del selenio necesario para la glutatión peroxidasa, la enzima antioxidante maestra del cerebro.',
      },
      audio: {
        titulo: 'El cerebro que se renueva',
        descripcion: 'Neuroplasticidad, BDNF y los alimentos que regeneran neuronas. Por qué la dieta mediterránea es la intervención más potente contra el deterioro cognitivo que existe.',
        duracion_min: 7,
        tipo: 'ritual',
        archivo: 'audio/antiaging/dia07-cerebro-neuroplasticidad.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Hay alguna habilidad mental que sientes que ha cambiado en los últimos años?',
        pregunta_tarde:  '¿Cómo ha sido tu concentración y claridad mental hoy?',
        pregunta_noche:  '¿Has aprendido algo hoy que te haya hecho pensar de otra manera?',
      },
    },
  },

  {
    day_number: 8,
    title: 'Piel desde Dentro — El eje intestino-piel',
    tip: 'La crema más cara no llega donde llega un buen plato.',
    recipe_data: {
      idea_clara: {
        titulo: 'Tu piel envejece desde el intestino',
        texto: 'La piel envejece por dos vías: intrínseca (genética, tiempo) y extrínseca (sol, azúcar, tabaco, déficit nutricional). La glicación del colágeno por exceso de azúcar crea AGEs (productos de glicación avanzada) que endurecen y oscurecen la piel. La barrera cutánea depende de ácidos grasos esenciales, vitamina A (betacaroteno), vitamina C, zinc y selenio. El eje intestino-piel explica por qué el acné, la rosácea y el envejecimiento cutáneo mejoran con microbioma sano.',
        concepto_clave: 'AGEs — glicación del colágeno por azúcar refinado'
      },
      receta: {
        titulo: 'Bol de Betacaroteno con Dip de Kéfir — Brillo & Elasticidad',
        descripcion: 'Almuerzo o cena ligera. La gama del naranja y el rojo en un solo plato — cada color es un nutriente diferente para tu piel.',
        ingredientes: [
          '1 boniato grande (asado con piel)',
          '2 zanahorias medianas (asadas)',
          '1 pimiento rojo (asado)',
          '½ calabaza (asada)',
          '1 remolacha (asada)',
          '200ml de kéfir espeso',
          '1 diente de ajo pequeño',
          '1 cda de aceite de oliva virgen extra',
          'Ralladura de limón',
          'Menta fresca picada',
          '1 cdta de vinagre de kombucha o de manzana',
          'Sal y pimienta',
          'Semillas de calabaza (zinc)',
          'Semillas de girasol (vitamina E)',
          'Pistachos troceados (antioxidantes)',
          'Cebollino',
        ],
        pasos: [
          'Asa todas las verduras en el horno a 200°C hasta que estén tiernas y con bordes caramelizados (30-40 min). No las peles antes.',
          'Mientras, prepara el dip: mezcla kéfir, ajo rallado, aceite, ralladura de limón, menta, vinagre, sal y pimienta. Refrigera.',
          'Dispón las verduras asadas en el bol. Vierte el dip en el centro.',
          'Termina con los toppings: semillas de calabaza y girasol, pistachos, cebollino.',
        ],
        por_que: 'El color naranja y rojo de este bol no es estético — es funcional. El betacaroteno del boniato, zanahoria y calabaza es el precursor de la vitamina A que regula la renovación celular de la piel. El licopeno del pimiento rojo reduce la sensibilidad al daño UV. El kéfir aporta zinc y probióticos que regulan la inflamación cutánea desde el intestino.',
      },
      audio: {
        titulo: 'Lo que la cosmética no puede hacer',
        descripcion: 'Cómo funciona el eje intestino-piel, por qué el azúcar envejece más que el sol, y los nutrientes que cambian la piel desde dentro en 8 semanas.',
        duracion_min: 6,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia08-piel-desde-dentro.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿Qué marcadores visibles de envejecimiento quieres trabajar desde la alimentación?',
        pregunta_tarde:  '¿Has notado cambios en tu piel, cabello o uñas en estos 8 días?',
        pregunta_noche:  '¿Qué hábito alimentario de este reto puedes mantener fácilmente?',
      },
    },
  },

  {
    day_number: 9,
    title: 'Ritmo Circadiano & Hormonas',
    tip: 'Tu biología tiene horario. Respetar eso es rejuvenecer.',
    recipe_data: {
      idea_clara: {
        titulo: 'Comer en el momento equivocado envejece igual que comer mal',
        texto: 'El reloj circadiano controla más de 3.000 genes, incluyendo los de reparación del ADN, síntesis de cortisol, producción de melatonina y sensibilidad a la insulina. La alimentación tiene poder para sincronizar o desincronizar el reloj biológico independientemente de la luz. Comer tarde (>21h) eleva la insulina y bloquea la melatonina. La alimentación restringida en el tiempo (TRE: comer en ventana de 8-10h) mejora la función mitocondrial y los marcadores de longevidad sin reducción calórica.',
        concepto_clave: 'TRE — alimentación restringida en el tiempo como palanca antiaging'
      },
      receta: {
        titulo: 'Cena Circadiana — El Plato que Respeta tu Reloj',
        descripcion: 'Para cenar antes de las 20h. Ligero, fácil de digerir, rico en triptófano para la cadena triptófano-serotonina-melatonina.',
        ingredientes: [
          '200g de tofu firme o pavo en láminas finas (triptófano)',
          '1 taza de arroz integral cocido',
          '1 cda de aceite de sésamo',
          '1 cda de tamari',
          '1 cda de mirin (o ½ cdta miel + vinagre de kombucha o de manzana)',
          'Jengibre rallado',
          'Sésamo tostado',
          'Verduras de hoja verde al vapor (espinacas, pak choi)',
          '½ cdta de miso blanco disuelto en agua caliente (para el caldo nocturno)',
          '1 cdta de vinagre de kombucha o de manzana',
          '1 rodaja de jengibre fresco',
        ],
        pasos: [
          'Saltea el tofu (o pavo) en aceite de sésamo hasta dorado. Añade tamari, mirin, jengibre rallado. Glasea 2 min.',
          'Sirve sobre el arroz integral.',
          'Cuece las verduras al vapor 3 min — que conserven el color vivo.',
          'Prepara el caldo nocturno aparte: agua caliente, miso disuelto, vinagre, jengibre. Para beber antes de dormir.',
          'Come en silencio si puedes. Sin pantallas. Tu sistema nervioso se lo agradece.',
        ],
        por_que: 'El triptófano del tofu o pavo necesita carbohidrato para llegar al cerebro — compite con otros aminoácidos en la barrera hematoencefálica y el carbohidrato limpia el camino. El miso nocturno aporta GABA intestinal. El vinagre de kombucha o de manzana reduce el pico glucémico de la cena. El eje intestino-cerebro responde a la coherencia horaria — comer siempre en el mismo rango horario sincroniza el reloj intestinal.',
      },
      audio: {
        titulo: 'Tu reloj biológico no está roto. Solo desincronizado.',
        descripcion: 'Cronobiología nutricional, ritmo circadiano y el impacto del horario de comidas en el envejecimiento. La ventana metabólica que cambia todo.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/antiaging/dia09-ritmo-circadiano.mp3',
      },
      registro_diario: {
        pregunta_manana: '¿A qué hora sueles tomar tu primera y última comida del día?',
        pregunta_tarde:  '¿Pudiste cenar antes de las 20h hoy? ¿Qué dificultades encontraste?',
        pregunta_noche:  '¿Cómo ha sido la calidad de tu sueño en estos 9 días de reto?',
      },
    },
  },

  {
    day_number: 10,
    title: 'Protocolo de Longevidad — La Mesa de las Zonas Azules',
    tip: 'No es un reto. Es el principio de una forma diferente de comer.',
    recipe_data: {
      idea_clara: {
        titulo: 'No hay un superalimento. Hay un patrón.',
        texto: 'Las zonas azules (Cerdeña, Okinawa, Nicoya, Loma Linda, Ikaria) comparten patrones alimentarios que la ciencia ya puede explicar: alta diversidad vegetal, fermentados diarios, legumbres como proteína principal, omega-3 abundante, polifenoles de vino o té, restricción calórica suave (Hara Hachi Bu en Okinawa: comer hasta el 80% de saciedad), y ausencia casi total de ultraprocesados. Este reto ha sido ese patrón en 10 días.',
        concepto_clave: 'Zonas Azules — longevidad como patrón, no como suplemento'
      },
      receta: {
        titulo: 'La Mesa de la Longevidad — Celebración & Integración',
        descripcion: 'Comida o cena de celebración. El día 10 merece un plato que lo resuma todo. Un festín simple y poderoso, para compartir o disfrutar en solitario con toda la presencia.',
        ingredientes: [
          '1 bowl de hummus casero con cúrcuma y limón',
          '1 bowl de baba ganoush (berenjena asada + tahini + ajo + limón)',
          'Crudités variadas: zanahoria, pepino, apio, rábano, pimiento rojo',
          'Chucrut vivo (sin pasteurizar)',
          'Kimchi suave',
          'Aceitunas en salmuera natural',
          'Sardinas en aceite de oliva virgen extra (omega-3 + EPA)',
          'Huevos duros con flor de sal y pimentón',
          'Edamame con sal marina',
          'Tostadas de pan de masa madre',
          'Crackers de semillas (lino, girasol, sésamo, calabaza)',
          'Fresas con kéfir y miel cruda',
          'Chocolate 85%+ con nueces y jengibre cristalizado',
          'Agua con vinagre de kombucha o de manzana + limón + menta',
          'Té verde matcha frío',
        ],
        pasos: [
          'Todo se prepara y se pone en la mesa. Sin protocolo. Sin pasos.',
          'Solo abundancia consciente, cada ingrediente elegido por lo que hace por ti por dentro.',
          'Come despacio. Saborea cada combinación.',
          'Si puedes, comparte esta mesa. La longevidad también es social.',
        ],
        por_que: 'Este spread es un mapa de la longevidad. Fermentados (microbioma), pescado azul (omega-3, DHA), sardinas (calcio óseo), hummus (proteína vegetal + fibra), cacao (BDNF, polifenoles), huevos (colina), masa madre (glucemia estable). Todo junto, comido despacio, en buena compañía o en silencio consciente, es la definición más exacta de alimentación para la longevidad.',
      },
      audio: {
        titulo: 'Lo que aprendiste en 10 días dura toda la vida',
        descripcion: 'Cierre del reto. Revisión de los 10 mecanismos antiaging activados. Cómo integrar estos principios como un estilo de vida, no como una dieta. Qué sigue.',
        duracion_min: 10,
        tipo: 'cierre',
        archivo: 'audio/antiaging/dia10-protocolo-longevidad.mp3',
      },
      hito: {
        titulo: '10 mecanismos antiaging activados',
        descripcion: 'Telómeros, autofagia, colágeno, NAD+, microbioma, inflamación, neuroplasticidad, piel, ritmo circadiano y el protocolo completo de longevidad. En 10 días.',
        reflexion: 'No hay un superalimento. Hay un patrón. Y tú ya lo tienes.',
        estadisticas: {
          mecanismos_activados: [
            'Protección telómeros (Nrf2)',
            'Autofagia activada (spermidina)',
            'Síntesis de colágeno',
            'NAD+ y sirtuinas',
            'Diversidad microbiana',
            'Resolución inflammaging',
            'BDNF y neuroplasticidad',
            'Barrera cutánea desde dentro',
            'Sincronía circadiana',
            'Patrón zonas azules integrado',
          ],
        },
        informe_personalizado: {
          titulo: 'Tu Protocolo de Longevidad Personal',
          descripcion: 'Los 10 mecanismos antiaging que activaste, tu mapa nutricional de 10 días y tu protocolo semanal personalizado basado en el tracking.',
        },
      },
      registro_diario: {
        pregunta_manana: '¿Qué es lo que más has cambiado en tu relación con la comida en estos 10 días?',
        pregunta_tarde:  '¿Qué mecanismo antiaging quieres seguir trabajando después del reto?',
        pregunta_noche:  '¿Qué le dirías a la persona que eras hace 10 días sobre lo que sabe ahora?',
      },
    },
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌿  Seeding reto "Activa tu longevidad" (10 días)\n')

  // Upsert challenge
  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .upsert({
      slug:          CHALLENGE.slug,
      title:         CHALLENGE.title,
      subtitle:      CHALLENGE.subtitle,
      description:   CHALLENGE.description,
      category:      CHALLENGE.category,
      duration_days: CHALLENGE.duration_days,
      price_eur:     CHALLENGE.price_eur,
      color:         CHALLENGE.color,
      emoji:         CHALLENGE.emoji,
      recipe_count:  CHALLENGE.recipe_count,
      audio_count:   CHALLENGE.audio_count,
      is_active:     CHALLENGE.is_active,
      incluye:       CHALLENGE.incluye,
      hitos_landing: CHALLENGE.hitos_landing,
      al_completar:  CHALLENGE.al_completar,
      lista_compra:  CHALLENGE.lista_compra,
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (chErr || !ch) {
    console.error('❌  Error upserting challenge:', chErr?.message)
    process.exit(1)
  }
  console.log(`✅  Challenge upserted — id: ${ch.id}`)

  // Upsert each day
  let ok = 0, fail = 0

  for (const day of DAYS) {
    const { error } = await supabase
      .from('challenge_days')
      .upsert({
        challenge_id: ch.id,
        day_number:   day.day_number,
        title:        day.title,
        tip:          day.tip,
        recipe_data:  day.recipe_data,
      }, { onConflict: 'challenge_id,day_number' })

    if (error) {
      console.error(`  ❌  Día ${day.day_number}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${day.day_number} — ${day.title}`)
      ok++
    }
  }

  console.log(`\n✨  ${ok} días insertados · ${fail} errores`)
  if (fail > 0) process.exit(1)
}

main()
