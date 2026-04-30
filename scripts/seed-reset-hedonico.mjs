import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Challenge metadata ────────────────────────────────────────────────────────

const CHALLENGE = {
  slug:          'microhabitos',
  title:         'Microhábitos — 21 días',
  subtitle:      'Crea un hábito real usando el placer como motor de cambio',
  description:   'Un programa de 21 días basado en psicología de hábitos y neurociencia del placer. Cada día: un micro-hábito, una teoría psicológica breve, una práctica rápida y una bebida funcional placentera que actúa como ancla hedónica. El placer no es la recompensa — es el mecanismo.',
  category:      'hábitos',
  duration_days: 21,
  price_eur:     29,
  color:         '#C9A84C',
  emoji:         '✨',
  recipe_count:  21,
  audio_count:   21,
  is_active:     true,
  audiencia:     'Personas que quieren cambiar hábitos sin fuerza de voluntad, usando el placer como palanca neurológica',
  incluye: [
    '21 días de micro-hábitos con base en psicología del comportamiento',
    '21 bebidas funcionales fermentadas como ancla hedónica',
    '21 audios guiados de 3-5 minutos',
    'Diario de reflexión mañana, tarde y noche',
    '3 hitos de celebración (días 7, 14 y 21)',
    'Acceso de por vida al contenido'
  ],
  hitos_landing: [
    { dia: 1,  texto: 'Creas tu primera ancla hedónica — el hábito ya tiene sabor' },
    { dia: 7,  texto: 'Semana 1 completada — tienes 7 asociaciones placer-hábito' },
    { dia: 14, texto: 'La resistencia cae — el hábito ya no requiere esfuerzo consciente' },
    { dia: 21, texto: 'El Reset está hecho. El placer es ahora tu sistema operativo' }
  ],
  al_completar: {
    titulo:    '21 días completados',
    subtitulo: 'Tienes un nuevo hábito anclado al placer. No necesitas fuerza de voluntad.',
    cta:       'Ver Reto Slow Food·Mood — calma la ansiedad',
    cta_slug:  'slow-food-mood'
  }
}

// ── 21 días ──────────────────────────────────────────────────────────────────

