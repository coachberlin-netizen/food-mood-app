-- ══════════════════════════════════════════════════════════════════════════════
-- Listas de la compra — resto de retos
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Mejora tu sueño (28 días) ─────────────────────────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Lácteos y fermentados',
    'items', jsonb_build_array(
      'Kéfir natural (1 litro)',
      'Yogur natural sin azúcar con cultivos vivos',
      'Leche entera (para recetas calientes nocturnas)',
      'Leche de avena o de almendra'
    )),

  jsonb_build_object('categoria', 'Verduras y tubérculos',
    'items', jsonb_build_array(
      'Boniatos (4-5 medianos)',
      'Espárragos verdes (2 manojos)',
      'Espinacas frescas (400g)',
      'Champiñones y setas variadas (500g)',
      'Brócoli (2 cabezas)',
      'Zanahorias (6)',
      'Apio (1 tallo)',
      'Cebolla (4)',
      'Ajo (1 cabeza)'
    )),

  jsonb_build_object('categoria', 'Frutas',
    'items', jsonb_build_array(
      'Plátanos maduros (6-8)',
      'Cerezas o arándanos (para el triptófano)',
      'Kiwi (6 — rico en serotonina)',
      'Uvas negras (500g)'
    )),

  jsonb_build_object('categoria', 'Proteínas',
    'items', jsonb_build_array(
      'Salmón fresco (4 filetes)',
      'Pechuga de pollo (500g)',
      'Huevos (12)',
      'Atún en conserva al natural (4 latas)'
    )),

  jsonb_build_object('categoria', 'Granos e hidratos de absorción lenta',
    'items', jsonb_build_array(
      'Arroz integral (500g)',
      'Arroz de grano corto (300g — para cremas nocturnas)',
      'Avena en copos (500g)',
      'Quinoa (300g)',
      'Pan de centeno o masa madre (o harina para hacerlo)'
    )),

  jsonb_build_object('categoria', 'Frutos secos y semillas',
    'items', jsonb_build_array(
      'Nueces (200g — fuente de melatonina)',
      'Semillas de calabaza (200g — la fuente más concentrada de magnesio)',
      'Semillas de sésamo (100g)',
      'Almendras crudas (150g)',
      'Semillas de lino molidas (100g)'
    )),

  jsonb_build_object('categoria', 'Especias y suplementos de cocina',
    'items', jsonb_build_array(
      'Cúrcuma en polvo',
      'Canela en polvo',
      'Nuez moscada (el clásico inductor del sueño)',
      'Pimienta negra',
      'Jengibre en polvo',
      'Ashwagandha en polvo (opcional — para la leche dorada)',
      'Miel cruda'
    )),

  jsonb_build_object('categoria', 'Infusiones nocturnas',
    'items', jsonb_build_array(
      'Valeriana (en bolsitas o a granel)',
      'Pasiflora',
      'Manzanilla',
      'Melisa o toronjil',
      'Lavanda (para infusión suave)'
    )),

  jsonb_build_object('categoria', 'Despensa',
    'items', jsonb_build_array(
      'Aceite de oliva virgen extra',
      'Cacao puro en polvo sin azúcar (rico en magnesio)',
      'Chocolate negro 85% (2 tabletas)',
      'Tahini — pasta de sésamo'
    ))

) WHERE slug = 'mejora-tu-sueno';


