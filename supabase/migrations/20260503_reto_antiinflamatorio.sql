-- ── recipe_data column (si no existe de migraciones anteriores) ───────────────
ALTER TABLE public.challenge_days
  ADD COLUMN IF NOT EXISTS recipe_data jsonb;

-- ── Actualizar reset-antiinflamatorio con campos de landing ───────────────────
UPDATE public.challenges SET
  title         = 'Reset antiinflamatorio',
  subtitle      = 'Cúrcuma, omega-3, fermentados. Reset completo en una semana.',
  description   = 'Siete días de protocolo antiinflamatorio basado en evidencia. Curcumina, omega-3, sulforafano, polifenoles y fermentados actuando en sinergia sobre las vías inflamatorias reales: NF-κB, COX-2, IL-6, TNF-α.',
  price_eur     = 19,
  color         = '#5A9B8A',
  emoji         = '🌿',
  recipe_count  = 7,
  audio_count   = 7,
  is_premium    = true,
  incluye = jsonb_build_array(
    '7 días de protocolo antiinflamatorio con evidencia',
    '7 audios de apoyo (4-8 min)',
    'Registro diario de síntomas y bienestar',
    'Informe personalizado al completar',
    'Acceso de por vida al contenido'
  ),
  hitos_landing = jsonb_build_array(
    jsonb_build_object('dia', 1, 'texto', 'Activas la inhibición de NF-κB con curcumina y piperina'),
    jsonb_build_object('dia', 4, 'texto', 'Nrf2 activo — tu defensa antioxidante endógena al máximo'),
    jsonb_build_object('dia', 7, 'texto', 'Reset completado — seis vías antiinflamatorias trabajadas')
  ),
  al_completar = jsonb_build_object(
    'titulo',    '7 días completados',
    'subtitulo', 'Tu sistema antiinflamatorio tiene una nueva base. ¿Qué sigue?',
    'cta',       'Ver reto Equilibrio hormonal 45+',
    'cta_slug',  'equilibrio-hormonal-45'
  )
WHERE slug = 'reset-antiinflamatorio';

