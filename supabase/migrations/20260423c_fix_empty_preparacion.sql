-- Fix 12 recipes with empty preparacion_es (E1-E3 series)

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Tuesta el pan hasta que esté crujiente por fuera y esponjoso por dentro."},
  {"paso":"Aplasta medio aguacate con un tenedor. Añade una pizca de sal y unas gotas de limón."},
  {"paso":"Cuece el huevo al gusto: escalfado 3 minutos en agua con vinagre, o a la plancha con un hilo de aceite."},
  {"paso":"Extiende el aguacate sobre la tostada. Coloca el huevo encima."},
  {"paso":"Espolvorea semillas de calabaza tostadas y sirve inmediatamente."}
]'::jsonb WHERE id = 'E1-01';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Cuece la pasta en agua con sal. Reserva un cazo del agua de cocción antes de escurrir."},
  {"paso":"Tritura las nueces con las espinacas frescas y el pesto hasta obtener una salsa cremosa. Añade aceite si es necesario."},
  {"paso":"Mezcla la pasta escurrida con la salsa verde en la misma olla a fuego bajo."},
  {"paso":"Añade una cucharada del agua de cocción para ligar la salsa si queda espesa."},
  {"paso":"Sirve con nueces picadas por encima y un hilo de aceite de oliva virgen extra."}
]'::jsonb WHERE id = 'E1-02';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Pela el plátano y congélalo al menos 30 minutos antes para más cremosidad."},
  {"paso":"Añade al vaso de la batidora el plátano, el cacao puro, la mantequilla de almendras y la leche."},
  {"paso":"Bate a máxima potencia 30-40 segundos hasta que quede completamente homogéneo."},
  {"paso":"Prueba y ajusta: más cacao para más intensidad, más leche si lo quieres más fluido."},
  {"paso":"Sirve inmediatamente en un vaso alto."}
]'::jsonb WHERE id = 'E1-03';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Cuece el arroz según las instrucciones. Deja templar."},
  {"paso":"Corta el salmón en dados de 2 cm. Usa salmón de calidad sushi si es crudo, o márcalo brevemente a la plancha."},
  {"paso":"Hierve el edamame congelado 3 minutos con sal. Escurre."},
  {"paso":"Monta el bol: arroz de base, salmón en un lado, edamame en el otro."},
  {"paso":"Aliña con salsa de soja y unas gotas de aceite de sésamo tostado."}
]'::jsonb WHERE id = 'E1-04';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Pela y ralla 2 cm de jengibre fresco. Exprime el jugo apretando la ralladura con los dedos sobre un vaso."},
  {"paso":"Añade el zumo de medio limón recién exprimido."},
  {"paso":"Incorpora el vinagre de kombucha y la miel. Remueve bien."},
  {"paso":"Prueba y ajusta el dulzor con más miel si lo necesitas."},
  {"paso":"Bebe de un solo trago 15-20 minutos antes del ejercicio."}
]'::jsonb WHERE id = 'E2-01';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Corta el boniato en dados y hornéalo a 200°C con aceite y sal durante 25 minutos hasta que esté tierno y dorado."},
  {"paso":"Marca el salmón en sartén caliente con un hilo de aceite: 3 minutos por cada lado. Desmenúzalo en trozos grandes."},
  {"paso":"Tuesta las nueces en sartén seca 2 minutos hasta que aromen."},
  {"paso":"Monta el bol: boniato de base, salmón encima, arándanos y nueces alrededor."},
  {"paso":"Aliña con aceite de oliva, limón y una pizca de sal marina."}
]'::jsonb WHERE id = 'E2-02';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Deja reposar la chía en 2 cucharadas de agua durante 5 minutos para que gelatinice."},
  {"paso":"Añade al vaso de la batidora el kéfir, el plátano troceado, el cacao, la miel y la chía hidratada."},
  {"paso":"Bate 30 segundos a alta potencia hasta obtener textura cremosa y uniforme."},
  {"paso":"Si queda muy espeso, añade un poco más de kéfir y bate brevemente."},
  {"paso":"Toma dentro de los primeros 30 minutos tras el ejercicio para optimizar la recuperación muscular."}
]'::jsonb WHERE id = 'E2-03';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Cuece la quinoa en agua con sal (proporción 1:2) durante 12 minutos. Escurre y deja enfriar."},
  {"paso":"Elige verduras de 5 colores: tomate (rojo), zanahoria (naranja), pimiento (amarillo), espinacas (verde), remolacha o lombarda (morado). Córtalas pequeñas."},
  {"paso":"Prepara el aliño: aceite de oliva, vinagre de manzana, una cucharadita de cúrcuma, sal y pimienta. Emulsiona con un tenedor."},
  {"paso":"Combina en un bol la quinoa fría, las verduras y el atún escurrido."},
  {"paso":"Aliña justo antes de servir y mezcla bien para distribuir el color uniformemente."}
]'::jsonb WHERE id = 'E2-04';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Cuece las lentejas en agua fría con una hoja de laurel durante 20-25 minutos. Escurre y reserva."},
  {"paso":"Corta el brócoli en ramilletes y cocínalo al vapor 5-6 minutos — que quede al dente y verde brillante."},
  {"paso":"Tuesta las semillas de sésamo en sartén seca a fuego medio 2 minutos, removiendo."},
  {"paso":"Muele el lino en el momento para preservar sus lignanos activos."},
  {"paso":"Monta el bol: lentejas de base, brócoli encima. Espolvorea lino molido y sésamo. Aliña con aceite y limón."}
]'::jsonb WHERE id = 'E3-01';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Calienta el caldo de huesos en un cazo a fuego medio-bajo. No dejes que hierva fuerte."},
  {"paso":"Cuando esté caliente, añade una cucharadita generosa de cúrcuma en polvo. Remueve para integrar."},
  {"paso":"Agrega una cucharadita de ghee y remueve hasta que se disuelva completamente."},
  {"paso":"Añade pimienta negra molida — activa la curcumina hasta 2000 veces más."},
  {"paso":"Sirve en una taza grande. Tómalo sentada, sin pantallas, como ritual de cierre del día."}
]'::jsonb WHERE id = 'E3-02';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Hidrata el wakame seco en agua fría durante 5 minutos. Escurre y corta en tiras si son muy largas."},
  {"paso":"Lava y seca las hojas verdes (espinacas baby, rúcula o mezclum)."},
  {"paso":"Escurre las sardinas en conserva y desmenúzalas ligeramente con un tenedor."},
  {"paso":"Tuesta el sésamo en sartén seca 1-2 minutos hasta que empiece a saltar."},
  {"paso":"Monta la ensalada: hojas verdes, wakame, sardinas encima. Espolvorea sésamo. Aliña con salsa de soja, aceite de sésamo y limón."}
]'::jsonb WHERE id = 'E3-03';

UPDATE public.recetas SET preparacion_es = '[
  {"paso":"Si usas cerezas congeladas, sácalas 5 minutos antes para que se ablanden ligeramente."},
  {"paso":"Pica las nueces en trozos grandes y resérvalas para el final."},
  {"paso":"Añade al vaso de la batidora el kéfir, las cerezas y una cucharadita de maca en polvo."},
  {"paso":"Bate 30 segundos hasta obtener una textura suave y de color rosado-morado profundo."},
  {"paso":"Sirve en un vaso y añade las nueces picadas por encima sin batir, para conservar su textura y sus omega-3."}
]'::jsonb WHERE id = 'E3-04';

-- Verify
SELECT id, nombre_es, jsonb_array_length(preparacion_es) AS pasos
FROM public.recetas
WHERE id IN ('E1-01','E1-02','E1-03','E1-04','E2-01','E2-02','E2-03','E2-04','E3-01','E3-02','E3-03','E3-04')
ORDER BY id;
