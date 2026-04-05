import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing RECETAS_SUPABASE_URL or RECETAS_SUPABASE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const recipe = {
  sexo: "todos",
  grupo_edad: "adultos",
  nombre_es: "Bosque Azul & Oro",
  nombre_en: "Blue & Gold Forest",
  mood_es: "foco",
  mood_en: "focus",
  capitulo: "niebla_mental",
  contexto_es: "Para esas mañanas de densidad cognitiva donde el pensamiento se siente nublado. Un ritual de bioflavonoides para despejar el cielo mental.",
  contexto_en: "For those mornings of cognitive density where thoughts feel cloudy. A bioflavonoid ritual to clear the mental sky.",
  base_acida: true,
  ingredientes_es: "1 taza de Kéfir de cabra o kéfir de coco (vivo)\n1/2 taza de Arándanos silvestres (frescos o congelados)\n3 Nueces del Brasil (activadas)\n1 cdta de Cúrcuma en polvo + pizca de pimienta negra\n1 cdta de Semillas de Cáñamo\n1 chorrito de Miel cruda (opcional)",
  preparacion_es: "1. Vierte el kéfir en un cuenco de cerámica.\n2. Disuelve la cúrcuma y la pimienta en el kéfir hasta que adquiera un tono dorado uniforme.\n3. Incorpora los arándanos, rompiendo algunos con el dorso de la cuchara para que liberen su tinta morada.\n4. Trocea las nueces con las manos y espolvoréalas junto a las semillas de cáñamo.\n5. Saborea cada bocado lentamente, permitiendo que la frescura despierte tus sentidos.",
  variantes_es: "Opción vegana: Sustituye el kéfir de cabra por kéfir de anacardo o coco fermentado.",
  nota_food_mood_es: "Las antocianinas del arándano silvestre cruzan la barrera hematoencefálica protegiendo las neuronas del estrés oxidativo, mientras que la curcumina (activada por la piperina) reduce la neuroinflamación latente que causa la niebla mental. El selenio de la nuez del Brasil y el omega-3 del cáñamo son fundamentales para la integridad de la mielina. Los colores violeta profundo, amarillo oro y blanco cremoso indican una sinergia potente de polifenoles. El eje intestino-cerebro recibe claridad, protección y orden.",
  qr_es: null,
  qr_en: null,
  tags: ["niebla mental", "foco", "arándanos", "cúrcuma", "omega-3"],
  tiempo_preparacion_min: 5,
  dificultad: "facil",
  temporada: "todo_el_ano",
  tipo_plato: "desayuno",
  premium_level: 0,
  chef_inspiracion: "Inspirada en el foraging nórdico y la medicina ayurvédica.",
  segmento: "mental"
};

async function insertRecipe() {
  console.log("🚀 Generando e insertando receta de Susana Ferreras...");
  
  // Notice: The table expects specific columns, so we match the RPC argument if it exists,
  // otherwise we use a direct insert to the 'recetas' table.
  
  const { data, error } = await supabase.rpc('insert_receta', { p_receta: recipe });

  if (error) {
    console.warn("⚠️  RPC 'insert_receta' failed. Falling back to direct insert...");
    const { data: directData, error: directError } = await supabase
      .from('recetas')
      .insert([recipe]);

    if (directError) {
      console.error("❌ Error al insertar la receta (directo):", directError.message);
      process.exit(1);
    }
    console.log("✅ Receta 'Bosque Azul & Oro' insertada con éxito (directo).");
  } else {
    console.log("✅ Receta 'Bosque Azul & Oro' insertada con éxito via RPC.");
  }

  console.log("📄 Datos insertados:", JSON.stringify(recipe, null, 2));
}

insertRecipe();