-- ── Día 1 — Curcumina + piperina + NF-κB ─────────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'La inflamación que no duele es la que más daño hace.',
  'Toma la leche dorada en ayunas — la absorción de curcumina es máxima antes de desayunar',
  jsonb_build_object(
    'push_message', '🌿 Día 1 — Empieza el reset. Hoy apagas el interruptor de la inflamación.',
    'fase', 'activar',
    'semana', 1,
    'hito_landing', true,
    'pilar', 'curcumina_nfkb',
    'indice_foodmood', jsonb_build_object(
      'pregunta',     'Del 1 al 10: ¿cómo describes tu nivel de inflamación hoy? (hinchazón, dolor articular, fatiga, niebla mental, digestión pesada)',
      'tipo',         'slider',
      'campo',        'inflamacion_inicio',
      'descripcion',  'Este es tu índice de partida. Lo compararemos con el día 7.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'NF-κB — el interruptor maestro de la inflamación',
      'texto',          'La inflamación crónica de bajo grado no aparece como una herida visible. Aparece como niebla mental persistente, digestión pesada, cansancio que no mejora con descanso, dolores articulares intermitentes, piel reactiva, estado de ánimo inestable. Todos tienen la misma causa molecular: la activación crónica del factor de transcripción NF-κB, el interruptor maestro que controla la producción de citocinas proinflamatorias (IL-6, TNF-α, IL-1β). La curcumina es el inhibidor de NF-κB más estudiado de la naturaleza. El problema: su biodisponibilidad oral sola es inferior al 1%. Con piperina (pimienta negra): 2.000% más biodisponible. Con grasa: otro 50% adicional. Sin esos dos cofactores, la cúrcuma en el plato es casi decorativa.',
      'concepto_clave', 'NF-κB, IκB kinasa, curcumina + piperina'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Leche dorada antiinflamatoria con pimienta negra y ghee',
      'descripcion', '250 ml de leche de avena o entera, 1 cucharadita de cúrcuma, 1/2 cucharadita de pimienta negra recién molida (imprescindible), 1 cucharadita de ghee, canela, miel cruda. Calentar sin hervir, batir, añadir ghee. Miel cuando baje de 70°C.',
      'por_que',     'La piperina inhibe la glucuronidación hepática — el proceso por el que el hígado elimina la curcumina antes de que llegue a los tejidos. El ghee aporta ácido butírico (antiinflamatorio intestinal directo) y actúa como vehículo lipídico. Esta combinación produce niveles terapéuticos reales en sangre.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Bienvenida al reset antiinflamatorio — 4 minutos',
      'descripcion',  'Introducción al reto. Qué es la inflamación de bajo grado, por qué no duele pero destruye, y qué va a cambiar en 7 días.',
      'duracion_min', 4,
      'tipo',         'introduccion',
      'archivo',      'audio/antiinflamatorio/dia01-bienvenida.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'La inflamación crónica de bajo grado es la base de casi todas las enfermedades crónicas modernas: cardiovascular, metabólica, autoinmune, neurodegenerativa. No es una enfermedad en sí misma — es el terreno que las genera. Lo que comes cada día es la instrucción más directa que le das a ese terreno. Este reto no trata enfermedades. Cambia el terreno.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué síntomas asocias tú personalmente con inflamación? (hinchazón, dolor, niebla, piel, fatiga...)',
      'pregunta_tarde',  '¿Has tomado la leche dorada hoy? ¿Con pimienta negra y ghee?',
      'pregunta_noche',  'Describe en una frase cómo está tu cuerpo esta noche comparado con la mañana.'
    ),
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 2 — Omega-3 + resolvinas ─────────────────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'La inflamación no se apaga sola. Necesita moléculas que la resuelvan.',
  'El aceite de oliva virgen que pica en la garganta tiene oleocantal — inhibe COX-1 y COX-2',
  jsonb_build_object(
    'push_message', '🐟 Día 2 — Omega-3 y resolvinas. La bioquímica del apagado activo.',
    'fase', 'activar',
    'semana', 1,
    'pilar', 'omega3_resolvinas',
    'idea_clara', jsonb_build_object(
      'titulo',         'EPA/DHA → resolvinas + protectinas → apagado activo de la inflamación',
      'texto',          'La inflamación crónica no es un exceso de activación — es un fallo en la resolución. El cuerpo activa la inflamación correctamente, pero no tiene los recursos para apagarla. Las moléculas que ejecutan ese apagado se llaman resolvinas, protectinas y maresinas. Todas se sintetizan a partir del EPA y DHA del omega-3 marino. Sin omega-3 suficiente, el proceso inflamatorio se activa pero no encuentra el freno. El ratio omega-6/omega-3 en la dieta occidental es de aproximadamente 20:1. El óptimo fisiológico es 4:1 o menos.',
      'concepto_clave', 'Resolvinas, protectinas, EPA/DHA, ratio omega-6/omega-3'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Caballa en escabeche con cebolla roja, alcaparras y vinagreta de mostaza',
      'descripcion', 'Caballa (fresca o en conserva al natural), cebolla roja en juliana, alcaparras, rúcula. Vinagreta: vinagre de kombucha o de manzana, aceite de oliva virgen, mostaza de Dijon, miel cruda. Semillas de lino molido encima.',
      'por_que',     'La caballa tiene uno de los ratios EPA+DHA más altos por gramo — superior al salmón de piscifactoría. Las alcaparras son la fuente más concentrada de quercetina de la dieta mediterránea, que inhibe NF-κB por un mecanismo diferente y complementario al de la curcumina.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'El ciclo inflamatorio explicado — 5 minutos',
      'descripcion',  'Visualización del proceso inflamación-resolución como un ciclo. Por qué se cronifica cuando faltan los recursos para el apagado.',
      'duracion_min', 5,
      'tipo',         'educativo',
      'archivo',      'audio/antiinflamatorio/dia02-omega3-resolucion.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'Los antiinflamatorios farmacológicos (ibuprofeno, naproxeno) bloquean COX-2 — la enzima que produce prostaglandinas inflamatorias. Pero no activan la resolución. El omega-3 hace algo diferente: activa la síntesis de resolvinas que resuelven activamente la inflamación sin bloquear las vías de protección. Es un mecanismo diferente y complementario que la farmacología clásica no cubre.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Con qué frecuencia comes pescado azul normalmente? ¿Una vez, dos, ninguna a la semana?',
      'pregunta_tarde',  '¿Has comido omega-3 hoy? ¿En qué forma y en qué comida?',
      'pregunta_noche',  '¿Hay algún síntoma de tu lista del día 1 que ya esté algo diferente?'
    ),
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 3 — Fermentados + barrera intestinal + LPS ───────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  'El 70% del sistema inmune vive en el intestino. Y come lo que tú comes.',
  'El chucrut crudo refrigerado (no pasteurizado) tiene millones de bacterias vivas. El de lata no tiene ninguna',
  jsonb_build_object(
    'push_message', '🦠 Día 3 — Fermentados y barrera intestinal. Donde empieza el 70% de la inflamación.',
    'fase', 'activar',
    'semana', 1,
    'pilar', 'fermentados_barrera_lps',
    'idea_clara', jsonb_build_object(
      'titulo',         'Disbiosis → LPS en sangre → inflamación sistémica → síntomas crónicos',
      'texto',          'El lipopolisacárido (LPS) es una toxina de la membrana externa de las bacterias gramnegativas intestinales. En un intestino sano, la barrera intestinal impide que el LPS cruce al torrente sanguíneo. Cuando esa barrera está dañada — por antibióticos, azúcar, estrés crónico, ultraprocesados — el LPS pasa a la circulación. El sistema inmune lo detecta como una amenaza y activa una respuesta inflamatoria. Esto se llama endotoxemia metabólica: niveles de LPS en sangre 2-3 veces superiores al normal en personas sanas con dieta occidental. Sin fiebre, sin síntomas agudos — pero con inflamación sistémica de bajo grado constante.',
      'concepto_clave', 'LPS, endotoxemia metabólica, barrera intestinal, Akkermansia muciniphila'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol de kéfir con chucrut, pepino, semillas y vinagreta de cúrcuma',
      'descripcion', '150 g de kéfir natural, 2 cucharadas de chucrut crudo sin pasteurizar, pepino en rodajas, semillas de girasol y calabaza. Vinagreta: cúrcuma + pimienta negra + aceite de oliva + vinagre de kombucha o de manzana. Eneldo fresco.',
      'por_que',     'El chucrut crudo tiene entre 1 y 10 millones de UFC de Lactobacillus por gramo — más que la mayoría de suplementos probióticos. La vinagreta de cúrcuma añade inhibición de NF-κB directamente sobre la mucosa intestinal. La combinación ácida de kéfir + chucrut activa los receptores del nervio vago.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Meditación de barrera y protección — 7 minutos',
      'descripcion',  'Visualización guiada del intestino como barrera activa. Respiración diafragmática para activar el nervio vago.',
      'duracion_min', 7,
      'tipo',         'meditacion',
      'archivo',      'audio/antiinflamatorio/dia03-barrera-intestinal.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'Los probióticos en cápsula tienen un papel. Pero los fermentados reales — kéfir, chucrut, miso, kimchi — tienen algo que las cápsulas no pueden replicar: la matriz alimentaria. Las bacterias viajan en una estructura de fibra, ácidos orgánicos y nutrientes que las protege en el tránsito gástrico. La supervivencia de las bacterias hasta el colon es significativamente mayor en fermentados que en cápsulas.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu digestión esta semana? ¿Hinchazón, irregularidad, pesadez después de comer?',
      'pregunta_tarde',  '¿Has incluido fermentado hoy? ¿Cuál y en qué cantidad?',
      'pregunta_noche',  '¿Hay alguna diferencia en tu digestión comparada con el día 1?'
    ),
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 4 — HITO MITAD — Polifenoles + Nrf2 ──────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'Mitad del camino. Nrf2 está activo. Hoy añadimos los polifenoles.',
  'El té verde debe infusionarse a 75-80°C, nunca con agua hirviendo — el EGCG se destruye sobre 85°C',
  jsonb_build_object(
    'push_message', '🎯 Día 4 — Mitad del reset. Nrf2 activado. Hoy potencias con polifenoles.',
    'fase', 'activar',
    'semana', 1,
    'pilar', 'polifenoles_nrf2',
    'indice_foodmood', jsonb_build_object(
      'pregunta',    'Del 1 al 10: ¿cómo están tus síntomas inflamatorios HOY comparados con el día 1?',
      'tipo',        'slider',
      'campo',       'inflamacion_dia4',
      'descripcion', 'Primera comparativa. ¿Ha bajado la inflamación percibida?'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'Polifenoles → activación Nrf2 → defensa antioxidante endógena',
      'texto',          'Nrf2 es el regulador maestro de la defensa antioxidante endógena. Cuando Nrf2 se activa, entra en el núcleo celular y activa la transcripción de más de 200 genes de protección: hemo oxigenasa-1 (HO-1), NQO1, glutatión peroxidasa, superóxido dismutasa. Los activadores más potentes de Nrf2 en la dieta: sulforafano (brócoli), curcumina (cúrcuma — ya en acción desde el día 1), resveratrol (uva negra), quercetina (cebolla roja, alcaparras), EGCG (té verde), antocianinas (arándanos, moras). Hoy añadimos la segunda capa: polifenoles de múltiples fuentes para saturar todos los receptores activadores de Nrf2 disponibles.',
      'concepto_clave', 'Nrf2, HO-1, NQO1, quercetina, EGCG, antocianinas'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada de arándanos, moras, nueces, cebolla roja y vinagreta de té verde',
      'descripcion', 'Rúcula de base, arándanos, moras o frambuesas, cebolla roja en juliana, nueces crudas, manzana con piel, queso feta opcional. Vinagreta: 100 ml de té verde frío + vinagre de kombucha o de manzana + aceite de oliva + miel + ralladura de limón.',
      'por_que',     'Activa Nrf2 por cuatro vías simultáneas: antocianinas de los arándanos y moras, quercetina de la cebolla roja y la manzana con piel, EGCG del té verde y ácido elágico de los frutos rojos. La vinagreta de té verde frío tiene mejor biodisponibilidad de EGCG que el té caliente.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Revisión de mitad de reto — 6 minutos',
      'descripcion',  'Revisión guiada de los 4 días. Cambios percibidos, energía, digestión. Visualización de Nrf2 activo como escudo celular.',
      'duracion_min', 6,
      'tipo',         'reflexion',
      'archivo',      'audio/antiinflamatorio/dia04-revision-mitad.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'Los antioxidantes externos (vitamina C, vitamina E en cápsula) atrapan radicales libres uno a uno. Nrf2, cuando está activado, produce enzimas antioxidantes endógenas que neutralizan millones de radicales libres de forma catalítica — sin consumirse. Un solo gramo de catalasa (activada por Nrf2) puede neutralizar 40 millones de moléculas de peróxido de hidrógeno por segundo. Por eso activar Nrf2 es más potente que tomar antioxidantes externos.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', 'Compara con el día 1: ¿hinchazón, dolor, niebla mental, fatiga — algo ha mejorado?',
      'pregunta_tarde',  '¿Has comido bayas o frutas del bosque esta semana? ¿Con qué frecuencia?',
      'pregunta_noche',  '¿Hay algún síntoma que persista sin cambio? Descríbelo.'
    ),
    'hito', jsonb_build_object(
      'titulo',      '🎯 Mitad del reset antiinflamatorio',
      'descripcion', '4 días de reset. NF-κB inhibido con curcumina. Resolvinas activadas con omega-3. Barrera intestinal reforzada con fermentados. Nrf2 activo con polifenoles.',
      'reflexion',   '¿Cuánto ha bajado tu índice de inflamación desde el día 1?'
    )
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 5 — Sulforafano + brócoli ────────────────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'El brócoli tiene un compuesto más potente que la mayoría de fármacos antiinflamatorios.',
  'Corta el brócoli y espera 10 minutos antes de cocinarlo — la mirosinasa completa la conversión en ese tiempo',
  jsonb_build_object(
    'push_message', '🥦 Día 5 — Sulforafano. El compuesto del brócoli que los laboratorios intentan sintetizar.',
    'fase', 'activar',
    'semana', 1,
    'pilar', 'sulforafano_detox',
    'idea_clara', jsonb_build_object(
      'titulo',         'Glucorafanina + mirosinasa → sulforafano → Nrf2 + fase II detox + autofagia',
      'texto',          'El sulforafano es el activador de Nrf2 más potente identificado en la dieta humana — entre 10 y 100 veces más potente que otros polifenoles. Se forma cuando la glucorafanina del brócoli entra en contacto con la mirosinasa, una enzima presente en las mismas células del brócoli. Esta reacción solo ocurre cuando el tejido vegetal se daña: al masticar, cortar o picar. El calor excesivo inactiva la mirosinasa — pero añadir mostaza (rica en mirosinasa activa) al brócoli cocinado restaura la conversión. Los brotes de brócoli tienen entre 20 y 50 veces más glucorafanina que el brócoli maduro.',
      'concepto_clave', 'Sulforafano, glucorafanina, mirosinasa, fase II detox, autofagia selectiva'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada de brócoli al vapor con mostaza, limón, anacardos y miso',
      'descripcion', '300 g de brócoli (cortar y esperar 10 min antes de cocer 3-4 min al vapor). Aliño: mostaza de Dijon + miso blanco + zumo de limón + aceite de sésamo + vinagre de kombucha o de manzana + miel. Anacardos crudos, espinacas baby, sésamo negro.',
      'por_que',     'La mostaza en el aliño tiene mirosinasa activa que restaura la producción de sulforafano sobre el brócoli ya cocinado. Los 10 minutos de espera antes de cocinar permiten que la mirosinasa del brócoli complete la conversión antes de que el calor la inactive.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Visualización de detox celular — 8 minutos',
      'descripcion',  'Visualización guiada del sulforafano activando Nrf2 en cada célula. Imagen de la fase II de detoxificación hepática. Respiración consciente como apoyo al proceso de limpieza celular.',
      'duracion_min', 8,
      'tipo',         'visualizacion',
      'archivo',      'audio/antiinflamatorio/dia05-sulforafano-detox.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'El Instituto Nacional del Cáncer de EE.UU. tiene al sulforafano como uno de los compuestos dietéticos más prometedores en prevención oncológica. No porque sea un fármaco — sino porque la activación de Nrf2 que produce activa tanto la detoxificación de carcinógenos (fase II hepática) como la eliminación de células dañadas (autofagia). Los brotes de brócoli se pueden cultivar en casa en 5-7 días. Es el alimento antiinflamatorio más económico por unidad de sulforafano que existe.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Comes brócoli habitualmente? ¿Lo cocinas mucho tiempo o poco?',
      'pregunta_tarde',  '¿Has preparado el brócoli con el truco de los 10 minutos de reposo hoy?',
      'pregunta_noche',  '¿Sientes tu digestión más ligera esta semana comparada con antes del reto?'
    ),
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 6 — Ayuno nocturno + autofagia + AMPK ────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'El ayuno nocturno no es una moda. Es el mecanismo de limpieza más antiguo del cuerpo.',
  'Cena antes de las 20h hoy — 12 horas de ayuno nocturno son suficientes para activar autofagia significativa',
  jsonb_build_object(
    'push_message', '🌙 Día 6 — Ayuno nocturno y autofagia. La limpieza celular que ocurre mientras duermes.',
    'fase', 'integrar',
    'semana', 1,
    'pilar', 'ayuno_autofagia_ampk',
    'idea_clara', jsonb_build_object(
      'titulo',         'Ayuno nocturno → AMPK activo → mTOR inhibido → autofagia → limpieza inflamatoria',
      'texto',          'La autofagia es el proceso por el que la célula descompone y recicla sus propios componentes dañados: proteínas mal plegadas, mitocondrias disfuncionales, patógenos intracelulares. Tiene un efecto antiinflamatorio directo: al eliminar los residuos celulares que activan NLRP3 (el inflamasoma), reduce la producción de IL-1β e IL-18. La autofagia se activa cuando AMPK detecta que la energía disponible ha bajado — lo que ocurre durante el ayuno. Un ayuno nocturno de 12-14 horas (cenar a las 20h, desayunar a las 8-9h) es suficiente para activar autofagia significativa. La cena temprana es la intervención antiinflamatoria más subestimada y más accesible de todas.',
      'concepto_clave', 'Autofagia, AMPK, mTOR, NLRP3, inflamasoma, IL-1β'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cena antiinflamatoria ligera — sopa de miso con tofu, algas y jengibre',
      'descripcion', '500 ml de agua, 1 cucharada de miso rojo sin pasteurizar (disolver fuera del fuego), 100 g de tofu en cubos, alga nori en tiras, jengibre fresco rallado, cebolleta, aceite de sésamo. Comer antes de las 20h.',
      'por_que',     'El tofu aporta isoflavonas con efecto antiinflamatorio sobre COX-2. El miso sin pasteurizar añade Lactobacillus vivos que producen butirato durante la noche. El jengibre contiene gingeroles que inhiben la síntesis de prostaglandinas. La hora es parte de la receta: cenar antes de las 20h activa AMPK y autofagia.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Respiración nocturna y activación de autofagia — 8 minutos',
      'descripcion',  'Técnica de respiración coherente (5-5) para reducir el cortisol vespertino. Visualización del proceso de autofagia como limpieza celular nocturna.',
      'duracion_min', 8,
      'tipo',         'ritual_nocturno',
      'archivo',      'audio/antiinflamatorio/dia06-ayuno-autofagia.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto',  'Yoshinori Ohsumi recibió el Nobel de Medicina en 2016 por descubrir los mecanismos de la autofagia. La herramienta más accesible para activar autofagia significativa no es un fármaco ni un suplemento — es simplemente cenar antes de las 20h y desayunar después de las 8h. Doce horas. Gratis. Todos los días.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿A qué hora has cenado ayer? ¿Y a qué hora has desayunado hoy? ¿Cuántas horas de ayuno?',
      'pregunta_tarde',  '¿Has podido cenar antes de las 20h hoy?',
      'pregunta_noche',  '¿Cómo te sientes esta noche comparado con la primera noche del reto?'
    ),
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Día 7 — HITO FINAL — Reset completado ────────────────────────────────────
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  '7 días. Seis vías antiinflamatorias. Una sola dirección.',
  'El protocolo permanente: curcumina + pimienta a diario, omega-3 regular, cenas antes de las 20h',
  jsonb_build_object(
    'push_message', '🏆 Día 7 — Reset completado. Tu informe antiinflamatorio personalizado está listo.',
    'fase', 'integrar',
    'semana', 1,
    'hito_landing', true,
    'pilar', 'integracion_protocolo_permanente',
    'indice_foodmood', jsonb_build_object(
      'pregunta',    'Del 1 al 10: ¿cómo están tus síntomas inflamatorios HOY, en el día 7?',
      'tipo',        'slider',
      'campo',       'inflamacion_final',
      'descripcion', 'Comparativa final. Índice día 1 → día 4 → día 7.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El resumen de las seis vías trabajadas',
      'texto',          'Día 1 — Curcumina + piperina: inhibición directa de NF-κB. Día 2 — Omega-3 EPA+DHA: síntesis de resolvinas para el apagado activo del ciclo inflamatorio. Día 3 — Fermentados + Akkermansia: refuerzo de la barrera intestinal que impide el paso de LPS a la circulación. Día 4 — Polifenoles: saturación de los receptores activadores de Nrf2. Día 5 — Sulforafano: el activador de Nrf2 más potente disponible en la dieta, fase II de detoxificación hepática. Día 6 — Ayuno nocturno: activación de AMPK, autofagia y limpieza del inflamasoma NLRP3. Seis mecanismos, seis vías, una cadena.',
      'concepto_clave', 'NF-κB, resolvinas, LPS, Nrf2, sulforafano, autofagia, AMPK'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'El bol del día 7 — todas las vías antiinflamatorias en un plato',
      'descripcion', 'Rúcula + quinoa de base. Salmón o caballa al horno. Brócoli al vapor (10 min reposo antes de cocinar). Arándanos. Cebolla roja. Chucrut crudo. Aliño integrador: kéfir + mostaza de Dijon + vinagre de kombucha o de manzana + aceite de oliva + cúrcuma + pimienta negra + miel. Comer antes de las 20h.',
      'por_que',     'Un ingrediente por cada vía del reset: salmón (omega-3 / resolvinas), brócoli (sulforafano / Nrf2), arándanos (polifenoles / Nrf2), cebolla roja (quercetina / NF-κB), chucrut (barrera intestinal / LPS), aliño de cúrcuma (NF-κB). La hora: autofagia. Este bol es la demostración de que el protocolo antiinflamatorio más eficaz disponible sin prescripción médica son alimentos accesibles con mecanismos moleculares reales.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Celebración y protocolo permanente — 8 minutos',
      'descripcion',  'Audio de cierre. Resumen de las seis vías trabajadas. Definición del protocolo de mantenimiento mínimo viable. Tono empoderador y real.',
      'duracion_min', 8,
      'tipo',         'cierre_celebracion',
      'archivo',      'audio/antiinflamatorio/dia07-cierre-reset.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Lo que llevas contigo a partir de hoy',
      'texto',  'El protocolo antiinflamatorio permanente no requiere hacer el reto cada semana. Requiere mantener tres cosas: curcumina + piperina a diario, omega-3 regular (pescado azul 2-3 veces/semana o nueces a diario), y cenas antes de las 20h siempre que sea posible. El resto — fermentados, polifenoles, sulforafano — es la capa de optimización que añades cuando puedes. El 80% del efecto antiinflamatorio viene de esas tres cosas simples y constantes.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', 'Índice final (1-10): ¿cuánto han bajado tus síntomas inflamatorios desde el día 1?',
      'pregunta_tarde',  '¿Qué síntoma ha mejorado más claramente en estos 7 días?',
      'pregunta_noche',  '¿Cuáles son los 3 hábitos de este reto que vas a mantener de forma permanente?'
    ),
    'hito', jsonb_build_object(
      'titulo',       '🏆 Reset antiinflamatorio completado',
      'descripcion',  '7 días. Seis vías antiinflamatorias activadas. NF-κB inhibido. Resolvinas sintetizadas. Barrera intestinal reforzada. Nrf2 activo. Sulforafano en acción. Autofagia nocturna iniciada. Tu índice Food·Mood lo registra todo.',
      'reflexion',    '¿Qué síntoma ha mejorado más? ¿Cuánto ha bajado tu índice inflamatorio?',
      'estadisticas', jsonb_build_object(
        'dias_completados',         7,
        'vias_antiinflamatorias',   6,
        'mecanismos_activados', jsonb_build_array(
          'NF-κB inhibido (curcumina + piperina)',
          'Resolvinas activadas (omega-3)',
          'Barrera intestinal reforzada (fermentados)',
          'Nrf2 saturado (polifenoles)',
          'Sulforafano en acción (brócoli)',
          'Autofagia iniciada (ayuno nocturno)'
        )
      ),
      'informe_personalizado', jsonb_build_object(
        'activo',      true,
        'campos',      jsonb_build_array('inflamacion_inicio', 'inflamacion_dia4', 'inflamacion_final'),
        'descripcion', 'Síntomas inflamatorios inicio vs. fin, patrón observado, protocolo permanente recomendado',
        'nota_logica', 'Bajada del índice = mejora (a diferencia del reto de energía donde subir es mejor)'
      ),
      'cta_primario',   jsonb_build_object('texto', 'Ver mi informe personalizado', 'accion', 'generar_informe'),
      'cta_secundario', jsonb_build_object('texto', 'Compartir mi resultado', 'accion', 'compartir'),
      'cta_terciario',  jsonb_build_object('texto', 'Empezar Equilibrio hormonal 45+', 'slug', 'equilibrio-hormonal-45')
    )
  )
FROM public.challenges c WHERE c.slug = 'reset-antiinflamatorio'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
