-- Añade receta con ingredientes y pasos estructurados a cada día de recupera-tu-energia

-- Día 1 — CoQ10 / Sardinas
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Tostada de sardinas con aguacate',
      'descripcion', 'Desayuno CoQ10 · 10 min',
      'ingredientes', jsonb_build_array(
        '2 rebanadas de pan de centeno',
        '1 lata de sardinas en aceite de oliva',
        '1/2 aguacate maduro',
        '1/2 limón',
        'Sal marina y pimienta negra',
        'Café o té verde (antes de las 10h)'
      ),
      'pasos', jsonb_build_array(
        'Tuesta el pan de centeno.',
        'Aplasta el aguacate con un tenedor. Añade una pizca de sal y zumo de limón.',
        'Extiende el aguacate sobre el pan tostado.',
        'Coloca las sardinas escurridas encima.',
        'Termina con pimienta negra y el resto del limón.',
        'Acompaña con café o té verde. No añadas azúcar.'
      ),
      'por_que', 'Las sardinas son la fuente más densa de CoQ10 + omega-3 DHA. El aceite de oliva activa la absorción liposoluble del CoQ10. El aguacate suma grasas saludables para la membrana mitocondrial.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 1;

-- Día 2 — Hierro + Vitamina C / Lentejas
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Bol de lentejas con pimiento rojo y limón',
      'descripcion', 'Comida iron-boost · 25 min',
      'ingredientes', jsonb_build_array(
        '200 g de lentejas rojas secas',
        '1 pimiento rojo grande',
        '2 puñados de espinacas baby',
        '2 cucharadas de aceite de oliva virgen extra',
        'Zumo de 1 limón generoso',
        'Sal marina',
        '1 huevo duro (opcional, suma B12)'
      ),
      'pasos', jsonb_build_array(
        'Cuece las lentejas rojas en agua con sal 15-18 minutos. Escurre y reserva.',
        'Corta el pimiento rojo en tiras finas. Puedes usarlo crudo o asarlo 10 min en el horno.',
        'Monta el bol: lentejas calientes + espinacas baby (se marchitarán ligeramente con el calor) + pimiento.',
        'Aliña con aceite de oliva y zumo de limón generoso. El limón es imprescindible — triplica la absorción del hierro.',
        'Añade el huevo duro cortado por la mitad si lo usas.',
        'Sirve inmediatamente con el aliño recién puesto.'
      ),
      'por_que', 'Las lentejas son la fuente vegetal más densa en hierro. El pimiento rojo tiene 3× más vitamina C que una naranja. El limón convierte el hierro no-hemo en forma ferrosa, absorbible. Las espinacas añaden folato cofactor.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 2;

-- Día 3 — Magnesio / Batido de cacao y almendras
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Batido de cacao con almendras y plátano',
      'descripcion', 'Desayuno magnesio · 5 min',
      'ingredientes', jsonb_build_array(
        '250 ml de leche de avena (sin azúcar)',
        '2 cucharadas de cacao puro en polvo (mínimo 85%)',
        '1 puñado de almendras crudas (sin tostar, sin sal)',
        '1 plátano maduro',
        '1 pizca de sal marina'
      ),
      'pasos', jsonb_build_array(
        'Pon todos los ingredientes en el vaso de la batidora.',
        'Bate a potencia alta durante 45-60 segundos hasta que quede completamente homogéneo.',
        'Prueba y añade más cacao si quieres más intensidad.',
        'Sirve frío o a temperatura ambiente. No calientes — el calor destruye enzimas.'
      ),
      'por_que', 'El cacao puro es la fuente más densa de magnesio disponible. El plátano añade potasio para el equilibrio electrolítico. Las almendras suman vitamina E antioxidante y más magnesio. La sal marina aporta minerales traza.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 3;

-- Día 4 — HITO / Omega-3 / Salmón al horno
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Salmón al horno con boniato y espárragos',
      'descripcion', 'Cena DHA · 35 min',
      'ingredientes', jsonb_build_array(
        '150-200 g de salmón salvaje (no de piscifactoría)',
        '1 boniato mediano',
        '1 manojo de espárragos verdes',
        '2 dientes de ajo',
        '2 cucharadas de aceite de oliva virgen extra',
        '1/2 limón',
        'Sal marina y pimienta negra'
      ),
      'pasos', jsonb_build_array(
        'Precalienta el horno a 180°C.',
        'Pela y trocea el boniato en cubos de 2 cm. Ponlos en una bandeja con 1 cucharada de aceite y sal. Hornea 20 min.',
        'Añade el salmón y los espárragos a la bandeja. Riega con el resto del aceite y el ajo laminado.',
        'Hornea 12-15 minutos más hasta que el salmón esté opaco pero jugoso por dentro.',
        'Exprime el limón por encima justo antes de servir.'
      ),
      'por_que', 'El salmón salvaje tiene 10× más omega-3 DHA que el de piscifactoría. El boniato da betacaroteno cofactor. Los espárragos aportan folato y glutatión. El aceite de oliva potencia la absorción de los omega-3.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 4;

