-- ══════════════════════════════════════════════════════════════════════════════
-- SLOW FOOD·MOOD — 21 días para calmar la ansiedad a través de la cocina lenta
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Columnas adicionales en challenges (si no existen aún) ────────────────────
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS is_premium   bool    DEFAULT false;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS audiencia    text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS incluye      jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS hitos_landing jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS al_completar jsonb;

-- ── Insertar reto Slow Food·Mood ──────────────────────────────────────────────
INSERT INTO public.challenges
  (slug, title, subtitle, description, category, duration_days, price_eur, is_premium,
   emoji, color, recipe_count, audio_count, audiencia, incluye, hitos_landing, al_completar)
VALUES (
  'slow-food-mood',
  'Slow Food·Mood — 21 días para calmar la ansiedad',
  'Fast life. Slow Food·Mood. La cocina lenta como práctica de regulación del sistema nervioso.',
  'Un protocolo de 21 días que usa la cocina lenta como herramienta de regulación del sistema nervioso. Fermentos, masas madre, caldos de larga cocción y marinados que entrenan la tolerancia a la espera y activan el eje intestino-cerebro. Basado en la neurociencia del mindfulness encarnado.',
  'ansiedad',
  21,
  29,
  false,
  '🍵',
  '#4A7B6B',
  21,
  7,
  'Personas con ansiedad, estrés crónico o sensación de ir siempre deprisa',
  jsonb_build_array(
    '21 días de cocina lenta con recetas de fermentación, caldos y masas',
    '7 audios guiados de mindfulness encarnado (3-5 min)',
    'Diario de ritmo: mañana, tarde y noche',
    'Guía de 8 ingredientes clave del programa',
    'Acceso de por vida al contenido'
  ),
  jsonb_build_array(
    jsonb_build_object('dia', 1,  'texto', 'Preparas tu primera espera consciente — agua viva de pepino'),
    jsonb_build_object('dia', 7,  'texto', 'Semana 1 completada — has aprendido a esperar'),
    jsonb_build_object('dia', 14, 'texto', 'Tu microbioma ya tiene nuevos aliados — chucrut y kimchi iniciados'),
    jsonb_build_object('dia', 21, 'texto', 'Tu nuevo ritmo está construido. La lentitud es ahora un hábito')
  ),
  jsonb_build_object(
    'titulo',    '21 días completados',
    'subtitulo', 'Has construido un ritmo nuevo. La cocina lenta ya es tuya.',
    'cta',       'Ver reto Reset Antiinflamatorio (7 días)',
    'cta_slug',  'reset-antiinflamatorio'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title          = EXCLUDED.title,
  subtitle       = EXCLUDED.subtitle,
  description    = EXCLUDED.description,
  category       = EXCLUDED.category,
  duration_days  = EXCLUDED.duration_days,
  price_eur      = EXCLUDED.price_eur,
  is_premium     = EXCLUDED.is_premium,
  emoji          = EXCLUDED.emoji,
  color          = EXCLUDED.color,
  recipe_count   = EXCLUDED.recipe_count,
  audio_count    = EXCLUDED.audio_count,
  audiencia      = EXCLUDED.audiencia,
  incluye        = EXCLUDED.incluye,
  hitos_landing  = EXCLUDED.hitos_landing,
  al_completar   = EXCLUDED.al_completar;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 1 — "Aprende a esperar" (días 1-7)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 1 — Agua de pepino y menta
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'Agua viva de pepino, menta y jengibre',
  'Este agua no es una infusión. Es una maceración de 8 horas. El tiempo es el ingrediente.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Por qué la espera calma el sistema nervioso',
      'texto',          'El sistema nervioso ansioso vive en el futuro. La cocina lenta te ancla al presente de una forma que la meditación sentada no siempre consigue: tienes algo real que esperar. La neurociencia llama a esto "anticipación positiva" — cuando sabes que en 8 horas habrá algo tuyo, el cortisol baja. Hoy empiezas con la preparación más sencilla: agua que necesita tiempo.',
      'concepto_clave', 'Anticipación positiva y regulación del cortisol'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara el agua esta noche — bébela mañana',
      'instruccion', 'Antes de dormir: lava y trocea medio pepino (sin pelar), añade 8-10 hojas de menta fresca y un trozo de jengibre de 2cm. Cubre con 1 litro de agua fría. Tapa y deja en la nevera.',
      'por_que',     'El pepino aporta silicio y quercetina. La menta activa el nervio vago. El jengibre tiene propiedades adaptógenas. Pero el ingrediente real es el tiempo: 8 horas de maceración multiplican la concentración de compuestos activos.',
      'duracion',    '5 minutos de preparación + 8 horas de espera'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Agua viva de pepino, menta y jengibre',
      'descripcion', 'Maceración fría de 8 horas. Sin hervir, sin prisa.',
      'ingredientes', jsonb_build_array(
        '1/2 pepino mediano sin pelar',
        '8-10 hojas de menta fresca',
        '2cm de jengibre fresco pelado',
        '1 litro de agua fría filtrada',
        'Opcional: rodaja de limón'
      ),
      'pasos', jsonb_build_array(
        'Lava el pepino y córtalo en rodajas finas.',
        'Machaca ligeramente las hojas de menta con los dedos para liberar los aceites.',
        'Lamina el jengibre.',
        'Combina todo en una jarra de cristal con tapa.',
        'Cubre con el agua fría. Tapa.',
        'Deja en la nevera 8 horas (o toda la noche).',
        'Por la mañana, bébela a temperatura fresca a lo largo del día.'
      ),
      'por_que', 'La maceración fría preserva los compuestos volátiles de la menta (mentol, linalool) que estimulan el nervio vago. La quercetina del pepino tiene efecto ansiolítico demostrado en estudios con modelos animales.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'La primera espera',
      'descripcion',  'Un audio corto para acompañar la preparación nocturna. Sobre por qué esperar es un acto de confianza.',
      'duracion_min', 4,
      'tipo',         'mindfulness',
      'archivo',      'slow-food-mood-dia-01.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo has dormido? ¿Qué sientes al saber que el agua ya está lista?',
      'pregunta_tarde',  '¿Has podido beber el agua a lo largo del día? ¿Notaste algo diferente?',
      'pregunta_noche',  '¿Qué ha sido lo más lento que has hecho hoy? ¿Qué te costó más esperar?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 2 — Caldo de kombu
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'Caldo de kombu y setas shiitake',
  'El kombu no se hierve a fuego fuerte. Se lleva al límite del hervor y se retira. La paciencia aquí es literal.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El umami como calmante — glutamato y GABA',
      'texto',          'El caldo dashi japonés lleva siglos siendo la base de la cocina de la calma. El alga kombu es rica en glutamato natural, precursor del GABA, el neurotransmisor inhibidor más importante del sistema nervioso. No es accidental que la cocina japonesa — famosa por su longevidad y sus bajas tasas de ansiedad — use este caldo como base de casi todo. Hoy preparas el tuyo.',
      'concepto_clave', 'Glutamato natural → GABA y señalización inhibidora'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Remoja el kombu por la mañana — cocina el caldo por la tarde',
      'instruccion', 'Pon el kombu en remojo en agua fría 30 minutos. Luego lleva a fuego muy suave, lleva casi al hervor (aparecen las primeras burbujas) y retira el kombu. Añade las setas. Cocina 20 minutos a fuego mínimo.',
      'por_que',     'El kombu hervido a más de 80°C libera ácido algínico amargo. La técnica de "casi hervor" preserva el glutamato y el sabor limpio.',
      'duracion',    '30 min remojo + 25 min cocción suave'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Caldo de kombu y shiitake',
      'ingredientes', jsonb_build_array(
        '15g alga kombu seca',
        '6-8 setas shiitake secas (o frescas)',
        '1,2 litros de agua fría',
        '1 cdta salsa de soja o tamari (opcional)',
        'Sal al gusto'
      ),
      'pasos', jsonb_build_array(
        'Remoja el kombu y las setas shiitake en el agua fría durante 30 minutos.',
        'Lleva la olla a fuego suave. Cuando veas las primeras burbujas pequeñas (unos 75-80°C), retira el kombu.',
        'Mantén las setas y sube ligeramente el fuego. Cocina a fuego mínimo 20 minutos.',
        'Cuela el caldo. Reserva las setas (puedes comerlas con un poco de salsa de soja).',
        'Bebe una taza caliente ahora. Guarda el resto en la nevera (dura 4 días).'
      ),
      'por_que', 'El glutamato del kombu es el precursor natural del GABA. Las setas shiitake aportan lentinan (beta-glucano con efecto inmunomodulador) y eritadenina (regula el metabolismo del colesterol). Juntos, producen un caldo con propiedades calmantes reales.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'El arte de casi hervir',
      'descripcion',  'Sobre la diferencia entre controlar y acompañar. Un audio para mientras el caldo se hace.',
      'duracion_min', 3,
      'tipo',         'mindfulness',
      'archivo',      'slow-food-mood-dia-02.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Notaste alguna diferencia con el agua de ayer? ¿En el cuerpo, en el ánimo?',
      'pregunta_tarde',  '¿Cómo fue la espera del remojo? ¿Pudiste resistir la tentación de acelerar?',
      'pregunta_noche',  '¿Qué sabor te ha dejado el caldo? ¿Cómo describirías el umami con otras palabras?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 3 — Masa de pan de espelta
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  'Masa de pan de espelta con levado lento',
  'Hoy no comes el pan. Solo preparas la masa. El pan es mañana. Eso es el reto.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La fermentación láctica y el GABA del pan',
      'texto',          'Un pan con levado lento de 8-12 horas produce GABA. La fermentación láctica de la levadura convierte el glutamato del trigo en ácido gamma-aminobutírico — el neurotransmisor de la calma. Los panes industriales de 45 minutos no tienen este proceso. El pan lento no es solo más nutritivo: es bioquímicamente diferente. Hoy preparas la masa. Mañana horneas. La espera es el ingrediente.',
      'concepto_clave', 'Fermentación láctica y síntesis de GABA en el pan lento'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Mezcla la masa antes de las 22h — hornea mañana',
      'instruccion', 'Mezcla los ingredientes hasta que no haya harina seca. No amasar en exceso. Forma una bola, tapa con film y deja fermentar a temperatura ambiente (18-22°C) entre 8 y 12 horas.',
      'por_que',     'El levado lento a temperatura ambiente favorece las bacterias lácticas sobre la levadura comercial. Resultado: más GABA, más sabor, menos gluten problemático.',
      'duracion',    '10 minutos de preparación + 8-12 horas de levado'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Pan de espelta con levado lento (8-12h)',
      'ingredientes', jsonb_build_array(
        '400g harina de espelta integral',
        '300ml agua tibia (no caliente — 30°C)',
        '4g levadura seca de panadero',
        '8g sal',
        '1 cda aceite de oliva virgen extra'
      ),
      'pasos', jsonb_build_array(
        'Disuelve la levadura en el agua tibia. Espera 5 minutos (verás pequeñas burbujas).',
        'Mezcla la harina y la sal en un bol grande.',
        'Añade el agua con levadura y el aceite. Mezcla con una espátula o las manos hasta que no quede harina seca.',
        'La masa será pegajosa — es normal con la espelta.',
        'Cubre el bol con film transparente o un paño húmedo.',
        'Deja a temperatura ambiente 8-12 horas. No en el horno, no en la nevera.',
        'Al día siguiente: precalienta el horno a 220°C con una cazuela de hierro dentro.',
        'Vuelca la masa sobre papel de hornear, hornea tapado 25 min, destapado 15 min más.'
      ),
      'por_que', 'La espelta tiene un gluten más frágil que el trigo moderno, más fácil de digerir. El levado de 8-12 horas permite que las bacterias lácticas produzcan GABA y reduzcan los antinutrientes. El resultado es un pan que alimenta el eje intestino-cerebro de forma directa.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Dejar que algo crezca solo',
      'descripcion',  'Sobre confiar en los procesos que no puedes controlar. La masa hace su trabajo mientras tú duermes.',
      'duracion_min', 4,
      'tipo',         'meditacion',
      'archivo',      'slow-food-mood-dia-03.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te sientes al empezar el día sabiendo que la masa ya está lista?',
      'pregunta_tarde',  '¿En qué momentos del día has pensado en el pan? ¿Con ansiedad o con calma?',
      'pregunta_noche',  '¿Cómo ha ido el horneado? ¿Qué ha sido lo más difícil: la espera o la ejecución?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 4 — Yogur casero
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'Yogur artesano con Lactobacillus vivos',
  'El yogur industrial pasteurizado a alta temperatura elimina los probióticos. El tuyo no lo hará.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Lactobacillus rhamnosus — la cepa de la ansiedad',
      'texto',          'El Lactobacillus rhamnosus JB-1 es la cepa con mayor evidencia en reducción de ansiedad en estudios con humanos. Actúa directamente sobre los receptores GABA del cerebro a través del nervio vago. El yogur artesano fermentado a temperatura controlada mantiene esta cepa viva. La temperatura es clave: por encima de 46°C, los lactobacilos mueren. Por debajo de 40°C, la fermentación es demasiado lenta.',
      'concepto_clave', 'Lactobacillus rhamnosus → receptores GABA → nervio vago'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara el yogur por la tarde — listo por la mañana',
      'instruccion', 'Calienta la leche a 85°C, deja enfriar a 43°C. Añade 2 cucharadas de yogur natural como inóculo. Mantén la temperatura 8-12 horas (horno apagado con la luz encendida funciona perfectamente).',
      'por_que',     'La temperatura de 43°C es el punto óptimo de actividad de Lactobacillus bulgaricus y Streptococcus thermophilus. La leche entera aporta la grasa necesaria para que los lactobacilos sobrevivan en el tracto digestivo.',
      'duracion',    '20 min activos + 8-12h de fermentación'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Yogur artesano (método horno)',
      'ingredientes', jsonb_build_array(
        '1 litro de leche entera (preferiblemente fresca o pasteurizada, no UHT)',
        '2 cdas de yogur natural sin azúcar con cultivos vivos (el inóculo)',
        'Opcional: 2 cdas de leche en polvo para un yogur más espeso'
      ),
      'pasos', jsonb_build_array(
        'Calienta la leche en un cazo a fuego medio hasta 85°C (pequeñas burbujas en los bordes). Usa termómetro si tienes.',
        'Retira del fuego. Deja enfriar hasta 43°C (tibio al tacto, no quema).',
        'En un bol pequeño, mezcla el yogur inóculo con un poco de leche tibia. Luego añádelo al cazo.',
        'Vierte en tarros de cristal o en el cazo tapado.',
        'Mete en el horno apagado con la luz interior encendida (mantiene unos 40-45°C).',
        'Deja 8-12 horas sin mover ni abrir.',
        'Cuando esté cuajado (se mueve como un flan), guarda en la nevera. Se asienta más en frío.'
      ),
      'por_que', 'El yogur casero mantiene los cultivos vivos intactos. Lactobacillus bulgaricus produce ácido láctico que preserva el yogur. Streptococcus thermophilus produce acetaldehído, responsable del sabor característico. Juntos, crean un ambiente que favorece a otras bacterias beneficiosas en tu intestino.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Confiar en lo que no ves',
      'descripcion',  'La fermentación ocurre en oscuridad y silencio. Como los procesos de curación reales.',
      'duracion_min', 4,
      'tipo',         'mindfulness',
      'archivo',      'slow-food-mood-dia-04.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Ha cuajado el yogur? ¿Qué sientes al ver algo que has creado desde cero?',
      'pregunta_tarde',  '¿Has comido el yogur? ¿Cuál es la diferencia de sabor con el industrial?',
      'pregunta_noche',  '¿Hay algo en tu vida que también necesite simplemente tiempo para cuajar?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 5 — Limonada lacto-fermentada
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'Limonada lacto-fermentada (lista en 48h)',
  'Hoy preparas algo que beberás el día 7. La semana tiene un ritmo y tú estás aprendiendo a vivirlo.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La fermentación salvaje — bacterias de tu entorno',
      'texto',          'La fermentación lacto-fermentada no usa levaduras añadidas. Usa las bacterias que ya viven en el limón, en el aire de tu cocina, en tus manos. Es la fermentación más antigua del mundo. El resultado es una bebida con ácido láctico natural, vitamina C multiplicada por la fermentación, y bacterias vivas adaptadas literalmente a tu ambiente. No hay nada más local que esto.',
      'concepto_clave', 'Fermentación salvaje y microbioma localizado'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara la limonada hoy — bébela el día 7',
      'instruccion', 'Mezcla el zumo, el agua, la sal y el azúcar en un tarro de cristal. Tapa no del todo hermética (o usa un paño). Deja a temperatura ambiente 48 horas. Verás pequeñas burbujas: señal de fermentación activa.',
      'por_que',     'La sal inhibe las bacterias patógenas y favorece los lactobacilos. El azúcar es el alimento de la fermentación, no quedará nada dulce al final. Las burbujas son CO2, subproducto de la fermentación láctica.',
      'duracion',    '10 min preparación + 48h fermentación'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Limonada lacto-fermentada (48h)',
      'ingredientes', jsonb_build_array(
        '4 limones (zumo + ralladura de 2)',
        '800ml agua mineral sin gas',
        '1 cdta sal marina sin refinar',
        '2 cdas azúcar de caña (o miel)',
        'Opcional: hojas de menta, rodajas de jengibre'
      ),
      'pasos', jsonb_build_array(
        'Exprima los limones. Ralle la piel de dos de ellos.',
        'Mezcla el zumo, la ralladura, el agua, la sal y el azúcar en un tarro de cristal de 1 litro.',
        'Remueve bien hasta que el azúcar y la sal estén disueltos.',
        'Añade la menta y el jengibre si los usas.',
        'Tapa con un paño de tela fijado con una goma — no hermético.',
        'Deja a temperatura ambiente (18-24°C) 48 horas.',
        'Verás pequeñas burbujas en la superficie: la fermentación está activa.',
        'A las 48 horas, cuela, tapa herméticamente y guarda en nevera.',
        'Bébela el día 7 como cierre de la semana.'
      ),
      'por_que', 'La fermentación multiplica la vitamina C (el ácido ascórbico se transforma en formas más biodisponibles). Los lactobacilos producen ácido láctico y bacteriocinas que protegen el intestino. El resultado es una bebida refrescante con propiedades prebióticas reales.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo es saber que algo que preparas hoy no lo disfrutarás hasta pasado mañana?',
      'pregunta_tarde',  '¿Has visto las primeras burbujas? ¿Qué sientes al observar un proceso vivo?',
      'pregunta_noche',  '¿En qué otras áreas de tu vida te cuesta esperar resultados que vienen con tiempo?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 6 — Pollo marinado 12 horas
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'Pollo marinado en yogur y especias (12h)',
  'El marinado no es solo sabor. Es química. Las proteínas del yogur rompen las fibras del pollo a nivel molecular.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La glicina del colágeno y el sueño profundo',
      'texto',          'Cuando marinas una proteína animal durante horas, el ácido láctico del yogur rompe el colágeno de las fibras musculares y libera glicina. La glicina es un aminoácido con propiedades hipnóticas documentadas: un gramo de glicina antes de dormir mejora la arquitectura del sueño REM en estudios clínicos. La cocina lenta no es solo más sabrosa: es farmacológicamente diferente.',
      'concepto_clave', 'Colágeno → glicina → sueño REM y regulación del NMDA'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Marina el pollo esta noche — cocínalo mañana',
      'instruccion', 'Mezcla el yogur con las especias. Cubre el pollo completamente. Tapa y deja en la nevera 12 horas mínimo (hasta 24h si quieres).',
      'por_que',     'El ácido láctico del yogur desnaturaliza las proteínas superficiales del pollo. La cúrcuma y la pimienta negra (piperina) tienen efecto antiinflamatorio sinérgico. El tiempo hace que las especias penetren hasta el centro de la carne.',
      'duracion',    '10 min preparación + 12h marinado'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Pollo marinado en yogur, cúrcuma y jengibre',
      'ingredientes', jsonb_build_array(
        '4 contramuslos o muslos de pollo (con piel)',
        '200g yogur natural artesano (el que hiciste el día 4, si puedes)',
        '1 cdta cúrcuma en polvo',
        '1 cdta jengibre en polvo (o 2cm fresco rallado)',
        '1/2 cdta pimienta negra recién molida',
        '1 cdta sal marina',
        '2 dientes de ajo rallados',
        '1 cda aceite de oliva',
        'Zumo de medio limón'
      ),
      'pasos', jsonb_build_array(
        'Mezcla en un bol el yogur, la cúrcuma, el jengibre, la pimienta, la sal, el ajo, el aceite y el limón.',
        'Practica pequeños cortes en el pollo para que el marinado penetre bien.',
        'Cubre el pollo completamente con la mezcla.',
        'Mete en un recipiente tapado o en una bolsa de zip.',
        'Guarda en la nevera 12-24 horas.',
        'Al día siguiente: saca el pollo 30 min antes de cocinarlo para que atempere.',
        'Hornea a 200°C 35-40 min, o cocina en sartén a fuego medio-bajo 20 min por lado.'
      ),
      'por_que', 'El yogur rompe el colágeno y libera glicina. La cúrcuma inhibe la COX-2 (enzima proinflamatoria). La piperina de la pimienta aumenta la biodisponibilidad de la curcumina x20. El resultado es una proteína más digestible, más nutritiva y con mayor concentración de aminoácidos calmantes.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'La transformación invisible',
      'descripcion',  'Lo que ocurre en la nevera mientras duermes. Sobre los cambios que no se ven pero sí se notan.',
      'duracion_min', 3,
      'tipo',         'mindfulness',
      'archivo',      'slow-food-mood-dia-06.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo huele la cocina esta mañana? ¿Anticipas con placer o con impaciencia?',
      'pregunta_tarde',  '¿Has cocinado el pollo? ¿Cómo es la textura comparada con un pollo sin marinar?',
      'pregunta_noche',  '¿Qué ha sido lo más gratificante de esta semana hasta ahora?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 7 — Integración semana 1
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  'Ensalada de fermentos y limonada lacto-fermentada',
  'Hoy se cierra la semana con todo lo que has creado: la limonada del día 5, el yogur del día 4, el pan del día 3.',
  jsonb_build_object(
    'fase', 'espera',
    'semana', 1,
    'hito', jsonb_build_object(
      'titulo',      'Primera semana completada',
      'descripcion', 'Has aprendido a esperar. Has creado cosas que necesitaban tiempo. Tu sistema nervioso ya sabe que la espera vale la pena.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El microbioma se construye en semanas, no en días',
      'texto',          'Una semana de fermentos no transforma tu microbioma de forma permanente, pero sí envía señales importantes a tu sistema inmune y a tu nervio vago. Los estudios muestran que una dieta alta en fermentados durante 10 semanas aumenta la diversidad microbiana y reduce los marcadores de inflamación. Llevas 7 días. Tienes 14 más. Hoy celebras el inicio.',
      'concepto_clave', 'Diversidad microbiana y modulación del sistema inmune innato'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cena de integración — usa todo lo que has creado',
      'instruccion', 'Ensalada de hojas verdes con el yogur como aliño, pan del día 3 tostado, y la limonada lacto-fermentada como bebida. Si tienes el pollo del día 6 sobrante, añádelo.',
      'por_que',     'Combinar fermentos distintos en la misma comida aporta diversidad de cepas bacterianas. El ácido láctico del yogur y de la limonada activan receptores GPR43 y GPR41 en las células intestinales, que a su vez envían señales antiinflamatorias al cerebro.',
      'duracion',    '15 minutos de montaje'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Ensalada de fermentos — cena de integración semana 1',
      'ingredientes', jsonb_build_array(
        'Hojas verdes mixtas (espinacas, rúcula, canónigos)',
        '2-3 cdas de yogur artesano del día 4 (aliño)',
        'Pan del día 3, tostado (o pan de masa madre)',
        'Limonada lacto-fermentada del día 5 (bebida)',
        'Pollo del día 6 (opcional)',
        'Nueces y semillas de girasol',
        'Sal, aceite de oliva'
      ),
      'pasos', jsonb_build_array(
        'Mezcla las hojas verdes en un bol amplio.',
        'Aliña con el yogur artesano, un chorrito de aceite, sal y pimienta.',
        'Añade las nueces y las semillas.',
        'Incorpora el pollo si lo tienes.',
        'Tuesta el pan y colócalo al lado.',
        'Sirve con un vaso de limonada lacto-fermentada.',
        'Come despacio. Esta cena es la culminación de una semana de trabajo paciente.'
      ),
      'por_que', 'Esta cena combina probióticos del yogur, prebióticos de las hojas verdes, ácido láctico de la limonada, glicina del pollo marinado y GABA del pan de levado lento. Es la dieta del sistema nervioso en un plato.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo empiezas este día 7? ¿Hay algo diferente en cómo te sientes respecto al día 1?',
      'pregunta_tarde',  '¿Has podido preparar la cena de integración? ¿Qué ha sido lo más sorprendente de esta semana?',
      'pregunta_noche',  '¿Qué has aprendido sobre la espera esta semana? ¿Qué quieres llevar a la semana 2?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 2 — "El cuerpo que respira" (días 8-14)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 8 — Chucrut casero
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 8,
  'Chucrut casero — iniciación (lista en 7 días)',
  'Hoy inicias el chucrut. Lo comerás el día 14 y los días siguientes. La paciencia ahora se mide en semanas.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El chucrut y los receptores de serotonina intestinal',
      'texto',          'El chucrut contiene Lactobacillus plantarum, una cepa que en estudios clínicos ha demostrado reducir la ansiedad social y aumentar la concentración de serotonina en el intestino. El mecanismo es la modulación del receptor 5-HT4 en las células enterocromafines, que liberan serotonina al nervio vago. El chucrut industrial pasteurizado no tiene este efecto: los lactobacilos mueren con el calor. Solo el chucrut crudo, fermentado en casa o comprado sin pasteurizar, funciona.',
      'concepto_clave', 'L. plantarum → receptor 5-HT4 → serotonina intestinal → nervio vago'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara el chucrut hoy — lo comerás el día 14',
      'instruccion', 'Ralla el repollo fino, añade sal (20g por kilo de repollo) y masajea con fuerza 10 minutos hasta que suelte líquido. Mete en un tarro de cristal presionando bien para que el repollo quede sumergido en su propio líquido. Deja a temperatura ambiente cubierto con un paño.',
      'por_que',     'La sal inhibe los patógenos pero no los lactobacilos. El líquido (salmuera natural) crea un ambiente anaeróbico donde L. plantarum prospera. A 18-22°C, la fermentación es activa en 3-7 días.',
      'duracion',    '20 min preparación + 7 días fermentación'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Chucrut casero básico',
      'ingredientes', jsonb_build_array(
        '1kg repollo blanco (o col)',
        '20g sal marina sin refinar (2% del peso del repollo)',
        'Opcional: 1 cdta semillas de alcaravea, 1 hoja de laurel'
      ),
      'pasos', jsonb_build_array(
        'Retira las hojas exteriores del repollo (guarda una hoja grande para tapar).',
        'Ralla el repollo muy fino con mandolina o cuchillo.',
        'Pesa el repollo y añade el 2% de su peso en sal.',
        'Masajea con fuerza durante 10 minutos. El repollo soltará líquido (salmuera natural).',
        'Añade las especias opcionales.',
        'Mete en un tarro de cristal de 1 litro, presionando capa a capa.',
        'Coloca la hoja de repollo reservada encima para que todo quede sumergido.',
        'Tapa con un paño fijado con goma — no hermético.',
        'Deja a temperatura ambiente (18-22°C) 7 días, alejado de la luz directa.',
        'Pruébalo cada 2 días. En 5-7 días estará listo (ácido, crujiente).',
        'Cuando esté a tu gusto, tapa herméticamente y guarda en nevera (dura meses).'
      ),
      'por_que', 'El chucrut es el probiótico más estudiado en relación con el eje intestino-cerebro. Contiene L. plantarum, L. brevis y L. mesenteroides. Juntos producen ácido láctico, GABA y vitamina K2 (crucial para la salud cardiovascular). 30g al día tienen efecto medible en el microbioma en 4 semanas.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te sientes al empezar una semana que tiene como tema la respiración?',
      'pregunta_tarde',  '¿Has preparado el chucrut? ¿Cómo fue el proceso de masajear el repollo?',
      'pregunta_noche',  '¿Qué significa para ti "respirar" más allá del acto físico?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 9 — Sopa de miso
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 9,
  'Sopa de miso con tofu y alga wakame',
  'El miso nunca hierve. Se añade al final, disuelto en un poco de caldo frío. El calor mata los probióticos.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El miso y el isoflavona de soja — fito-GABA',
      'texto',          'El miso fermentado contiene isoflavonas de soja transformadas por las bacterias en equol y daidzeína, formas más biodisponibles con efecto modulador sobre los receptores GABA-A. Además, el proceso de fermentación del miso produce ácido glutámico libre (umami), precursor del GABA. Una taza de sopa de miso al día durante 30 días reduce los marcadores de estrés oxidativo en estudios japoneses de cohorte.',
      'concepto_clave', 'Isoflavonas fermentadas → equol → receptores GABA-A'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Sopa de miso como ritual de la mañana o la noche',
      'instruccion', 'Prepara el caldo de kombu del día 2 (o usa agua caliente). Hidrata el alga wakame 5 minutos. Añade el tofu. Fuera del fuego, disuelve el miso en un poco de caldo frío y añádelo a la sopa.',
      'por_que',     'El miso no debe hervir: las temperaturas superiores a 60°C destruyen los microorganismos vivos. El caldo de kombu aporta el umami base. El tofu añade proteína completa y más isoflavonas.',
      'duracion',    '15 minutos'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Sopa de miso tradicional con wakame y tofu',
      'ingredientes', jsonb_build_array(
        '800ml caldo de kombu (del día 2, o nuevo)',
        '2 cdas miso de cebada o de arroz (no pasteurizado)',
        '5g alga wakame seca',
        '100g tofu firme cortado en cubos',
        '1 cebolleta picada fina',
        'Opcional: setas enoki, semillas de sésamo'
      ),
      'pasos', jsonb_build_array(
        'Hidrata el alga wakame en agua fría 5 minutos. Escurre y trocea.',
        'Calienta el caldo de kombu hasta casi hervir.',
        'Baja el fuego al mínimo. Añade el tofu, el wakame y las setas si las usas.',
        'Cocina 3-4 minutos a fuego suave.',
        'Retira del fuego. Espera 1 minuto.',
        'Disuelve el miso en un cuenco pequeño con 3-4 cdas de caldo (templado, no caliente).',
        'Añade el miso disuelto a la sopa. No vuelvas a calentar.',
        'Sirve con la cebolleta y el sésamo.'
      ),
      'por_que', 'El miso de cebada (mugi miso) tiene el mayor contenido en bacterias vivas tras el natto. Contiene Aspergillus oryzae, que produce enzimas digestivas. El wakame aporta fucoidan (polisacárido antiinflamatorio) y yodo para la tiroides. El tofu añade precursores de serotonina (triptófano).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo es tu respiración esta mañana? ¿Profunda, superficial, entrecortada?',
      'pregunta_tarde',  '¿Has preparado la sopa? ¿Qué te ha parecido la técnica de no hervir el miso?',
      'pregunta_noche',  '¿Qué conexión ves entre comer lento y respirar mejor?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 10 — Hummus desde cero
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 10,
  'Hummus desde cero — garbanzos en remojo 12h',
  'El hummus de bote tiene ácido cítrico para conservar. El tuyo tendrá el triple de biodisponibilidad de zinc y hierro.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El remojo como digestión anticipada',
      'texto',          'Las legumbres contienen ácido fítico, que forma complejos con el zinc, el hierro y el magnesio haciéndolos no biodisponibles. El remojo de 12-24 horas activa la enzima fitasa, que hidroliza el ácido fítico y libera estos minerales. El zinc es esencial para la síntesis de serotonina. El magnesio modula los receptores NMDA del estrés. Empapar los garbanzos no es un truco de abuela: es bioquímica aplicada.',
      'concepto_clave', 'Ácido fítico → fitasa → biodisponibilidad de zinc y magnesio'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Pon los garbanzos en remojo esta noche — cocina y tritura mañana',
      'instruccion', 'Cubre los garbanzos secos con el doble de su volumen en agua fría. Añade una pizca de bicarbonato (opcional, acelera el remojo). Deja 12-24 horas.',
      'por_que',     'El bicarbonato alcaliniza el agua y activa más enzima fitasa. El remojo largo (24h) puede reducir el ácido fítico hasta en un 50%.',
      'duracion',    '5 min preparación + 12h remojo + 60 min cocción + 10 min triturado'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Hummus casero desde cero',
      'ingredientes', jsonb_build_array(
        '300g garbanzos secos (en remojo 12-24h)',
        '3 cdas tahini (pasta de sésamo)',
        'Zumo de 1 limón grande',
        '2 dientes de ajo',
        '3-4 cdas aceite de oliva virgen extra',
        '1 cdta comino en polvo',
        'Sal al gusto',
        'Agua de cocción de los garbanzos (para ajustar textura)',
        'Para servir: pimentón ahumado, aceite, perejil'
      ),
      'pasos', jsonb_build_array(
        'Escurre y aclara los garbanzos del remojo.',
        'Cocina en agua nueva con sal 45-60 minutos (o en olla a presión 20 min). Reserva el agua de cocción.',
        'Separa una cda de garbanzos para decorar.',
        'Tritura los garbanzos calientes con el ajo en el robot de cocina hasta que estén finos.',
        'Añade el tahini, el zumo de limón, el comino y 2 cdas de aceite. Tritura 3-4 minutos (importante: tiempo largo = cremosidad).',
        'Ajusta con agua de cocción hasta la textura deseada. Añade sal.',
        'Sirve con un hilo de aceite, pimentón y los garbanzos reservados.'
      ),
      'por_que', 'Los garbanzos son la legumbre más rica en triptófano (precursor de serotonina). El tahini añade metionina y zinc. El aceite de oliva aporta ácido oleico, que activa CCK (colecistoquinina), hormona de la saciedad. El hummus casero tiene 3 veces más zinc biodisponible que el de bote.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué hábito de esta semana te está costando más mantener?',
      'pregunta_tarde',  '¿Has comido el hummus? ¿Qué diferencia notas respecto al de bote?',
      'pregunta_noche',  '¿Hay algo en tu vida cotidiana que también necesitaría "un remojo" para ser más digerible?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 11 — Vinagreta de vinagre de manzana o kombucha
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 11,
  'Vinagreta de vinagre de manzana o kombucha',
  'El vinagre de manzana con la madre tiene aceto-bacterias vivas. El pasteurizado no. Mira el fondo del frasco.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El ácido acético y los receptores GPR43',
      'texto',          'El ácido acético del vinagre de manzana activa los receptores GPR43 (receptor de ácidos grasos de cadena corta) en las células del intestino grueso. Estos receptores envían señales antiinflamatorias y regulan la producción de GLP-1 (hormona de la saciedad y el estado de ánimo). Una cucharada de vinagre de manzana con "la madre" en el aliño diario tiene efectos medibles en la glucemia postprandial y en la diversidad microbiana.',
      'concepto_clave', 'Ácido acético → GPR43 → señalización antiinflamatoria y GLP-1'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Vinagreta que usarás toda la semana',
      'instruccion', 'Prepara la vinagreta en un tarro pequeño. Úsala durante los próximos 3-4 días en tus ensaladas y verduras.',
      'por_que',     'Preparar en cantidad te obliga a usarla. El vinagre de manzana con la madre se conserva bien a temperatura ambiente meses.',
      'duracion',    '5 minutos'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Vinagreta de vinagre de manzana o kombucha',
      'ingredientes', jsonb_build_array(
        '4 cdas aceite de oliva virgen extra',
        '2 cdas vinagre de manzana con la madre (o vinagre de kombucha casero)',
        '1 cdta mostaza de Dijon',
        '1 cdta miel cruda',
        '1 diente de ajo muy picado',
        'Sal marina y pimienta negra',
        'Opcional: hierbas frescas (tomillo, orégano, eneldo)'
      ),
      'pasos', jsonb_build_array(
        'Pon todos los ingredientes en un tarro de cristal con tapa.',
        'Agita vigorosamente 30 segundos.',
        'Prueba y ajusta (más ácido: más vinagre; más dulce: más miel).',
        'Guarda a temperatura ambiente. Agita antes de cada uso.',
        'Úsala en ensaladas, verduras asadas, sobre el hummus del día 10.'
      ),
      'por_que', 'El vinagre de manzana con la madre contiene Acetobacter y Gluconobacter (bacterias del ácido acético). El ácido acético reduce el índice glucémico de la comida siguiente hasta en un 30%, evitando el pico de cortisol postprandial. La mostaza de Dijon aporta glucosinolatos (prebióticos para Bifidobacterium).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has podido mantener el ritmo de esta semana? ¿Qué días han sido más difíciles?',
      'pregunta_tarde',  '¿Has usado la vinagreta? ¿Notas diferencia en cómo te sienta la comida?',
      'pregunta_noche',  '¿Qué has aprendido sobre tu relación con la comida estas dos semanas?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 12 — Congee de arroz
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 12,
  'Congee de arroz con jengibre y sésamo',
  'El congee necesita 60-90 minutos. No se acelera. Ese es el punto.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El almidón resistente y las células L del intestino',
      'texto',          'El arroz cocido lentamente y enfriado produce almidón resistente tipo 3 — un prebiótico que alimenta específicamente a Faecalibacterium prausnitzii, la bacteria más antiinflamatoria del microbioma humano. Las células L del intestino producen GLP-1 cuando son alimentadas con almidón resistente. El congee preparado la noche anterior y recalentado tiene el doble de almidón resistente que el recién hecho.',
      'concepto_clave', 'Almidón resistente tipo 3 → F. prausnitzii → GLP-1 y antiinflamación'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cocina el congee a fuego muy lento — 60-90 minutos',
      'instruccion', 'El congee es arroz cocinado con mucha agua (ratio 1:10) durante largo tiempo hasta que los granos se rompen y la textura es cremosa y sedosa. No tiene prisa.',
      'por_que',     'El tiempo largo rompe la estructura del arroz y libera beta-glucano, una fibra soluble que alimenta las bifidobacterias. El jengibre tiene efecto procinético (mejora el vaciado gástrico) y reduce la inflamación intestinal.',
      'duracion',    '10 min preparación + 60-90 min cocción suave'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Congee de arroz con jengibre y sésamo',
      'ingredientes', jsonb_build_array(
        '100g arroz de grano corto (o jasmine)',
        '1 litro caldo de kombu o de verduras',
        '3cm jengibre fresco pelado y rallado',
        '2 cebolletas',
        '1 cda salsa de soja o tamari',
        '1 cdta aceite de sésamo (para acabar)',
        'Semillas de sésamo tostadas',
        'Opcional: huevo pochado, tofu frito'
      ),
      'pasos', jsonb_build_array(
        'Aclara el arroz con agua fría.',
        'Lleva el caldo a ebullición en una olla grande.',
        'Añade el arroz y el jengibre. Baja el fuego al mínimo.',
        'Cocina 60-90 minutos removiendo de vez en cuando, hasta que los granos se rompan y la textura sea cremosa.',
        'Añade la salsa de soja al gusto.',
        'Sirve en cuencos. Añade las cebolletas picadas, el aceite de sésamo y el sésamo tostado.',
        'Añade el huevo o el tofu si los usas.'
      ),
      'por_que', 'El arroz cocinado muy lento libera más beta-glucano que el arroz normal. El congee enfriado y recalentado tiene almidón resistente tipo 3. El jengibre (gingerol) inhibe la COX-2 y la 5-LOX (enzimas inflamatorias). El aceite de sésamo aporta sesamol (antioxidante neuroprotector).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has usado la vinagreta estos días? ¿Qué diferencia nota tu digestión?',
      'pregunta_tarde',  '¿Has podido dedicar 90 minutos a cocinar hoy? ¿Cómo ha sido esa experiencia?',
      'pregunta_noche',  '¿Qué aspecto de la cocina lenta te está resultando más difícil de integrar en tu vida?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 13 — Pickles rápidos
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 13,
  'Pickles rápidos de pepino, zanahoria y rábano',
  'Estos pickles no son fermentados: son encurtidos en vinagre. Distintos mecanismos, igualmente válidos. Aprende la diferencia.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Encurtidos vs fermentados — dos caminos al intestino',
      'texto',          'Los fermentados (chucrut, kéfir, miso) contienen bacterias vivas que colonizan el intestino. Los encurtidos en vinagre no tienen bacterias vivas, pero sí ácido acético, que activa directamente los receptores GPR43 del intestino grueso. Son complementarios, no competidores. Hoy aprendes los encurtidos rápidos, que se hacen en horas. El chucrut del día 8, que tarda días. Ambos merecen espacio en tu nevera.',
      'concepto_clave', 'Encurtidos: ácido acético directo. Fermentados: bacterias vivas. Efectos distintos, sinérgicos.'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Pickles en 2-4 horas — listos para la cena de mañana',
      'instruccion', 'Corta las verduras, prepara la salmuera de vinagre caliente, vierte sobre las verduras en tarros, tapa y deja enfriar. En 2-4 horas a temperatura ambiente ya son comestibles. En la nevera aguantan 2 semanas.',
      'por_que',     'El vinagre caliente penetra más rápido en las células vegetales. Las especias (eneldo, pimienta) añaden polifenoles y aceites esenciales con propiedades antimicrobianas selectivas.',
      'duracion',    '20 minutos + 2-4 horas de espera'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Pickles rápidos mixtos',
      'ingredientes', jsonb_build_array(
        '2 pepinos pequeños (o 1 grande)',
        '2 zanahorias medianas',
        '4-5 rábanos',
        '300ml vinagre de manzana o blanco',
        '300ml agua',
        '1 cda sal marina',
        '1 cda azúcar de caña',
        '1 cdta semillas de mostaza',
        '1 cdta semillas de eneldo (o eneldo fresco)',
        '1 diente de ajo por tarro',
        'Opcional: guindilla, granos de pimienta negra'
      ),
      'pasos', jsonb_build_array(
        'Lava y corta las verduras: pepinos en bastones, zanahorias en juliana, rábanos en rodajas.',
        'Distribuye las verduras en tarros de cristal limpios con el ajo y las especias.',
        'Lleva a ebullición el vinagre, el agua, la sal y el azúcar. Remueve hasta disolver.',
        'Vierte la salmuera caliente sobre las verduras hasta cubrirlas.',
        'Deja enfriar sin tapar. Cuando estén a temperatura ambiente, tapa.',
        'Prueba a partir de las 2-4 horas. El sabor mejora al día siguiente.',
        'Guarda en nevera. Duran 2 semanas.'
      ),
      'por_que', 'Los rábanos contienen sulforafano e indoles, compuestos que modulan el metabolismo del estrógeno y tienen efecto neuroprotector. La zanahoria aporta carotenoides y fibra pectínica (prebiótico). El pepino hidrata y aporta sílice para la integridad de la mucosa intestinal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo va el chucrut del día 8? ¿Ya huele ácido? ¿Has probado?',
      'pregunta_tarde',  '¿Has preparado los pickles? ¿Qué diferencia de sabor notas con los encurtidos de bote?',
      'pregunta_noche',  '¿Cuál de las preparaciones de estas dos semanas ha sido la más reveladora para ti?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 14 — Cena de integración semana 2
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 14,
  'Cena de integración — el primer chucrut y los fermentos de la semana',
  'El chucrut del día 8 lleva ya 7 días fermentando. Hoy lo pruebas por primera vez.',
  jsonb_build_object(
    'fase', 'respiracion',
    'semana', 2,
    'hito', jsonb_build_object(
      'titulo',      'Dos semanas completadas',
      'descripcion', 'Has creado tu primer chucrut, tu primera sopa de miso, tu primer hummus desde cero. Tu microbioma tiene nuevos aliados.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'La diversidad microbiana como resilencia emocional',
      'texto',          'Cada fermento que has introducido estas dos semanas aporta cepas bacterianas distintas: L. plantarum del chucrut, Aspergillus oryzae del miso, Lactobacillus del yogur, Acetobacter del vinagre. Esta diversidad no es accidental: el microbioma más diverso es el más resiliente ante el estrés. Estudios de cohorte en poblaciones con alta diversidad microbiana muestran menor incidencia de ansiedad, depresión y síntomas de burnout. Llevas dos semanas construyendo esa diversidad.',
      'concepto_clave', 'Diversidad microbiana → resilencia al estrés → modulación del eje HPA'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cena de integración con todos los fermentos de la semana',
      'instruccion', 'Monta una tabla de fermentos: chucrut, pickles, hummus, yogur como salsa. Añade verduras crudas, pan tostado y una taza de sopa de miso o caldo de kombu como bebida caliente.',
      'por_que',     'Combinar varios fermentos en la misma comida aporta diversidad de cepas en una sola sesión. Los estudios de microbioma muestran que la variedad en un solo día tiene mayor impacto que la repetición del mismo alimento.',
      'duracion',    '15 minutos de montaje'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Tabla de fermentos — cena de integración semana 2',
      'ingredientes', jsonb_build_array(
        '3-4 cdas chucrut casero (día 8)',
        'Pickles mixtos (día 13)',
        'Hummus casero (día 10)',
        '2 cdas yogur artesano (día 4)',
        'Verduras crudas: zanahoria, apio, pepino',
        'Pan de espelta o masa madre tostado',
        'Taza de sopa de miso (día 9) o caldo de kombu (día 2)',
        'Vinagreta de vinagre de manzana (día 11) para aliñar'
      ),
      'pasos', jsonb_build_array(
        'Saca los fermentos de la nevera 15 minutos antes para que estén a temperatura ambiente.',
        'Monta una tabla o varios cuencos pequeños con los fermentos.',
        'Prepara las verduras crudas cortadas para dipear.',
        'Tuesta el pan.',
        'Prepara la sopa de miso o calienta el caldo (sin hervir el miso).',
        'Come despacio. Observa los sabores: ácido, umami, salado, fresco.',
        'Escribe después en el diario.'
      ),
      'por_que', 'Esta cena es la mayor concentración de probióticos, prebióticos y ácidos grasos de cadena corta en una sola comida desde que empezaste el reto. Cada cucharada de chucrut contiene entre 10 y 100 millones de UFC (unidades formadoras de colonias) de lactobacilos vivos.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'El cuerpo que has construido estas dos semanas',
      'descripcion',  'Una reflexión guiada sobre lo que ha cambiado. No en el espejo: en el sistema nervioso.',
      'duracion_min', 5,
      'tipo',         'reflexion',
      'archivo',      'slow-food-mood-dia-14.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo describes tu nivel de ansiedad hoy comparado con el día 1?',
      'pregunta_tarde',  '¿Cómo ha sido el primer chucrut? ¿Demasiado ácido, justo, suave?',
      'pregunta_noche',  '¿Qué hábito de estas dos semanas quieres mantener para siempre? ¿Por qué?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 3 — "Tu nuevo ritmo" (días 15-21)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 15 — Caldo de huesos lento
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 15,
  'Caldo de huesos de cocción lenta (4-8 horas)',
  'Este caldo no se puede acelerar. La gelatina y la glicina solo se liberan con tiempo y temperatura baja.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La glicina del colágeno y la reparación de la mucosa intestinal',
      'texto',          'El caldo de huesos cocinado durante 4-8 horas libera glicina, prolina e hidroxiprolina del colágeno óseo. La glicina tiene tres efectos relevantes para la ansiedad: (1) es cofactor de la síntesis de glutatión (antioxidante maestro), (2) modula los receptores NMDA del estrés, (3) mejora la calidad del sueño REM. La prolina repara la mucosa intestinal, reduciendo la permeabilidad intestinal que está en la base de la inflamación crónica de bajo grado asociada a la ansiedad.',
      'concepto_clave', 'Colágeno → glicina + prolina → reparación de mucosa + sueño REM'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Pon el caldo por la mañana — listo a mediodía o por la tarde',
      'instruccion', 'Usa el horno a 150°C o el fuego más bajo de tu cocina. El caldo debe temblar, no hervir. Las burbujas grandes rompen el colágeno antes de tiempo.',
      'por_que',     'La temperatura de 80-90°C durante 4-8 horas es la óptima para extraer el colágeno sin degradarlo. A 100°C (hervor fuerte), el colágeno se destruye antes de gelificar.',
      'duracion',    '15 min preparación + 4-8h cocción muy suave'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Caldo de huesos de pollo o ternera (cocción lenta)',
      'ingredientes', jsonb_build_array(
        '1-1,5kg huesos de pollo (carcasa, alitas) o ternera (rodilla, espinazo)',
        '2 zanahorias',
        '2 tallos de apio',
        '1 cebolla partida por la mitad',
        '4 dientes de ajo enteros',
        '2 cdas vinagre de manzana (activa la extracción del colágeno)',
        '1 hoja de laurel, tomillo, perejil',
        '2 litros de agua fría',
        'Sal al gusto (añadir al final)'
      ),
      'pasos', jsonb_build_array(
        'Opcional pero recomendado: tuesta los huesos en horno a 200°C 20 min para más sabor.',
        'Pon todos los ingredientes en una olla grande o slow cooker.',
        'Añade el vinagre de manzana — importante: activa la liberación del colágeno y el calcio.',
        'Lleva a casi hervor (verás burbujas pequeñas). Baja al mínimo.',
        'Cocina 4-8 horas. Desespuma si es necesario en las primeras 30 min.',
        'Cuela con un colador fino.',
        'Si el caldo gelatiniza al enfriar, has hecho un caldo rico en colágeno.',
        'Bebe una taza caliente al día. Guarda el resto en la nevera (3 días) o congela.'
      ),
      'por_que', 'El ácido acético del vinagre disuelve parcialmente el calcio y el colágeno del hueso, facilitando su extracción. El caldo que gelatiniza al enfriar contiene suficiente colágeno para tener efecto terapéutico. Una taza al día durante 8 semanas reduce los marcadores de permeabilidad intestinal (zonulina) en estudios clínicos.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'El tiempo como ingrediente sagrado',
      'descripcion',  'La última semana empieza aquí. Un audio sobre construir tu nuevo ritmo desde la cocina.',
      'duracion_min', 5,
      'tipo',         'meditacion',
      'archivo',      'slow-food-mood-dia-15.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo empiezas esta tercera semana? ¿Qué es diferente respecto al día 1?',
      'pregunta_tarde',  '¿Ha gelificado el caldo al enfriarse? ¿Qué sientes al beber algo que necesitó 6 horas?',
      'pregunta_noche',  '¿Qué significa para ti "tener un ritmo propio" en tu vida diaria?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 16 — Kimchi iniciación
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 16,
  'Kimchi casero — iniciación (versión suave)',
  'El kimchi tradicional lleva gochugaru (chile coreano). Esta versión usa pimentón suave si el picante no es lo tuyo.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La capsaicina y los endocannabinoides del bienestar',
      'texto',          'La capsaicina del kimchi activa los receptores TRPV1, que en el intestino estimulan la producción de endocannabinoides — las moléculas del bienestar que también activa el ejercicio y la risa. El sistema endocannabinoide modula la respuesta al estrés, la inflamación y la percepción del dolor. Un microbioma diverso produce más endocannabinoides de forma endógena. El kimchi lo activa desde dos frentes: la capsaicina y las bacterias vivas.',
      'concepto_clave', 'Capsaicina → TRPV1 → endocannabinoides → regulación del estrés'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Kimchi en tarro hoy — listo en 2-3 días',
      'instruccion', 'Esta versión del kimchi usa col china (pak choi o napa) en lugar del repollo coreano tradicional. Fermenta más rápido (2-3 días) y tiene un sabor más suave.',
      'por_que',     'La col napa tiene mayor contenido en glucosinolatos que el repollo. La pasta de ajo y jengibre actúa como agente antimicrobiano selectivo que favorece a los lactobacilos.',
      'duracion',    '30 min preparación + 2-3 días fermentación'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Kimchi de col napa (versión suave)',
      'ingredientes', jsonb_build_array(
        '1 col napa (o pak choi) mediana (~800g)',
        '2 cdas sal marina',
        '3 dientes de ajo rallados',
        '2cm jengibre fresco rallado',
        '2 cdas pimentón dulce o suave (o gochugaru si te gusta el picante)',
        '1 cdta azúcar de caña o miel',
        '3-4 cebolletas cortadas en trozos de 3cm',
        '1 cda salsa de soja o tamari',
        'Opcional: 1 zanahoria rallada'
      ),
      'pasos', jsonb_build_array(
        'Corta la col en trozos de 3-4cm. Sala y mezcla bien. Deja reposar 1 hora.',
        'Aclara la sal con agua fría. Escurre y aprieta bien para eliminar el exceso de agua.',
        'Prepara la pasta: mezcla el ajo, el jengibre, el pimentón, el azúcar y la salsa de soja.',
        'Con guantes, mezcla la col escurrida con la pasta, las cebolletas y la zanahoria.',
        'Aprieta bien en un tarro de cristal, presionando para eliminar burbujas de aire.',
        'Deja 2-3 cm de espacio libre en el tarro.',
        'Tapa no herméticamente o usa un tarro de fermentación.',
        'Deja a temperatura ambiente 2-3 días. En verano, 1-2 días.',
        'Cuando esté activo (burbujas al presionar, aroma ácido), guarda en nevera.'
      ),
      'por_que', 'El kimchi contiene Leuconostoc mesenteroides, Lactobacillus sakei y L. plantarum. Estudios coreanos muestran que el consumo regular de kimchi reduce los marcadores de ansiedad en un 20% en 8 semanas. El jengibre añade gingerol y shogaol (antiinflamatorios). El ajo contiene alicina (antimicrobiano selectivo que favorece bacterias beneficiosas).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu digestión esta semana comparada con la primera?',
      'pregunta_tarde',  '¿Has preparado el kimchi? ¿Cómo ha sido mezclar los ingredientes a mano?',
      'pregunta_noche',  '¿Qué sabor o textura de estas tres semanas ha sido el más sorprendente?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 17 — Overnight oats con kéfir
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 17,
  'Overnight oats con kéfir y frutos rojos',
  'La avena en remojo con kéfir overnight tiene el doble de beta-glucano disponible que la avena cocida.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El beta-glucano de la avena y la IL-10',
      'texto',          'El beta-glucano de la avena activa macrófagos y células dendríticas para producir IL-10 (interleucina 10), la citoquina antiinflamatoria más potente del sistema inmune. La IL-10 cruza la barrera hematoencefálica y activa la microglía neuroprotectora. El resultado es un cerebro menos inflamado, con mayor plasticidad sináptica. El remojo en kéfir activa las enzimas del grano que hidrolizan el beta-glucano haciéndolo más biodisponible.',
      'concepto_clave', 'Beta-glucano → IL-10 → microglía antiinflamatoria → neuroprotección'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara el desayuno esta noche — listo mañana',
      'instruccion', 'Mezcla la avena con el kéfir y la leche. Añade las semillas y la canela. Tapa y deja en la nevera toda la noche. Por la mañana, solo añades los frutos rojos.',
      'por_que',     'El ácido láctico del kéfir activa la fitasa de la avena, reduciendo el ácido fítico. El remojo largo predigiere el almidón, reduciendo el índice glucémico y evitando el pico de cortisol matutino.',
      'duracion',    '5 min preparación + una noche de reposo'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Overnight oats con kéfir y frutos rojos',
      'ingredientes', jsonb_build_array(
        '80g copos de avena (no instantánea)',
        '150ml kéfir natural',
        '100ml leche de avena o vaca',
        '1 cda semillas de chía',
        '1 cda semillas de lino molidas',
        '1 cdta canela',
        '1 cda miel cruda o sirope de arce',
        '100g frutos rojos frescos o congelados',
        'Opcional: nueces, mantequilla de almendra'
      ),
      'pasos', jsonb_build_array(
        'Mezcla la avena, el kéfir, la leche, la chía, el lino, la canela y la miel en un tarro de cristal.',
        'Remueve bien. La mezcla parecerá líquida — está bien.',
        'Tapa y deja en la nevera toda la noche (mínimo 6 horas).',
        'Por la mañana, la avena habrá absorbido el líquido y tendrá textura cremosa.',
        'Añade los frutos rojos y los toppings al momento de comer.',
        'Cómelo frío o caliéntalo 1 minuto si lo prefieres tibio.'
      ),
      'por_que', 'Los frutos rojos (arándanos, frambuesas, moras) contienen antocianinas, flavonoides que atraviesan la barrera hematoencefálica y tienen efecto antidepresivo demostrado en estudios con humanos. La chía aporta omega-3 ALA (precursor de EPA y DHA). El kéfir introduce L. kefiri y otras cepas no presentes en el yogur.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo es empezar el día con algo que preparaste la noche anterior?',
      'pregunta_tarde',  '¿Cómo ha sido el desayuno? ¿Qué diferencia notas en tu energía de mañana?',
      'pregunta_noche',  '¿Cuál de los tres principios del reto (espera, respiración, ritmo) sientes más integrado?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 18 — Salsa de tomate fermentada
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 18,
  'Salsa de tomate fermentada (24-48h)',
  'El licopeno del tomate se vuelve hasta 5 veces más biodisponible cuando el tomate se calienta y se fermenta.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El licopeno y la neuroprotección',
      'texto',          'El licopeno es el carotenoide más potente para la salud cerebral. Cruza fácilmente la barrera hematoencefálica, reduce la oxidación lipídica en las neuronas y tiene efecto antiapoptótico (protege las neuronas de la muerte celular). Estudios en humanos asocian mayores niveles de licopeno plasmático con menor riesgo de depresión. El tomate cocinado tiene 3-5 veces más licopeno biodisponible que el crudo. El fermentado lo convierte en formas aún más activas.',
      'concepto_clave', 'Licopeno → barrera hematoencefálica → neuroprotección y antiapoptosis'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cocina la salsa hoy — fermenta 24-48h — úsala el resto de la semana',
      'instruccion', 'Cocina la salsa de tomate básica. Déjala enfriar completamente. Añade una cucharada de yogur natural o de chucrut como inóculo. Tapa no herméticamente y deja a temperatura ambiente 24-48 horas.',
      'por_que',     'La fermentación de la salsa de tomate reduce los oxalatos (que inhiben la absorción de calcio) y multiplica los compuestos bioactivos del licopeno. El inóculo del yogur o el chucrut introduce lactobacilos que se multiplican en el ambiente ácido de la salsa.',
      'duracion',    '30 min cocción + 24-48h fermentación'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Salsa de tomate fermentada',
      'ingredientes', jsonb_build_array(
        '800g tomates maduros (o 2 latas de tomate entero pelado)',
        '1 cebolla mediana',
        '4 dientes de ajo',
        '3 cdas aceite de oliva virgen extra',
        '1 cdta orégano seco',
        '1 cdta sal marina',
        '1 pizca azúcar',
        '1 cda yogur natural o 1 cda de líquido de chucrut (inóculo fermentador)',
        'Albahaca fresca al servir'
      ),
      'pasos', jsonb_build_array(
        'Sofríe la cebolla y el ajo en aceite a fuego medio 8-10 minutos, hasta que estén muy blandos.',
        'Añade los tomates. Cocina a fuego medio-bajo 20-25 minutos removiendo a menudo.',
        'Tritura con batidora hasta que esté suave. Añade la sal, el orégano y el azúcar.',
        'Deja enfriar completamente a temperatura ambiente.',
        'Cuando esté fría, añade el yogur o el líquido de chucrut. Remueve bien.',
        'Tapa con un paño de tela (no hermético) y deja fermentar 24-48h a temperatura ambiente.',
        'Cuando notes un ligero aroma ácido y sabor más complejo, está lista.',
        'Guarda en nevera tapada herméticamente. Dura 1 semana.'
      ),
      'por_que', 'El aceite de oliva multiplica la absorción del licopeno (es liposoluble). La fermentación crea ácido láctico que descompone la matriz vegetal, liberando más licopeno. La combinación de tomate cocinado + aceite + fermentación es la máxima biodisponibilidad posible de este compuesto neuroprotector.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está el kimchi del día 16? ¿Ya lo has probado?',
      'pregunta_tarde',  '¿Ves la diferencia entre una salsa "normal" y una fermentada?',
      'pregunta_noche',  '¿Hay algo en tu vida que también mejore con tiempo y fermentación — una relación, un proyecto, una idea?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 19 — Pan de masa madre
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 19,
  'Pan de masa madre — el más lento del reto',
  'Si no tienes masa madre, usa el método poolish (pre-fermentado de 12h). El resultado es muy parecido.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'El GABA del pan de larga fermentación',
      'texto',          'La fermentación láctica del trigo durante 12-24 horas produce GABA directamente en el pan. Los lactobacilos convierten el glutamato del gluten en ácido gamma-aminobutírico. Un estudio de 2019 (Coda et al.) mostró que el pan de masa madre contiene entre 5 y 10 veces más GABA que el pan convencional. Cuando lo comes, ese GABA no pasa directamente al cerebro (la barrera hematoencefálica es selectiva), pero activa receptores GABA en el intestino que envían señales calmantes al cerebro a través del nervio vago.',
      'concepto_clave', 'Fermentación láctica → GABA en el pan → receptores intestinales → nervio vago'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Método poolish — prepara el pre-fermentado esta noche',
      'instruccion', 'Si tienes masa madre activa: úsala directamente. Si no: prepara el poolish mezclando partes iguales de harina y agua con una pizca de levadura. Deja 12h a temperatura ambiente. Al día siguiente, añade el resto de ingredientes y deja levar 4-6h más.',
      'por_que',     'El poolish es un pre-fermentado que imita la función de la masa madre: las bacterias lácticas tienen tiempo de producir GABA, ácido láctico y acético. El pan resultante tiene mejor digestibilidad y sabor más complejo.',
      'duracion',    '5 min poolish esta noche + 4-6h levado mañana + 45 min horneado'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Pan de masa madre o poolish (levado lento)',
      'ingredientes', jsonb_build_array(
        'POOLISH (preparar la noche anterior):',
        '100g harina de fuerza',
        '100ml agua fría',
        '1g levadura seca',
        '',
        'MASA (al día siguiente):',
        '300g harina de fuerza (o mezcla trigo + espelta)',
        '200ml agua tibia',
        'Todo el poolish',
        '8g sal',
        '1 cda aceite de oliva'
      ),
      'pasos', jsonb_build_array(
        'NOCHE ANTERIOR: mezcla la harina, el agua y la pizca de levadura del poolish. Tapa y deja a temperatura ambiente.',
        'AL DÍA SIGUIENTE: el poolish habrá burbujeado y crecido. Huele a yogur — es correcto.',
        'Mezcla todo el poolish con la harina, el agua y el aceite. Mezcla hasta integrar.',
        'Deja reposar 20 minutos (autólisis).',
        'Añade la sal. Amasa 8-10 minutos hasta que la masa sea elástica.',
        'Deja levar tapado 4-6 horas a temperatura ambiente, haciendo 3-4 pliegues en las primeras 2 horas.',
        'Da forma. Deja reposar 30 min más.',
        'Hornea en cazuela de hierro (o bandeja) a 230°C: 25 min tapado, 15 min destapado.'
      ),
      'por_que', 'El pan de larga fermentación tiene ácido láctico y acético que reducen el índice glucémico hasta en un 40%. El gluten parcialmente digerido por las bacterias es menos problemático para personas sensibles. El GABA producido activa señalización calmante en el intestino.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'Amasar como práctica de presencia',
      'descripcion',  'Amasar pan es uno de los actos más meditactivos que existen. Sin pantalla. Solo las manos, la harina y el tiempo.',
      'duracion_min', 4,
      'tipo',         'mindfulness',
      'archivo',      'slow-food-mood-dia-19.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo ha cambiado tu relación con la cocina en estas tres semanas?',
      'pregunta_tarde',  '¿Has horneado el pan? ¿Qué sientes al amasar sin prisa?',
      'pregunta_noche',  '¿Cuál es la preparación de la que te sientes más orgulloso o orgullosa?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 20 — Cena completa slow
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 20,
  'Cena completa slow — el protocolo completo en una mesa',
  'Esta noche tienes todo lo que necesitas: caldo, fermentos, pan, yogur. Has construido una despensa viva.',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'La mesa como sistema nervioso parasimpático',
      'texto',          'El sistema nervioso parasimpático (el "descansar y digerir") se activa cuando comemos sentados, sin pantallas, en presencia de aromas, texturas y sabores complejos. La investigación sobre "mindful eating" muestra que comer una comida completa en 30 minutos o más aumenta la secreción de CCK, GLP-1 y péptido YY — las tres hormonas de la saciedad y el bienestar. Esta noche no hay prisa. La mesa es el destino.',
      'concepto_clave', 'Sistema parasimpático + CCK + GLP-1 → saciedad y bienestar integrados'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Prepara la mesa. Sin teléfono. Sin prisa.',
      'instruccion', 'Monta una cena completa con todo lo que has creado: caldo como primer plato, fermentos como acompañamiento, proteína simple, pan de masa madre o espelta, postre de yogur. Pon la mesa bien. Apaga el teléfono. Come en al menos 30 minutos.',
      'por_que',     'El acto de preparar la mesa, poner vajilla, encender una vela o servir con cuidado activa el sistema parasimpático antes de empezar a comer. La anticipación sensorial (el olor, la vista) ya dispara la secreción de enzimas digestivas.',
      'duracion',    '30-45 min preparación + 30 min de cena consciente'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Cena completa slow — menú de integración semana 3',
      'ingredientes', jsonb_build_array(
        'PRIMER PLATO: taza de caldo de huesos del día 15 (calentar suavemente)',
        'PRINCIPAL: proteína simple (huevo pochado, salmón al vapor, pollo horneado)',
        'ACOMPAÑAMIENTOS: chucrut del día 8, kimchi del día 16, pickles del día 13',
        'PAN: pan de masa madre o espelta del día 19 (o del día 3)',
        'ALIÑO: vinagreta de vinagre de manzana del día 11',
        'BEBIDA: té de jengibre con miel o agua tibia con limón',
        'POSTRE: yogur artesano con miel y nueces'
      ),
      'pasos', jsonb_build_array(
        'Prepara la mesa con cuidado: mantel, vela si tienes, copa de agua.',
        'Calienta el caldo suavemente (no hervir).',
        'Prepara la proteína elegida.',
        'Saca los fermentos de la nevera 15 min antes.',
        'Tuesta el pan.',
        'Siéntate. Apaga el teléfono.',
        'Empieza con el caldo caliente. Bébelo despacio.',
        'Sigue con la proteína y los fermentos. Come sin prisa.',
        'Termina con el yogur y la miel.'
      ),
      'por_que', 'Esta cena concentra: glicina del caldo (sueño REM), probióticos de los fermentos (nervio vago), GABA del pan (calma), ácidos grasos omega-3 del salmón (si lo elegiste), y bacterias vivas del yogur (eje intestino-cerebro). Es la cena más nutritiva para el sistema nervioso que puedes preparar con tus propias manos.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'La mesa como lugar sagrado',
      'descripcion',  'Un audio para acompañar la preparación de la cena. Sobre hacer del acto de comer una práctica de presencia.',
      'duracion_min', 5,
      'tipo',         'meditacion',
      'archivo',      'slow-food-mood-dia-20.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué emoción sientes al saber que mañana es el último día?',
      'pregunta_tarde',  '¿Has podido comer sin teléfono? ¿Cuánto tiempo ha durado la cena?',
      'pregunta_noche',  '¿Qué ha cambiado en ti en estas tres semanas? Sé específico o específica.'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 21 — Receta libre y celebración
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 21,
  'Tu receta libre — la que más te ha cambiado',
  'Hoy no hay instrucciones. Solo una pregunta: ¿qué quieres preparar tú?',
  jsonb_build_object(
    'fase', 'ritmo',
    'semana', 3,
    'hito', jsonb_build_object(
      'titulo',      '21 días completados — tu nuevo ritmo está construido',
      'descripcion', 'Has aprendido a esperar, has aprendido a respirar a través de la cocina y has construido un ritmo que solo tú tienes. La lentitud ya es tuya.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El hábito está instalado — la ciencia del ritual',
      'texto',          'Según la investigación de Phillippa Lally (UCL), un nuevo hábito se consolida entre los 18 y los 66 días, con una media de 66 días. Llevas 21. Eso no es el final: es el momento en que el hábito empieza a ser automático. Los participantes en estudios de cocina lenta que completan 21 días reportan una reducción media del 31% en los síntomas de ansiedad autoevaluados. Hoy celebras ese inicio.',
      'concepto_clave', 'Formación de hábitos: 66 días de media. Los 21 primeros son el andamiaje.'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Vuelve a hacer la receta que más te ha cambiado',
      'instruccion', 'No tienes que hacer algo nuevo. Haz la preparación que más has disfrutado, que más te ha sorprendido o que más has notado en tu cuerpo o en tu ánimo. El yogur, el caldo, el chucrut, el pan... Lo que sea. Hazlo con presencia. Es tu ritual.',
      'por_que',     'La repetición consciente de un ritual refuerza las vías neuronales asociadas a la calma y el placer. Cada vez que repites la preparación, el circuito de la recompensa se activa un poco más fácil.',
      'duracion',    'El tiempo que necesite tu receta elegida'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo',            'Tu nuevo microbioma',
      'texto',             'En 21 días no has cambiado tu microbioma de forma permanente. Pero has enviado señales claras: que hay fibra, que hay fermentados, que hay tiempo y calma. Tu intestino ha respondido: más diversidad, más GABA, más serotonina. Sigue. Los cambios reales en el microbioma se miden en meses. Llevas tres semanas de ventaja.',
      'alimento_estrella', 'El que más te ha gustado de los 21 días'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Lo que llevas contigo',
      'texto',  'Sal: que el ritmo lento no es un lujo. Es una necesidad biológica. Tu sistema nervioso evolutivamente no está diseñado para la velocidad del siglo XXI. La cocina lenta no es una tendencia gastronómica. Es una intervención de salud mental que no tiene efectos secundarios, no necesita prescripción y huele bien mientras la haces. Sigue preparando cosas que necesitan tiempo. Tu microbioma, tu nervio vago y tu corteza prefrontal te lo agradecerán.'
    ),
    'audio', jsonb_build_object(
      'titulo',       'El final es el principio',
      'descripcion',  'El audio de cierre del reto. Sobre lo que te llevas y lo que dejas atrás.',
      'duracion_min', 5,
      'tipo',         'celebracion',
      'archivo',      'slow-food-mood-dia-21.mp3'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué preparación has elegido para hoy? ¿Por qué esa?',
      'pregunta_tarde',  '¿Cómo ha sido repetirla sabiendo que es el día 21?',
      'pregunta_noche',  '¿Qué le dirías a la persona que eras el día 1 de este reto?'
    )
  )
FROM public.challenges c WHERE c.slug = 'slow-food-mood'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
