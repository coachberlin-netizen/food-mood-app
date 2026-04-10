const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GLOSSARY_ENTRY = {
    name: 'Cordyceps',
    slug: 'cordyceps',
    tagline: 'El hongo que multiplica tu energía celular',
    category: 'hongo',
    moods: ["activacion", "focus"],
    mind_effect: 'Aumenta la producción de ATP — la moneda energética de cada célula, incluidas las neuronas. Mejora la oxigenación cerebral y la resistencia mental.',
    longevity_effect: 'Adaptógeno con evidencia en rendimiento físico y cognitivo. Mejora la capacidad aeróbica y reduce la fatiga. Potencial en longevidad por su efecto sobre telómeros.',
    science_summary: 'Contiene cordicepina y adenosina. La cordicepina es un análogo de nucleósido con propiedades antiinflamatorias. La adenosina regula el ciclo sueño-vigilia.',
    active_compounds: ["cordicepina", "adenosina", "polisacáridos", "ergosterol"],
    benefits: ["Adaptógeno", "Energizante celular", "Anti-fatiga", "Neuroprotector"],
    evidence_level: 'moderado'
};

const RECIPES = [
    // 18-30
    {
        id: 'bowl-energia-celular-18-30', sexo: 'hombre', grupo_edad: '18-30', nombre_es: 'Bowl de Energía Celular (Cordyceps y Zinc)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Semillas de calabaza", "Arándanos", "Extracto de Cordyceps", "Quinoa", "Yogur de coco"],
        preparacion_es: ["Cocer la quinoa y dejar enfriar.", "Mezclar con el yogur y el extracto de cordyceps.", "Añadir los arándanos y las semillas por encima."],
        nota_food_mood_es: 'Nota Food·Mood: Los cordyceps aumentan la producción de ATP celular — más energía disponible para tu cerebro y tu vitalidad. Las semillas de calabaza aportan zinc, mineral esencial para la síntesis de dopamina y la agudeza mental.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno'
    },
    {
        id: 'solomillo-pavo-gremolata-18-30', sexo: 'hombre', grupo_edad: '18-30', nombre_es: 'Solomillo de Pavo con Gremolata de Limón y Cordyceps',
        mood_es: 'Activación & Energía', ingredientes_es: ["Solomillo de pavo", "Champiñones", "Limón", "Ajo", "Cordyceps en polvo"],
        preparacion_es: ["Cocinar el pavo a la plancha.", "Hacer una gremolata con limón y cordyceps.", "Servir con champiñones salteados."],
        nota_food_mood_es: 'Nota Food·Mood: La combinación de aminoácidos del pavo con la vitamina C del limón optimiza la síntesis de precursores cognitivos. Los adaptógenos del hongo Cordyceps ayudan a gestionar la fatiga mental.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'tacos-salmon-mango-18-30', sexo: 'hombre', grupo_edad: '18-30', nombre_es: 'Tacos de Salmón con Salsa de Mango y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Salmón", "Mango", "Jengibre", "Cilantro", "Tortillas de maíz"],
        preparacion_es: ["Marinar el salmón con jengibre.", "Preparar salsa de mango.", "Montar los tacos con el salmón a la plancha."],
        nota_food_mood_es: 'Nota Food·Mood: Los ácidos grasos Omega-3 son fundamentales para la integridad de las membranas neuronales. El jengibre actúa como activador del eje intestino-cerebro, mejorando la vitalidad sin elevar el cortisol.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 20, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Cena'
    },
    {
        id: 'elixir-vitalidad-18-30', sexo: 'hombre', grupo_edad: '18-30', nombre_es: 'Elixir de Vitalidad Celular (Cordyceps y Cúrcuma)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Leche de almendras", "Cúrcuma", "Cordyceps", "Miel"],
        preparacion_es: ["Calentar la leche.", "Añadir especias y cordyceps.", "Batir hasta espumar."],
        nota_food_mood_es: 'Nota Food·Mood: Este elixir utiliza la cúrcuma para reducir la neuroinflamación sistémica, mientras que el Cordyceps potencia la oxigenación cerebral. Ideal para una energía sostenida y claridad mental.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida'
    },
    // 31-44
    {
        id: 'bowl-energia-celular-31-44', sexo: 'hombre', grupo_edad: '31-44', nombre_es: 'Bowl de Energía Celular (Cordyceps y Zinc)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Semillas de calabaza", "Arándanos", "Extracto de Cordyceps", "Quinoa", "Yogur de coco"],
        preparacion_es: ["Cocer la quinoa y dejar enfriar.", "Mezclar con el yogur y el extracto de cordyceps.", "Añadir los arándanos y las semillas por encima."],
        nota_food_mood_es: 'Nota Food·Mood: Los cordyceps aumentan la producción de ATP celular. Las semillas de calabaza aportan zinc, mineral esencial para la síntesis de dopamina y la agudeza mental.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno'
    },
    {
        id: 'solomillo-pavo-gremolata-31-44', sexo: 'hombre', grupo_edad: '31-44', nombre_es: 'Solomillo de Pavo con Gremolata de Limón y Cordyceps',
        mood_es: 'Activación & Energía', ingredientes_es: ["Solomillo de pavo", "Champiñones", "Limón", "Ajo", "Cordyceps en polvo"],
        preparacion_es: ["Cocinar el pavo a la plancha.", "Hacer una gremolata con limón y cordyceps.", "Servir con champiñones salteados."],
        nota_food_mood_es: 'Nota Food·Mood: La combinación de aminoácidos del pavo con la vitamina C del limón optimiza la síntesis de precursores cognitivos. El Cordyceps ayuda a gestionar la fatiga mental.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'tacos-salmon-mango-31-44', sexo: 'hombre', grupo_edad: '31-44', nombre_es: 'Tacos de Salmón con Salsa de Mango y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Salmón", "Mango", "Jengibre", "Cilantro", "Tortillas de maíz"],
        preparacion_es: ["Marinar el salmón con jengibre.", "Preparar salsa de mango.", "Montar los tacos con el salmón a la plancha."],
        nota_food_mood_es: 'Nota Food·Mood: Los ácidos grasos Omega-3 son fundamentales para la integridad de las membranas neuronales. El jengibre activa el eje intestino-cerebro, mejorando la vitalidad.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 20, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Cena'
    },
    {
        id: 'elixir-vitalidad-31-44', sexo: 'hombre', grupo_edad: '31-44', nombre_es: 'Elixir de Vitalidad Celular (Cordyceps y Cúrcuma)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Leche de almendras", "Cúrcuma", "Cordyceps", "Miel"],
        preparacion_es: ["Calentar la leche.", "Añadir especias y cordyceps.", "Batir hasta espumar."],
        nota_food_mood_es: 'Nota Food·Mood: Este elixir utiliza la cúrcuma para reducir la neuroinflamación sistémica, mientras que el Cordyceps potencia la oxigenación cerebral.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida'
    },
    // 45-60
    {
        id: 'bowl-energia-celular-45-60', sexo: 'hombre', grupo_edad: '45-60', nombre_es: 'Bowl de Energía Celular (Cordyceps y Zinc)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Semillas de calabaza", "Arándanos", "Extracto de Cordyceps", "Quinoa", "Yogur de coco"],
        preparacion_es: ["Cocer la quinoa y dejar enfriar.", "Mezclar con el yogur y el extracto de cordyceps.", "Añadir los arándanos y las semillas por encima."],
        nota_food_mood_es: 'Nota Food·Mood: Los cordyceps aumentan la producción de ATP celular, clave para la vitalidad cerebral en esta etapa. El zinc es esencial para la síntesis de dopamina y la memoria.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno'
    },
    {
        id: 'solomillo-pavo-gremolata-45-60', sexo: 'hombre', grupo_edad: '45-60', nombre_es: 'Solomillo de Pavo con Gremolata de Limón y Cordyceps',
        mood_es: 'Activación & Energía', ingredientes_es: ["Solomillo de pavo", "Champiñones", "Limón", "Ajo", "Cordyceps en polvo"],
        preparacion_es: ["Cocinar el pavo a la plancha.", "Hacer una gremolata con limón y cordyceps.", "Servir con champiñones salteados."],
        nota_food_mood_es: 'Nota Food·Mood: Pavo y limón para claridad cognitiva. El Cordyceps apoya la energía sostenible reduciendo la sensación de agotamiento mental acumulado.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'tacos-salmon-mango-45-60', sexo: 'hombre', grupo_edad: '45-60', nombre_es: 'Tacos de Salmón con Salsa de Mango y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Salmón", "Mango", "Jengibre", "Cilantro", "Tortillas de maíz"],
        preparacion_es: ["Marinar el salmón con jengibre.", "Preparar salsa de mango.", "Montar los tacos con el salmón a la plancha."],
        nota_food_mood_es: 'Nota Food·Mood: Omega-3 para mantenimiento neuronal. El jengibre activa la respuesta digestiva y cerebral, mejorando la biodisponibilidad de nutrientes.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 20, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Cena'
    },
    {
        id: 'elixir-vitalidad-45-60', sexo: 'hombre', grupo_edad: '45-60', nombre_es: 'Elixir de Vitalidad Celular (Cordyceps y Cúrcuma)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Leche de almendras", "Cúrcuma", "Cordyceps", "Miel"],
        preparacion_es: ["Calentar la leche.", "Añadir especias y cordyceps.", "Batir hasta espumar."],
        nota_food_mood_es: 'Nota Food·Mood: Cúrcuma para salud cerebral. Cordyceps para optimizar la respiración celular y mantener la claridad mental sin estrés oxidativo.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida'
    },
    // 60+
    {
        id: 'bowl-energia-celular-60-plus', sexo: 'hombre', grupo_edad: '60+', nombre_es: 'Bowl de Energía Celular (Cordyceps y Zinc)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Semillas de calabaza", "Arándanos", "Extracto de Cordyceps", "Quinoa", "Yogur de coco"],
        preparacion_es: ["Cocer la quinoa y dejar enfriar.", "Mezclar con el yogur y el extracto de cordyceps.", "Añadir los arándanos y las semillas por encima."],
        nota_food_mood_es: 'Nota Food·Mood: Protección cognitiva y energía celular básica. El zinc apoya la agilidad mental y los cordyceps mejoran la oxigenación celular general.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno'
    },
    {
        id: 'solomillo-pavo-gremolata-60-plus', sexo: 'hombre', grupo_edad: '60+', nombre_es: 'Solomillo de Pavo con Gremolata de Limón y Cordyceps',
        mood_es: 'Activación & Energía', ingredientes_es: ["Solomillo de pavo", "Champiñones", "Limón", "Ajo", "Cordyceps en polvo"],
        preparacion_es: ["Cocinar el pavo a la plancha.", "Hacer una gremolata con limón y cordyceps.", "Servir con champiñones salteados."],
        nota_food_mood_es: 'Nota Food·Mood: Facilita la síntesis de dopamina y la vitalidad a largo plazo a través de precursores limpios y adaptógenos naturales.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'tacos-salmon-mango-60-plus', sexo: 'hombre', grupo_edad: '60+', nombre_es: 'Tacos de Salmón con Salsa de Mango y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Salmón", "Mango", "Jengibre", "Cilantro", "Tortillas de maíz"],
        preparacion_es: ["Marinar el salmón con jengibre.", "Preparar salsa de mango.", "Montar los tacos con el salmón a la plancha."],
        nota_food_mood_es: 'Nota Food·Mood: Ácidos grasos para la salud de las neuronas. Vitalidad digestiva y mental sin sobrecargar el sistema.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 20, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Cena'
    },
    {
        id: 'elixir-vitalidad-60-plus', sexo: 'hombre', grupo_edad: '60+', nombre_es: 'Elixir de Vitalidad Celular (Cordyceps y Cúrcuma)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Leche de almendras", "Cúrcuma", "Cordyceps", "Miel"],
        preparacion_es: ["Calentar la leche.", "Añadir especias y cordyceps.", "Batir hasta espumar."],
        nota_food_mood_es: 'Nota Food·Mood: Máxima protección neuroinflamatoria y aporte de ATP celular para mantener la mente joven y receptiva.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida'
    }
];

