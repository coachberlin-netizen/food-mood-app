#!/usr/bin/env node
'use strict';
const https = require('https');

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';

const BASE = 'https://images.unsplash.com/';
const Q = '?w=800&h=440&fit=crop&q=80&auto=format';
const P = id => `${BASE}${id}${Q}`;

const PHOTOS = {
  SALMON:      P('photo-1519708227418-c8fd9a32b7a2'),
  SARDINE:     P('photo-1534482421-64566f976cfa'),
  TUNA:        P('photo-1579584425555-c3ce17fd4351'),
  MISO:        P('photo-1547592180-85f173990554'),
  RAMEN:       P('photo-1574484284002-952d92456975'),
  KIMCHI:      P('photo-1583623025817-d180a2221d0a'),
  KOMBUCHA:    P('photo-1582560475093-ba66accbc424'),
  KEFIR:       P('photo-1488477181946-6428a0291777'),
  MATCHA:      P('photo-1556679343-c7306c1976bc'),
  COFFEE:      P('photo-1495474472287-4d71bcdd2085'),
  GOLDEN:      P('photo-1615485500704-8e3b5b93e5b3'),
  CHOCOLATE:   P('photo-1481391243133-f96216dcb5d2'),
  SMOOTHIE:    P('photo-1497534446932-c925b458314e'),
  CITRUS:      P('photo-1601493700631-2b16ec4b4716'),
  AVOCADO:     P('photo-1523049673857-eb18f1d7b578'),
  BEET:        P('photo-1587735243615-c03f25aaff15'),
  CAULIFLOWER: P('photo-1568584711271-6c929fb49b60'),
  BROCCOLI:    P('photo-1584270354949-c26b0d5b4a0c'),
  SPINACH:     P('photo-1576045057995-568f588f82fb'),
  SWEET_POT:   P('photo-1596097635121-14b38c5d7a45'),
  CHICKPEA:    P('photo-1511690656952-34342bb7c2f2'),
  LENTIL:      P('photo-1603133872878-684f208fb84b'),
  OATS:        P('photo-1495214783159-3503fd1b572d'),
  GRANOLA:     P('photo-1494597564530-871f2b93ac55'),
  QUINOA:      P('photo-1571997799460-c97f3fcfb3e3'),
  PASTA:       P('photo-1548247416-ec66f4900b2e'),
  RISOTTO:     P('photo-1476124369491-e7addf5db371'),
  CHERRY:      P('photo-1528821128474-27f963b062bf'),
  BLUEBERRY:   P('photo-1559181567-c3190938d6e4'),
  BANANA:      P('photo-1571771894821-ce9b6c11b08e'),
  PINEAPPLE:   P('photo-1490885578174-acda8905c2c6'),
  WALNUT:      P('photo-1563412900-f70ad9eec3f5'),
  ALMOND:      P('photo-1508061253366-f7da158b6d46'),
  TAHINI:      P('photo-1595078475328-1ab05d0a6a0e'),
  EGGS:        P('photo-1482049016688-2d3e1b311543'),
  CHICKEN:     P('photo-1598103442097-8b74394b960e'),
  CURRY:       P('photo-1455619452474-d2be8b1e70cd'),
  GAZPACHO:    P('photo-1551218808-94e220e084d2'),
  SALAD:       P('photo-1512621776951-a57141f2eefd'),
  SOUP:        P('photo-1547592180-85f173990554'),
  BOWL:        P('photo-1484723091739-30990ff50527'),
  DESSERT:     P('photo-1578985545062-ddb88e813e37'),
  CHOC_DES:    P('photo-1481391243133-f96216dcb5d2'),
  DIP:         P('photo-1540420773420-3366772f4999'),
  PORRIDGE:    P('photo-1517673132405-6b0592a8fb4d'),
  EGGS:        P('photo-1525351484163-7529414344d8'),
  CACAO_DRINK: P('photo-1542990253-0d0f5be5f0ed'),
  CEVICHE:     P('photo-1535399831218-d5bd36d1a6b3'),
};

