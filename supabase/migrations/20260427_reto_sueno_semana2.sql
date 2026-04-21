-- ── Días 8-14 — Reto sueño semana 2 — Triptófano + Ritmo circadiano ──────────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 8,
  'Avena nocturna con platano y semillas de girasol',
  'El triptofano del platano necesita glucosa para cruzar la barrera hematoencefalica — la avena lenta se la proporciona. La B6 de las semillas convierte el triptofano en serotonina.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '60g copos de avena finos',
      '150ml leche de almendra sin azucar',
      '1/2 platano maduro en rodajas',
      '1 cda semillas de girasol',
      '1 cdta mantequilla de almendra sin sal',
      '1/2 cdta vinagre de kombucha o de manzana',
      '1 pizca de canela',
      'Opcional: 1 cdta miel cruda'
    ),
    'pasos', jsonb_build_array(
      'La noche anterior: mezclar los copos de avena con la leche en un tarro. Cerrar y guardar en nevera.',
      'Por la manana: sacar el tarro. Si queda muy espesa, anadir un chorrito de leche fria.',
      'Anadir la canela y la mantequilla de almendra. Remover.',
      'El platano en rodajas encima. Las semillas de girasol.',
      'El vinagre al final — activa la absorcion del zinc de las semillas.'
    ),
    'nutricion', jsonb_build_object('calorias', 340, 'proteinas', 10, 'carbohidratos', 50, 'grasas', 11),
    'beneficio_sueno', 'Triptofano + B6 de las semillas de girasol = serotonina diurna que se convierte en melatonina nocturna. Lo que comes a las 8h determina el sueno de las 23h.',
    'tiempo_min', 10,
    'momento', 'Desayuno — preparar la noche anterior'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 9,
  'Brocoli asado con tahini negro, huevo y vinagre',
  'El sulforafano se activa cuando el brocoli se corta y se tuesta. Nrf2 activado = reparacion celular durante el sueno profundo.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '200g brocoli en arbolitos pequenos',
      '2 huevos camperos',
      '2 cdas tahini negro',
      '1 cda vinagre de kombucha o de manzana',
      '1 diente de ajo laminado',
      '2 cdas aceite de oliva virgen extra',
      'Sal y pimienta',
      'Sesamo negro para decorar',
      '1 pizca de pimenton ahumado'
    ),
    'pasos', jsonb_build_array(
      'Precalentar el horno a 200C.',
      'El brocoli en bandeja con AOVE, sal, pimienta y el ajo laminado. Asar 18-20 minutos hasta que los bordes se doren.',
      'Mezclar el tahini negro con el vinagre de kombucha o de manzana y 2-3 cdas de agua tibia hasta obtener salsa fluida. Anadir el pimenton.',
      'Los huevos: cocidos 7 minutos (yema cremosa) o pochados.',
      'En el bol: el brocoli asado, los huevos, la salsa de tahini por encima. Sesamo negro.'
    ),
    'nutricion', jsonb_build_object('calorias', 420, 'proteinas', 22, 'carbohidratos', 18, 'grasas', 28),
    'beneficio_sueno', 'Sulforafano activa Nrf2 — el regulador antioxidante que permite la reparacion celular nocturna. La colina de la yema regula el sueno REM. El tahini negro aporta calcio que potencia el GABA.',
    'tiempo_min', 30,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 10,
  'Kefir con avena, manzana rallada y chia',
  'La pectina de la manzana con piel alimenta selectivamente al Bifidobacterium — el mayor productor de GABA intestinal.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '150g kefir vivo',
      '3 cdas copos de avena finos remojados 30 min',
      '1/2 manzana con piel rallada',
      '1 cdta canela',
      '1 cda semillas de chia',
      '1/2 cdta vinagre de kombucha o de manzana',
      'Opcional: 1 cdta miel cruda',
      '4-5 nueces troceadas'
    ),
    'pasos', jsonb_build_array(
      '30 minutos antes: remojar los copos de avena en agua fria.',
      'Rallar la manzana con piel incluida — la piel es donde esta la pectina.',
      'Mezclar el kefir con los copos de avena escurridos.',
      'Anadir la manzana rallada, la canela, las semillas de chia y las nueces.',
      'El vinagre al final. Dejar reposar 5 minutos — la chia espesa y mejora la textura.'
    ),
    'nutricion', jsonb_build_object('calorias', 310, 'proteinas', 11, 'carbohidratos', 38, 'grasas', 13),
    'beneficio_sueno', 'Pectina + betaglucanos + chia = triple fibra para el Bifidobacterium. Mas Bifidobacterium = mas GABA = sueno mas profundo. Tomarlo a las 17-18h tiene el maximo efecto nocturno.',
    'tiempo_min', 10,
    'momento', 'Media tarde — 17-18h'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 11,
  'Caballa en escabeche de kombucha con aguacate y nueces',
  'El escabeche de vinagre conserva el 98% del DHA — frente al 60% que queda tras la plancha. La noche mas REM de la semana.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '2 filetes de caballa fresca o en conserva al natural',
      '3 cdas vinagre de kombucha o de manzana',
      '1/2 aguacate maduro',
      '1 punado de nueces activadas remojadas 8h',
      '1 punado de rucula o berros',
      '2 cdas aceite de oliva virgen extra',
      '1 cdta mostaza de Dijon',
      'Sal, pimienta, eneldo fresco',
      '1/2 limon — zumo y piel rallada'
    ),
    'pasos', jsonb_build_array(
      'Caballa fresca: marinar los filetes en el vinagre de kombucha o de manzana durante 20 minutos. El acido cocina el pescado en frio.',
      'Conserva: escurrir y marinar 5 minutos en el vinagre.',
      'Vinagreta: AOVE + mostaza + zumo de limon + piel rallada + sal + pimienta. Emulsionar.',
      'Base de rucula. Aguacate en laminas. La caballa marinada encima.',
      'Nueces troceadas. Eneldo fresco. La vinagreta al momento de comer.'
    ),
    'nutricion', jsonb_build_object('calorias', 480, 'proteinas', 32, 'carbohidratos', 8, 'grasas', 36),
    'beneficio_sueno', 'EPA del escabeche produce resolvinas que cierran la inflamacion nocturna. DHA construye membranas neuronales del hipocampo donde se consolidan los recuerdos en el sueno REM. El aguacate protege el DHA de la oxidacion.',
    'tiempo_min', 25,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 12,
  'Crema de anacardos con datiles, cacao y vinagre',
  'Los anacardos tienen la mayor concentracion de triptofano de todos los frutos secos. El remojo 4h multiplica su biodisponibilidad eliminando el acido fitico.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '30g anacardos crudos remojados 4h',
      '2 datiles Medjool sin hueso',
      '1 cda cacao puro en polvo 85% o mas',
      '100ml leche de almendra sin azucar',
      '1/2 cdta vinagre de kombucha o de manzana',
      '1 pizca de canela',
      '1 pizca de sal marina',
      'Opcional: 1 pizca de cardamomo molido'
    ),
    'pasos', jsonb_build_array(
      'Remojar los anacardos al menos 4 horas en agua fria. Colar.',
      'Triturar los anacardos con los datiles deshuesados, la leche de almendra, el cacao, la canela y la sal hasta crema lisa.',
      'Si queda muy espesa, anadir leche de almendra cucharada a cucharada.',
      'Servir en bol pequeno.',
      'El vinagre al final — en hilo fino por encima. Opcional: 2-3 anacardos enteros encima.'
    ),
    'nutricion', jsonb_build_object('calorias', 290, 'proteinas', 8, 'carbohidratos', 34, 'grasas', 14),
    'beneficio_sueno', 'Triptofano de anacardos + glucosa lenta de datiles (abre la barrera hematoencefalica) + magnesio del cacao (cofactor de la conversion triptofano-serotonina). Cadena completa en un bol. Tomarlo a las 20-21h.',
    'tiempo_min', 10,
    'momento', 'Postre o cena ligera — 20-21h'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 13,
  'Caldo de huesos con miso blanco, nori y semillas de calabaza',
  'La glicina baja la temperatura corporal. El zinc inhibe el cortisol. Juntos actuan como doble apagador del sistema nervioso. Tomarlo a las 20h.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '500ml caldo de huesos casero o de alga kombu',
      '1 cda miso blanco — disolver siempre fuera del fuego',
      '1 hoja de alga nori cortada en tiras',
      '2 cdas semillas de calabaza remojadas',
      '1 cdta vinagre de kombucha o de manzana — en el bol al final',
      'Cebollino fresco',
      '1 pizca de aceite de sesamo tostado',
      'Opcional: 50g tofu sedoso'
    ),
    'pasos', jsonb_build_array(
      'Calentar el caldo a 70C. Nunca hervir — el miso lo exige.',
      'Si usas tofu sedoso: anadir al caldo caliente en daditos. 1 minuto.',
      'Apagar el fuego. Disolver el miso blanco en un cucharron aparte antes de integrarlo.',
      'Servir. Tiras de nori encima — se reblandecen con el calor y aportan umami marino.',
      'Semillas de calabaza. Cebollino. Las gotas de aceite de sesamo. El vinagre en el bol ya servido.'
    ),
    'nutricion', jsonb_build_object('calorias', 210, 'proteinas', 14, 'carbohidratos', 10, 'grasas', 12),
    'beneficio_sueno', 'Glicina del caldo actua sobre receptores del tronco cerebral e inhibe la actividad neuronal. Zinc del miso inhibe la liberacion de CRH — cortisol apagado desde el origen. El nori aporta yodo para la tiroides que regula el ritmo circadiano.',
    'tiempo_min', 15,
    'momento', 'Cena — 20h'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 14,
  'Sushi bowl de salmon, aguacate y arroz integral',
  'Dos semanas. El microbioma ya ha empezado a cambiar. El DHA marinado en vinagre llega intacto — el calor lo destruye. Celebralo.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '80g arroz integral cocido — tibio',
      '1 filete de salmon fresco',
      '3 cdas vinagre de kombucha o de manzana — aliño del arroz y marinado',
      '1/2 aguacate en laminas',
      '1 cdta tamari sin gluten',
      '1 cdta aceite de sesamo tostado',
      '1 cdta semillas de sesamo negro',
      'Tiras de alga nori',
      'Jengibre encurtido casero o de calidad',
      'Pepino en rodajas finas',
      'Cebollino fresco'
    ),
    'pasos', jsonb_build_array(
      'Alinar el arroz integral tibio con 1 cda de vinagre de kombucha o de manzana, el tamari y el aceite de sesamo. Mezclar suavemente.',
      'Marinar el salmon en 2 cdas de vinagre durante 20 minutos. El acido lo cocina en frio conservando el DHA.',
      'En el bol: el arroz alinado como base.',
      'El salmon marinado encima. El aguacate en laminas. El pepino en rodajas. Las tiras de nori.',
      'El jengibre encurtido a un lado. Sesamo negro por encima. El cebollino. No anadir mas vinagre.'
    ),
    'nutricion', jsonb_build_object('calorias', 510, 'proteinas', 34, 'carbohidratos', 42, 'grasas', 22),
    'beneficio_sueno', 'Arroz integral abre la barrera hematoencefalica al triptofano del salmon. DHA marinado llega intacto al intestino. El jengibre encurtido acelera la digestion para que el sueno profundo no compita con el metabolismo activo. Dos semanas de reto — una base biologica nueva.',
    'tiempo_min', 30,
    'momento', 'Cena — celebracion del dia 14'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