-- ── Recupera tu energía en 7 días ─────────────────────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Verduras y raíces energizantes',
    'items', jsonb_build_array(
      'Remolacha fresca (4 — para el smoothie)',
      'Espinacas frescas (400g)',
      'Brócoli (2 cabezas)',
      'Edamame congelado (500g)',
      'Zanahorias (6)',
      'Pepino (3)',
      'Aguacate (4)',
      'Cebolla morada (2)'
    )),

  jsonb_build_object('categoria', 'Frutas',
    'items', jsonb_build_array(
      'Plátanos (6)',
      'Mango (2 — o congelado)',
      'Naranja y limón (6 de cada)',
      'Manzana verde (4)',
      'Frutos rojos congelados (400g)'
    )),

  jsonb_build_object('categoria', 'Proteínas',
    'items', jsonb_build_array(
      'Salmón fresco (2 filetes)',
      'Huevos (12)',
      'Pollo o pavo (400g)',
      'Sardinas en conserva al natural (4 latas)',
      'Tofu firme (200g)'
    )),

  jsonb_build_object('categoria', 'Granos y legumbres',
    'items', jsonb_build_array(
      'Quinoa (300g)',
      'Lentejas rojas (300g — cocción rápida)',
      'Arroz integral (300g)',
      'Garbanzos cocidos en conserva (2 botes)'
    )),

  jsonb_build_object('categoria', 'Algas y fermentados',
    'items', jsonb_build_array(
      'Alga wakame seca (10g)',
      'Miso blanco o de arroz',
      'Vinagre de manzana con la madre'
    )),

  jsonb_build_object('categoria', 'Frutos secos y semillas',
    'items', jsonb_build_array(
      'Edamame (también en la sección de verduras)',
      'Semillas de sésamo (100g)',
      'Nueces y almendras (150g mezcladas)',
      'Semillas de chía (100g)'
    )),

  jsonb_build_object('categoria', 'Especias y despensa',
    'items', jsonb_build_array(
      'Jengibre fresco (1 trozo grande)',
      'Cúrcuma en polvo',
      'Pimienta negra',
      'Aceite de oliva virgen extra',
      'Aceite de sésamo tostado',
      'Salsa de soja o tamari',
      'Miel cruda',
      'Canela en polvo'
    )),

  jsonb_build_object('categoria', 'Bebidas',
    'items', jsonb_build_array(
      'Té verde (en hojas o bolsitas de calidad)',
      'Matcha en polvo (opcional)',
      'Agua de coco (sin azúcar añadida)',
      'Kombucha natural (sin pasteurizar)'
    ))

) WHERE slug = 'recupera-tu-energia';


-- ── Reset antiinflamatorio (7 días) ───────────────────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Verduras antiinflamatorias',
    'items', jsonb_build_array(
      'Brócoli (3 cabezas — el más antiinflamatorio)',
      'Coles de Bruselas (400g)',
      'Coliflor (1 cabeza)',
      'Espinacas frescas (500g)',
      'Rúcula (200g)',
      'Pepino (4)',
      'Apio (2 tallos)',
      'Cebolla morada (3)',
      'Ajo (2 cabezas)',
      'Jengibre fresco (200g)',
      'Cúrcuma fresca (si la encuentras — si no, en polvo)'
    )),

  jsonb_build_object('categoria', 'Frutas',
    'items', jsonb_build_array(
      'Arándanos (400g — frescos o congelados)',
      'Cerezas (400g — si es temporada)',
      'Granada (2)',
      'Piña natural (1)',
      'Limón (8)'
    )),

  jsonb_build_object('categoria', 'Proteínas omega-3',
    'items', jsonb_build_array(
      'Salmón fresco (4 filetes — fuente principal de omega-3)',
      'Caballa en conserva al natural (4 latas)',
      'Sardinas al natural (4 latas)',
      'Huevos camperos (12)',
      'Tofu firme (400g)'
    )),

  jsonb_build_object('categoria', 'Legumbres',
    'items', jsonb_build_array(
      'Lentejas rojas (300g)',
      'Garbanzos secos (300g)',
      'Alubias negras en conserva (2 botes)'
    )),

  jsonb_build_object('categoria', 'Granos integrales',
    'items', jsonb_build_array(
      'Arroz integral (400g)',
      'Quinoa (300g)',
      'Avena en copos (400g)',
      'Pan de centeno 100% (o masa madre)'
    )),

  jsonb_build_object('categoria', 'Frutos secos y semillas',
    'items', jsonb_build_array(
      'Nueces (300g — las más ricas en omega-3 vegetales)',
      'Semillas de lino molidas (150g)',
      'Semillas de chía (150g)',
      'Semillas de cáñamo (100g)',
      'Almendras crudas (150g)'
    )),

  jsonb_build_object('categoria', 'Especias clave',
    'items', jsonb_build_array(
      'Cúrcuma en polvo (el antiinflamatorio más estudiado)',
      'Pimienta negra recién molida (activa la cúrcuma x20)',
      'Jengibre en polvo',
      'Canela de Ceilán (no cassia)',
      'Romero seco',
      'Tomillo seco',
      'Clavo de olor'
    )),

  jsonb_build_object('categoria', 'Aceites y fermentados',
    'items', jsonb_build_array(
      'Aceite de oliva virgen extra (1 botella grande)',
      'Aceite de lino (en cápsulas o líquido — guardar en nevera)',
      'Vinagre de manzana con la madre',
      'Chucrut o kimchi sin pasteurizar (bote — o lo haces tú)',
      'Miso (1 tarro)'
    )),

  jsonb_build_object('categoria', 'Bebidas e infusiones',
    'items', jsonb_build_array(
      'Té verde de calidad',
      'Cúrcuma latte o golden milk (en polvo o hecho en casa)',
      'Agua mineral sin gas'
    ))

) WHERE slug = 'reset-antiinflamatorio';


