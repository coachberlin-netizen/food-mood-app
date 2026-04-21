-- ── Días 15-21 — Reto sueño semana 3 — Consolidación + Microbioma nocturno ────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 15,
  'Te de valeriana y manzanilla con miel y vinagre',
  'La valeriana inhibe la enzima que degrada el GABA — mas calma sin producir mas. La repeticion del ritual condiciona al sistema nervioso a preparar el sueno antes de que llegue.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '1 bolsita de raiz de valeriana seca o 1 cdta a granel',
      '1 bolsita de manzanilla o flores secas',
      '300ml agua a 85C — nunca hervir las flores',
      '1/2 cdta miel cruda',
      '1/2 cdta vinagre de kombucha o de manzana',
      'Opcional: 2 flores de lavanda seca alimentaria',
      'Opcional: 1 rodaja de limon fresco'
    ),
    'pasos', jsonb_build_array(
      'Calentar el agua a 85C — si hierve, esperar 2 minutos antes de infusionar.',
      'Infusionar la valeriana y la manzanilla juntas, tapadas, 8 minutos.',
      'Colar. Anadir la miel fuera del calor — la miel cruda pierde sus enzimas por encima de 40C.',
      'El vinagre al final — en la taza ya servida.',
      'La lavanda encima si se usa. Beber despacio, sin pantallas, en el mismo lugar cada noche.'
    ),
    'nutricion', jsonb_build_object('calorias', 30, 'proteinas', 0, 'carbohidratos', 7, 'grasas', 0),
    'beneficio_sueno', 'Acido isovalerico de la valeriana inhibe la degradacion del GABA. Apigenina de la manzanilla activa receptores de benzodiacepinas sin dependencia. La repeticion del ritual crea respuesta condicionada — el cuerpo anticipa el sueno.',
    'tiempo_min', 10,
    'momento', 'Noche — 21h, mismo lugar cada dia'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 16,
  'Mousse de cacao negro con frambuesas y flor de sal',
  'La teobromina del cacao tiene vida media de 7-9 horas — activa desde las 20h hasta las 3-4h cuando ocurre el despertar tipico del REM. No es estimulante como la cafeina.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '2 cdas cacao puro en polvo 85% o mas',
      '150g yogur griego vivo',
      '1 cdta tahini negro',
      '1/2 cdta vinagre de kombucha o de manzana',
      '1 cdta miel cruda',
      '1 pizca generosa de flor de sal',
      '100g frambuesas frescas o descongeladas',
      'Opcional: 1 pizca de cayena'
    ),
    'pasos', jsonb_build_array(
      'Mezclar el yogur con el cacao en polvo hasta que quede completamente oscuro y sin grumos — batir 1 minuto.',
      'Anadir el tahini negro, la miel, la flor de sal.',
      'El vinagre al final de la mezcla — remover suavemente, no batir.',
      'Refrigerar 15 minutos si hay tiempo — la textura mejora con el frio.',
      'Servir en bol con las frambuesas encima. La pizca de cayena opcional justo antes de comer.'
    ),
    'nutricion', jsonb_build_object('calorias', 260, 'proteinas', 14, 'carbohidratos', 22, 'grasas', 12),
    'beneficio_sueno', 'PEA del cacao activa el sistema de recompensa de forma suave sin crash. Flavanoles aumentan flujo sanguineo al hipocampo donde se consolidan los recuerdos en REM. Frambuesas aportan ellagitaninos que el microbioma fermenta en urolitinas durante el sueno.',
    'tiempo_min', 5,
    'momento', 'Postre — 20h'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 17,
  'Ensalada de rucula, sardinas, naranja y vinagre de kombucha',
  'El amargo de la rucula activa receptores TAS2R que ralentizan la frecuencia cardiaca via nervio vago en minutos. Las sardinas tienen DHA+EPA comparable a la caballa.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '2 punados de rucula fresca — cuanto mas amarga mejor',
      '1 lata de sardinas en aceite de oliva al natural — escurridas',
      '1 naranja — zumo y piel rallada',
      '2 cdas aceite de oliva virgen extra',
      '1 cda vinagre de kombucha o de manzana',
      '1 cdta mostaza de Dijon',
      '1 punado de nueces activadas',
      'Sal, pimienta',
      'Opcional: hojas de radicchio'
    ),
    'pasos', jsonb_build_array(
      'Vinagreta: batir el AOVE con el vinagre, la mostaza, el zumo de naranja, sal y pimienta.',
      'En el bol: la rucula como base, el radicchio si se usa.',
      'Las sardinas encima — en filetes o desmigadas.',
      'La naranja en gajos o rodajas finas. Las nueces troceadas.',
      'La piel de naranja rallada encima — el limoneno activa el sistema limbico. La vinagreta al momento de comer.'
    ),
    'nutricion', jsonb_build_object('calorias', 390, 'proteinas', 26, 'carbohidratos', 14, 'grasas', 26),
    'beneficio_sueno', 'TAS2R amargo activa nervio vago → baja frecuencia cardiaca y presion arterial. Sardinas 1800mg DHA+EPA por 100g. Vitamina C de la naranja protege el DHA de la oxidacion lipidica en el intestino.',
    'tiempo_min', 10,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 18,
  'Sopa de lentejas rojas con curcuma, jengibre y leche de coco',
  'Las lentejas rojas combinan triptofano + hierro (cofactor de la triptofano hidroxilasa). La vitamina C del limon triplica la absorcion del hierro no hemo.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '150g lentejas rojas — sin remojo necesario',
      '1 cebolla mediana picada fina',
      '2 dientes de ajo',
      '2cm curcuma fresca o 1 cdta en polvo',
      '1cm jengibre fresco rallado',
      '400ml leche de coco',
      '300ml caldo vegetal',
      '1 cdta vinagre de kombucha o de manzana — en el bol al final',
      '2 cdas aceite de oliva virgen extra',
      'Zumo de 1/2 limon — fuera del fuego',
      'Cilantro o perejil fresco',
      'Sal, pimienta, comino'
    ),
    'pasos', jsonb_build_array(
      'Pochar la cebolla y el ajo en AOVE a fuego suave, 8 minutos.',
      'Anadir la curcuma, el jengibre, el comino. Remover 1 minuto — las especias necesitan el aceite caliente.',
      'Anadir las lentejas rojas. Remover para que se impregnen.',
      'Cubrir con el caldo y la leche de coco. Cocer 20 minutos — las lentejas rojas se deshacen solas.',
      'Triturar. Fuera del fuego: el zumo de limon y el vinagre en el bol. Cilantro fresco encima.'
    ),
    'nutricion', jsonb_build_object('calorias', 420, 'proteinas', 16, 'carbohidratos', 48, 'grasas', 18),
    'beneficio_sueno', 'Triptofano + hierro en la misma matriz — el hierro es cofactor de la enzima que convierte el triptofano en 5-HTP. La leche de coco aporta trigliceridos de cadena media que no interrumpen el sueno. Curcuma activa Nrf2 para reparacion nocturna.',
    'tiempo_min', 35,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 19,
  'Bol de fermentados mixtos con remolacha y semillas',
  'Cuatro fermentados distintos = cuatro ecosistemas bacterianos distintos. La diversidad bacteriana es el indicador mas potente de salud del microbioma. La remolacha baja la temperatura corporal central.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '3 cdas chucrut casero sin pasteurizar',
      '2 cdas kimchi suave sin pasteurizar',
      '2 cdas miso blanco disuelto en 1 cda de agua tibia',
      '50g kefir vivo',
      '1 remolacha cocida en rodajas',
      '2 cdas semillas de girasol',
      '1 cdta vinagre de kombucha o de manzana',
      '1 cda aceite de oliva virgen extra',
      'Cebollino y perejil frescos',
      '1 pizca de curcuma en polvo'
    ),
    'pasos', jsonb_build_array(
      'En un bol amplio: disponer la remolacha en rodajas como base.',
      'El chucrut a un lado. El kimchi al otro — nunca mezclar los fermentados, cada uno tiene su espacio.',
      'El miso disuelto en agua tibia en el centro.',
      'El kefir en pequenas cucharadas por encima.',
      'Las semillas y las hierbas frescas. Alino: AOVE + vinagre + pizca de curcuma. Alinar solo la remolacha — los fermentados ya tienen su acidez.'
    ),
    'nutricion', jsonb_build_object('calorias', 220, 'proteinas', 10, 'carbohidratos', 24, 'grasas', 10),
    'beneficio_sueno', 'Chucrut + kimchi + miso + kefir = cuatro fuentes de probioticos distintas. El butirato que producen repara la barrera intestinal durante el sueno. Remolacha aporta nitratos y betaina que bajan la temperatura corporal central.',
    'tiempo_min', 10,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 20,
  'Crema de espinacas con miso, nuez moscada y semillas de calabaza',
  'El folato de las espinacas es necesario para la metilacion del ADN durante el sueno profundo — cocion corta de 5 min maximo para preservarlo. La nuez moscada modula la actividad serotonergia suavemente.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '200g espinacas frescas o congeladas de calidad',
      '1 cebolla blanca pequena',
      '1 diente de ajo',
      '400ml caldo vegetal suave',
      '1 cda miso blanco — disolver fuera del fuego',
      '1 pizca de nuez moscada recien rallada',
      '2 cdas aceite de oliva virgen extra',
      '1 cda semillas de calabaza remojadas',
      '1 cdta vinagre de kombucha o de manzana — en el bol al final',
      'Sal, pimienta blanca',
      'Opcional: 50ml leche de coco para cremosidad'
    ),
    'pasos', jsonb_build_array(
      'Pochar la cebolla y el ajo en AOVE a fuego suave, 7 minutos.',
      'Anadir las espinacas. Remover hasta que esten completamente marchitas, 3 minutos.',
      'Cubrir con el caldo. Cocer 5 minutos — no mas, el folato es sensible al calor prolongado.',
      'Triturar. Anadir la leche de coco si se usa. Fuera del fuego: disolver el miso aparte y anadir.',
      'La nuez moscada — rallar al momento, solo 2-3 pasadas. Semillas de calabaza encima. El vinagre en el bol.'
    ),
    'nutricion', jsonb_build_object('calorias', 210, 'proteinas', 8, 'carbohidratos', 16, 'grasas', 13),
    'beneficio_sueno', 'Folato de espinacas necesario para la metilacion del ADN nocturna — reparacion celular durante el sueno profundo. Miso blanco aporta GABA bacteriano en un intestino preparado. Nuez moscada modula la actividad serotonergia suavemente.',
    'tiempo_min', 20,
    'momento', 'Cena'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 21,
  'Bol de quinoa con boniato asado, tahini negro y granada',
  'Tres semanas. La quinoa tiene los 9 aminoacidos esenciales completos — incluido el triptofano. El tahini negro aporta calcio y magnesio juntos para el GABA-A. La receta mas completa del reto.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '80g quinoa cocida — tibia',
      '1 boniato mediano asado en dados',
      '2 cdas tahini negro',
      '1 cda vinagre de kombucha o de manzana',
      '3 cdas arils de granada',
      '2 cdas semillas de calabaza remojadas',
      '50g kefir vivo — a temperatura ambiente',
      '1 punado de espinacas baby',
      '2 cdas aceite de oliva virgen extra',
      'Zumo de 1/2 limon',
      'Sal, pimienta, comino tostado',
      'Menta fresca'
    ),
    'pasos', jsonb_build_array(
      'Asar el boniato en dados a 200C, 20 minutos con AOVE y comino.',
      'Cocer la quinoa en agua con sal. Escurrir. Alinar tibia con AOVE, zumo de limon, sal y pimienta.',
      'Salsa de tahini: mezclar el tahini negro con el vinagre y agua tibia hasta conseguir consistencia fluida.',
      'En el bol: base de espinacas baby. La quinoa alinada encima. El boniato asado. Los arils de granada. Las semillas.',
      'El kefir en cucharadas separadas. La salsa de tahini por encima. La menta fresca y el comino tostado.'
    ),
    'nutricion', jsonb_build_object('calorias', 490, 'proteinas', 18, 'carbohidratos', 62, 'grasas', 20),
    'beneficio_sueno', 'Quinoa con los 9 aminoacidos esenciales — triptofano completo. Tahini negro: calcio + magnesio juntos para el receptor GABA-A. Granada produce urolitinas durante el sueno. Kefir aporta GABA bacteriano en un microbioma cultivado 21 dias. El vinagre activa el nervio vago.',
    'tiempo_min', 30,
    'momento', 'Cena — celebracion del dia 21'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
