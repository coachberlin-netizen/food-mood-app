#!/usr/bin/env node
'use strict';
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const PROJECT = 'hbiraafgjshhyjhpbqty';
const CHALLENGE_ID = '6c84fcb9-a857-4532-bd33-e0069b0afd3b';
const BUCKET = 'retos-audio';
const VOICE = 'es-ES-AlvaroNeural'; // Warm, deep male Spanish voice
const OUTPUT_DIR = path.join(__dirname, '..', 'tmp_audios_sfm');

// Days that already have audio (recorded by user) — skip these
const DAYS_WITH_AUDIO = new Set([1, 2, 3, 4, 6, 14, 15, 19, 20, 21]);

// ── Supabase helpers ────────────────────────────────────────────
function api(method, p, body) {
  return new Promise((resolve, reject) => {
    const buf = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = https.request({
      hostname: 'api.supabase.com', path: p, method,
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

// ── Build audio script from slow-food-mood day data ────────────
function buildScript(day, data) {
  const parts = [];

  // Intro
  const titulo = data.idea_clara?.titulo || data.lectura?.titulo || `Día ${day}`;
  const tituloClean = titulo.replace(/^Audio — Día \d+:\s*/, '').replace(/^Día \d+:\s*/, '');
  parts.push(`Día ${day}. ${tituloClean}.`);
  parts.push('');

  // Idea clara (main reading for slow-food-mood)
  if (data.idea_clara?.texto) {
    parts.push(data.idea_clara.texto);
    parts.push('');
  } else if (data.lectura?.texto) {
    parts.push(data.lectura.texto);
    parts.push('');
  }

  // Cambio del día
  if (data.cambio_del_dia) {
    const cd = data.cambio_del_dia;
    parts.push(`Tu cambio de hoy: ${cd.titulo}.`);
    if (cd.instruccion) parts.push(cd.instruccion);
    if (cd.por_que) parts.push(`¿Por qué funciona? ${cd.por_que}`);
    parts.push('');
  }

  // Psicobiótico / nota food mood
  if (data.psicobiotico?.texto) {
    parts.push(`Nota Food Mood.`);
    parts.push(data.psicobiotico.texto);
  }

  return parts.filter(p => p !== undefined && p !== null).join(' ').trim();
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  if (!ACCESS_TOKEN) { console.error('Set SUPABASE_ACCESS_TOKEN'); process.exit(1); }

  // Get service role key
  const keysRes = await api('GET', '/v1/projects/' + PROJECT + '/api-keys', null);
  const serviceKey = keysRes.b.find(k => k.name === 'service_role')?.api_key;
  if (!serviceKey) { console.error('Could not get service_role key'); process.exit(1); }

  // Get all days, filter to those missing audio
  const daysRes = await sql(
    `SELECT day_number, recipe_data FROM challenge_days WHERE challenge_id = '${CHALLENGE_ID}' ORDER BY day_number`
  );
  const allDays = daysRes.b;
  console.log(`Total days: ${allDays.length}`);

  const days = allDays.filter(d => !DAYS_WITH_AUDIO.has(d.day_number));
  console.log(`Generating audio for ${days.length} days: ${days.map(d => d.day_number).join(', ')}\n`);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const day of days) {
    const n = day.day_number;
    const num = String(n).padStart(2, '0');
    const filename = `slow-food-mood-dia-${num}.mp3`;
    const localPath = path.join(OUTPUT_DIR, filename);
    const data = day.recipe_data;

    process.stdout.write(`  Día ${n} — generando... `);
    try {
      const script = buildScript(n, data);
      if (!script || script.length < 20) {
        process.stdout.write(`SKIP (sin contenido)\n`);
        continue;
      }

      const bytes = await generateAudio(script, localPath);
      process.stdout.write(`${Math.round(bytes / 1024)}KB — subiendo... `);

      const up = await uploadAudio(localPath, filename, serviceKey);
      if (up.s === 200 || up.s === 201) {
        process.stdout.write(`✓\n`);
      } else {
        process.stdout.write(`✗ (${up.s}: ${up.b.slice(0, 60)})\n`);
        continue;
      }

      // Update DB
      const titulo = data.idea_clara?.titulo || data.lectura?.titulo || `Día ${n}`;
      const tituloClean = titulo.replace(/^Audio — /, '');
      const publicUrl = `https://${PROJECT}.supabase.co/storage/v1/object/public/${BUCKET}/${filename}`;
      const updateQ = `
        UPDATE challenge_days
        SET recipe_data = jsonb_set(
          jsonb_set(
            jsonb_set(recipe_data, '{audio}', '{}'),
            '{audio,titulo}', '"${tituloClean.replace(/"/g, '\\"')}"'::jsonb
          ),
          '{audio,archivo}', '"${filename}"'::jsonb
        )
        WHERE challenge_id = '${CHALLENGE_ID}' AND day_number = ${n}
      `;
      await sql(updateQ);
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
    }

    await new Promise(r => setTimeout(r, 800));
  }

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  console.log('\n✓ Audios slow-food-mood generados, subidos y enlazados en la BD.');
}

main().catch(console.error);