const DAYS = [

  // ═══════════════════════════════════════════════════════════════
  // FASE 1 — PREPARAR (días 1–7)
  // ═══════════════════════════════════════════════════════════════

  {
    day_number: 1,
    title: 'El hábito diminuto — Limón fermentado con jengibre',
    tip: 'Hazlo tan pequeño que sea ridículo no hacerlo',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Tiny Habits (BJ Fogg) — la resistencia cae cuando el hábito es mínimo',
      idea_clara: {
        titulo: 'Por qué los hábitos diminutos funcionan',
        texto: 'La fuerza de voluntad es un recurso limitado que se agota. Los hábitos que dependen de ella fracasan. La solución no es más disciplina — es reducir el hábito tanto que la resistencia desaparezca. BJ Fogg lo llama Tiny Habits: un hábito tan pequeño que es más difícil saltárselo que hacerlo. Hoy empiezas con algo tan pequeño que no puede fallar.',
        concepto_clave: 'Tiny Habits — umbral de resistencia cero'
      },
      cambio_del_dia: {
        titulo: 'Un sorbo antes del café',
        instruccion: 'Prepara tu bebida. Antes de tu primer café o té del día, toma un sorbo de esta limonada fermentada. Un sorbo. Eso es todo el hábito de hoy.',
        por_que: 'Anclar el nuevo hábito a uno existente (el café) elimina la necesidad de recordarlo. El placer de la bebida crea una asociación positiva inmediata.',
        duracion: '30 segundos'
      },
      receta: {
        titulo: 'Limonada de limón fermentado con jengibre y cúrcuma',
        descripcion: 'Probiótica, antiinflamatoria, brillante. Tu primer ancla hedónica.',
        ingredientes: [
          '200ml de agua con gas o agua de kéfir',
          'Zumo de 1/2 limón fresco',
          '1 cdta de jengibre fresco rallado',
          '1/4 cdta de cúrcuma en polvo',
          'Pizca de pimienta negra',
          '1 cdta de miel cruda (opcional)',
          'Hielo al gusto'
        ],
        pasos: [
          'Exprime el limón directamente en el vaso.',
          'Añade el jengibre rallado y la cúrcuma con la pimienta negra.',
          'Vierte el agua con gas o kéfir lentamente para conservar las burbujas.',
          'Añade miel si lo deseas. Remueve suavemente.',
          'Toma un sorbo consciente antes de tu primer café.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La vitamina C del limón potencia la absorción de hierro y activa la síntesis de neurotransmisores. Los gingeroles del jengibre tienen efecto antiinflamatorio sistémico comparable al ibuprofeno en dosis bajas. La curcumina — activada por la piperina de la pimienta negra — reduce la neuroinflamación latente que produce niebla mental y fatiga anímica.',
        alimento_estrella: 'Limón fresco + jengibre'
      },
      lectura: {
        titulo: 'Audio — Día 1: El hábito que no puede fallar',
        texto: 'Cierra los ojos un momento. Piensa en un hábito que hayas intentado crear y hayas abandonado. ¿Era demasiado grande? ¿Dependía de motivación que no siempre tenías? Hoy aprendes la regla más contraintuitiva de la psicología del comportamiento: cuanto más pequeño el hábito, más probable que dure. No porque seas más disciplinado — sino porque la resistencia desaparece. Tu ancla de hoy es este sorbo. Solo este sorbo.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué hábito pequeño puedo hacer hoy que sea casi imposible de saltarme?',
        pregunta_tarde:  '¿He tomado mi sorbo de hoy? ¿Cómo me ha sabido?',
        pregunta_noche:  '¿Qué ha funcionado hoy que puedo repetir mañana?'
      },
      texto_notificacion: '✨ Día 1 — Un sorbo antes del café. Tan pequeño que no puede fallar.'
    }
  },

  {
    day_number: 2,
    title: 'Diseño de entorno — Kéfir con arándanos y lavanda',
    tip: 'Pon la bebida donde ya estás, no donde crees que deberías estar',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Environment Design — el entorno decide el comportamiento más que la intención',
      idea_clara: {
        titulo: 'Tu entorno decide por ti',
        texto: 'El 80% de nuestras decisiones son respuestas automáticas al entorno, no elecciones conscientes. Si tienes fruta en la encimera, comes más fruta. Si el móvil está en el dormitorio, duermes mejor. El diseño de entorno es la herramienta de cambio de hábitos más eficaz que existe — y no requiere esfuerzo consciente en el momento.',
        concepto_clave: 'Architecture of choice — diseñar la fricción'
      },
      cambio_del_dia: {
        titulo: 'Prepara tu bebida la noche anterior',
        instruccion: 'Esta noche, deja el vaso, el kéfir y los arándanos ya preparados en la nevera, tapados. Mañana solo tienes que servir. Reduce la fricción a cero.',
        por_que: 'Cada decisión adicional que requiere un hábito reduce un 30% la probabilidad de que lo hagas. Preparar de noche elimina todas las fricciones matutinas.',
        duracion: '3 minutos de preparación (la noche anterior)'
      },
      receta: {
        titulo: 'Kéfir cremoso con arándanos silvestres y lavanda',
        descripcion: 'Neuroprotector, ansiolítico, sensorial. El color violeta es parte del efecto.',
        ingredientes: [
          '200ml de kéfir natural (vaca o cabra)',
          '80g de arándanos silvestres frescos o congelados',
          '3-4 flores de lavanda seca o 1 gota de agua floral de lavanda',
          '1 cdta de miel cruda',
          'Opcional: pizca de cardamomo'
        ],
        pasos: [
          'La noche anterior: vierte el kéfir en el vaso, añade los arándanos, tapa y refrigera.',
          'Por la mañana: tritura suavemente los arándanos con un tenedor para que tiñan el kéfir de violeta.',
          'Añade la lavanda y la miel.',
          'Toma 30 segundos para observar el color antes de beber.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'Las antocianinas de los arándanos silvestres cruzan la barrera hematoencefálica y protegen las neuronas del estrés oxidativo — efecto measurable en 6 semanas. El kéfir aporta L. acidophilus y B. bifidus, que producen GABA en el intestino, el neurotransmisor de la calma. El linalool de la lavanda tiene efecto ansiolítico documentado: reduce la actividad de la amígdala sin sedación.',
        alimento_estrella: 'Arándanos silvestres'
      },
      lectura: {
        titulo: 'Audio — Día 2: No cambies tú, cambia tu entorno',
        texto: 'La mayoría de las personas que fracasan en sus hábitos creen que les falta motivación o disciplina. En realidad, lo que les falta es un entorno bien diseñado. James Clear lo llama "hacer que lo bueno sea obvio y lo malo difícil". Hoy practicas eso: la bebida ya está lista. No tienes que decidir. Solo tienes que servir.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué objeto puedo mover hoy para que mi hábito sea más fácil?',
        pregunta_tarde:  '¿He notado algún momento donde el entorno me ha empujado hacia algo — bueno o malo?',
        pregunta_noche:  '¿Qué puedo preparar esta noche para que mañana sea más fácil?'
      },
      texto_notificacion: '✨ Día 2 — Tu bebida ya está en la nevera. Solo tienes que servirla.'
    }
  },

  {
    day_number: 3,
    title: 'El ancla hedónica — Kombucha de menta y lima',
    tip: 'El placer no es la recompensa del hábito — es el mecanismo',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Hedonic Anchoring — usar el placer sensorial para consolidar rutas neurales',
      idea_clara: {
        titulo: 'Cómo el placer construye hábitos permanentes',
        texto: 'Cada vez que experimentas placer, el cerebro libera dopamina y graba la ruta neural que llevó a ese placer. Si anclas tu nuevo hábito a algo genuinamente placentero — un sabor, un aroma, una sensación — el cerebro empieza a buscar ese hábito activamente. No porque seas disciplinado, sino porque tu sistema de recompensa está trabajando a tu favor. Esto es el ancla hedónica.',
        concepto_clave: 'Dopamine loop — ruta neural + recompensa = hábito automático'
      },
      cambio_del_dia: {
        titulo: 'Bebe despacio. Siente cada sorbo.',
        instruccion: 'Hoy, cuando tomes tu bebida, hazlo sin móvil, sin pantalla. Tres sorbos conscientes: huele primero, luego prueba. Nota la efervescencia, el ácido de la lima, el frío de la menta.',
        por_que: 'La atención plena al placer sensorial amplifica la liberación de dopamina hasta 3 veces. No es mindfulness espiritual — es neurociencia del aprendizaje.',
        duracion: '2 minutos conscientes'
      },
      receta: {
        titulo: 'Kombucha de menta fresca y lima',
        descripcion: 'Efervescente, refrescante, viva. La menta activa el nervio vago.',
        ingredientes: [
          '250ml de kombucha natural (sin azúcar añadida)',
          'Zumo de 1/2 lima',
          '6-8 hojas de menta fresca',
          '1 cdta de sirope de agave o miel líquida',
          'Hielo + rodaja de lima para decorar'
        ],
        pasos: [
          'En un vaso alto, machaca suavemente las hojas de menta para liberar sus aceites.',
          'Añade el hielo y el zumo de lima.',
          'Vierte la kombucha lentamente por el borde del vaso.',
          'Añade el sirope. No remuevas — deja que se mezcle solo.',
          'Inhala el aroma antes de beber. Ese es el primer ancla.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El ácido glucurónico de la kombucha apoya la detoxificación hepática de fase II. El mentol de la menta activa los receptores TRPM8, produciendo una sensación de frescor y activando el nervio vago — reduciendo la frecuencia cardíaca y el cortisol. El limoneno de la lima tiene efecto ansiolítico en el sistema limbico. La fermentación aporta ácidos orgánicos que modulan el pH intestinal.',
        alimento_estrella: 'Kombucha + menta fresca'
      },
      lectura: {
        titulo: 'Audio — Día 3: El placer como arquitecto',
        texto: 'Existe un malentendido fundamental sobre los hábitos: creemos que el placer debe venir después del esfuerzo. Pero la neurociencia dice lo contrario — el placer debe venir durante el hábito, o mejor aún, ser el hábito mismo. Tu bebida de hoy no es una recompensa por haber hecho algo difícil. Es el mecanismo. Es la señal que le dice a tu cerebro: esto vale la pena repetir.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué parte de mi rutina de hoy puede ser más placentera — no como recompensa, sino como experiencia?',
        pregunta_tarde:  '¿He notado algún momento de placer genuino hoy? ¿Qué lo provocó?',
        pregunta_noche:  '¿Qué querría repetir mañana porque me ha gustado, no porque deba hacerlo?'
      },
      texto_notificacion: '✨ Día 3 — Tres sorbos conscientes. Sin móvil. El placer construye el hábito.'
    }
  },

  {
    day_number: 4,
    title: 'Identidad, no metas — Agua de kéfir con frambuesas',
    tip: 'No "quiero beber mejor" — soy alguien que cuida su microbioma',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Identity-based habits (James Clear) — el cambio desde quién eres, no qué quieres',
      idea_clara: {
        titulo: 'Los hábitos que duran vienen de la identidad',
        texto: 'Hay dos formas de cambiar: perseguir resultados ("quiero perder peso") o cambiar tu identidad ("soy alguien que se mueve cada día"). La primera depende de motivación. La segunda es consistente porque cada acción refuerza quién eres. James Clear lo llama identity-based habits: cada pequeña acción es un voto para la persona en que te estás convirtiendo.',
        concepto_clave: 'Votes for your identity — cada acción como evidencia de quién eres'
      },
      cambio_del_dia: {
        titulo: 'Di en voz alta quién eres',
        instruccion: 'Mientras preparas tu bebida hoy, di en voz alta (aunque sea susurrado): "Soy alguien que cuida su eje intestino-cerebro." Suena raro. Hazlo igual.',
        por_que: 'La verbalización activa el córtex prefrontal y consolida la identidad narrativa. Las personas que se identifican con un hábito lo mantienen un 60% más que quienes lo ven como un objetivo.',
        duracion: '10 segundos de verbalización'
      },
      receta: {
        titulo: 'Agua de kéfir con frambuesas y agua de rosas',
        descripcion: 'Sin lactosa, viva, floral. Para los que aún no han probado kéfir.',
        ingredientes: [
          '250ml de agua de kéfir (o kombucha si no encuentras)',
          '80g de frambuesas frescas',
          '1 cdta de agua de rosas',
          '1 cdta de miel cruda',
          'Hojas de menta o albahaca para servir'
        ],
        pasos: [
          'Tritura la mitad de las frambuesas con un tenedor en el vaso.',
          'Añade el agua de rosas y la miel. Mezcla.',
          'Vierte el agua de kéfir lentamente.',
          'Decora con las frambuesas enteras y las hierbas.',
          'Di tu frase de identidad antes de beber.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El agua de kéfir es el kéfir sin lactosa — ideal para intolerantes. Contiene L. brevis, L. casei y Leuconostoc mesenteroides, productores de ácido láctico y GABA. Los ellagitaninos de la frambuesa son precursores de las urolitinas, compuestos neuroprotectores que solo se producen si tienes la microbiota adecuada para transformarlos. El agua de rosas contiene geraniol y citronelol, con efecto sobre el sistema serotoninérgico.',
        alimento_estrella: 'Frambuesas + agua de kéfir'
      },
      lectura: {
        titulo: 'Audio — Día 4: Vota por quien quieres ser',
        texto: 'Cada vez que tomas esta bebida, no estás solo hidratándote. Estás emitiendo un voto. Un voto que dice: soy alguien que se cuida a través del placer, no del sacrificio. No necesitas hacerlo perfecto. Solo necesitas votar con suficiente frecuencia para que la mayoría diga quién eres. Hoy es tu cuarto voto consecutivo.'
      },
      registro_diario: {
        pregunta_manana: '¿Quién quiero ser hoy — no qué quiero lograr, sino quién?',
        pregunta_tarde:  '¿He actuado hoy de forma coherente con esa identidad? ¿En qué momento?',
        pregunta_noche:  '¿Qué voto he emitido hoy que me acerca a la persona que quiero ser?'
      },
      texto_notificacion: '✨ Día 4 — Di en voz alta quién eres mientras preparas tu bebida.'
    }
  },

  {
    day_number: 5,
    title: 'Anticipación de dopamina — Smoothie de mango y cardamomo',
    tip: 'El cerebro libera dopamina anticipando el placer, no solo al sentirlo',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Dopamine anticipation — usar la anticipación como combustible del hábito',
      idea_clara: {
        titulo: 'La dopamina vive en la anticipación',
        texto: 'Investigación de Wolfram Schultz (Nobel 2022) demostró que la dopamina no se libera principalmente cuando obtienes la recompensa — se libera cuando la anticipas. Por eso pensar en las vacaciones es a veces más placentero que estar en ellas. Puedes usar esto a tu favor: empieza a construir anticipación para tu bebida de mañana desde hoy por la tarde.',
        concepto_clave: 'Prediction error — el cerebro recompensa la anticipación correcta'
      },
      cambio_del_dia: {
        titulo: 'Crea un ritual de anticipación',
        instruccion: 'Esta tarde, a las 18:00, pon una alarma con el nombre "Mañana: mango y cardamomo". Cuando suene, dedica 20 segundos a imaginar el aroma y el sabor. Eso activa el sistema de dopamina antes de que el hábito ocurra.',
        por_que: 'La anticipación consciente aumenta la dopamina en el núcleo accumbens, creando un estado de deseo que motiva el comportamiento al día siguiente.',
        duracion: '20 segundos de anticipación activa'
      },
      receta: {
        titulo: 'Smoothie tropical de mango, kéfir y cardamomo',
        descripcion: 'Denso, exótico, serotoninérgico. El color naranja como señal hedónica.',
        ingredientes: [
          '150g de mango maduro congelado',
          '150ml de kéfir natural',
          '1/2 cdta de cardamomo molido',
          '1 cdta de miel o sirope de dátil',
          'Pizca de sal marina',
          'Opcional: coco rallado para decorar'
        ],
        pasos: [
          'Tritura el mango congelado con el kéfir hasta obtener una textura densa.',
          'Añade el cardamomo, la miel y la sal marina.',
          'Tritura de nuevo 20 segundos.',
          'Sirve en vaso ancho y decora con coco rallado.',
          'Antes de beber: inhala el aroma del cardamomo. Ese aroma es ahora tu señal.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La mangiferina del mango es un polifenol con propiedades antiinflamatorias y neuroprotectoras documentadas. Combinada con el kéfir, que facilita la conversión de triptófano en serotonina en el intestino, crea un cocktail serotoninérgico. El 1,8-cineol del cardamomo es un compuesto adaptógeno que mejora el flujo sanguíneo cerebral y reduce la fatiga cognitiva. La vitamina C del mango actúa como cofactor en la síntesis de dopamina.',
        alimento_estrella: 'Mango + cardamomo'
      },
      lectura: {
        titulo: 'Audio — Día 5: Desear antes de tener',
        texto: 'Hay un truco de los hábitos que casi nadie usa: construir la anticipación. Tu cerebro libera dopamina cuando anticipa algo placentero. Si aprendes a desear activamente tu hábito antes de hacerlo, el impulso de hacerlo crece solo. Hoy practicas eso: una alarma, 20 segundos imaginando el sabor. Simple. Poderoso.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué espero con ganas hoy? ¿Puedo añadir más anticipación a algo?',
        pregunta_tarde:  '¿He sentido el deseo de tomar mi bebida antes de prepararla?',
        pregunta_noche:  '¿Qué rituales de anticipación puedo crear para los hábitos que más me cuestan?'
      },
      texto_notificacion: '✨ Día 5 — Pon una alarma a las 18h: "Mañana: mango y cardamomo." Anticipa.'
    }
  },

  {
    day_number: 6,
    title: 'Autocompasión como combustible — Limonada de hibisco',
    tip: 'La autocrítica apaga la motivación. La autocompasión la enciende.',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: null,
      objetivo_psicologico: 'Self-compassion (Kristin Neff) — la autocompasión como predictor de persistencia',
      idea_clara: {
        titulo: 'Por qué la autocompasión funciona mejor que la autocrítica',
        texto: 'Existe la creencia de que ser duro con uno mismo aumenta la motivación. La investigación de Kristin Neff muestra exactamente lo contrario: la autocrítica activa la amenaza, eleva el cortisol y reduce la capacidad de aprendizaje. La autocompasión — tratarte como tratarías a un amigo — activa el sistema de cuidado, reduce el cortisol y aumenta la resiliencia. Las personas que se tratan con compasión cuando fallan tienen más probabilidad de intentarlo de nuevo.',
        concepto_clave: 'Self-compassion vs. self-criticism — la paradoja del rendimiento'
      },
      cambio_del_dia: {
        titulo: 'Una frase de retorno sin culpa',
        instruccion: 'Si hoy (o cualquier día) te saltas la bebida o el hábito, di en voz alta: "No pasa nada. Mañana vuelvo." Sin drama, sin castigo. Practicar esto en días buenos lo hace automático en días difíciles.',
        por_que: 'Las personas que tienen una frase de retorno preparada se recuperan de los deslices 3 veces más rápido que quienes los procesan como fracasos.',
        duracion: '5 segundos de autocompasión activa'
      },
      receta: {
        titulo: 'Limonada de hibisco fermentada con miel de flores',
        descripcion: 'Roja, ácida, antioxidante. El color como celebración.',
        ingredientes: [
          '500ml de agua',
          '2 cdas de flores de hibisco seco',
          '150ml de kombucha o agua de kéfir',
          '2 cdas de miel cruda de flores',
          'Zumo de 1/2 limón',
          'Hielo y rodajas de limón para servir'
        ],
        pasos: [
          'Infusiona el hibisco en agua caliente (no hirviendo) durante 10 minutos. Deja enfriar.',
          'Cuela y mezcla con el zumo de limón y la miel. Remueve hasta disolver.',
          'Añade la kombucha fría. No remuevas — deja las dos capas formarse.',
          'Sirve sobre hielo con las rodajas de limón.',
          'Observa el rojo intenso. Es un color de celebración, no de esfuerzo.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'Las antocianinas del hibisco (delfinidina, cianidina) tienen uno de los valores ORAC más altos en plantas. El ácido hibísco tiene efecto antihipertensivo documentado: 3 tazas diarias reducen la presión sistólica 7 mmHg. La fermentación con miel introduce bacterias de la microbiota floral — Lactobacillus kunkeei y otras — que diversifican el microbioma intestinal. La vitamina C del limón potencia la absorción de hierro de las flores de hibisco.',
        alimento_estrella: 'Flores de hibisco'
      },
      lectura: {
        titulo: 'Audio — Día 6: La voz que más escuchas',
        texto: 'Hay una voz que escuchas más que ninguna otra: la tuya propia. Cuando fallas, ¿qué te dice? La mayoría de las personas se hablan a sí mismas de una forma que jamás tolerarían de un amigo. Hoy practicas una sola frase de retorno. No para excusarte — para conservar la energía que necesitas para volver. La autocompasión no es debilidad. Es la estrategia más eficiente que existe para el cambio a largo plazo.'
      },
      registro_diario: {
        pregunta_manana: '¿Cómo me hablaré hoy si algo no sale como esperaba?',
        pregunta_tarde:  '¿He tenido un momento de autocrítica innecesaria? ¿Cómo podría haberlo manejado con más compasión?',
        pregunta_noche:  '¿Cuál es mi frase de retorno personal para cuando falle?'
      },
      texto_notificacion: '✨ Día 6 — "No pasa nada. Mañana vuelvo." Practica la frase hoy aunque no la necesites.'
    }
  },

  {
    day_number: 7,
    title: '🏆 HITO — Semana 1 completada',
    tip: 'Siete anclas hedónicas construidas. Tu cerebro ya reconoce el patrón.',
    recipe_data: {
      fase: 'preparar',
      semana: 1,
      hito: {
        titulo: '7 días. 7 anclas. El patrón ya existe.',
        descripcion: 'Has completado la primera semana del Reset Hedónico. En estos 7 días has practicado Tiny Habits, diseño de entorno, anclaje hedónico, identidad, anticipación de dopamina y autocompasión. No son conceptos — son rutas neurales que has activado repetidamente. El hábito ya tiene forma.',
        reflexion: '¿Qué ha sido más fácil de lo que esperabas? ¿Qué concepto te ha resonado más? Escríbelo antes de seguir.',
        estadisticas: {
          mecanismos_activados: [
            'Tiny Habits — umbral de resistencia a cero',
            'Environment Design — fricción eliminada',
            'Hedonic Anchoring — ancla de placer activa',
            'Identity-based habits — votos emitidos',
            'Dopamine anticipation — circuito de deseo',
            'Self-compassion — motor de persistencia'
          ]
        }
      },
      idea_clara: {
        titulo: 'Lo que ha pasado en tu cerebro esta semana',
        texto: 'Cada vez que repetiste el hábito con placer, liberaste dopamina. Cada liberación de dopamina marcó la ruta neural. Después de 7 repeticiones, la ruta empieza a mielinizarse — se vuelve más rápida, más eficiente, más automática. No sientes que has "logrado algo difícil". Sientes que simplemente lo haces. Eso es exactamente lo que queremos.',
        concepto_clave: 'Mielinización — la ruta neural se vuelve automática'
      },
      cambio_del_dia: {
        titulo: 'Celebra — no continúes sin celebrar',
        instruccion: 'Hoy, cuando termines tu elixir de celebración, haz algo físico para marcar el hito: un puño en alto, una pequeña danza, lo que sea. La celebración física consolida el recuerdo hedónico.',
        por_que: 'BJ Fogg llama a esto "Shine" — una celebración inmediata que amplifica la dopamina y graba el recuerdo del éxito. Sin celebración, el cerebro no aprende tan bien.',
        duracion: '5 segundos de celebración genuina'
      },
      receta: {
        titulo: 'Elixir de celebración — kéfir de vainilla, dátil y cacao',
        descripcion: 'Cremoso, opulento, hedónico. Diseñado para celebrar, no para ser saludable.',
        ingredientes: [
          '200ml de kéfir natural',
          '2 dátiles Medjool sin hueso',
          '1/2 cdta de extracto de vainilla natural',
          '1 cdta de cacao en polvo sin azúcar',
          'Pizca de canela',
          'Opcional: cacao nibs para decorar'
        ],
        pasos: [
          'Tritura los dátiles con el kéfir hasta que queden completamente integrados.',
          'Añade la vainilla, el cacao y la canela.',
          'Tritura de nuevo hasta obtener una textura sedosa.',
          'Sirve en tu vaso más bonito.',
          'Celebra antes de beber — no después.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La vainillina tiene un efecto opiáceo suave — activa los mismos receptores que las endorfinas pero con intensidad baja y sin adicción. Los dátiles Medjool aportan carbohidratos de liberación lenta y triptófano, precursor de serotonina. El cacao contiene feniletilamina (el "compuesto del enamoramiento"), teobromina y magnesio — la tríada del buen humor. El kéfir como base garantiza que el triptófano llegue al cerebro con el transporte intestinal adecuado.',
        alimento_estrella: 'Dátil Medjool + cacao + vainilla'
      },
      lectura: {
        titulo: 'Audio — Día 7: La primera semana siempre es la más difícil',
        texto: 'La semana 1 de cualquier hábito es la más difícil porque la ruta neural todavía no existe. Tú la has creado. Siete veces has dicho: esto importa. Siete veces tu cerebro ha grabado el patrón. La semana 2 te sorprenderá — notarás que el impulso de tomar tu bebida llega solo, antes de que lo recuerdes. Eso es la mielinización trabajando. El hábito ya vive en ti.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué he aprendido sobre mí esta semana respecto a mis hábitos?',
        pregunta_tarde:  '¿Cuál de los 6 mecanismos de esta semana me ha resultado más natural?',
        pregunta_noche:  '¿Qué llevaré a la semana 2 que no tenía hace 7 días?'
      },
      texto_notificacion: '🏆 Día 7 — Primera semana completada. Tu elixir de celebración está esperando.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // FASE 2 — REFORZAR (días 8–14)
  // ═══════════════════════════════════════════════════════════════

  {
    day_number: 8,
    title: 'Protocolo de resistencia — Shot de adaptógenos',
    tip: 'Los obstáculos son parte del hábito, no interrupciones de él',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Obstacle thinking (Gabriele Oettingen) — planificar los obstáculos fortalece el hábito',
      idea_clara: {
        titulo: 'WOOP: el método que convierte obstáculos en combustible',
        texto: 'Gabriele Oettingen desarrolló WOOP (Wish, Outcome, Obstacle, Plan) — el único método respaldado por meta-análisis que aumenta la consecución de hábitos más que el pensamiento positivo solo. El truco: imaginar los obstáculos activa el mismo circuito neural que los supera. No te prepara mentalmente — cambia literalmente la reactividad del cerebro ante esos obstáculos.',
        concepto_clave: 'Mental contrasting — balance entre deseo y obstáculos realistas'
      },
      cambio_del_dia: {
        titulo: 'Escribe tu obstáculo más probable',
        instruccion: 'Escribe en tu diario: "El obstáculo más probable para mi hábito esta semana es ___ y cuando ocurra haré ___." Una frase de si-entonces. Específica.',
        por_que: 'Los implementation intentions (planes si-entonces) aumentan un 91% la probabilidad de mantener un hábito cuando aparecen obstáculos, según meta-análisis de Gollwitzer (2006).',
        duracion: '2 minutos de escritura'
      },
      receta: {
        titulo: 'Shot de adaptógenos — ashwagandha, maca y cacao con kéfir',
        descripcion: 'Concentrado, potente, energizante. No un sorbo — un shot.',
        ingredientes: [
          '100ml de kéfir natural',
          '1/2 cdta de ashwagandha en polvo (KSM-66)',
          '1/2 cdta de maca gelatinizada',
          '1 cdta de cacao en polvo crudo',
          '1 cdta de miel cruda',
          'Pizca de canela y cardamomo'
        ],
        pasos: [
          'Mezcla todos los polvos con la miel hasta formar una pasta.',
          'Añade el kéfir y bate vigorosamente con un batidor de mano.',
          'Sirve en vaso pequeño (shot).',
          'Tómalo de un trago o en 2-3 sorbos concentrados.',
          'Escribe tu obstáculo mientras sientes el efecto del adaptógeno.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'Los withanólidos de la ashwagandha (extracto KSM-66, el más estudiado) reducen el cortisol entre 14-27% en ensayos clínicos de 60 días. La maca gelatinizada aporta glucosinolatos energizantes sin estimulación del sistema nervioso — energía sostenida, no pico-y-caída. El cacao crudo tiene una biodisponibilidad de flavonoides 4 veces mayor que el procesado. El kéfir mejora la absorción de todos los compuestos activos.',
        alimento_estrella: 'Ashwagandha KSM-66'
      },
      lectura: {
        titulo: 'Audio — Día 8: Los obstáculos son el camino',
        texto: 'La semana 2 es cuando los hábitos se prueban. El entusiasmo de la semana 1 empieza a bajar. Los días caóticos llegan. Alguien o algo interrumpe tu rutina. Esto no es un problema — es exactamente el entrenamiento que necesitas. Un hábito que solo funciona en condiciones perfectas no es un hábito. Es una excepción. Esta semana practicas hacer el hábito cuando no es conveniente. Eso es lo que lo vuelve permanente.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál es el obstáculo más probable hoy? ¿Cuál es mi plan si aparece?',
        pregunta_tarde:  '¿Ha aparecido algún obstáculo? ¿Cómo lo he manejado?',
        pregunta_noche:  '¿He mantenido el hábito a pesar de alguna dificultad? ¿Cómo me siento al respecto?'
      },
      texto_notificacion: '✨ Día 8 — Escribe tu obstáculo más probable y tu plan. El shot te espera.'
    }
  },

  {
    day_number: 9,
    title: 'Hábitos flexibles — Agua de kéfir con membrillo',
    tip: 'Nunca faltes dos veces seguidas — la regla del nunca dos',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Flexible habits — la regla del "nunca dos" y el no-perfeccionismo',
      idea_clara: {
        titulo: 'El hábito perfecto que nunca ocurre vs. el imperfecto que siempre pasa',
        texto: 'El perfeccionismo mata los hábitos. Una persona que falla un día y lo abandona todo tiene peores resultados que quien falla pero vuelve al día siguiente. James Clear llama a esto "la regla del nunca dos": puedes fallar una vez (vida), pero nunca dos veces seguidas. Un día perdido es un accidente. Dos días perdidos es una decisión. El hábito imperfecto que siempre ocurre gana al perfecto que depende de condiciones ideales.',
        concepto_clave: 'Never miss twice — la asimetría del fallo y la recuperación'
      },
      cambio_del_dia: {
        titulo: 'Versión mínima del hábito para días difíciles',
        instruccion: 'Crea ahora tu "versión de emergencia" del hábito: el mínimo posible. Para la bebida: aunque sea agua con un chorrito de kéfir y limón. Para el diario: aunque sea una palabra. Define esto hoy.',
        por_que: 'Tener una versión mínima lista elimina el pensamiento binario todo-o-nada. El cerebro registra la continuidad del hábito aunque la calidad varíe.',
        duracion: '1 minuto de definición'
      },
      receta: {
        titulo: 'Agua de kéfir con membrillo y canela',
        descripcion: 'Dorada, otoñal, digestiva. El membrillo como ingrediente de lujo fermentado.',
        ingredientes: [
          '250ml de agua de kéfir o kombucha',
          '2 cdas de membrillo en compota (sin azúcar añadida)',
          '1/4 cdta de canela en polvo',
          '1 cdta de miel cruda',
          'Pizca de vainilla'
        ],
        pasos: [
          'Disuelve el membrillo con la miel y la canela en el fondo del vaso.',
          'Vierte el agua de kéfir lentamente.',
          'Añade la pizca de vainilla.',
          'No mezcles completamente — deja capas de sabor.',
          'Es una bebida de día difícil. Si llegaste a prepararla, ya ganaste.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El membrillo contiene taninos condensados (procianidinas) con efecto antiinflamatorio intestinal, especialmente útiles en estados de estrés crónico donde la barrera intestinal se permeabiliza. Su pectina soluble es uno de los mejores prebióticos para Akkermansia muciniphila, la bacteria barrera. La canela — cinamaldeído — regula la glucosa postprandial y reduce los picos de insulina, estabilizando el ánimo.',
        alimento_estrella: 'Membrillo + pectina'
      },
      lectura: {
        titulo: 'Audio — Día 9: El arte de volver',
        texto: 'Nadie mantiene un hábito perfectamente. Nadie. Los estudios de seguimiento a largo plazo muestran que las personas que mantienen sus hábitos años después no son las que nunca fallan — son las que vuelven más rápido. El arte no está en no caer. Está en aprender a levantarse en 24 horas o menos. Hoy defines tu versión mínima. Esa es tu red de seguridad para todos los días difíciles que vienen.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál es mi versión mínima del hábito para hoy si el día se complica?',
        pregunta_tarde:  '¿He necesitado usar la versión mínima hoy? ¿Cómo me ha sentado?',
        pregunta_noche:  '¿Qué he aprendido hoy sobre mi relación con la perfección y los hábitos?'
      },
      texto_notificacion: '✨ Día 9 — Define tu versión mínima. El hábito imperfecto que pasa gana al perfecto que no ocurre.'
    }
  },

  {
    day_number: 10,
    title: 'Señales más fuertes — Té de reishi y avena fermentada',
    tip: 'La señal que dispara el hábito es más importante que el hábito mismo',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Cue salience — fortalecer la señal que dispara el hábito',
      idea_clara: {
        titulo: 'El bucle del hábito: señal → rutina → recompensa',
        texto: 'Charles Duhigg popularizó el modelo del bucle del hábito. La señal (cue) es el elemento más importante — es la llave que abre el comportamiento automático. Una señal débil produce un hábito inconsistente. Una señal fuerte, específica y cargada de significado produce un hábito robusto. Hoy trabajas en fortalecer tu señal: hacerla más visual, más sensorial, más inequívoca.',
        concepto_clave: 'Habit loop — señal como llave del comportamiento automático'
      },
      cambio_del_dia: {
        titulo: 'Crea una señal visual inequívoca',
        instruccion: 'Elige un objeto que solo aparezca cuando es hora de tu hábito: un vaso especial, una taza que sacas solo para esto, una servilleta de color. Que no tenga otro uso. Que su aparición signifique solo una cosa: es la hora.',
        por_que: 'Los objetos dedicados a un solo hábito crean señales visuales más potentes que las señales de tiempo o lugar, porque son más específicas y difíciles de ignorar.',
        duracion: '30 segundos de elegir tu objeto señal'
      },
      receta: {
        titulo: 'Té de hongos reishi con leche de avena fermentada',
        descripcion: 'Umami, terroso, adaptógeno. Para los que buscan calma sin sedación.',
        ingredientes: [
          '400ml de agua caliente (no hirviendo, 80°C)',
          '1 cdta de polvo de reishi (extracto de doble extracción)',
          '150ml de leche de avena (fermentada si encuentras)',
          '1 cdta de miel cruda',
          'Pizca de canela',
          'Opcional: pizca de pimienta de Jamaica'
        ],
        pasos: [
          'Disuelve el reishi en agua caliente. Remueve bien — es denso.',
          'Calienta la leche de avena sin hervir.',
          'Mezcla ambas líquidos. Añade miel y canela.',
          'Sirve en tu taza especial — el objeto señal.',
          'Cada vez que veas esa taza, tu cuerpo ya sabrá qué viene.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'Los beta-glucanos del reishi (Ganoderma lucidum) son inmunomoduladores documentados — activan los macrófagos M2, que reducen la inflamación sistémica. El ácido ganoderético tiene efecto adaptógeno sobre el eje HPA, reduciendo la respuesta de estrés sin sedación. La leche de avena fermentada aporta beta-glucanos adicionales que son prebióticos selectivos para bifidobacterias. La combinación crea una sinergia prebiótico-adaptógena única.',
        alimento_estrella: 'Reishi + beta-glucanos'
      },
      lectura: {
        titulo: 'Audio — Día 10: La llave que abre el hábito',
        texto: 'Piensa en algo que haces de forma completamente automática — cepillarte los dientes, ponerte el cinturón, revisar el móvil al despertar. No requiere decisión. No requiere motivación. Simplemente pasa. Eso es lo que buscamos para tu hábito: que la señal sea tan clara que la rutina ocurra sola. Hoy añades un objeto. Mañana ese objeto ya tendrá significado.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál será mi señal visual de hoy? ¿Está en su sitio?',
        pregunta_tarde:  '¿He notado la señal con suficiente tiempo para actuar? ¿O la he ignorado?',
        pregunta_noche:  '¿Qué otras señales automáticas tengo en mi vida que podría usar o fortalecer?'
      },
      texto_notificacion: '✨ Día 10 — Elige tu objeto señal. Que solo aparezca cuando es hora.'
    }
  },

  {
    day_number: 11,
    title: 'Más allá del blanco y negro — Kéfir de cabra con pera',
    tip: 'Un día malo no borra 10 días buenos',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Cognitive distortions — eliminar el pensamiento todo-o-nada',
      idea_clara: {
        titulo: 'El pensamiento todo-o-nada destruye los hábitos',
        texto: 'El pensamiento binario — "o lo hago perfecto o no vale" — es la principal causa de abandono de hábitos. Un estudio de la Universidad de Exeter (2018) mostró que las personas con pensamiento flexible mantenían sus hábitos un 45% más tras un desliz. El antídoto no es más motivación — es aprender a ver el continuo entre cero y perfecto. Un 30% de hábito vale más que 0%.',
        concepto_clave: 'Cognitive flexibility — el espectro frente al binario'
      },
      cambio_del_dia: {
        titulo: 'Califica en porcentaje, no en éxito/fracaso',
        instruccion: 'Esta noche, en lugar de "¿he hecho el hábito sí/no?", escribe un porcentaje: "Hoy he hecho mi hábito al 60%". Sin juicio. Solo observación. Practicalo durante una semana.',
        por_que: 'La calificación porcentual activa el pensamiento flexible y reduce la respuesta de amenaza ante los deslices. El cerebro puede optimizar un porcentaje — no puede optimizar un fracaso binario.',
        duracion: '10 segundos de calificación'
      },
      receta: {
        titulo: 'Kéfir de cabra con pera madura y nuez tostada',
        descripcion: 'Sofisticado, otoñal, neuroprotector. El omega-3 para el cerebro.',
        ingredientes: [
          '200ml de kéfir de cabra',
          '1 pera madura (Williams o Conferencia)',
          '4 mitades de nuez tostada',
          '1 cdta de miel de castaño',
          'Pizca de canela y nuez moscada'
        ],
        pasos: [
          'Pela y trocea la pera en cubos pequeños.',
          'Tuésta las nueces en seco 2-3 minutos en sartén. Deja enfriar.',
          'Vierte el kéfir en el vaso. Añade la miel y las especias.',
          'Coloca los cubos de pera y las nueces encima.',
          'No mezcles — come con cuchara o bebe alternando.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El kéfir de cabra tiene proteínas de mayor biodisponibilidad que el de vaca y menos caseína A1, que puede generar inflamación intestinal en personas sensibles. La pera aporta fibra soluble e insoluble en proporción 1:2, con alto contenido en sorbita — prebiótico selectivo para Lactobacillus rhamnosus. Las nueces contienen el mayor contenido de omega-3 ALA entre los frutos secos, y polifenoles que reducen el estrés oxidativo neuronal.',
        alimento_estrella: 'Nuez + omega-3 ALA'
      },
      lectura: {
        titulo: 'Audio — Día 11: El gris entre el blanco y el negro',
        texto: 'Hay un momento en el cambio de hábitos que es especialmente peligroso: cuando has fallado una vez y tu mente dice "ya da igual, lo estropeé todo." Es mentira. Una comida no deshace un mes de alimentación consciente. Un día sin hábito no borra diez días con él. El cerebro aprende por patrones, no por días perfectos. Hoy practicas ver el gris: ¿cuánto has hecho? ¿En qué porcentaje has estado presente?'
      },
      registro_diario: {
        pregunta_manana: '¿Puedo comprometer un 50% de mi hábito hoy — aunque no tenga tiempo para el 100%?',
        pregunta_tarde:  '¿He tenido pensamientos todo-o-nada hoy sobre algún aspecto de mi vida?',
        pregunta_noche:  '¿Qué porcentaje de mi hábito he realizado hoy? ¿Qué valoro de ello?'
      },
      texto_notificacion: '✨ Día 11 — Un 50% de hábito hoy vale más que el 0% de esperar al día perfecto.'
    }
  },

  {
    day_number: 12,
    title: 'Diseña el disparador — Jugo verde fermentado',
    tip: 'El disparador ideal ocurre antes de que necesites motivación',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Trigger design — diseñar el disparador óptimo para cada contexto',
      idea_clara: {
        titulo: 'Los cinco tipos de disparadores de hábito',
        texto: 'Charles Duhigg identificó cinco tipos de señales que disparan hábitos: tiempo, lugar, estado emocional, otras personas, y acción precedente. Los hábitos más robustos tienen disparadores múltiples. Los más frágiles dependen solo del tiempo ("a las 8 de la mañana") y fallan cuando el horario cambia. Hoy añades un segundo disparador a tu hábito.',
        concepto_clave: 'Multi-cue habits — hábitos anclados a múltiples señales'
      },
      cambio_del_dia: {
        titulo: 'Añade un segundo disparador',
        instruccion: 'Tu hábito ya tiene una señal. Hoy añade una segunda de diferente tipo: si tienes tiempo, añade lugar (siempre en la misma silla). Si tienes lugar, añade acción precedente (siempre después de ___). Escribe el nuevo disparador.',
        por_que: 'Los hábitos con dos disparadores tienen un 73% más de resistencia a la interrupción que los que tienen uno solo, según estudios de adherencia a largo plazo.',
        duracion: '1 minuto de diseño'
      },
      receta: {
        titulo: 'Jugo verde fermentado — pepino, apio, manzana verde y kombucha',
        descripcion: 'Limpio, clorofílico, GABA-érgico. Verde como señal de renovación.',
        ingredientes: [
          '1/2 pepino mediano',
          '2 tallos de apio',
          '1/2 manzana verde',
          '200ml de kombucha natural',
          'Zumo de 1/2 limón',
          'Pizca de sal marina'
        ],
        pasos: [
          'Tritura pepino, apio y manzana con un poco de agua.',
          'Cuela con malla fina o colador.',
          'Mezcla con la kombucha y el zumo de limón.',
          'Añade sal marina. Bebe inmediatamente.',
          'Anota tu segundo disparador mientras lo preparas.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El sílice del pepino es cofactor de la síntesis de colágeno y tiene efecto antiinflamatorio articular. Las cucurbitacinas inhiben la COX-2, la enzima del dolor inflamatorio. La apigenina del apio tiene efecto GABA-érgico documentado — reduce la ansiedad sin sedación. La pectina de la manzana verde es prebiótico selectivo para Bifidobacterium longum. La kombucha como base añade la fermentación que multiplica la biodisponibilidad de todos los compuestos.',
        alimento_estrella: 'Apio + apigenina GABA-érgica'
      },
      lectura: {
        titulo: 'Audio — Día 12: Diseña tu entorno para que hable',
        texto: 'Los hábitos que dependen de tu memoria para ocurrir son frágiles. Los que están anclados al entorno son robustos. Cuando entras a la cocina y tu vaso especial está en la encimera, no necesitas recordar nada. El entorno habla. Hoy añades otra voz a ese coro: un segundo disparador que hace casi imposible que el hábito se pierda en el ruido del día.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál es mi segundo disparador? ¿Está activado para hoy?',
        pregunta_tarde:  '¿He notado algún momento donde el entorno me ha "empujado" hacia mi hábito?',
        pregunta_noche:  '¿Cuántos disparadores tiene ya mi hábito? ¿Es suficientemente robusto?'
      },
      texto_notificacion: '✨ Día 12 — Añade un segundo disparador. El hábito que tiene dos señales casi no puede fallar.'
    }
  },

  {
    day_number: 13,
    title: 'Refuerzo inmediato — Lassi de mango con cúrcuma',
    tip: 'La recompensa tiene que llegar en los próximos 90 segundos',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: null,
      objetivo_psicologico: 'Immediate reinforcement — la ventana de 90 segundos para consolidar el hábito',
      idea_clara: {
        titulo: 'La ventana de 90 segundos que consolida o destruye hábitos',
        texto: 'El cerebro consolida el aprendizaje de hábitos dentro de los 90 segundos posteriores a la acción. Si en ese tiempo ocurre algo placentero — físico o cognitivo — la ruta neural se refuerza. Si nada ocurre o algo negativo, la señal se debilita. Esto explica por qué los hábitos con recompensa inmediata (notificación de redes, sabor del cigarrillo) son tan fuertes y los hábitos saludables (cuyos beneficios llegan semanas después) son tan difíciles.',
        concepto_clave: 'Temporal discounting — el cerebro desvaloriza recompensas futuras'
      },
      cambio_del_dia: {
        titulo: 'Tu recompensa inmediata deliberada',
        instruccion: 'Después de completar tu hábito hoy, haz inmediatamente algo que disfrutes: escucha 30 segundos de tu canción favorita, siéntate al sol un momento, o simplemente sonríe. Que ocurra en los primeros 90 segundos tras el hábito.',
        por_que: 'La recompensa inmediata artificial suple la ausencia de recompensa natural en los hábitos saludables. En 3-4 semanas, el placer de la bebida se convierte en recompensa suficiente.',
        duracion: '90 segundos de recompensa deliberada'
      },
      receta: {
        titulo: 'Lassi tropical de mango, kéfir y cúrcuma dorada',
        descripcion: 'Cremoso, dorado, ayurvédico. Un clásico revisitado con probióticos.',
        ingredientes: [
          '150g de mango maduro',
          '200ml de kéfir natural',
          '1/2 cdta de cúrcuma en polvo',
          'Pizca de pimienta negra',
          '1 cdta de azúcar de coco o miel',
          '3-4 hojas de menta fresca',
          'Hielo'
        ],
        pasos: [
          'Tritura el mango con el kéfir, la cúrcuma y la pimienta.',
          'Añade el azúcar de coco. Tritura hasta cremoso.',
          'Sirve sobre hielo con hojas de menta.',
          'Bebe el primer sorbo. Cierra los ojos 5 segundos.',
          'Eso es tu recompensa inmediata. Grabada.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El lassi es una de las preparaciones probióticas más antiguas documentadas, con más de 5000 años en medicina ayurvédica. La combinación cúrcuma + pimienta negra aumenta la biodisponibilidad de la curcumina en un 2000% — el efecto anti-inflamatorio del kéfir ordinario multiplicado. El mango maduro aporta enzimas digestivas (amilasa, lipasa) que mejoran la absorción de todos los nutrientes. La menta potencia la motilidad intestinal.',
        alimento_estrella: 'Cúrcuma + pimienta negra (sinergia curcumina)'
      },
      lectura: {
        titulo: 'Audio — Día 13: La recompensa que no puede esperar',
        texto: 'El cerebro tiene una dificultad real con el futuro: lo desvaloriza. Un beneficio que llega en 3 semanas vale, neurológicamente, mucho menos que uno que llega en 3 segundos. Por eso el cigarrillo gana a los pulmones sanos — la recompensa es inmediata. Pero puedes usar esa misma mecánica a tu favor: una recompensa pequeña e inmediata después de tu hábito enseña al cerebro exactamente qué camino quieres que tome.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál será mi recompensa inmediata de hoy, en los primeros 90 segundos?',
        pregunta_tarde:  '¿He sentido el sabor de la bebida como recompensa en sí mismo? ¿O necesito añadir algo más?',
        pregunta_noche:  '¿Noto que el placer de la bebida ya empieza a sentirse como recompensa automática?'
      },
      texto_notificacion: '✨ Día 13 — Después del hábito: 90 segundos de algo que te guste. Sin excusas.'
    }
  },

  {
    day_number: 14,
    title: '🏆 HITO — Semana 2 completada',
    tip: 'La resistencia ya cayó. El hábito empieza a ocurrir solo.',
    recipe_data: {
      fase: 'reforzar',
      semana: 2,
      hito: {
        titulo: '14 días. El hábito ya no necesita esfuerzo consciente.',
        descripcion: 'La semana 2 era la más difícil — la que deshace la mayoría de los intentos de cambio. La has completado. Esta semana has trabajado con obstáculos reales, flexibilidad, señales múltiples, pensamiento no binario y refuerzo inmediato. La resistencia que sentías en el día 8 ya no está. No porque seas más disciplinado — sino porque la ruta neural es más eficiente.',
        reflexion: 'Compara cómo te sentías el día 1 con hoy. ¿Qué ha cambiado? ¿El hábito ya empieza a "ocurrir solo" antes de que lo recuerdes?',
        estadisticas: {
          mecanismos_activados: [
            'WOOP + implementation intentions — obstáculos planificados',
            'Never miss twice — resiliencia ante el desliz',
            'Cue salience — señales múltiples activas',
            'Cognitive flexibility — fuera del pensamiento binario',
            'Multi-cue design — disparadores redundantes',
            'Immediate reinforcement — ventana de 90 segundos activa'
          ]
        }
      },
      idea_clara: {
        titulo: 'Lo que ocurre en el cerebro en el día 14',
        texto: 'Los estudios de neuroimagen muestran que alrededor del día 14, el hábito empieza a trasladarse del córtex prefrontal (decisión consciente) a los ganglios basales (comportamiento automático). No se completa en este día — el proceso dura hasta el día 66 en promedio — pero el inicio del traspaso es aquí. Si sientes que el impulso de tomar tu bebida llega antes de que lo recuerdes, eso es exactamente ese traspaso.',
        concepto_clave: 'Habit transfer — de prefrontal a ganglios basales'
      },
      cambio_del_dia: {
        titulo: 'Celebra con todos los sentidos',
        instruccion: 'Hoy, cuando termines tu gran elixir, ponles música de fondo, siéntate en tu sitio favorito y dedica 3 minutos a no hacer nada más que saborearlo. Sin móvil. Sin pantalla. Solo el sabor.',
        por_que: 'La celebración multisensorial (gusto + música + contexto + quietud) crea un recuerdo hedónico más potente que cualquiera de los sentidos por separado.',
        duracion: '3 minutos de celebración multisensorial'
      },
      receta: {
        titulo: 'Gran elixir del mediodía — kombucha de hibisco, fresas y albahaca',
        descripcion: 'Sofisticado, festivo, polifenólico. Tu segundo gran ancla hedónica.',
        ingredientes: [
          '200ml de kombucha de hibisco (o kombucha + 1 cda de hibisco seco infusionado)',
          '80g de fresas maduras',
          '4-5 hojas de albahaca fresca',
          '1 cdta de miel cruda',
          'Zumo de 1/4 limón',
          'Hielo y flores comestibles para decorar (opcional)'
        ],
        pasos: [
          'Tritura las fresas con la miel y el limón.',
          'Machaca la albahaca suavemente en el vaso.',
          'Añade el puré de fresas.',
          'Vierte la kombucha lentamente.',
          'Decora y siéntate en tu sitio favorito. Ponle música.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La kombuchaa de hibisco combina los polifenoles de la fermentación con las antocianinas del hibisco — una doble carga de antioxidantes que protege el endotelio vascular. Las fresas aportan vitamina C (el mayor contenido entre las frutas del bosque) y ácido elágico, precursor de urolitinas. La albahaca contiene eugenol (efecto analgésico) y linalool (ansiolítico). La combinación crea un perfil fitoquímico de alta complejidad.',
        alimento_estrella: 'Kombucha de hibisco + fresas'
      },
      lectura: {
        titulo: 'Audio — Día 14: La resistencia ya no está',
        texto: 'Hay un momento en el cambio de hábitos que nadie te avisa que llegará: el día en que ya no tienes que recordarte hacerlo. Simplemente lo haces. Puede que ya lo hayas sentido esta semana — que el impulso de tomar tu bebida llegara antes del recordatorio. Eso es la automaticidad emergiendo. No es magia. Es neurociencia del comportamiento. Y ocurre porque tú pusiste los ladrillos, uno cada día, durante 14 días.'
      },
      registro_diario: {
        pregunta_manana: '¿He notado esta semana que el hábito ha llegado "solo" antes de que lo recordara?',
        pregunta_tarde:  '¿Qué ha sido más sorprendente de esta semana — qué ha sido más fácil de lo esperado?',
        pregunta_noche:  '¿Qué llevo a la semana 3 — la semana de la integración?'
      },
      texto_notificacion: '🏆 Día 14 — Segunda semana completada. Tu gran elixir de celebración te espera.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // FASE 3 — INTEGRAR (días 15–21)
  // ═══════════════════════════════════════════════════════════════

  {
    day_number: 15,
    title: 'Automaticidad — Tónica de kéfir con limón Meyer',
    tip: 'Cuando el hábito ocurre sin pensar, la semana 3 comienza',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Automaticity — reconocer y consolidar el hábito automático emergente',
      idea_clara: {
        titulo: 'La automaticidad no es falta de conciencia — es eficiencia neural',
        texto: 'Cuando un hábito se vuelve automático, no lo haces sin pensar — lo haces con menos energía cognitiva. El córtex prefrontal puede ocuparse de otras cosas mientras los ganglios basales ejecutan el comportamiento. Phillippa Lally (UCL) encontró que el tiempo promedio para la automaticidad es 66 días, con rango de 18 a 254. Estás en el día 15 — estás en el extremo temprano, pero algunos hábitos sencillos ya pueden estar ahí.',
        concepto_clave: 'Automaticity threshold — 66 días promedio, pero variable'
      },
      cambio_del_dia: {
        titulo: 'Observa sin intervenir',
        instruccion: 'Hoy, cuando hagas tu hábito, intenta observarte a ti mismo hacerlo sin guiarlo activamente. ¿Llega el impulso solo? ¿Tu cuerpo ya sabe qué hacer? Escribe lo que observes.',
        por_que: 'La observación metacognitiva del hábito emergente refuerza la identidad del "yo que tiene este hábito" sin añadir esfuerzo.',
        duracion: '2 minutos de observación metacognitiva'
      },
      receta: {
        titulo: 'Tónica de kéfir con limón Meyer y miel de manuka',
        descripcion: 'Elegante, sobrio, antibacterial. Para los días que quieres algo refinado.',
        ingredientes: [
          '150ml de agua de kéfir',
          '100ml de agua tónica natural',
          'Zumo de 1/2 limón Meyer (o limón normal)',
          '1 cdta de miel de manuka (MGO 100+)',
          'Rodaja de limón y hielo',
          'Opcional: ramita de romero'
        ],
        pasos: [
          'Mezcla la miel de manuka con el zumo de limón hasta disolver.',
          'Añade el agua de kéfir fría.',
          'Vierte la tónica lentamente para conservar las burbujas.',
          'Añade el hielo y la rodaja de limón.',
          'Sujeta el vaso, mira la bebida, observa cómo te sientes al hacerlo.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El limón Meyer tiene menor acidez y mayor contenido en limoneno que el limón convencional. El limoneno es un terpeno con actividad ansiolítica en el sistema limbico — modula la actividad serotoninérgica y dopaminérgica. La miel de manuka con MGO (metilglioxal) tiene actividad antibacterial documentada contra H. pylori, la bacteria asociada a úlceras y depresión leve. El agua de kéfir aporta la base probiótica.',
        alimento_estrella: 'Miel de manuka + MGO'
      },
      lectura: {
        titulo: 'Audio — Día 15: Observarte sin guiarte',
        texto: 'Hay un momento fascinante en el desarrollo de hábitos: cuando te sorprendes a ti mismo haciéndolo. Sin haberlo recordado. Sin haberte motivado. Solo — lo estás haciendo. Si eso ha pasado alguna vez esta semana con tu bebida, aunque sea una vez, ya tienes la evidencia. El hábito vive en ti. Esta semana lo dejas crecer.'
      },
      registro_diario: {
        pregunta_manana: '¿Ha ocurrido algún momento esta semana donde el hábito ha llegado solo, sin recordatorio?',
        pregunta_tarde:  '¿Me he observado haciendo el hábito de forma diferente — más fluida, menos forzada?',
        pregunta_noche:  '¿Qué siento diferente en mi cuerpo después de 15 días de esta bebida diaria?'
      },
      texto_notificacion: '✨ Día 15 — Observa cómo el hábito llega solo. Semana 3: integración.'
    }
  },

  {
    day_number: 16,
    title: 'El yo futuro — Batido de plátano, kéfir y tahini',
    tip: 'Conéctate con quien serás después de 21 días',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Future self continuity — conectar con el yo futuro como fuente de motivación',
      idea_clara: {
        titulo: 'El yo futuro como brújula',
        texto: 'La investigación de Hal Hershfield (UCLA) muestra que las personas con alta "continuidad del yo futuro" — que se sienten conectadas a quien serán en 5, 10 o 20 años — toman mejores decisiones hoy. Y lo más sorprendente: puedes entrenar esa conexión. Visualizar al yo futuro activa las mismas regiones cerebrales que pensar en otra persona querida — crea empatía hacia ti mismo en el tiempo.',
        concepto_clave: 'Future self continuity — empatía temporal como motor de cambio'
      },
      cambio_del_dia: {
        titulo: 'Una carta de 2 minutos a tu yo de dentro de 6 meses',
        instruccion: 'Escribe: "Querido yo de octubre de 2026: después de haber completado el Reset Hedónico, ahora ___". Dos frases. No necesitas escribir un ensayo.',
        por_que: 'Escribir al yo futuro activa la planificación prosocial — el mismo circuito que usamos para cuidar a alguien que queremos. Reduce el descuento temporal y aumenta la consistencia de la conducta.',
        duracion: '2 minutos de escritura'
      },
      receta: {
        titulo: 'Batido cremoso de plátano maduro, kéfir y tahini',
        descripcion: 'Denso, nutritivo, serotoninérgico. Para cuando quieres algo que llene.',
        ingredientes: [
          '1 plátano muy maduro (manchas negras)',
          '200ml de kéfir natural',
          '1 cda de tahini (pasta de sésamo)',
          '1 cdta de miel cruda',
          'Pizca de canela y sal marina',
          'Opcional: 1 cda de semillas de cáñamo'
        ],
        pasos: [
          'Tritura el plátano con el kéfir hasta obtener base cremosa.',
          'Añade el tahini, la miel, la canela y la sal.',
          'Tritura de nuevo — el tahini crea una textura sedosa única.',
          'Sirve y espolvorea semillas de cáñamo.',
          'Escribe tu carta mientras lo preparas o después.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El plátano muy maduro (manchas negras) tiene el índice glucémico más alto pero también el mayor contenido de triptófano libre, disponible para cruzar la barrera hematoencefálica. El kéfir proporciona el entorno intestinal óptimo para convertir ese triptófano en serotonina. El tahini aporta calcio (cofactor de la transmisión serotoninérgica) y zinc (cofactor de la síntesis de dopamina). El potasio del plátano regula el equilibrio electrolítico neuronal.',
        alimento_estrella: 'Plátano maduro + triptófano libre'
      },
      lectura: {
        titulo: 'Audio — Día 16: Una carta a quien serás',
        texto: 'Existe una persona que ya ha completado este reto. Que ya tiene el hábito instalado. Que ya sabe qué se siente cuando el placer guía el cambio en lugar de la culpa. Esa persona eres tú — pero en unos meses. Hoy le escribes. No porque sea un ejercicio de motivación. Sino porque conectar con tu yo futuro activa partes del cerebro que el yo presente no puede activar solo.'
      },
      registro_diario: {
        pregunta_manana: '¿Cómo quiero sentirme dentro de 6 meses respecto a mis hábitos?',
        pregunta_tarde:  '¿He tomado hoy alguna decisión pensando en mi yo futuro?',
        pregunta_noche:  '¿Qué le diría a mi yo de hace 16 días si pudiera volver atrás?'
      },
      texto_notificacion: '✨ Día 16 — Escribe dos frases a tu yo de dentro de 6 meses. Mientras preparas tu batido.'
    }
  },

  {
    day_number: 17,
    title: 'Cambio de identidad — Kombucha de cereza y cacao',
    tip: 'Ya no "estás intentando" — ya eres alguien que hace esto',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Identity consolidation — el hábito como prueba de quien ya eres',
      idea_clara: {
        titulo: 'De "estoy intentando" a "soy alguien que"',
        texto: 'Hay un cambio sutil pero profundo que ocurre en los hábitos cuando alcanzan la identidad: dejas de decir "estoy intentando beber mejor" y empiezas a decir "soy alguien que cuida su microbioma". No es semántica — es una reorganización cognitiva real. Las personas que han hecho ese cambio tienen un 67% más de probabilidad de mantener el hábito ante adversidades que quienes todavía se ven como "en proceso".',
        concepto_clave: 'Identity statement — del proceso al ser'
      },
      cambio_del_dia: {
        titulo: 'Actualiza tu declaración de identidad',
        instruccion: 'Vuelve a tu frase del día 4: "Soy alguien que cuida su eje intestino-cerebro." Ahora añádele evidencia real: "...y lo he demostrado 17 veces." Escríbela en algún lugar que veas cada día.',
        por_que: 'La acumulación de evidencia real transforma la afirmación aspiracional en declaración de identidad. No es autosugestión — es reconocimiento de un patrón real.',
        duracion: '1 minuto de escritura visible'
      },
      receta: {
        titulo: 'Kombucha de cereza y cacao oscuro',
        descripcion: 'Oscura, sofisticada, noctívaga. Para los que quieren sabor sin dulzor excesivo.',
        ingredientes: [
          '250ml de kombucha natural',
          '80g de cerezas (frescas, congeladas o en compota sin azúcar)',
          '1 cdta de cacao en polvo sin azúcar',
          '1/2 cdta de extracto de vainilla',
          '1 cdta de miel o sirope de agave',
          'Hielo'
        ],
        pasos: [
          'Tritura las cerezas (sin hueso) con el cacao y la miel.',
          'Añade la vainilla. Mezcla hasta pasta suave.',
          'Vierte la kombucha sobre la pasta. Remueve mínimamente.',
          'Sirve sobre hielo.',
          'Lee tu declaración de identidad antes de beber.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'Las cerezas contienen melatonina natural y antocianinas — la única fruta con ambos compuestos en concentración significativa. Un estudio de 2021 (Journal of Functional Foods) mostró que el consumo de jugo de cereza durante 7 días mejora la calidad del sueño medida por polisomnografía. La combinación con cacao añade magnesio (relajante muscular y nervioso) y teobromina (vasodilatador cerebral suave). El ácido acético de la kombucha mejora la absorción de los minerales.',
        alimento_estrella: 'Cereza + melatonina natural'
      },
      lectura: {
        titulo: 'Audio — Día 17: Ya no estás intentando',
        texto: 'Fíjate en cómo te hablas a ti mismo sobre este hábito. ¿Dices "estoy intentando"? ¿O ya dices "lo hago"? Esa diferencia de una sola palabra es el marcador del cambio de identidad. No necesitas sentirlo completamente todavía. Pero puedes empezar a usar el lenguaje que describe a la persona que ya estás siendo. El lenguaje precede a la identidad — y a veces la crea.'
      },
      registro_diario: {
        pregunta_manana: '¿Cómo me describo a mí mismo respecto a este hábito — en proceso o ya instalado?',
        pregunta_tarde:  '¿He hablado hoy con alguien sobre lo que estoy haciendo? ¿Cómo lo he descrito?',
        pregunta_noche:  '¿Qué evidencia concreta tengo de que ya soy "alguien que cuida su microbioma"?'
      },
      texto_notificacion: '✨ Día 17 — Ya no "estás intentando". Ya lo eres. Actualiza tu frase con evidencia real.'
    }
  },

  {
    day_number: 18,
    title: 'Resiliencia ante el estrés — Agua de kéfir con naranja sanguina',
    tip: 'Los días de estrés alto son el examen — y también el mejor entrenamiento',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Stress resilience — mantener hábitos en condiciones de estrés elevado',
      idea_clara: {
        titulo: 'Por qué el estrés ataca primero a los hábitos',
        texto: 'El estrés crónico reduce el volumen del córtex prefrontal (sede de la planificación y el autocontrol) y aumenta la actividad de la amígdala (respuesta de amenaza). Esto explica por qué bajo estrés los hábitos nuevos son los primeros en caer: requieren más corteza prefrontal de la que tienes disponible. La solución no es más fuerza de voluntad — es reducir la demanda cognitiva del hábito al mínimo posible.',
        concepto_clave: 'Ego depletion bajo estrés — conservar recursos cognitivos'
      },
      cambio_del_dia: {
        titulo: 'La versión de 60 segundos para días de estrés máximo',
        instruccion: 'Crea ahora tu protocolo de estrés: "Si estoy en un día de nivel 8-10 de estrés, mi hábito es: ___" (algo que puedas hacer en 60 segundos o menos). Escríbelo.',
        por_que: 'Tener el protocolo de estrés definido en avance elimina la decisión en el momento de mayor carga cognitiva. La decisión tomada en frío es siempre mejor que la tomada bajo estrés.',
        duracion: '1 minuto de planificación preventiva'
      },
      receta: {
        titulo: 'Agua de kéfir con naranja sanguina y cardamomo',
        descripcion: 'Rojo-rosado, cítrico, antiinflamatorio. El color de la vitalidad.',
        ingredientes: [
          '250ml de agua de kéfir',
          'Zumo de 1 naranja sanguina (o naranja normal)',
          '1/4 cdta de cardamomo molido',
          '1 cdta de miel cruda',
          'Rodaja de naranja y hielo'
        ],
        pasos: [
          'Exprime la naranja directamente en el vaso.',
          'Añade el cardamomo y la miel. Mezcla.',
          'Vierte el agua de kéfir. No mezcles completamente.',
          'Añade hielo y rodaja de naranja.',
          'Este es tu protocolo de día de estrés — listo en 2 minutos.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La naranja sanguina (Moro, Tarocco) contiene antocianinas además de vitamina C — la única variedad de cítrico con esta característica. Las antocianinas ciánidina-3-glucósido tienen efecto antiinflamatorio y protegen el endotelio de los vasos cerebrales del daño por estrés oxidativo. El cardamomo — rico en 1,8-cineol — es uno de los pocos compuestos que atraviesa la barrera hematoencefálica con facilidad y actúa como adaptógeno cognitivo: mejora el flujo sanguíneo cerebral bajo estrés.',
        alimento_estrella: 'Naranja sanguina + antocianinas únicas'
      },
      lectura: {
        titulo: 'Audio — Día 18: Entrenar para el día difícil',
        texto: 'Hay algo que los atletas saben que el resto de personas olvida: el entrenamiento no sirve para los días buenos. Sirve para los días malos. Cuando el partido se complica, cuando el cuerpo no responde, cuando todo sale mal — ahí está el entrenamiento. Tus hábitos son iguales. Los mantienes cuando es fácil, sí. Pero son los días difíciles donde realmente se consolidan. Hoy defines tu protocolo para esos días.'
      },
      registro_diario: {
        pregunta_manana: '¿Cuál es mi protocolo para hoy si el nivel de estrés sube a 8 o más?',
        pregunta_tarde:  '¿Ha habido algún momento hoy donde el estrés ha amenazado mi hábito? ¿Cómo lo he gestionado?',
        pregunta_noche:  '¿Noto que el hábito actúa como regulador — que la bebida reduce el estrés en sí misma?'
      },
      texto_notificacion: '✨ Día 18 — Define tu protocolo de estrés máximo. 60 segundos es suficiente.'
    }
  },

  {
    day_number: 19,
    title: 'Ancla sensorial — Smoothie bowl de kéfir y frutos rojos',
    tip: 'Los sentidos recuerdan lo que la mente olvida',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Sensory anchoring — usar el sistema sensorial para consolidar la memoria del hábito',
      idea_clara: {
        titulo: 'La memoria sensorial como guardiana del hábito',
        texto: 'El sistema olfativo es el único sentido con conexión directa al hipocampo (memoria) y la amígdala (emociones) sin pasar por el tálamo. Esto explica la magdalena de Proust: un olor puede traer un recuerdo con toda su carga emocional en milisegundos. Los hábitos anclados a experiencias sensoriales intensas tienen memorias de recuperación más rápidas y resistentes al olvido.',
        concepto_clave: 'Olfactory memory — acceso directo a la memoria emocional'
      },
      cambio_del_dia: {
        titulo: 'Crea una experiencia sensorial completa',
        instruccion: 'Hoy, cuando prepares tu bowl, añade un elemento nuevo que involucre un sentido que no sueles usar: un aceite esencial cerca (no en la bebida), música específica, una vela. Que haya un input sensorial que nunca hayas asociado a este hábito.',
        por_que: 'Añadir una nueva señal sensorial crea una memoria episódica del hábito — más duradera y recuperable que la memoria semántica (saber que hay que hacerlo).',
        duracion: '2 minutos de preparación sensorial'
      },
      receta: {
        titulo: 'Smoothie bowl de kéfir con frutos rojos y cacao',
        descripcion: 'Denso, colorido, masticable. Para cuando quieres algo más que beber.',
        ingredientes: [
          '150ml de kéfir espeso (o kéfir colado)',
          '100g de frutos rojos congelados (mezcla)',
          '1 plátano congelado en trozos',
          '1 cdta de cacao en polvo',
          'Para decorar: arándanos frescos, coco rallado, cacao nibs, miel'
        ],
        pasos: [
          'Tritura el kéfir con los frutos rojos y el plátano congelado — dense, no líquido.',
          'Añade el cacao. Tritura 10 segundos más.',
          'Vierte en bowl.',
          'Decora con cuidado — el visual importa.',
          'Antes de comer: huele profundamente el bowl. Ese aroma es ahora parte del hábito.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'El smoothie bowl de kéfir combinado con frutos rojos crea lo que los investigadores llaman una "matriz alimentaria compleja" — los polifenoles de los frutos rojos se absorben mejor en presencia de la matriz lipídica del kéfir que en zumo solo. El plátano congelado actúa como emulsificante natural, creando la textura densa. Los cacao nibs aportan magnesio sin el azúcar del chocolate procesado. La mezcla de colores (rojo, morado, negro) indica diversidad polifenólica.',
        alimento_estrella: 'Mezcla de frutos rojos + diversidad polifenólica'
      },
      lectura: {
        titulo: 'Audio — Día 19: Lo que el olfato recuerda',
        texto: 'Existe una razón por la que las personas que asocian un hábito a un aroma específico lo mantienen más fácilmente. El olfato es el único sentido con acceso directo a la memoria emocional. Cuando hueles algo que has asociado al bienestar, el cerebro ya empieza a preparar el cuerpo para ese estado. Tu bowl de hoy huele diferente a todos los anteriores. Ese olor ya es parte de tu hábito.'
      },
      registro_diario: {
        pregunta_manana: '¿Qué elemento sensorial nuevo añadiré hoy a mi hábito?',
        pregunta_tarde:  '¿He notado que algún aroma o sabor me recuerda automáticamente a este programa?',
        pregunta_noche:  '¿Cuál es el recuerdo sensorial más fuerte de estas 3 semanas?'
      },
      texto_notificacion: '✨ Día 19 — Añade un nuevo sentido al hábito hoy. El olfato recuerda lo que la mente olvida.'
    }
  },

  {
    day_number: 20,
    title: 'Planificación post-reto — Elixir nocturno de ashwagandha',
    tip: 'El hábito que no tiene plan para después del reto, muere después del reto',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: null,
      objetivo_psicologico: 'Post-challenge planning — asegurar la continuidad del hábito más allá del reto',
      idea_clara: {
        titulo: 'El efecto "fin del reto"',
        texto: 'Los retos y programas estructurados tienen un punto de vulnerabilidad conocido: el día siguiente al final. La estructura externa desaparece y el hábito queda solo ante el mundo real. Los estudios de seguimiento muestran que el 60% de los hábitos adquiridos en programas estructurados se pierde en los primeros 30 días posteriores si no hay un plan de continuidad. Hoy diseñas ese plan.',
        concepto_clave: 'Post-program vulnerability — planificar la vida sin el programa'
      },
      cambio_del_dia: {
        titulo: 'Diseña tu hábito del día 22',
        instruccion: 'Escribe: "Después del reto, mi hábito diario será ___. La señal será ___. Mi versión mínima será ___. Mi ancla hedónica será ___." Cuatro frases. Esto es tu plan de continuidad.',
        por_que: 'Tener un plan escrito para el día 22 reduce la probabilidad de abandono post-reto en un 45%. El hábito sabe a dónde va.',
        duracion: '3 minutos de planificación'
      },
      receta: {
        titulo: 'Elixir nocturno — kéfir de cabra, ashwagandha, miel y pimienta',
        descripcion: 'Cálido, reconfortante, para antes de dormir. El cierre del día.',
        ingredientes: [
          '200ml de kéfir de cabra templado (no caliente)',
          '1/2 cdta de ashwagandha en polvo (KSM-66)',
          '1 cdta de miel cruda',
          'Pizca de pimienta negra',
          'Pizca de nuez moscada',
          'Opcional: pizca de cardamomo'
        ],
        pasos: [
          'Tibia el kéfir a 40°C máximo (no destruir los probióticos).',
          'Disuelve la ashwagandha con la miel en un poco de kéfir caliente primero.',
          'Añade el resto del kéfir, la pimienta y la nuez moscada.',
          'Remueve suavemente.',
          'Bebe sentado, sin pantalla. Es el cierre del día 20.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La ashwagandha nocturna es diferente a la matutina: por la noche, sus withanólidos actúan sobre el sistema GABAérgico, reduciendo la activación del eje HPA antes del sueño. Un RCT de 2019 (Chandrasekhar et al.) mostró que la ashwagandha KSM-66 mejora la calidad del sueño medida por escala PSQI en un 72%. El kéfir de cabra tibio aporta triptófano disponible para la síntesis de melatonina nocturna. La miel proporciona glucosa de liberación lenta para mantener la glucemia estable durante el sueño.',
        alimento_estrella: 'Ashwagandha nocturna + sueño'
      },
      lectura: {
        titulo: 'Audio — Día 20: Preparar el aterrizaje',
        texto: 'Mañana es el penúltimo día. Pasado mañana, el reto termina. Lo que pase el día 22 determinará si estos 21 días se convierten en un hábito de vida o en un bonito recuerdo. Hoy preparas ese aterrizaje. No como un ejercicio — como una decisión real. ¿Qué forma tendrá este hábito cuando ya no haya un programa que lo estructure? Esa es la pregunta más importante de todo el reto.'
      },
      registro_diario: {
        pregunta_manana: '¿Cómo continuará este hábito después del reto? ¿Tengo un plan concreto?',
        pregunta_tarde:  '¿He escrito mi plan de continuidad? ¿Qué me falta definir?',
        pregunta_noche:  '¿Qué parte de estas 3 semanas quiero mantener definitivamente en mi vida?'
      },
      texto_notificacion: '✨ Día 20 — Diseña tu hábito del día 22. El reto acaba, el hábito continúa.'
    }
  },

  {
    day_number: 21,
    title: '🏆 HITO FINAL — El Reset está hecho',
    tip: '21 días. 21 anclas hedónicas. El placer es ahora tu sistema operativo.',
    recipe_data: {
      fase: 'integrar',
      semana: 3,
      hito: {
        titulo: '21 días completados. Eres otra persona.',
        descripcion: 'Has completado el Reset Hedónico. 21 días de micro-hábitos, ciencia psicológica y placer como mecanismo de cambio. Has demostrado que el cambio de hábitos no necesita fuerza de voluntad — necesita placer bien diseñado, entornos bien construidos e identidad anclada. Lo que tienes ahora no es un hábito. Es un sistema.',
        reflexion: 'Lee lo que escribiste en el día 1. ¿Quién eras entonces? ¿Quién eres hoy? Escribe la diferencia. No importa si es grande o pequeña — escríbela.',
        estadisticas: {
          mecanismos_activados: [
            'Tiny Habits — umbral de resistencia a cero (día 1)',
            'Environment Design — fricción eliminada (día 2)',
            'Hedonic Anchoring — 21 anclas de placer activas (día 3)',
            'Identity-based habits — identidad actualizada con evidencia (días 4, 17)',
            'Dopamine anticipation — circuito de deseo propio (día 5)',
            'Self-compassion — motor de persistencia ante el fallo (día 6)',
            'WOOP + implementation intentions — obstáculos planificados (día 8)',
            'Never miss twice — resiliencia consolidada (día 9)',
            'Multi-cue design — señales redundantes activas (días 10, 12)',
            'Cognitive flexibility — fuera del pensamiento binario (día 11)',
            'Immediate reinforcement — ventana de 90s automatizada (día 13)',
            'Automaticity — traspaso a ganglios basales iniciado (día 15)',
            'Future self continuity — yo futuro como brújula (día 16)',
            'Stress resilience protocol — protocolo de emergencia listo (día 18)',
            'Sensory anchoring — memoria sensorial del hábito grabada (día 19)',
            'Post-challenge plan — continuidad del día 22 asegurada (día 20)'
          ]
        }
      },
      idea_clara: {
        titulo: 'Lo que cambia cuando el placer guía',
        texto: 'La mayoría de los programas de cambio de hábitos fallan porque se basan en restricción, disciplina y culpa — sistemas que el cerebro rechaza a medio plazo. Tú has usado el sistema contrario: placer como mecanismo, no como recompensa. Tu cerebro no siente que ha trabajado duro. Siente que ha encontrado algo bueno. Y seguirá buscándolo.',
        concepto_clave: 'Hedonic habit formation — el placer como arquitecto permanente'
      },
      cambio_del_dia: {
        titulo: 'Celebra con todos los sentidos disponibles',
        instruccion: 'Hoy no hay micro-hábito. Solo hay celebración. Prepara tu Gran Elixir Final con cuidado y atención. Siéntate en tu mejor sitio. Pon tu música. Saborea cada sorbo como si fuera el primero. Luego escribe lo que ha cambiado.',
        por_que: 'La celebración final de un programa no es un lujo — es el paso más importante para consolidar la identidad y la memoria del logro. Sin celebración, el cerebro no archiva el éxito correctamente.',
        duracion: '10 minutos de celebración plena'
      },
      receta: {
        titulo: 'El Gran Reset — kéfir de lujo con vainilla bean, miel cruda y pétalos de rosa',
        descripcion: 'El mejor kéfir de tu vida. Porque lo mereces y porque funciona.',
        ingredientes: [
          '200ml de kéfir de cabra premium (o el mejor que encuentres)',
          '1/2 vaina de vainilla (semillas raspadas)',
          '2 cdas de miel cruda de abeja negra o miel de flores premium',
          '1 cdta de agua de rosas',
          'Pétalos de rosa comestibles para decorar',
          'Opcional: láminas de oro comestible'
        ],
        pasos: [
          'Raspa las semillas de la vaina de vainilla directamente en el vaso.',
          'Añade la miel. Remueve lentamente hasta que las semillas se distribuyan.',
          'Vierte el kéfir poco a poco. No tritures — solo mezcla suave.',
          'Añade el agua de rosas.',
          'Decora con pétalos de rosa. Siéntate. Mira lo que has creado.',
          'Bebe despacio. Los 21 días caben en este vaso.'
        ]
      },
      psicobiotico: {
        titulo: 'Nota ciencia Food·Mood',
        texto: 'La vainilla real (Vanilla planifolia) contiene vainillina — un compuesto que activa los receptores opioides mu con una afinidad baja pero real, produciendo bienestar sin dependencia. La miel cruda de abeja negra (o miel premium monoespecífica) contiene enzimas vivas (glucosa oxidasa, diastasa) y hasta 180 compuestos bioactivos que varían según la flora. Los pétalos de rosa comestibles contienen geraniol y citronelol — compuestos con actividad sobre el sistema serotoninérgico. Es, literalmente, una bebida que actúa sobre los mismos sistemas que el amor.',
        alimento_estrella: 'Vainilla real + vainillina'
      },
      lectura: {
        titulo: 'Audio — Día 21: El placer ya es tuyo',
        texto: 'Hace 21 días empezaste con un sorbo antes del café. Hoy terminas con un elixir diseñado para celebrar quien eres. En el camino, tu cerebro ha aprendido algo que es difícil desaprender: que el cambio no tiene que doler. Que el placer no es el enemigo de la salud — es su aliado más poderoso. Que cada vez que cuidas tu microbioma con algo que te gusta, no estás indulgiendo — estás construyendo. Ese conocimiento ya es tuyo. El Reset ya está hecho.'
      },
      registro_diario: {
        pregunta_manana: '¿Cómo me siento hoy sabiendo que es el último día del reto?',
        pregunta_tarde:  '¿Qué ha sido el mayor aprendizaje de estos 21 días — no sobre hábitos, sino sobre mí mismo?',
        pregunta_noche:  '¿Qué forma tendrá este hábito en mi vida a partir de mañana?'
      },
      texto_notificacion: '🏆 Día 21 — El Reset está hecho. Tu Gran Elixir Final te espera. Lo has conseguido.'
    }
  }

]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Seeding Reset Hedónico — 21 días...\n')

  // 1. Upsert challenge
  const { data: challenge, error: cErr } = await supabase
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
      audiencia:     CHALLENGE.audiencia,
      incluye:       CHALLENGE.incluye,
      hitos_landing: CHALLENGE.hitos_landing,
      al_completar:  CHALLENGE.al_completar,
    }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (cErr) {
    console.error('❌ Error upserting challenge:', cErr.message)
    process.exit(1)
  }
  console.log(`✅ Challenge upserted — id: ${challenge.id}`)

  // 2. Upsert each day
  let ok = 0
  let fail = 0
  for (const day of DAYS) {
    const { error: dErr } = await supabase
      .from('challenge_days')
      .upsert({
        challenge_id: challenge.id,
        day_number:   day.day_number,
        title:        day.title,
        tip:          day.tip,
        recipe_data:  day.recipe_data,
      }, { onConflict: 'challenge_id,day_number' })

    if (dErr) {
      console.error(`  ❌ Día ${day.day_number}: ${dErr.message}`)
      fail++
    } else {
      console.log(`  ✅ Día ${day.day_number}: ${day.title}`)
      ok++
    }
  }

  console.log(`\n✨ Done — ${ok} días insertados, ${fail} errores`)
  if (fail > 0) process.exit(1)
}

main()
