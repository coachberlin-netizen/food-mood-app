const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ID schema uses: [recipe-slug]-mujer-[age-group]
// For men we used: [recipe-slug]-[age-group] or [recipe-slug]-hombre-[age-group]
// We will use "-mujer-[age-group]" as it's perfectly explicit.

const RECIPES = [
    // -----------------------------------------------------
    // GRUPO 18-30
    // -----------------------------------------------------
    {
        id: 'bowl-vitalidad-celular-mujer-18-30', sexo: 'mujer', grupo_edad: '18-30', nombre_es: 'Bowl de Vitalidad Celular (Cordyceps y Hierro)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Remolacha asada", "Quinoa", "Extracto de Cordyceps", "Semillas de calabaza", "Rúcula fresca"],
        preparacion_es: ["Asar la remolacha y cocinar la quinoa.", "Mezclar el extracto de cordyceps con un ligero aliño de aceite de oliva.", "Montar sobre la rúcula con las semillas de calabaza tostadas."],
        nota_food_mood_es: 'Nota Food·Mood: La remolacha aporta hierro fundamental como cofactor para la síntesis de docenas de neurotransmisores (incluyendo la dopamina). El Cordyceps maximiza la oxigenación celular, dándote energía clara sin picos de nerviosismo.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Bowl'
    },
    {
        id: 'salmon-horno-sesamo-jengibre-mujer-18-30', sexo: 'mujer', grupo_edad: '18-30', nombre_es: 'Salmón al Horno con Costra de Sésamo y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Lomo de salmón fresco", "Semillas de sésamo", "Jengibre fresco rallado", "Brócoli", "Limón"],
        preparacion_es: ["Cubrir el salmón con sésamo y ralladura de jengibre.", "Hornear a 200ºC durante 12-15 minutos.", "Servir acompañado de brócoli al vapor al dente y un buen chorro de limón."],
        nota_food_mood_es: 'Nota Food·Mood: Los ácidos grasos Omega-3 son claves para mantener estables las membranas neuronales y reducir la neuroinflamación. El jengibre activa las vías de comunicación del eje intestino-cerebro, promoviendo vitalidad.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'smoothie-claridad-brillo-mujer-18-30', sexo: 'mujer', grupo_edad: '18-30', nombre_es: 'Smoothie "Claridad y Brillo" (Antioxidante Cerebral)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Arándanos silvestres", "Cordyceps en polvo", "Crema de almendras", "Espinacas baby", "Agua de coco"],
        preparacion_es: ["Verter el agua de coco fría en la batidora.", "Añadir los arándanos, la crema de almendras y las espinacas.", "Incorporar el polvo de cordyceps y batir a máxima potencia hasta emulsionar bien."],
        nota_food_mood_es: 'Nota Food·Mood: Los polifenoles de los arándanos son un blindaje neuroprotector inigualable. Al sumarle la capacidad del Cordyceps de aumentar la producción de ATP, consigues un foco sostenido para tu jornada.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida/Activador'
    },
    {
        id: 'tostas-masa-madre-hummus-curcuma-mujer-18-30', sexo: 'mujer', grupo_edad: '18-30', nombre_es: 'Tostas de Masa Madre con Hummus de Cúrcuma y Germinados',
        mood_es: 'Activación & Energía', ingredientes_es: ["Rebanadas de pan de masa madre", "Hummus casero", "Cúrcuma en polvo", "Germinados de rábano", "Aguacate"],
        preparacion_es: ["Tostar ligeramente la masa madre.", "Mezclar una pizca de cúrcuma en el hummus hasta que tome un color dorado profundo.", "Untar generosamente el pan, añadir rodajas finas de aguacate y coronar con germinados."],
        nota_food_mood_es: 'Nota Food·Mood: La fermentación lenta del pan de masa madre garantiza una liberación de glucosa prolongada y sin picos. La cúrcuma es una especia reina para prevenir los síntomas de niebla mental por fatiga.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Brunch'
    },

    // -----------------------------------------------------
    // GRUPO 31-44
    // -----------------------------------------------------
    {
        id: 'bowl-vitalidad-celular-mujer-31-44', sexo: 'mujer', grupo_edad: '31-44', nombre_es: 'Bowl de Vitalidad Celular (Cordyceps y Hierro)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Remolacha asada", "Quinoa", "Extracto de Cordyceps", "Semillas de calabaza", "Rúcula fresca"],
        preparacion_es: ["Asar la remolacha y cocinar la quinoa.", "Mezclar el extracto de cordyceps con un ligero aliño de aceite de oliva.", "Montar sobre la rúcula con las semillas de calabaza tostadas."],
        nota_food_mood_es: 'Nota Food·Mood: La remolacha aporta hierro fundamental como cofactor para la síntesis de neurotransmisores clave. El Cordyceps mejora la oxigenación celular, proporcionando energía nítida para sobrellevar la carga mental diaria.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Bowl'
    },
    {
        id: 'salmon-horno-sesamo-jengibre-mujer-31-44', sexo: 'mujer', grupo_edad: '31-44', nombre_es: 'Salmón al Horno con Costra de Sésamo y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Lomo de salmón fresco", "Semillas de sésamo", "Jengibre fresco rallado", "Brócoli", "Limón"],
        preparacion_es: ["Cubrir el salmón con sésamo y ralladura de jengibre.", "Hornear a 200ºC durante 12-15 minutos.", "Servir acompañado de brócoli al vapor al dente y limón."],
        nota_food_mood_es: 'Nota Food·Mood: Durante las fluctuaciones hormonales vitales, los Omega-3 funcionan como ancla emocional protectora. El jengibre activa las vías neuroendocrinas que sostienen tu nivel de alerta.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'smoothie-claridad-brillo-mujer-31-44', sexo: 'mujer', grupo_edad: '31-44', nombre_es: 'Smoothie "Claridad y Brillo" (Antioxidante Cerebral)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Arándanos silvestres", "Cordyceps en polvo", "Crema de almendras", "Espinacas baby", "Agua de coco"],
        preparacion_es: ["Verter el agua de coco fría en la batidora.", "Añadir los arándanos, la crema de almendras y las espinacas.", "Incorporar el polvo de cordyceps y batir a máxima potencia."],
        nota_food_mood_es: 'Nota Food·Mood: Los polifenoles refuerzan los vasos capilares del cerebro previendo la fatiga por sobreexigencia. El Cordyceps multiplica el ATP, combatiendo esa sensación de "bajón de tarde".',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida/Activador'
    },
    {
        id: 'tostas-masa-madre-hummus-curcuma-mujer-31-44', sexo: 'mujer', grupo_edad: '31-44', nombre_es: 'Tostas de Masa Madre con Hummus de Cúrcuma y Germinados',
        mood_es: 'Activación & Energía', ingredientes_es: ["Rebanadas de pan de masa madre", "Hummus casero", "Cúrcuma en polvo", "Germinados de rábano", "Aguacate"],
        preparacion_es: ["Tostar la masa madre.", "Añadir una pizca de cúrcuma al hummus y untar.", "Coronar con rodajas de aguacate y germinados frescos."],
        nota_food_mood_es: 'Nota Food·Mood: Tu cerebro es muy sensible a los desniveles de glucosa; la masa madre te da estabilidad prolongada. La cúrcuma es un modulador inflamatorio excepcional para los receptores cerebrales.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Brunch'
    },

    // -----------------------------------------------------
    // GRUPO 45-60
    // -----------------------------------------------------
    {
        id: 'bowl-vitalidad-celular-mujer-45-60', sexo: 'mujer', grupo_edad: '45-60', nombre_es: 'Bowl de Vitalidad Celular (Cordyceps y Hierro)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Remolacha asada", "Quinoa", "Extracto de Cordyceps", "Semillas de calabaza", "Rúcula fresca"],
        preparacion_es: ["Asar la remolacha y cocinar la quinoa.", "Mezclar el extracto de cordyceps con aceite de oliva.", "Montar sobre la rúcula con calabaza tostada."],
        nota_food_mood_es: 'Nota Food·Mood: La transición hormonal puede hacer que te fatigues antes; aquí el Cordyceps asiste incrementando el ATP de base en cada célula. El hierro apoya la producción continua de precursores dopaminérgicos.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Bowl'
    },
    {
        id: 'salmon-horno-sesamo-jengibre-mujer-45-60', sexo: 'mujer', grupo_edad: '45-60', nombre_es: 'Salmón al Horno con Costra de Sésamo y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Lomo de salmón fresco", "Semillas de sésamo", "Jengibre fresco rallado", "Brócoli", "Limón"],
        preparacion_es: ["Cubrir el salmón con sésamo y ralladura de jengibre.", "Hornear a 200ºC durante 12-15 minutos.", "Servir acompañado de brócoli al vapor."],
        nota_food_mood_es: 'Nota Food·Mood: Esencial para acompañar el sistema endocrino; el sésamo aporta fitoestrógenos ligeros y el Omega-3 del salmón actúa directamente calmando posibles desajustes neuro-emocionales mientras te mantiene a punto.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'smoothie-claridad-brillo-mujer-45-60', sexo: 'mujer', grupo_edad: '45-60', nombre_es: 'Smoothie "Claridad y Brillo" (Antioxidante Cerebral)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Arándanos silvestres", "Cordyceps en polvo", "Crema de almendras", "Espinacas baby", "Agua de coco"],
        preparacion_es: ["Verter el agua de coco fría en la batidora.", "Añadir los arándanos, la crema de almendras, espinacas y el polvo de cordyceps.", "Batir hasta emulsionar."],
        nota_food_mood_es: 'Nota Food·Mood: Perfecto recurso antioxidante concentrado. Mitiga esos momentos de "mente densa" de forma gentil y rápida multiplicando la oxigenación con los extractos del hongo.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida/Activador'
    },
    {
        id: 'tostas-masa-madre-hummus-curcuma-mujer-45-60', sexo: 'mujer', grupo_edad: '45-60', nombre_es: 'Tostas de Masa Madre con Hummus de Cúrcuma y Germinados',
        mood_es: 'Activación & Energía', ingredientes_es: ["Rebanadas de pan de masa madre", "Hummus casero", "Cúrcuma en polvo", "Germinados de rábano", "Aguacate"],
        preparacion_es: ["Tostar levemente la masa madre.", "Enriquecer el hummus con cúrcuma.", "Untar espesamente el pan, añadiendo encima aguacate y germinados."],
        nota_food_mood_es: 'Nota Food·Mood: Aporta saciedad emocional y física de larguísima duración. La textura de la masa madre ayuda a masticar más, activando señales de plenitud y lucidez para tu jornada.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Brunch'
    },

    // -----------------------------------------------------
    // GRUPO 60+
    // -----------------------------------------------------
    {
        id: 'bowl-vitalidad-celular-mujer-60-plus', sexo: 'mujer', grupo_edad: '60+', nombre_es: 'Bowl de Vitalidad Celular (Cordyceps y Hierro)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Remolacha asada", "Quinoa", "Extracto de Cordyceps", "Semillas de calabaza", "Rúcula fresca"],
        preparacion_es: ["Asar la remolacha suavemente, cocer la quinoa para que quede melosa.", "Acompañar con hilo de aceite y extracto de cordyceps.", "Terminar con las semillas de calabaza."],
        nota_food_mood_es: 'Nota Food·Mood: Combate la pérdida de vitalidad natural oxigenando el circuito neuronal desde dentro (Cordyceps) y apoyando la matriz de neurotransmisores estables mediante un suministro limpio de oligoelementos (hierro, zinc).',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 15, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Bowl'
    },
    {
        id: 'salmon-horno-sesamo-jengibre-mujer-60-plus', sexo: 'mujer', grupo_edad: '60+', nombre_es: 'Salmón al Horno con Costra de Sésamo y Jengibre',
        mood_es: 'Activación & Energía', ingredientes_es: ["Lomo de salmón fresco", "Semillas de sésamo", "Jengibre rallado fino", "Brócoli pelado", "Limón"],
        preparacion_es: ["Pincelar el salmón con aceite y adherir sésamo y el jengibre.", "Hornear a 190ºC por 12 minutos.", "Guarnecer con floretes muy tiernos de brócoli."],
        nota_food_mood_es: 'Nota Food·Mood: En esta etapa, el soporte de ácidos grasos (Omega-3) es oro neuroprotector para la salud general del cerebro, protegiendo contra el desgaste sin sentir ninguna digestión pesada.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 25, dificultad: 'Media', temporada: 'Todas', tipo_plato: 'Principal'
    },
    {
        id: 'smoothie-claridad-brillo-mujer-60-plus', sexo: 'mujer', grupo_edad: '60+', nombre_es: 'Smoothie "Claridad y Brillo" (Antioxidante Cerebral)',
        mood_es: 'Activación & Energía', ingredientes_es: ["Arándanos silvestres", "Cordyceps en polvo", "Crema de almendras tostadas", "Espinacas baby", "Agua natural"],
        preparacion_es: ["Triturar con agua todos los ingredientes y el polvo de cordyceps a alta potencia hasta conseguir textura muy fluida."],
        nota_food_mood_es: 'Nota Food·Mood: La hidratación profunda se combina con fitoquímicos clave que ralentizan el envejecimiento cognitivo prematuro y dan un foco muy claro al inicio del día.',
        segmento: 'adulto', premium_level: 0, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Bebida/Activador'
    },
    {
        id: 'tostas-masa-madre-hummus-curcuma-mujer-60-plus', sexo: 'mujer', grupo_edad: '60+', nombre_es: 'Tostas de Masa Madre con Hummus de Cúrcuma y Germinados',
        mood_es: 'Activación & Energía', ingredientes_es: ["Rebanadas muy finas de pan de masa madre", "Hummus casero de garbanzo", "Cúrcuma", "Germinados de rábano", "Aguacate untable"],
        preparacion_es: ["Tostar el pan delicadamente.", "Teñir el hummus con abundante cúrcuma antiinflamatoria, disponer encima finas lascas de aguacate y coronar."],
        nota_food_mood_es: 'Nota Food·Mood: La cúrcuma te protege a nivel neuroinflamatorio para mantener la agilidad mental intacta. Al mismo tiempo, consigues un desayuno placentero, digerible y sostenido.',
        segmento: 'adulto', premium_level: 1, tiempo_preparacion_min: 10, dificultad: 'Fácil', temporada: 'Todas', tipo_plato: 'Desayuno/Brunch'
    }
];

async function apply() {
    try {
        console.log('--- Applying Women Recipes ---');
        const { error: rError } = await supabase.from('recetas').upsert(RECIPES, { onConflict: 'id' });
        if (rError) throw rError;
        console.log('16 Women recipes applied successfully.');

        console.log('--- Checking applied data ---');
        const { count, error: countError } = await supabase
            .from('recetas')
            .select('*', { count: 'exact', head: true })
            .eq('sexo', 'mujer')
            .eq('mood_es', 'Activación & Energía');
        if (countError) throw countError;
        console.log(`Total records in DB for Mujeres + Activación & Energía: ${count}`);

        console.log('\nSUCCESS: Recipes generated appropriately.');
    } catch (err) {
        console.error('ERROR applying changes:', err);
    }
}

apply();