async function apply() {
    try {
        console.log('--- Applying Glossary Entry ---');
        const { error: gError } = await supabase.from('glossary').upsert(GLOSSARY_ENTRY, { onConflict: 'slug' });
        if (gError) throw gError;
        console.log('Glossary entry applied.');

        console.log('--- Applying Recipes ---');
        const { error: rError } = await supabase.from('recetas').upsert(RECIPES, { onConflict: 'id' });
        if (rError) throw rError;
        console.log('16 recipes applied.');

        console.log('--- Linking Recipes to Glossary ---');
        const recipeNames = [
            "Bowl de Energía Celular (Cordyceps y Zinc)",
            "Solomillo de Pavo con Gremolata de Limón y Cordyceps",
            "Tacos de Salmón con Salsa de Mango y Jengibre",
            "Elixir de Vitalidad Celular (Cordyceps y Cúrcuma)"
        ];
        
        // Fetch to confirm and get exact IDs if needed (though we use names here)
        const { error: updateError } = await supabase
            .from('glossary')
            .update({ food_mood_recipes: recipeNames })
            .eq('slug', 'cordyceps');
            
        if (updateError) throw updateError;
        console.log('Glossary links updated.');

        console.log('\nSUCCESS: All changes applied correctly.');
    } catch (err) {
        console.error('ERROR applying changes:', err);
    }
}

apply();
