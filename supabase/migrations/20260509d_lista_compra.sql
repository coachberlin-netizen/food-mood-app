-- Columna lista_compra en challenges
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS lista_compra jsonb;

-- ── Slow Food·Mood — lista completa 21 días ───────────────────────────────────
UPDATE public.challenges
SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Fermentos y cultivos vivos',
    'items', jsonb_build_array(
      'Yogur natural sin azúcar con cultivos vivos (para inóculo)',
      'Kéfir natural',
      'Miso de cebada o de arroz — no pasteurizado',
      'Vinagre de manzana con la madre (botella con sedimento)',
      'Sal marina sin refinar (500g)'
    )),

  jsonb_build_object('categoria', 'Algas y despensa japonesa',
    'items', jsonb_build_array(
      'Alga kombu seca (20-30g)',
      'Alga wakame seca (10g)',
      'Setas shiitake secas (20g)',
      'Salsa de soja o tamari (sin gluten si lo necesitas)'
    )),

  jsonb_build_object('categoria', 'Verduras y frutas',
    'items', jsonb_build_array(
      'Pepinos (4-5 medianos)',
      'Repollo blanco (1 kg — para el chucrut)',
      'Col napa o pak choi (1 mediana — para el kimchi)',
      'Zanahorias (6)',
      'Rábanos (1 manojo)',
      'Tomates maduros (800g) o 2 latas de tomate entero pelado',
      'Cebolla (3)',
      'Cebolletas (1 manojo)',
      'Ajo (2 cabezas)',
      'Jengibre fresco (1 trozo grande — 200g)',
      'Limones (8)',
      'Frutos rojos frescos o congelados (arándanos, frambuesas — 300g)',
      'Espárragos verdes (opcional, semana 1)',
      'Apio (1 tallo)',
      'Hojas verdes mixtas (espinacas, rúcula, canónigos)'
    )),

  jsonb_build_object('categoria', 'Proteínas',
    'items', jsonb_build_array(
      'Contramuslos o muslos de pollo (4 piezas — para el marinado)',
      'Huesos de pollo o ternera (1-1,5 kg — para el caldo largo)',
      'Tofu firme (200g)',
      'Huevos (6)',
      'Salmón fresco (150g — opcional, semana 3)'
    )),

  jsonb_build_object('categoria', 'Granos, harinas y legumbres',
    'items', jsonb_build_array(
      'Harina de espelta integral (500g)',
      'Harina de fuerza (500g — para el pan de masa madre)',
      'Levadura seca de panadero (1 sobre)',
      'Arroz de grano corto o jasmine (300g)',
      'Garbanzos secos (300g)',
      'Copos de avena — no instantánea (250g)'
    )),

  jsonb_build_object('categoria', 'Lácteos y bebidas vegetales',
    'items', jsonb_build_array(
      'Leche entera fresca o pasteurizada — no UHT (1 litro, para el yogur)',
      'Leche de avena (500ml)'
    )),

  jsonb_build_object('categoria', 'Despensa y frutos secos',
    'items', jsonb_build_array(
      'Aceite de oliva virgen extra (1 botella grande)',
      'Aceite de sésamo tostado (pequeño)',
      'Tahini — pasta de sésamo (200g)',
      'Miel cruda (1 tarro)',
      'Semillas de sésamo tostadas',
      'Semillas de chía (100g)',
      'Semillas de lino molidas (100g)',
      'Nueces (150g)',
      'Semillas de mostaza',
      'Semillas de alcaravea (opcional — para el chucrut)',
      'Azúcar de caña o panela (pequeña cantidad)',
      'Bicarbonato sódico (para el remojo de garbanzos)'
    )),

  jsonb_build_object('categoria', 'Especias y condimentos',
    'items', jsonb_build_array(
      'Cúrcuma en polvo',
      'Jengibre en polvo',
      'Pimienta negra recién molida',
      'Comino en polvo',
      'Orégano seco',
      'Canela en polvo',
      'Pimentón dulce ahumado (o gochugaru si te gusta el picante)',
      'Mostaza de Dijon',
      'Cardamomo (opcional)',
      'Eneldo seco o fresco',
      'Hojas de laurel',
      'Menta fresca (1 manojo)'
    )),

  jsonb_build_object('categoria', 'Utensilios necesarios',
    'items', jsonb_build_array(
      'Tarros de cristal de 1 litro con tapa (mínimo 4)',
      'Termómetro de cocina (muy recomendado para el yogur)',
      'Cazuela de hierro o de barro (para el pan)',
      'Olla grande (para el caldo largo)'
    ))

)
WHERE slug = 'slow-food-mood';

-- ── Otros retos — listas pendientes de completar ──────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(
  jsonb_build_object('categoria', 'Próximamente', 'items', jsonb_build_array('La lista de la compra de este reto estará disponible muy pronto.'))
)
WHERE slug IN ('mejora-tu-sueno', 'recupera-tu-energia', 'reset-antiinflamatorio', 'equilibrio-hormonal-45', 'food-mood-reset')
  AND lista_compra IS NULL;
