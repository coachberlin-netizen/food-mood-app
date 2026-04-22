-- ── challenge_logs ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.challenge_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES public.challenges(id),
  day_number   int,
  pregunta_manana text,
  pregunta_tarde  text,
  pregunta_noche  text,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id, day_number)
);
ALTER TABLE public.challenge_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "challenge_logs_select_own" ON public.challenge_logs;
CREATE POLICY "challenge_logs_select_own" ON public.challenge_logs
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenge_logs_insert_own" ON public.challenge_logs;
CREATE POLICY "challenge_logs_insert_own" ON public.challenge_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "challenge_logs_update_own" ON public.challenge_logs;
CREATE POLICY "challenge_logs_update_own" ON public.challenge_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Food-Mood Reset — reto ────────────────────────────────────────────────────
INSERT INTO public.challenges
  (slug, title, subtitle, description, category, duration_days, price_eur, color, emoji, recipe_count, audio_count)
VALUES (
  'food-mood-reset',
  '21 días para resetear tu mente a través de la alimentación',
  'Food-Mood Reset',
  'No es una dieta. Es entender cómo lo que comes influye en cómo te sientes. Durante 21 días vas a descubrir cómo tu alimentación afecta a tu energía, estado de ánimo, ansiedad y claridad mental.',
  'salud_mental',
  21,
  29,
  '#7B68AD',
  '🧠',
  21,
  21
)
ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description;

