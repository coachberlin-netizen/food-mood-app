import { createClient } from '@supabase/supabase-js'

// ── RagStore interface ────────────────────────────────────────────────────────

export interface RagStore {
  search(args: { kb: 'food-mood' | 'longevity'; query: string; k: number }): Promise<string[]>;
  drugInteractionsFor(medications: string[]): Promise<string[]>;
}

export class StubRagStore implements RagStore {
  async search(_args: { kb: 'food-mood' | 'longevity'; query: string; k: number }): Promise<string[]> {
    return [];
  }
  async drugInteractionsFor(_medications: string[]): Promise<string[]> {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
const VOYAGE_MODEL   = 'voyage-3'
const TOP_K          = 5

// ── Embed con Voyage-3 ────────────────────────────────────────────────────────

export async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) throw new Error('VOYAGE_API_KEY no configurada')

  const res = await fetch(VOYAGE_API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: [text], model: VOYAGE_MODEL }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Voyage API error ${res.status}: ${err}`)
  }

  const json = await res.json() as { data: Array<{ embedding: number[] }> }
  return json.data[0].embedding
}

// ── Retrieval desde Supabase con pgvector ────────────────────────────────────

interface Chunk {
  content:    string
  source:     string
  chunk_type: string
}

export async function retrieveChunks(
  query:      string,
  chunkType:  'foodmood' | 'longevidad' | 'all' = 'all',
  topK:       number = TOP_K,
): Promise<Chunk[]> {
  const embedding = await embedText(query)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Supabase no soporta <=> operator directamente en el cliente JS;
  // usamos RPC con una función SQL helper
  const { data, error } = await supabase.rpc('match_kb_chunks', {
    query_embedding: embedding,
    chunk_type_filter: chunkType === 'all' ? null : chunkType,
    match_count: topK,
  })

  if (error) throw new Error(`RAG retrieval error: ${error.message}`)
  return (data as Chunk[]) ?? []
}

// ── Formatea chunks para inyectar en el prompt ────────────────────────────────

export function formatChunks(chunks: Chunk[]): string {
  return chunks
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.content}`)
    .join('\n\n---\n\n')
}

// ── Función combinada: retrieval + format por tipo ───────────────────────────

export async function retrieveForPrompt(
  query: string,
): Promise<{ foodmood: string; longevidad: string }> {
  const [foodmoodChunks, longevidadChunks] = await Promise.all([
    retrieveChunks(query, 'foodmood').catch(() => [] as Chunk[]),
    retrieveChunks(query, 'longevidad').catch(() => [] as Chunk[]),
  ])

  return {
    foodmood:   formatChunks(foodmoodChunks),
    longevidad: formatChunks(longevidadChunks),
  }
}
