#!/usr/bin/env node
'use strict';
/**
 * Diagnóstico + reset directo de enrollments completados para el usuario admin.
 * Uso: node scripts/reset_reto_admin.cjs
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const PROJECT      = 'hbiraafgjshhyjhpbqty';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) { console.error('Falta SUPABASE_ACCESS_TOKEN'); process.exit(1); }

const ADMIN_EMAIL = 'coachberlin@gmail.com';

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
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(c).toString())); }
        catch { resolve(Buffer.concat(c).toString()); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

async function main() {
  console.log(`\nBuscando usuario: ${ADMIN_EMAIL}\n`);

  // 1. Get user ID from auth.users
  const users = await sql(`SELECT id, email FROM auth.users WHERE email = '${ADMIN_EMAIL}' LIMIT 1`);
  if (!Array.isArray(users) || users.length === 0) {
    console.error('Usuario no encontrado en auth.users');
    console.log('Resultado raw:', JSON.stringify(users));
    process.exit(1);
  }
  const userId = users[0].id;
  console.log(`User ID: ${userId}\n`);

  // 2. List all enrollments for this user
  const enrollments = await sql(`
    SELECT
      uc.id,
      c.slug,
      c.title,
      c.duration_days,
      uc.paid,
      uc.completed,
      uc.current_day,
      uc.completed_at
    FROM user_challenges uc
    JOIN challenges c ON c.id = uc.challenge_id
    WHERE uc.user_id = '${userId}'
    ORDER BY uc.completed DESC, c.title
  `);

  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    console.log('No hay enrollments para este usuario.');
    return;
  }

  console.log('Estado actual de enrollments:');
  console.log('─'.repeat(80));
  enrollments.forEach(e => {
    const status = e.completed ? '✅ COMPLETADO' : `🔄 día ${e.current_day}/${e.duration_days}`;
    console.log(`  ${e.slug.padEnd(35)} paid=${e.paid} ${status}`);
    console.log(`    id: ${e.id}`);
  });

  // 3. Reset ALL completed enrollments
  const completed = enrollments.filter(e => e.completed && e.paid);
  if (completed.length === 0) {
    console.log('\nNo hay enrollments completados que resetear.');
    console.log('Si el reto aparece como "Completado" en la UI pero no en el DB,\nes un problema de caché. Prueba hard refresh (Ctrl+Shift+R).');
    return;
  }

  console.log(`\nReseteando ${completed.length} enrollment(s) completado(s)...\n`);

  for (const e of completed) {
    const idList = `'${e.id}'`;
    const r = await sql(`
      UPDATE user_challenges
      SET current_day = 1, completed = false, completed_at = NULL, fm_index_end = NULL
      WHERE id = ${idList}
      RETURNING id, current_day, completed
    `);
    if (Array.isArray(r) && r.length > 0) {
      console.log(`  ✓ ${e.slug}: reseteado → día ${r[0].current_day}, completed=${r[0].completed}`);
    } else {
      console.log(`  ✗ ${e.slug}: no se actualizó (id=${e.id})`);
      console.log('    raw:', JSON.stringify(r));
    }
  }

  console.log('\nHecho. Ahora recarga la página del reto en el navegador.\n');
}

main().catch(console.error);
