import { describe, it, expect } from "vitest";
import { chunkText } from "../chunker";

describe("chunkText", () => {
  it("respeta párrafos cuando caben", () => {
    const out = chunkText("p1\n\np2\n\np3", { targetChars: 100 });
    expect(out.length).toBe(1);
  });

  it("trocea cuando excede target", () => {
    const long = Array.from({ length: 10 }, (_, i) => `parrafo ${i} `.repeat(50)).join("\n\n");
    const out = chunkText(long, { targetChars: 500, overlapChars: 50 });
    expect(out.length).toBeGreaterThan(1);
    expect(out[0].index).toBe(0);
  });

  it("asigna índices consecutivos", () => {
    const long = Array.from({ length: 6 }, (_, i) => `párrafo ${i} `.repeat(40)).join("\n\n");
    const out = chunkText(long, { targetChars: 400, overlapChars: 50 });
    out.forEach((c, i) => expect(c.index).toBe(i));
  });

  it("filtra párrafos vacíos", () => {
    const out = chunkText("a\n\n\n\nb", { targetChars: 1000 });
    expect(out.length).toBe(1);
    expect(out[0].content).toContain("a");
    expect(out[0].content).toContain("b");
  });
});
