export interface Embedder {
  embed(texts: string[]): Promise<number[][]>;
}

export class VoyageEmbedder implements Embedder {
  constructor(private readonly apiKey: string, private readonly model = "voyage-3") {}

  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ input: texts, model: this.model, input_type: "document" }),
    });
    if (!res.ok) throw new Error(`Voyage ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.data.map((d: { embedding: number[] }) => d.embedding);
  }
}
