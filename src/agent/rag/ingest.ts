import type { Pool } from "pg";
import type { Embedder } from "./embedder";
import { chunkText } from "./chunker";

// Maps spec KB ids → existing DB chunk_type values
const KB_MAP: Record<"food-mood" | "longevity", "foodmood" | "longevidad"> = {
  "food-mood": "foodmood",
  "longevity":  "longevidad",
};

export async function ingestDocument(args: {
  pool: Pool;
  embedder: Embedder;
  kb: "food-mood" | "longevity";
  source: string;
  title: string | null;
  text: string;
  metadata?: Record<string, unknown>;
}): Promise<{ documentId: string; chunks: number }> {
  const { pool, embedder, kb, source, title, text, metadata = {} } = args;
  const chunkType = KB_MAP[kb];
  const chunks = chunkText(text);
  if (chunks.length === 0) throw new Error("Documento vacío tras chunking");

  // Batch embed all chunks at once
  const vectors = await embedder.embed(chunks.map(c => c.content));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Upsert document record for idempotent re-ingestion
    const { rows: docRows } = await client.query<{ id: string }>(
      `INSERT INTO kb_documents (kb, source, title, metadata)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (kb, source) DO UPDATE
         SET title = EXCLUDED.title, metadata = EXCLUDED.metadata, ingested_at = now()
       RETURNING id`,
      [kb, source, title, metadata],
    );
    const documentId = docRows[0].id;

    // Remove old chunks for this document
    await client.query(
      `DELETE FROM knowledge_base_chunks WHERE source = $1 AND chunk_type = $2`,
      [source, chunkType],
    );

    // Insert new chunks
    for (let i = 0; i < chunks.length; i++) {
      await client.query(
        `INSERT INTO knowledge_base_chunks (content, embedding, source, chunk_type, metadata)
         VALUES ($1, $2::vector, $3, $4, $5)`,
        [
          chunks[i].content,
          `[${vectors[i].join(",")}]`,
          source,
          chunkType,
          { ...metadata, chunk_index: chunks[i].index, total_chunks: chunks.length, document_id: documentId },
        ],
      );
    }

    await client.query("COMMIT");
    return { documentId, chunks: chunks.length };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