// [keyword, photo] — first match wins (most specific first)
const RULES = [
  // DISH TYPES that override ingredients (porridge, revuelto)
  ['porridge',    PHOTOS.PORRIDGE],
  ['gachas de',   PHOTOS.PORRIDGE],
  ['revuelto',    PHOTOS.EGGS],
  ['aguachile',   PHOTOS.CEVICHE],
  ['cacao ceremonial', PHOTOS.CACAO_DRINK],
  // FISH
  ['arenque',     PHOTOS.SARDINE],
  ['boquer',      PHOTOS.SARDINE],
  ['sardina',     PHOTOS.SARDINE],
  ['caballa',     PHOTOS.SARDINE],
  ['bonito encebollado', PHOTOS.SARDINE],
  ['atún',        PHOTOS.TUNA],
  ['atun',        PHOTOS.TUNA],
  ['tataki',      PHOTOS.TUNA],
  ['tiradito',    PHOTOS.TUNA],
  ['poke',        PHOTOS.SALMON],
  ['salmón',      PHOTOS.SALMON],
  ['salmon',      PHOTOS.SALMON],
  ['trucha',      PHOTOS.SALMON],
  ['lubina',      PHOTOS.SALMON],
  ['dorada al',   PHOTOS.SALMON],
  ['mejillón',    PHOTOS.SALMON],
  ['mejillon',    PHOTOS.SALMON],
  ['pulpo',       PHOTOS.SALMON],
  ['vieira',      PHOTOS.SALMON],
  ['almeja',      PHOTOS.SALMON],
  // DRINKS (before fermented so "shot fermentado" → citrus)
  ['matcha',      PHOTOS.MATCHA],
  ['té verde',    PHOTOS.MATCHA],
  ['te verde',    PHOTOS.MATCHA],
  ['espresso',    PHOTOS.COFFEE],
  ['café',        PHOTOS.COFFEE],
  ['golden latte', PHOTOS.GOLDEN],
  ['golden milk', PHOTOS.GOLDEN],
  ['golden',      PHOTOS.GOLDEN],
  ['chai',        PHOTOS.GOLDEN],
  ['cacao ceremonial', PHOTOS.CHOCOLATE],
  ['cacao',       PHOTOS.CHOCOLATE],
  ['chocolate',   PHOTOS.CHOCOLATE],
  ['smoothie',    PHOTOS.SMOOTHIE],
  ['batido',      PHOTOS.SMOOTHIE],
  ['jugo de',     PHOTOS.SMOOTHIE],
  ['shot',        PHOTOS.CITRUS],
  ['elixir',      PHOTOS.CITRUS],
  ['vinagreta',   PHOTOS.CITRUS],
  ['shrub',       PHOTOS.CITRUS],
  ['marinada',    PHOTOS.CITRUS],
  ['ponzu',       PHOTOS.CITRUS],
  ['isotónico',   PHOTOS.CITRUS],
  ['limonada',    PHOTOS.CITRUS],
  ['agua fresca', PHOTOS.CITRUS],
  ['agua mineral', PHOTOS.CITRUS],
  ['latte',       PHOTOS.MATCHA],
  ['decocción',   PHOTOS.MATCHA],
  // MUSHROOMS
  ['shiitake',    PHOTOS.MISO],
  ["lion's mane", PHOTOS.MISO],
  ['lions mane',  PHOTOS.MISO],
  ['reishi',      PHOTOS.MISO],
  ['cordyceps',   PHOTOS.MISO],
  ['setas',       PHOTOS.MISO],
  ['champiñon',   PHOTOS.MISO],
  // FERMENTED
  ['kimchi',      PHOTOS.KIMCHI],
  ['chucrut',     PHOTOS.KIMCHI],
  ['encurtido',   PHOTOS.KIMCHI],
  ['lactoferment', PHOTOS.KIMCHI],
  ['pickles',     PHOTOS.KIMCHI],
  ['tepache',     PHOTOS.PINEAPPLE],
  ['kombucha',    PHOTOS.KOMBUCHA],
  ['miso',        PHOTOS.MISO],
  ['kéfir',       PHOTOS.KEFIR],
  ['kefir',       PHOTOS.KEFIR],
  ['tempeh',      PHOTOS.KEFIR],
  ['labneh',      PHOTOS.DIP],
  ['tarator',     PHOTOS.KEFIR],
  ['ferment',     PHOTOS.KIMCHI],
  // VEGETABLES
  ['aguacate',    PHOTOS.AVOCADO],
  ['guacamole',   PHOTOS.AVOCADO],
  ['remolacha',   PHOTOS.BEET],
  ['coliflor',    PHOTOS.CAULIFLOWER],
  ['brócoli',     PHOTOS.BROCCOLI],
  ['brocoli',     PHOTOS.BROCCOLI],
  ['espinaca',    PHOTOS.SPINACH],
  ['kale',        PHOTOS.SPINACH],
  ['espárrago',   PHOTOS.SPINACH],
  ['esparrago',   PHOTOS.SPINACH],
  ['boniato',     PHOTOS.SWEET_POT],
  ['batata',      PHOTOS.SWEET_POT],
  ['cúrcuma',     PHOTOS.GOLDEN],
  ['curcuma',     PHOTOS.GOLDEN],
  ['jengibre',    PHOTOS.GOLDEN],
  ['alga',        PHOTOS.MISO],
  ['wakame',      PHOTOS.MISO],
  ['nori',        PHOTOS.MISO],
  // LEGUMES
  ['garbanzo',    PHOTOS.CHICKPEA],
  ['hummus',      PHOTOS.CHICKPEA],
  ['lenteja',     PHOTOS.LENTIL],
  ['dal ',        PHOTOS.LENTIL],
  ['alubia',      PHOTOS.LENTIL],
  ['judía',       PHOTOS.LENTIL],
  // GRAINS
  ['risotto',     PHOTOS.RISOTTO],
  ['pasta ',      PHOTOS.PASTA],
  ['pesto',       PHOTOS.PASTA],
  ['espagueti',   PHOTOS.PASTA],
  ['fideos',      PHOTOS.PASTA],
  ['avena',       PHOTOS.OATS],
  ['porridge',    PHOTOS.OATS],
  ['gachas',      PHOTOS.OATS],
  ['overnight',   PHOTOS.OATS],
  ['granola',     PHOTOS.GRANOLA],
  ['quinoa',      PHOTOS.QUINOA],
  // FRUIT
  ['cereza',      PHOTOS.CHERRY],
  ['arándano',    PHOTOS.BLUEBERRY],
  ['arandano',    PHOTOS.BLUEBERRY],
  ['hibisco',     PHOTOS.BLUEBERRY],
  ['frambuesa',   PHOTOS.BLUEBERRY],
  ['açai',        PHOTOS.BLUEBERRY],
  ['acai',        PHOTOS.BLUEBERRY],
  ['fresa',       PHOTOS.BLUEBERRY],
  ['plátano',     PHOTOS.BANANA],
  ['platano',     PHOTOS.BANANA],
  ['piña',        PHOTOS.PINEAPPLE],
  ['pina',        PHOTOS.PINEAPPLE],
  ['limón',       PHOTOS.CITRUS],
  ['limon',       PHOTOS.CITRUS],
  ['naranja',     PHOTOS.CITRUS],
  ['bergamota',   PHOTOS.MATCHA],
  ['manzana',     PHOTOS.CITRUS],
  ['pera ',       PHOTOS.CITRUS],
  // NUTS
  ['tahini',      PHOTOS.TAHINI],
  ['sésamo',      PHOTOS.TAHINI],
  ['sesamo',      PHOTOS.TAHINI],
  ['nueces',      PHOTOS.WALNUT],
  ['nuez',        PHOTOS.WALNUT],
  ['pistacho',    PHOTOS.WALNUT],
  ['almendra',    PHOTOS.ALMOND],
  ['cacahuete',   PHOTOS.ALMOND],
  // PROTEINS
  ['huevo',       PHOTOS.EGGS],
  ['revuelto',    PHOTOS.EGGS],
  ['shakshuka',   PHOTOS.EGGS],
  ['tamago',      PHOTOS.EGGS],
  ['tortilla de', PHOTOS.EGGS],
  ['tortilla nori', PHOTOS.EGGS],
  ['pollo',       PHOTOS.CHICKEN],
  ['muslo',       PHOTOS.CHICKEN],
  ['brocheta',    PHOTOS.CHICKEN],
  ['pavo',        PHOTOS.CHICKEN],
  ['solomillo',   PHOTOS.CHICKEN],
  ['cordero',     PHOTOS.CHICKEN],
  ['paletilla',   PHOTOS.CHICKEN],
  ['tagine',      PHOTOS.CHICKEN],
  ['tofu',        PHOTOS.KEFIR],
  // DESSERTS
  ['tiramisú',    PHOTOS.CHOC_DES],
  ['tiramisu',    PHOTOS.CHOC_DES],
  ['trufas de',   PHOTOS.CHOC_DES],
  ['trufa',       PHOTOS.CHOC_DES],
  ['bombón',      PHOTOS.CHOC_DES],
  ['mousse',      PHOTOS.CHOC_DES],
  ['halva',       PHOTOS.CHOC_DES],
  ['compota',     PHOTOS.DESSERT],
  ['panna cotta', PHOTOS.DESSERT],
  ['gelatina',    PHOTOS.DESSERT],
  ['helado',      PHOTOS.DESSERT],
  ['tarta de',    PHOTOS.DESSERT],
  ['granita',     PHOTOS.DESSERT],
  ['parfait',     PHOTOS.KEFIR],
  // DISHES
  ['curry',       PHOTOS.CURRY],
  ['gazpacho',    PHOTOS.GAZPACHO],
  ['salmorejo',   PHOTOS.GAZPACHO],
  ['ajoblanco',   PHOTOS.GAZPACHO],
  ['ensalada',    PHOTOS.SALAD],
  ['escalivada',  PHOTOS.SALAD],
  ['menestra',    PHOTOS.SALAD],
  ['sopa',        PHOTOS.SOUP],
  ['caldo',       PHOTOS.SOUP],
  ['crema de',    PHOTOS.SOUP],
  ['potaje',      PHOTOS.SOUP],
  ['bol ',        PHOTOS.BOWL],
  ['bowl',        PHOTOS.BOWL],
  ['bocadillo',   PHOTOS.BOWL],
  ['tostada',     PHOTOS.BOWL],
  ['tortitas',    PHOTOS.OATS],
  ['focaccia',    PHOTOS.OATS],
  ['dip ',        PHOTOS.DIP],
  ['aceite de',   PHOTOS.CITRUS],
];

function buildSQL() {
  const whenClauses = RULES.map(([kw, url]) =>
    `  WHEN LOWER(nombre_es) LIKE ${sqlStr('%' + kw + '%')} THEN ${sqlStr(url)}`
  ).join('\n');

  return `UPDATE recetas\nSET image_url = CASE\n${whenClauses}\n  ELSE image_url\nEND`;
}

function sqlStr(s) {
  return "'" + s.replace(/'/g, "''") + "'";
}

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

async function main() {
  const sql = buildSQL();
  console.log(`SQL built — ${RULES.length} rules, ${sql.length} chars`);
  const result = await query(sql);
  console.log('Result:', JSON.stringify(result));

  // Verify
  const check = await query(
    "SELECT COUNT(*) total, COUNT(image_url) con_foto FROM recetas"
  );
  console.log('Coverage:', JSON.stringify(check));
}

main().catch(console.error);
