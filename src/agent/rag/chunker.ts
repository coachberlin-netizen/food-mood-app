export type Chunk = { content: string; index: number };

/** Chunking por párrafos con solapamiento. Mantiene unidades semánticas intactas si caben. */
export function chunkText(
  text: string,
  opts: { targetChars?: number; overlapChars?: number } = {},
): Chunk[] {
  const target  = opts.targetChars  ?? 1200;
  const overlap = opts.overlapChars ?? 200;
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const chunks: Chunk[] = [];
  let buf = "";
  let idx = 0;

  for (const p of paragraphs) {
    if ((buf + "\n\n" + p).length > target && buf.length > 0) {
      chunks.push({ content: buf, index: idx++ });
      buf = buf.slice(-overlap) + "\n\n" + p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }

  if (buf) chunks.push({ content: buf, index: idx });
  return chunks;
}
