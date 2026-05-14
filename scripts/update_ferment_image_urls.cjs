#!/usr/bin/env node
'use strict';
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const PROJECT      = 'hbiraafgjshhyjhpbqty';
const BUCKET       = 'recipe-photos';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) { console.error('Falta SUPABASE_ACCESS_TOKEN'); process.exit(1); }

// Public URL format
function publicUrl(storageName) {
  return `https://${PROJECT}.supabase.co/storage/v1/object/public/${BUCKET}/${storageName}`;
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

// Mapeo: storageName → { ferments_world slugs, glossary slugs }
const PHOTOS = [
  {
    storageName:   'fermentos/kimchi.jpeg',
    fermentSlugs:  ['kimchi'],
    glossarySlugs: ['kimchi'],
  },
  {
    storageName:   'fermentos/miso.jpeg',
    fermentSlugs:  ['doenjang'],
    glossarySlugs: ['miso', 'doenjang'],
  },
  {
    storageName:   'fermentos/nukasuke.jpeg',
    fermentSlugs:  ['nukazuke'],
    glossarySlugs: ['nukazuke'],
  },
  {
    storageName:   'fermentos/doenjang.jpeg',
    fermentSlugs:  [],
    glossarySlugs: [],
  },
  {
    storageName:   'fermentos/kefir-de-agua.jpeg',
    fermentSlugs:  ['borscht-kefir', 'ayran'],
    glossarySlugs: ['kefir', 'kefir-de-agua'],
  },
  {
    storageName:   'fermentos/tempeh.jpeg',
    fermentSlugs:  ['tempeh-world'],
    glossarySlugs: ['tempeh'],
  },
  {
    storageName:   'fermentos/injera.jpeg',
    fermentSlugs:  ['injera'],
    glossarySlugs: ['injera'],
  },
  {
    storageName:   'fermentos/ogi.jpeg',
    fermentSlugs:  ['ogi'],
    glossarySlugs: [],
  },
  {
    storageName:   'fermentos/dosa.jpeg',
    fermentSlugs:  ['dosa'],
    glossarySlugs: ['dosa'],
  },
  {
    storageName:   'fermentos/chucrut.jpeg',
    fermentSlugs:  ['sauerkraut'],
    glossarySlugs: ['chucrut'],
  },
  {
    storageName:   'fermentos/gochujang.jpeg',
    fermentSlugs:  ['gochujang'],
    glossarySlugs: ['gochujang'],
  },
  {
    storageName:   'fermentos/natto.jpeg',
    fermentSlugs:  ['natto'],
    glossarySlugs: ['natto'],
  },
  {
    storageName:   'fermentos/tepache.jpeg',
    fermentSlugs:  ['tepache'],
    glossarySlugs: ['tepache'],
  },
  {
    storageName:   'fermentos/ayran.jpeg',
    fermentSlugs:  ['ayran'],
    glossarySlugs: [],
  },
  {
    storageName:   'fermentos/lassi.jpeg',
    fermentSlugs:  ['lassi'],
    glossarySlugs: [],
  },
  {
    storageName:   'fermentos/chicha-morada.jpeg',
    fermentSlugs:  ['chicha-morada'],
    glossarySlugs: [],
  },
];

async function main() {
  console.log('\nActualizando image_url en ferments_world y glossary\n');

  for (const p of PHOTOS) {
    const url = publicUrl(p.storageName);

    if (p.fermentSlugs.length > 0) {
      const slugList = p.fermentSlugs.map(sq).join(', ');
      const r = await sql(`UPDATE ferments_world SET image_url = ${sq(url)} WHERE slug IN (${slugList}) RETURNING slug`);
      console.log(`  ferments_world (${p.fermentSlugs.join(', ')}): ${JSON.stringify(r).slice(0, 100)}`);
    }

    if (p.glossarySlugs.length > 0) {
      const slugList = p.glossarySlugs.map(sq).join(', ');
      const r = await sql(`UPDATE glossary SET image_url = ${sq(url)} WHERE slug IN (${slugList}) RETURNING slug`);
      console.log(`  glossary       (${p.glossarySlugs.join(', ')}): ${JSON.stringify(r).slice(0, 100)}`);
    }
  }

  console.log('\nHecho.\n');
}

main().catch(console.error);
