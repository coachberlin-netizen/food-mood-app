#!/usr/bin/env python3
"""
Import 10,000 recipes from food_mood_master_10000.json into Supabase "recetas" table.

Usage:
  $env:SUPABASE_URL = "https://hbiraafgjshhyjhpbqty.supabase.co"
  $env:SUPABASE_KEY = "<service_role_key>"
  python importar_recetas_supabase.py
"""

import json
import os
import sys
import time

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing dependency. Install with: pip install supabase")
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://hbiraafgjshhyjhpbqty.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
JSON_PATH = os.path.join(os.path.dirname(__file__), "public", "data", "food_mood_master_10000.json")
TABLE_NAME = "recetas"
BATCH_SIZE = 100

# All columns in the Supabase "recetas" table
EXPECTED_COLUMNS = [
    "id", "sexo", "grupo_edad", "nombre_es", "nombre_en",
    "mood_es", "mood_en", "capitulo", "contexto_es", "contexto_en",
    "base_acida", "ingredientes_es", "preparacion_es", "variantes_es",
    "nota_food_mood_es", "qr_es", "qr_en", "tags",
    "tiempo_preparacion_min", "dificultad", "temporada", "tipo_plato"
]

def main():
    # ── Validate env ─────────────────────────────────────────────
    if not SUPABASE_KEY:
        print("❌ SUPABASE_KEY not set. Run:")
        print('   $env:SUPABASE_KEY = "your-service-role-key"')
        sys.exit(1)

    # ── Load JSON ────────────────────────────────────────────────
    print(f"📂 Loading JSON from: {JSON_PATH}")
    if not os.path.exists(JSON_PATH):
        print(f"❌ File not found: {JSON_PATH}")
        print("   Copy the JSON to public/data/food_mood_master_10000.json first.")
        sys.exit(1)

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    # Handle both array and { "recetas": [...] } formats
    if isinstance(raw_data, list):
        recipes = raw_data
    elif isinstance(raw_data, dict):
        # Try common wrapper keys
        for key in ["recetas", "recipes", "data"]:
            if key in raw_data:
                recipes = raw_data[key]
                break
        else:
            print("❌ Unexpected JSON structure. Expected an array or object with 'recetas' key.")
            sys.exit(1)
    else:
        print("❌ Unexpected JSON structure.")
        sys.exit(1)

    total = len(recipes)
    print(f"✅ Loaded {total:,} recipes")

    # ── Preview first record ─────────────────────────────────────
    if recipes:
        sample = recipes[0]
        print(f"\n🔍 Sample record keys: {list(sample.keys())}")
        missing = [col for col in EXPECTED_COLUMNS if col not in sample]
        extra = [k for k in sample.keys() if k not in EXPECTED_COLUMNS]
        if missing:
            print(f"⚠️  Missing columns in JSON (will be NULL): {missing}")
        if extra:
            print(f"ℹ️  Extra keys in JSON (will be ignored): {extra}")

    # ── Sanitize rows ────────────────────────────────────────────
    def sanitize(recipe: dict) -> dict:
        """Keep only expected columns, ensure correct types."""
        row = {}
        for col in EXPECTED_COLUMNS:
            val = recipe.get(col)

            # jsonb columns: ensure they are proper lists/dicts
            if col in ("ingredientes_es", "preparacion_es", "variantes_es"):
                if isinstance(val, str):
                    try:
                        val = json.loads(val)
                    except json.JSONDecodeError:
                        val = [val]  # wrap string as single-item list
                elif val is None:
                    val = []

            # tags: ensure it's a list of strings
            if col == "tags":
                if isinstance(val, str):
                    val = [t.strip() for t in val.split(",") if t.strip()]
                elif val is None:
                    val = []

            # tiempo_preparacion_min: ensure int
            if col == "tiempo_preparacion_min":
                if val is not None:
                    try:
                        val = int(val)
                    except (ValueError, TypeError):
                        val = None

            row[col] = val
        return row

    sanitized = [sanitize(r) for r in recipes]

    # ── Connect to Supabase ──────────────────────────────────────
    print(f"\n🔗 Connecting to Supabase: {SUPABASE_URL}")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── Insert in batches ────────────────────────────────────────
    num_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE
    inserted = 0
    errors = 0

    print(f"🚀 Inserting {total:,} recipes in {num_batches} batches of {BATCH_SIZE}...\n")

    for i in range(0, total, BATCH_SIZE):
        batch = sanitized[i : i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1

        try:
            result = supabase.table(TABLE_NAME).upsert(batch, on_conflict="id").execute()
            count = len(result.data) if result.data else len(batch)
            inserted += count
            pct = (inserted / total) * 100
            print(f"  ✅ Batch {batch_num:>3}/{num_batches} — {count} rows — total: {inserted:,}/{total:,} ({pct:.1f}%)")
        except Exception as e:
            errors += 1
            print(f"  ❌ Batch {batch_num:>3}/{num_batches} FAILED: {e}")
            # Print the first failing row for debug
            if batch:
                print(f"     First row id: {batch[0].get('id', '?')}")

        # Small delay to be gentle with Supabase
        time.sleep(0.2)

    # ── Summary ──────────────────────────────────────────────────
    print(f"\n{'='*50}")
    print(f"📊 IMPORT COMPLETE")
    print(f"   ✅ Inserted: {inserted:,}")
    print(f"   ❌ Errors:   {errors}")
    print(f"   📋 Table:    {TABLE_NAME}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
