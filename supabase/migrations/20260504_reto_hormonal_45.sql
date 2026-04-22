-- ── Nueva columna en challenges ───────────────────────────────────────────────
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS audiencia text;

-- ── Insertar reto hormonal ─────────────────────────────────────────────────────
INSERT INTO public.challenges (slug, title, subtitle, description, category, duration_days, price_eur, is_premium, emoji, color, recipe_count, audio_count, audiencia, incluye, hitos_landing, al_completar)
VALUES (
  'equilibrio-hormonal-45',
  'Equilibrio hormonal después de los 45',
  'Protocolo de 28 días para la perimenopausia. Basado en bioquímica hormonal real.',
  'Un protocolo de 28 días para estabilizar el estrógeno, la progesterona y el cortisol en la perimenopausia y menopausia. Sin suplementos de síntesis. Solo alimentos funcionales con evidencia científica que actúan sobre el estrobioma, los fitoestrógenos, la detoxificación hepática y el eje HPA.',
  'hormonal',
  28,
  39,
  true,
  '🌸',
  '#7B3F8B',
  28,
  4,
  'Mujeres en perimenopausia y menopausia',
  jsonb_build_array(
    '28 días de protocolo hormonal con evidencia',
    '4 audios guiados de apoyo (12-15 min)',
    'Registro diario de síntomas y bienestar',
    'Informe personalizado al completar',
    'Acceso de por vida al contenido'
  ),
  jsonb_build_array(
    jsonb_build_object('dia', 1,  'texto', 'Activas el estrobioma — las bacterias que metabolizan el estrógeno'),
    jsonb_build_object('dia', 7,  'texto', 'Semana 1 completada — tu microbioma intestinal ya está cambiando'),
    jsonb_build_object('dia', 14, 'texto', 'Los fitoestrógenos empiezan a modular tu señalización hormonal'),
    jsonb_build_object('dia', 21, 'texto', 'El hígado detoxifica el estrógeno con mayor eficiencia'),
    jsonb_build_object('dia', 28, 'texto', 'Protocolo permanente construido — tu nueva línea base hormonal')
  ),
  jsonb_build_object(
    'titulo',    '28 días completados',
    'subtitulo', 'Tu equilibrio hormonal tiene una nueva base. ¿Qué sigue?',
    'cta',       'Ver reto Food-Mood Reset (21 días)',
    'cta_slug',  'food-mood-reset'
  )
)
ON CONFLICT (slug) DO UPDATE SET
  title         = EXCLUDED.title,
  subtitle      = EXCLUDED.subtitle,
  description   = EXCLUDED.description,
  category      = EXCLUDED.category,
  duration_days = EXCLUDED.duration_days,
  price_eur     = EXCLUDED.price_eur,
  is_premium    = EXCLUDED.is_premium,
  emoji        = EXCLUDED.emoji,
  color        = EXCLUDED.color,
  recipe_count = EXCLUDED.recipe_count,
  audio_count  = EXCLUDED.audio_count,
  audiencia    = EXCLUDED.audiencia,
  incluye      = EXCLUDED.incluye,
  hitos_landing = EXCLUDED.hitos_landing,
  al_completar = EXCLUDED.al_completar;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 1 — ESTROBIOMA (días 1-7)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 1 — El estrobioma
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'Tus bacterias intestinales gestionan el estrógeno. Empieza aquí.',
  'Añade una cucharada de semillas de lino molidas a tu desayuno de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 1 — El equilibrio hormonal empieza en tu intestino. Te explicamos por qué.',
    'fase', 'estrobioma',
    'hito', NULL,
    'indice_foodmood', jsonb_build_object(
      'titulo', 'Tu punto de partida',
      'descripcion', 'Antes de empezar el protocolo, registra cómo te sientes hoy: energía, ánimo, síntomas hormonales y calidad del sueño. Será tu referencia al terminar los 28 días.',
      'preguntas', jsonb_build_array(
        '¿Cómo describirías tu energía general hoy? (1-5)',
        '¿Tienes sofocos, sudores nocturnos o irritabilidad? (nunca / a veces / a diario)',
        '¿Cómo es tu calidad de sueño esta semana? (1-5)',
        '¿Cómo está tu estado de ánimo? (1-5)'
      )
    ),
    'hito_landing', jsonb_build_object(
      'titulo', 'Día 1 — Activas el estrobioma',
      'descripcion', 'Las bacterias que metabolizan el estrógeno empiezan a recibir lo que necesitan.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El estrobioma — tu segundo sistema hormonal',
      'texto',          'El estrobioma es el conjunto de bacterias intestinales que producen una enzima llamada β-glucuronidasa. Esta enzima desconjuga el estrógeno metabolizado por el hígado, permitiendo que se reabsorba o se elimine. Cuando el estrobioma está desequilibrado, el estrógeno desconjugado se reabsorbe en exceso — dominancia estrogénica — o se elimina demasiado — déficit estrogénico. Las semillas de lino, la fibra fermentable y los fermentados son las palancas más directas.',
      'concepto_clave', 'β-glucuronidasa y circulación enterohepática del estrógeno'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Desayuno de lino y frutos rojos',
      'descripcion', 'Yogur natural (sin azúcar) con una cucharada de semillas de lino molidas, arándanos, frambuesas y nueces. Té verde o infusión de rooibos.',
      'por_que',     'Las semillas de lino son la fuente más rica en lignanos, fitoestrógenos que se unen a los receptores ER-β con efecto modulador. Los arándanos aportan polifenoles que alimentan a Bifidobacterium y Lactobacillus. El yogur introduce bacterias beneficiosas que equilibran la β-glucuronidasa.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy? ¿Hubo sofocos o sudores nocturnos esta noche?',
      'pregunta_tarde',  '¿Has añadido las semillas de lino? ¿Cómo te ha sentado el desayuno?',
      'pregunta_noche',  '¿Cómo describirías tu ánimo general de hoy? ¿Algún síntoma hormonal concreto que quieras registrar?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué los síntomas de la menopausia tienen tanto que ver con el intestino',
      'texto',  'El 80% del estrógeno circulante pasa por el intestino antes de eliminarse. Si tu microbioma produce demasiada β-glucuronidasa, ese estrógeno se reabsorbe y crea dominancia estrogénica: pechos sensibles, retención, irritabilidad. Si produce poca, el estrógeno se elimina demasiado rápido: sofocos, sequedad, fatiga. El estrobioma es el regulador hormonal que nadie te mencionó.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 2 — β-glucuronidasa y fibra
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'La fibra regula la enzima que controla cuánto estrógeno reabsorbes.',
  'Come dos tipos distintos de verdura en la comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 2 — La fibra no es solo digestión. Es regulación hormonal directa.',
    'fase', 'estrobioma',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Fibra fermentable y β-glucuronidasa',
      'texto',          'La fibra soluble (inulina, pectina, beta-glucanos) alimenta a bacterias como Roseburia y Faecalibacterium que producen butirato — el ácido graso de cadena corta que mantiene la barrera intestinal intacta y regula a la baja la β-glucuronidasa. Sin suficiente fibra fermentable, la enzima se sobreexpresa y el estrógeno se recircula en exceso.',
      'concepto_clave', 'Butirato y regulación del estrobioma'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada tibia de alcachofas y lentejas',
      'descripcion', 'Alcachofas al vapor con lentejas verdes cocidas, rúcula, cebolla morada, aceite de oliva virgen extra y vinagre de manzana. Semillas de girasol encima.',
      'por_que',     'Las alcachofas son la fuente más densa de inulina — la fibra prebiótica más estudiada para el estrobioma. Las lentejas aportan fibra resistente y zinc cofactor. La rúcula tiene glucosinolatos que apoyan la detoxificación hepática del estrógeno. El vinagre de manzana regula el pH intestinal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has notado algo diferente en tu digestión respecto a ayer?',
      'pregunta_tarde',  '¿Cuántas porciones de verdura has comido hoy? ¿De qué tipo?',
      'pregunta_noche',  '¿Tuviste sofocos hoy? ¿A qué hora y en qué contexto?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Las 25-30 gramos de fibra diaria que cambian el equilibrio hormonal',
      'texto',  'La mayoría de mujeres en perimenopausia consumen entre 12 y 15 g de fibra al día — la mitad de lo necesario. La diferencia entre 15 g y 30 g no es solo digestiva: en estudios de 12 semanas, aumentar la fibra fermentable redujo los marcadores de dominancia estrogénica en un 35% y mejoró la puntuación de síntomas menopáusicos en un 28%.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 3 — Magnesio, cortisol y progesterona
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  'El magnesio baja el cortisol. El cortisol bajo permite que suba la progesterona.',
  'Toma un puñado de semillas de calabaza esta tarde como snack',
  jsonb_build_object(
    'push_message', '🌸 Día 3 — Magnesio: el mineral que las hormonas necesitan para equilibrarse.',
    'fase', 'estrobioma',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Magnesio — el regulador del eje cortisol-progesterona',
      'texto',          'El cortisol y la progesterona comparten precursor: la pregnenolona. Cuando el cortisol se dispara cronicamente (estrés, insomnio, inflamación), "roba" la pregnenolona a la progesterona — el fenómeno llamado "pregnenolona steal". El magnesio regula el eje HPA a la baja, reduciendo la secreción de cortisol y liberando pregnenolona para la síntesis de progesterona. El déficit de magnesio es casi universal en mujeres de 45+.',
      'concepto_clave', 'Pregnenolona steal y equilibrio cortisol-progesterona'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Crema de espinacas con cacao y almendras',
      'descripcion', 'Crema de espinacas con leche de avena, una cucharada de cacao puro, almendras tostadas y una pizca de sal marina. Por la tarde: puñado de semillas de calabaza.',
      'por_que',     'Las espinacas son la fuente más biodisponible de magnesio vegetal. El cacao añade magnesio y flavanoles que reducen el cortisol matutino. Las semillas de calabaza aportan zinc que cofacilita la síntesis de progesterona. La sal marina da minerales traza que mejoran la absorción del magnesio.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo has dormido? ¿Tensión muscular o contracturas al levantarte?',
      'pregunta_tarde',  '¿Cómo está tu nivel de estrés hoy comparado con el día 1?',
      'pregunta_noche',  '¿Notas algún síntoma que relacionas con la progesterona baja (ansiedad, insomnio, irritabilidad premenstrual)?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El estrés crónico es el mayor disruptor hormonal de la perimenopausia',
      'texto',  'En la perimenopausia, los ovarios producen menos progesterona antes que menos estrógeno. El resultado es un período de dominancia estrogénica relativa. El estrés crónico agrava esto porque el cortisol compite directamente con la progesterona. Reducir el cortisol a través del magnesio, la ashwagandha y el sueño es la intervención hormonal más directa que existe fuera de la terapia hormonal.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 4 — Vitamina D3 y K2
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'La vitamina D3 no es solo para los huesos. Es una hormona que regula el receptor estrogénico.',
  'Sal al sol 15-20 minutos sin protector solar en cara y brazos',
  jsonb_build_object(
    'push_message', '🌸 Día 4 — Vitamina D3: la hormona que casi ninguna mujer de 45+ tiene en nivel óptimo.',
    'fase', 'estrobioma',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Vitamina D3 y K2 — el dúo hormonal olvidado',
      'texto',          'La vitamina D3 (colecalciferol) actúa como hormona esteroide: se une al receptor VDR presente en todas las células, incluidas las ováricas. Regula la expresión del receptor de estrógeno ER-α y ER-β, modulando la sensibilidad hormonal. La K2 (menaquinona-7) dirige el calcio a los huesos en lugar de los vasos, trabajando de forma sinérgica con la D3. El 80% de las mujeres en perimenopausia tienen niveles subóptimos de D3.',
      'concepto_clave', 'Receptor VDR y modulación hormonal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Salmón al horno con verduras y huevo',
      'descripcion', 'Salmón al horno (180°C, 15 min) con brócoli y zanahoria asados. Huevo duro encima. Aceite de oliva y limón.',
      'por_que',     'El salmón salvaje es la fuente alimentaria más densa de D3 (600-1000 UI por ración). El huevo aporta K2 natural (menaquinona-4) y D3 adicional. El brócoli tiene vitamina K1 que el intestino convierte parcialmente en K2. El aceite de oliva mejora la absorción de ambas vitaminas liposolubles.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has salido al sol hoy? ¿Cuántos minutos aproximadamente?',
      'pregunta_tarde',  '¿Cómo están tus articulaciones? ¿Tienes dolores o rigidez matutina?',
      'pregunta_noche',  '¿Cómo está tu estado de ánimo hoy? La D3 tiene efecto directo sobre la serotonina.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El nivel óptimo de D3 para la salud hormonal: 50-80 ng/mL, no 30',
      'texto',  'Los rangos de referencia del laboratorio (20-30 ng/mL) son mínimos para evitar raquitismo, no para la salud hormonal óptima. En estudios de mujeres en perimenopausia, niveles de D3 entre 50 y 80 ng/mL se asocian con menos síntomas vasomotores, mejor calidad de sueño y menor riesgo de depresión. Para alcanzar ese rango mediante la alimentación se necesitan 800-1200 UI diarias más exposición solar regular.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 5 — Omega-3 y membranas hormonales
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'Las hormonas se fabrican en membranas celulares. El omega-3 construye esas membranas.',
  'Añade sardinas, caballa o salmón en alguna comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 5 — Omega-3 DHA: la grasa que construye las membranas donde se fabrican las hormonas.',
    'fase', 'estrobioma',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'DHA — arquitectura de las membranas hormonales',
      'texto',          'Las hormonas esteroideas (estrógeno, progesterona, cortisol) se sintetizan en las mitocondrias de las células ováricas y suprarrenales. La fluidez de esas membranas mitocondriales depende del perfil de ácidos grasos. El DHA (omega-3 de cadena larga) hace las membranas más fluidas y eficientes. Niveles bajos de DHA se asocian con menor producción hormonal, peor respuesta a los receptores y mayor inflamación sistémica.',
      'concepto_clave', 'Fluidez de membrana y síntesis de hormonas esteroideas'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol de sardinas con aguacate y rúcula',
      'descripcion', 'Sardinas en aceite de oliva sobre rúcula baby, aguacate en láminas, cebolla morada, alcaparras y zumo de limón. Pan de centeno integral.',
      'por_que',     'Las sardinas tienen la mayor concentración de EPA+DHA por gramo de todos los pescados, además de D3, B12 y calcio. El aguacate aporta grasas monoinsaturadas cofactoras y glutatión. La rúcula tiene glucosinolatos que apoyan la fase II de la detoxificación hepática del estrógeno.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuántas veces has comido pescado azul esta semana? ¿Cuál ha sido tu fuente de omega-3?',
      'pregunta_tarde',  '¿Notas diferencia en tu piel o mucosas (sequedad)? El DHA mejora la hidratación celular.',
      'pregunta_noche',  '¿Cómo está tu concentración y memoria hoy? El DHA también es el principal ácido graso cerebral.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué el omega-3 reduce los síntomas vasomotores de la menopausia',
      'texto',  'Los sofocos y sudores nocturnos tienen una base inflamatoria: el aumento de IL-6 y TNF-α asociado al descenso estrogénico activa el termostato hipotalámico. El EPA (omega-3) inhibe la COX-2 y reduce estas citoquinas inflamatorias. En un metaanálisis de 6 ensayos, la suplementación con omega-3 redujo la frecuencia de sofocos en un 20% y su intensidad en un 33%.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 6 — Zinc y testosterona femenina
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'La testosterona femenina importa. El zinc es su cofactor principal.',
  'Come ostras, semillas de calabaza o carne roja magra hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 6 — Las mujeres también necesitamos testosterona. El zinc activa su síntesis.',
    'fase', 'estrobioma',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Zinc — cofactor de la testosterona femenina',
      'texto',          'La testosterona en mujeres (producida en los ovarios y las suprarrenales) es responsable de la libido, la masa muscular, la energía sostenida y la densidad ósea. En la perimenopausia, sus niveles caen antes que el estrógeno. El zinc es cofactor de la 17β-hidroxiesteroide deshidrogenasa, la enzima que convierte androstenediona en testosterona. Sin zinc suficiente, la conversión es ineficiente. El zinc también inhibe la aromatasa, la enzima que convierte testosterona en estrógeno.',
      'concepto_clave', 'Aromatasa y balance andrógeno-estrógeno'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Salteado de carne magra con setas y semillas de calabaza',
      'descripcion', 'Solomillo de ternera o pollo en tiras salteado con champiñones portobello, ajo, pimiento verde y una cucharada de semillas de calabaza tostadas al final. Arroz basmati.',
      'por_que',     'La carne roja magra tiene la mayor concentración de zinc biodisponible (zinc hemo). Las semillas de calabaza suman zinc vegetal y magnesio. Las setas aportan ergotioneína antioxidante. El ajo tiene alicina que mejora la circulación y potencia la respuesta hormonal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu nivel de energía y motivación hoy?',
      'pregunta_tarde',  '¿Has notado cambios en tu libido o en tu capacidad de esfuerzo físico esta semana?',
      'pregunta_noche',  '¿Cómo están tus músculos? ¿Estás manteniendo o perdiendo masa muscular?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'La testosterona femenina: el andrógeno que nadie habla en la consulta',
      'texto',  'A los 45 años, la testosterona femenina ya ha caído un 50% respecto a los 25. Esto explica la fatiga inexplicable, la pérdida de libido y la mayor dificultad para mantener músculo que muchas mujeres atribuyen erróneamente al estrés o al sedentarismo. El zinc, la vitamina D3 y el ejercicio de fuerza son las tres palancas más directas para mantener niveles funcionales sin intervención farmacológica.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 7 — HITO S1
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  'Una semana de estrobioma. Tu microbioma intestinal ya está cambiando.',
  'Hoy es el día de celebrar y hacer tu primera evaluación de síntomas',
  jsonb_build_object(
    'push_message', '🌸 Día 7 — Semana 1 completada. Tu intestino ya no es el mismo.',
    'fase', 'estrobioma',
    'hito', jsonb_build_object(
      'titulo',      'Semana 1 — El estrobioma activado',
      'descripcion', 'Siete días trabajando el estrobioma: lino y frutos rojos, fibra fermentable, magnesio, D3+K2, omega-3 y zinc. Cada día has añadido una pieza del sistema hormonal. El microbioma tarda entre 5 y 7 días en empezar a cambiar su composición — y eso es exactamente lo que ha pasado esta semana.',
      'reflexion',   '¿Qué síntoma hormonal ha mejorado más esta semana? ¿Cuál sigue igual? Anótalo para comparar al final del reto.',
      'estadisticas', jsonb_build_object(
        'semana',       1,
        'cofactores',   jsonb_build_array('Estrobioma', 'Fibra fermentable', 'Magnesio', 'D3+K2', 'DHA', 'Zinc'),
        'siguiente',    'Semana 2 — Fitoestrógenos'
      )
    ),
    'indice_foodmood', jsonb_build_object(
      'titulo', 'Evaluación de semana 1',
      'descripcion', 'Compara con el día 1. ¿Ha cambiado algo?',
      'preguntas', jsonb_build_array(
        '¿Cómo está tu energía general esta semana? (1-5)',
        '¿Han cambiado los sofocos o sudores nocturnos? (empeorado / igual / mejorado)',
        '¿Cómo es tu calidad de sueño esta semana? (1-5)',
        '¿Cómo está tu estado de ánimo? (1-5)'
      )
    ),
    'hito_landing', jsonb_build_object(
      'titulo',      'Día 7 — Semana 1 completada',
      'descripcion', 'El estrobioma está activo. Tu microbioma intestinal ya está cambiando.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'Qué ha pasado en tu cuerpo esta semana',
      'texto',          'El lino activó los receptores ER-β con lignanos. La fibra fermentable reguló la β-glucuronidasa. El magnesio redujo el cortisol y liberó progesterona. La D3 moduló los receptores hormonales. El DHA mejoró la síntesis de hormonas esteroideas. El zinc activó la testosterona. No son cambios independientes — son piezas de un sistema interconectado que empieza a funcionar como circuito.',
      'concepto_clave', 'Sistema hormonal como red interconectada'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol integrador de la semana 1',
      'descripcion', 'Quinoa con espinacas, sardinas en aceite de oliva, aguacate, semillas de lino molidas, semillas de calabaza, pimiento rojo y zumo de limón. Yogur natural con arándanos de postre.',
      'por_que',     'Cada ingrediente representa un cofactor de la semana: quinoa (magnesio), espinacas (magnesio+folato), sardinas (DHA+D3), aguacate (grasas cofactoras), lino (lignanos), calabaza (zinc), pimiento (vitamina C), yogur (estrobioma).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy comparado con el día 1? Sé específica.',
      'pregunta_tarde',  '¿Qué cambio concreto has notado esta semana que no esperabas?',
      'pregunta_noche',  '¿Qué hábito de los 7 días ha sido más fácil de mantener? ¿Cuál más difícil?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Semana 2: los fitoestrógenos y su efecto modulador en los receptores hormonales',
      'texto',  'La semana que viene trabajamos los fitoestrógenos: isoflavonas de soja, urolitinas de la granada, cumestanos de las legumbres y adaptógenos femeninos. Estos compuestos se unen al receptor de estrógeno ER-β con un efecto 100 a 1000 veces más suave que el estrógeno endógeno — modulando la señalización sin los efectos secundarios de la terapia hormonal sintética.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 2 — FITOESTRÓGENOS (días 8-14)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 8 — Isoflavonas / ER-β
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 8,
  'Las isoflavonas de soja se unen a tus receptores de estrógeno. Sin los efectos del estrógeno sintético.',
  'Añade tempeh, tofu o edamame a alguna comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 8 — Semana 2: fitoestrógenos. Las plantas que modulan tus hormonas.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Isoflavonas — moduladores selectivos del receptor estrogénico',
      'texto',          'Las isoflavonas (genisteína, daidzeína) son fitoestrógenos que se unen preferentemente al receptor ER-β, con una afinidad 100 a 1000 veces menor que el 17β-estradiol. El ER-β tiene efectos opuestos al ER-α en muchos tejidos: antiproliferativo en mama y útero, protector cardiovascular, neuroprotector. Las mujeres japonesas, con consumo habitual de soja fermentada, tienen una incidencia de sofocos 4 veces menor que las occidentales.',
      'concepto_clave', 'Receptores ER-α vs ER-β y selectividad de las isoflavonas'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol de miso con tofu y verduras',
      'descripcion', 'Caldo de miso (pasta de miso sin pasteurizar disuelta en agua caliente a 60°C) con tofu firme en dados, wakame, champiñones y jengibre fresco.',
      'por_que',     'El miso fermentado tiene isoflavonas en forma de aglicona, más biodisponible que la soja no fermentada. El tofu aporta proteína completa y calcio. El wakame tiene fucoidano antiinflamatorio y yodo para la tiroides. El jengibre potencia la absorción de las isoflavonas.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo has dormido? ¿Sofocos nocturnos?',
      'pregunta_tarde',  '¿Has probado algún alimento de soja fermentada esta semana?',
      'pregunta_noche',  '¿Cómo está tu nivel de ansiedad o irritabilidad hoy?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'La controversia de la soja en la menopausia: lo que dice la evidencia',
      'texto',  'La soja no aumenta el riesgo de cáncer de mama. La evidencia más sólida apunta al efecto contrario con soja fermentada. Las isoflavonas actúan como moduladores selectivos naturales (SERMs): pueden reducir la proliferación en tejido mamario mientras alivian los síntomas vasomotores. La soja fermentada (miso, tempeh, natto) tiene mejor biodisponibilidad que la no fermentada.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 9 — Urolitinas / Granada
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 9,
  'La granada produce urolitinas — fitoestrógenos que también regeneran las mitocondrias.',
  'Come media granada hoy, con las semillas incluidas',
  jsonb_build_object(
    'push_message', '🌸 Día 9 — Granada: el fitoestrógeno que también rejuvenece tus células.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Urolitinas — de la granada a la mitofagia',
      'texto',          'Los elagitaninos de la granada y las nueces son metabolizados por el microbioma intestinal en urolitinas (UA, UB, UC). Las urolitinas son potentes activadores de la mitofagia (reciclaje de mitocondrias dañadas). Además, actúan como fitoestrógenos ER-β selectivos con propiedades antiinflamatorias vía inhibición de NF-κB. Solo el 30-40% de las personas convierten eficientemente los elagitaninos en urolitinas, dependiendo directamente de su microbioma.',
      'concepto_clave', 'Mitofagia e urolitinas como metabolitos del microbioma'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada de granada, rúcula y nueces',
      'descripcion', 'Rúcula baby con granos de granada, nueces troceadas, queso de cabra, cebolla morada y vinagreta de vinagre de manzana con aceite de oliva y mostaza antigua.',
      'por_que',     'La granada y las nueces son las dos fuentes más densas de elagitaninos precursores de urolitinas. La rúcula añade glucosinolatos. El queso de cabra aporta calcio y CLA antiinflamatorio. El vinagre de manzana regula el pH intestinal, optimizando la conversión de elagitaninos.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has incorporado frutos rojos o granada en tus comidas esta semana?',
      'pregunta_tarde',  '¿Cómo está tu digestión? Las urolitinas dependen de un microbioma sano.',
      'pregunta_noche',  '¿Notas cambios en tu energía respecto a la semana pasada?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué no todas las mujeres responden igual a los fitoestrógenos',
      'texto',  'La variabilidad en la respuesta a la soja, la granada y la linaza depende en gran parte del microbioma individual. El equol (metabolito de la daidzeína) y las urolitinas (metabolitos de la granada) solo se producen si tienes las bacterias adecuadas. Por eso invertir en el estrobioma primero (semana 1) antes de añadir fitoestrógenos es el orden correcto del protocolo.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 10 — Cumestanos / Legumbres
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 10,
  'Las legumbres tienen cumestanos — fitoestrógenos menos conocidos pero igual de potentes.',
  'Come lentejas, garbanzos o alubias en la comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 10 — Legumbres: la fuente de fitoestrógenos más infrautilizada.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Cumestanos — el fitoestrógeno de las legumbres',
      'texto',          'Los cumestanos (cumestrol, 4-metoxicumestrol) son fitoestrógenos presentes en judías, garbanzos, lentejas y brotes de trébol. Tienen una afinidad ER-β hasta 2 veces mayor que las isoflavonas. A diferencia de las isoflavonas de soja, no generan controversia clínica. Las legumbres también aportan fibra prebiótica que alimenta al estrobioma, creando un efecto dual: fitoestrógeno más soporte del microbioma hormonal.',
      'concepto_clave', 'Cumestanos y afinidad selectiva ER-β'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Hummus casero con crudités y pan de centeno',
      'descripcion', 'Hummus de garbanzos (garbanzos cocidos, tahini, ajo, zumo de limón, aceite de oliva, comino) con bastones de zanahoria, apio y pepino. Pan de centeno integral.',
      'por_que',     'Los garbanzos tienen cumestanos y galactooligosacáridos prebióticos que alimentan a Bifidobacterium, el principal productor de equol. El tahini aporta calcio y lignanos. El ajo tiene alicina y fructooligosacáridos prebióticos. El limón mejora la absorción del hierro no-hemo.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuántas veces has comido legumbres esta semana?',
      'pregunta_tarde',  '¿Has notado cambios en tu digestión al aumentar la fibra?',
      'pregunta_noche',  '¿Cómo está tu piel esta semana? Los fitoestrógenos mejoran la hidratación dérmica.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Las legumbres y la menopausia: el alimento más completo que existe',
      'texto',  'Las legumbres tienen el perfil más completo para la salud hormonal en la menopausia: proteína vegetal (protege el músculo), fibra fermentable (cuida el estrobioma), fitoestrógenos (modulan los receptores), hierro (combate la fatiga), zinc (apoya la testosterona) y folato (cofactor de la metilación de estrógenos). Consumirlas 4-5 veces a la semana es la intervención dietética de mayor impacto hormonal por ración.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 11 — Adaptógenos femeninos
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 11,
  'La ashwagandha y la maca peruana actúan directamente sobre el eje hipotálamo-hipófisis-ovario.',
  'Añade ashwagandha o maca en polvo a tu desayuno o batido',
  jsonb_build_object(
    'push_message', '🌸 Día 11 — Adaptógenos femeninos: las plantas que regulan el eje hormonal.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Adaptógenos femeninos y el eje HHO',
      'texto',          'Los adaptógenos actúan sobre el eje hipotálamo-hipófisis-ovario (HHO). La ashwagandha (KSM-66) reduce el cortisol matutino hasta un 27%, liberando pregnenolona para la síntesis de progesterona. La maca peruana actúa como adaptógeno que modula la LH y FSH via el hipotálamo, reduciendo los sofocos en un 34% en ensayos de 12 semanas. La rhodiola reduce la fatiga suprarrenal que agrava los síntomas menopáusicos.',
      'concepto_clave', 'Eje HHO y adaptógenos como moduladores no hormonales'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Batido adaptogénico femenino',
      'descripcion', 'Leche de almendras, plátano congelado, una cucharadita de maca en polvo, una cucharadita de ashwagandha, cacao puro, una cucharada de semillas de lino y un dátil. Batir.',
      'por_que',     'La maca modula LH y FSH en días y actúa a nivel sintomático en 6-8 semanas. El cacao potencia el efecto adaptogénico y aporta magnesio. El lino añade lignanos fitoestrógenos. La almendra da calcio y vitamina E. El plátano aporta potasio y triptófano para la serotonina nocturna.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo describes tu nivel de estrés crónico esta semana comparado con el inicio del reto?',
      'pregunta_tarde',  '¿Has probado la maca o la ashwagandha? ¿Cómo te ha sentado?',
      'pregunta_noche',  '¿Han cambiado los sofocos o los sudores nocturnos en estos 11 días?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Maca peruana: qué dice la ciencia más allá del marketing',
      'texto',  'La maca tiene 4 ensayos clínicos de calidad que muestran reducción de síntomas menopáusicos (sofocos, ansiedad, disfunción sexual) sin modificar los niveles hormonales en sangre. Su mecanismo no es hormonal directo — actúa como secretagogo hipotalámico. Esto la hace segura incluso para mujeres con historial de cáncer hormono-dependiente. La dosis efectiva es 2-3 g al día de maca gelatinizada.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 12 — Proteína y músculo
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 12,
  'La pérdida de músculo después de los 45 es hormonal. La proteína la frena.',
  'Come al menos 30 gramos de proteína en el desayuno y en la comida',
  jsonb_build_object(
    'push_message', '🌸 Día 12 — Proteína: el macronutriente que más subestiman las mujeres de 45+.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Proteína y la resistencia anabólica en la menopausia',
      'texto',          'En la menopausia, el estrógeno deja de proteger el tejido muscular: el músculo responde menos a la proteína de la dieta (resistencia anabólica). Para mantener la misma síntesis proteica, las mujeres de 45+ necesitan un 50-100% más de leucina por toma. Esto implica aumentar la ingesta proteica total a 1,4-1,8 g por kg de peso y distribuirla en 3-4 tomas de al menos 25-35 g. La masa muscular es el mayor órgano metabólico y endocrino del cuerpo.',
      'concepto_clave', 'Resistencia anabólica y umbral de leucina'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Desayuno de proteína completa: huevos con salmón ahumado',
      'descripcion', 'Dos huevos revueltos con salmón ahumado, aguacate, tostada de pan de centeno y tomate cherry. Yogur griego natural con nueces y semillas de lino de postre.',
      'por_que',     'Los huevos tienen el perfil de aminoácidos más completo y la mayor concentración de leucina por gramo de proteína. El salmón suma omega-3 DHA y D3. El yogur griego añade proteína extra y bacterias beneficiosas. Juntos dan 35-40 g de proteína con todos los aminoácidos esenciales.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuánta proteína has comido ayer? ¿Estás llegando al objetivo?',
      'pregunta_tarde',  '¿Haces algún tipo de ejercicio de fuerza? ¿Cuántas veces a la semana?',
      'pregunta_noche',  '¿Cómo está tu composición corporal? ¿Notas cambios en músculo o grasa?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué las mujeres de 45+ necesitan más proteína, no menos',
      'texto',  'El mito de que la proteína daña los riñones o los huesos está refutado para personas sanas. La evidencia más reciente es clara: en mujeres posmenopáusicas, ingestas de 1,6-2 g por kg al día combinadas con ejercicio de fuerza preservan la masa muscular, mejoran la sensibilidad a la insulina y reducen el riesgo de fracturas. El déficit proteico es la causa más subestimada de fatiga y sarcopenia en la menopausia.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 13 — Sueño hormonal
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 13,
  'Sin sueño profundo, las hormonas no se reparan. El sueño es la terapia hormonal gratuita.',
  'Cena antes de las 20h hoy y apaga las pantallas a las 21h',
  jsonb_build_object(
    'push_message', '🌸 Día 13 — El sueño repara tus hormonas. Esta noche, el protocolo nocturno completo.',
    'fase', 'fitoestrógenos',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Sueño y reparación hormonal nocturna',
      'texto',          'Durante el sueño NREM3 (sueño profundo), se secretan el 70% de la hormona de crecimiento, se produce la mayor parte de la progesterona nocturna y se regula el eje HPA. La privación de sueño aumenta el cortisol basal en un 37% y reduce la testosterona libre en un 15% en mujeres de 45+. Los sofocos nocturnos interrumpen el sueño profundo, creando un ciclo de privación que agrava todos los síntomas hormonales.',
      'concepto_clave', 'NREM3, GH nocturna y eje HPA'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Cena hormonal y protocolo nocturno',
      'descripcion', 'Crema de boniato con leche de coco, cúrcuma y jengibre. Infusión de valeriana y melisa a las 21h. Semillas de calabaza como snack nocturno si hay hambre.',
      'por_que',     'El boniato tiene triptófano que el cuerpo convierte en serotonina y melatonina. La leche de coco aporta MCT que estabilizan la glucosa nocturna. La cúrcuma reduce la inflamación que interrumpe el sueño profundo. La valeriana actúa sobre los receptores GABA-A. Las semillas de calabaza dan magnesio y zinc para la síntesis de melatonina.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿A qué hora te fuiste a dormir? ¿Cuántas horas dormiste sin interrupción?',
      'pregunta_tarde',  '¿Tienes un ritual nocturno establecido? ¿Qué lo interrumpe habitualmente?',
      'pregunta_noche',  '¿Has seguido el protocolo nocturno hoy? ¿Cómo te sientes?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué los sofocos nocturnos son el síntoma más dañino de la perimenopausia',
      'texto',  'Un sofoco nocturno no es solo incómodo — interrumpe el ciclo de sueño y saca del NREM3, el estadio de reparación hormonal más importante. Las mujeres que tienen más de 2 sofocos nocturnos por semana muestran niveles de cortisol matutino un 40% más altos y marcadores de inflamación sistémica significativamente elevados.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 14 — HITO S2
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 14,
  'Dos semanas de fitoestrógenos y adaptógenos. Tu señalización hormonal está cambiando.',
  'Haz la evaluación de semana 2 y compara con el día 7',
  jsonb_build_object(
    'push_message', '🌸 Día 14 — Dos semanas completadas. Los fitoestrógenos ya están trabajando.',
    'fase', 'fitoestrógenos',
    'hito', jsonb_build_object(
      'titulo',      'Semana 2 — Los fitoestrógenos activados',
      'descripcion', 'Dos semanas de protocolo hormonal. Esta semana añadiste isoflavonas, urolitinas de la granada, cumestanos de las legumbres, adaptógenos femeninos (maca y ashwagandha), proteína para preservar el músculo y el protocolo de sueño hormonal. La modulación de los receptores ER-β tarda entre 2 y 4 semanas en reflejarse en los síntomas — estás exactamente en ese punto de inflexión.',
      'reflexion',   '¿Han cambiado los sofocos, el sueño o el ánimo respecto al día 7? Compara tus respuestas de hoy con las del hito de la semana pasada.',
      'estadisticas', jsonb_build_object(
        'semana',     2,
        'cofactores', jsonb_build_array('Isoflavonas', 'Urolitinas', 'Cumestanos', 'Adaptógenos', 'Proteína', 'Protocolo nocturno'),
        'siguiente',  'Semana 3 — Detoxificación hepática'
      )
    ),
    'indice_foodmood', jsonb_build_object(
      'titulo', 'Evaluación de semana 2',
      'descripcion', 'Compara con el día 7 y con el día 1.',
      'preguntas', jsonb_build_array(
        '¿Cómo está tu energía general esta semana? (1-5)',
        '¿Han cambiado los sofocos o sudores nocturnos? (empeorado / igual / mejorado)',
        '¿Cómo es tu calidad de sueño? (1-5)',
        '¿Cómo está tu estado de ánimo y nivel de ansiedad? (1-5)'
      )
    ),
    'hito_landing', jsonb_build_object(
      'titulo',      'Día 14 — Dos semanas completadas',
      'descripcion', 'Los fitoestrógenos modulan tus receptores hormonales. El sistema está respondiendo.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'Lo que ha pasado en tu cuerpo estas dos semanas',
      'texto',          'Los lignanos del lino iniciaron la modulación ER-β. Las isoflavonas del miso continuaron el trabajo sobre los receptores. Las urolitinas de la granada activaron la mitofagia hormonal. Los cumestanos de las legumbres refinaron la señalización. La maca moduló el eje hipotalámico. La ashwagandha redujo el cortisol y liberó progesterona. El protocolo nocturno empezó a reparar el sistema desde dentro.',
      'concepto_clave', 'Modulación ER-β acumulativa y cronobiología hormonal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol integrador de la semana 2',
      'descripcion', 'Tempeh salteado con setas, edamame, quinoa negra, granos de granada, rúcula, semillas de cáñamo y vinagreta de miso y jengibre.',
      'por_que',     'Tempeh (isoflavonas fermentadas), edamame (cumestanos y proteína), granada (urolitinas), quinoa (magnesio y proteína completa), setas (ergotioneína y vitamina D), rúcula (glucosinolatos), miso (probiótico e isoflavonas).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy respecto al día 1 y al día 7?',
      'pregunta_tarde',  '¿Qué cambio has notado más claramente en estas dos semanas?',
      'pregunta_noche',  '¿Qué hábito de la semana 2 es más fácil de mantener a largo plazo?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Semana 3: el hígado como segundo ovario',
      'texto',  'El hígado metaboliza el estrógeno en tres vías: la 2-OH (protectora), la 4-OH (genotóxica en exceso) y la 16-OH (proliferativa). El DIM del brócoli favorece la vía 2-OH. El cardo mariano apoya la fase II de glucuronidación. La semana que viene, trabajamos estas palancas para que el hígado metabolice el estrógeno hacia la vía más segura y eficiente.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 3 — DETOXIFICACIÓN (días 15-21)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 15 — Hígado y DIM
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 15,
  'El hígado decide qué hace con el estrógeno. El DIM del brócoli guía esa decisión.',
  'Come brócoli o coliflor hoy, preferiblemente ligeramente cocinado',
  jsonb_build_object(
    'push_message', '🌸 Día 15 — Semana 3: el hígado como tu segundo ovario. Empieza la detoxificación.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'DIM y la metilación del estrógeno',
      'texto',          'El diindolilmetano (DIM) se forma al cocinar las crucíferas (brócoli, coliflor, col rizada, rúcula). Activa la enzima CYP1A1 que favorece la vía 2-hidroxilación del estrógeno, produciendo 2-OH-estrona, el metabolito protector. Desfavorece la vía 16-OH (proliferativa) y la 4-OH (genotóxica en exceso). Este mecanismo es el argumento central detrás del menor riesgo de cáncer de mama en mujeres con alto consumo de crucíferas.',
      'concepto_clave', 'DIM, CYP1A1 y vías de metabolización del estrógeno'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Brócoli asado con ajo y tahini',
      'descripcion', 'Brócoli en ramilletes asado al horno (200°C, 20 min) con ajo picado y aceite de oliva. Tahini negro por encima y zumo de limón. Semillas de sésamo tostadas.',
      'por_que',     'El brócoli asado (no hervido) conserva mejor el sulforafano e indol-3-carbinol precursores del DIM. El ajo activa NRF2, el factor de transcripción que regula la detoxificación hepática. El tahini negro aporta calcio, lignanos y metionina para la metilación. El limón mejora la absorción del sulforafano.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has comido crucíferas esta semana? ¿Con qué frecuencia?',
      'pregunta_tarde',  '¿Cómo está tu hígado? ¿Pesadez postprandial, sensación de digestión lenta?',
      'pregunta_noche',  '¿Hay algo que hayas comido últimamente que sabes que dificulta la detoxificación hepática?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El hígado metaboliza el estrógeno en 3 fases: qué puedes hacer con la dieta',
      'texto',  'Fase I (CYP450): convierte el estrógeno en metabolitos activos. El DIM favorece la vía 2-OH protectora. Fase II (glucuronidación y sulfatación): conjuga los metabolitos para eliminarlos. La glucuronidación necesita magnesio y B6. La sulfatación necesita metionina y taurina. Fase III (eliminación): el intestino sano elimina lo conjugado; el estrobioma desequilibrado lo desconjuga y reabsorbe. Las tres fases dependen de la dieta.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 16 — Cardo mariano
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 16,
  'La silimarina del cardo mariano es el hepatoprotector más estudiado del mundo.',
  'Busca cardo mariano en herbolario o como suplemento y tómalo con la comida',
  jsonb_build_object(
    'push_message', '🌸 Día 16 — Cardo mariano: el hígado necesita protección para metabolizar bien el estrógeno.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Silimarina — hepatoprotección y detoxificación estrogénica',
      'texto',          'La silimarina (mezcla de flavonolignanos del cardo mariano) tiene tres mecanismos de acción sobre el metabolismo del estrógeno: inhibe la peroxidación lipídica en los hepatocitos (protege la membrana celular hepática), activa la glucuroniltransferasa UGT1A1 (enzima de la fase II que conjuga el estrógeno para su eliminación) y reduce la inflamación hepática vía NF-κB. Un hígado inflamado metaboliza mal el estrógeno independientemente de la dieta.',
      'concepto_clave', 'UGT1A1, glucuronización y hepatoprotección'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada depurativa con alcachofas y remolacha',
      'descripcion', 'Remolacha cocida en láminas con alcachofa al vapor, espinacas, nueces y vinagreta de zumo de limón, aceite de oliva y mostaza. Semillas de girasol encima.',
      'por_que',     'La remolacha tiene betaína que apoya la metilación hepática. La alcachofa tiene cinarina que estimula la producción de bilis (necesaria para la eliminación del estrógeno conjugado). Las espinacas aportan folato para la metilación. Las nueces dan ácido elágico que protege los hepatocitos.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Has tomado cardo mariano hoy? ¿En qué forma?',
      'pregunta_tarde',  '¿Bebes suficiente agua? La eliminación renal del estrógeno requiere buena hidratación.',
      'pregunta_noche',  '¿Consumes alcohol habitualmente? El alcohol inhibe directamente la glucuronización del estrógeno.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué el alcohol es el mayor disruptor de la metabolización del estrógeno',
      'texto',  'El alcohol compite con el estrógeno por las enzimas de la fase I y II hepática. Con 2 copas de vino al día, los niveles circulantes de estrógeno aumentan un 22% en mujeres posmenopáusicas — independientemente de si están en terapia hormonal. El acetaldehído (metabolito del alcohol) además inhibe directamente la UGT1A1, bloqueando la glucuronización. Este es el mecanismo por el que el consumo de alcohol se asocia con mayor riesgo de cáncer de mama hormono-dependiente.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 17 — Permeabilidad intestinal
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 17,
  'Un intestino permeable reabsorbe el estrógeno que el hígado ya había empaquetado para eliminar.',
  'Añade caldo de huesos casero o gelatina sin azúcar a tu comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 17 — Intestino permeable: la puerta trasera por donde el estrógeno vuelve a entrar.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Permeabilidad intestinal y recirculación del estrógeno',
      'texto',          'Las uniones estrechas del epitelio intestinal (claudinas, ocludinas) forman la barrera que impide que moléculas grandes pasen al torrente sanguíneo. Cuando esta barrera se deteriora (leaky gut), el estrógeno glucuronizado — que el hígado había empaquetado para eliminar — puede ser escindido por la β-glucuronidasa bacteriana y reabsorberse. La glutamina es el principal combustible de los enterocitos. El caldo de huesos aporta glutamina, glicina y prolina que reparan la barrera intestinal.',
      'concepto_clave', 'Uniones estrechas, glutamina y barrera intestinal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Sopa de caldo de huesos con verduras y cúrcuma',
      'descripcion', 'Caldo de huesos casero (o de calidad) con zanahoria, apio, puerro, cúrcuma fresca y jengibre. Arroz integral o fideos de arroz. Aceite de oliva al servir.',
      'por_que',     'El caldo de huesos aporta glutamina (combustible de los enterocitos), glicina (cofactor de la síntesis de colágeno para uniones estrechas), colágeno hidrolizado (repara la mucosa) y gelatina (protege la barrera). La cúrcuma reduce la inflamación de la mucosa. El jengibre estimula la motilidad que evita el estancamiento del contenido intestinal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes síntomas de permeabilidad intestinal? (hinchazón, gases, intolerancia a ciertos alimentos)',
      'pregunta_tarde',  '¿Has tomado caldo de huesos u otro alimento reparador intestinal hoy?',
      'pregunta_noche',  '¿Cuánto estrés tienes en este momento? El estrés crónico deteriora la barrera intestinal directamente.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El círculo vicioso del intestino permeable y la dominancia estrogénica',
      'texto',  'Intestino permeable → mayor β-glucuronidasa → más estrógeno reabsorbido → dominancia estrogénica → más inflamación → más permeabilidad. Romper este ciclo requiere actuar en dos frentes simultáneamente: reparar la barrera (glutamina, zinc carnosina, caldo de huesos) y equilibrar el estrobioma (fibra prebiótica, fermentados, DIM). El protocolo de estas 3 semanas actúa sobre los dos.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 18 — Tiroides, yodo y selenio
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 18,
  'El hipotiroidismo subclínico agrava todos los síntomas de la perimenopausia. El selenio lo previene.',
  'Come nueces de Brasil hoy — 2 unidades cubren el 100% del selenio diario',
  jsonb_build_object(
    'push_message', '🌸 Día 18 — Tiroides y hormonas sexuales: el vínculo que nadie te explicó.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Tiroides, selenio y la conversión de T4 a T3',
      'texto',          'Las hormonas tiroideas (T3 activa) y el estrógeno compiten por los mismos transportadores plasmáticos. El descenso estrogénico en la perimenopausia aumenta la disponibilidad de la globulina transportadora (TBG), que puede secuestrar T4 y reducir la T3 libre disponible. Además, la conversión de T4 a T3 activa requiere selenio (selenoproteína deiodinasa DIO1). El déficit de selenio es frecuente en mujeres de 45+ y puede causar hipotiroidismo funcional con analítica normal.',
      'concepto_clave', 'DIO1, selenio y conversión T4-T3'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Ensalada de wakame con salmón y nueces de Brasil',
      'descripcion', 'Wakame rehidratado con salmón al horno, edamame, sésamo, jengibre rallado y vinagreta de tamari y aceite de sésamo. 2 nueces de Brasil al final.',
      'por_que',     'El wakame aporta yodo biodisponible (esencial para la síntesis de hormonas tiroideas) y fucoidano antiinflamatorio. Las nueces de Brasil son la fuente más concentrada de selenio del planeta (70-90 mcg por unidad). El salmón suma omega-3 que mejora la sensibilidad de los receptores tiroideos. El tamari aporta yodo adicional.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes síntomas de hipotiroidismo subclínico? (fatiga persistente, frío, caída de cabello, uñas frágiles)',
      'pregunta_tarde',  '¿Cuándo fue tu última analítica de tiroides? ¿Incluía T3 libre y anticuerpos anti-TPO?',
      'pregunta_noche',  '¿Comes algas o pescado de mar con regularidad? Son las principales fuentes de yodo.'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Hipotiroidismo subclínico: el diagnóstico que no aparece en la analítica pero sí en los síntomas',
      'texto',  'Una TSH entre 2,5 y 4,5 mUI/L puede ser normal en el laboratorio pero subóptima para la función tiroidea en mujeres de 45+. La TSH óptima para la salud hormonal femenina está entre 1 y 2 mUI/L. Además, muchos médicos no piden T3 libre ni anticuerpos anti-TPO en la revisión rutinaria. Si tienes síntomas tiroideos con analítica normal, pide una ampliación del perfil tiroideo.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 19 — Colágeno y huesos
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 19,
  'El estrógeno protege el colágeno y los huesos. Cuando baja, tú pones los cofactores.',
  'Añade vitamina C en cada comida hoy — activa la síntesis de colágeno',
  jsonb_build_object(
    'push_message', '🌸 Día 19 — Colágeno y huesos: lo que el estrógeno hacía sin que lo supieras.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Estrógeno, colágeno y densidad ósea',
      'texto',          'El estrógeno estimula los osteoblastos (células que forman hueso) y frena los osteoclastos (células que reabsorben hueso). También activa la prolil-hidroxilasa, la enzima que estabiliza el colágeno. Con el descenso estrogénico, la remodelación ósea se acelera: se pierde hasta un 2-3% de densidad ósea al año en los primeros 5 años posmenopáusicos. Los cofactores para compensar: vitamina C (síntesis de colágeno), D3+K2 (mineralización ósea), magnesio (activación de D3), proteína (matriz proteica ósea) y silicio (reticulación del colágeno).',
      'concepto_clave', 'Prolil-hidroxilasa, colágeno tipo I y remodelación ósea'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Caldo de huesos con pimiento rojo y perejil',
      'descripcion', 'Caldo de huesos (pollo o ternera) con pimiento rojo asado, perejil fresco, zanahoria y cúrcuma. Tostada de pan de centeno con aguacate y zumo de limón.',
      'por_que',     'El caldo de huesos aporta colágeno hidrolizado, glicina, prolina e hidroxiprolina biodisponibles. El pimiento rojo tiene 3 veces más vitamina C que una naranja — necesaria para la prolil-hidroxilasa. El perejil fresco aporta vitamina K1 y silicio. El aguacate da vitamina K y grasas para la absorción de D3 y K2.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes dolores articulares, sequedad de piel o cabello más frágil? Son señales de déficit de colágeno.',
      'pregunta_tarde',  '¿Has hecho algún ejercicio de impacto o fuerza esta semana? Es el estímulo mecánico que más activa la formación ósea.',
      'pregunta_noche',  '¿Cuándo fue tu última densitometría ósea? ¿Conoces tu T-score?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'La ventana de los 5 primeros años: por qué actuar ahora importa más que nunca',
      'texto',  'Los primeros 5 años posmenopáusicos son la ventana crítica de pérdida ósea. La velocidad de pérdida de colágeno también es máxima en este período. Actuar en esta ventana con los cofactores correctos (proteína, vitamina C, D3+K2, ejercicio de fuerza, colágeno hidrolizado) puede reducir la pérdida ósea anual a menos del 1%. Después de los 5 años, el ritmo se estabiliza pero el daño ya está hecho.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 20 — Microbioma vaginal
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 20,
  'El estrógeno mantiene el pH vaginal ácido. Cuando baja, el microbioma cambia. La dieta ayuda.',
  'Come yogur natural, kéfir o un alimento fermentado hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 20 — Microbioma vaginal: el ecosistema que el estrógeno protegía.',
    'fase', 'detoxificación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Estrógeno, Lactobacillus y pH vaginal',
      'texto',          'El estrógeno estimula la producción de glucógeno en el epitelio vaginal. El glucógeno alimenta a Lactobacillus crispatus y reuteri, que producen ácido láctico y mantienen el pH vaginal en 3,8-4,5. Con el descenso estrogénico, el pH sube a 5-7, permitiendo el crecimiento de bacterias oportunistas. Esto explica las infecciones recurrentes, la sequedad y el disconfort. Los fermentados orales con Lactobacillus reuteri y rhamnosus han mostrado capacidad de colonización vaginal en estudios clínicos.',
      'concepto_clave', 'Glucógeno epitelial, Lactobacillus y pH vaginal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol de kéfir con lino y frutos rojos',
      'descripcion', 'Kéfir natural (sin azúcar) con una cucharada de semillas de lino molidas, arándanos, frambuesas, nueces y una cucharadita de miel de manuka (opcional).',
      'por_que',     'El kéfir tiene 30-50 cepas bacterianas distintas, incluyendo Lactobacillus reuteri y rhamnosus que han demostrado colonización vaginal. El lino añade lignanos fitoestrógenos que apoyan el trofismo del epitelio vaginal. Los arándanos tienen proantocianidinas que inhiben la adherencia bacteriana al epitelio. La miel de manuka tiene metilglioxal antimicrobiano natural.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes síntomas de atrofia vulvovaginal? (sequedad, ardor, infecciones recurrentes)',
      'pregunta_tarde',  '¿Consumes fermentados habitualmente? ¿De qué tipo?',
      'pregunta_noche',  '¿Usas productos íntimos con agentes que alteran el pH? (jabones alcalinos, óvulos perfumados)'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Síndrome genitourinario de la menopausia: la solución nutricional más infravalorada',
      'texto',  'El síndrome genitourinario de la menopausia (GSM) afecta al 50-70% de las mujeres posmenopáusicas pero solo el 7% recibe tratamiento. La dieta puede ayudar en dos frentes: los fitoestrógenos (lino, soja fermentada) mejoran el trofismo del epitelio vaginal al unirse al ER-β local; los probióticos con Lactobacillus reuteri y rhamnosus restauran el microbioma vaginal. Estos enfoques no sustituyen al estrógeno local cuando el GSM es moderado-severo, pero son valiosos como adyuvantes.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 21 — HITO S3
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 21,
  'Tres semanas de protocolo. El hígado detoxifica el estrógeno con mayor eficiencia.',
  'Haz la evaluación de semana 3 y compara con el día 14 y el día 7',
  jsonb_build_object(
    'push_message', '🌸 Día 21 — Tres semanas completadas. Tu cuerpo ya tiene un nuevo equilibrio.',
    'fase', 'detoxificación',
    'hito', jsonb_build_object(
      'titulo',      'Semana 3 — La detoxificación activada',
      'descripcion', 'Tres semanas de trabajo hormonal profundo. Esta semana activaste el DIM del brócoli para favorecer la vía 2-OH, apoyaste el hígado con cardo mariano y alcachofa, reparaste la barrera intestinal con caldo de huesos, optimizaste la tiroides con selenio y yodo, construiste colágeno y protegiste el microbioma vaginal. El hígado ya metaboliza el estrógeno con mayor eficiencia.',
      'reflexion',   '¿Cuál es el síntoma que más ha mejorado en estas 3 semanas? ¿Cuál sigue necesitando trabajo?',
      'estadisticas', jsonb_build_object(
        'semana',     3,
        'cofactores', jsonb_build_array('DIM-brócoli', 'Cardo mariano', 'Glutamina-barrera', 'Selenio-tiroides', 'Colágeno-huesos', 'Lactobacillus-microbioma'),
        'siguiente',  'Semana 4 — Consolidación del protocolo permanente'
      )
    ),
    'indice_foodmood', jsonb_build_object(
      'titulo', 'Evaluación de semana 3',
      'descripcion', 'Compara con el día 14, el día 7 y el día 1.',
      'preguntas', jsonb_build_array(
        '¿Cómo está tu energía general esta semana? (1-5)',
        '¿Han cambiado los sofocos o sudores nocturnos? (empeorado / igual / mejorado)',
        '¿Cómo es tu calidad de sueño? (1-5)',
        '¿Cómo está tu estado de ánimo y nivel de ansiedad? (1-5)'
      )
    ),
    'hito_landing', jsonb_build_object(
      'titulo',      'Día 21 — Tres semanas completadas',
      'descripcion', 'El hígado detoxifica el estrógeno con mayor eficiencia. Una semana más hacia el protocolo permanente.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El sistema hormonal como red: 21 días de trabajo convergente',
      'texto',          'Semana 1: el estrobioma aprende a metabolizar el estrógeno. Semana 2: los fitoestrógenos modulan los receptores ER-β. Semana 3: el hígado detoxifica el estrógeno hacia la vía protectora. No son tres protocolos independientes — son tres niveles del mismo sistema. El estrobioma prepara el terreno para los fitoestrógenos. Los fitoestrógenos reducen los síntomas mientras el hígado trabaja. El hígado limpia lo que los ovarios ya no producen con la eficiencia de antes.',
      'concepto_clave', 'Estrobioma-fitoestrógenos-detoxificación como sistema integrado'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Bol integrador de la semana 3',
      'descripcion', 'Salmón al horno con brócoli asado al DIM, edamame, quinoa, remolacha, semillas de lino, kéfir como dressing y nueces de Brasil. 2 nueces de Brasil al final.',
      'por_que',     'Salmón (DHA + D3 + selenio), brócoli (DIM + sulforafano), edamame (isoflavonas + cumestanos), quinoa (magnesio + proteína), remolacha (betaína para metilación), lino (lignanos), kéfir (estrobioma + microbioma vaginal), nueces de Brasil (selenio + urolitinas).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy respecto al día 1, al día 7 y al día 14? Traza la curva.',
      'pregunta_tarde',  '¿Qué cambio estructural has hecho en tu alimentación que crees que vas a mantener?',
      'pregunta_noche',  '¿Qué aspecto del equilibrio hormonal sientes que más necesita trabajo en la semana 4?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Semana 4: la consolidación del protocolo que se queda para siempre',
      'texto',  'La última semana del reto no añade nuevos mecanismos — consolida lo que ya funciona. Trabajamos la cronobiología hormonal (cuándo comer importa tanto como qué comer), las suprarrenales y el DHEA, la inflamación pélvica, los antioxidantes específicos para los 45+, la glucosa e insulina, y el protocolo permanente que llevas contigo al terminar el reto.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- ══════════════════════════════════════════════════════════════════════════════
-- SEMANA 4 — CONSOLIDACIÓN (días 22-28)
-- ══════════════════════════════════════════════════════════════════════════════

-- Día 22 — Cronobiología
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 22,
  'Cuándo comes las hormonas importa tanto como qué comes. El reloj hormonal existe.',
  'Desayuna dentro de la primera hora de levantarte y cena antes de las 19h',
  jsonb_build_object(
    'push_message', '🌸 Día 22 — Semana 4: consolidación. La cronobiología hormonal que cambia todo.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Cronobiología hormonal — el cuándo es medicina',
      'texto',          'Las hormonas sexuales siguen un ritmo circadiano: el cortisol alcanza su pico a las 8h, el estrógeno tiene su máximo de síntesis en la mañana, la progesterona en la tarde-noche. Comer en ventanas temporales que respetan estos ritmos optimiza la señalización hormonal. El ayuno nocturno de 12-14 horas mejora la sensibilidad a la insulina y reduce la inflamación, que a su vez mejora el equilibrio estrogénico. La restricción calórica nocturna reduce la aromatización del cortisol en tejido adiposo.',
      'concepto_clave', 'Reloj molecular CLOCK/BMAL1 y ritmo hormonal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Desayuno hormonal y ventana de alimentación',
      'descripcion', 'Desayuno dentro de la primera hora de levantarte: avena con leche de almendras, semillas de lino, arándanos, nueces y canela. Comida principal a las 13-14h. Cena ligera antes de las 19-20h.',
      'por_que',     'La avena tiene beta-glucanos que mejoran la sensibilidad a la insulina. El lino añade lignanos. Los arándanos dan antioxidantes que protegen las células ováricas del estrés oxidativo. La canela actúa como insulino-sensibilizador. Comer la comida más densa calóricamente al mediodía (cuando el metabolismo es más activo) y cenar ligero reduce la aromatización nocturna.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿A qué hora has desayunado hoy? ¿Cuántas horas después de levantarte?',
      'pregunta_tarde',  '¿A qué hora sueles cenar habitualmente? ¿Cómo podrías adelantarla?',
      'pregunta_noche',  '¿Has ayunado al menos 12 horas esta noche? (hora cena → hora desayuno)'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El reloj hepático y la metabolización del estrógeno a distintas horas del día',
      'texto',  'Las enzimas de la fase I y II de metabolización del estrógeno en el hígado tienen expresión circadiana — son más activas por la mañana y menos activas por la noche. Esto significa que un hígado que tiene que metabolizar estrógeno de madrugada (porque cenaste tarde y tus niveles no han bajado) lo hace con menor eficiencia. Cenar temprano y dejar que el hígado haga su trabajo nocturno en reposo (sin procesar más comida) es una intervención de detoxificación hormonal gratuita y subestimada.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 23 — DHEA y suprarrenales
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 23,
  'Después de los 45, las suprarrenales toman el relevo de los ovarios. Hay que cuidarlas.',
  'Descansa una siesta de 20 minutos o practica 10 minutos de respiración diafragmática hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 23 — Las suprarrenales: tu fábrica hormonal de reserva después de los 45.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'DHEA y la transición suprarrenal posmenopáusica',
      'texto',          'La DHEA (dehidroepiandrosterona) es producida principalmente por las suprarrenales y es el precursor de los andrógenos y estrógenos posmenopáusicos. En la posmenopausia, las suprarrenales se convierten en la principal fuente de hormonas sexuales — produciendo DHEA que los tejidos periféricos (tejido adiposo, piel, cerebro) convierten localmente en estrógenos y andrógenos. El estrés crónico agota las suprarrenales y reduce la DHEA. La ashwagandha, el magnesio, el zinc y el sueño reparador son los pilares del soporte suprarrenal.',
      'concepto_clave', 'DHEA, esteroidogénesis suprarrenal y producción intracrina'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Leche dorada de ashwagandha y pimienta negra',
      'descripcion', 'Leche de almendras calentada con una cucharadita de ashwagandha KSM-66, media cucharadita de cúrcuma, una pizca de pimienta negra, canela y jengibre en polvo. Una cucharadita de miel. Por la mañana o por la tarde.',
      'por_que',     'La ashwagandha reduce el cortisol y apoya la función suprarrenal. La pimienta negra (piperina) aumenta la biodisponibilidad de la cúrcuma un 2000%. La cúrcuma reduce la inflamación que agota las suprarrenales. La canela estabiliza la glucosa. La leche de almendras aporta vitamina E y calcio.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo está tu nivel de estrés crónico? ¿Ha cambiado en estas 3 semanas?',
      'pregunta_tarde',  '¿Tienes síntomas de fatiga suprarrenal? (necesidad de cafeína, dificultad para levantarte, bajón a las 15h)',
      'pregunta_noche',  '¿Qué has hecho hoy para apoyar tu sistema nervioso parasimpático?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Fatiga suprarrenal en la menopausia: realidad bioquímica vs mito diagnóstico',
      'texto',  'La fatiga suprarrenal como entidad diagnóstica formal no está reconocida, pero la disfunción del eje HPA en mujeres con estrés crónico en la perimenopausia sí tiene base bioquímica. Los síntomas (fatiga persistente, necesidad compulsiva de cafeína, dificultad para dormir aunque estés agotada, bajón energético a media tarde) reflejan un eje HPA desregulado que puede objetivarse midiendo el cortisol libre en saliva a 4 puntos del día. Las intervenciones nutricionales (magnesio, ashwagandha, vitamina C) tienen evidencia de mejora.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 24 — Inflamación pélvica
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 24,
  'El dolor pélvico, la endometriosis y los miomas se alimentan de inflamación. La dieta puede reducirla.',
  'Añade cúrcuma con pimienta negra en alguna comida de hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 24 — Inflamación pélvica: lo que comes puede apagarla o encenderla.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Inflamación pélvica y el eje estrógeno-prostaglandinas',
      'texto',          'El estrógeno estimula la producción de prostaglandinas E2 vía COX-2, que son mediadores de inflamación. En condiciones de dominancia estrogénica relativa (perimenopausia), este efecto puede amplificarse. La curcumina inhibe COX-2 y NF-κB. El omega-3 EPA compite con el ácido araquidónico por la COX-2, produciendo prostaglandinas de serie 3 (antiinflamatorias). El resveratrol inhibe la aromatasa en tejido adiposo y uterino. La quercetina inhibe la proliferación de células endometriales.',
      'concepto_clave', 'COX-2, prostaglandinas E2 y modulación antiinflamatoria'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Curry antiinflamatorio de garbanzos con espinacas',
      'descripcion', 'Garbanzos cocidos salteados con cúrcuma fresca (o en polvo), pimienta negra, comino, jengibre, tomate triturado, leche de coco y espinacas. Arroz integral. Aceite de oliva.',
      'por_que',     'La cúrcuma con pimienta negra tiene la mayor concentración de curcumina biodisponible. Los garbanzos aportan cumestanos y fibra antiinflamatoria. La leche de coco tiene ácido laúrico con propiedades antiinflamatorias. Las espinacas dan folato para la metilación. El tomate aporta licopeno que inhibe la aromatasa.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes dolor pélvico crónico, endometriosis o miomas? ¿Cómo han evolucionado?',
      'pregunta_tarde',  '¿Cuántas veces a la semana comes pescado azul (omega-3 antiinflamatorio)?',
      'pregunta_noche',  '¿Has reducido el consumo de alimentos proinflamatorios? (azúcar, aceites refinados, ultraprocesados)'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Dieta antiinflamatoria y endometriosis: lo que la evidencia dice en 2025',
      'texto',  'La endometriosis es una enfermedad inflamatoria estrógeno-dependiente. Los estudios más recientes muestran que una dieta de tipo mediterráneo (alta en omega-3, crucíferas, legumbres y fibra; baja en grasas saturadas y azúcar) reduce los marcadores inflamatorios (IL-6, TNF-α) y la intensidad del dolor pélvico en un 40-50% en mujeres con endometriosis. El mecanismo principal es la reducción de prostaglandinas E2 vía inhibición de COX-2.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 25 — Antioxidantes 45+
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 25,
  'El estrés oxidativo acelera el envejecimiento hormonal. Los antioxidantes lo frenan.',
  'Come al menos 5 colores de frutas y verduras hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 25 — Antioxidantes específicos para los 45+: más allá de la vitamina C.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Estrés oxidativo, envejecimiento ovárico y antioxidantes clave',
      'texto',          'Las células ováricas son especialmente vulnerables al estrés oxidativo porque producen grandes cantidades de ROS durante la esteroidogénesis. El envejecimiento ovárico está directamente relacionado con el agotamiento de los sistemas antioxidantes intracelulares (glutatión, catalasa, SOD). La resveratrola activa SIRT1 y protege el ADN mitocondrial ovárico. La quercetina inhibe la senescencia celular. La astaxantina (el antioxidante más potente conocido) atraviesa las membranas celulares y protege directamente las mitocondrias. El glutatión es el antioxidante maestro del hígado.',
      'concepto_clave', 'Reserva ovárica, ROS y antioxidantes mitocondriales'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Gran ensalada de 5 colores con semillas y vinagreta antioxidante',
      'descripcion', 'Remolacha (roja), zanahoria (naranja), cúrcuma en el aliño (amarilla), espinacas (verde), lombarda (morada). Nueces, semillas de girasol, aguacate. Vinagreta de aceite de oliva, vinagre de manzana, mostaza y ajo.',
      'por_que',     'La remolacha tiene betalaínas antioxidantes más potentes que la vitamina C. La zanahoria aporta betacaroteno que se convierte en vitamina A para las mucosas. La cúrcuma activa NRF2. Las espinacas dan luteína y zeaxantina. La lombarda tiene antocianinas que cruzan la barrera hematoencefálica.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuántos colores diferentes de frutas y verduras comes habitualmente?',
      'pregunta_tarde',  '¿Tomas algún antioxidante específico? ¿Cuál y en qué forma?',
      'pregunta_noche',  '¿Cuáles son tus principales fuentes de estrés oxidativo? (tabaco, alcohol, contaminación, estrés psicológico)'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué la biodiversidad vegetal (no los suplementos) es la estrategia antioxidante más efectiva',
      'texto',  'Los antioxidantes aislados en suplementos (vitamina C, E, betacaroteno) tienen un historial clínico decepcionante. Los antioxidantes en contexto vegetal (polifenoles, carotenoides, flavonoides) trabajan en sinergia y activan NRF2, el interruptor maestro de la defensa antioxidante endógena. NRF2 activa la síntesis de glutatión, SOD y catalasa — los propios antioxidantes del cuerpo — que son 1000 veces más potentes que cualquier antioxidante exógeno.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 26 — Glucosa e insulina
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 26,
  'La resistencia a la insulina empeora el desequilibrio hormonal. La glucosa estable es hormonal.',
  'Empieza cada comida con verdura o proteína antes de los carbohidratos',
  jsonb_build_object(
    'push_message', '🌸 Día 26 — Glucosa estable: la base oculta del equilibrio hormonal.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'Insulina, SHBG y disponibilidad hormonal',
      'texto',          'La insulina alta reduce la síntesis de SHBG (globulina transportadora de hormonas sexuales) en el hígado. Con menos SHBG, hay más estrógeno y testosterona libre circulante — que parece positivo pero en realidad puede agravar la dominancia estrogénica y la androgenización. La resistencia a la insulina también aumenta la aromatasa en el tejido adiposo, convirtiendo más andrógenos en estrógenos. Estabilizar la glucosa no es solo metabólico — es directamente hormonal.',
      'concepto_clave', 'SHBG, insulina y biodisponibilidad hormonal'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'Protocolo de la curva plana: cómo comer hoy',
      'descripcion', 'Empieza cada comida con verdura o proteína (5 minutos antes o como primer plato). Añade vinagre de manzana antes de las comidas principales. Termina con un paseo de 10-15 minutos después de comer.',
      'por_que',     'La secuencia verdura-proteína-carbohidrato reduce el pico de glucosa en un 36% respecto a la misma comida en orden inverso. El vinagre de manzana inhibe la alfa-glucosidasa, reduciendo la velocidad de absorción del almidón. El paseo post-comida activa los transportadores GLUT4 musculares y reduce el pico de glucosa adicional un 20-30%.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Tienes síntomas de resistencia a la insulina? (hambre de azúcar después de comer, somnolencia postprandial, grasa abdominal)',
      'pregunta_tarde',  '¿Has seguido la secuencia verdura-proteína-carbohidrato en alguna comida hoy?',
      'pregunta_noche',  '¿Has hecho el paseo post-comida? ¿Cómo ha ido?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'Por qué el azúcar es el mayor disruptor hormonal no identificado en mujeres de 45+',
      'texto',  'El consumo de azúcar libre (no de fruta entera) dispara la insulina, reduce la SHBG, aumenta la aromatasa y eleva el cortisol — cuatro palancas de desequilibrio hormonal simultáneo. Una mujer que consume 50 g de azúcar al día (equivalente a un refresco y un postre) tiene niveles de SHBG un 40% más bajos que una mujer con la misma dieta pero sin azúcar añadido. La restricción de azúcar libre es la intervención hormonal más impactante por cambio de hábito.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 27 — Protocolo permanente (con opcion_a / opcion_b)
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 27,
  'Mañana terminas el reto. Hoy diseñas el protocolo que se queda contigo para siempre.',
  'Escribe en papel los 5 hábitos más fáciles de mantener de estos 27 días',
  jsonb_build_object(
    'push_message', '🌸 Día 27 — El protocolo permanente. Mañana terminas. Hoy lo diseñas.',
    'fase', 'consolidación',
    'hito', NULL,
    'idea_clara', jsonb_build_object(
      'titulo',         'De protocolo temporal a hábito permanente',
      'texto',          'Un protocolo de 28 días tiene valor real solo si el 20% de los cambios se mantiene indefinidamente. La investigación en cambio de comportamiento muestra que 3-5 hábitos consolidados producen más impacto a largo plazo que 20 cambios temporales. Tu tarea de hoy es identificar cuáles de los hábitos de estas 4 semanas son sostenibles para ti — y cuáles no necesitas mantener con la misma frecuencia.',
      'concepto_clave', 'Adherencia a largo plazo y teoría del hábito mínimo viable'
    ),
    'receta', jsonb_build_object(
      'titulo',      'Tu protocolo hormonal permanente (elige tu versión)',
      'descripcion', 'Diseña tu propio protocolo basado en los hábitos que has encontrado más fáciles y efectivos.',
      'opcion_a', jsonb_build_object(
        'nombre',      'Protocolo mínimo (10 minutos al día)',
        'habitos', jsonb_build_array(
          'Semillas de lino molidas en el desayuno (lignanos diarios)',
          'Una porción de crucífera al día (DIM diario)',
          'Legumbres 4 veces a la semana (estrobioma + fitoestrógenos)',
          'Fermentado una vez al día (yogur, kéfir o miso)',
          'Pescado azul 3 veces a la semana (omega-3 + D3)',
          'Ayuno nocturno de 12 horas (cronobiología)',
          'Ashwagandha en la mañana cuando hay estrés elevado'
        )
      ),
      'opcion_b', jsonb_build_object(
        'nombre',      'Protocolo completo (para cuando tienes más tiempo)',
        'habitos', jsonb_build_array(
          'Todo el protocolo mínimo más:',
          'Caldo de huesos 2 veces a la semana (barrera intestinal)',
          'DIM suplemento los días sin crucífera',
          'Semillas de calabaza como snack (zinc diario)',
          'Nueces de Brasil 2 unidades al día (selenio)',
          'Paseo de 15 minutos después de la comida principal',
          'Cúrcuma con pimienta negra en una comida al día',
          'Evaluación mensual de síntomas hormonales'
        )
      ),
      'por_que',     'La consistencia del 80% con el protocolo mínimo produce más impacto que la perfección del 50% con el protocolo completo. Elige la versión que puedes mantener en tu vida real, no la ideal.'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cuáles son los 3 hábitos de estos 27 días que más impacto han tenido en cómo te sientes?',
      'pregunta_tarde',  '¿Cuáles son los 3 hábitos que más fácil has encontrado mantener?',
      'pregunta_noche',  '¿Hay algo de lo que has aprendido en este reto que quieras investigar más a fondo?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El protocolo mínimo viable para el equilibrio hormonal: qué mantener siempre',
      'texto',  'Si solo pudieras mantener 4 hábitos de este reto, estos serían: semillas de lino molidas a diario (lignanos + fibra), crucífera en alguna comida del día (DIM), fermentado una vez al día (estrobioma), pescado azul 3 veces a la semana (omega-3 + D3). Estos cuatro hábitos actúan sobre el estrobioma, la modulación de receptores, la detoxificación hepática y la síntesis hormonal simultáneamente. Son el núcleo irreducible del protocolo.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Día 28 — HITO FINAL
INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 28,
  '28 días de bioquímica hormonal real. Tu cuerpo tiene una nueva línea base.',
  'Haz tu evaluación final y compara desde el día 1 hasta hoy',
  jsonb_build_object(
    'push_message', '🌸 Día 28 — Lo has completado. 28 días de equilibrio hormonal. Tu nueva base.',
    'fase', 'consolidación',
    'hito', jsonb_build_object(
      'titulo',      'Día 28 — 28 días de equilibrio hormonal completados',
      'descripcion', 'Cuatro semanas trabajando el sistema hormonal más complejo de la fisiología femenina. Semana 1: el estrobioma aprendió a metabolizar el estrógeno. Semana 2: los fitoestrógenos modularon los receptores ER-β. Semana 3: el hígado detoxificó el estrógeno por la vía protectora. Semana 4: consolidaste el protocolo que se queda contigo. No es un reset temporal — es una nueva forma de relacionarte con tu bioquímica.',
      'reflexion',   '¿Qué síntoma hormonal ha mejorado más en estas 4 semanas? ¿Qué has aprendido sobre tu cuerpo que no sabías antes?',
      'estadisticas', jsonb_build_object(
        'dias_completados',    28,
        'semanas',             4,
        'mecanismos_activados', jsonb_build_array(
          'Estrobioma (β-glucuronidasa regulada)',
          'Fitoestrógenos (ER-β modulado)',
          'Detoxificación hepática (vía 2-OH favorecida)',
          'Cronobiología hormonal',
          'Suprarrenales (DHEA protegida)',
          'Inflamación pélvica reducida',
          'Glucosa e insulina estabilizadas'
        ),
        'protocolo_permanente', 'Lino + crucífera + fermentado + pescado azul a diario'
      ),
      'informe_personalizado', jsonb_build_object(
        'titulo',      'Tu informe hormonal personalizado',
        'descripcion', 'Basado en tus registros diarios de estas 4 semanas, generamos tu informe hormonal personalizado: evolución de síntomas, patrones observados, logros principales y siguiente paso recomendado.'
      ),
      'cta_primario', jsonb_build_object(
        'texto', 'Ver mi informe personalizado',
        'accion', 'generar_informe'
      ),
      'cta_secundario', jsonb_build_object(
        'texto', 'Empezar Food-Mood Reset (21 días)',
        'slug',  'food-mood-reset'
      ),
      'cta_terciario', jsonb_build_object(
        'texto', 'Compartir mi logro',
        'accion', 'compartir'
      )
    ),
    'indice_foodmood', jsonb_build_object(
      'titulo', 'Evaluación final — día 28',
      'descripcion', 'Compara con el día 1, el día 7, el día 14 y el día 21. Esta es tu curva hormonal completa.',
      'preguntas', jsonb_build_array(
        '¿Cómo está tu energía general ahora vs el día 1? (1-5)',
        '¿Han cambiado los sofocos o sudores nocturnos? (mucho mejor / algo mejor / igual / peor)',
        '¿Cómo es tu calidad de sueño ahora? (1-5)',
        '¿Cómo está tu estado de ánimo y nivel de ansiedad? (1-5)',
        '¿Cuál ha sido el cambio más significativo de estos 28 días?'
      )
    ),
    'hito_landing', jsonb_build_object(
      'titulo',      'Día 28 — Protocolo permanente construido',
      'descripcion', 'Tu nueva línea base hormonal. Esto no se pierde.'
    ),
    'idea_clara', jsonb_build_object(
      'titulo',         'El sistema hormonal femenino como red: visión completa',
      'texto',          'En 28 días has intervenido en los 7 niveles del sistema hormonal femenino: el estrobioma (qué hacen las bacterias con el estrógeno), los receptores (cómo responden las células), el hígado (cómo metaboliza el estrógeno usado), la cronobiología (cuándo ocurre todo), las suprarrenales (quién produce hormonas cuando los ovarios no pueden), la inflamación (la señal que altera toda la orquesta) y la glucosa (la molécula que condiciona la disponibilidad hormonal). Ningún médico puede hacer eso en 28 días. Tú lo has hecho.',
      'concepto_clave', 'Sistema hormonal femenino integrado: 7 niveles de intervención'
    ),
    'cambio_del_dia', jsonb_build_object(
      'titulo',      'El gran bol hormonal de los 28 días',
      'descripcion', 'Salmón al horno con brócoli al DIM, edamame (cumestanos), quinoa (proteína completa), remolacha (betaína), semillas de lino molidas, granos de granada (urolitinas), aguacate, kéfir como dressing, nueces de Brasil y semillas de calabaza. Vinagreta de miso y jengibre.',
      'por_que',     'Un ingrediente por cada semana y mecanismo del reto: salmón (semana 1 omega-3 + D3), brócoli (semana 3 DIM), edamame (semana 2 cumestanos), quinoa (semana 2 proteína), remolacha (semana 3 metilación), lino (semana 1 lignanos), granada (semana 2 urolitinas), aguacate (semana 3 colágeno), kéfir (semana 1 estrobioma), nueces de Brasil (semana 3 selenio), calabaza (semana 1 zinc).'
    ),
    'registro_diario', jsonb_build_object(
      'pregunta_manana', '¿Cómo te despiertas hoy comparado con el día 1? Describe la diferencia con tus propias palabras.',
      'pregunta_tarde',  '¿Qué has aprendido sobre tu cuerpo en estos 28 días que no sabías antes?',
      'pregunta_noche',  '¿Cuál es el primer hábito del protocolo permanente que vas a mantener mañana?'
    ),
    'lectura', jsonb_build_object(
      'titulo', 'El equilibrio hormonal no es un destino — es una práctica',
      'texto',  'El sistema hormonal no alcanza un punto de equilibrio permanente — es dinámico, reactivo al estrés, al sueño, a la alimentación, a las estaciones. Lo que has construido en 28 días no es un estado fijo: es una comprensión de las palancas y la capacidad de activarlas cuando las necesitas. Habrá semanas mejores y peores. El protocolo permanente es tu ancla para volver al equilibrio más rápidamente cada vez que el sistema se desestabilice.'
    )
  )
FROM public.challenges c WHERE c.slug = 'equilibrio-hormonal-45'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

-- Limpiar archivos temporales (ejecutar manualmente si se desea)
-- DROP TABLE IF EXISTS _migration_temp;