-- ── Equilibrio hormonal (28 días) ─────────────────────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Semillas y fitoestrógenos',
    'items', jsonb_build_array(
      'Semillas de lino molidas (300g — el fitoestrógeno más potente)',
      'Semillas de sésamo (150g)',
      'Semillas de girasol (150g)',
      'Semillas de calabaza (150g)',
      'Semillas de chía (100g)'
    )),

  jsonb_build_object('categoria', 'Legumbres y soja fermentada',
    'items', jsonb_build_array(
      'Tempeh (400g — soja fermentada, fuente de fitoestrógenos biodisponibles)',
      'Edamame (500g)',
      'Lentejas (300g)',
      'Garbanzos secos (300g)',
      'Alubias negras (300g)'
    )),

  jsonb_build_object('categoria', 'Verduras crucíferas (detox hepático)',
    'items', jsonb_build_array(
      'Brócoli (4 cabezas)',
      'Coliflor (2 cabezas)',
      'Coles de Bruselas (500g)',
      'Col rizada o kale (400g)',
      'Rábanos (1 manojo)',
      'Rúcula (300g)'
    )),

  jsonb_build_object('categoria', 'Verduras y raíces',
    'items', jsonb_build_array(
      'Boniato (4)',
      'Zanahoria (8)',
      'Remolacha (4)',
      'Espinacas frescas (400g)',
      'Aguacate (6)',
      'Cebolla (4)',
      'Ajo (2 cabezas)',
      'Jengibre fresco (150g)'
    )),

  jsonb_build_object('categoria', 'Frutas',
    'items', jsonb_build_array(
      'Arándanos (400g)',
      'Frambuesas (300g)',
      'Granada (3 — rica en urolitinas)',
      'Manzana (6)',
      'Limón (8)'
    )),

  jsonb_build_object('categoria', 'Proteínas',
    'items', jsonb_build_array(
      'Salmón fresco (4 filetes)',
      'Huevos camperos (12)',
      'Pollo ecológico (400g)',
      'Sardinas al natural (4 latas)'
    )),

  jsonb_build_object('categoria', 'Fermentados y probióticos',
    'items', jsonb_build_array(
      'Yogur natural sin azúcar con cultivos vivos',
      'Kéfir natural',
      'Chucrut sin pasteurizar',
      'Miso de cebada (para sopas)',
      'Vinagre de manzana con la madre'
    )),

  jsonb_build_object('categoria', 'Algas y minerales',
    'items', jsonb_build_array(
      'Alga kombu (para caldos)',
      'Alga wakame (para sopas)',
      'Espirulina en polvo (opcional)'
    )),

  jsonb_build_object('categoria', 'Especias hormonales',
    'items', jsonb_build_array(
      'Cúrcuma en polvo',
      'Pimienta negra',
      'Canela de Ceilán',
      'Rooibos (infusión sin cafeína — para la tarde)',
      'Maca en polvo (opcional — adaptógeno hormonal)',
      'Ashwagandha en polvo (opcional)'
    )),

  jsonb_build_object('categoria', 'Granos y despensa',
    'items', jsonb_build_array(
      'Avena en copos (400g)',
      'Arroz integral (400g)',
      'Quinoa (300g)',
      'Aceite de oliva virgen extra',
      'Aceite de lino (en nevera)',
      'Cacao puro en polvo sin azúcar',
      'Chocolate negro 85% (2 tabletas)'
    ))

) WHERE slug = 'equilibrio-hormonal-45';


