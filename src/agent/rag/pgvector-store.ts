import { createClient } from "@supabase/supabase-js";
import type { RagStore } from "../rag";
import type { Embedder } from "./embedder";

// Maps spec KB ids → existing DB chunk_type values
const KB_MAP: Record<"food-mood" | "longevity", "foodmood" | "longevidad"> = {
  "food-mood": "foodmood",
  "longevity":  "longevidad",
};

export class PgvectorRagStore implements RagStore {
  private readonly supabase;

  constructor(private readonly embedder: Embedder) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async search(args: { kb: "food-mood" | "longevity"; query: string; k: number }): Promise<string[]> {
    const [vec] = await this.embedder.embed([args.query]);
    const chunkType = KB_MAP[args.kb];

    const { data, error } = await this.supabase.rpc("match_kb_chunks", {
      query_embedding:   vec,
      chunk_type_filter: chunkType,
      match_count:       args.k,
    });

    if (error) throw new Error(`RAG search error: ${error.message}`);
    return ((data ?? []) as Array<{ content: string }>).map(r => r.content);
  }

  async drugInteractionsFor(_medications: string[]): Promise<string[]> {
    // Drug interactions live in the safety middleware JSON — return empty here
    return [];
  }
}
