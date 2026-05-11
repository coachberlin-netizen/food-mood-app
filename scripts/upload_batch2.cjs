#!/usr/bin/env node
'use strict';
const https = require('https');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';

function apiRequest(method, apiPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const bodyBuf = body ? (Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body))) : null;
    const req = https.request({
      hostname: 'api.supabase.com',
      path: apiPath,
      method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        ...(bodyBuf && !Buffer.isBuffer(body) ? { 'Content-Type': 'application/json' } : {}),
        ...(bodyBuf ? { 'Content-Length': bodyBuf.length } : {}),
        ...headers,
      },
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        try { resolve({ status: res.statusCode, body: JSON.parse(raw.toString()) }); }
        catch { resolve({ status: res.statusCode, body: raw.toString() }); }
      });
    });
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

function storageUpload(jwtKey, filePath, storagePath, contentType) {
  return new Promise((resolve, reject) => {
    const fileData = fs.readFileSync(filePath);
    const req = https.request({
      hostname: `${PROJECT}.supabase.co`,
      path: `/storage/v1/object/recipe-photos/${storagePath}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtKey}`,
        'Content-Type': contentType,
        'Content-Length': fileData.length,
        'x-upsert': 'true',
      },
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(fileData);
    req.end();
  });
}

function sqlQuery(sql) {
  return apiRequest('POST', `/v1/projects/${PROJECT}/database/query`,
    { query: sql },
    { 'Content-Type': 'application/json' }
  );
}

function sqlStr(s) { return "'" + s.replace(/'/g, "''") + "'"; }

async function main() {
  // Get JWT service role key
  console.log('Getting JWT service role key...');
  const keysRes = await apiRequest('GET', `/v1/projects/${PROJECT}/api-keys`, null);
  const serviceKey = keysRes.body.find && keysRes.body.find(k => k.name === 'service_role');
  if (!serviceKey) { console.error('No service_role key found:', keysRes.body); process.exit(1); }
  const JWT = serviceKey.api_key;
  console.log('JWT obtained:', JWT.slice(0, 20) + '...');

  // 1. Fix labneh → revert to avocado/DIP photo
  console.log('\n── Fix labneh (revert aceite de romero photo) ──');
  const labnahDipPhoto = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=440&fit=crop&q=80&auto=format';
  const r1 = await sqlQuery(`UPDATE recetas SET image_url = ${sqlStr(labnahDipPhoto)} WHERE LOWER(nombre_es) LIKE '%labneh%' AND LOWER(nombre_es) LIKE '%aceite de romero%'`);
  console.log('  labneh revert:', r1.status === 200 ? 'OK' : JSON.stringify(r1.body));

  // 2. Upload Shrub de Jengibre y Naranja
  console.log('\n── Upload First Light Shrub ──');
  const shrubFile = 'C:/Users/coach/Downloads/Shrub_de_Jengibre_y_Naranja_202605110742.jpeg';
  const shrubStorageName = 'shrub-jengibre-naranja.jpg';
  const shrubUpload = await storageUpload(JWT, shrubFile, shrubStorageName, 'image/jpeg');
  console.log('  Upload status:', shrubUpload.status, JSON.stringify(shrubUpload.body).slice(0, 80));
  if (shrubUpload.status === 200 || shrubUpload.status === 201) {
    const shrubUrl = `https://${PROJECT}.supabase.co/storage/v1/object/public/recipe-photos/${shrubStorageName}`;
    const r2 = await sqlQuery(`UPDATE recetas SET image_url = ${sqlStr(shrubUrl)} WHERE LOWER(nombre_es) LIKE '%shrub%' AND (LOWER(nombre_es) LIKE '%jengibre%' OR LOWER(nombre_es) LIKE '%ginger%' OR LOWER(nombre_es) LIKE '%naranja%' OR LOWER(nombre_es) LIKE '%first light%')`);
    console.log('  DB update shrub:', r2.status === 200 ? 'OK' : JSON.stringify(r2.body));
    console.log('  URL:', shrubUrl);
  }

  // 3. Upload Compota Tibia de Cereza
  console.log('\n── Upload Compota Tibia de Cereza ──');
  const compotaFile = 'C:/Users/coach/Downloads/Compota_Tibia_de_Cereza_con_202605110744.jpeg';
  const compotaStorageName = 'compota-cereza-yogur-pistachos.jpg';
  const compotaUpload = await storageUpload(JWT, compotaFile, compotaStorageName, 'image/jpeg');
  console.log('  Upload status:', compotaUpload.status, JSON.stringify(compotaUpload.body).slice(0, 80));
  if (compotaUpload.status === 200 || compotaUpload.status === 201) {
    const compotaUrl = `https://${PROJECT}.supabase.co/storage/v1/object/public/recipe-photos/${compotaStorageName}`;
    const r3 = await sqlQuery(`UPDATE recetas SET image_url = ${sqlStr(compotaUrl)} WHERE LOWER(nombre_es) LIKE '%compota%' AND LOWER(nombre_es) LIKE '%cereza%'`);
    console.log('  DB update compota:', r3.status === 200 ? 'OK' : JSON.stringify(r3.body));
    console.log('  URL:', compotaUrl);
  }

  // Verify
  console.log('\n── Verification ──');
  const check = await sqlQuery(`
    SELECT nombre_es, LEFT(image_url, 70) url FROM recetas
    WHERE LOWER(nombre_es) LIKE '%labneh%'
      OR LOWER(nombre_es) LIKE '%shrub%jengibre%'
      OR LOWER(nombre_es) LIKE '%shrub%naranja%'
      OR LOWER(nombre_es) LIKE '%compota%cereza%'
    ORDER BY nombre_es
  `);
  console.log(JSON.stringify(check.body, null, 2));
}

main().catch(console.error);
