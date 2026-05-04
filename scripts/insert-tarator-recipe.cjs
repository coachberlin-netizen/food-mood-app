const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.RECETAS_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RECETAS_SUPABASE_KEY
);

// ── RECETA ──────────────────────────────────────────────────────────────────
const TARATOR = {
  id: 'tarator-vitalidad-bulgara',
  nombre_es: 'Tarator Vitalidad Búlgara',
  mood_es: 'reset',
  segmento: 'adulto',
  sexo: 'unisex',
  grupo_edad: '18-65',
  premium_level: 0,
  tipo_plato: 'sopa fría',
  dificultad: 'facil',
  tiempo_preparacion_min: 10,
  temporada: 'verano',
  contexto_es: 'El gazpacho búlgaro. Una sopa fría a base de yogur que lleva siglos enfriando cuerpos y calmando sistemas nerviosos en los Balcanes. Sin fuego, sin complicaciones: solo batir, mezclar y servir. Perfecta para días de calor o cuando el cuerpo pide un reinicio digestivo profundo.',
  ingredientes_es: [
    { ingrediente: '300 g de yogur griego natural sin azúcar' },
    { ingrediente: '1 pepino grande, pelado y picado en cubos pequeños' },
    { ingrediente: '1 diente de ajo pequeño, machacado' },
    { ingrediente: '30 g de nueces crudas, picadas groseramente' },
    { ingrediente: '1 cucharada de eneldo fresco picado' },
    { ingrediente: '1 cucharadita de semillas de eneldo (ligeramente machacadas en mortero)' },
    { ingrediente: '1 cucharada de aceite de oliva virgen extra' },
    { ingrediente: '100 ml de agua muy fría' },
    { ingrediente: 'Pizca de sal marina' },
  ],
  preparacion_es: [
    { paso: 'Bate el yogur en un bol hasta que quede completamente cremoso y sin grumos.' },
    { paso: 'Añade el agua fría poco a poco, mezclando hasta obtener la consistencia de una sopa ligera.' },
    { paso: 'Incorpora el pepino, el ajo machacado, el eneldo fresco y las semillas de eneldo. Mezcla bien.' },
    { paso: 'Ajusta de sal y enfría en nevera al menos 10 minutos antes de servir.' },
    { paso: 'En el momento de servir, añade las nueces y el aceite de oliva para mantener la textura crujiente y el aroma.' },
  ],
  nota_food_mood_es: 'El yogur aporta Lactobacillus bulgaricus vivos que modulan directamente la microbiota y el eje intestino-cerebro. Las semillas de eneldo contienen apigenina y limoneno: efecto ansiolítico suave y carminativo potente — reducen la inflamación digestiva y los gases de forma significativa. Las nueces suman omega-3 antiinflamatorio. Es un bol de reset completo: microbiota, sistema nervioso e hidratación celular en un solo plato.',
  variantes_es: [
    { variante: 'Sin ajo para digestiones más sensibles.' },
    { variante: 'Menta fresca en lugar de eneldo para un perfil más refrescante.' },
    { variante: 'Con dados de pan de centeno tostado para más saciedad.' },
  ],
  tags: ['reset', 'confort', 'sopa fría', 'probióticos', 'yogur', 'pepino', 'eneldo', 'fermentado', 'verano', 'sin cocción', 'microbiota', 'digestión', 'antiinflamatorio'],
};

