-- ── Añadir columna recipe_data a challenge_days ─────────────────────────────
ALTER TABLE public.challenge_days
  ADD COLUMN IF NOT EXISTS recipe_data jsonb;

-- ── Semana 1 — Reto "Mejora tu sueño" (días 1-7) ─────────────────────────────
-- Usa (SELECT id FROM challenges WHERE slug = 'mejora-tu-sueno') para no hardcodear UUID

INSERT INTO public.challenge_days
  (challenge_id, day_number, title, tip, recipe_data)
SELECT
  c.id,
  days.day_number,
  days.title,
  days.tip,
  days.recipe_data::jsonb
FROM public.challenges c
CROSS JOIN (VALUES

  (1,
   'Arroz con leche de avena y semillas de calabaza',
   'Las semillas de calabaza son la fuente más concentrada de magnesio. Cómelas 2h antes de dormir.',
   '{"ingredientes":["200ml leche de avena","80g arroz de grano corto","2 cdas semillas de calabaza","1 cda miel cruda","canela al gusto","pizca de sal"],"pasos":["Cocina el arroz con la leche de avena a fuego suave 20 min removiendo.","Añade la miel y la sal. Remueve.","Sirve tibio con semillas de calabaza y canela."],"nutricion":{"calorias":320,"proteinas":8,"carbohidratos":52,"grasas":9},"beneficio_sueno":"Magnesio + triptófano → serotonina → melatonina. El combo perfecto para el primer día de reset.","tiempo_min":25}'
  ),

  (2,
   'Kéfir con plátano, miel y nueces',
   'El kéfir alimenta el eje intestino-cerebro. Tu barriga produce el 90% de la serotonina de tu cuerpo.',
   '{"ingredientes":["250ml kéfir natural","1 plátano maduro","4-5 nueces","1 cda miel","1 pizca de cardamomo"],"pasos":["Trocea el plátano.","Mezcla en un bol el kéfir, el plátano y la miel.","Añade las nueces rotas y el cardamomo."],"nutricion":{"calorias":290,"proteinas":10,"carbohidratos":42,"grasas":10},"beneficio_sueno":"Probióticos + triptófano del plátano + omega-3 de las nueces. Tu intestino descansa mejor cuando está bien alimentado.","tiempo_min":5}'
  ),

  (3,
   'Crema de boniato con cúrcuma y jengibre',
   'El boniato es rico en vitamina B6, necesaria para convertir el triptófano en serotonina.',
   '{"ingredientes":["2 boniatos medianos","1 cdta cúrcuma en polvo","1 trozo jengibre fresco (2cm)","400ml caldo de verduras","1 cda aceite de oliva virgen extra","pimienta negra","sal"],"pasos":["Pela y trocea los boniatos.","Sofríe el jengibre rallado 2 min con el aceite.","Añade los boniatos, la cúrcuma y el caldo. Cocina 20 min.","Tritura hasta conseguir una crema suave. Añade pimienta y sal."],"nutricion":{"calorias":280,"proteinas":4,"carbohidratos":56,"grasas":7},"beneficio_sueno":"La cúrcuma reduce la inflamación que interrumpe el sueño profundo. La pimienta negra multiplica su absorción x20.","tiempo_min":30}'
  ),

  (4,
   'Salmón al vapor con espárragos y quinoa',
   'Mitad del reto: el magnesio del salmón y los espárragos mejoran la calidad del sueño REM.',
   '{"ingredientes":["150g salmón fresco","80g quinoa seca","8-10 espárragos verdes","1 limón","eneldo fresco","aceite de oliva","sal"],"pasos":["Cocina la quinoa según instrucciones (aprox 15 min).","Cocina el salmón al vapor 10-12 min.","Asa los espárragos en sartén con aceite 5 min.","Sirve con limón y eneldo."],"nutricion":{"calorias":440,"proteinas":38,"carbohidratos":35,"grasas":16},"beneficio_sueno":"Omega-3 del salmón + magnesio de los espárragos + proteína completa de la quinoa. Combo para el sueño profundo.","tiempo_min":25}'
  ),

  (5,
   'Sopa de miso con tofu, algas y sésamo',
   'El miso es un fermentado vivo que nutre la microbiota. Las algas aportan minerales que calman el sistema nervioso.',
   '{"ingredientes":["1 litro agua","2 cdas pasta de miso blanco","150g tofu firme","1 puñado algas wakame (hidratadas)","2 cdas salsa de soja baja en sal","1 cda semillas de sésamo","1 cebolleta"],"pasos":["Calienta el agua sin que hierva (80°C max).","Disuelve el miso en un poco de agua fría y añade a la olla.","Añade el tofu en cubos, las algas y la soja.","Sirve con sésamo y cebolleta picada."],"nutricion":{"calorias":220,"proteinas":16,"carbohidratos":14,"grasas":10},"beneficio_sueno":"Fermentado vivo + minerales marinos + isoflavonas del tofu. Una cena caliente que prepara el cuerpo para el descanso.","tiempo_min":15}'
  ),

  (6,
   'Batido de cereza, kéfir y avena',
   'Las cerezas son la fruta con mayor contenido natural de melatonina. Mejor a partir de las 19h.',
   '{"ingredientes":["200g cerezas (o congeladas)","200ml kéfir","3 cdas copos de avena","1 cdta miel","1 pizca de vainilla"],"pasos":["Si son congeladas, descongela las cerezas 10 min.","Tritura todos los ingredientes juntos.","Sirve frío, sin hielo extra."],"nutricion":{"calorias":270,"proteinas":9,"carbohidratos":46,"grasas":5},"beneficio_sueno":"Melatonina natural de la cereza + probióticos del kéfir + betaglucanos de la avena. Tu cuerpo empieza a prepararse para dormir.","tiempo_min":5}'
  ),

  (7,
   'Tortilla de espinacas con semillas de girasol y queso fresco',
   '¡Primera semana completada! Las espinacas y las semillas de girasol son las fuentes de magnesio más biodisponibles.',
   '{"ingredientes":["3 huevos camperos","100g espinacas frescas","2 cdas semillas de girasol","50g queso fresco","aceite de oliva","sal","pimienta"],"pasos":["Saltea las espinacas 2 min con un poco de aceite.","Bate los huevos con sal y pimienta.","Vierte los huevos sobre las espinacas en sartén a fuego medio.","Añade el queso fresco y las semillas antes de doblar."],"nutricion":{"calorias":380,"proteinas":26,"carbohidratos":6,"grasas":28},"beneficio_sueno":"Triptófano del huevo + magnesio de espinacas y semillas + calcio del queso. La trinidad del sueño profundo.","tiempo_min":12}'
  )

) AS days(day_number, title, tip, recipe_data)
WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title       = EXCLUDED.title,
      tip         = EXCLUDED.tip,
      recipe_data = EXCLUDED.recipe_data;
