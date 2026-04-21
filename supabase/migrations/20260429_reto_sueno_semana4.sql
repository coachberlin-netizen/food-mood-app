-- ── Días 22-28 — Reto sueño semana 4 — Sistema nervioso + Cronobiología + Cierre ──

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 22,
  'Leche dorada de ashwagandha, melisa y canela',
  'La ashwagandha debe tomarse siempre de noche — nunca por la manana. Su efecto modulador del cortisol actua durante las horas de sueno, no de dia.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '200ml leche de avena o leche entera',
      '1 cdta ashwagandha en polvo — extracto KSM-66 si es posible',
      '1 cdta curcuma',
      '1/2 cdta canela de Ceilan',
      '1 pizca de pimienta negra recien molida',
      '1 cdta miel cruda',
      '4-5 hojas de melisa fresca o 1 cdta de melisa seca',
      '1 cdta ghee',
      'Opcional: 1/4 cdta cardamomo molido'
    ),
    'pasos', jsonb_build_array(
      'Infusiona la melisa en la leche caliente 5 minutos a fuego muy suave. Cuela.',
      'Anade la ashwagandha, la curcuma, la canela, la pimienta y el cardamomo. Bate con varillas o batidora de mano.',
      'Incorpora el ghee. Mezcla hasta que se integre — la leche debe quedar ligeramente espumosa.',
      'Retira del fuego. Cuando baje de 70C, anade la miel cruda.',
      'Sirve en bol o taza ancha. Bebe despacio, con las manos alrededor del recipiente.',
      'La temperatura, el amargor suave de la ashwagandha y el aroma de la melisa son parte del ritual — no solo del efecto.'
    ),
    'nutricion', jsonb_build_object('calorias', 120, 'proteinas', 3, 'carbohidratos', 14, 'grasas', 6),
    'beneficio_sueno', 'Withanolidos de la ashwagandha KSM-66 modulan el eje HPA reduciendo el cortisol nocturno hasta un 27% en estudios de 8 semanas. La melisa inhibe la GABA-transaminasa — mas GABA disponible sin producir mas. La curcuma activa Nrf2 para la reparacion nocturna.',
    'tiempo_min', 8,
    'momento', '21-22h — 1h antes de dormir, nunca por la manana',
    'pilar', 'eje_hpa_adaptogenos',
    'aviso', 'La ashwagandha tiene sabor terroso y ligeramente amargo. Si es la primera vez, empieza con media cucharadita. El sabor se integra bien con la canela y la miel.'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 23,
  'Sopa de lentejas rojas con curcuma, jengibre y coco — sincronizacion circadiana',
  'La ventana de alimentacion ideal es 10-12h de ayuno nocturno. Cenar a las 20h y desayunar a las 8h ya son 12h de ayuno natural sin esfuerzo ni restricciones.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '150g lentejas rojas — sin remojo necesario',
      '400ml leche de coco light',
      '300ml caldo de verduras',
      '1 cdta curcuma',
      '1 cdta comino molido',
      '1/2 cdta jengibre fresco rallado',
      '1 diente de ajo',
      '1/2 cebolla',
      '1 cda aceite de coco o ghee',
      'Sal marina y pimienta negra',
      'Cilantro fresco al servir',
      'Unas gotas de vinagre de kombucha o de manzana al final'
    ),
    'pasos', jsonb_build_array(
      'Sofrie la cebolla y el ajo en el aceite de coco a fuego medio, 5 minutos.',
      'Anade el jengibre, el comino y la curcuma. Remueve 1 minuto hasta que liberen el aroma.',
      'Incorpora las lentejas rojas. Mezcla bien con las especias.',
      'Vierte el caldo y la leche de coco. Lleva a ebullicion y reduce a fuego suave.',
      'Cocina 15-18 minutos hasta que las lentejas se deshagan completamente.',
      'Tritura parcialmente con batidora de mano si quieres textura mas suave.',
      'Sirve con cilantro fresco y unas gotas de vinagre de kombucha o de manzana.',
      'Come antes de las 20h. Esa decision es parte de la receta.'
    ),
    'nutricion', jsonb_build_object('calorias', 380, 'proteinas', 14, 'carbohidratos', 46, 'grasas', 16),
    'beneficio_sueno', 'El timing de la cena sincroniza los relojes perifericos hepaticos con el SCN. Las lentejas rojas aportan triptofano + carbohidrato complejo — la combinacion insulinica que abre la barrera hematoencefalica al triptofano. Cenar esto a las 19:30h puede cambiar la calidad del sueno mas que cualquier suplemento.',
    'tiempo_min', 25,
    'momento', '19-20h — la hora es parte de la receta',
    'pilar', 'cronobiologia_nutricional'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 24,
  'Bol de semillas tostadas con aguacate, huevo y vinagreta de miso',
  'Las semillas de calabaza deben tostarse sin aceite ni sal — el calor seco activa las enzimas lipoliticas que mejoran la biodisponibilidad del CoQ10.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '3 cdas semillas de calabaza crudas',
      '2 cdas semillas de girasol',
      '1 cda semillas de sesamo negro',
      '1 aguacate maduro',
      '2 huevos ecologicos — cocidos 7 minutos, yema cremosa',
      '1 punado de espinacas baby o rucula',
      'Vinagreta: 1 cdta miso blanco + 1 cda vinagre de kombucha o de manzana + 1 cda aceite de sesamo + 1 cdta miel cruda + 1 cdta jengibre rallado'
    ),
    'pasos', jsonb_build_array(
      'Tuesta las semillas de calabaza y girasol en sarten seca a fuego medio, 3-4 minutos, removiendo constantemente hasta que empiecen a saltar. Reserva.',
      'Cuece los huevos 7 minutos desde agua hirviendo. Enfria en agua con hielo. Pela y corta por la mitad.',
      'Lamina el aguacate.',
      'Prepara la vinagreta: disuelve el miso en el vinagre de kombucha o de manzana con unas gotas de agua tibia. Anade el aceite de sesamo, la miel y el jengibre. Mezcla bien.',
      'Monta el bol: espinacas de base, aguacate, huevos, semillas tostadas y sesamo negro.',
      'Vierte la vinagreta generosamente.',
      'Come lentamente — las semillas tostadas crujientes activan la secrecion de saliva y enzimas digestivas.'
    ),
    'nutricion', jsonb_build_object('calorias', 450, 'proteinas', 22, 'carbohidratos', 14, 'grasas', 36),
    'beneficio_sueno', 'CoQ10 vegetal de semillas de calabaza alimenta la cadena de transporte electronico mitocondrial durante el NREM3. El aceite de sesamo contiene sesamina que inhibe la degradacion del CoQ10 en el higado — dura mas tiempo activo. La yema de huevo cremosa aporta colina y lecitina que mejoran la permeabilidad mitocondrial.',
    'tiempo_min', 15,
    'momento', 'Cena ligera — hasta 2h antes de dormir',
    'pilar', 'mitocondrias_nrem3'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 25,
  'Salmon lacado con miso, jengibre y arroz negro',
  'El arroz negro necesita remojo de 2h minimo antes de cocer para reducir el tiempo de coccion a 25 min. Prepararlo por la tarde antes de cenar.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '200g salmon fresco — lomo con piel',
      '80g arroz negro Venere o arroz integral',
      'Lacado: 1 cda miso blanco + 1 cdta miel cruda + 1 cdta jengibre rallado + 1 cdta vinagre de kombucha o de manzana + 1/2 cdta aceite de sesamo',
      '1 punado de edamame cocido',
      '1/2 pepino en laminas finas',
      'Sesamo negro y blanco mezclado',
      'Cebolleta picada',
      'Unas gotas de vinagre de kombucha o de manzana al servir'
    ),
    'pasos', jsonb_build_array(
      'Cuece el arroz negro segun instrucciones — remojo previo de 2h reduce el tiempo a 25 min.',
      'Mezcla todos los ingredientes del lacado en un bol pequeno hasta obtener una pasta.',
      'Unta el lacado sobre la piel del salmon generosamente. Deja marinar 10 minutos.',
      'Cocina el salmon en sarten antiadherente caliente: 3 min por el lado de la piel, 2 min por el lado de la carne. Debe quedar rosado en el centro.',
      'Monta el plato: arroz negro de base, salmon encima, edamame y pepino a los lados.',
      'Esparce sesamo y cebolleta. Unas gotas de vinagre de kombucha o de manzana al final.',
      'El lacado de miso carameliza ligeramente con el calor — ese punto dorado es la reaccion de Maillard activando el umami profundo.'
    ),
    'nutricion', jsonb_build_object('calorias', 520, 'proteinas', 38, 'carbohidratos', 48, 'grasas', 16),
    'beneficio_sueno', 'Antocianinas del arroz negro son prebioticos selectivos de Lactobacillus y Bifidobacterium — directamente implicados en la produccion de serotonina intestinal. El DHA del salmon mejora la fluidez de las membranas de las celulas enterocromafines. El miso fermentado completa el ciclo probiotico. Esta cena es el resumen bioquimico de 25 dias en un plato.',
    'tiempo_min', 20,
    'momento', 'Cena — 19:30-20:30h',
    'pilar', 'serotonina_intestinal_melatonina'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 26,
  'Bol de kefir, chucrut, pepino y aceite de oliva con semillas',
  'El lino debe consumirse molido, nunca entero — el lino entero pasa por el intestino sin digerirse. Molido en el momento libera los lignanos y el ALA para el microbioma.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '150g kefir natural sin azucar',
      '2 cdas chucrut crudo sin pasteurizar — no el de lata de supermercado',
      '1/2 pepino en rodajas finas',
      '1 cda aceite de oliva virgen extra — denominacion de origen si es posible',
      '1 cdta semillas de lino dorado molido',
      '1 cdta semillas de canamo',
      'Eneldo fresco o seco',
      'Sal marina en escamas',
      'Pimienta negra'
    ),
    'pasos', jsonb_build_array(
      'Vierte el kefir en bol ancho.',
      'Anade el chucrut directamente — no lo laves ni lo calientes, las bacterias vivas deben llegar intactas.',
      'Coloca las rodajas de pepino alrededor.',
      'Esparce las semillas de lino molido y las de canamo.',
      'Vierte el aceite de oliva en hilo fino por encima.',
      'Decora con eneldo, sal en escamas y pimienta negra.',
      'Come lentamente. La combinacion acida del kefir + chucrut + eneldo activa los receptores del vago en minutos — notaras una ligera sensacion de calma abdominal antes de terminar el bol.'
    ),
    'nutricion', jsonb_build_object('calorias', 220, 'proteinas', 10, 'carbohidratos', 14, 'grasas', 15),
    'beneficio_sueno', 'Kefir + chucrut crudo vivo = sinergia fermentada que estimula directamente los receptores 5-HT del nervio vago en el colon. Oleocantal del aceite de oliva activa la secrecion de CCK en el duodeno — sensacion de calma vagal antes de terminar el bol. HRV mejora con el tono vagal elevado.',
    'tiempo_min', 5,
    'momento', 'Cena muy ligera o snack nocturno — 21h maximo',
    'pilar', 'tono_vagal_hrv'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 27,
  'Ensalada de arandanos, moras, cebolla roja y nueces con vinagreta de resveratrol',
  'Congela arandanos y moras cuando esten en temporada. La congelacion rompe las paredes celulares y aumenta la biodisponibilidad de antocianinas y pterostilbeno hasta un 15% respecto a la fruta fresca.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '80g arandanos frescos o congelados',
      '80g moras frescas o frambuesas',
      '1/2 cebolla roja en juliana muy fina',
      '30g nueces crudas — no tostadas con sal',
      '1 manzana pequena con piel en cubos',
      '1 punado de rucula o berros',
      'Vinagreta: 2 cdas vinagre de kombucha o de manzana + 1 cda aceite de oliva virgen extra + 1 cdta miel cruda + 1/2 cdta canela + ralladura de limon'
    ),
    'pasos', jsonb_build_array(
      'Prepara la vinagreta mezclando el vinagre de kombucha o de manzana con el aceite, la miel, la canela y la ralladura de limon. Emulsiona con tenedor.',
      'En bol grande, coloca la rucula de base.',
      'Anade los arandanos, las moras y la manzana en cubos.',
      'Coloca la cebolla roja en juliana encima — su quercetina se libera mejor en contacto con el acido de la vinagreta.',
      'Distribuye las nueces rotas con las manos.',
      'Vierte la vinagreta. Mezcla suavemente.',
      'Sirve inmediatamente — los polifenoles de las bayas se oxidan con el tiempo.'
    ),
    'nutricion', jsonb_build_object('calorias', 290, 'proteinas', 6, 'carbohidratos', 32, 'grasas', 16),
    'beneficio_sueno', 'El pterostilbeno de arandanos y moras cruza la barrera hematoencefalica directamente. Tomado 2-3h antes de dormir alcanza el tejido cerebral durante la primera fase de NREM3 cuando el sistema glinfartico esta en maxima actividad. La quercetina de la cebolla roja cruda en vinagre libera 3 veces mas que cocinada.',
    'tiempo_min', 10,
    'momento', 'Cena ligera o postre de la cena — antes de las 21h',
    'pilar', 'sistema_glinfartico_polifenoles',
    'aviso', 'Para maxima biodisponibilidad: compra bayas en temporada, congelalas, y descongelalas 30 minutos antes de comer. La congelacion y descongelacion rompe las paredes celulares y libera mas pterostilbeno.'
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 28,
  'El gran bol de los 28 dias — receta integradora final',
  'A partir de manana conserva tres habitos: cenar antes de las 20:30h, incluir un fermentado al dia, y mantener el magnesio y el zinc como base mineral. El resto ya esta instalado en tu microbioma.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array(
      '--- BASE S1 minerales ---',
      '80g arroz integral cocido con 1 pizca de sal marina',
      '1 cda semillas de calabaza tostadas',
      '--- PROTEINA S2 sintesis hormonal ---',
      '150g salmon al horno con curcuma y pimienta negra',
      '1 huevo ecologico pochado',
      '--- MICROBIOMA S3 fermentados ---',
      '1 cda miso rojo disuelto en 80ml agua caliente — como caldo corto',
      '1 cda chucrut crudo sin pasteurizar',
      '1 cdta ghee',
      '--- POLIFENOLES S4 glinfartico ---',
      '60g arandanos frescos',
      '1/4 aguacate laminado',
      '--- ALINO ---',
      '2 cdas vinagre de kombucha o de manzana',
      '1 cda aceite de oliva virgen extra',
      'Ralladura de limon, sesamo negro, cebolleta fresca, perejil y eneldo'
    ),
    'pasos', jsonb_build_array(
      'Calienta el arroz integral con el ghee en olla pequena. Ponlo en la base de un bol amplio.',
      'Vierte el caldo de miso caliente sobre el arroz.',
      'Coloca el salmon desmenuzado a un lado. El aguacate al otro. El chucrut en un extremo.',
      'Coloca el huevo pochado en el centro del bol.',
      'Distribuye los arandanos y las semillas de calabaza por encima.',
      'Mezcla el vinagre de kombucha o de manzana con el aceite de oliva y la ralladura de limon. Alina generosamente.',
      'Termina con sesamo negro, cebolleta, perejil y eneldo.',
      'Antes de comer: mira el bol un momento. Cada ingrediente tiene una historia bioquimica que aprendiste durante este mes.',
      'Come despacio. Sin pantallas. Con las manos alrededor del bol si esta caliente.',
      'Esta noche dormiras bien. Lo has ganado.'
    ),
    'nutricion', jsonb_build_object('calorias', 580, 'proteinas', 36, 'carbohidratos', 52, 'grasas', 26),
    'beneficio_sueno', '28 dias construyendo el eje intestino-cerebro: S1 minerales → S2 sintesis hormonal → S3 microbioma y barrera intestinal → S4 sistema nervioso autonomo, cronobiologia y limpieza glinfatica. Cada ingrediente representa una semana. Come con atencion plena. Esta noche dormiras bien. Lo has ganado.',
    'tiempo_min', 30,
    'momento', 'Cena de celebracion — dia 28, antes de las 20:30h',
    'pilar', 'cierre_reto_28_dias',
    'semana', 4,
    'hito', jsonb_build_object(
      'dia', 28,
      'titulo', 'Reto de 28 dias completado',
      'mensaje_app', 'Lo has conseguido. 28 dias construyendo la bioquimica del sueno desde el intestino. Tu microbioma es mas diverso. Tu barrera intestinal esta sellada. Tu sistema glinfartico limpia el cerebro cada noche. Tu curva de cortisol es mas limpia.',
      'submensaje', 'Semana 1: minerales. Semana 2: sintesis hormonal. Semana 3: microbioma y barrera. Semana 4: sistema nervioso + cronobiologia + limpieza cerebral.',
      'estadisticas', jsonb_build_object(
        'dias_completados', 28,
        'recetas_preparadas', 28,
        'mecanismos_aprendidos', 28,
        'semanas', 4
      ),
      'cta_primario', 'Ver mi resumen de 28 dias',
      'cta_secundario', 'Compartir mi logro'
    )
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
