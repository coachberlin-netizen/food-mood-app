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
    req.write(body); req.end();
  });
}

const P = id => `https://images.unsplash.com/${id}?w=800&h=440&fit=crop&q=80&auto=format`;

const CHOC_DES    = P('photo-1481391243133-f96216dcb5d2'); // chocolate/truffle dessert
const BOWL        = P('photo-1484723091739-30990ff50527'); // colorful bowl
const CHICKEN     = P('photo-1598103442097-8b74394b960e'); // chicken dish
const SARDINE     = P('photo-1534482421-64566f976cfa');    // sardines/fish tin
const RAMEN       = P('photo-1574484284002-952d92456975'); // ramen bowl
const PASTA       = P('photo-1548247416-ec66f4900b2e');    // pasta
const SOUP        = P('photo-1547592180-85f173990554');    // soup/broth
const SALAD       = P('photo-1512621776951-a57141f2eefd'); // salad/vinaigrette
const BEET        = P('photo-1587735243615-c03f25aaff15'); // beet/encurtido
const CAULIFLOWER = P('photo-1568584711271-6c929fb49b60'); // cauliflower
const CHERRY      = P('photo-1528821128474-27f963b062bf'); // cherry
const KEFIR       = P('photo-1488477181946-6428a0291777'); // kefir/smoothie bowl
const PORRIDGE    = P('photo-1517673132405-6b0592a8fb4d'); // porridge/oats
const KIMCHI      = P('photo-1583623025817-d180a2221d0a'); // fermented/kimchi

