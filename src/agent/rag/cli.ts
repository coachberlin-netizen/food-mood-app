import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { VoyageEmbedder } from "./embedder";
import { ingestDocument } from "./ingest";

export async function reindex(kb: "food-mood" | "longevity", dir: string): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const embedder = new VoyageEmbedder(process.env.VOYAGE_API_KEY!);

  const files = (await readdir(dir)).filter(f => f.endsWith(".md") || f.endsWith(".txt")).sort();
  if (files.length === 0) {
    console.log(`No se encontraron archivos .md/.txt en ${dir}`);
    await pool.end();
    return;
  }

  for (const f of files) {
    const fullPath = path.join(dir, f);
    const text = await readFile(fullPath, "utf8");
    const title = text.split("\n").find(l => l.startsWith("# "))?.replace(/^#\s+/, "") ?? f;
    process.stdout.write(`  ${f} … `);
    const { chunks } = await ingestDocument({ pool, embedder, kb, source: fullPath, title, text });
    console.log(`${chunks} chunks OK`);
  }

  await pool.end();
}
