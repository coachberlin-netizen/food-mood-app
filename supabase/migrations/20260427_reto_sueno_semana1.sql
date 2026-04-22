-- ── Añadir columna recipe_data ────────────────────────────────────────────────
ALTER TABLE public.challenge_days
  ADD COLUMN IF NOT EXISTS recipe_data jsonb;

-- ── Tabla push_subscriptions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint   text NOT NULL,
  p256dh     text,
  auth       text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "push_sub_select_own" ON public.push_subscriptions;
CREATE POLICY "push_sub_select_own" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "push_sub_insert_own" ON public.push_subscriptions;
CREATE POLICY "push_sub_insert_own" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "push_sub_delete_own" ON public.push_subscriptions;
CREATE POLICY "push_sub_delete_own" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- ── Días 1-7 — Reto sueño ─────────────────────────────────────────────────────

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 1,
  'Arroz con leche de avena y semillas de calabaza',
  'Las semillas de calabaza son la fuente mas concentrada de magnesio. Comelas 2h antes de dormir.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('200ml leche de avena','80g arroz de grano corto','2 cdas semillas de calabaza','1 cda miel cruda','canela al gusto','pizca de sal'),
    'pasos', jsonb_build_array('Cocina el arroz con la leche de avena a fuego suave 20 min removiendo.','Añade la miel y la sal. Remueve.','Sirve tibio con semillas de calabaza y canela.'),
    'nutricion', jsonb_build_object('calorias',320,'proteinas',8,'carbohidratos',52,'grasas',9),
    'beneficio_sueno', 'Magnesio + triptofano hacia serotonina y melatonina. El combo perfecto para el primer dia de reset.',
    'tiempo_min', 25
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 2,
  'Kefir con platano, miel y nueces',
  'El kefir alimenta el eje intestino-cerebro. Tu barriga produce el 90% de la serotonina de tu cuerpo.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('250ml kefir natural','1 platano maduro','4-5 nueces','1 cda miel','1 pizca de cardamomo'),
    'pasos', jsonb_build_array('Trocea el platano.','Mezcla en un bol el kefir, el platano y la miel.','Añade las nueces rotas y el cardamomo.'),
    'nutricion', jsonb_build_object('calorias',290,'proteinas',10,'carbohidratos',42,'grasas',10),
    'beneficio_sueno', 'Probioticos + triptofano del platano + omega-3 de las nueces. Tu intestino descansa mejor cuando esta bien alimentado.',
    'tiempo_min', 5
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 3,
  'Crema de boniato con curcuma y jengibre',
  'El boniato es rico en vitamina B6, necesaria para convertir el triptofano en serotonina.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('2 boniatos medianos','1 cdta curcuma en polvo','1 trozo jengibre fresco (2cm)','400ml caldo de verduras','1 cda aceite de oliva virgen extra','pimienta negra','sal'),
    'pasos', jsonb_build_array('Pela y trocea los boniatos.','Sofrie el jengibre rallado 2 min con el aceite.','Añade los boniatos, la curcuma y el caldo. Cocina 20 min.','Tritura hasta conseguir una crema suave. Añade pimienta y sal.'),
    'nutricion', jsonb_build_object('calorias',280,'proteinas',4,'carbohidratos',56,'grasas',7),
    'beneficio_sueno', 'La curcuma reduce la inflamacion que interrumpe el sueno profundo. La pimienta negra multiplica su absorcion x20.',
    'tiempo_min', 30
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 4,
  'Salmon al vapor con esparragos y quinoa',
  'Mitad del reto: el magnesio del salmon y los esparragos mejoran la calidad del sueno REM.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('150g salmon fresco','80g quinoa seca','8-10 esparragos verdes','1 limon','eneldo fresco','aceite de oliva','sal'),
    'pasos', jsonb_build_array('Cocina la quinoa segun instrucciones (aprox 15 min).','Cocina el salmon al vapor 10-12 min.','Asa los esparragos en sarten con aceite 5 min.','Sirve con limon y eneldo.'),
    'nutricion', jsonb_build_object('calorias',440,'proteinas',38,'carbohidratos',35,'grasas',16),
    'beneficio_sueno', 'Omega-3 del salmon + magnesio de los esparragos + proteina completa de la quinoa. Combo para el sueno profundo.',
    'tiempo_min', 25
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 5,
  'Sopa de miso con tofu, algas y sesamo',
  'El miso es un fermentado vivo que nutre la microbiota. Las algas aportan minerales que calman el sistema nervioso.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('1 litro agua','2 cdas pasta de miso blanco','150g tofu firme','1 punado algas wakame hidratadas','2 cdas salsa de soja baja en sal','1 cda semillas de sesamo','1 cebolleta'),
    'pasos', jsonb_build_array('Calienta el agua sin que hierva (80 grados max).','Disuelve el miso en un poco de agua fria y añade a la olla.','Añade el tofu en cubos, las algas y la soja.','Sirve con sesamo y cebolleta picada.'),
    'nutricion', jsonb_build_object('calorias',220,'proteinas',16,'carbohidratos',14,'grasas',10),
    'beneficio_sueno', 'Fermentado vivo + minerales marinos + isoflavonas del tofu. Una cena caliente que prepara el cuerpo para el descanso.',
    'tiempo_min', 15
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 6,
  'Batido de cereza, kefir y avena',
  'Las cerezas son la fruta con mayor contenido natural de melatonina. Mejor a partir de las 19h.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('200g cerezas (o congeladas)','200ml kefir','3 cdas copos de avena','1 cdta miel','1 pizca de vainilla'),
    'pasos', jsonb_build_array('Si son congeladas, descongela las cerezas 10 min.','Tritura todos los ingredientes juntos.','Sirve frio, sin hielo extra.'),
    'nutricion', jsonb_build_object('calorias',270,'proteinas',9,'carbohidratos',46,'grasas',5),
    'beneficio_sueno', 'Melatonina natural de la cereza + probioticos del kefir + betaglucanos de la avena. Tu cuerpo empieza a prepararse para dormir.',
    'tiempo_min', 5
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;

INSERT INTO public.challenge_days (challenge_id, day_number, title, tip, recipe_data)
SELECT c.id, 7,
  'Tortilla de espinacas con semillas de girasol y queso fresco',
  'Primera semana completada. Espinacas y semillas de girasol son las fuentes de magnesio mas biodisponibles.',
  jsonb_build_object(
    'ingredientes', jsonb_build_array('3 huevos camperos','100g espinacas frescas','2 cdas semillas de girasol','50g queso fresco','aceite de oliva','sal','pimienta'),
    'pasos', jsonb_build_array('Saltea las espinacas 2 min con un poco de aceite.','Bate los huevos con sal y pimienta.','Vierte los huevos sobre las espinacas en sarten a fuego medio.','Añade el queso fresco y las semillas antes de doblar.'),
    'nutricion', jsonb_build_object('calorias',380,'proteinas',26,'carbohidratos',6,'grasas',28),
    'beneficio_sueno', 'Triptofano del huevo + magnesio de espinacas y semillas + calcio del queso. La trinidad del sueno profundo.',
    'tiempo_min', 12
  )
FROM public.challenges c WHERE c.slug = 'mejora-tu-sueno'
ON CONFLICT (challenge_id, day_number) DO UPDATE
  SET title = EXCLUDED.title, tip = EXCLUDED.tip, recipe_data = EXCLUDED.recipe_data;
