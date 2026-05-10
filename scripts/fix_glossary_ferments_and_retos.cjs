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

const P = id => `https://images.unsplash.com/${id}?w=800&h=500&fit=crop&q=80&auto=format`;

// ─── GLOSSARY: fermented food photos ─────────────────────────────────────────
const GLOSSARY_PHOTOS = {
  'doenjang':            P('photo-1547592180-85f173990554'), // miso-style dark paste bowl
  'dosa':                P('photo-1567620905732-2d1ec7ab7445'), // thin crispy flatbread
  'gochujang':           P('photo-1583623025817-d180a2221d0a'), // Korean red fermented paste → kimchi
  'injera':              P('photo-1495214783159-3503fd1b572d'), // spongy grain flatbread → oats/grain
  'kefir':               P('photo-1488477181946-6428a0291777'), // creamy white dairy kefir
  'kefir-de-agua':       P('photo-1582560475093-ba66accbc424'), // bubbly water kefir → kombucha-like
  'kimchi':              P('photo-1583623025817-d180a2221d0a'), // red fermented cabbage
  'kombucha':            P('photo-1582560475093-ba66accbc424'), // amber bubbly kombucha
  'miso':                P('photo-1547592180-85f173990554'), // miso soup bowl
  'natto':               P('photo-1511690656952-34342bb7c2f2'), // chickpeas (base de natto de garbanzos)
  'nukazuke':            P('photo-1587735243615-c03f25aaff15'), // rice-bran pickles → beet/vegetable
  'skyr':                P('photo-1488477181946-6428a0291777'), // Icelandic dairy → kefir
  'tkemali':             P('photo-1528821128474-27f963b062bf'), // Georgian plum sauce → cherry/plum
  'vinagre-de-kombucha': P('photo-1582560475093-ba66accbc424'), // kombucha vinegar
};

// ─── CHALLENGES / RETOS ───────────────────────────────────────────────────────
// IDs from DB:
// Microhábitos — 21 días         c5767745-2fbd-4855-af49-38146419dbec
// Equilibrio hormonal — 28 días  1ab8fc18-f5f9-4c9e-a0b2-e1341bf80a48
// Slow Food·Mood — 7 días        592d7f1a-ee6d-4992-a1b7-80006ec80d05

const CHALLENGE_UPDATES = [
  // Morning light + journal = micro habits
  { id: 'c5767745-2fbd-4855-af49-38146419dbec', photo: P('photo-1499750310107-5fef28a66643') },
  // Mature woman wellness = hormone balance
  { id: '1ab8fc18-f5f9-4c9e-a0b2-e1341bf80a48', photo: P('photo-1531746020798-e6953c6e8e04') },
  // Slow calm bowl = 7-day slow food
  { id: '592d7f1a-ee6d-4992-a1b7-80006ec80d05', photo: P('photo-1556679343-c7306c1976bc') },
];

function sqlStr(s) { return "'" + s.replace(/'/g, "''") + "'"; }

async function main() {
  if (!TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }

  // 1. Update glossary photos
  console.log('\n── Glossary ferments ──');
  for (const [slug, url] of Object.entries(GLOSSARY_PHOTOS)) {
    const sql = `UPDATE glossary SET image_url = ${sqlStr(url)} WHERE slug = ${sqlStr(slug)}`;
    const r = await query(sql);
    console.log(`  ${slug}: ${Array.isArray(r) ? 'OK' : JSON.stringify(r)}`);
  }

  // 2. Update challenge photos
  console.log('\n── Challenges ──');
  for (const { id, photo } of CHALLENGE_UPDATES) {
    const sql = `UPDATE challenges SET image_url = ${sqlStr(photo)} WHERE id = ${sqlStr(id)}`;
    const r = await query(sql);
    console.log(`  ${id.slice(0,8)}: ${Array.isArray(r) ? 'OK' : JSON.stringify(r)}`);
  }

  // 3. Fix Kombucha de Té Verde recipe — 'té verde' rule beats 'kombucha' in main script
  console.log('\n── Kombucha de Té Verde recipe ──');
  const KOMBUCHA = P('photo-1582560475093-ba66accbc424').replace('&h=500&', '&h=440&');
  const sql3 = `UPDATE recetas SET image_url = ${sqlStr(KOMBUCHA)}
    WHERE LOWER(nombre_es) LIKE '%kombucha%'
      AND (LOWER(nombre_es) LIKE '%té verde%' OR LOWER(nombre_es) LIKE '%te verde%')`;
  const r3 = await query(sql3);
  console.log(`  Result: ${Array.isArray(r3) ? 'OK' : JSON.stringify(r3)}`);

  // 4. Verify
  console.log('\n── Verification ──');
  const check = await query(`
    SELECT slug, name, LEFT(image_url, 60) photo
    FROM glossary WHERE category = 'fermentado' OR category = 'probiotico'
    ORDER BY name
  `);
  console.log(JSON.stringify(check, null, 2));
}

main().catch(console.error);
