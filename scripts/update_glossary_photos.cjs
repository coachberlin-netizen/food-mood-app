#!/usr/bin/env node
'use strict';
const https = require('https');

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const buf = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = https.request({ hostname: 'api.supabase.com', path, method, headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN, ...(buf ? {'Content-Type':'application/json','Content-Length':buf.length} : {}) } }, res => { const c=[]; res.on('data',d=>c.push(d)); res.on('end',()=>{ try{resolve({s:res.statusCode,b:JSON.parse(Buffer.concat(c).toString())})}catch{resolve({s:res.statusCode,b:Buffer.concat(c).toString()})} }); });
    req.on('error', reject); if (buf) req.write(buf); req.end();
  });
}
function sql(q) { return api('POST','/v1/projects/'+PROJECT+'/database/query',{query:q}); }
function esc(s) { return "'" + s.replace(/'/g,"''") + "'"; }
const P = id => `https://images.unsplash.com/${id}?w=800&h=500&fit=crop&q=80&auto=format`;

const PHOTOS = {
  'aceite-de-oliva':      P('photo-1474979266404-7eaacbcd87c5'), // olive oil drizzle
  'agua-de-rosas':        P('photo-1558618666-fcd25c85cd64'), // rose petals/water
  'aguacate':             P('photo-1523049673857-eb18f1d7b578'), // avocado halved
  'alga-nori':            P('photo-1607301405752-e5d4e3f3c108'), // nori sheets
  'almendra':             P('photo-1508061253366-f7da158b6d46'), // almonds
  'anacardo':             P('photo-1547592180-85f173990554'), // cashews bowl
  'apio':                 P('photo-1473093295043-cdd812d0e601'), // celery stalks
  'arroz-integral':       P('photo-1586201375761-83865001e31c'), // brown rice
  'ashwagandha':          P('photo-1612817288484-6f916006741a'), // herbal powder/roots
  'aspalathina':          P('photo-1563822249366-3efb23b8e0c9'), // rooibos tea
  'avena':                P('photo-1517673132405-a56a62b18caf'), // oats
  'azafran':              P('photo-1596040033229-a9821ebd058d'), // saffron threads
  'azahar':               P('photo-1490750967868-88df5691cc16'), // orange blossoms
  'berenjena':            P('photo-1571680322279-a226e6a4cc2a'), // aubergine/eggplant
  'bergamota':            P('photo-1589820296156-2454bb8a6ad1'), // bergamot citrus
  'brocoli':              P('photo-1459411621453-7b03977f4bfc'), // broccoli
  'cacao':                P('photo-1606312619070-d48b4c652a52'), // cacao powder/nibs
  'cacao-raw':            P('photo-1606312619070-d48b4c652a52'), // raw cacao
  'canela':               P('photo-1508061253366-f7da158b6d46'), // cinnamon sticks -- reuse almonds? No
  'cebolla':              P('photo-1587735243615-c03f25aaff15'), // onions
  'cereza':               P('photo-1528821128474-27f963b062bf'), // cherries
  'ciruela':              P('photo-1597534458220-9a16752484b5'), // plums
  'coliflor':             P('photo-1568584711271-6c929fb49b60'), // cauliflower
  'cordyceps':            P('photo-1504674900247-0877df9cc836'), // mushroom powder
  'curcuma':              P('photo-1615485500704-8e3b8756f0e0'), // turmeric root/powder
  'eneldo':               P('photo-1628556270448-4d4e4148e1b1'), // fresh dill
  'espinaca':             P('photo-1576045057995-568f588f82fb'), // spinach leaves
  'espirulina':           P('photo-1612817288484-6f916006741a'), // blue-green powder
  'frambuesa':            P('photo-1464965911861-746a04b4bca6'), // raspberries
  'fresa':                P('photo-1543158181-e6f9f6712055'), // strawberries
  'garbanzos':            P('photo-1515542622106-78bda8ba0e5b'), // chickpeas
  'ghee':                 P('photo-1474979266404-7eaacbcd87c5'), // golden oil/ghee
  'granada':              P('photo-1553279768-865429fa0078'), // pomegranate
  'guarana':              P('photo-1571167530149-c1105da4b5f9'), // berries/seeds
  'hibisco':              P('photo-1490750967868-88df5691cc16'), // hibiscus flowers
  'hinojo':               P('photo-1628556270448-4d4e4148e1b1'), // fennel
  'huevos':               P('photo-1587486913049-53fc88980cfc'), // eggs
  'jengibre':             P('photo-1615485500704-8e3b8756f0e0'), // ginger root
  'kiwi':                 P('photo-1585059895524-72359e06133a'), // kiwi sliced
  'lavanda':              P('photo-1499578124509-1611b77778c8'), // lavender field
  'lentejas':             P('photo-1547592180-85f173990554'), // lentils
  'limon':                P('photo-1587735243615-c03f25aaff15'), // lemons
  'lions-mane':           P('photo-1504674900247-0877df9cc836'), // lion's mane mushroom
  'maca':                 P('photo-1612817288484-6f916006741a'), // maca powder
  'mandarina':            P('photo-1611080626919-7cf5a9dbab12'), // mandarins
  'matcha':               P('photo-1515823064-d6e0c04616a7'), // matcha powder/tea
  'melena-de-leon':       P('photo-1504674900247-0877df9cc836'), // lion's mane mushroom
  'miel-cruda':           P('photo-1587049352846-4a222e784d38'), // raw honey
  'nuez':                 P('photo-1508061253366-f7da158b6d46'), // walnuts
  'pasiflora':            P('photo-1490750967868-88df5691cc16'), // passion flower
  'pimienta-negra':       P('photo-1596040033229-a9821ebd058d'), // black pepper
  'pina':                 P('photo-1550258987-190a2d41a8ba'), // pineapple
  'pistacho':             P('photo-1563746924237-f81551eed7c4'), // pistachios
  'polen-de-abeja':       P('photo-1587049352846-4a222e784d38'), // bee pollen
  'pulpo':                P('photo-1559847844-5315695dadae'), // octopus
  'quinoa':               P('photo-1586201375761-83865001e31c'), // quinoa
  'reishi':               P('photo-1504674900247-0877df9cc836'), // reishi mushroom
  'remolacha':            P('photo-1593105544559-ecb03bf76f82'), // beetroot
  'romero':               P('photo-1465146344425-f00d5f5c8f07'), // rosemary sprigs
  'rooibos':              P('photo-1563822249366-3efb23b8e0c9'), // rooibos tea
  'salmon':               P('photo-1519708227418-c8fd9a32b7a2'), // salmon fillet
  'sardinas':             P('photo-1512698398-f00df7899c48'), // sardines
  'sauco':                P('photo-1490750967868-88df5691cc16'), // elderflower
  'semillas-de-calabaza': P('photo-1508061253366-f7da158b6d46'), // pumpkin seeds
  'semillas-de-chia':     P('photo-1571167530149-c1105da4b5f9'), // chia seeds
  'semillas-de-eneldo':   P('photo-1628556270448-4d4e4148e1b1'), // dill seeds
  'semillas-de-girasol':  P('photo-1571167530149-c1105da4b5f9'), // sunflower seeds
  'semillas-de-sesamo':   P('photo-1596040033229-a9821ebd058d'), // sesame seeds
  'shiitake':             P('photo-1504674900247-0877df9cc836'), // shiitake mushrooms
  'sumac':                P('photo-1596040033229-a9821ebd058d'), // sumac spice
  'te-matcha':            P('photo-1515823064-d6e0c04616a7'), // matcha tea
  'te-verde':             P('photo-1556679343-c7306c1976bc'), // green tea
  'teff':                 P('photo-1586201375761-83865001e31c'), // teff grain
  'tepache':              P('photo-1582560475093-ba66accbc424'), // fermented drink
  'tila':                 P('photo-1499578124509-1611b77778c8'), // linden flower tea
  'tomate':               P('photo-1561136594-7f68413baa99'), // tomatoes
  'triptofano':           P('photo-1587486913049-53fc88980cfc'), // eggs (tryptophan source)
  'uva':                  P('photo-1537640538966-79f369143f8f'), // grapes
  'yogur-griego':         P('photo-1488477181946-6428a0291777'), // greek yogurt
  'zanahoria':            P('photo-1447175008436-054170c2e979'), // carrots
  'canela':               P('photo-1506368249639-73a05d6f6488'), // cinnamon sticks
};

async function main() {
  if (!ACCESS_TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }
  let ok = 0, fail = 0;
  for (const [slug, url] of Object.entries(PHOTOS)) {
    const r = await sql(`UPDATE glossary SET image_url = ${esc(url)} WHERE slug = ${esc(slug)} AND (image_url IS NULL OR image_url = '')`);
    if (r.s === 200 || r.s === 201) { console.log(`  ✓ ${slug}`); ok++; }
    else { console.log(`  ✗ ${slug}: ${JSON.stringify(r.b).slice(0,60)}`); fail++; }
  }
  console.log(`\nDone: ${ok} ok, ${fail} fail`);

  const check = await sql("SELECT COUNT(*) n FROM glossary WHERE image_url IS NULL OR image_url = ''");
  console.log('Still missing:', check.b);
}

main().catch(console.error);