function sqlStr(s) { return "'" + s.replace(/'/g, "''") + "'"; }

// Each statement targets specific cases where the general rule got the wrong winner.
// Strategy: run several targeted UPDATEs rather than one big CASE to avoid ordering issues.
const UPDATES = [
  // 1. TRUFAS DE CACAO — loses to 'almendra' rule. Fix: target explicitly.
  `UPDATE recetas SET image_url = ${sqlStr(CHOC_DES)}
   WHERE LOWER(nombre_es) LIKE '%trufa%' AND LOWER(nombre_es) LIKE '%cacao%'`,

  // 2. RAMEN — no rule exists at all in main script. RAMEN photo added.
  `UPDATE recetas SET image_url = ${sqlStr(RAMEN)}
   WHERE LOWER(nombre_es) LIKE '%ramen%'`,

  // 3. PASTA WITH FISH — 'sardina' wins over 'pasta' because fish section is earlier.
  //    If it's explicitly "pasta con/de", pasta photo wins.
  `UPDATE recetas SET image_url = ${sqlStr(PASTA)}
   WHERE LOWER(nombre_es) LIKE '%pasta%' AND (
     LOWER(nombre_es) LIKE '%sardina%' OR
     LOWER(nombre_es) LIKE '%piñon%' OR
     LOWER(nombre_es) LIKE '%pesto%'
   )`,

  // 4. SOPA WITH FIDEOS — 'fideos' wins over 'sopa'. Soup photo for these.
  `UPDATE recetas SET image_url = ${sqlStr(SOUP)}
   WHERE LOWER(nombre_es) LIKE '%sopa%' AND LOWER(nombre_es) LIKE '%fideo%'`,

  // 5. CREMA DE BONIATO — 'boniato' wins over 'crema de'. Soup photo.
  `UPDATE recetas SET image_url = ${sqlStr(SOUP)}
   WHERE LOWER(nombre_es) LIKE '%crema de boniato%'
      OR LOWER(nombre_es) LIKE '%crema de%' AND LOWER(nombre_es) LIKE '%boniato%'`,

  // 6. ENSALADA DE OTOÑO CON BONIATO — boniato rule wins over ensalada. Fix.
  `UPDATE recetas SET image_url = ${sqlStr(SALAD)}
   WHERE LOWER(nombre_es) LIKE '%ensalada%' AND LOWER(nombre_es) LIKE '%boniato%'`,

  // 7. ENSALADA DE LENTEJAS CON REMOLACHA — lenteja wins over ensalada. Fix.
  `UPDATE recetas SET image_url = ${sqlStr(SALAD)}
   WHERE LOWER(nombre_es) LIKE '%ensalada%' AND LOWER(nombre_es) LIKE '%lenteja%'`,

  // 8. ENCURTIDO DE REMOLACHA — 'encurtido'→kimchi wins over 'remolacha'→beet. Fix.
  `UPDATE recetas SET image_url = ${sqlStr(BEET)}
   WHERE LOWER(nombre_es) LIKE '%encurtido%' AND LOWER(nombre_es) LIKE '%remolacha%'`,

  // 9. MARINADA — was cocktail, then matcha; should be salad/herb green.
  `UPDATE recetas SET image_url = ${sqlStr(SALAD)}
   WHERE LOWER(nombre_es) LIKE '%marinada%'`,

  // 10. BOL DE CACAO CHÍ A Y PLÁTANO — should be a food bowl, not chocolate dessert.
  `UPDATE recetas SET image_url = ${sqlStr(BOWL)}
   WHERE LOWER(nombre_es) LIKE '%bol%' AND LOWER(nombre_es) LIKE '%cacao%' AND LOWER(nombre_es) LIKE '%plátano%'`,
  `UPDATE recetas SET image_url = ${sqlStr(BOWL)}
   WHERE LOWER(nombre_es) LIKE '%bol%' AND LOWER(nombre_es) LIKE '%cacao%' AND LOWER(nombre_es) LIKE '%platano%'`,

  // 11. BOL/BOWL DE VITALIDAD — should show a colorful bowl, not generic.
  `UPDATE recetas SET image_url = ${sqlStr(BOWL)}
   WHERE LOWER(nombre_es) LIKE '%bowl de vitalidad%'
      OR LOWER(nombre_es) LIKE '%bol de vitalidad%'`,

  // 12. SHRUB DE FRESA — now shows matcha but kefir looks better (creamy/pink).
  `UPDATE recetas SET image_url = ${sqlStr(KEFIR)}
   WHERE LOWER(nombre_es) LIKE '%shrub%' AND LOWER(nombre_es) LIKE '%fresa%'`,

  // 13. PORRIDGE NOCTURNO CON CEREZA — show cherry not plain porridge.
  `UPDATE recetas SET image_url = ${sqlStr(CHERRY)}
   WHERE LOWER(nombre_es) LIKE '%porridge%' AND LOWER(nombre_es) LIKE '%cereza%'`,

  // 14. FERMENTAR VEGETALES / CHUCRUT RECIPE — kimchi photo (already ok but explicit).
  `UPDATE recetas SET image_url = ${sqlStr(KIMCHI)}
   WHERE LOWER(nombre_es) LIKE '%fermentar vegetales%'
      OR LOWER(nombre_es) LIKE '%lactoferment%'`,

  // 15. BROCHETAS DE POLLO — should show chicken (brocheta rule exists but verify).
  `UPDATE recetas SET image_url = ${sqlStr(CHICKEN)}
   WHERE LOWER(nombre_es) LIKE '%brocheta%'`,

  // 16. MUSLO DE POLLO — should show chicken (muslo rule exists but verify).
  `UPDATE recetas SET image_url = ${sqlStr(CHICKEN)}
   WHERE LOWER(nombre_es) LIKE '%muslo%'`,

  // 17. SARDINAS DE LATA — verify sardine photo.
  `UPDATE recetas SET image_url = ${sqlStr(SARDINE)}
   WHERE LOWER(nombre_es) LIKE '%sardina%'`,

  // 18. COLIFLOR ASADA — verify cauliflower photo.
  `UPDATE recetas SET image_url = ${sqlStr(CAULIFLOWER)}
   WHERE LOWER(nombre_es) LIKE '%coliflor%'`,
];

async function main() {
  if (!TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }

  for (let i = 0; i < UPDATES.length; i++) {
    const sql = UPDATES[i];
    const label = sql.split('\n')[0].slice(0, 80);
    process.stdout.write(`[${i + 1}/${UPDATES.length}] ${label}… `);
    const r = await query(sql);
    console.log(Array.isArray(r) ? `OK (${r.length} rows)` : JSON.stringify(r));
  }

  // Spot-check
  const check = await query(`
    SELECT nombre_es, LEFT(image_url, 80) AS photo
    FROM recetas
    WHERE LOWER(nombre_es) LIKE '%trufa%'
       OR LOWER(nombre_es) LIKE '%ramen%'
       OR LOWER(nombre_es) LIKE '%pasta%sardina%' OR LOWER(nombre_es) LIKE '%pasta con sardina%'
       OR LOWER(nombre_es) LIKE '%sopa%fideo%'
       OR LOWER(nombre_es) LIKE '%crema de boniato%'
       OR LOWER(nombre_es) LIKE '%ensalada%boniato%'
       OR LOWER(nombre_es) LIKE '%encurtido%remolacha%'
       OR LOWER(nombre_es) LIKE '%porridge%cereza%'
    ORDER BY nombre_es
  `);
  console.log('\nSpot-check:', JSON.stringify(check, null, 2));
}

main().catch(console.error);
