#!/usr/bin/env node
'use strict';
require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PROJECT    = 'hbiraafgjshhyjhpbqty';
const BUCKET     = 'recipe-photos';
const DOWNLOADS  = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SERVICE_KEY) { console.error('Falta SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
if (!ACCESS_TOKEN) { console.error('Falta SUPABASE_ACCESS_TOKEN'); process.exit(1); }

// Mapeo: archivo en Downloads → { fermentSlug, glossarySlugs }
const PHOTOS = [
  {
    file:          'kimchi_grande_plato_food_mood_202605111622.jpeg',
    storageName:   'fermentos/kimchi.jpeg',
    fermentSlugs:  ['nukazuke'],          // nukazuke usa foto de kimchi por ahora
    fermentSlugsDirect: ['kimchi'],       // también actualiza ferment directo
    glossarySlugs: ['kimchi'],
  },
  {
    file:          'miso_en_grande_2K_202605111716.jpeg',
    storageName:   'fermentos/miso.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['doenjang'],
    glossarySlugs: ['miso', 'doenjang'],
  },
  {
    file:          'fermento_nukasuke_2K_202605111623.jpeg',
    storageName:   'fermentos/nukasuke.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['nukazuke'],
    glossarySlugs: ['nukazuke'],
  },
  {
    file:          'fermento_doegang_2K_202605121132.jpeg',
    storageName:   'fermentos/doenjang.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['doenjang'],
    glossarySlugs: ['doenjang'],
  },
  {
    file:          'kefir_de_agua_2K_202605111105.jpeg',
    storageName:   'fermentos/kefir-de-agua.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['borscht-kefir', 'ayran'],
    glossarySlugs: ['kefir', 'kefir-de-agua'],
  },
  {
    file:          'tempeh_en_un_plato_uqe_202605121141.jpeg',
    storageName:   'fermentos/tempeh.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['tempeh-world'],
    glossarySlugs: ['tempeh'],
  },
  {
    file:          'injera,pan_de_teff_fermentado_2K_202605140959.jpeg',
    storageName:   'fermentos/injera.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['injera'],
    glossarySlugs: ['injera'],
  },
  {
    file:          'ogi,_cereal_fermentado_2K_202605140956.jpeg',
    storageName:   'fermentos/ogi.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['ogi'],
    glossarySlugs: [],
  },
  {
    file:          'dosa_masa_fermentada_toda_la_202605140957.jpeg',
    storageName:   'fermentos/dosa.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['dosa'],
    glossarySlugs: ['dosa'],
  },
  {
    file:          'chucrut_artesanal_2K_202605140958.jpeg',
    storageName:   'fermentos/chucrut.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['sauerkraut'],
    glossarySlugs: ['chucrut'],
  },
  {
    file:          'Gochujang_2K_202605140958.jpeg',
    storageName:   'fermentos/gochujang.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['gochujang'],
    glossarySlugs: ['gochujang'],
  },
  {
    file:          'nato_de_garbanzos_202605140956.jpeg',
    storageName:   'fermentos/natto.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['natto'],
    glossarySlugs: ['natto'],
  },
  {
    file:          'tepache_2K_202605111721.jpeg',
    storageName:   'fermentos/tepache.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['tepache'],
    glossarySlugs: ['tepache'],
  },
  {
    file:          'ayran_2K_202605140958.jpeg',
    storageName:   'fermentos/ayran.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['ayran'],
    glossarySlugs: [],
  },
  {
    file:          'lassi,_food_mood_2K_202605140959.jpeg',
    storageName:   'fermentos/lassi.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['lassi'],
    glossarySlugs: [],
  },
  {
    file:          'chicha_morada_2K_202605140959.jpeg',
    storageName:   'fermentos/chicha-morada.jpeg',
    fermentSlugs:  [],
    fermentSlugsDirect: ['chicha-morada'],
    glossarySlugs: [],
  },
];

function publicUrl(storageName) {
  return `https://${PROJECT}.supabase.co/storage/v1/object/public/${BUCKET}/${storageName}`;
}

function upload(localPath, storageName, jwt) {
  return new Promise((resolve, reject) => {
    const buf = fs.readFileSync(localPath);
    const req = https.request({
      hostname: `${PROJECT}.supabase.co`,
      path: `/storage/v1/object/${BUCKET}/${storageName}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'image/jpeg',
        'Content-Length': buf.length,
        'x-upsert': 'true',
      },
    }, res => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(c).toString() }));
    });
    req.on('error', reject);
    req.write(buf); req.end();
  });
}

function sql(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => { try { resolve(JSON.parse(Buffer.concat(c).toString())); } catch { resolve(Buffer.concat(c).toString()); } });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

function sq(s) { return `'${s.replace(/'/g, "''")}'`; }

async function getJWT() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT}/api-keys`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
    }, res => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => {
        const body = JSON.parse(Buffer.concat(c).toString());
        const key = body.find(k => k.name === 'service_role');
        resolve(key?.api_key);
      });
    });
    req.on('error', reject); req.end();
  });
}

async function main() {
  console.log('\nObteniendo JWT...');
  const JWT = await getJWT();
  if (!JWT) { console.error('No se pudo obtener service_role JWT'); process.exit(1); }
  console.log('JWT OK:', JWT.slice(0, 20) + '...');

  console.log('\nSubiendo fotos de fermentos a Supabase Storage\n');

  for (const p of PHOTOS) {
    const localPath = path.join(DOWNLOADS, p.file);
    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠  No encontrado: ${p.file}`);
      continue;
    }

    process.stdout.write(`  ↑ ${p.file} ... `);
    const up = await upload(localPath, p.storageName, JWT);
    if (up.status !== 200) {
      console.log(`ERROR ${up.status}: ${up.body}`);
      continue;
    }
    console.log(`OK`);

    const url = publicUrl(p.storageName);

    // Update ferments_world table
    const allSlugs = [...p.fermentSlugsDirect];
    if (allSlugs.length > 0) {
      const slugList = allSlugs.map(sq).join(', ');
      const r = await sql(`UPDATE ferments_world SET image_url = ${sq(url)} WHERE slug IN (${slugList})`);
      console.log(`     ferments_world (${allSlugs.join(', ')}): ${JSON.stringify(r).slice(0,80)}`);
    }

    // Update glossary table
    if (p.glossarySlugs.length > 0) {
      const slugList = p.glossarySlugs.map(sq).join(', ');
      const r = await sql(`UPDATE glossary SET image_url = ${sq(url)} WHERE slug IN (${slugList})`);
      console.log(`     glossary (${p.glossarySlugs.join(', ')}): ${JSON.stringify(r).slice(0,80)}`);
    }
  }

  console.log('\nHecho.\n');
}

main().catch(console.error);
