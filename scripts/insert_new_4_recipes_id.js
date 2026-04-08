const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = require('dotenv').parse(fs.readFileSync('.env.local'));
const supabase = createClient(env.NEXT_PUBLIC_RECETAS_SUPABASE_URL, env.RECETAS_SUPABASE_KEY);

(async () => {
try {
  const newRecipes = [
    {
      id: crypto.randomUUID(),
      nombre_es: 'Porridge Ambarino de Ciruela Asada y Trigo Sarraceno',
      sintoma_tag: 'confort', 
      mood_es: 'confort', 
      tipo_plato: 'desayuno', 
      dificultad: 'facil', 
      tiempo_preparacion_min: '20', 
      contexto_es: 'Un abrazo matinal. La ciruela se deshace en el horno hasta revelar su dulzor profundo, mientras el trigo sarraceno nutre sin pesar. Un bálsamo para un estómago que busca calma.',
      ingredientes_es: ['2 ciruelas rojas maduras deshuesadas', '50g trigo sarraceno activado', '200ml bebida de almendras', '1 cucharadita de ghee', '1 cucharadita de canela', '1 cucharadita de miel cruda'],
      preparacion_es: ['Asa las ciruelas cortadas a la mitad con el ghee en el horno o sartén a fuego suave hasta caramelizar.', 'Cuece el trigo sarraceno en la bebida de almendras a fuego lento (15 min) hasta alcanzar textura de gachas.', 'Añade la canela y remueve bien.', 'Sirve el porridge caliente en un bol profundo, corona con las ciruelas asadas y su jugo.', 'Termina con un hilo de miel cruda.'],
      nota_food_mood_es: 'La ciruela es un portento de fibra soluble y sorbitol natural, que hidratan el tracto digestivo y nutren la microbiota directamente. Al asarse, liberas más poder antioxidante. El trigo sarraceno (sin gluten) aporta rutina, estabilizando los capilares sanguíneos y calmando el cuerpo físico.',
      tags: ['desayuno', 'facil', 'ciruela', 'confort'],
      premium_level: 1, sexo: 'unisex', grupo_edad: '31-50', segmento: 'adulto'
    },
    {
      id: crypto.randomUUID(),
      nombre_es: 'Aguachile Verde de Dorada con Kiwi, Cilantro y Jalapeño',
      sintoma_tag: 'activacion', mood_es: 'activacion', tipo_plato: 'almuerzo', dificultad: 'media', tiempo_preparacion_min: '15',
      contexto_es: 'Vibrante, eléctrico y fresco. El ácido del kiwi y la lima "cocinan" suavemente la dorada, despertando tu paladar y aportando una inyección directa de vitalidad sin letargo posterior.',
      ingredientes_es: ['200g lomo de dorada o lubina (limpio y muy fresco)', '2 kiwis pelados y picados en dados', 'Zumo de 3 limas', '1 jalapeño sin semillas', 'Medio manojo de cilantro fresco', '1 cucharada de aceite de oliva virgen extra', 'Sal marina en escamas'],
      preparacion_es: ['Licúa el jugo de lima con la mitad del kiwi, el cilantro, jalapeño y una pizca de sal marina hasta tener un caldo eléctrico y verde.', 'Corta la dorada en láminas muy finas (estilo sashimi).', 'Extiende la dorada en una fuente plana. Báñala con el aguachile verde y deja actuar durante 5 minutos para que el ácido cambie la textura del pescado.', 'Decora con el kiwi restante en dados y cilantro entero.', 'Rocía con unas gotas de aceite de oliva virgen extra justo antes de probar.'],
      nota_food_mood_es: 'El kiwi es una de las bombas naturales de vitamina C más altas que existen (incluso más que los cítricos), cofactor esencial para producir dopamina y noradrenalina: tu motor de arranque mental. Contiene también actinidina, una enzima proteolítica que ayuda a descomponer la proteína del pescado, dejándote con energía alta y digestión invisible.',
      tags: ['almuerzo', 'media', 'kiwi', 'fresco'], premium_level: 1, sexo: 'unisex', grupo_edad: '31-50', segmento: 'adulto'
    },
    {
      id: crypto.randomUUID(),
      nombre_es: 'Tiradito de Vieiras con Emulsión Cálida de Mandarina',
      sintoma_tag: 'social', mood_es: 'social', tipo_plato: 'cena', dificultad: 'media', tiempo_preparacion_min: '15',
      contexto_es: 'Pura elegancia para compartir. La delicadeza de la vieira se encuentra con el toque cítrico amable de la mandarina en una mesa donde las conversaciones fluyen y el tiempo se detiene.',
      ingredientes_es: ['8 vieiras frescas y limpias', 'Zumo de 3 mandarinas dulces recién exprimidas', 'Ralladura sutil de jengibre fresco', '1 cucharadita de aceite de sésamo tostado', '1 cucharada de salsa tamari (soja sin gluten)', 'Cebollino fresco picado fino', 'Sal marina'],
      preparacion_es: ['En un cazo pequeño, reduce el zumo de mandarina con la salsa tamari y el jengibre a fuego lento durante 7 minutos hasta que tome textura casi de falso almíbar.', 'Retira del fuego y emulsiona añadiendo el aceite de sésamo tostado. Deja entibiar.', 'Corta las vieiras transversalmente en 3 láminas cada una, logrando un tapiz translúcido suave en un plato llano.', 'Sirve al centro de la mesa y baña las vieiras con la emulsión de mandarina tibia.', 'Termina con cebollino fresco y un toque de sal.'],
      nota_food_mood_es: 'La mandarina aporta hesperidina y nobiletina, flavonoides súper nobles que apoyan el flujo sanguíneo, favoreciendo una sensación amable y expansiva para encuentros sociales. Las vieiras, por su parte, son una mina de yodo, vitamina B12 y triptófano, facilitando pura magia para el ánimo de grupo.',
      tags: ['cena', 'media', 'mandarina', 'elegante'], premium_level: 1, sexo: 'unisex', grupo_edad: '31-50', segmento: 'adulto'
    },
    {
      id: crypto.randomUUID(),
      nombre_es: 'Curry Dorado de Piña Asada, Coco y Garbanzos Especiados',
      sintoma_tag: 'focus', mood_es: 'focus', tipo_plato: 'almuerzo', dificultad: 'facil', tiempo_preparacion_min: '25',
      contexto_es: 'Un viaje directo al sudeste asiático que agudiza los sentidos. La piña asada se funde en un mar de coco y especias que estimulan el riego sanguíneo, devolviéndote la brújula mental.',
      ingredientes_es: ['Media piña natural cortada en dados gruesos', '200g garbanzos cocidos', '250ml leche de coco entera', '1 cucharada generosa de pasta de curry amarillo', '1 cucharada de aceite de coco', 'Unas hojas de espinaca fresca', 'Cilantro fresco'],
      preparacion_es: ['En una sartén grande, funde aceite de coco a fuego muy alto. Dora los dados de piña hasta que tengan marcas doradas casi caramelizadas.', 'Retira la piña. En la misma sartén, tuesta la pasta de curry con el resto del aceite 1 minuto.', 'Vierte la leche de coco y emulsiona deshaciendo la pasta. Cuece suave 5 minutos para espesar.', 'Incorpora los garbanzos y la piña asada, dejando que se impregnen de oro durante 5 minutos más.', 'Mezcla la espinaca para que merme con el calor residual. Sirve caliente con cilantro.'],
      nota_food_mood_es: 'La piña fresca contiene concentraciones maestras de bromelina, una potente enzima biológica capaz de mermar la neuroinflamación cerebral pasiva (la "niebla mental"). El curry ampara a nivel neuroprotector los garbanzos. Logras claridad cognitiva instantánea sostenida por 4 horas.',
      tags: ['almuerzo', 'facil', 'piña', 'curry'], premium_level: 1, sexo: 'unisex', grupo_edad: '31-50', segmento: 'adulto'
    }
  ];

  console.log('Inserting recipes...');
  for(let rec of newRecipes) {
    const { error: insertError } = await supabase.from('recetas').insert(rec);
    if(insertError) throw insertError;
  }
  console.log('Successfully inserted 4 new recipes.');

  const links = {
    'Ciruela': 'ciruela', 'Kiwi': 'kiwi', 'Mandarina': 'mandarina', 'Piña': 'piña'
  };

  const { data: allR } = await supabase.from('recetas').select('id, nombre_es, ingredientes_es');
  
  for(const [gName, keyword] of Object.entries(links)) {
      const matched = allR.filter(r => r.ingredientes_es && JSON.stringify(r.ingredientes_es).toLowerCase().includes(keyword)).map(r => ({id: r.id, nombre: r.nombre_es}));
      
      const { error: gErr } = await supabase.from('glossary').update({food_mood_recipes: matched}).eq('name', gName);
      if(gErr) throw gErr;
      console.log('Linked', matched.length, 'recipes to', gName);
  }

} catch(e) {
  console.error('Error:', e);
} 
})();
