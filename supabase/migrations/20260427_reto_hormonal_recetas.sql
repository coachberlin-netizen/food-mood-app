-- Añadir recetas completas (ingredientes + pasos) al reto equilibrio-hormonal-45
-- Cada UPDATE añade la clave 'receta' sin tocar el resto del recipe_data

-- ─── DÍA 1 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Desayuno de lino y frutos rojos',
  'descripcion',  'Bol de yogur con semillas de lino, frutos rojos y nueces. 5 minutos.',
  'ingredientes', jsonb_build_array(
    '150 g de yogur natural sin azúcar',
    '1 cucharada sopera de semillas de lino molidas (15 g)',
    '80 g de arándanos frescos o congelados',
    '50 g de frambuesas',
    '20 g de nueces (4–5 mitades)',
    'Té verde o infusión de rooibos'
  ),
  'pasos', jsonb_build_array(
    'Vierte el yogur en un bol.',
    'Añade las semillas de lino molidas y mezcla.',
    'Coloca los arándanos y las frambuesas encima.',
    'Trocea las nueces y esparce sobre la fruta.',
    'Prepara el té verde o el rooibos y sirve junto al bol.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 1;

-- ─── DÍA 2 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Ensalada tibia de alcachofas y lentejas',
  'descripcion',  'Ensalada caliente con inulina y fibra resistente. 30 minutos.',
  'ingredientes', jsonb_build_array(
    '2 alcachofas medianas (o 4 corazones en conserva)',
    '80 g de lentejas verdes (peso seco)',
    '50 g de rúcula',
    '1/4 de cebolla morada',
    '2 cucharadas de aceite de oliva virgen extra',
    '1 cucharada de vinagre de manzana',
    '2 cucharadas de semillas de girasol tostadas',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Cuece las lentejas en agua sin sal 20 minutos. Escurre y reserva.',
    'Cuece las alcachofas al vapor 15–20 min hasta que estén tiernas. Retira hojas exteriores y corta los corazones en cuartos.',
    'Lamina la cebolla morada muy fina.',
    'Monta la base de rúcula en el plato. Añade lentejas y alcachofas tibias encima.',
    'Aliña con aceite de oliva y vinagre de manzana. Sal al gusto.',
    'Termina con semillas de girasol tostadas por encima.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 2;

-- ─── DÍA 3 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Crema de espinacas con cacao y almendras',
  'descripcion',  'Crema caliente de espinacas con cacao. Snack de tarde: semillas de calabaza.',
  'ingredientes', jsonb_build_array(
    '150 g de espinacas frescas o congeladas',
    '200 ml de leche de avena sin azúcar',
    '1 cucharada sopera de cacao puro en polvo (sin azúcar)',
    '20 g de almendras tostadas',
    '1 pizca de sal marina',
    '1 cucharadita de aceite de oliva',
    '25 g de semillas de calabaza (snack de tarde)'
  ),
  'pasos', jsonb_build_array(
    'Saltea las espinacas en sartén con una cucharadita de aceite de oliva 2–3 min hasta que reduzcan.',
    'Añade la leche de avena y el cacao en polvo. Remueve bien.',
    'Tritura con batidora hasta obtener una crema homogénea.',
    'Calienta a fuego suave 2–3 minutos. Ajusta sal.',
    'Sirve con las almendras tostadas por encima.',
    'Por la tarde, come las semillas de calabaza como snack.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 3;

-- ─── DÍA 4 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Salmón al horno con verduras y huevo',
  'descripcion',  'Bandeja de horno en 15 minutos con la mayor dosis de D3 alimentaria posible.',
  'ingredientes', jsonb_build_array(
    '150 g de lomo de salmón',
    '150 g de brócoli en ramilletes',
    '1 zanahoria mediana',
    '1 huevo',
    '2 cucharadas de aceite de oliva virgen extra',
    'Zumo de 1/2 limón',
    'Sal marina y pimienta negra'
  ),
  'pasos', jsonb_build_array(
    'Precalienta el horno a 180°C.',
    'Coloca el salmón en bandeja. Unta con aceite, sal y pimienta.',
    'Añade el brócoli y la zanahoria en trozos junto al salmón. Riega con aceite.',
    'Hornea 15 minutos.',
    'Mientras, cuece el huevo en agua hirviendo 9 minutos. Pela y corta por la mitad.',
    'Emplata el salmón con las verduras y el huevo encima.',
    'Termina con zumo de limón por encima.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 4;

-- ─── DÍA 5 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol de sardinas con aguacate y rúcula',
  'descripcion',  'Bol frío sin cocción. Lista en 5 minutos.',
  'ingredientes', jsonb_build_array(
    '1 lata de sardinas en aceite de oliva (85–120 g escurridas)',
    '1/2 aguacate maduro',
    '60 g de rúcula baby',
    '1/4 de cebolla morada',
    '1 cucharada de alcaparras',
    'Zumo de 1/2 limón',
    '2 rebanadas de pan de centeno integral',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Escurre las sardinas (guarda el aceite para aliñar si lo deseas).',
    'Lamina el aguacate en tiras finas. Corta la cebolla morada en aros muy finos.',
    'Coloca la rúcula en la base del plato.',
    'Añade las sardinas, el aguacate y la cebolla morada encima.',
    'Distribuye las alcaparras.',
    'Aliña con zumo de limón y aceite al gusto. Sal marina.',
    'Sirve con las tostadas de pan de centeno al lado.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 5;

-- ─── DÍA 6 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Salteado de carne magra con setas y semillas de calabaza',
  'descripcion',  'Salteado a fuego alto con la fuente más biodisponible de zinc. 20 minutos.',
  'ingredientes', jsonb_build_array(
    '150 g de solomillo de ternera o pechuga de pollo',
    '150 g de champiñones portobello',
    '1/2 pimiento verde',
    '2 dientes de ajo',
    '1 cucharada de semillas de calabaza tostadas',
    '2 cucharadas de aceite de oliva',
    'Sal marina y pimienta negra',
    '80 g de arroz basmati (peso seco)'
  ),
  'pasos', jsonb_build_array(
    'Cuece el arroz basmati según instrucciones (aprox. 12 min). Reserva.',
    'Corta la carne en tiras finas. Lamina las setas y corta el pimiento en juliana.',
    'Calienta el aceite en sartén a fuego alto. Añade el ajo picado y saltea 1 min.',
    'Añade la carne y sella a fuego alto 2–3 min hasta dorar. Retira y reserva.',
    'En la misma sartén, saltea las setas y el pimiento 4–5 min.',
    'Incorpora la carne, salpimenta y mezcla bien.',
    'Sirve sobre el arroz basmati. Termina con semillas de calabaza tostadas.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 6;

-- ─── DÍA 7 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol integrador de la semana 1',
  'descripcion',  'Un ingrediente por cofactor de la semana. El plato completo del estrobioma.',
  'ingredientes', jsonb_build_array(
    '80 g de quinoa (peso seco)',
    '80 g de espinacas frescas',
    '1 lata de sardinas en aceite de oliva',
    '1/2 aguacate',
    '1 cucharada de semillas de lino molidas',
    '1 cucharada de semillas de calabaza',
    '1/2 pimiento rojo',
    'Zumo de 1/2 limón',
    '2 cucharadas de aceite de oliva',
    '150 g de yogur natural con 80 g de arándanos (postre)'
  ),
  'pasos', jsonb_build_array(
    'Cuece la quinoa en el doble de agua con sal 15 min. Escurre y deja templar.',
    'Saltea brevemente las espinacas con aceite de oliva, 2 min.',
    'Corta el pimiento rojo en tiras finas. Lamina el aguacate.',
    'Monta el bol: quinoa de base, espinacas, sardinas escurridas, aguacate y pimiento rojo.',
    'Esparce las semillas de lino y de calabaza por encima.',
    'Aliña con aceite de oliva y zumo de limón.',
    'De postre: yogur natural con arándanos.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 7;

-- ─── DÍA 8 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol de miso con tofu y verduras',
  'descripcion',  'El caldo que no debe hervir: a 60°C los probióticos del miso siguen vivos.',
  'ingredientes', jsonb_build_array(
    '1 cucharada sopera de pasta de miso sin pasteurizar',
    '200 ml de agua caliente (a 60°C, nunca hirviendo)',
    '100 g de tofu firme',
    '5 g de wakame seco (o 30 g hidratado)',
    '100 g de champiñones',
    '1 cm de jengibre fresco rallado',
    'Cebollino fresco para decorar'
  ),
  'pasos', jsonb_build_array(
    'Hidrata el wakame en agua fría 5–10 min. Escurre y trocea.',
    'Saltea los champiñones en sartén seca 5 min hasta dorar. Reserva.',
    'Corta el tofu en dados de 1 cm.',
    'Calienta el agua hasta 60°C — usa termómetro o retira del fuego cuando veas pequeñas burbujas en el fondo, antes de que hierva.',
    'Disuelve la pasta de miso en un poco del agua caliente removiendo bien, luego añade al resto.',
    'Añade el tofu, el wakame, los champiñones y el jengibre rallado.',
    'Sirve con cebollino picado por encima.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 8;

-- ─── DÍA 9 ────────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Ensalada de granada, rúcula y nueces',
  'descripcion',  'Sin cocción. Las dos fuentes más densas de elagitaninos precursores de urolitinas.',
  'ingredientes', jsonb_build_array(
    '60 g de rúcula baby',
    'Granos de 1/2 granada (aprox. 80 g)',
    '30 g de nueces troceadas',
    '40 g de queso de cabra tierno',
    '1/4 de cebolla morada',
    '2 cucharadas de aceite de oliva virgen extra',
    '1 cucharada de vinagre de manzana',
    '1 cucharadita de mostaza antigua',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Desgranan la media granada sobre un bol. Reserva.',
    'Lamina la cebolla morada muy fina.',
    'Desmenuza el queso de cabra en trozos irregulares.',
    'En un tarro pequeño, mezcla el aceite, el vinagre, la mostaza y sal. Agita bien.',
    'Coloca la rúcula en el plato.',
    'Añade los granos de granada, las nueces, el queso y la cebolla morada.',
    'Aliña con la vinagreta justo al servir.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 9;

-- ─── DÍA 10 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Hummus casero con crudités y pan de centeno',
  'descripcion',  'El hummus más fácil: 5 minutos con batidora. Los garbanzos son la fuente de cumestanos más accesible.',
  'ingredientes', jsonb_build_array(
    '240 g de garbanzos cocidos (bote escurrido)',
    '2 cucharadas de tahini',
    '1 diente de ajo',
    'Zumo de 1 limón',
    '2 cucharadas de aceite de oliva virgen extra',
    '1/2 cucharadita de comino molido',
    '2–3 cucharadas de agua fría',
    'Sal marina',
    '2 zanahorias, 2 tallos de apio, 1/2 pepino (crudités)',
    '2–3 rebanadas de pan de centeno integral'
  ),
  'pasos', jsonb_build_array(
    'Escurre y enjuaga bien los garbanzos.',
    'Tritura los garbanzos con el tahini, el ajo, el zumo de limón y el aceite de oliva.',
    'Añade el agua fría cucharada a cucharada hasta conseguir la textura deseada.',
    'Añade el comino y la sal. Tritura de nuevo 30 segundos.',
    'Corta las zanahorias, el apio y el pepino en bastones.',
    'Sirve el hummus en bol con un hilo de aceite de oliva y una pizca de pimentón encima.',
    'Acompaña con los bastones de verdura y el pan de centeno.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 10;

-- ─── DÍA 11 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Batido adaptogénico femenino',
  'descripcion',  'Congela el plátano la noche anterior. Batir y listo en 2 minutos.',
  'ingredientes', jsonb_build_array(
    '200 ml de leche de almendras sin azúcar',
    '1 plátano maduro congelado (en rodajas)',
    '1 cucharadita de maca en polvo gelatinizada',
    '1 cucharadita de ashwagandha KSM-66 en polvo',
    '1 cucharada sopera de cacao puro en polvo',
    '1 cucharada de semillas de lino molidas',
    '1 dátil Medjoul deshuesado',
    'Hielo al gusto (opcional)'
  ),
  'pasos', jsonb_build_array(
    'La noche anterior: corta el plátano en rodajas y congela.',
    'Añade todos los ingredientes en el vaso de la batidora o blender.',
    'Bate a velocidad alta 45–60 segundos hasta obtener textura cremosa.',
    'Prueba el dulzor — ajusta con más dátil si lo necesitas.',
    'Sirve inmediatamente (el plátano congelado se oxida si lo guardas).'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 11;

-- ─── DÍA 12 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Huevos revueltos con salmón ahumado y aguacate',
  'descripcion',  '35–40 g de proteína completa en el desayuno. El secreto: retirar los huevos antes de que cuajen del todo.',
  'ingredientes', jsonb_build_array(
    '2 huevos camperos',
    '60 g de salmón ahumado en lonchas',
    '1/2 aguacate maduro',
    '2 rebanadas de pan de centeno integral',
    '6–8 tomates cherry',
    '1 cucharadita de aceite de oliva o mantequilla',
    'Sal marina y pimienta negra',
    '150 g de yogur griego natural + 20 g de nueces + 1 cucharada lino (postre)'
  ),
  'pasos', jsonb_build_array(
    'Tuesta el pan de centeno.',
    'Bate los huevos con una pizca de sal y pimienta.',
    'Calienta el aceite en sartén a fuego medio-bajo. Vierte los huevos.',
    'Remueve despacio con espátula de goma haciendo movimientos lentos y continuos.',
    'Retira del fuego cuando todavía estén ligeramente líquidos — el calor residual termina de cuajarlos cremosamente.',
    'Lamina el aguacate. Corta los tomates por la mitad.',
    'Sirve los huevos sobre las tostadas. Coloca el salmón ahumado encima.',
    'Añade el aguacate y los tomates al lado.',
    'De postre: yogur griego con nueces y semillas de lino.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 12;

-- ─── DÍA 13 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Crema de boniato con leche de coco y cúrcuma',
  'descripcion',  'Cena ligera antes de las 20h. A las 21h: infusión de valeriana y melisa.',
  'ingredientes', jsonb_build_array(
    '300 g de boniato pelado y troceado',
    '150 ml de leche de coco del brick (sin azúcar)',
    '1/2 cucharadita de cúrcuma en polvo',
    '1 cm de jengibre fresco (o 1/4 cucharadita en polvo)',
    '1 cucharadita de aceite de oliva',
    'Sal marina y pimienta negra',
    'Infusión de valeriana y melisa (noche)',
    '25 g de semillas de calabaza (snack nocturno si hay hambre)'
  ),
  'pasos', jsonb_build_array(
    'Pela y trocea el boniato. Cuece en agua con sal 15–20 min hasta que esté tierno.',
    'Escurre el boniato. Tritura con la leche de coco, la cúrcuma y el jengibre.',
    'Si queda muy espeso, añade un poco del agua de cocción.',
    'Calienta a fuego suave 2–3 min. Ajusta sal y pimienta.',
    'Sirve con un hilo de aceite de oliva.',
    'A las 21h: infusión de valeriana y melisa en reposo 7 min. Acompaña con las semillas de calabaza si tienes hambre.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 13;

-- ─── DÍA 14 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol integrador de la semana 2',
  'descripcion',  'Tempeh, edamame, granada y miso: cada ingrediente es un fitoestrógeno distinto.',
  'ingredientes', jsonb_build_array(
    '100 g de tempeh',
    '100 g de setas variadas (shiitake, portobello)',
    '50 g de edamame descongelado',
    '80 g de quinoa negra (peso seco)',
    'Granos de 1/4 de granada',
    '40 g de rúcula',
    '2 cucharadas de semillas de cáñamo',
    '1 cucharadita de pasta de miso',
    '1 cm de jengibre fresco rallado',
    '1 cucharada de aceite de oliva',
    '1 cucharada de vinagre de arroz'
  ),
  'pasos', jsonb_build_array(
    'Cuece la quinoa negra en el doble de agua 15–20 min. Escurre y deja templar.',
    'Corta el tempeh en daditos de 1 cm. Dora en sartén con un poco de aceite 4–5 min por lado.',
    'Saltea las setas a fuego alto 4–5 min hasta que doren. Reserva.',
    'Prepara la vinagreta: mezcla el miso, el jengibre, el aceite, el vinagre y 1–2 cucharadas de agua hasta obtener una salsa homogénea.',
    'Monta el bol: quinoa negra de base, tempeh, setas, edamame, rúcula.',
    'Añade los granos de granada y las semillas de cáñamo.',
    'Aliña con la vinagreta de miso al momento de servir.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 14;

-- ─── DÍA 15 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Brócoli asado con ajo y salsa de tahini',
  'descripcion',  'Asado a 200°C conserva el DIM mejor que hervido. Los bordes tostados son los más ricos en sulforafano.',
  'ingredientes', jsonb_build_array(
    '300 g de brócoli en ramilletes',
    '3 dientes de ajo',
    '2 cucharadas de aceite de oliva virgen extra',
    '2 cucharadas de tahini negro (o blanco)',
    'Zumo de 1/2 limón',
    '1–2 cucharadas de agua (para la salsa)',
    '1 cucharada de semillas de sésamo tostadas',
    'Sal marina y pimienta negra'
  ),
  'pasos', jsonb_build_array(
    'Precalienta el horno a 200°C.',
    'Corta el brócoli en ramilletes medianos. Lamina el ajo fino.',
    'Mezcla el brócoli con el aceite, el ajo, sal y pimienta. Distribuye en bandeja.',
    'Asa 18–20 minutos hasta que los bordes estén dorados y ligeramente crujientes.',
    'Mientras, mezcla el tahini con el zumo de limón y 1–2 cucharadas de agua hasta obtener una salsa suave.',
    'Saca el brócoli del horno. Riega con la salsa de tahini.',
    'Termina con semillas de sésamo tostadas por encima.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 15;

-- ─── DÍA 16 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Ensalada depurativa de remolacha y alcachofas',
  'descripcion',  'Betaína + cinarina: el dúo hepático más potente de la alimentación.',
  'ingredientes', jsonb_build_array(
    '150 g de remolacha cocida (bote o cocida en casa)',
    '2 alcachofas medianas (o 4 corazones en conserva)',
    '60 g de espinacas frescas',
    '20 g de nueces',
    '2 cucharadas de semillas de girasol',
    '2 cucharadas de aceite de oliva virgen extra',
    '1 cucharada de zumo de limón',
    '1 cucharadita de mostaza antigua',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Si usas alcachofas frescas: cuece al vapor 15–20 min. Retira hojas exteriores y corta corazones en cuartos.',
    'Corta la remolacha en rodajas o láminas finas.',
    'Prepara la vinagreta: mezcla el aceite, el limón y la mostaza con sal.',
    'Coloca las espinacas en la base del plato.',
    'Añade la remolacha y las alcachofas encima.',
    'Distribuye las nueces troceadas y las semillas de girasol.',
    'Aliña con la vinagreta al servir.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 16;

-- ─── DÍA 17 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Sopa de caldo de huesos con verduras y cúrcuma',
  'descripcion',  'El caldo de huesos aporta glutamina para los enterocitos. La cúrcuma reduce la inflamación de la mucosa.',
  'ingredientes', jsonb_build_array(
    '400 ml de caldo de huesos casero (o de calidad)',
    '1 zanahoria mediana',
    '2 tallos de apio',
    '1/2 puerro',
    '1 cm de cúrcuma fresca (o 1/4 cucharadita en polvo)',
    '1 cm de jengibre fresco',
    '60 g de arroz integral o fideos de arroz',
    '1 cucharada de aceite de oliva',
    'Sal marina y pimienta negra'
  ),
  'pasos', jsonb_build_array(
    'Cuece el arroz integral en agua con sal aparte 30 min (o usa fideos de arroz según instrucciones). Reserva.',
    'Trocea la zanahoria, el apio y el puerro en rodajas.',
    'Calienta el caldo de huesos en cazuela a fuego medio.',
    'Añade las verduras, la cúrcuma y el jengibre rallado. Cocina 10–12 min hasta que la zanahoria esté tierna.',
    'Ajusta sal y pimienta.',
    'Sirve la sopa con el arroz integral ya cocido en el fondo del plato.',
    'Termina con un hilo de aceite de oliva.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 17;

-- ─── DÍA 18 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Ensalada de wakame con salmón y nueces de Brasil',
  'descripcion',  'Yodo del wakame + selenio de las nueces de Brasil: el dúo esencial para la tiroides.',
  'ingredientes', jsonb_build_array(
    '5 g de wakame seco',
    '150 g de lomo de salmón',
    '50 g de edamame descongelado',
    '1 cucharadita de semillas de sésamo',
    '1 cm de jengibre fresco rallado',
    '1 cucharada de tamari (sin gluten)',
    '1 cucharada de aceite de sésamo',
    '1 cucharada de vinagre de arroz',
    '2 nueces de Brasil'
  ),
  'pasos', jsonb_build_array(
    'Hidrata el wakame en agua fría 8–10 min. Escurre y trocea.',
    'Precalienta el horno a 180°C. Asa el salmón en bandeja con sal y aceite de oliva 12–15 min. Desmenúzalo en trozos al servir.',
    'Ralla el jengibre fresco.',
    'Prepara la vinagreta: mezcla el tamari, el aceite de sésamo, el vinagre y el jengibre rallado.',
    'Monta la ensalada en bol: wakame de base, salmón, edamame.',
    'Aliña con la vinagreta. Esparce las semillas de sésamo.',
    'Coloca las 2 nueces de Brasil enteras al lado.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 18;

-- ─── DÍA 19 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Sopa de caldo de huesos con pimiento rojo asado y perejil',
  'descripcion',  'Colágeno hidrolizado del caldo + triple dosis de vitamina C del pimiento rojo asado.',
  'ingredientes', jsonb_build_array(
    '350 ml de caldo de huesos (pollo o ternera)',
    '1 pimiento rojo grande',
    '1 zanahoria mediana',
    'Perejil fresco abundante (un buen manojo)',
    '1/4 cucharadita de cúrcuma en polvo',
    '2 rebanadas de pan de centeno integral',
    '1/2 aguacate maduro',
    'Zumo de 1/2 limón',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Precalienta el horno a 200°C. Asa el pimiento rojo entero 20–25 min hasta que la piel esté chamuscada.',
    'Mete el pimiento en una bolsa o bol tapado 10 min — el vapor facilita pelar la piel.',
    'Pela el pimiento y córtalo en tiras. Reserva.',
    'Calienta el caldo en cazuela. Añade la zanahoria en rodajas y la cúrcuma. Cocina 10 min.',
    'Añade el pimiento asado. Calienta 3 min más. Ajusta sal.',
    'Sirve la sopa con perejil fresco picado abundante.',
    'Acompaña con tostadas de pan de centeno untadas con aguacate y unas gotas de limón.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 19;

-- ─── DÍA 20 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol de kéfir con lino y frutos rojos',
  'descripcion',  'Sin cocción. El kéfir tiene 30–50 cepas bacterianas distintas, más diversidad que cualquier yogur.',
  'ingredientes', jsonb_build_array(
    '180 ml de kéfir natural sin azúcar',
    '1 cucharada sopera de semillas de lino molidas (15 g)',
    '80 g de arándanos frescos o congelados',
    '50 g de frambuesas',
    '25 g de nueces',
    '1 cucharadita de miel de manuka (opcional)'
  ),
  'pasos', jsonb_build_array(
    'Vierte el kéfir en un bol.',
    'Añade las semillas de lino molidas y mezcla bien.',
    'Coloca los arándanos y las frambuesas encima.',
    'Trocea las nueces y esparce sobre los frutos rojos.',
    'Si lo deseas, añade una cucharadita de miel de manuka.',
    'Come inmediatamente para que el lino no absorba demasiada humedad del kéfir.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 20;

-- ─── DÍA 21 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Bol integrador de la semana 3',
  'descripcion',  'El bol completo de la detoxificación: DIM, betaína, selenio, DHA y estrobioma en un solo plato.',
  'ingredientes', jsonb_build_array(
    '150 g de lomo de salmón',
    '150 g de brócoli en ramilletes',
    '50 g de edamame descongelado',
    '80 g de quinoa (peso seco)',
    '80 g de remolacha cocida',
    '1 cucharada de semillas de lino molidas',
    '80 g de kéfir natural (para el dressing)',
    '2 nueces de Brasil',
    '2 cucharadas de aceite de oliva',
    'Zumo de 1/2 limón',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Precalienta el horno a 200°C.',
    'Cuece la quinoa en doble de agua con sal 15 min. Escurre y deja templar.',
    'Asa el brócoli con aceite y sal 15 min en el horno. En los últimos 12–15 min, añade el salmón en la misma bandeja.',
    'Prepara el dressing: mezcla el kéfir con el zumo de limón y una pizca de sal.',
    'Corta la remolacha en dados.',
    'Monta el bol: quinoa de base, salmón en trozos, brócoli, edamame, remolacha.',
    'Riega con el dressing de kéfir. Añade semillas de lino por encima.',
    'Coloca las 2 nueces de Brasil enteras al lado.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 21;

-- ─── DÍA 22 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Avena hormonal de desayuno — dentro de la primera hora',
  'descripcion',  'Los beta-glucanos de la avena estabilizan la glucosa e insulina desde la primera comida del día.',
  'ingredientes', jsonb_build_array(
    '60 g de copos de avena (sin gluten si es necesario)',
    '200 ml de leche de almendras sin azúcar',
    '1 cucharada de semillas de lino molidas',
    '80 g de arándanos frescos',
    '20 g de nueces',
    '1/2 cucharadita de canela en polvo'
  ),
  'pasos', jsonb_build_array(
    'Calienta la leche de almendras en cazo a fuego medio.',
    'Cuando esté caliente, añade los copos de avena.',
    'Cocina 5–7 minutos removiendo, hasta que la avena absorba el líquido y tenga textura cremosa.',
    'Añade la canela y mezcla. Ajusta consistencia con más leche si es necesario.',
    'Sirve en bol. Añade semillas de lino, arándanos y nueces.',
    'Come dentro de la primera hora de haberte levantado.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 22;

-- ─── DÍA 23 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Leche dorada de ashwagandha',
  'descripcion',  'La piperina de la pimienta negra aumenta la biodisponibilidad de la cúrcuma un 2000%. No te la saltes.',
  'ingredientes', jsonb_build_array(
    '250 ml de leche de almendras sin azúcar',
    '1 cucharadita de ashwagandha KSM-66 en polvo',
    '1/2 cucharadita de cúrcuma en polvo',
    '1 pizca generosa de pimienta negra molida',
    '1/4 cucharadita de canela en polvo',
    '1/4 cucharadita de jengibre en polvo (o 1 cm fresco rallado)',
    '1 cucharadita de miel (opcional)'
  ),
  'pasos', jsonb_build_array(
    'Calienta la leche de almendras en cazo a fuego medio (sin hervir).',
    'Añade la ashwagandha, la cúrcuma, la pimienta, la canela y el jengibre.',
    'Remueve con varilla durante 2–3 minutos a fuego suave hasta disolver todo.',
    'Prueba y añade miel si lo deseas.',
    'Cuela si usas jengibre fresco rallado.',
    'Sirve en taza. Toma por la mañana o media tarde.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 23;

-- ─── DÍA 24 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Curry antiinflamatorio de garbanzos con espinacas',
  'descripcion',  'La curcumina de la cúrcuma inhibe la COX-2. La pimienta negra la hace biodisponible: nunca una sin la otra.',
  'ingredientes', jsonb_build_array(
    '240 g de garbanzos cocidos (bote escurrido)',
    '200 ml de leche de coco del brick (sin azúcar)',
    '100 g de espinacas frescas',
    '200 g de tomate triturado',
    '1 cucharadita de cúrcuma fresca rallada (o 1/2 cucharadita en polvo)',
    '1/2 cucharadita de pimienta negra molida',
    '1/2 cucharadita de comino molido',
    '1 cm de jengibre fresco rallado',
    '2 cucharadas de aceite de oliva',
    'Sal marina',
    '80 g de arroz integral (peso seco)'
  ),
  'pasos', jsonb_build_array(
    'Cuece el arroz integral aparte en agua con sal 30 min. Reserva.',
    'Calienta el aceite en sartén honda o cazuela a fuego medio.',
    'Añade la cúrcuma, el comino y el jengibre. Saltea 1 min removiendo.',
    'Vierte el tomate triturado y cocina 3–4 min.',
    'Añade los garbanzos escurridos y la leche de coco. Mezcla bien.',
    'Cocina a fuego suave 10–12 min.',
    'Añade las espinacas y la pimienta negra. Cocina 2–3 min más hasta que las espinacas se reduzcan.',
    'Ajusta sal. Sirve sobre el arroz integral.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 24;

-- ─── DÍA 25 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Gran ensalada de 5 colores con vinagreta antioxidante',
  'descripcion',  'Cada color es un sistema antioxidante distinto. La biodiversidad vegetal activa NRF2, el interruptor maestro antioxidante.',
  'ingredientes', jsonb_build_array(
    '80 g de remolacha cocida (roja)',
    '1 zanahoria mediana (naranja)',
    '60 g de espinacas frescas (verde)',
    '80 g de lombarda rallada (morada)',
    '1/2 aguacate (verde cremoso)',
    '20 g de nueces troceadas',
    '2 cucharadas de semillas de girasol',
    '2 cucharadas de aceite de oliva virgen extra',
    '1 cucharada de vinagre de manzana',
    '1 cucharadita de mostaza',
    '1/2 cucharadita de cúrcuma en polvo',
    '1 diente de ajo rallado',
    'Sal marina'
  ),
  'pasos', jsonb_build_array(
    'Ralla o lamina la zanahoria y la lombarda muy finas.',
    'Corta la remolacha en rodajas finas. Lamina el aguacate.',
    'Prepara la vinagreta: mezcla el aceite, el vinagre, la mostaza, la cúrcuma, el ajo y la sal en un tarro. Agita.',
    'Coloca las espinacas de base en el plato.',
    'Distribuye la remolacha, la zanahoria, la lombarda y el aguacate por zonas para que se vean los 5 colores.',
    'Añade nueces troceadas y semillas de girasol.',
    'Aliña con la vinagreta justo al servir.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 25;

-- ─── DÍA 26 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'Protocolo de la curva plana — cómo comer hoy',
  'descripcion',  'No es una receta: es el orden en que comes. La secuencia verdura → proteína → carbohidrato reduce el pico de glucosa un 36%.',
  'ingredientes', jsonb_build_array(
    '1 cucharada de vinagre de manzana + vaso de agua (antes de cada comida principal)',
    'Verdura o ensalada (primer plato de cada comida)',
    'Fuente de proteína: huevo, pescado, legumbres o carne (segundo)',
    'Carbohidrato: arroz integral, boniato, pan de centeno (tercero)',
    'Grasas buenas: aguacate, aceite de oliva, nueces (acompañando)'
  ),
  'pasos', jsonb_build_array(
    'Antes de cada comida principal: bebe un vaso de agua con 1 cucharada de vinagre de manzana.',
    'Empieza siempre por la verdura o la ensalada. Cómela despacio antes de seguir.',
    'Después come la proteína (huevo, pescado, legumbres o carne).',
    'Por último, los carbohidratos (arroz, boniato, pan de centeno).',
    'Termina la comida principal y espera 10–15 minutos.',
    'Da un paseo de 10–15 minutos después de comer: activa GLUT4 y reduce el pico de glucosa adicional un 20–30%.',
    'Aplica este orden en el desayuno, la comida y la cena.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 26;

-- ─── DÍA 28 ───────────────────────────────────────────────────────────────────
UPDATE public.challenge_days
SET recipe_data = recipe_data || jsonb_build_object('receta', jsonb_build_object(
  'titulo',       'El gran bol hormonal de los 28 días',
  'descripcion',  'Un ingrediente por mecanismo del reto. El plato completo del equilibrio hormonal.',
  'ingredientes', jsonb_build_array(
    '150 g de lomo de salmón (omega-3 + D3 — semana 1)',
    '150 g de brócoli en ramilletes (DIM — semana 3)',
    '50 g de edamame descongelado (cumestanos — semana 2)',
    '80 g de quinoa (proteína completa — semana 2)',
    '80 g de remolacha cocida (betaína para metilación — semana 3)',
    '1 cucharada de semillas de lino molidas (lignanos — semana 1)',
    'Granos de 1/4 de granada (urolitinas — semana 2)',
    '1/2 aguacate (grasas cofactoras — semana 3)',
    '80 g de kéfir natural (estrobioma — semana 1)',
    '2 nueces de Brasil (selenio — semana 3)',
    '2 cucharadas de semillas de calabaza (zinc — semana 1)',
    '1 cucharadita de pasta de miso + 1 cm jengibre + 1 cucharada aceite de oliva + 1 cucharada vinagre de arroz (vinagreta)'
  ),
  'pasos', jsonb_build_array(
    'Precalienta el horno a 200°C.',
    'Cuece la quinoa en doble de agua con sal 15 min. Escurre y deja templar.',
    'Asa el brócoli con aceite y sal 15 min. Añade el salmón en la misma bandeja los últimos 12–15 min.',
    'Prepara la vinagreta de miso: mezcla el miso, el jengibre rallado, el aceite, el vinagre y 1–2 cucharadas de agua.',
    'Corta la remolacha en dados. Lamina el aguacate.',
    'Monta el gran bol: quinoa de base, salmón, brócoli, edamame, remolacha, aguacate.',
    'Añade semillas de lino, granos de granada, semillas de calabaza y nueces de Brasil.',
    'Aliña con la vinagreta de miso. Sirve el kéfir como dressing adicional al lado.'
  )
))
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'equilibrio-hormonal-45')
  AND day_number = 28;
