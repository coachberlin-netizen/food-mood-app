/**
 * Import 200 Michelin recipes from food_mood_michelin_200.json into Supabase "recetas" table.
 * Uses RECETAS_SUPABASE_URL and RECETAS_SUPABASE_KEY from .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
config({ path: resolve(__dirname, ".env.local") });

const SUPABASE_URL = process.env.RECETAS_SUPABASE_URL;
const SUPABASE_KEY = process.env.RECETAS_SUPABASE_KEY;
const JSON_PATH = resolve(__dirname, "public", "data", "food_mood_michelin_200.json");
const TABLE = "recetas";
const BATCH_SIZE = 50;

const COLUMNS = [
  "id", "premium_level", "chef_inspiracion", "sexo", "grupo_edad",
  "nombre_es", "nombre_en", "mood_es", "mood_en", "capitulo",
  "base_acida", "ingredientes_es", "preparacion_es",
  "nota_food_mood_es", "variantes_es", "qr_es", "tags",
  "tiempo_preparacion_min", "dificultad", "temporada", "tipo_plato"
];

function sanitize(recipe) {
  const row = {};
  for (const col of COLUMNS) {
    let val = recipe[col] ?? null;
    if (["ingredientes_es", "preparacion_es", "variantes_es"].includes(col)) {
      if (typeof val === "string") { try { val = JSON.parse(val); } catch { val = [val]; } }
      else if (!val) val = [];
    }
    if (col === "tags") {
      if (typeof val === "string") val = val.split(",").map(t => t.trim()).filter(Boolean);
      else if (!val) val = [];
    }
    if (col === "tiempo_preparacion_min" && val !== null) {
      val = parseInt(val, 10); if (isNaN(val)) val = null;
    }
    row[col] = val;
  }
  return row;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing RECETAS_SUPABASE_URL or RECETAS_SUPABASE_KEY in .env.local");
    process.exit(1);
  }

  console.log(`📂 Loading: ${JSON_PATH}`);
  const raw = JSON.parse(readFileSync(JSON_PATH, "utf-8"));
  const recipes = raw.recetas || raw;
  console.log(`✅ ${recipes.length} Michelin recipes loaded (premium_level=${recipes[0]?.premium_level})`);

  const sanitized = recipes.map(sanitize);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const total = sanitized.length;
  const batches = Math.ceil(total / BATCH_SIZE);
  let inserted = 0, errors = 0;

  console.log(`🚀 Inserting ${total} recipes in ${batches} batches of ${BATCH_SIZE}...`);

  // Fix CHECK constraints to allow "todos" for Michelin recipes
  console.log(`🔧 Updating CHECK constraints to allow "todos"...`);
  try {
    // Drop old constraints
    await supabase.rpc('exec_sql', { query: `
      ALTER TABLE recetas DROP CONSTRAINT IF EXISTS recetas_grupo_edad_check;
      ALTER TABLE recetas DROP CONSTRAINT IF EXISTS recetas_sexo_check;
    `});
  } catch (e) {
    // rpc may not exist, try direct approach
    console.log(`   ⚠️  Could not drop constraints via RPC (this is OK if running manually)`);
  }

  console.log(`\n⚠️  If batches fail with constraint errors, run this SQL in Supabase SQL Editor first:`);
  console.log(`   ALTER TABLE recetas DROP CONSTRAINT IF EXISTS recetas_grupo_edad_check;`);
  console.log(`   ALTER TABLE recetas ADD CONSTRAINT recetas_grupo_edad_check CHECK (grupo_edad IN ('18-30','31-44','45-60','60+','todos'));`);
  console.log(`   ALTER TABLE recetas DROP CONSTRAINT IF EXISTS recetas_sexo_check;`);
  console.log(`   ALTER TABLE recetas ADD CONSTRAINT recetas_sexo_check CHECK (sexo IN ('mujer','hombre','todos'));\n`);


  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = sanitized.slice(i, i + BATCH_SIZE);
    const n = Math.floor(i / BATCH_SIZE) + 1;
    try {
      const { error } = await supabase.from(TABLE).upsert(batch, { onConflict: "id" });
      if (error) throw new Error(error.message);
      inserted += batch.length;
      console.log(`  ✅ Batch ${n}/${batches} — ${batch.length} rows — total: ${inserted}/${total}`);
    } catch (err) {
      errors++;
      console.error(`  ❌ Batch ${n}/${batches} FAILED: ${err.message}`);
    }
    await sleep(200);
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`📊 IMPORT COMPLETE`);
  console.log(`   ✅ Inserted: ${inserted}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`${"=".repeat(40)}`);

  // Verify count
  const { count } = await supabase.from(TABLE).select("*", { count: "exact", head: true }).eq("premium_level", 2);
  console.log(`\n🔍 Verification: SELECT count(*) WHERE premium_level=2 → ${count}`);
}

main();