-- ── Semana 1 — Observar ───────────────────────────────────────────────────────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'Tu intestino tiene algo que decirte.',
  'Un vaso de agua tibia con limón al levantarte',
  jsonb_build_object(
    'push_message', '🧠 Día 1 — Empieza el reset. Tu intestino y tu mente están más conectados de lo que crees.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El eje intestino-cerebro',
      'texto', '¿Sabías que el intestino y el cerebro se comunican constantemente? No es metáfora. Es biología real. Existe un cable directo entre los dos — se llama nervio vago — y manda señales en los dos sentidos. Por eso cuando tienes nervios, se te cierra el estómago. Y por eso cuando comes mal varios días seguidos, tu ánimo baja sin saber por qué. Este reto va de entender esa conexión y usarla a tu favor.',
      'concepto_clave', 'eje intestino-cerebro'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Un vaso de agua tibia con limón al levantarte',
      'instruccion', 'Antes del café, antes del móvil, antes de cualquier cosa: un vaso de agua tibia con el zumo de medio limón. Eso es todo.',
      'por_que', 'Activa la producción de bilis, despierta el sistema digestivo y estimula el nervio vago. Es la señal más suave que puedes darle a tu intestino para que empiece el día en modo calma, no en modo alarma.',
      'duracion', '21 días — este hábito se queda'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Hoy: conoce tu microbiota',
      'texto', 'Tu intestino tiene entre 38 y 100 billones de bacterias. No son un problema — son tus aliadas. Las bacterias de tu microbiota producen el 90% de la serotonina de tu cuerpo, la molécula que más influye en tu estado de ánimo. Cuando esas bacterias están bien alimentadas, tú te sientes mejor. Cuando están en desequilibrio, la ansiedad, la niebla mental y el bajón de energía aparecen.',
      'alimento_estrella', 'Yogur natural sin azúcar (si no lo tomas ya, empieza hoy con 1 cucharada)'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Bienvenida al reset — 3 minutos',
      'descripcion', 'Audio de introducción al reto. Tono calmado y cercano. Explica en 3 minutos qué vas a sentir estas semanas y por qué funciona. Sin tecnicismos.',
      'duracion_min', 3,
      'tipo', 'introduccion',
      'archivo', 'audio/reset/dia01-bienvenida.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No tienes que cambiar todo de golpe. Tienes que empezar a observar. Durante estos 21 días, tu trabajo no es hacerlo perfecto — es prestar atención. ¿Cómo te sientes después de comer? ¿Hay alimentos que te activan o que te apagan? Esa información vale más que cualquier dieta.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo has dormido? (1-5) ¿Cuál es tu energía al levantarte? (1-5)',
      'pregunta_tarde', '¿Has notado algún cambio en tu estado de ánimo después de comer?',
      'pregunta_noche', 'En una palabra: ¿cómo ha sido tu día emocionalmente?'
    ),
    'reflexion', 'Tu cuerpo no es tu enemigo. Lleva tiempo intentando decirte algo. Este reto es aprender a escucharlo.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'La fábrica de tu buen humor está en el intestino.',
  'Desayuno con triptófano',
  jsonb_build_object(
    'push_message', '😊 Día 2 — La serotonina no viene del cerebro. Viene de lo que desayunas.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Serotonina: el estado de ánimo empieza en el desayuno',
      'texto', 'La serotonina es la molécula que más influye en cómo te sientes durante el día. Cuando está alta, tienes calma, enfoque y energía estable. Cuando baja, aparecen la irritabilidad, el bajón y las ganas de comer azúcar. Lo que mucha gente no sabe: el 90% de la serotonina del cuerpo se fabrica en el intestino, no en el cerebro. Y su materia prima es el triptófano — un aminoácido que obtienes de lo que comes. Si tu desayuno no tiene triptófano, tu serotonina empieza el día en déficit.',
      'concepto_clave', 'triptófano → serotonina'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Desayuno con triptófano',
      'instruccion', 'Elige uno de estos desayunos hoy: (1) Huevo + tostada de centeno + plátano. (2) Yogur natural + nueces + plátano. (3) Avena con leche + almendras + canela. Lo que tienen en común: proteína + carbohidrato complejo. Esa combinación es la que abre la puerta al triptófano hacia el cerebro.',
      'por_que', 'La insulina que genera el carbohidrato desplaza otros aminoácidos de la sangre, dejando el camino libre para que el triptófano llegue al cerebro y se convierta en serotonina. No es magia — es bioquímica.',
      'duracion', 'Esta semana — elige el desayuno con triptófano todos los días'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Bifidobacterium y la serotonina',
      'texto', 'Las bacterias del género Bifidobacterium son las que más directamente influyen en la producción de serotonina intestinal. Se alimentan de fibra soluble — la que encuentras en la avena, el plátano maduro y las legumbres. Cuanta más fibra soluble comas, más Bifidobacterium tienes. Más Bifidobacterium = más serotonina = mejor estado de ánimo.',
      'alimento_estrella', 'Plátano maduro (cuanto más maduro, más fibra soluble disponible)'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Cómo funciona la serotonina — 4 minutos',
      'descripcion', 'Explicación sencilla y visual de qué es la serotonina, por qué se fabrica en el intestino y cómo el desayuno influye en tu estado de ánimo durante todo el día.',
      'duracion_min', 4,
      'tipo', 'educativo',
      'archivo', 'audio/reset/dia02-serotonina.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No existe un solo medicamento para la depresión o la ansiedad que no actúe, de una forma u otra, sobre la serotonina. Sin embargo, la manera más directa de influir en ella está en tu cocina. No es una alternativa a los tratamientos médicos — es una capa adicional de cuidado que muchos profesionales todavía no te cuentan.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué has desayunado? ¿Cómo te has sentido 1h después?',
      'pregunta_tarde', 'Energía a las 12h (1-5). Energía a las 16h (1-5). ¿Diferencia?',
      'pregunta_noche', '¿Ha habido algún momento de bajón hoy? ¿A qué hora? ¿Habías comido algo antes?'
    ),
    'reflexion', 'Observar sin juzgar. Hoy no cambias nada más — solo prestas atención a cómo te sientes después de comer.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  '¿Por qué a las 4 de la tarde todo se derrumba?',
  'Elimina el azúcar del desayuno',
  jsonb_build_object(
    'push_message', '📉 Día 3 — El pico de glucosa que nadie te explicó. Hoy lo entiendes.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El pico de glucosa y el bajón emocional',
      'texto', 'Cuando comes azúcar o carbohidratos refinados (pan blanco, galletas, bollería, zumos), tu glucosa en sangre sube muy rápido. Tu cuerpo responde liberando insulina para bajarla. Pero a veces la baja demasiado rápido — y ahí está el problema. Ese bajón de glucosa activa la misma respuesta de estrés que el peligro real: el cortisol sube, la adrenalina sube, y te sientes irritable, con ansiedad, con ganas de comer más azúcar. No es falta de fuerza de voluntad. Es química.',
      'concepto_clave', 'glucosa → insulina → cortisol → ansiedad'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Elimina el azúcar del desayuno',
      'instruccion', 'Solo el desayuno por ahora. Revisa si lo que desayunas tiene azúcar añadido: cereales de caja, zumo, mermelada, leche con cacao azucarado. Sustitúyelo por la versión sin azúcar o por uno de los desayunos del día 2.',
      'por_que', 'El desayuno marca la curva de glucosa de toda la mañana. Un desayuno sin azúcar significa energía estable hasta la comida — sin picos, sin bajones, sin ansiedad a las 11h.',
      'duracion', 'Esta semana — desayunos sin azúcar añadido'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'El azúcar y el microbioma',
      'texto', 'El azúcar refinado alimenta a las bacterias patógenas del intestino — las que producen inflamación, no las que producen serotonina. Una dieta alta en azúcar reduce Lactobacillus y Bifidobacterium en semanas. La buena noticia: cuando reduces el azúcar, el microbioma empieza a recuperarse en 3-5 días. Tu intestino responde antes de lo que crees.',
      'alimento_estrella', 'Canela de Ceilán — regula la glucosa en sangre de forma natural, añádela al desayuno'
    ),
    'audio', jsonb_build_object(
      'titulo', 'El montaña rusa del azúcar — 5 minutos',
      'descripcion', 'Visualización guiada del ciclo glucosa-insulina-cortisol. Explicado como un proceso que ocurre en tiempo real en el cuerpo. Termina con tres preguntas de autoobservación.',
      'duracion_min', 5,
      'tipo', 'educativo_reflexivo',
      'archivo', 'audio/reset/dia03-glucosa.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No hay alimentos malos. Hay momentos y combinaciones que no funcionan para tu sistema nervioso. El azúcar por la mañana en ayunas es uno de ellos. No porque sea veneno — sino porque genera una cadena de reacciones que termina en bajón de ánimo 2 horas después. Cuando lo entiendes, ya no necesitas fuerza de voluntad para evitarlo.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuánto azúcar crees que has comido ayer? ¿Fue consciente o automático?',
      'pregunta_tarde', 'Hoy sin azúcar en el desayuno: ¿cómo ha sido la mañana comparada con ayer?',
      'pregunta_noche', '¿Has tenido ganas de algo dulce hoy? ¿A qué hora? ¿Qué estabas sintiendo en ese momento?'
    ),
    'reflexion', 'Comer azúcar cuando estás ansioso es una respuesta lógica del cuerpo buscando serotonina rápida. No te juzgues. Entiéndelo.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'Tienes un segundo cerebro. Y hoy lo vas a alimentar.',
  'Introduce tu primer fermentado',
  jsonb_build_object(
    'push_message', '🦠 Día 4 — Tu microbiota y tu estado de ánimo son la misma cosa.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'La microbiota: el órgano invisible que gestiona tus emociones',
      'texto', 'Tu intestino tiene más neuronas que la médula espinal. Hay más ADN bacteriano en tu microbiota que ADN humano en todo tu cuerpo. Y esas bacterias producen neurotransmisores reales — serotonina, GABA, dopamina — que influyen directamente en cómo te sientes. Cuando la microbiota está en equilibrio, el sistema nervioso también lo está. Cuando está alterada (por antibióticos, estrés, ultraprocesados o azúcar), la ansiedad, el bajón y la niebla mental aparecen.',
      'concepto_clave', 'psicoboóticos — bacterias que cuidan la mente'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Introduce tu primer fermentado',
      'instruccion', 'Elige uno: (1) Kéfir natural sin azúcar — 150 ml al día. (2) Yogur natural sin azúcar — 150 g al día. (3) Chucrut crudo sin pasteurizar — 1-2 cucharadas al día. Añádelo a una de tus comidas. Si tienes el estómago sensible, empieza con 1 cucharada y ve subiendo.',
      'por_que', 'Los fermentados son la fuente más directa de bacterias vivas para el intestino. Una sola cucharada de chucrut crudo tiene más Lactobacillus que la mayoría de suplementos probióticos del mercado.',
      'duracion', 'Todo el reto — 1 fermentado al día como mínimo'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Lactobacillus rhamnosus — el psicoboótico más estudiado',
      'texto', 'El Lactobacillus rhamnosus es la cepa bacteriana con más estudios en salud mental. En experimentos con modelos de ansiedad, su administración redujo los comportamientos ansiosos de forma comparable a medicamentos ansiolíticos. Lo hace aumentando los receptores GABA-A en el cerebro. Lo encuentras en el kéfir natural sin pasteurizar y en algunos yogures de calidad.',
      'alimento_estrella', 'Kéfir natural sin azúcar — la fuente más rica en Lactobacillus rhamnosus de acceso fácil'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Meditación de conexión intestino-mente — 6 minutos',
      'descripcion', 'Respiración guiada con atención plena en la zona abdominal. Visualización del intestino como centro de calma. Termina con un momento de gratitud hacia el cuerpo.',
      'duracion_min', 6,
      'tipo', 'meditacion',
      'archivo', 'audio/reset/dia04-meditacion-intestino.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'Los psicoboóticos no son un concepto alternativo. Son una línea de investigación activa en las mejores universidades del mundo — Harvard, Oxford, el APC Microbiome Institute de Cork. La psiquiatría nutricional es una disciplina emergente que cada vez más psiquiatras incorporan como parte del tratamiento. No sustituye nada. Añade una capa que hasta ahora nadie te había enseñado.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu digestión esta semana? ¿Normal, pesada, irregular?',
      'pregunta_tarde', '¿Has añadido el fermentado hoy? ¿Cómo te has sentido después?',
      'pregunta_noche', '¿Hay algún patrón entre lo que comes y cómo te sientes que estés empezando a notar?'
    ),
    'reflexion', 'Tu microbiota tarda entre 2 y 4 semanas en cambiar de forma significativa. Pero los primeros efectos — menos hinchazón, más calma digestiva — se sienten antes. Observa.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'Hay un cable entre tu intestino y tu cerebro. Se activa cuando masticas.',
  'Come una comida al día sin pantallas, masticando despacio',
  jsonb_build_object(
    'push_message', '🌬️ Día 5 — El nervio vago. El hábito más infravalorado de la salud mental.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El nervio vago: el cable que decide si estás en calma o en alerta',
      'texto', 'El nervio vago es el nervio más largo del cuerpo. Sale del cerebro, pasa por el corazón, los pulmones y llega hasta el intestino. Es el cable principal del sistema nervioso parasimpático — el modo calma, descanso y digestión. Cuando el tono vagal es alto, te recuperas rápido del estrés, digeries bien y tu estado de ánimo es estable. Cuando es bajo, la ansiedad se instala, la digestión falla y el bajón emocional se hace crónico. El tono vagal se puede entrenar. Y una de las formas más directas es masticar despacio.',
      'concepto_clave', 'tono vagal — el nivel de calma de tu sistema nervioso'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Come una comida al día sin pantallas, masticando despacio',
      'instruccion', 'Elige una comida hoy — desayuno, comida o cena — y cómela sin móvil, sin tele y sin prisa. Mastica cada bocado mínimo 15-20 veces. No hace falta contar — solo nota cuándo el alimento ya no tiene textura antes de tragar.',
      'por_que', 'Comer con pantallas activa el sistema simpático (modo estrés). El cerebro no puede procesar la pantalla y la digestión a la vez. Cuando comes sin distracciones, el nervio vago se activa, la digestión mejora y la sensación de saciedad llega antes y más clara.',
      'duracion', 'Esta semana — al menos 1 comida al día sin pantallas'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Los fermentados y el nervio vago',
      'texto', 'Los Lactobacillus y Bifidobacterium del kéfir y el yogur natural estimulan los receptores del nervio vago en el colon. Es una relación directa: más bacterias beneficiosas → más activación vagal → más tono parasimpático → más calma.',
      'alimento_estrella', 'Caldo de huesos casero o caldo de verduras — rico en glicina, que activa el nervio vago directamente'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Respiración vagal — 5 minutos',
      'descripcion', 'Técnica de respiración 4-7-8 guiada con voz calmada. Explicación de cómo la exhalación larga activa el nervio vago. Ideal para hacer antes de comer.',
      'duracion_min', 5,
      'tipo', 'respiracion',
      'archivo', 'audio/reset/dia05-respiracion-vagal.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'Comer con prisa y con el móvil es, literalmente, comer en modo estrés. El cuerpo en ese estado prioriza el cortisol sobre la digestión, la glucosa sube más rápido y la saciedad llega tarde o no llega. No es un problema de disciplina. Es un problema de sistema nervioso. La solución más simple y más infravalorada: siéntate, respira y come.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Sueles comer con pantallas? ¿En qué comidas?',
      'pregunta_tarde', '¿Has probado comer sin pantallas hoy? ¿Qué has notado?',
      'pregunta_noche', '¿Cuándo fue la última vez que comiste sin prisa y sin distracciones?'
    ),
    'reflexion', 'La calma en la mesa no es un lujo. Es medicina. El nervio vago lo registra cada vez.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'La inflamación no siempre duele. A veces solo te apaga.',
  'Añade omega-3 a tu día',
  jsonb_build_object(
    'push_message', '🔥 Día 6 — Inflamación de bajo grado. La causa silenciosa del bajón.',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Inflamación de bajo grado: el fuego lento que apaga la mente',
      'texto', 'Cuando pensamos en inflamación pensamos en una herida o una infección. Pero existe otro tipo — la inflamación de bajo grado, crónica, silenciosa — que no duele pero que altera profundamente la química del cerebro. Las citocinas inflamatorias (IL-6, TNF-α) interfieren directamente con la síntesis de serotonina y dopamina. Reducen la sensibilidad de los receptores de estas moléculas en el cerebro. La causa más común: dieta alta en ultraprocesados, aceites vegetales refinados, azúcar y bajo en omega-3.',
      'concepto_clave', 'citocinas inflamatorias → bloqueo de serotonina → bajón'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Añade omega-3 a tu día',
      'instruccion', 'Elige uno: (1) Un puñado de nueces — 30 g con el desayuno o snack. (2) Una cucharada de semillas de lino molido en el yogur o la avena. (3) Caballa, sardinas o salmón en la comida o cena.',
      'por_que', 'Los omega-3 (EPA y DHA) son los antiinflamatorios más potentes que existen en la dieta. Inhiben directamente la producción de citocinas inflamatorias. Y más importante: mejoran la fluidez de las membranas de las neuronas, haciendo que los receptores de serotonina y dopamina funcionen mejor.',
      'duracion', 'Todos los días del reto'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Microbiota y antiinflamación',
      'texto', 'Akkermansia muciniphila es la bacteria que refuerza la barrera intestinal. Cuando la barrera está dañada, las toxinas bacterianas (LPS) pasan al torrente sanguíneo y disparan la inflamación sistémica. Akkermansia se alimenta de polifenoles — los que encuentras en los arándanos, el cacao puro, el té verde y el aceite de oliva virgen extra.',
      'alimento_estrella', 'Nueces — omega-3 + polifenoles + melatonina vegetal en un solo alimento'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Body scan de inflamación — 7 minutos',
      'descripcion', 'Meditación de exploración corporal guiada. Atención a zonas de tensión, digestión y energía. Finaliza con una visualización de calma y resolución.',
      'duracion_min', 7,
      'tipo', 'meditacion',
      'archivo', 'audio/reset/dia06-body-scan.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'Los estudios más recientes en psiquiatría nutricional muestran que una dieta mediterránea reduce el riesgo de depresión hasta un 33%. No porque sea mágica — sino porque es naturalmente alta en omega-3, polifenoles, fibra y fermentados, y baja en los ingredientes que generan inflamación. No necesitas seguir una dieta estricta. Necesitas entender qué patrones inflaman y cuáles calman.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo es tu nivel de energía al levantarte esta semana? ¿Mejor que al empezar el reto?',
      'pregunta_tarde', '¿Has añadido las nueces u omega-3 hoy? ¿En qué comida?',
      'pregunta_noche', '¿Notas alguna diferencia en tu claridad mental comparado con el día 1?'
    ),
    'reflexion', 'Lo que pones en el plato cada día es, literalmente, una instrucción para tu sistema inflamatorio. No hace falta perfección — hace falta dirección.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  'Una semana. Ya tienes datos propios.',
  'Revisa tus registros de la semana',
  jsonb_build_object(
    'push_message', '🎉 Día 7 — Primera semana completada. ¿Qué has notado?',
    'semana', 1,
    'fase', 'observar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El resumen de lo que has aprendido esta semana',
      'texto', 'Esta semana has empezado a entender que tu estado de ánimo no es aleatorio. Tiene causas concretas, biológicas, relacionadas con lo que comes, cuándo lo comes y cómo. Has conocido el eje intestino-cerebro, la serotonina intestinal, el papel del azúcar en los bajones emocionales, los psicoboóticos y el nervio vago. No es teoría abstracta — es el funcionamiento real de tu cuerpo. Y ya tienes 7 días de observación propia para empezar a ver patrones.',
      'concepto_clave', 'observación → patrones → comprensión → cambio real'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Revisa tus registros de la semana',
      'instruccion', 'Lee lo que has escrito en los registros diarios de los días 1-6. Busca respuestas a: ¿Qué alimentos te han dado más energía estable? ¿En qué momentos del día tienes más bajón de ánimo? ¿Has notado cambios al añadir el fermentado? ¿Cómo está tu digestión respecto al día 1?',
      'por_que', 'La autoobservación es la herramienta más potente de la psiquiatría nutricional. Los datos propios valen más que cualquier protocolo genérico.',
      'duracion', 'Hoy — 15 minutos de reflexión con tus registros'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', '¿Cómo está respondiendo tu microbiota?',
      'texto', 'Después de 7 días introduciendo fermentados y reduciendo azúcar, el microbioma ya ha empezado a cambiar. Los primeros síntomas de mejora: menos hinchazón, digestiones más regulares, algo menos de ansiedad post-comida. Son señales reales de que las bacterias beneficiosas están ganando terreno.',
      'alimento_estrella', 'Hoy: elige el fermentado que mejor te ha sentado esta semana y repítelo'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Reflexión guiada de la semana 1 — 8 minutos',
      'descripcion', 'Audio de cierre de semana. Preguntas de reflexión guiadas sobre los cambios notados. Visualización del intestino en calma y el cerebro equilibrado. Preparación mental para la semana 2.',
      'duracion_min', 8,
      'tipo', 'reflexion_cierre',
      'archivo', 'audio/reset/dia07-cierre-semana1.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Lo que ya has hecho',
      'texto', 'En 7 días has añadido agua con limón en ayunas, has mejorado el desayuno, has reducido el azúcar de la mañana, has introducido un fermentado, has comido una vez al día sin pantallas, has añadido omega-3. Cada uno de esos cambios tiene un efecto bioquímico real. No necesitas hacer más. Necesitas mantener lo que ya estás haciendo y añadir la semana 2 encima.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', 'Del 1 al 5: ¿cómo está tu energía esta semana comparada con la semana pasada?',
      'pregunta_tarde', 'Del 1 al 5: ¿cómo está tu estado de ánimo general?',
      'pregunta_noche', '¿Cuál ha sido el cambio más pequeño que más has notado esta semana?'
    ),
    'reflexion', 'No necesitas haber hecho todo perfecto. Necesitas haber observado. Eso es exactamente lo que has hecho.',
    'hito', jsonb_build_object(
      'dia', 7,
      'titulo', '🎉 Semana 1 completada',
      'mensaje_app', 'Has completado la primera semana. Ya entiendes cómo funciona el eje intestino-cerebro. Ya tienes tus primeros datos personales. La semana 2 es donde empieza la activación real.',
      'submensaje', 'Agua con limón ✓ Desayuno con triptófano ✓ Fermentado diario ✓ Omega-3 ✓ Nervio vago ✓',
      'cta', 'Empezar la Semana 2 →'
    )
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Semana 2 — Activar ────────────────────────────────────────────────────────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 8,
  'GABA: la molécula de la calma que comes sin saberlo.',
  'Introduce el miso o el kéfir como fuente de GABA',
  jsonb_build_object(
    'push_message', '🧘 Día 8 — Semana 2. GABA natural desde la cocina.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'GABA: el freno del sistema nervioso',
      'texto', 'El GABA (ácido gamma-aminobutírico) es el principal neurotransmisor inhibidor del sistema nervioso central. Cuando GABA está alto, hay calma, el ruido mental se apaga, el sueño llega fácil. Cuando está bajo, aparece la ansiedad, los pensamientos en bucle, la dificultad para relajarse. Los ansiolíticos más recetados del mundo (benzodiacepinas) actúan directamente sobre los receptores GABA. La buena noticia: hay alimentos y bacterias intestinales que aumentan el GABA de forma natural. Lactobacillus brevis y Lactobacillus rhamnosus producen GABA directamente en el intestino.',
      'concepto_clave', 'GABA → calma del sistema nervioso → menos ansiedad'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Introduce el miso o el kéfir como fuente de GABA',
      'instruccion', 'Opción A: Prepara un caldo de miso — disuelve 1 cucharada de miso sin pasteurizar en agua caliente (no hirviendo). Tómalo antes de cenar. Opción B: 150 ml de kéfir natural solo o con fruta, en el desayuno o merienda. Añade también una infusión de melisa o pasiflora por la noche — activan los receptores GABA-A directamente.',
      'por_que', 'El miso sin pasteurizar contiene Lactobacillus brevis, la cepa más productora de GABA entre los fermentados tradicionales. La melisa inhibe la enzima que degrada el GABA, aumentando su disponibilidad en el cerebro.',
      'duracion', 'Semana 2 y 3 — caldo de miso o kéfir diario'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Lactobacillus brevis — el productor de GABA',
      'texto', 'Lactobacillus brevis fue la primera bacteria identificada como productora directa de GABA en el intestino humano. Está presente en el miso sin pasteurizar, en el chucrut crudo y en algunos kéfires de calidad. En estudios clínicos, la administración de L. brevis durante 4 semanas mostró una reducción significativa de los síntomas de ansiedad y mejora del sueño, sin efectos secundarios.',
      'alimento_estrella', 'Miso rojo sin pasteurizar — la fuente más concentrada de Lactobacillus brevis'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Relajación muscular progresiva — 10 minutos',
      'descripcion', 'Técnica clásica de relajación de Jacobson adaptada para activar el sistema GABA. Tensión y liberación de grupos musculares con voz guiada. Ideal para antes de dormir.',
      'duracion_min', 10,
      'tipo', 'relajacion',
      'archivo', 'audio/reset/dia08-relajacion-gaba.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'La ansiedad no es un defecto de carácter. Es, entre otras cosas, un déficit de GABA. Y ese déficit tiene causas concretas: estrés crónico, mala alimentación, poco sueño, microbiota alterada. Cuando atacas esas causas desde la cocina, no estás haciendo algo alternativo — estás actuando sobre la bioquímica real que genera la ansiedad.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo ha sido tu nivel de ansiedad esta semana? ¿Hay momentos del día en que es más alta?',
      'pregunta_tarde', '¿Has tomado el caldo de miso o el kéfir hoy? ¿Cómo te has sentido después?',
      'pregunta_noche', '¿Has dormido mejor esta semana que la anterior? Anota cualquier diferencia.'
    ),
    'reflexion', 'La calma no es ausencia de problemas. Es un sistema nervioso que tiene los recursos para gestionarlos.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 9,
  '¿Por qué a veces no tienes ganas de nada? Tu dopamina tiene la respuesta.',
  'Proteína en el desayuno o primera comida del día',
  jsonb_build_object(
    'push_message', '⚡ Día 9 — Dopamina: la molécula de la motivación. Hoy la activas.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Dopamina: el motor de la motivación y el placer',
      'texto', 'La dopamina es la molécula de la motivación, el placer y la anticipación. Cuando está alta, tienes iniciativa, disfrutas las cosas, te resulta fácil empezar tareas. Cuando está baja, todo da pereza, nada interesa, la pantalla y el azúcar son los únicos placeres que funcionan (porque dan dopamina rápida pero la agotan aún más rápido). La dopamina se sintetiza a partir de tirosina, un aminoácido que obtienes de proteínas: huevos, legumbres, frutos secos, queso, pescado.',
      'concepto_clave', 'tirosina → L-DOPA → dopamina → motivación'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Proteína en el desayuno o primera comida del día',
      'instruccion', 'Añade una fuente de proteína a tu primera comida: huevo, yogur, queso fresco, nueces, legumbres. El objetivo es que la primera comida del día contenga mínimo 15-20 g de proteína. Esto marca la curva de dopamina de toda la mañana.',
      'por_que', 'La tirosina compite con otros aminoácidos para cruzar la barrera hematoencefálica. Por la mañana, con el estómago relativamente vacío, tiene ventaja. Un desayuno proteico en ayunas es la forma más directa de cargar el sistema dopaminérgico para las horas siguientes.',
      'duracion', 'Hasta el final del reto — desayuno con proteína todos los días'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'La microbiota y la dopamina',
      'texto', 'Lactobacillus plantarum y Bifidobacterium longum tienen la capacidad de aumentar los niveles de dopamina en el cerebro, posiblemente a través de la modulación del nervio vago y la reducción de la inflamación intestinal. Están presentes en el kéfir, el yogur natural y el chucrut. No producen dopamina directamente — reducen la inflamación que bloquea su síntesis.',
      'alimento_estrella', 'Huevo entero — tirosina + B2 + B12 + D3 + colina. La combinación más completa para la síntesis de dopamina'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Visualización de motivación y enfoque — 7 minutos',
      'descripcion', 'Técnica de visualización guiada para activar el sistema de recompensa. Imagen mental de logro, anticipo y energía disponible. Ideal para la mañana.',
      'duracion_min', 7,
      'tipo', 'visualizacion',
      'archivo', 'audio/reset/dia09-visualizacion-dopamina.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'El scroll infinito, el azúcar, las noticias, los likes — son todos atajos de dopamina. Generan un pico pequeño y rápido que deja el sistema más vacío que antes. Los alimentos ricos en tirosina generan dopamina más lentamente, más estable, más sostenida. No es la misma intensidad — pero es la que dura.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu motivación y energía mental esta semana?',
      'pregunta_tarde', '¿Has desayunado con proteína hoy? ¿Cómo ha sido tu concentración en la mañana?',
      'pregunta_noche', '¿Ha habido algún momento hoy de disfrute real, de placer genuino? ¿Qué lo generó?'
    ),
    'reflexion', 'La motivación no se consigue con fuerza de voluntad. Se construye con bioquímica. Y la bioquímica empieza en el plato.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 10,
  'Cuando estás estresado, gastas magnesio. Y el déficit te estresa más.',
  'Añade magnesio a tu tarde-noche',
  jsonb_build_object(
    'push_message', '✨ Día 10 — Magnesio. El mineral que más necesitas y menos tienes.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El bucle estrés-magnesio que nadie te explicó',
      'texto', 'El magnesio es cofactor de más de 300 reacciones enzimáticas en el cuerpo. Participa en la síntesis de serotonina, en la regulación del cortisol y en la activación de los receptores GABA. Cuando estás estresado, el cuerpo excreta magnesio por la orina — es una respuesta fisiológica automática. Pero ese déficit de magnesio activa más la respuesta de estrés, que excreta más magnesio, que genera más estrés. Es un bucle. Se estima que más del 70% de la población occidental tiene un aporte insuficiente de magnesio.',
      'concepto_clave', 'estrés → déficit magnesio → más estrés → bucle'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Añade magnesio a tu tarde-noche',
      'instruccion', 'Elige uno o combínalos: (1) Un cuadrado de chocolate negro >85% (3-4 g de magnesio disponible). (2) Un puñado de semillas de calabaza tostadas (ricas en magnesio + zinc). (3) Una cucharada de cacao puro en polvo en leche de avena caliente. La tarde-noche es el mejor momento — el magnesio tiene efecto relajante que prepara el sistema nervioso para el descanso.',
      'por_que', 'El magnesio activa los receptores GABA-A, los mismos que los ansiolíticos. Tomar magnesio por la tarde reduce la activación del sistema nervioso simpático antes de dormir.',
      'duracion', 'Hasta el final del reto — magnesio diario en la segunda mitad del día'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Magnesio y microbiota',
      'texto', 'El magnesio mejora la integridad de la barrera intestinal, reduciendo la permeabilidad que deja pasar toxinas bacterianas a la sangre. Una barrera intestinal sana significa menos inflamación sistémica, menos interferencia con la síntesis de serotonina y dopamina. El cacao puro es la fuente más rica en magnesio de la dieta occidental y además contiene teobromina, un alcaloide que tiene un efecto suave y sostenido sobre el estado de ánimo.',
      'alimento_estrella', 'Chocolate negro >85% — magnesio + teobromina + feniletilamina + antioxidantes. El placer que también es medicina'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Relajación nocturna con cacao — 6 minutos',
      'descripcion', 'Audio de relajación guiada para tomar mientras se bebe el cacao caliente. Respiración profunda + relajación progresiva corta. Diseñado para la rutina de noche.',
      'duracion_min', 6,
      'tipo', 'relajacion_nocturna',
      'archivo', 'audio/reset/dia10-relajacion-magnesio.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No hay pastilla de magnesio que funcione mejor que el magnesio de los alimentos reales. La biodisponibilidad del magnesio del chocolate negro o las semillas de calabaza es superior a la de la mayoría de suplementos. Cuando además lo combinas con un ritual de calma — sentarte, tomar el cacao despacio, sin pantallas — el efecto se multiplica porque el sistema nervioso parasimpático ya está activo.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo has dormido esta noche? ¿Te has despertado en algún momento?',
      'pregunta_tarde', '¿Has añadido el magnesio hoy? ¿Cuándo y en qué forma?',
      'pregunta_noche', '¿Notas diferencia en tu nivel de tensión corporal comparado con el día 1?'
    ),
    'reflexion', 'El ritual de la tarde-noche no es solo alimentación. Es una instrucción directa al sistema nervioso de que el día ha terminado.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 11,
  '¿Comes porque tienes hambre o porque tienes algo que sentir?',
  'La pausa de los 5 minutos antes de picar',
  jsonb_build_object(
    'push_message', '💭 Día 11 — Alimentación emocional. Sin juicio. Solo comprensión.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Alimentación emocional: el hambre que no es hambre',
      'texto', 'Comer emocionalmente no es un fallo de carácter. Es una respuesta aprendida y bioquímicamente lógica. Cuando estás triste, ansioso o aburrido, el cerebro busca formas rápidas de subir la dopamina y la serotonina. El azúcar, los carbohidratos refinados y los ultraprocesados hiperpalatables hacen exactamente eso — suben rápido la dopamina. El problema es que la bajada es igual de rápida, y el ciclo se repite. Entender esto no resuelve todo, pero cambia algo fundamental: dejas de culparte y empiezas a observar.',
      'concepto_clave', 'emoción → búsqueda de dopamina → comer sin hambre → observar sin juzgar'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'La pausa de los 5 minutos antes de picar',
      'instruccion', 'Hoy, cada vez que tengas impulso de comer algo fuera de tus comidas principales, haz una pausa de 5 minutos antes de decidir. En esos 5 minutos: bebe un vaso de agua, pregúntate si tienes hambre física o estás sintiendo algo, y anota en una sola palabra qué estabas sintiendo justo antes del impulso.',
      'por_que', 'El impulso de comer emocionalmente dura entre 3 y 7 minutos si no se actúa sobre él. La pausa activa el córtex prefrontal — la parte racional del cerebro — y desactiva la respuesta automática del sistema límbico.',
      'duracion', 'Esta semana — práctica de observación antes de picar'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Microbiota y señales de hambre',
      'texto', 'Las bacterias intestinales producen señales de hambre y saciedad reales. Algunas especies patógenas envían señales al cerebro pidiendo azúcar — su alimento favorito. Cuando el microbioma está dominado por bacterias beneficiosas, las señales de hambre emocional se reducen. Lo que pides comer refleja parcialmente lo que tu microbiota quiere comer.',
      'alimento_estrella', 'Manzana con piel — pectina prebiótica que alimenta bacterias beneficiosas y regula las señales de saciedad'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Meditación para el hambre emocional — 8 minutos',
      'descripcion', 'Audio guiado para momentos de impulso alimentario. Técnica de reconocimiento de la emoción subyacente, respiración de anclaje y decisión consciente. Sin juicio, con comprensión.',
      'duracion_min', 8,
      'tipo', 'meditacion_terapeutica',
      'archivo', 'audio/reset/dia11-hambre-emocional.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'Nunca hay que merecerse la comida ni castigarse por haberla comido. La alimentación emocional es información, no un error. Cuando la observas sin juzgarla, empieza a perder poder. No porque hayas desarrollado fuerza de voluntad — sino porque ya no es un secreto entre tú y la nevera.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Hubo ayer algún momento de comer sin hambre real? ¿Recuerdas qué sentías?',
      'pregunta_tarde', '¿Has hecho la pausa de 5 minutos hoy? ¿Qué has observado?',
      'pregunta_noche', '¿Qué emoción ha sido más presente hoy? ¿Cómo ha influido en tus ganas de comer?'
    ),
    'reflexion', 'No se trata de comer perfecto. Se trata de entender por qué comes lo que comes. Esa comprensión cambia más que cualquier dieta.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 12,
  'Más variedad en el plato. Más variedad en tus emociones.',
  'Cuenta tus plantas de hoy',
  jsonb_build_object(
    'push_message', '🌈 Día 12 — 30 plantas a la semana. El dato más revolucionario del microbioma.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'La regla de las 30 plantas semanales',
      'texto', 'El American Gut Project — el mayor estudio de microbioma humano hasta la fecha — encontró que las personas que comen más de 30 tipos de plantas distintas a la semana tienen una microbiota significativamente más diversa. Y la diversidad del microbioma es el indicador más fiable de salud mental, inmunidad y longevidad. Las plantas incluyen: verduras, frutas, legumbres, cereales integrales, frutos secos, semillas, hierbas aromáticas y especias.',
      'concepto_clave', 'diversidad microbiana → diversidad emocional'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Cuenta tus plantas de hoy',
      'instruccion', 'Haz una lista de todas las plantas que has comido hoy — cada fruta, verdura, legumbre, cereal, fruto seco, semilla, hierba o especia cuenta como 1. El objetivo semanal es llegar a 30. Hoy empieza a contar.',
      'por_que', 'Cada planta tiene un perfil único de fibra y polifenoles que alimenta a especies bacterianas distintas. A mayor variedad de plantas, mayor variedad de bacterias. A mayor variedad de bacterias, mayor producción de neurotransmisores y menor inflamación.',
      'duracion', 'Esta semana y la siguiente — cuenta tus plantas semanales'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Diversidad bacteriana = diversidad emocional',
      'texto', 'Estudios recientes demuestran que una microbiota poco diversa se asocia con mayor riesgo de ansiedad, depresión y pensamiento rumiativo. El mecanismo probable: poca diversidad microbiana significa menos producción total de neurotransmisores, menos ácidos grasos de cadena corta y más inflamación intestinal de bajo grado.',
      'alimento_estrella', 'Especias y hierbas — añadir orégano, cúrcuma, romero, tomillo, albahaca al cocinar suma plantas sin esfuerzo'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Gratitud corporal — 5 minutos',
      'descripcion', 'Meditación breve de gratitud hacia el cuerpo y el sistema digestivo. Visualización de la microbiota como un ecosistema vivo y diverso. Tono cálido y accesible.',
      'duracion_min', 5,
      'tipo', 'meditacion_gratitud',
      'archivo', 'audio/reset/dia12-gratitud-microbioma.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No necesitas comer raro ni comprar ingredientes exóticos. 30 plantas a la semana es más fácil de lo que parece cuando empiezas a contar. El ajo, la cebolla, el perejil, el tomate, las lentejas, las nueces, el arroz integral, la manzana, el plátano, la avena — ya vas por 10 solo con los básicos de cualquier semana normal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuántas plantas distintas crees que comes a la semana normalmente?',
      'pregunta_tarde', '¿Cuántas plantas has comido hoy? Anótalas.',
      'pregunta_noche', '¿Qué planta nueva podrías añadir mañana que no hayas comido esta semana?'
    ),
    'reflexion', 'La biodiversidad del plato es la biodiversidad del intestino es la biodiversidad emocional. Todo está conectado.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 13,
  'El 1,5% de deshidratación ya afecta a tu concentración. ¿Cuánto bebes hoy?',
  'Protocolo de hidratación consciente',
  jsonb_build_object(
    'push_message', '💧 Día 13 — El hábito más simple para la claridad mental.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El cerebro tiene un 75% de agua. Y lo nota cuando falta',
      'texto', 'El cerebro es el órgano más sensible a la deshidratación. Con solo un 1,5% de pérdida de agua — equivalente a no beber durante 3-4 horas de actividad normal — la concentración baja, la memoria de trabajo falla y la sensación de fatiga mental aumenta. Además, la deshidratación aumenta el cortisol y disminuye la producción de serotonina. Los síntomas de deshidratación leve son fácilmente confundibles con ansiedad, bajón emocional o niebla mental.',
      'concepto_clave', 'hidratación → volumen cerebral → concentración → estado de ánimo'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Protocolo de hidratación consciente',
      'instruccion', 'Hoy bebe 8 vasos de agua distribuidos así: 1 al levantarte (con limón), 1 antes del desayuno, 1 a media mañana, 1 antes de comer, 1 después de comer, 1 a media tarde, 1 antes de cenar, 1 después de cenar. Pon recordatorios si lo necesitas.',
      'por_que', 'La distribución importa — beber mucho de golpe no hidrata igual que distribuirlo durante el día. El agua antes de las comidas también mejora la digestión y la señal de saciedad.',
      'duracion', 'Hasta el final del reto — 8 vasos distribuidos'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Hidratación y microbiota',
      'texto', 'La capa de mucus que recubre el intestino — donde viven la mayoría de las bacterias beneficiosas — depende directamente de la hidratación. Con poca agua, el mucus se espesa, las bacterias tienen menos espacio para proliferar y la barrera intestinal pierde eficiencia. El agua con limón de la mañana ayuda a hidratar este mucus y estimula la secreción de enzimas digestivas.',
      'alimento_estrella', 'Agua con pepino o con hierbas frescas (menta, melisa) — hidratación + polifenoles + activación vagal'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Meditación de enfoque y claridad — 6 minutos',
      'descripcion', 'Técnica de atención focalizada con respiración nasal. Para momentos de niebla mental o bajón de concentración. Corta, práctica, sin música de fondo.',
      'duracion_min', 6,
      'tipo', 'enfoque',
      'archivo', 'audio/reset/dia13-enfoque-claridad.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'El café deshidrata. No cancela el agua — pero sí tiene un efecto diurético neto de aproximadamente 0,5 vasos por taza. Si tomas 3 cafés al día, necesitas 1,5 vasos adicionales para compensar. El café no es el problema — el problema es usarlo como sustituto del agua cuando lo que el cerebro necesita es hidratación.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuánta agua bebes normalmente al día? ¿Más o menos de 8 vasos?',
      'pregunta_tarde', '¿Cómo va la hidratación de hoy? ¿Cuántos vasos llevas?',
      'pregunta_noche', '¿Has notado alguna diferencia en tu claridad mental o energía hoy?'
    ),
    'reflexion', 'A veces la solución más simple es la más ignorada. Un vaso de agua puede cambiar más el estado mental que cualquier suplemento.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 14,
  'Dos semanas. Tu microbiota ya ha cambiado.',
  'Revisa y celebra',
  jsonb_build_object(
    'push_message', '🎉 Día 14 — Dos semanas completadas. Tu intestino ya no es el mismo.',
    'semana', 2,
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Lo que ha pasado en tu intestino estas dos semanas',
      'texto', 'En 14 días de fermentados diarios, menos azúcar, más fibra y más omega-3, el microbioma ya ha cambiado de forma medible. Lactobacillus y Bifidobacterium han aumentado. Las bacterias que se alimentan de azúcar han perdido terreno. La barrera intestinal está más sana. La producción de serotonina y GABA intestinal ha mejorado. No es inmediato en todos los síntomas — el cerebro tarda un poco más en notar los cambios del intestino. Pero los cimientos ya están construidos.',
      'concepto_clave', '14 días → microbioma cambiado → base para la semana 3'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Revisa y celebra',
      'instruccion', 'Vuelve a leer tus registros de las dos semanas. Compara tu energía, estado de ánimo, digestión y claridad mental del día 1 con hoy. No busques una transformación dramática — busca cambios pequeños y reales. Escribe 3 cosas que han mejorado, aunque sea levemente.',
      'por_que', 'Registrar el progreso activa el sistema dopaminérgico de la misma forma que completar un reto real. El cerebro necesita ver el avance para mantener la motivación.',
      'duracion', 'Hoy — revisión de 2 semanas'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'El eje intestino-cerebro después de 14 días',
      'texto', 'Investigaciones del University College Cork mostraron que cambios significativos en el microbioma son detectables en análisis de heces a partir de los 14 días de intervención dietética. Lo que has hecho estas dos semanas — fermentados, fibra, omega-3, menos azúcar — es exactamente el tipo de intervención que produce esos cambios.',
      'alimento_estrella', 'El fermentado que mejor te ha sentado estas dos semanas — mantenlo como hábito permanente'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Celebración y cierre de semana 2 — 8 minutos',
      'descripcion', 'Audio de revisión guiada con preguntas de reflexión sobre los 14 días. Visualización del ecosistema intestinal en equilibrio. Preparación para la semana 3 de integración.',
      'duracion_min', 8,
      'tipo', 'reflexion_cierre',
      'archivo', 'audio/reset/dia14-cierre-semana2.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Lo que has construido',
      'texto', 'Agua con limón cada mañana. Desayuno con triptófano y proteína. Un fermentado al día. Omega-3 regular. Menos azúcar refinado. Magnesio por la tarde. Una comida al día sin pantallas. Pausa antes de comer emocionalmente. 30 plantas a la semana. Hidratación consciente. Eso no es una dieta. Es un sistema de cuidado real. Y ya está funcionando.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', 'Del 1 al 10: ¿cómo está tu energía general comparada con el día 1?',
      'pregunta_tarde', 'Del 1 al 10: ¿cómo está tu estado de ánimo general comparado con el día 1?',
      'pregunta_noche', '¿Cuál ha sido el cambio más importante que has notado en ti mismo/a estas dos semanas?'
    ),
    'reflexion', 'No has seguido una dieta. Has empezado a entenderte. Esa es la diferencia.',
    'hito', jsonb_build_object(
      'dia', 14,
      'titulo', '🎉 Semana 2 completada',
      'mensaje_app', 'Dos semanas. Tu microbiota ya ha cambiado. Has activado la producción de GABA, dopamina y serotonina desde la cocina. Has empezado a entender tus patrones emocionales alrededor de la comida. La semana 3 es donde integras todo esto y lo conviertes en tu protocolo personal.',
      'submensaje', 'GABA ✓ Dopamina ✓ Magnesio ✓ Alimentación emocional ✓ 30 plantas ✓ Hidratación ✓',
      'cta', 'Empezar la Semana 3 →'
    )
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ── Semana 3 — Integrar ───────────────────────────────────────────────────────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 15,
  'Tu cuerpo tiene un reloj interno. Y el desayuno lo pone en hora.',
  'Cena 2 horas antes de dormir esta semana',
  jsonb_build_object(
    'push_message', '⏰ Día 15 — Semana 3. El ritmo circadiano y por qué importa cuándo comes.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Cronobiología: cuándo comes importa tanto como qué comes',
      'texto', 'Cada célula del cuerpo tiene un reloj interno sincronizado con el ciclo de luz-oscuridad. El hígado, el páncreas, el intestino — todos tienen ritmos circadianos propios que se sincronizan con el timing de las comidas. Cuando comes a horas irregulares, tarde por la noche o saltándote comidas, estos relojes se desacoplan y la química del cerebro lo nota: más cortisol, menos serotonina, peor sueño, más ansiedad. Las tres reglas: desayuna dentro de la primera hora después de levantarte, cena al menos 2 horas antes de dormir y mantén un horario relativamente regular de comidas.',
      'concepto_clave', 'relojes circadianos → timing comidas → serotonina → estado de ánimo'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Cena 2 horas antes de dormir esta semana',
      'instruccion', 'Decide a qué hora vas a dormir hoy y resta 2 horas. Esa es tu hora de cenar. Anótala. Si normalmente cenas a las 22h y duermes a las 23h, adelanta la cena a las 21h mínimo. El objetivo esta semana es cenar siempre antes de las 21h si puedes.',
      'por_que', 'Comer tarde activa el metabolismo hepático en horario de descanso, eleva el cortisol nocturno e interfiere con la producción de melatonina. Es una de las causas más subestimadas del sueño de mala calidad y el mal humor matutino.',
      'duracion', 'Semana 3 — cenas antes de las 21h'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'La microbiota también tiene ritmo circadiano',
      'texto', 'Las bacterias intestinales tienen sus propios ritmos de actividad. Algunas especies son más activas de noche, otras de día. La diversidad microbiana se reduce cuando el ritmo circadiano está alterado — como en el jet lag, el trabajo nocturno o las comidas tardías. Mantener un horario regular de comidas es, literalmente, mantener el reloj de tu microbiota.',
      'alimento_estrella', 'Infusión de pasiflora o manzanilla antes de dormir — activan receptores GABA, bajan el cortisol vespertino'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Ritual de cierre del día — 7 minutos',
      'descripcion', 'Audio para la rutina de noche. Respiración de transición entre el modo activo y el modo descanso. Instrucciones para un ritual de cierre de 10 minutos que sincroniza el sistema nervioso para el sueño.',
      'duracion_min', 7,
      'tipo', 'ritual_nocturno',
      'archivo', 'audio/reset/dia15-ritual-nocturno.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'El estado de ánimo del día siguiente se construye la noche anterior. La calidad del sueño, la hora de cenar, el cortisol nocturno — todo eso determina con qué química cerebral amaneces. El mejor antidepresivo matutino empieza en la cena del día anterior.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿A qué hora has cenado ayer? ¿Cómo has dormido?',
      'pregunta_tarde', '¿Tienes definida tu hora de cena para hoy? ¿Cuál es?',
      'pregunta_noche', '¿Has podido respetar el horario? Si no, ¿qué lo ha impedido?'
    ),
    'reflexion', 'La regularidad no es rigidez. Es darle al cuerpo la señal de que puede confiar en el ritmo.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 16,
  'Ashwagandha: la planta que le enseña al cuerpo a gestionar el estrés.',
  'Introduce la ashwagandha en tu rutina de noche',
  jsonb_build_object(
    'push_message', '🌿 Día 16 — Adaptógenos. La ayuda natural que el estrés crónico necesita.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Adaptógenos: plantas que regulan el eje del estrés',
      'texto', 'Los adaptógenos son plantas que ayudan al cuerpo a adaptarse al estrés sin estimularlo ni sedarlo — regulan el eje HPA (hipotálamo-hipófisis-adrenal) hacia un punto de equilibrio. La ashwagandha (Withania somnifera) es el más estudiado: sus withanólidos reducen el cortisol, mejoran la respuesta al estrés y tienen un efecto directo sobre los receptores GABA-A. Ensayos clínicos randomizados muestran reducción del 25-30% en los niveles de cortisol después de 8 semanas.',
      'concepto_clave', 'adaptógenos → eje HPA → cortisol regulado → energía estable'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Introduce la ashwagandha en tu rutina de noche',
      'instruccion', '1/2 cucharadita de polvo de ashwagandha en leche caliente de avena o en el cacao de la noche. Añade canela y miel. Tómalo 1 hora antes de dormir. Si prefieres cápsula: 300-600 mg de extracto KSM-66 con la cena.',
      'por_que', 'La ashwagandha tiene su mayor efecto sobre el cortisol cuando se toma por la noche. El cortisol nocturno elevado es uno de los principales causantes de insomnio, ansiedad y bajón matutino.',
      'duracion', 'Semana 3 — ashwagandha nocturna durante al menos 3 semanas para notar efectos'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Adaptógenos y microbiota',
      'texto', 'La ashwagandha tiene efectos prebióticos — estimula el crecimiento de Lactobacillus y Bifidobacterium. Además, al reducir el cortisol, disminuye indirectamente la permeabilidad intestinal que el estrés provoca. Menos estrés = intestino más cerrado = menos inflamación = más serotonina disponible.',
      'alimento_estrella', 'Ashwagandha en polvo + leche de avena + canela + miel — el ritual de noche completo'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Yoga nidra corto — 12 minutos',
      'descripcion', 'Versión abreviada del yoga nidra clásico. Rotación de conciencia por el cuerpo, respiración de coherencia cardíaca y estado de relajación profunda sin dormir. Ideal para después del ritual de noche.',
      'duracion_min', 12,
      'tipo', 'yoga_nidra',
      'archivo', 'audio/reset/dia16-yoga-nidra.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'El estrés crónico no se soluciona con vacaciones. Se soluciona entrenando el sistema nervioso para recuperarse más rápido después de cada activación. Los adaptógenos, los fermentados, el magnesio y las técnicas de respiración son exactamente eso: entrenamiento del sistema nervioso. No eliminan el estrés — construyen la capacidad de gestionarlo.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo describes tu nivel de estrés crónico últimamente? ¿Qué lo genera principalmente?',
      'pregunta_tarde', '¿Has preparado el ritual de noche de hoy? ¿Tienes la ashwagandha?',
      'pregunta_noche', '¿Has notado diferencia en cómo te vas a la cama estos últimos días comparado con el inicio del reto?'
    ),
    'reflexion', 'Gestionar el estrés no es aguantarlo mejor. Es necesitar menos aguante porque el sistema ya funciona diferente.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 17,
  'Comer en compañía también es medicina.',
  'Come una comida hoy con alguien, sin pantallas',
  jsonb_build_object(
    'push_message', '🤝 Día 17 — La comida compartida activa lo que ningún suplemento puede.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Oxitocina, conexión social y microbiota',
      'texto', 'La oxitocina — la hormona de la conexión y el vínculo — tiene receptores directos en el intestino y modula la microbiota. Cuando comemos con personas queridas, en un ambiente de calma y presencia, el sistema nervioso parasimpático se activa, la digestión mejora, los nervios no interrumpen la absorción de nutrientes y el nivel de cortisol es más bajo que cuando comemos solos con el móvil. No es romanticismo — es fisiología.',
      'concepto_clave', 'conexión social → oxitocina → sistema nervioso parasimpático → digestión óptima'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Come una comida hoy con alguien, sin pantallas',
      'instruccion', 'Elige una comida hoy — desayuno, comida o cena — y compártela con alguien: pareja, amigo, familiar, compañero de trabajo. Sin móviles en la mesa. Si hoy no es posible, planifica esta semana una comida compartida real.',
      'por_que', 'El contexto emocional en que comemos afecta directamente la digestión, la absorción de nutrientes y el nivel de inflamación post-comida. Una comida tensa o solitaria con el móvil tiene un perfil metabólico diferente a la misma comida en compañía relajada.',
      'duracion', 'Intención permanente — al menos 1 comida compartida sin pantallas por semana'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Microbiota compartida',
      'texto', 'Investigaciones recientes muestran que las personas que conviven y comparten comidas tienden a tener microbiomas más parecidos entre sí. La comida compartida es literalmente un intercambio de microbiota. Comer con personas sanas, felices y con buenos hábitos tiene un efecto real sobre tu ecosistema intestinal.',
      'alimento_estrella', 'Cualquier plato cocinado en casa y compartido — el acto de cocinar para alguien ya activa la oxitocina'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Meditación de conexión y presencia — 6 minutos',
      'descripcion', 'Práctica de presencia plena. Atención a los sentidos en el momento de comer: el olor, el color, la textura, el sabor. Cultivar gratitud por el alimento y la compañía.',
      'duracion_min', 6,
      'tipo', 'mindful_eating',
      'archivo', 'audio/reset/dia17-mindful-eating.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'El aislamiento social aumenta la inflamación sistémica — este es uno de los hallazgos más replicados de la psiconeuroimmunología. El mismo mecanismo que activa la inflamación en las infecciones se activa cuando el cerebro percibe soledad crónica. Comer en compañía no es un lujo social. Es parte del protocolo antiinflamatorio.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Con qué frecuencia comes acompañado actualmente? ¿Cómo te sientes al comer solo/a?',
      'pregunta_tarde', '¿Has podido compartir alguna comida hoy?',
      'pregunta_noche', '¿Cómo te has sentido en esa comida comparada con comer solo/a con el móvil?'
    ),
    'reflexion', 'La mesa siempre fue un lugar de ritual. Recuperarla es recuperar algo antiguo que el cuerpo recuerda.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 18,
  'Ya tienes datos propios. Hoy los lees.',
  'Construye tu mapa Food-Mood personal',
  jsonb_build_object(
    'push_message', '🗺️ Día 18 — Tu mapa personal Food-Mood. Qué te activa, qué te calma.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'De los datos a los patrones',
      'texto', 'Llevas 18 días registrando cómo te sientes después de comer, qué alimentos te dan energía, en qué momentos el bajón aparece y qué lo generó. Eso es un dataset personal que ninguna app de nutrición tiene. Hoy no aprendes nada nuevo — hoy lees lo que ya has aprendido sobre ti mismo/a. Los patrones personales son más valiosos que cualquier protocolo genérico porque son tuyos.',
      'concepto_clave', 'observación → patrones → protocolo personal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Construye tu mapa Food-Mood personal',
      'instruccion', 'Lee todos tus registros de los 17 días anteriores y completa este esquema: (1) Alimentos que me dan energía estable. (2) Alimentos que me generan bajón o ansiedad. (3) Momentos del día donde más me afecta lo que como. (4) El cambio que más ha impactado en mi estado de ánimo. (5) El fermentado que mejor me ha sentado.',
      'por_que', 'Convertir 18 días de registros en un esquema claro es el primer paso para mantener los cambios después del reto. Sin este mapa, los hábitos se diluyen. Con él, tienes una guía propia.',
      'duracion', 'Hoy — 20 minutos de análisis personal'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Tu microbioma personal',
      'texto', 'No existe un microbioma igual a otro. El tuyo es único — determinado por tu nacimiento, tu historia con antibióticos, tu dieta de los últimos años, tu nivel de estrés crónico. Por eso los fermentados que más te sientan pueden ser diferentes a los que le sientan mejor a otra persona. Tu registro de 18 días ya tiene esa información. Úsala.',
      'alimento_estrella', 'El que más veces has anotado que te hizo sentir bien — repítelo esta semana'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Journaling guiado — 10 minutos',
      'descripcion', 'Audio de escritura reflexiva guiada. Preguntas para identificar patrones personales, creencias sobre la comida y el estado de ánimo, y definir los 3 hábitos que quieres mantener después del reto.',
      'duracion_min', 10,
      'tipo', 'journaling',
      'archivo', 'audio/reset/dia18-journaling-patron.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'Los mejores médicos de la medicina personalizada dicen lo mismo: el paciente siempre sabe más de su cuerpo de lo que cree. Solo necesita las herramientas para leer lo que el cuerpo dice. Este reto te ha dado esas herramientas. Lo que escribas hoy en tu mapa personal vale más que cualquier análisis clínico genérico.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuál es el patrón más claro que has notado en estas semanas entre comida y estado de ánimo?',
      'pregunta_tarde', '¿Has completado tu mapa Food-Mood personal?',
      'pregunta_noche', '¿Hay algún alimento o hábito que definitivamente vas a mantener después del reto? ¿Cuál?'
    ),
    'reflexion', 'Conocerte a través de lo que comes es una forma de autoconocimiento que muy poca gente ha explorado. Ya lo estás haciendo.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 19,
  'Todo lo que has aprendido, junto.',
  'El día del protocolo completo',
  jsonb_build_object(
    'push_message', '🧠 Día 19 — El cuadro completo. El eje intestino-cerebro ahora tiene sentido.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'El eje intestino-cerebro: el resumen de 19 días',
      'texto', 'El intestino produce serotonina, GABA y dopamina. La microbiota regula el sistema inflamatorio que bloquea o facilita esa producción. El nervio vago lleva las señales del intestino al cerebro. El azúcar y los ultraprocesados dañan la microbiota. Los fermentados la reparan. El magnesio calma el sistema nervioso. Los adaptógenos regulan el cortisol. La hidratación mantiene el cerebro funcionando. La cronobiología sincroniza todo. La conexión social activa la oxitocina. El mindful eating activa el nervio vago. Cada pieza que has trabajado estos 19 días es parte del mismo sistema.',
      'concepto_clave', 'todo conectado — el sistema completo'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'El día del protocolo completo',
      'instruccion', 'Hoy no hay cambio nuevo. Hoy aplicas lo que ya sabes: agua con limón al levantarte, desayuno con proteína y triptófano, fermentado durante el día, omega-3 en alguna comida, magnesio por la tarde, cena antes de las 21h, sin pantallas en al menos una comida. Solo eso. Todo junto, un día completo.',
      'por_que', 'Ver cómo todos los hábitos encajan en un día real es el paso previo a mantenerlos después del reto.',
      'duracion', 'Hoy — el día del protocolo completo'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'El resumen de psicoboóticos del reto',
      'texto', 'Has trabajado con: Lactobacillus rhamnosus (kéfir — ansiedad), Bifidobacterium (avena y plátano — serotonina), Lactobacillus brevis (miso — GABA), Akkermansia muciniphila (polifenoles — barrera intestinal), Lactobacillus plantarum (chucrut — dopamina). No necesitas todos a la vez. Elige 2-3 fuentes que más te gusten y mantenlas.',
      'alimento_estrella', 'El fermentado de tu mapa personal Food-Mood'
    ),
    'audio', jsonb_build_object(
      'titulo', 'El sistema completo — visualización guiada — 10 minutos',
      'descripcion', 'Recorrido guiado por el eje intestino-cerebro completo. Visualización de la microbiota, el nervio vago, los neurotransmisores y el cerebro en equilibrio. Potente y accesible.',
      'duracion_min', 10,
      'tipo', 'visualizacion_integradora',
      'archivo', 'audio/reset/dia19-visualizacion-completa.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'La psiquiatría nutricional no propone que cambies la alimentación en lugar de ir al médico. Propone que la alimentación es una herramienta de cuidado de la salud mental que complementa cualquier otro tratamiento. Y que sin ella, cualquier tratamiento tiene una pieza menos. Esa pieza eres tú, eligiendo lo que comes cada día.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Qué parte del eje intestino-cerebro has entendido mejor en este reto?',
      'pregunta_tarde', '¿Has podido hacer el día completo de protocolo? ¿Qué ha faltado y por qué?',
      'pregunta_noche', '¿Cómo describirías tu relación con la comida ahora comparada con el día 1?'
    ),
    'reflexion', 'Entender tu cuerpo no te hace más rígido con la comida. Te hace más libre. Porque ya no necesitas reglas — tienes comprensión.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 20,
  'El reto termina mañana. El protocolo empieza hoy.',
  'Escribe tu protocolo personal post-reto',
  jsonb_build_object(
    'push_message', '📋 Día 20 — Diseña tu protocolo post-reto. Lo que se queda contigo.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'De los 21 días al protocolo permanente',
      'texto', 'Un reto de 21 días no cambia nada si termina el día 21. Lo que cambia las cosas es lo que se mantiene después. No todo — no hace falta. Solo los hábitos con mayor impacto personal según tu mapa Food-Mood. La investigación en cambio de hábitos muestra que mantener 3-5 cambios pequeños pero consistentes tiene más impacto en la salud mental que 15 cambios que duran una semana.',
      'concepto_clave', 'consistencia en 3-5 hábitos > perfección en 20 hábitos durante 3 días'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Escribe tu protocolo personal post-reto',
      'instruccion', 'Completa esta plantilla con tus propias respuestas: (1) Mis 3 hábitos no negociables. (2) Mi fermentado diario. (3) Mi fuente de omega-3 habitual. (4) Mi ritual de noche. (5) El alimento que voy a reducir o eliminar. (6) Mi comida de la semana favorita del reto. Guárdalo en el teléfono o en un papel visible.',
      'por_que', 'Escribir el protocolo activa el compromiso con uno mismo de una forma que pensar no lo hace. Y tenerlo visible reduce la fricción de tomarlo en los momentos de piloto automático.',
      'duracion', 'Permanente — revisarlo cada mes y ajustarlo'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'El mantenimiento del microbioma',
      'texto', 'El microbioma que has construido estas 3 semanas puede mantenerse con 3 principios simples: 1) Un fermentado al día mínimo. 2) Más de 25 plantas a la semana. 3) Limitar el azúcar refinado y los ultraprocesados a ocasiones reales, no como base de la dieta.',
      'alimento_estrella', 'El que elijas en tu protocolo personal'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Carta a ti mismo/a — 8 minutos',
      'descripcion', 'Audio guiado de escritura de una carta breve de compromiso personal. Qué has aprendido en 20 días, qué quieres mantener y por qué. Sin presión — solo honestidad.',
      'duracion_min', 8,
      'tipo', 'journaling_compromisos',
      'archivo', 'audio/reset/dia20-carta-personal.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Una sola idea para hoy',
      'texto', 'No tienes que hacerlo perfecto después del reto. Tienes que hacerlo tuyo. Adaptar los hábitos a tu vida real, a tus horarios, a tu presupuesto, a tus gustos. Un kéfir al día y nueces en el desayuno son más poderosos que el protocolo perfecto que haces 3 días y abandonas. Empieza pequeño. Mantén consistente. Ajusta cuando lo necesites.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuáles son los 3 cambios que más impacto han tenido en tu bienestar?',
      'pregunta_tarde', '¿Has escrito tu protocolo post-reto?',
      'pregunta_noche', '¿Cómo te sientes sabiendo que mañana es el último día del reto?'
    ),
    'reflexion', 'El reto no era cambiar todo. Era entender suficiente para elegir diferente.',
    'hito', NULL
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 21,
  '21 días. Ya no eres el mismo/la misma con la comida.',
  'La receta de celebración y el protocolo activo',
  jsonb_build_object(
    'push_message', '🏆 Día 21 — Lo has conseguido. 21 días entendiendo cómo funciona tu cuerpo. Eso no se pierde.',
    'semana', 3,
    'fase', 'integrar',
    'idea_clara', jsonb_build_object(
      'titulo', 'Lo que llevas contigo a partir de hoy',
      'texto', 'Llevas 21 días aprendiendo que tu estado de ánimo no es aleatorio. Que tiene causas biológicas concretas. Que el intestino produce los neurotransmisores que regulan cómo te sientes. Que los fermentados son medicina real. Que el azúcar tiene un efecto directo en la ansiedad. Que masticar despacio activa el nervio vago. Que el magnesio calma el sistema nervioso. Que los adaptógenos regulan el estrés. Que tu microbioma responde en días. Que comer en compañía sin pantallas es un acto de salud mental. Eso no lo pierdes cuando termina el reto.',
      'concepto_clave', 'comprensión permanente — el conocimiento no se devuelve'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'La receta de celebración y el protocolo activo',
      'instruccion', 'Hoy cocina algo que hayas descubierto en el reto y que te haya gustado. Compártelo si puedes. Y activa tu protocolo post-reto del día 20 — hoy es el primer día de mantenerlo.',
      'por_que', 'El día 21 no es el final. Es el primer día sin el reto pero con todo lo aprendido. La diferencia entre una persona que completa el reto y una que lo integra es exactamente este momento.',
      'duracion', 'Permanente — el protocolo post-reto es tuyo'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'El resumen final del eje intestino-cerebro',
      'texto', 'Tu microbiota produce serotonina, GABA y dopamina. El nervio vago lleva esas señales al cerebro. Cuando la microbiota está equilibrada, el cerebro también lo está. Lo que comes cada día es la instrucción más directa que le das a ese sistema. No necesitas hacerlo perfecto. Necesitas hacerlo consistente. Y ya sabes cómo.',
      'alimento_estrella', 'Tu favorito del reto — el que mejor te ha sentado y más has disfrutado'
    ),
    'audio', jsonb_build_object(
      'titulo', 'Celebración y cierre del reto — 10 minutos',
      'descripcion', 'Audio de cierre del Food-Mood Reset. Revisión de los 21 días, reconocimiento del trabajo hecho, visualización del estado de bienestar conseguido y activación del protocolo personal. Tono cálido, empoderador y real.',
      'duracion_min', 10,
      'tipo', 'cierre_celebracion',
      'archivo', 'audio/reset/dia21-cierre-reto.mp3'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Lo que has hecho en 21 días',
      'texto', 'Has aprendido el eje intestino-cerebro. Has introducido fermentados en tu dieta. Has mejorado el desayuno. Has reducido el azúcar refinado. Has añadido omega-3 regularmente. Has trabajado el magnesio y los adaptógenos. Has practicado comer sin pantallas. Has observado tu alimentación emocional sin juzgarla. Has aprendido a leer tus propios patrones. Has construido tu protocolo personal. No es una dieta. Es una relación diferente con tu cuerpo. Y esa relación ya es tuya.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', 'Del 1 al 10: ¿cómo está tu energía ahora comparada con el día 1?',
      'pregunta_tarde', 'Del 1 al 10: ¿cómo está tu estado de ánimo general ahora comparado con el día 1?',
      'pregunta_noche', '¿Qué ha sido lo más valioso de estos 21 días? Una sola cosa.'
    ),
    'reflexion', 'No se trata de comer perfecto. Se trata de entenderte mejor. Cuando entiendes cómo tu cuerpo responde a lo que comes, dejas de luchar contigo y empiezas a estar a tu favor.',
    'hito', jsonb_build_object(
      'dia', 21,
      'titulo', '🏆 Food-Mood Reset completado',
      'mensaje_app', 'Lo has conseguido. 21 días entendiendo la conexión entre lo que comes y cómo te sientes. Tu microbiota es más diversa. Tu sistema nervioso tiene más recursos. Tu relación con la comida es diferente. Eso no se pierde cuando termina el reto.',
      'submensaje', 'Eje intestino-cerebro ✓ Fermentados ✓ Neurotransmisores ✓ Inflamación ✓ Nervio vago ✓ Ritmo circadiano ✓ Protocolo personal ✓',
      'estadisticas', jsonb_build_object(
        'dias_completados', 21,
        'semanas', 3,
        'neurotransmisores_trabajados', 4,
        'psicobioticos_conocidos', 5
      ),
      'cta_primario', 'Ver mi resumen de 21 días →',
      'cta_secundario', 'Compartir mi logro →',
      'cta_terciario', 'Descargar mi protocolo personal →'
    )
  )
FROM public.challenges c WHERE c.slug = 'food-mood-reset'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