-- ── Food·Mood Reset (21 días) ─────────────────────────────────────────────────
UPDATE public.challenges SET lista_compra = jsonb_build_array(

  jsonb_build_object('categoria', 'Fermentados y probióticos',
    'items', jsonb_build_array(
      'Kéfir natural (1 litro)',
      'Yogur natural sin azúcar con cultivos vivos',
      'Chucrut sin pasteurizar (bote grande)',
      'Kimchi sin pasteurizar (opcional)',
      'Miso de cebada o de arroz',
      'Vinagre de manzana con la madre',
      'Kombucha natural sin pasteurizar'
    )),

  jsonb_build_object('categoria', 'Caldos y proteínas',
    'items', jsonb_build_array(
      'Huesos de pollo o ternera (1 kg — para caldo de huesos)',
      'Salmón fresco (4 filetes)',
      'Sardinas o caballa al natural (6 latas)',
      'Huevos camperos (12)',
      'Tofu firme (400g)',
      'Tempeh (300g)'
    )),

  jsonb_build_object('categoria', 'Verduras de todos los colores',
    'items', jsonb_build_array(
      'Espinacas y hojas verdes (500g)',
      'Brócoli (2 cabezas)',
      'Boniato (4)',
      'Remolacha (3)',
      'Zanahoria (8)',
      'Aguacate (6)',
      'Pepino (4)',
      'Cebolla (4)',
      'Ajo (2 cabezas)',
      'Jengibre fresco (150g)',
      'Cúrcuma fresca (si la encuentras)'
    )),

  jsonb_build_object('categoria', 'Frutas',
    'items', jsonb_build_array(
      'Arándanos (400g — frescos o congelados)',
      'Plátanos (8)',
      'Mango (2)',
      'Granada (2)',
      'Limón (8)',
      'Manzana verde (6)'
    )),

  jsonb_build_object('categoria', 'Legumbres y granos',
    'items', jsonb_build_array(
      'Lentejas rojas (300g)',
      'Garbanzos secos (300g)',
      'Quinoa (400g)',
      'Arroz integral (400g)',
      'Avena en copos (400g)',
      'Pan de masa madre (o harina de espelta para hacerlo)'
    )),

  jsonb_build_object('categoria', 'Frutos secos y semillas',
    'items', jsonb_build_array(
      'Nueces (200g)',
      'Almendras crudas (150g)',
      'Semillas de lino molidas (100g)',
      'Semillas de chía (100g)',
      'Semillas de calabaza (100g)',
      'Cacao puro en polvo sin azúcar (para nibs o batidos)'
    )),

  jsonb_build_object('categoria', 'Algas',
    'items', jsonb_build_array(
      'Alga kombu (20g)',
      'Alga wakame (10g)',
      'Setas shiitake secas (20g)'
    )),

  jsonb_build_object('categoria', 'Especias y despensa',
    'items', jsonb_build_array(
      'Cúrcuma en polvo',
      'Pimienta negra',
      'Jengibre en polvo',
      'Canela de Ceilán',
      'Aceite de oliva virgen extra',
      'Aceite de coco virgen (para cocinar)',
      'Salsa de soja o tamari',
      'Tahini — pasta de sésamo',
      'Miel cruda'
    )),

  jsonb_build_object('categoria', 'Infusiones y bebidas',
    'items', jsonb_build_array(
      'Té verde de calidad',
      'Rooibos',
      'Jengibre y limón (para infusiones matutinas)',
      'Agua mineral sin gas (tu hidratación base)'
    ))

) WHERE slug = 'food-mood-reset';