// ── GLOSARIO ─────────────────────────────────────────────────────────────────
const GLOSSARY_TERMS = [
  {
    slug: 'semillas-de-eneldo',
    name: 'Semillas de Eneldo',
    tagline: 'El calmante digestivo y ansiolítico más olvidado de la despensa.',
    category: 'Semillas',
    subcategory: 'Carminativas',
    moods: ['Reset', 'Calma'],
    mind_effect: 'Contienen apigenina, un flavonoide que se une a los receptores GABA-A con efecto ansiolítico suave, similar al de la manzanilla pero más potente. Reducen la hiperactividad del sistema nervioso entérico.',
    longevity_effect: 'Efecto antiinflamatorio sistémico mediante monoterpenos como el limoneno y el carvona. Protegen la mucosa intestinal y reducen el estrés oxidativo digestivo crónico.',
    science_summary: 'Anethum graveolens. Sus semillas concentran aceites esenciales (carvona, limoneno, apigenina) con acción carminativa, espasmolítica y ansiolítica documentada. Tritura ligeramente en mortero antes de usar para liberar los aceites volátiles.',
    active_compounds: ['Carvona', 'Limoneno', 'Apigenina', 'Anetofurano'],
    benefits: [
      { title: 'Carminativo Potente', description: 'Elimina gases y espasmos digestivos mejor que el eneldo fresco por su mayor concentración de carvona.' },
      { title: 'Ansiolítico Natural', description: 'La apigenina actúa sobre receptores GABA, reduciendo la ansiedad de origen digestivo.' },
      { title: 'Antiinflamatorio Intestinal', description: 'El limoneno reduce la permeabilidad intestinal y calma la inflamación de la mucosa.' },
    ],
    synergies: ['yogur-griego', 'pepino', 'ajo'],
    food_mood_recipes: ['Tarator Vitalidad Búlgara'],
  },
  {
    slug: 'yogur-griego',
    name: 'Yogur Griego Natural',
    tagline: 'El probiótico más antiguo de Europa y el aliado directo del eje intestino-cerebro.',
    category: 'Fermentados',
    subcategory: 'Lácteos fermentados',
    moods: ['Reset', 'Calma', 'Confort'],
    mind_effect: 'Los Lactobacillus bulgaricus y Streptococcus thermophilus producen GABA y serotonina directamente en el intestino, modulando el estado de ánimo mediante el nervio vago. Reduce la ansiedad y mejora la calidad del sueño con consumo regular.',
    longevity_effect: 'Fortalece la barrera intestinal, reduce la permeabilidad intestinal y mejora la absorción de minerales clave como magnesio, zinc y calcio. Su proteína de alta biodisponibilidad favorece la síntesis muscular en procesos de longevidad activa.',
    science_summary: 'El yogur griego concentra el doble de proteína que el yogur convencional por el proceso de colado. Las bacterias vivas (≥10⁸ UFC/g) colonizan transitoriamente el colon, mejorando el equilibrio de la microbiota y la producción local de ácidos grasos de cadena corta (butirato).',
    active_compounds: ['Lactobacillus bulgaricus', 'Streptococcus thermophilus', 'Caseína', 'Proteína de suero', 'Calcio biodisponible'],
    benefits: [
      { title: 'Modulador del Eje Intestino-Cerebro', description: 'Sus probióticos producen neurotransmisores directamente en el intestino.' },
      { title: 'Saciedad Prolongada', description: 'La caseína de digestión lenta mantiene niveles de glucosa estables durante horas.' },
      { title: 'Barrera Intestinal', description: 'Reduce la permeabilidad intestinal ("leaky gut") con consumo regular.' },
    ],
    synergies: ['semillas-de-eneldo', 'pepino', 'nueces'],
    food_mood_recipes: ['Tarator Vitalidad Búlgara'],
  },
  {
    slug: 'eneldo',
    name: 'Eneldo Fresco',
    tagline: 'La hierba que calma el intestino y el sistema nervioso al mismo tiempo.',
    category: 'Hierbas Aromáticas',
    subcategory: 'Carminativas',
    moods: ['Reset', 'Calma'],
    mind_effect: 'Sus aceites esenciales (principalmente anetol y carvona en menor medida que las semillas) tienen efecto sedante suave sobre el sistema nervioso entérico. Históricamente usado para calmar los cólicos y la ansiedad digestiva.',
    longevity_effect: 'Rico en flavonoides como la quercetina y kaempferol, con efecto antiinflamatorio y antioxidante. Fuente de vitamina C, vitamina A y manganeso.',
    science_summary: 'Anethum graveolens. El eneldo fresco es más suave que sus semillas pero igualmente carminativo. Sus monoterpenos protegen el ADN celular frente al daño oxidativo. Se usa en la medicina tradicional búlgara, griega y escandinava para la salud digestiva.',
    active_compounds: ['Anetol', 'Quercetina', 'Kaempferol', 'Vitamina C', 'Carvona (trazas)'],
    benefits: [
      { title: 'Digestivo y Carminativo', description: 'Reduce gases, hinchazón y espasmos intestinales después de comer.' },
      { title: 'Antioxidante Celular', description: 'Los flavonoides protegen las células frente al estrés oxidativo crónico.' },
    ],
    synergies: ['semillas-de-eneldo', 'yogur-griego', 'pepino'],
    food_mood_recipes: ['Tarator Vitalidad Búlgara'],
  },
];

async function run() {
  console.log('⚙️  Insertando receta Tarator...');

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('recetas')
    .select('id')
    .eq('nombre_es', TARATOR.nombre_es)
    .single();

  if (existing) {
    console.log('⚠️  La receta ya existe — actualizando...');
    const { error } = await supabase
      .from('recetas')
      .update(TARATOR)
      .eq('nombre_es', TARATOR.nombre_es);
    if (error) console.error('❌ Error actualizando receta:', error.message);
    else console.log('✅ Receta actualizada.');
  } else {
    const { error } = await supabase.from('recetas').insert(TARATOR);
    if (error) console.error('❌ Error insertando receta:', error.message);
    else console.log('✅ Receta Tarator insertada correctamente.');
  }

  console.log('\n⚙️  Insertando términos de glosario...');
  for (const term of GLOSSARY_TERMS) {
    const { data: existingTerm } = await supabase
      .from('glossary')
      .select('id')
      .eq('slug', term.slug)
      .single();

    if (existingTerm) {
      const { error } = await supabase.from('glossary').update(term).eq('slug', term.slug);
      if (error) console.error(`❌ Error actualizando ${term.slug}:`, error.message);
      else console.log(`✅ Actualizado: ${term.name}`);
    } else {
      const { error } = await supabase.from('glossary').insert(term);
      if (error) console.error(`❌ Error insertando ${term.slug}:`, error.message);
      else console.log(`✅ Insertado: ${term.name}`);
    }
  }

  console.log('\n🎉 Listo.');
}

run().catch(console.error);
