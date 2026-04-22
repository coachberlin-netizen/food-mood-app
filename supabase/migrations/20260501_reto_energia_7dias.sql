-- ── Nuevas columnas en challenges ─────────────────────────────────────────────
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS is_premium      bool    DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS incluye         jsonb,
  ADD COLUMN IF NOT EXISTS hitos_landing   jsonb,
  ADD COLUMN IF NOT EXISTS al_completar    jsonb;

-- ── Actualizar reto Energía ───────────────────────────────────────────────────
UPDATE public.challenges SET
  title       = 'Recupera tu energía en 7 días',
  subtitle    = 'Reset mitocondrial. Resultados medibles en una semana.',
  description = 'Un protocolo de 7 días para activar tus mitocondrias, romper el ciclo de fatiga crónica y recuperar la energía que pensabas que habías perdido. Sin suplementos. Solo alimentos funcionales con evidencia.',
  price_eur   = 19,
  color       = '#E8703A',
  emoji       = '⚡',
  recipe_count = 7,
  audio_count  = 3,
  incluye = jsonb_build_array(
    '7 días de protocolo mitocondrial',
    'Recetas funcionales con evidencia científica',
    '3 audios guiados (10-12 min)',
    'Registro diario de energía y ánimo',
    'Acceso de por vida al contenido'
  ),
  hitos_landing = jsonb_build_array(
    jsonb_build_object('dia', 1, 'texto', 'Activas la producción de CoQ10 desde el primer desayuno'),
    jsonb_build_object('dia', 4, 'texto', 'Punto de inflexión mitocondrial — la mayoría nota el cambio aquí'),
    jsonb_build_object('dia', 7, 'texto', 'Reset completado — tu energía tiene una nueva línea base')
  ),
  al_completar = jsonb_build_object(
    'titulo',  '7 días completados',
    'subtitulo', 'Tu energía tiene una nueva base. ¿Qué sigue?',
    'cta',     'Ver reto Food-Mood Reset (21 días)',
    'cta_slug', 'food-mood-reset'
  )
WHERE slug = 'recupera-tu-energia';

-- ── Días del reto ─────────────────────────────────────────────────────────────

