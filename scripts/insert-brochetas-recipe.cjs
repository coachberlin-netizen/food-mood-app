const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY
);

const BROCHETAS = {
  id: 'brochetas-pollo-seitan-hummus-vinagre-vivo',
  nombre_es: 'Brochetas de Pollo o Seitán con Hummus de Vinagre Vivo',
  mood_es: 'activacion',
  segmento: 'adulto',
  sexo: 'unisex',
  grupo_edad: '18-65',
  premium_level: 0,
  tipo_plato: 'plato principal',
  dificultad: 'facil',
  tiempo_preparacion_min: 45,
  temporada: 'todo el año',
  contexto_es: 'Proteína a la plancha, hummus vivo y cebolla encurtida. Una combinación que activa el metabolismo, alimenta la microbiota y sostiene la energía durante horas. El vinagre de kombucha es el hilo conductor: en la marinada, en el hummus y en el encurtido.',
  ingredientes_es: [
    { ingrediente: '200 g de pollo en dados o seitán en tiras' },
    { ingrediente: '2 cdas de vinagre de kombucha o vinagre de manzana sin filtrar (para marinar)' },
    { ingrediente: '1 diente de ajo picado fino' },
    { ingrediente: '1 cdita de pimentón dulce ahumado' },
    { ingrediente: '1 cda de aceite de oliva virgen extra' },
    { ingrediente: '150 g de hummus casero o de calidad (garbanzos, tahini, aceite)' },
    { ingrediente: '1 cdita de vinagre de kombucha o vinagre de manzana (para el hummus)' },
    { ingrediente: '½ cebolla morada en láminas, encurtida 20 min en vinagre de manzana' },
    { ingrediente: 'Opcional: semillas de sésamo, nueces picadas, perejil fresco' },
  ],
  preparacion_es: [
    { paso: 'Marina el pollo o seitán con el vinagre, el ajo, el pimentón y el aceite durante mínimo 30 minutos.' },
    { paso: 'Mientras tanto, encurte la cebolla morada en láminas con un chorrito de vinagre de manzana y una pizca de sal. Reserva.' },
    { paso: 'Mezcla el hummus con la cdita extra de vinagre de kombucha. Remueve bien y reserva a temperatura ambiente.' },
    { paso: 'Ensarta el pollo o seitán en brochetas y cocina a la plancha o sartén a fuego medio-alto hasta dorar por todos los lados (unos 8-10 min para el pollo, 5 para el seitán).' },
    { paso: 'Sirve las brochetas sobre una base generosa de hummus. Añade la cebolla encurtida por encima y termina con sésamo, nueces o perejil al gusto.' },
  ],
  nota_food_mood_es: 'El vinagre vivo —de kombucha o manzana sin filtrar— actúa en tres momentos: en la marinada ablanda la proteína y mejora su digestibilidad; en el hummus potencia la biodisponibilidad del hierro vegetal del garbanzo; en el encurtido convierte la cebolla en un prebiótico activo que alimenta directamente la microbiota. El seitán aporta proteína completa de gluten con perfil de aminoácidos comparable a la carne. Las semillas de sésamo suman calcio, zinc y lignanos.',
  variantes_es: [
    { variante: 'Versión vegana completa: seitán + hummus sin lácteos.' },
    { variante: 'Añade tahini extra al hummus para más calcio y grasas saludables.' },
    { variante: 'Con pimentón picante para un perfil más activador del metabolismo.' },
  ],
  tags: [
    'activacion', 'social', 'pollo', 'seitan', 'proteina', 'hummus',
    'vinagre de kombucha', 'probióticos', 'prebióticos', 'plancha',
    'microbiota', 'antiinflamatorio', 'sin gluten opcional', 'plato principal',
  ],
};

async function run() {
  console.log('⚙️  Insertando receta Brochetas...');

  const { data: existing } = await supabase
    .from('recetas')
    .select('id')
    .eq('id', BROCHETAS.id)
    .single();

  if (existing) {
    const { error } = await supabase.from('recetas').update(BROCHETAS).eq('id', BROCHETAS.id);
    if (error) console.error('❌ Error actualizando:', error.message);
    else console.log('✅ Receta actualizada.');
  } else {
    const { error } = await supabase.from('recetas').insert(BROCHETAS);
    if (error) console.error('❌ Error insertando:', error.message);
    else console.log('✅ Brochetas insertadas correctamente.');
  }

  console.log('🎉 Listo.');
}

run().catch(console.error);
