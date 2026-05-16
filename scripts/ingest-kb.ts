/**
 * Ingesta de la base de conocimiento en Supabase (pgvector).
 *
 * Uso:
 *   npx tsx scripts/ingest-kb.ts
 *
 * Requiere:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VOYAGE_API_KEY
 *
 * Estructura de carpetas:
 *   content/kb/foodmood/    → archivos .md o .txt del libro Food·Mood
 *   content/kb/longevidad/  → archivos .md o .txt de la KB de longevidad
 */

import 'dotenv/config'
import fs   from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { embedText } from '../src/agent/rag'

const KB_DIR     = path.join(process.cwd(), 'content', 'kb')
const CHUNK_WORDS = 512
const OVERLAP     = Math.round(CHUNK_WORDS * 0.1)   // 51 palabras ≈ 10%
const MIN_CHARS   = 80                               // descartar fragmentos muy cortos

// ── Chunking por palabras con solapamiento ────────────────────────────────────

function chunkText(text: string): string[] {
  const words  = text.split(/\s+/).filter(Boolean)
  const chunks: string[] = []
  let   i = 0

  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_WORDS).join(' ')
    if (chunk.length >= MIN_CHARS) chunks.push(chunk)
    i += CHUNK_WORDS - OVERLAP
  }

  return chunks
}

// ── Procesamiento de un archivo ───────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ingestFile(
  filePath:  string,
  chunkType: 'foodmood' | 'longevidad',
  service:   ReturnType<typeof createClient<any, any, any>>,
) {
  const raw    = fs.readFileSync(filePath, 'utf-8')
  const source = path.relative(process.cwd(), filePath).replace(/\\/g, '/')
  const chunks = chunkText(raw)

  process.stdout.write(`  ${source}: ${chunks.length} chunks … `)

  for (let idx = 0; idx < chunks.length; idx++) {
    const content   = chunks[idx]
    const embedding = await embedText(content)

    const { error } = await service.from('knowledge_base_chunks').insert({
      content,
      embedding: `[${embedding.join(',')}]`,
      source,
      chunk_type: chunkType,
      metadata:   { chunk_index: idx, total_chunks: chunks.length },
    })

    if (error) throw new Error(`Supabase insert error: ${error.message}`)
  }

  console.log('OK')
}

// ── Punto de entrada ──────────────────────────────────────────────────────────

async function main() {
  const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VOYAGE_API_KEY']
    .filter(k => !process.env[k])
  if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(', ')}`)
    process.exit(1)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const service = createClient<any, any, any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  for (const type of ['foodmood', 'longevidad'] as const) {
    const dir = path.join(KB_DIR, type)

    if (!fs.existsSync(dir)) {
      console.log(`\n[${type}] directorio no encontrado (${dir}), saltando`)
      continue
    }

    const files = fs.readdirSync(dir).filter(f => /\.(md|txt)$/i.test(f)).sort()
    console.log(`\n[${type}] ${files.length} archivo(s)`)

    for (const file of files) {
      await ingestFile(path.join(dir, file), type, service)
    }
  }

  console.log('\nIngesta completada.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