-- Día 1 — CoQ10 / Sardinas
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'La energía empieza en tus mitocondrias.',
  'Desayuna dentro de la primera hora de levantarte',
  jsonb_build_object(
    'push_message', '⚡ Día 1 — Tu energía empieza aquí. Las mitocondrias se activan con lo que desayunas.',
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo',        'CoQ10 — la chispa mitocondrial',
      'texto',         'La Coenzima Q10 es la molécula que permite que tus mitocondrias conviertan los alimentos en energía (ATP). Sin CoQ10, el proceso se detiene. Las sardinas, el corazón de pollo y el salmón son las fuentes más densas del mundo real.',
      'concepto_clave', 'Cadena de transporte de electrones'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Desayuno CoQ10',
      'descripcion', 'Pan de centeno con sardinas en aceite de oliva, aguacate y limón. Café o té verde antes de las 10h.',
      'por_que', 'Las sardinas aportan CoQ10 biodisponible + omega-3 DHA que protege la membrana mitocondrial. El aceite de oliva activa la absorción liposoluble.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy? (energía al levantarte del 1 al 5)',
      'pregunta_tarde',  '¿A qué hora llegó el bajón de energía? ¿Qué hiciste justo antes?',
      'pregunta_noche',  '¿Cómo describirías tu nivel de energía general de hoy comparado con ayer?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué la fatiga crónica no es pereza',
      'texto',  'La fatiga moderna rara vez es falta de voluntad. Es una señal bioquímica: mitocondrias que no producen suficiente ATP porque les faltan cofactores (CoQ10, hierro, magnesio, B12) o porque están dañadas por inflamación crónica y estrés oxidativo. Este reto actúa sobre esas palancas reales.'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 2 — Hierro + Vitamina C / Lentejas
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'Sin hierro no hay energía. Con vitamina C, lo absorbes todo.',
  'Toma zumo de limón o naranja con la comida más rica en hierro',
  jsonb_build_object(
    'push_message', '⚡ Día 2 — El hierro no se absorbe solo. Hoy aprendes el truco.',
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo',        'Hierro + Vitamina C — la pareja inseparable',
      'texto',         'El hierro es esencial para transportar oxígeno a tus células. Pero el hierro vegetal (no hemo) tiene una absorción del 2-20%. La vitamina C lo convierte en forma ferrosa, triplicando o cuadruplicando la absorción. Sin esta combinación, puedes comer legumbres todos los días y seguir con déficit.',
      'concepto_clave', 'Biodisponibilidad del hierro no-hemo'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Bol de lentejas con pimiento rojo y limón',
      'descripcion', 'Lentejas rojas cocidas con pimiento rojo asado, espinacas baby, aceite de oliva y zumo de limón generoso. Opcional: huevo duro encima.',
      'por_que', 'Las lentejas son la fuente vegetal más densa en hierro. El pimiento rojo aporta 3 veces más vitamina C que una naranja. El limón activa la conversión en el momento. La espinaca añade folato cofactor.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Notaste algún cambio respecto al día 1? Describe cómo te despiertas.',
      'pregunta_tarde',  '¿Has combinado vitamina C con hierro en alguna comida hoy?',
      'pregunta_noche',  '¿Qué alimento nuevo has añadido hoy que antes no comías habitualmente?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Déficit de hierro: la causa de fatiga más infradiagnosticada',
      'texto',  'Puedes tener ferritina baja (hierro de reserva) con hemoglobina normal — y el médico no lo detecta como problema. Pero para tus mitocondrias, la diferencia es total. La ferritina óptima para energía está entre 50 y 150 ng/mL, no el mínimo de referencia del laboratorio.'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 3 — Magnesio / Cacao y Almendras
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  'El mineral que más necesitas y menos tienes.',
  'Añade una cucharada de cacao puro a tu desayuno de mañana',
  jsonb_build_object(
    'push_message', '⚡ Día 3 — El magnesio es el interruptor de la energía. Hoy lo enciendes.',
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo',        'Magnesio — el cofactor olvidado',
      'texto',         'El magnesio participa en más de 300 reacciones enzimáticas, incluyendo la producción de ATP. Sin magnesio suficiente, tus mitocondrias no pueden completar el ciclo de Krebs. El déficit es silencioso: fatiga, contracturas, ansiedad, insomnio. El cacao puro, las almendras y las legumbres son las fuentes más densas.',
      'concepto_clave', 'Ciclo de Krebs y producción de ATP'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Batido de cacao con almendras y plátano',
      'descripcion', 'Leche de avena + 2 cucharadas de cacao puro sin azúcar + puñado de almendras crudas + 1 plátano maduro + pizca de sal marina. Batir.',
      'por_que', 'El cacao es la fuente más densa de magnesio disponible. El plátano añade potasio para el equilibrio electrolítico. Las almendras suman vitamina E antioxidante. La sal marina aporta minerales traza que facilitan la absorción.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Dormiste mejor esta noche? El magnesio mejora la calidad del sueño desde la primera dosis.',
      'pregunta_tarde',  '¿Tienes contracturas musculares o tensión en el cuello? Anota si han cambiado.',
      'pregunta_noche',  '¿Qué diferencia notas en tu cuerpo comparado con el día 1?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué el 70% de la población tiene déficit de magnesio',
      'texto',  'El suelo agrícola moderno tiene un 85% menos de magnesio que hace 100 años. El estrés lo agota en horas — el cortisol expulsa el magnesio intracelular directamente. El café, el alcohol y los diuréticos lo eliminan por la orina. Y los procesos industriales destruyen el poco que queda en los alimentos.'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Cacao y microbioma: el circuito de la calma',
      'texto',  'Los flavanoles del cacao puro alimentan selectivamente a Lactobacillus y Bifidobacterium — las bacterias que producen GABA y serotonina. En estudios de 4 semanas, el consumo diario de cacao redujo los marcadores de estrés oxidativo y mejoró la diversidad microbiana.',
      'alimento_estrella', 'Cacao puro (mínimo 85% cacao)'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 4 — HITO — Omega-3 / Salmón
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'La membrana de tus mitocondrias se construye con omega-3.',
  'Este es el punto de inflexión — la mayoría nota el cambio hoy',
  jsonb_build_object(
    'push_message', '⚡ Día 4 — Punto de inflexión. La mayoría nota el cambio a partir de hoy.',
    'fase', 'activar',
    'hito', jsonb_build_object(
      'titulo', 'Día 4 — Punto de inflexión mitocondrial',
      'descripcion', 'Llevas 3 días activando los cofactores fundamentales. Hoy es cuando el sistema empieza a funcionar como un circuito completo. El omega-3 DHA protege y fluidifica la membrana mitocondrial — sin él, todos los cofactores anteriores llegan a una pared.',
      'reflexion', '¿Qué has notado en tu energía los últimos 3 días? ¿Algún patrón diferente?'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',        'Omega-3 DHA — arquitectura de la membrana',
      'texto',         'La membrana mitocondrial interior es donde ocurre la producción de ATP. Su fluidez determina la eficiencia del transporte de electrones. El DHA (omega-3 de cadena larga) es el componente estructural clave. Sin suficiente DHA, la membrana se vuelve rígida y la producción energética cae hasta un 40%.',
      'concepto_clave', 'Fluidez de membrana mitocondrial'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Salmón al horno con boniato y espárragos',
      'descripcion', 'Salmón salvaje al horno (180°C, 15 min) con boniato asado y espárragos verdes. Aceite de oliva virgen extra, ajo y limón. Sin más.',
      'por_que', 'El salmón salvaje tiene 10 veces más omega-3 que el de piscifactoría. El boniato aporta betacaroteno que se convierte en vitamina A cofactor. Los espárragos aportan folato y glutatión, el antioxidante maestro.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo ha sido tu calidad de sueño estos 3 primeros días?',
      'pregunta_tarde',  '¿Notas alguna diferencia en tu claridad mental o concentración?',
      'pregunta_noche',  '¿Qué alimento de esta semana ha sido más fácil de incorporar? ¿Cuál más difícil?'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'DHA y cerebro: la grasa más inteligente',
      'texto',  'El 60% del peso seco del cerebro es grasa, y el DHA representa el 25% de todos los ácidos grasos cerebrales. Es el componente estructural de las membranas neuronales y de los fotorreceptores. Niveles bajos de DHA se asocian con depresión, deterioro cognitivo y fatiga mental crónica.',
      'alimento_estrella', 'Salmón salvaje o sardinas en aceite de oliva'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 5 — NAD+ / Setas y Pollo
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'NAD+ — la molécula anti-envejecimiento que activas con la comida.',
  'Cocina las setas a fuego alto durante 5 minutos — activa su ergotioneína',
  jsonb_build_object(
    'push_message', '⚡ Día 5 — NAD+: la molécula que activa tus genes de la longevidad.',
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo',        'NAD+ — el combustible de las sirtuinas',
      'texto',         'El NAD+ (Nicotinamida Adenina Dinucleótido) es la molécula central del metabolismo energético. Activa las sirtuinas (SIRT1-7), los genes de la longevidad celular. Con la edad, los niveles de NAD+ caen hasta un 50%. El niacin (vitamina B3) es el precursor directo. Las setas, el pollo y el atún son las fuentes más densas.',
      'concepto_clave', 'Sirtuinas y senescencia celular'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Salteado de setas shiitake con pollo y arroz integral',
      'descripcion', 'Pechugas de pollo en tiras salteadas con setas shiitake + champiñones portobello a fuego alto. Ajo, jengibre fresco, tamari (sin gluten). Servir sobre arroz integral.',
      'por_que', 'Las setas shiitake son la fuente más rica en ergotioneína, el antioxidante más potente conocido para las mitocondrias. El pollo aporta niacin (B3) biodisponible. El jengibre activa la AMPK, la enzima que regula el metabolismo energético.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has notado cambios en tu nivel de energía matutina esta semana?',
      'pregunta_tarde',  '¿Cuántas horas de trabajo concentrado puedes mantener hoy comparado con el lunes?',
      'pregunta_noche',  '¿Algo ha sorprendido esta semana — una comida, un efecto, una sensación?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El reset mitocondrial: qué está pasando en tu cuerpo estos 7 días',
      'texto',  'Días 1-3: activas los cofactores básicos (CoQ10, hierro, magnesio). Días 4-5: refuerzas la membrana y el metabolismo NAD+. Días 6-7: integras y consolidas. El cuerpo tarda entre 48h y 72h en incorporar cada cambio bioquímico. Por eso el protocolo es de 7 días y no de 3.'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 6 — Adaptógenos / Rhodiola + Batido
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'Los adaptógenos entrenan tu sistema nervioso para gestionar el estrés sin agotar tus reservas.',
  'Toma el batido por la mañana en ayunas — mayor absorción de los adaptógenos',
  jsonb_build_object(
    'push_message', '⚡ Día 6 — Los adaptógenos: el arma secreta contra la fatiga por estrés.',
    'fase', 'activar',
    'idea_clara', jsonb_build_object(
      'titulo',        'Adaptógenos — resistencia al estrés sin agotamiento',
      'texto',         'Los adaptógenos son plantas que regulan el eje HPA (hipotálamo-hipófisis-adrenal) — el sistema que controla la respuesta al estrés. La rhodiola rosea reduce el cortisol matutino y mejora la resistencia física. El ashwagandha baja la inflamación neurológica. El eleuterococo mejora la oxigenación celular. No son estimulantes — son reguladores.',
      'concepto_clave', 'Eje HPA y regulación del cortisol'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Batido adaptogénico de mañana',
      'descripcion', 'Leche de coco + plátano congelado + 1 cucharadita de rhodiola en polvo + 1 cucharadita de ashwagandha + cacao puro + dátil + hielo. Batir fuerte.',
      'por_que', 'La rhodiola actúa en 30 minutos — perfecta en ayunas. El cacao potencia el efecto adaptogénico vía flavanoles. El coco aporta MCT (triglicéridos de cadena media) que pasan directamente a las mitocondrias como combustible instantáneo. El plátano da potasio para el equilibrio nervioso.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo describes tu energía de hoy en una sola palabra?',
      'pregunta_tarde',  '¿Cómo gestionas el estrés hoy comparado con el lunes? ¿Ha cambiado algo?',
      'pregunta_noche',  '¿Qué hábito de los 6 días crees que vas a mantener después del reto?'
    ),
    'psicobiotico', jsonb_build_object(
      'titulo', 'Ashwagandha y microbioma: el eje bidireccional',
      'texto',  'El ashwagandha (Withania somnifera) reduce la permeabilidad intestinal y modula la composición del microbioma hacia especies productoras de butirato. En estudios de 8 semanas, redujo el cortisol matutino hasta un 27% y mejoró significativamente los marcadores de fatiga subjetiva.',
      'alimento_estrella', 'Ashwagandha KSM-66 (extracto estandarizado)'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 7 — HITO FINAL / Bol integrador
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  'El bol que integra todo lo que has aprendido esta semana.',
  'Cocina este último bol con tiempo — es una celebración, no una receta',
  jsonb_build_object(
    'push_message', '⚡ Día 7 — Lo has completado. Tu energía tiene una nueva base.',
    'fase', 'integrar',
    'hito', jsonb_build_object(
      'titulo', 'Día 7 — Reset completado',
      'descripcion', 'Siete días de bioquímica real. CoQ10, hierro + vitamina C, magnesio, omega-3, NAD+, adaptógenos. Cada pieza activando la siguiente. Tu energía ahora tiene una nueva línea base — no es suerte, es fisiología.',
      'reflexion', '¿Cuál ha sido el cambio más notable de esta semana? ¿Qué vas a mantener?',
      'estadisticas', jsonb_build_object(
        'dias_completados', 7,
        'moleculas_activadas', jsonb_build_array('CoQ10', 'Hierro biodisponible', 'Magnesio', 'DHA', 'NAD+', 'Rhodiola'),
        'siguiente_paso', 'Food-Mood Reset — 21 días para el eje intestino-cerebro'
      ),
      'cta_terciario', jsonb_build_object(
        'texto', 'Empezar Food-Mood Reset',
        'slug',  'food-mood-reset'
      )
    ),
    'idea_clara', jsonb_build_object(
      'titulo',        'El eje mitocondrial completo',
      'texto',         'En 7 días has activado los 6 factores más importantes de la producción energética celular: la chispa (CoQ10), el transporte de oxígeno (hierro), los cofactores enzimáticos (magnesio), la arquitectura de membrana (DHA), el combustible de longevidad (NAD+) y la resiliencia al estrés (adaptógenos). Ninguno funciona solo. Juntos, forman el sistema.',
      'concepto_clave', 'Bioenergética celular integrada'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo', 'Bol integrador de energía',
      'descripcion', 'Quinoa + espinacas baby + salmón en lata + aguacate + semillas de calabaza + pimiento rojo + huevo duro + vinagre de manzana + aceite de oliva virgen extra + limón.',
      'por_que', 'Cada ingrediente representa una de las 7 moléculas del reto: la quinoa da magnesio y hierro, el salmón da CoQ10 y DHA, el aguacate da grasas cofactoras, las semillas de calabaza dan zinc y magnesio, el pimiento da vitamina C para el hierro, el huevo da B12 y colina, el vinagre de manzana regula la glucosa postprandial.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy comparado con el día 1? (del 1 al 5)',
      'pregunta_tarde',  '¿Cuál ha sido el cambio más concreto que has notado esta semana?',
      'pregunta_noche',  '¿Qué protocolo vas a mantener después de hoy? Escríbelo — es más probable que lo cumplas.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Tu energía como hábito, no como esfuerzo',
      'texto',  'La energía sostenida no depende de la fuerza de voluntad. Depende de tener los cofactores correctos, en las cantidades correctas, con las combinaciones que permiten su absorción. Cuando el sistema funciona, la energía fluye sin que tengas que "esforzarte" en tenerla. Eso es lo que has construido esta semana.'
    )
  )
FROM public.challenges c WHERE c.slug = 'recupera-tu-energia'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
