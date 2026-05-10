#!/usr/bin/env node
'use strict';
const https = require('https');

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';

function query(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const P = id => `https://images.unsplash.com/${id}?w=800&h=440&fit=crop&q=80&auto=format`;

const BROTH    = P('photo-1547592180-85f173990554'); // miso/broth — warm bowl
const COFFEE   = P('photo-1495474472287-4d71bcdd2085'); // espresso/dark drink
const EGGS     = P('photo-1525351484163-7529414344d8'); // eggs
const BEET     = P('photo-1587735243615-c03f25aaff15'); // beet/pickled veg
const AVOCADO  = P('photo-1523049673857-eb18f1d7b578'); // avocado/green dip
const KEFIR    = P('photo-1488477181946-6428a0291777'); // kefir/smoothie (not cocktail)
const SALAD    = P('photo-1512621776951-a57141f2eefd'); // salad/vinaigrette
const MATCHA   = P('photo-1556679343-c7306c1976bc');   // matcha/calm ritual
const ALMOND   = P('photo-1508061253366-f7da158b6d46'); // almonds/nuts

// BAD photo IDs currently in DB that need replacing
const BAD_CITRUS   = '%1601493700631%'; // cocktail-looking "citrus"
const BAD_SMOOTHIE = '%1497534446932%'; // cocktail-looking "smoothie"
const BAD_CACAO    = '%1542990253%';    // wrong cacao drink
const BAD_SPINACH  = '%1576045057995%'; // spinach (used for tortilla — but spinach recipe should keep it)
const BAD_OLD      = '%1511381939415%'; // old bad photo

function sqlStr(s) {
  return "'" + s.replace(/'/g, "''") + "'";
}

// Targeted fixes: match by recipe name + optionally current bad photo ID
const sql = `
UPDATE recetas
SET image_url = CASE
  -- ritual nocturno / caldo de huesos → broth photo
  WHEN LOWER(nombre_es) LIKE '%ritual nocturno%' OR LOWER(nombre_es) LIKE '%caldo de huesos%'
    THEN ${sqlStr(BROTH)}

  -- shot matinal and all shots with bad citrus photo → coffee/espresso
  WHEN (LOWER(nombre_es) LIKE '%shot%' OR LOWER(nombre_es) LIKE '%elixir%')
    AND image_url LIKE ${sqlStr(BAD_CITRUS)}
    THEN ${sqlStr(COFFEE)}

  -- cacao ceremonial (any variant) → coffee/dark drink photo
  WHEN LOWER(nombre_es) LIKE '%cacao ceremonial%'
    THEN ${sqlStr(COFFEE)}

  -- tortilla de espinacas AND tortilla de (but NOT nori, NOT tortitas) → eggs photo
  WHEN LOWER(nombre_es) LIKE '%tortilla de%'
    AND LOWER(nombre_es) NOT LIKE '%nori%'
    AND LOWER(nombre_es) NOT LIKE '%tortitas%'
    THEN ${sqlStr(EGGS)}

  -- cebolla encurtida and similar encurtidos with bad old photo → beet/pickle
  WHEN (LOWER(nombre_es) LIKE '%cebolla encurtida%' OR LOWER(nombre_es) LIKE '%encurtido%')
    AND image_url LIKE ${sqlStr(BAD_OLD)}
    THEN ${sqlStr(BEET)}

  -- dip acid green → avocado green photo
  WHEN LOWER(nombre_es) LIKE '%dip%' AND LOWER(nombre_es) LIKE '%green%'
    THEN ${sqlStr(AVOCADO)}

  -- shrub de jengibre / naranja → matcha (warm tones, not cocktail)
  WHEN LOWER(nombre_es) LIKE '%shrub%'
    AND image_url LIKE ${sqlStr(BAD_CITRUS)}
    THEN ${sqlStr(MATCHA)}

  -- ritual agua tibia / ritual de despertar → matcha/calm
  WHEN (LOWER(nombre_es) LIKE '%agua tibia%' OR LOWER(nombre_es) LIKE '%ritual de despertar%' OR LOWER(nombre_es) LIKE '%ritual matinal%')
    THEN ${sqlStr(MATCHA)}

  -- vinagreta wake up → salad photo
  WHEN LOWER(nombre_es) LIKE '%vinagreta%'
    AND image_url LIKE ${sqlStr(BAD_CITRUS)}
    THEN ${sqlStr(SALAD)}

  -- snack parada técnica (almendras) → almond photo
  WHEN LOWER(nombre_es) LIKE '%snack%' AND LOWER(nombre_es) LIKE '%parada%'
    THEN ${sqlStr(ALMOND)}

  -- all batidos/smoothies with cocktail-looking photo → kefir photo
  WHEN (LOWER(nombre_es) LIKE '%batido%' OR LOWER(nombre_es) LIKE '%smoothie%')
    AND image_url LIKE ${sqlStr(BAD_SMOOTHIE)}
    THEN ${sqlStr(KEFIR)}

  -- all remaining bad citrus photos → matcha (neutral, warm)
  WHEN image_url LIKE ${sqlStr(BAD_CITRUS)}
    THEN ${sqlStr(MATCHA)}

  -- all remaining bad smoothie photos → kefir
  WHEN image_url LIKE ${sqlStr(BAD_SMOOTHIE)}
    THEN ${sqlStr(KEFIR)}

  -- all remaining bad cacao photos → coffee
  WHEN image_url LIKE ${sqlStr(BAD_CACAO)}
    THEN ${sqlStr(COFFEE)}

  ELSE image_url
END
WHERE
  image_url LIKE ${sqlStr(BAD_CITRUS)}
  OR image_url LIKE ${sqlStr(BAD_SMOOTHIE)}
  OR image_url LIKE ${sqlStr(BAD_CACAO)}
  OR image_url LIKE ${sqlStr(BAD_OLD)}
  OR LOWER(nombre_es) LIKE '%ritual nocturno%'
  OR LOWER(nombre_es) LIKE '%caldo de huesos%'
  OR LOWER(nombre_es) LIKE '%cacao ceremonial%'
  OR LOWER(nombre_es) LIKE '%tortilla de%'
  OR LOWER(nombre_es) LIKE '%snack%parada%'
  OR LOWER(nombre_es) LIKE '%agua tibia%'
  OR LOWER(nombre_es) LIKE '%ritual de despertar%'
  OR LOWER(nombre_es) LIKE '%dip%green%'
`.trim();

async function main() {
  if (!TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }

  console.log('Running round-2 photo fixes...');
  const result = await query(sql);
  console.log('Result:', JSON.stringify(result, null, 2));

  // Verify a sample
  const check = await query(`
    SELECT nombre_es, LEFT(image_url, 80) AS photo
    FROM recetas
    WHERE LOWER(nombre_es) LIKE '%shot%'
       OR LOWER(nombre_es) LIKE '%batido%'
       OR LOWER(nombre_es) LIKE '%cacao ceremonial%'
       OR LOWER(nombre_es) LIKE '%tortilla de%'
       OR LOWER(nombre_es) LIKE '%ritual nocturno%'
       OR LOWER(nombre_es) LIKE '%caldo de huesos%'
    ORDER BY nombre_es
    LIMIT 20
  `);
  console.log('\nSample check:', JSON.stringify(check, null, 2));
}

main().catch(console.error);