-- Día 5 — NAD+ / Setas y Pollo
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Salteado de setas shiitake con pollo y arroz integral',
      'descripcion', 'Comida NAD+ · 25 min',
      'ingredientes', jsonb_build_array(
        '150 g de pechuga de pollo',
        '150 g de setas shiitake frescas (o rehidratadas)',
        '100 g de champiñones portobello',
        '2 dientes de ajo picados',
        '1 trozo de jengibre fresco (del tamaño de un pulgar)',
        '2 cucharadas de tamari (salsa de soja sin gluten)',
        '1 cucharada de aceite de oliva o aceite de sésamo',
        'Arroz integral cocinado (base del bol)'
      ),
      'pasos', jsonb_build_array(
        'Corta el pollo en tiras finas. Sazona con sal.',
        'Calienta el aceite en una sartén grande o wok a fuego alto.',
        'Saltea el pollo 4-5 minutos removiendo constantemente hasta que esté dorado.',
        'Añade las setas y los champiñones troceados. Saltea a fuego alto 4 minutos — el fuego alto activa la ergotioneína.',
        'Añade el ajo picado y el jengibre rallado. Saltea 1 minuto más.',
        'Agrega el tamari, mezcla bien y retira del fuego.',
        'Sirve sobre una base de arroz integral.'
      ),
      'por_que', 'Las setas shiitake son la fuente más rica en ergotioneína, el antioxidante más potente para las mitocondrias. El pollo aporta niacin (B3) precursor del NAD+. El jengibre activa la AMPK, la enzima reguladora del metabolismo energético.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 5;

-- Día 6 — Adaptógenos / Batido
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Batido adaptogénico de mañana',
      'descripcion', 'Desayuno en ayunas · 5 min',
      'ingredientes', jsonb_build_array(
        '200 ml de leche de coco (tetra brik, sin azúcar)',
        '1 plátano congelado',
        '1 cucharadita de rhodiola en polvo',
        '1 cucharadita de ashwagandha en polvo (KSM-66)',
        '1 cucharada de cacao puro en polvo',
        '1 dátil Medjool (sin hueso)',
        'Hielo al gusto'
      ),
      'pasos', jsonb_build_array(
        'Coloca todos los ingredientes en el vaso de la batidora.',
        'Bate a potencia alta 60 segundos hasta que quede completamente liso.',
        'Sirve inmediatamente en ayunas — la absorción de los adaptógenos es mayor sin alimentos previos.',
        'No añadas azúcar ni edulcorantes — interfieren con la absorción de los adaptógenos.'
      ),
      'por_que', 'La rhodiola actúa en 30 minutos. El coco aporta MCT que van directamente a las mitocondrias como combustible instantáneo. El cacao potencia el efecto adaptogénico vía flavanoles. El plátano da potasio para el equilibrio nervioso.'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 6;

-- Día 7 — HITO FINAL / Bol integrador
UPDATE public.challenge_days SET
  recipe_data = recipe_data || jsonb_build_object(
    'receta', jsonb_build_object(
      'titulo', 'Bol integrador de energía — el final',
      'descripcion', 'El bol que cierra el ciclo · 20 min',
      'ingredientes', jsonb_build_array(
        '80 g de quinoa seca (o 180 g cocinada)',
        '2 puñados de espinacas baby',
        '1 lata de salmón en aceite de oliva',
        '1/2 aguacate maduro',
        '1 puñado de semillas de calabaza',
        '1/2 pimiento rojo',
        '1 huevo duro',
        '1 cucharadita de vinagre de manzana',
        '2 cucharadas de aceite de oliva virgen extra',
        'Zumo de 1/2 limón',
        'Sal marina'
      ),
      'pasos', jsonb_build_array(
        'Cocina la quinoa en agua salada 12-15 minutos. Escurre y deja templar.',
        'Cuece el huevo duro 9 minutos. Enfría en agua fría, pela y corta por la mitad.',
        'Corta el pimiento rojo en tiras y el aguacate en cubos.',
        'Monta el bol: quinoa como base, luego las espinacas baby.',
        'Añade el salmón desmigado, el aguacate, el pimiento y las semillas de calabaza.',
        'Coloca el huevo duro encima.',
        'Aliña con aceite de oliva, limón y vinagre de manzana. El vinagre regula la glucosa postprandial.',
        'Come despacio — este bol contiene los 6 cofactores mitocondriales del reto.'
      ),
      'por_que', 'Cada ingrediente representa una molécula del reto: quinoa (magnesio + hierro), salmón (CoQ10 + DHA), aguacate (grasas cofactoras), semillas de calabaza (zinc + magnesio), pimiento (vitamina C para el hierro), huevo (B12 + colina), vinagre (control glucémico).'
    )
  )
WHERE challenge_id = (SELECT id FROM public.challenges WHERE slug = 'recupera-tu-energia')
  AND day_number = 7;
