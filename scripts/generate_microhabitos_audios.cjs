#!/usr/bin/env node
'use strict';
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';
const CHALLENGE_ID = 'c5767745-2fbd-4855-af49-38146419dbec';
const BUCKET = 'retos-audio';
const VOICE = 'es-ES-ElviraNeural';
const OUTPUT_DIR = path.join(__dirname, '..', 'tmp_audios');

// ── Supabase helpers ────────────────────────────────────────────
function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const buf = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = https.request({
      hostname: 'api.supabase.com', path, method,
      headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN, ...(buf ? { 'Content-Type': 'application/json', 'Content-Length': buf.length } : {}) }
    }, res => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => { try { resolve({ s: res.statusCode, b: JSON.parse(Buffer.concat(c).toString()) }) } catch { resolve({ s: res.statusCode, b: Buffer.concat(c).toString() }) } });
    });
    req.on('error', reject); if (buf) req.write(buf); req.end();
  });
}
function sql(q) { return api('POST', '/v1/projects/' + PROJECT + '/database/query', { query: q }); }

// ── Upload to Supabase Storage ──────────────────────────────────
function uploadAudio(localPath, storagePath, serviceKey) {
  return new Promise((resolve, reject) => {
    const buf = fs.readFileSync(localPath);
    const req = https.request({
      hostname: PROJECT + '.supabase.co',
      path: '/storage/v1/object/' + BUCKET + '/' + storagePath,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + serviceKey,
        'Content-Type': 'audio/mpeg',
        'Content-Length': buf.length,
        'x-upsert': 'true'
      }
    }, res => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve({ s: res.statusCode, b: Buffer.concat(c).toString() }));
    });
    req.on('error', reject); req.write(buf); req.end();
  });
}

// ── TTS generator ───────────────────────────────────────────────
async function generateAudio(text, outputFile) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  return new Promise((resolve, reject) => {
    const chunks = [];
    audioStream.on('data', d => chunks.push(d));
    audioStream.on('end', () => {
      const buf = Buffer.concat(chunks);
      fs.writeFileSync(outputFile, buf);
      resolve(buf.length);
    });
    audioStream.on('error', reject);
  });
}

// ── Build full audio script from day data ───────────────────────
function buildScript(day, data) {
  const parts = [];
  // Intro
  parts.push(`Día ${day}. ${data.lectura?.titulo?.replace(/^Audio — Día \d+:\s*/, '') || ''}.`);
  parts.push('');
  // Lectura (audio script)
  if (data.lectura?.texto) parts.push(data.lectura.texto);
  parts.push('');
  // Cambio del día
  if (data.cambio_del_dia) {
    parts.push(`Tu cambio de hoy: ${data.cambio_del_dia.titulo}.`);
    parts.push(data.cambio_del_dia.instruccion || '');
    if (data.cambio_del_dia.por_que) parts.push(`¿Por qué funciona? ${data.cambio_del_dia.por_que}`);
  }
  parts.push('');
  // Psicobiótico
  if (data.psicobiotico?.texto) {
    parts.push(`Nota Food Mood.`);
    parts.push(data.psicobiotico.texto);
  }
  return parts.filter(Boolean).join(' ');
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  if (!ACCESS_TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }

  // Get service role key
  const keysRes = await api('GET', '/v1/projects/' + PROJECT + '/api-keys', null);
  const serviceKey = keysRes.b.find(k => k.name === 'service_role')?.api_key;
  if (!serviceKey) { console.error('Could not get service_role key'); process.exit(1); }

  // Get all 21 days
  const daysRes = await sql(
    `SELECT day_number, recipe_data FROM challenge_days WHERE challenge_id = '${CHALLENGE_ID}' ORDER BY day_number`
  );
  const days = daysRes.b;
  console.log(`Found ${days.length} days\n`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const day of days) {
    const n = day.day_number;
    const num = String(n).padStart(2, '0');
    const filename = `microhabitos-dia-${num}.mp3`;
    const localPath = path.join(OUTPUT_DIR, filename);
    const data = day.recipe_data;

    process.stdout.write(`  Día ${n} — generando... `);
    try {
      const script = buildScript(n, data);
      const bytes = await generateAudio(script, localPath);
      process.stdout.write(`${Math.round(bytes / 1024)}KB — subiendo... `);

      // Upload
      const up = await uploadAudio(localPath, filename, serviceKey);
      if (up.s === 200 || up.s === 201) {
        process.stdout.write(`✓\n`);
      } else {
        process.stdout.write(`✗ (${up.s})\n`);
        continue;
      }

      // Update DB
      const titulo = data.lectura?.titulo?.replace(/^Audio — /, '') || `Día ${n}`;
      const publicUrl = `https://${PROJECT}.supabase.co/storage/v1/object/public/${BUCKET}/${filename}`;
      const updateQ = `
        UPDATE challenge_days
        SET recipe_data = jsonb_set(
          jsonb_set(
            jsonb_set(recipe_data, '{audio}', '{}'),
            '{audio,titulo}', '"${titulo.replace(/"/g, '\\"')}"'::jsonb
          ),
          '{audio,archivo}', '"${filename}"'::jsonb
        )
        WHERE challenge_id = '${CHALLENGE_ID}' AND day_number = ${n}
      `;
      await sql(updateQ);
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
    }

    // Small pause to avoid rate limiting
    await new Promise(r => setTimeout(r, 800));
  }

  // Cleanup tmp
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  console.log('\n✓ Todos los audios generados, subidos y enlazados en la BD.');
}

main().catch(console.error);
