/**
 * Seed del reto "Food·Mood for Work — 7-Day Focus Snack Challenge"
 * node scripts/seed-corporate-wellness.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const CHALLENGE = {
  slug:          'corporate-wellness',
  title:         'Food·Mood for Work',
  subtitle:      '7 días para foco, energía estable y bienestar en el trabajo',
  description:   'Un protocolo de 7 días basado en neurociencia nutricional para equipos. Cada día: dos snacks funcionales, un micro-hábito de 3 minutos, ciencia aplicada al rendimiento laboral y un check-in emocional. Sin cocina complicada, sin ingredientes raros.',
  category:      'Corporate Wellness',
  duration_days: 7,
  price_eur:     19,
  color:         '#4A7B6B',
  emoji:         '🧑‍💻',
  recipe_count:  7,
  audio_count:   8,
  is_active:     true,
  audiencia:     'Equipos de empresa, trabajadores en remoto o presencial que quieren mejorar su energía, foco y bienestar durante la jornada laboral.',
  incluye: [
    '7 snacks funcionales AM + 7 snacks funcionales PM',
    'Lista de compra semanal completa',
    'Audio diario educativo (5–8 min) con ciencia aplicada al trabajo',
    'Audio de psicología laboral (20 min) disponible desde el día 1',
    'Check-in diario de 30 segundos: energía, foco, estrés, ánimo',
    'Micro-hábito de 3 minutos por día',
    'Índice Food·Mood antes y después',
    'Informe final personalizado',
  ],
  lista_compra: {
    'Base fresca': [
      'Kéfir bebible o yogur natural (500 ml)',
      'Frutos rojos congelados o frescos (300 g)',
      'Manzanas (4–5 unidades)',
      'Plátanos (3–4 unidades)',
      'Zanahorias baby (200 g)',
      'Pepino (1 unidad)',
      'Tomates cherry (200 g)',
      'Aguacate maduro (2 unidades)',
      'Espinacas frescas o baby (100 g)',
      'Limones (3 unidades)',
      'Jengibre fresco (1 trozo pequeño)',
    ],
    'Proteína y saciedad': [
      'Hummus clásico (200 g)',
      'Huevos (4–6 unidades)',
      'Edamame congelado o garbanzos cocidos (200 g)',
      'Queso fresco o requesón (150 g)',
    ],
    'Grasas buenas': [
      'Nueces (150 g)',
      'Semillas de chía (100 g)',
      'Semillas de calabaza (100 g)',
      'Crema de almendra o cacahuete 100% (200 g)',
      'Tahini (100 g)',
      'Aceite de oliva virgen extra',
    ],
    'Energía estable': [
      'Avena en copos finos (250 g)',
      'Crackers de centeno o arroz (1 paquete)',
      'Pan integral de masa madre (1 barra)',
      'Cacao puro en polvo sin azúcar (100 g)',
      'Chocolate negro 85% (1 tableta)',
      'Canela molida',
      'Miel cruda (50 g)',
    ],
  },
  hitos_landing: [
    { dia: 1, titulo: 'Energía estable desde las 9:00',   icono: '⚡' },
    { dia: 3, titulo: 'Primer bajón de tarde evitado',     icono: '📉' },
    { dia: 5, titulo: 'Claridad mental sin cafeína extra', icono: '🧠' },
    { dia: 7, titulo: 'Tu patrón personal mapeado',        icono: '📊' },
  ],
  al_completar: {
    titulo:    '7 días. Un equipo diferente.',
    subtitulo: 'Has completado el protocolo Food·Mood for Work. Tu índice muestra lo que la comida puede hacer en una semana. Descarga tu informe y compártelo con tu equipo.',
    cta:       'Ver mi informe',
    cta_slug:  '/retos',
  },
}

const DAYS = [
  {
    day_number: 1,
    title: 'Energía estable desde el primer café',
    recipe_data: {
      idea_clara: {
        titulo: 'Por qué el pico de media mañana te destroza el día',
        texto: 'Cuando desayunamos con azúcares rápidos o sin proteína, la glucosa sube en pico y el páncreas lanza insulina de golpe: a las 10:30 estás ya en bajada. La variabilidad glucémica, no el nivel medio, es lo que más impacta en el foco y el ánimo durante la jornada laboral. Un desayuno con fibra, proteína y grasa buena aplana esa curva y mantiene la glucosa estable durante 3-4 horas.',
        concepto_clave: 'Variabilidad glucémica',
      },
      snack_am: {
        nombre: 'Bowl de kéfir con avena y frutos rojos',
        ingredientes: [
          '150 ml de kéfir natural o yogur griego sin azúcar',
          '4 cucharadas de avena en copos finos',
          '80 g de frutos rojos (arándanos, frambuesas)',
          '1 cucharadita de semillas de chía',
          '1 pizca de canela molida',
        ],
        pasos: [
          'Vierte el kéfir en un bol o tarro de cristal.',
          'Añade la avena y remueve bien. Puede dejarse preparado la noche anterior en la nevera (overnight oats).',
          'Incorpora los frutos rojos y las semillas de chía.',
          'Espolvorea canela al gusto. Listo en 3 minutos.',
        ],
        por_que: 'La avena aporta beta-glucano (fibra soluble) que ralentiza la absorción de glucosa. El kéfir añade proteína y bacterias vivas que modulan el eje intestino-cerebro. Los frutos rojos aportan antocianinas con efecto antiinflamatorio cognitivo.',
        tiempo_min: 3,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Palitos de zanahoria con hummus y aceite de oliva',
        ingredientes: [
          '100 g de zanahorias baby o zanahoria cortada en palitos',
          '3 cucharadas de hummus',
          '1 chorrito de aceite de oliva virgen extra',
          '1 pizca de pimentón ahumado (opcional)',
        ],
        pasos: [
          'Prepara los palitos de zanahoria (pueden cortarse la noche anterior).',
          'Coloca el hummus en un vasito o pequeño bol.',
          'Añade un hilo de aceite de oliva por encima.',
          'Acompaña con los palitos y come despacio, sin pantalla si puedes.',
        ],
        por_que: 'El hummus combina legumbre (proteína + fibra) con tahini (calcio, magnesio). La zanahoria aporta betacaroteno y fibra insoluble. El aceite de oliva enlentece la absorción y aporta polifenoles antiinflamatorios.',
        tiempo_min: 2,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'La glucosa que no ves pero que decide tu tarde',
        descripcion: 'Qué es la variabilidad glucémica, cómo afecta al foco y al ánimo laboral, y por qué el desayuno de hoy define tu energía de las 15:00.',
        duracion_min: 6,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia01-glucosa-energia.mp3',
      },
      micro_habito: {
        titulo: '3 respiraciones antes del café',
        instruccion: 'Antes de beber el primer café del día, haz 3 respiraciones lentas: 4 segundos inhala, 4 sostén, 6 exhala. Esto reduce el cortisol matutino y mejora la absorción de cafeína sin el pico de ansiedad.',
        duracion: '1 minuto',
      },
      registro_diario: {
        pregunta_manana: '¿Cómo describes tu nivel de energía al llegar al trabajo? (1–10)',
        pregunta_noche: '¿Hubo bajón de energía en algún momento del día? ¿A qué hora?',
      },
    },
  },
  {
    day_number: 2,
    title: 'Focus limpio sin sobredosis de cafeína',
    recipe_data: {
      idea_clara: {
        titulo: 'La cafeína no te da energía. Te la presta.',
        texto: 'La cafeína bloquea los receptores de adenosina, el neurotransmisor que genera somnolencia, pero no elimina el cansancio acumulado: solo lo pospone. Cuando el efecto pasa, la adenosina llena todos los receptores a la vez — el "crash" de cafeína. Combinar cafeína con L-teanina (presente en el té verde) produce el mismo estado de alerta pero con una transición mucho más suave y sin la ansiedad asociada.',
        concepto_clave: 'Adenosina y L-teanina',
      },
      snack_am: {
        nombre: 'Manzana con crema de almendra y canela',
        ingredientes: [
          '1 manzana mediana (Granny Smith o Fuji)',
          '2 cucharadas de crema de almendra 100% sin azúcar',
          '1 pizca de canela molida',
          '1 pizca de sal marina (opcional)',
        ],
        pasos: [
          'Lava y corta la manzana en gajos (con piel, para conservar la pectina).',
          'Distribuye la crema de almendra en un vasito para mojar.',
          'Espolvorea canela por encima.',
          'Come despacio y mastica bien.',
        ],
        por_que: 'La pectina de la manzana es prebiótica y alimenta las bacterias productoras de butirato. La crema de almendra aporta vitamina E, magnesio y grasa monoinsaturada que estabiliza la glucosa. La canela reduce el índice glucémico del snack completo.',
        tiempo_min: 3,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Nueces con chocolate negro 85%',
        ingredientes: [
          '25–30 g de nueces (un puñado pequeño)',
          '2–3 onzas de chocolate negro 85%',
        ],
        pasos: [
          'Sirve las nueces y el chocolate en un vasito o pequeño bol.',
          'Come las nueces primero, lentamente, masticando bien.',
          'Termina con el chocolate. Deja que se deshaga en la boca.',
        ],
        por_que: 'Las nueces son una de las fuentes de ácido alfa-linolénico (omega-3 vegetal) más accesibles. El chocolate negro 85% aporta flavanoles que aumentan el flujo sanguíneo cerebral y la producción de BDNF, la proteína que protege y regenera neuronas.',
        tiempo_min: 1,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'La trampa de la cafeína y cómo salir de ella',
        descripcion: 'Cómo funciona realmente la cafeína en el cerebro, qué es el crash de adenosina y qué combinaciones de alimentos producen foco sostenido sin ansiedad.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia02-cafeina-focus.mp3',
      },
      micro_habito: {
        titulo: '25 minutos de foco sin notificaciones',
        instruccion: 'Elige una tarea importante. Pon el móvil boca abajo, cierra pestañas innecesarias y trabaja 25 minutos en modo monotarea. Al acabar, 5 minutos de pausa activa (levántate, muévete). Es la técnica Pomodoro con base neurocientífica.',
        duracion: '25 + 5 minutos',
      },
      registro_diario: {
        pregunta_manana: '¿Cuántos cafés tomaste ayer? ¿Cómo fue tu sueño?',
        pregunta_noche: '¿Lograste algún bloque de foco sostenido hoy? ¿De cuánto tiempo?',
      },
    },
  },
  {
    day_number: 3,
    title: 'Calma bajo presión de reuniones y deadlines',
    recipe_data: {
      idea_clara: {
        titulo: 'El estrés laboral tiene sabor: ácido, salado y ultraprocesado',
        texto: 'Bajo estrés agudo, el cortisol eleva la glucosa en sangre para preparar al cuerpo para una respuesta de emergencia que nunca llega. La dopamina cae y el cuerpo busca recompensas rápidas: azúcar, sal, ultraprocesados. Este ciclo inflama el eje intestino-cerebro y reduce la capacidad de regulación emocional. Los alimentos ricos en magnesio y triptófano actúan sobre el eje HPA — el sistema de respuesta al estrés — desde dentro.',
        concepto_clave: 'Eje HPA y cortisol',
      },
      snack_am: {
        nombre: 'Plátano maduro con nueces y cacao',
        ingredientes: [
          '1 plátano maduro (cuanto más maduro, más triptófano disponible)',
          '20 g de nueces (5–6 unidades)',
          '1 cucharadita de cacao puro en polvo (opcional, para espolvorear)',
        ],
        pasos: [
          'Pela el plátano y córtalo en rodajas o cómelo entero.',
          'Acompaña con las nueces.',
          'Si tienes cacao puro, espolvorea un poco por encima de las rodajas.',
        ],
        por_que: 'El plátano maduro es una de las fuentes más biodisponibles de triptófano, precursor de la serotonina. La fructosa del plátano maduro facilita el transporte del triptófano al cerebro. Las nueces añaden magnesio, que cofactor necesario para la síntesis de serotonina.',
        tiempo_min: 2,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Tostada de centeno con aguacate y limón',
        ingredientes: [
          '1–2 crackers de centeno o pan integral',
          '½ aguacate maduro',
          'Zumo de ½ limón',
          'Sal marina y pimienta negra',
          '1 pizca de copos de chile (opcional)',
        ],
        pasos: [
          'Aplasta el aguacate con un tenedor en el cracker.',
          'Exprime el limón por encima.',
          'Añade sal, pimienta y chile al gusto.',
          'Come lentamente. Sin pantalla si puedes.',
        ],
        por_que: 'El aguacate es una de las fuentes más ricas en ácido pantoténico (vitamina B5), esencial para la síntesis de cortisol y la respuesta adaptada al estrés. Su grasa monoinsaturada favorece la absorción de vitaminas liposolubles del resto de la dieta del día.',
        tiempo_min: 3,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'Qué le pasa a tu cerebro en un deadline',
        descripcion: 'La fisiología del estrés laboral agudo: cortisol, amígdala, corteza prefrontal y por qué comemos mal cuando más importa lo que comemos.',
        duracion_min: 8,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia03-estres-cortisol.mp3',
      },
      micro_habito: {
        titulo: 'Pausa de 90 segundos antes de responder',
        instruccion: 'Antes de responder un mensaje tenso, un correo difícil o entrar a una reunión complicada: 90 segundos. Respira y deja que la emoción inicial pase. La neurociencia muestra que una emoción dura unos 90 segundos si no la alimentamos con pensamiento rumiativo.',
        duracion: '90 segundos',
      },
      registro_diario: {
        pregunta_manana: '¿Hay algo que te genere estrés anticipatorio hoy? ¿Qué es?',
        pregunta_noche: '¿En qué momentos sentiste más tensión hoy? ¿Qué comiste justo después?',
      },
    },
  },
  {
    day_number: 4,
    title: 'El anti-bajón de las 16:00',
    recipe_data: {
      idea_clara: {
        titulo: 'El bajón de tarde no es falta de voluntad: es biología',
        texto: 'Entre las 14:00 y las 16:00 ocurre una ventana natural de somnolencia relacionada con el ritmo circadiano — independientemente de cuánto hayas dormido. La temperatura corporal baja ligeramente y la adenosina sube. Si además comiste un almuerzo rico en carbohidratos refinados, la insulina posprandial amplifica ese bajón. Un snack de bajo índice glucémico con proteína a las 15:30 estabiliza la glucosa y suaviza el trough circadiano sin necesidad de un cuarto café.',
        concepto_clave: 'Trough circadiano',
      },
      snack_am: {
        nombre: 'Huevo cocido con tomate cherry y aceite de oliva',
        ingredientes: [
          '1–2 huevos cocidos (pueden prepararse la noche anterior)',
          '8–10 tomates cherry',
          '1 cucharadita de aceite de oliva virgen extra',
          'Sal, pimienta y orégano seco',
        ],
        pasos: [
          'Cuece los huevos 10 minutos en agua hirviendo. Enfría en agua fría para pelar mejor.',
          'Corta los tomates por la mitad y colócalos junto al huevo.',
          'Aliña con aceite, sal, pimienta y orégano.',
        ],
        por_que: 'El huevo es el alimento con mayor puntuación de aminoácidos esenciales. La colina del huevo es precursora de acetilcolina, el neurotransmisor del aprendizaje y la memoria. El licopeno del tomate es más biodisponible con aceite de oliva.',
        tiempo_min: 10,
        dificultad: 'fácil',
      },
      snack_pm: {
        nombre: 'Kéfir bebible con canela y semillas de calabaza',
        ingredientes: [
          '150 ml de kéfir bebible o yogur natural líquido',
          '1 cucharada de semillas de calabaza',
          '1 pizca de canela molida',
        ],
        pasos: [
          'Vierte el kéfir en un vaso.',
          'Espolvorea la canela y añade las semillas de calabaza encima o en un vasito aparte.',
          'Bebe despacio y mastica las semillas.',
        ],
        por_que: 'Las semillas de calabaza son de las fuentes vegetales más ricas en zinc y triptófano. El zinc es cofactor de más de 300 enzimas, incluyendo las implicadas en síntesis de neurotransmisores. El kéfir aporta lactobacillus vivos que producen GABA directamente en el intestino.',
        tiempo_min: 2,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'Por qué las 16:00 son el enemigo y cómo ganarles',
        descripcion: 'El trough circadiano, la insulina posprandial y la adenosina: tres mecanismos que se suman para hacerte inútil a media tarde. Y cómo intervenir en cada uno.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia04-bajon-tarde-circadiano.mp3',
      },
      micro_habito: {
        titulo: 'Caminar 5 minutos después de comer',
        instruccion: 'Después del almuerzo, aunque sea dar la vuelta a la manzana o subir y bajar escaleras: 5 minutos de movimiento ligero. Está demostrado que reduce el pico glucémico posprandial hasta un 30% y acelera el retorno al foco.',
        duracion: '5 minutos',
      },
      registro_diario: {
        pregunta_manana: '¿Cómo fue tu tarde de ayer entre las 14:00 y las 17:00?',
        pregunta_noche: '¿Notaste hoy el bajón de tarde? ¿Fue diferente al de días anteriores?',
      },
    },
  },
  {
    day_number: 5,
    title: 'Creatividad y ánimo: el cerebro en modo flujo',
    recipe_data: {
      idea_clara: {
        titulo: 'El estado de flujo tiene una química: y puedes alimentarla',
        texto: 'El estado de flujo o flow — máxima creatividad y rendimiento sin esfuerzo percibido — está asociado a niveles elevados de dopamina, norepinefrina y anandamida. La anandamida, el endocannabinoide endógeno del placer y la creatividad, se sintetiza parcialmente a partir de ácido araquidónico y se degrada más lentamente cuando hay altos niveles de FAAH, una enzima que inhibe la propia anandamida. El cacao puro contiene inhibidores naturales de FAAH — más tiempo de anandamida disponible, más tiempo en flujo.',
        concepto_clave: 'Anandamida y FAAH',
      },
      snack_am: {
        nombre: 'Tostada integral con tahini y miel cruda',
        ingredientes: [
          '1 rebanada de pan integral de masa madre',
          '1,5 cucharadas de tahini (crema de sésamo)',
          '1 cucharadita de miel cruda',
          '1 pizca de sal marina',
        ],
        pasos: [
          'Tuesta ligeramente el pan si lo prefieres.',
          'Extiende el tahini con una espátula o el dorso de una cuchara.',
          'Añade la miel en hilo por encima.',
          'Espolvorea sal marina. El contraste dulce-salado potencia la experiencia.',
        ],
        por_que: 'El tahini es una de las fuentes más ricas en calcio vegetal, metionina y vitamina B1. La miel cruda (no pasteurizada) contiene oligosacáridos prebióticos y enzimas activas. La combinación con masa madre aporta fermentación y fibra que alimentan el microbioma productor de serotonina.',
        tiempo_min: 4,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Bowl de frutos rojos con semillas de calabaza y cacao',
        ingredientes: [
          '100 g de frutos rojos (frescos o descongelados)',
          '1 cucharada de semillas de calabaza',
          '1 cucharadita de cacao puro en polvo sin azúcar',
          '1 pizca de canela',
        ],
        pasos: [
          'Coloca los frutos rojos en un bol.',
          'Añade las semillas de calabaza por encima.',
          'Espolvorea cacao puro y canela.',
          'Mezcla ligeramente y come despacio.',
        ],
        por_que: 'Los frutos rojos son las frutas con mayor densidad de antocianinas, que atraviesan la barrera hematoencefálica y se acumulan en el hipocampo — la región del aprendizaje y la memoria. El cacao puro inhibe suavemente la FAAH y aporta flavanoles que aumentan el flujo sanguíneo cerebral.',
        tiempo_min: 2,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'La química del estado de flujo en el trabajo',
        descripcion: 'Dopamina, anandamida, norepinefrina: los neurotransmisores del flow, cómo se producen, qué los bloquea y qué alimentos los favorecen.',
        duracion_min: 8,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia05-flujo-creatividad.mp3',
      },
      micro_habito: {
        titulo: 'Una idea antes del móvil',
        instruccion: 'Al llegar a tu puesto (o al abrir el ordenador), antes de revisar el correo o el teléfono: escribe una sola idea, pregunta o intuición que tengas ahora mismo. No tiene que ser brillante. El acto de generar antes de consumir activa el modo creativo del cerebro durante las horas siguientes.',
        duracion: '2 minutos',
      },
      registro_diario: {
        pregunta_manana: '¿Tienes alguna tarea creativa importante hoy? ¿Cuál?',
        pregunta_noche: '¿Hubo algún momento de flow o concentración profunda hoy? ¿En qué contexto?',
      },
    },
  },
  {
    day_number: 6,
    title: 'Recuperación: bajar la carga mental acumulada',
    recipe_data: {
      idea_clara: {
        titulo: 'La fatiga mental no se cura con descanso pasivo. Se cura con activo.',
        texto: 'La fatiga cognitiva acumulada después de días de alta demanda mental está asociada a la acumulación de glutamato en la corteza prefrontal — el área del pensamiento ejecutivo. El sueño limpia ese exceso, pero durante el día existen estrategias activas: el movimiento suave aumenta el BDNF, los alimentos ricos en glicina (presente en el caldo de huesos y en la gelatina) aceleran la depuración de glutamato, y los fermentados modulan el sistema nervioso autónomo a través del nervio vago.',
        concepto_clave: 'Fatiga de glutamato y nervio vago',
      },
      snack_am: {
        nombre: 'Smoothie verde energizante',
        ingredientes: [
          '1 puñado de espinacas baby (30 g)',
          '1 manzana pequeña',
          'Zumo de ½ limón',
          '1 trozo pequeño de jengibre fresco (1 cm)',
          '150 ml de agua fría o kéfir',
          '1 cucharadita de semillas de chía (opcional)',
        ],
        pasos: [
          'Mete todos los ingredientes en una batidora o vaso de turmix.',
          'Tritura hasta obtener una textura homogénea.',
          'Si queda muy espeso, añade un poco más de agua.',
          'Bebe inmediatamente para conservar los polifenoles.',
        ],
        por_que: 'Las espinacas aportan folato (vitamina B9), esencial para la síntesis de serotonina y dopamina. El jengibre tiene propiedades antiinflamatorias y procinéticas que mejoran la motilidad intestinal. El limón facilita la absorción de hierro no hemo de las espinacas.',
        tiempo_min: 4,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Aceitunas con queso fresco y orégano',
        ingredientes: [
          '10–12 aceitunas negras o verdes',
          '60 g de queso fresco o requesón',
          '1 chorrito de aceite de oliva',
          'Orégano seco y pimienta negra',
        ],
        pasos: [
          'Coloca el queso fresco en un plato pequeño.',
          'Añade las aceitunas al lado.',
          'Aliña con un hilo de aceite, orégano y pimienta.',
        ],
        por_que: 'Las aceitunas son fermentadas — fuente de Lactobacillus plantarum — y ricas en ácido oleico y polifenoles como la oleuropeína, con efecto neuroprotector documentado. El queso fresco aporta proteína completa y calcio sin la densidad calórica de los quesos curados.',
        tiempo_min: 2,
        dificultad: 'muy fácil',
      },
      audio: {
        titulo: 'Cómo limpiar tu cerebro sin dormir: la ciencia del descanso activo',
        descripcion: 'Glutamato, BDNF, sistema glinfático: qué pasa en el cerebro cuando se acumula fatiga cognitiva y qué estrategias nutricionales y de movimiento aceleran la recuperación.',
        duracion_min: 7,
        tipo: 'educativo',
        archivo: 'audio/corporate/dia06-recuperacion-cerebro.mp3',
      },
      micro_habito: {
        titulo: 'El cierre del día en dos preguntas',
        instruccion: 'Antes de cerrar el ordenador, escribe dos cosas: (1) "qué me drenó hoy" y (2) "qué me dio energía hoy". No más de una línea cada una. Este ritual de closure reduce la rumiación nocturna y mejora la calidad del sueño al evitar que el cerebro procese trabajo pendiente a las 2:00 de la mañana.',
        duracion: '3 minutos',
      },
      registro_diario: {
        pregunta_manana: '¿Cómo describes tu nivel de carga mental acumulada esta semana? (1–10)',
        pregunta_noche: '¿Qué actividad de hoy te pareció más restauradora mentalmente?',
      },
    },
  },
  {
    day_number: 7,
    title: 'Reset inteligente: detecta tus patrones',
    recipe_data: {
      idea_clara: {
        titulo: 'Una semana de datos vale más que un año de intuición',
        texto: 'La cronobiología nutricional muestra que el mismo alimento tiene un efecto metabólico diferente según la hora en que se consume. Tu índice Food·Mood no mide solo qué comiste: correlaciona el alimento, el momento del día, el nivel de estrés y el estado de ánimo resultante. Después de 7 días de registro, tienes datos suficientes para identificar tu patrón personal: qué snack te da más foco, a qué hora rinde más tu digestión, qué micro-hábito tuvo mayor impacto real.',
        concepto_clave: 'Cronobiología nutricional personal',
      },
      snack_am: {
        nombre: 'Bowl de kéfir con semillas y cacao puro',
        ingredientes: [
          '150 ml de kéfir natural',
          '1 cucharada de semillas de calabaza',
          '1 cucharada de semillas de chía',
          '1 cucharadita de cacao puro en polvo',
          '1 cucharadita de miel cruda (opcional)',
        ],
        pasos: [
          'Vierte el kéfir en un bol.',
          'Añade las semillas y el cacao en polvo.',
          'Remueve y deja reposar 2 minutos para que las semillas absorban el líquido.',
          'Añade miel si quieres un toque dulce.',
        ],
        por_que: 'El kéfir es el fermentado más estudiado para la modulación del eje intestino-cerebro. Después de 7 días de consumo regular, empieza a modificar la composición del microbioma de forma medible. El cacao y las semillas de calabaza cierran el círculo de la semana: magnesio, zinc, flavanoles, triptófano.',
        tiempo_min: 3,
        dificultad: 'muy fácil',
      },
      snack_pm: {
        nombre: 'Edamame o garbanzos tostados con especias',
        ingredientes: [
          '100 g de edamame descongelado (o garbanzos cocidos)',
          '1 cucharadita de aceite de oliva',
          'Sal, comino y pimentón ahumado',
        ],
        pasos: [
          'Opción rápida: edamame al microondas 2 minutos + sal marina.',
          'Opción crujiente: garbanzos en sartén con aceite 5–7 minutos hasta dorar + especias al final.',
          'Come con las manos, sin prisa.',
        ],
        por_que: 'Las legumbres son la base alimentaria de todas las poblaciones con mayor longevidad saludable del mundo (Zonas Azules). Aportan proteína vegetal completa al combinarse con cereales del resto de la dieta, fibra prebiótica de alta fermentabilidad y magnesio. El edamame además es fuente de isoflavonas con efecto adaptogénico suave.',
        tiempo_min: 5,
        dificultad: 'fácil',
      },
      audio: {
        titulo: 'Tu protocolo personal: qué aprendiste esta semana',
        descripcion: 'Cómo interpretar tu índice Food·Mood de 7 días, qué patrones buscar, cómo mantener los cambios más allá del reto y cuál es el siguiente paso.',
        duracion_min: 10,
        tipo: 'cierre',
        archivo: 'audio/corporate/dia07-patron-personal.mp3',
      },
      micro_habito: {
        titulo: 'Revisa tu índice Food·Mood de la semana',
        instruccion: 'Abre tu diario de la semana. Mira tus registros de energía, foco y ánimo. ¿En qué días puntúas más alto? ¿Qué tenían en común? ¿Qué micro-hábito cumpliste más días? No busques perfección — busca el patrón que funciona para ti específicamente.',
        duracion: '5 minutos',
      },
      registro_diario: {
        pregunta_manana: '¿Cuál de los 7 micro-hábitos vas a mantener después del reto?',
        pregunta_noche: '¿Qué cambió esta semana que quieras conservar? ¿En una frase?',
      },
    },
  },
]

// Audio largo de psicología laboral (disponible desde día 1)
const AUDIO_LARGO = {
  titulo: 'Resiliencia, foco y bienestar laboral — la psicología moderna aplicada a tu jornada',
  descripcion: 'El audio de introducción del reto. Cubre: regulación emocional, mindfulness funcional, estrés crónico vs. estrés agudo, y por qué la nutrición es el lever más infrautilizado en el rendimiento cognitivo. Para escuchar antes de empezar o en cualquier momento del reto.',
  duracion_min: 22,
  tipo: 'psicologia',
  archivo: 'audio/corporate/intro-psicologia-laboral.mp3',
}

async function main() {
  console.log('\n🧑‍💻  Seeding "Food·Mood for Work — 7-Day Focus Snack Challenge"\n')

  // Upsert challenge
  const { data: ch, error: chErr } = await supabase
    .from('challenges')
    .upsert(CHALLENGE, { onConflict: 'slug' })
    .select('id')
    .single()

  if (chErr || !ch) {
    console.error('❌  Error creando el reto:', chErr?.message)
    process.exit(1)
  }
  console.log(`✅  Reto upserted — id: ${ch.id}`)

  // Upsert audio largo en el día 0 o como metadata del challenge
  const { error: audioErr } = await supabase
    .from('challenges')
    .update({ intro_audio: AUDIO_LARGO })
    .eq('id', ch.id)
  if (audioErr) {
    console.log('  ⚠️   intro_audio no se guardó (columna puede no existir aún):', audioErr.message)
  } else {
    console.log('  ✅  Audio de introducción guardado en challenges.intro_audio')
  }

  // Upsert days
  let ok = 0, fail = 0
  for (const d of DAYS) {
    const { error } = await supabase
      .from('challenge_days')
      .upsert(
        { challenge_id: ch.id, ...d },
        { onConflict: 'challenge_id,day_number' }
      )
    if (error) {
      console.error(`  ❌  Día ${d.day_number}: ${error.message}`)
      fail++
    } else {
      console.log(`  ✅  Día ${d.day_number}: ${d.title}`)
      ok++
    }
  }

  console.log(`\n✨  ${ok} días insertados · ${fail} errores`)
  if (fail > 0) process.exit(1)
}

main()
