/**
 * Import 10,000 recipes from food_mood_master_10000.json into Supabase "recetas" table.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_URL = "https://hbiraafgjshhyjhpbqty.supabase.co"
 *   $env:SUPABASE_KEY = "<service_role_key>"
 *   node importar_recetas_supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Config ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL || "https://hbiraafgjshhyjhpbqty.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const JSON_PATH = resolve(__dirname, "public", "data", "food_mood_master_10000.json");
const TABLE_NAME = "recetas";
const BATCH_SIZE = 100;

// All columns in the Supabase "recetas" table
const EXPECTED_COLUMNS = [
  "id", "sexo", "grupo_edad", "nombre_es", "nombre_en",
  "mood_es", "mood_en", "capitulo", "contexto_es", "contexto_en",
  "base_acida", "ingredientes_es", "preparacion_es", "variantes_es",
  "nota_food_mood_es", "qr_es", "qr_en", "tags",
  "tiempo_preparacion_min", "dificultad", "temporada", "tipo_plato"
];

function sanitize(recipe) {
  const row = {};
  for (const col of EXPECTED_COLUMNS) {
    let val = recipe[col] ?? null;

    // jsonb columns: ensure proper arrays/objects
    if (["ingredientes_es", "preparacion_es", "variantes_es"].includes(col)) {
      if (typeof val === "string") {
        try { val = JSON.parse(val); } catch { val = [val]; }
      } else if (val === null) {
        val = [];
      }
    }

    // tags: ensure it's a list of strings
    if (col === "tags") {
      if (typeof val === "string") {
        val = val.split(",").map(t => t.trim()).filter(Boolean);
      } else if (val === null) {
        val = [];
      }
    }

    // tiempo_preparacion_min: ensure int
    if (col === "tiempo_preparacion_min" && val !== null) {
      val = parseInt(val, 10);
      if (isNaN(val)) val = null;
    }

    row[col] = val;
  }
  return row;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // ── Validate env ─────────────────────────────────────────────
  if (!SUPABASE_KEY) {
    console.error("❌ SUPABASE_KEY not set. Run:");
    console.error('   $env:SUPABASE_KEY = "your-service-role-key"');
    process.exit(1);
  }

  // ── Load JSON ────────────────────────────────────────────────
  console.log(`📂 Loading JSON from: ${JSON_PATH}`);
  let rawData;
  try {
    const text = readFileSync(JSON_PATH, "utf-8");
    rawData = JSON.parse(text);
  } catch (err) {
    console.error(`❌ Failed to read/parse JSON: ${err.message}`);
    process.exit(1);
  }

  // Handle both array and { "recetas": [...] } formats
  let recipes;
  if (Array.isArray(rawData)) {
    recipes = rawData;
  } else if (typeof rawData === "object") {
    recipes = rawData.recetas || rawData.recipes || rawData.data;
    if (!recipes) {
      console.error("❌ Unexpected JSON structure. Expected array or { recetas: [...] }");
      process.exit(1);
    }
  }

  const total = recipes.length;
  console.log(`✅ Loaded ${total.toLocaleString()} recipes`);

  // ── Preview first record ─────────────────────────────────────
  if (recipes.length > 0) {
    const sample = recipes[0];
    console.log(`\n🔍 Sample record keys: ${Object.keys(sample).join(", ")}`);
    const missing = EXPECTED_COLUMNS.filter(c => !(c in sample));
    const extra = Object.keys(sample).filter(k => !EXPECTED_COLUMNS.includes(k));
    if (missing.length) console.log(`⚠️  Missing columns (will be NULL): ${missing.join(", ")}`);
    if (extra.length) console.log(`ℹ️  Extra keys (will be ignored): ${extra.join(", ")}`);
  }

  // ── Sanitize ─────────────────────────────────────────────────
  const sanitized = recipes.map(sanitize);

  // ── Connect to Supabase ──────────────────────────────────────
  console.log(`\n🔗 Connecting to Supabase: ${SUPABASE_URL}`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // ── Insert in batches ────────────────────────────────────────
  const numBatches = Math.ceil(total / BATCH_SIZE);
  let inserted = 0;
  let errors = 0;

  console.log(`🚀 Inserting ${total.toLocaleString()} recipes in ${numBatches} batches of ${BATCH_SIZE}...\n`);

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = sanitized.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .upsert(batch, { onConflict: "id" });

      if (error) throw new Error(error.message);

      const count = data ? data.length : batch.length;
      inserted += count;
      const pct = ((inserted / total) * 100).toFixed(1);
      console.log(`  ✅ Batch ${String(batchNum).padStart(3)}/${numBatches} — ${count} rows — total: ${inserted.toLocaleString()}/${total.toLocaleString()} (${pct}%)`);
    } catch (err) {
      errors++;
      console.error(`  ❌ Batch ${String(batchNum).padStart(3)}/${numBatches} FAILED: ${err.message}`);
      if (batch.length > 0) {
        console.error(`     First row id: ${batch[0].id || "?"}`);
      }
    }

    // Small delay to be gentle with Supabase
    await sleep(200);
  }

  // ── Summary ──────────────────────────────────────────────────
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 IMPORT COMPLETE`);
  console.log(`   ✅ Inserted: ${inserted.toLocaleString()}`);
  console.log(`   ❌ Errors:   ${errors}`);
  console.log(`   📋 Table:    ${TABLE_NAME}`);
  console.log(`${"=".repeat(50)}`);
}

main();
