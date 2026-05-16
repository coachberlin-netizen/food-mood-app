/**
 * QA runner para el agente Food·Mood.
 *
 * Uso:
 *   npx tsx scripts/qa-run.ts                      # sin RAG (StubRagStore)
 *   npx tsx scripts/qa-run.ts --rag                # con PgvectorRagStore + Voyage
 *   npx tsx scripts/qa-run.ts --model claude-sonnet-4-6
 *   npx tsx scripts/qa-run.ts --no-judge           # salta la evaluación LLM
 *   npx tsx scripts/qa-run.ts --out custom.md
 *
 * Variables de entorno necesarias (.env.local):
 *   ANTHROPIC_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (si --rag)
 *   VOYAGE_API_KEY (si --rag)
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { Orchestrator } from "../src/agent/orchestrator";
import { StubRagStore } from "../src/agent/rag";
import { PgvectorRagStore } from "../src/agent/rag/pgvector-store";
import { VoyageEmbedder } from "../src/agent/rag/embedder";
import { runQa } from "../src/qa/runner";
import { judgeResults } from "../src/qa/judge";
import { exportMarkdown } from "../src/qa/export";

// ── CLI args ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const useRag    = argv.includes("--rag");
const noJudge   = argv.includes("--no-judge");
const modelIdx  = argv.indexOf("--model");
const model     = modelIdx >= 0 ? argv[modelIdx + 1] : "claude-haiku-4-5-20251001";
const outIdx    = argv.indexOf("--out");
const outFile   = outIdx >= 0 ? argv[outIdx + 1] : `qa-report-${new Date().toISOString().slice(0,10)}.md`;

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  let rag: StubRagStore | PgvectorRagStore;
  if (useRag) {
    const voyageKey = process.env.VOYAGE_API_KEY;
    if (!voyageKey) {
      console.error("❌ --rag requiere VOYAGE_API_KEY en .env.local");
      process.exit(1);
    }
    rag = new PgvectorRagStore(new VoyageEmbedder(voyageKey));
    console.log("📡 RAG: PgvectorRagStore (Voyage + pgvector)");
  } else {
    rag = new StubRagStore();
    console.log("🔇 RAG: StubRagStore (sin embeddings, tests reproducibles)");
  }

  const orch = new Orchestrator({
    anthropic,
    rag,
    model,
    logger: event => {
      if (process.env.QA_VERBOSE) console.log("[agent]", JSON.stringify(event));
    },
  });

  const casesPath = path.join(process.cwd(), "src", "qa", "cases.yml");
  console.log(`\n🧪 Ejecutando casos desde ${casesPath}`);
  console.log(`   Modelo agente: ${model}`);

  const results = await runQa(casesPath, orch);

  const passCount = results.filter(r => r.response.kind === "ok").length;
  const errCount  = results.filter(r => r.response.kind === "error").length;
  const blockedCount = results.filter(r => r.response.kind === "blocked").length;
  console.log(`\n📊 Resultados brutos: ${results.length} casos`);
  console.log(`   ok: ${passCount} · blocked: ${blockedCount} · error: ${errCount}`);

  let judged;
  if (noJudge) {
    console.log("\n⏭  Juicio LLM omitido (--no-judge)");
    judged = results as typeof results;
  } else {
    console.log("\n🤖 Evaluando con juez LLM (claude-haiku-4-5-20251001)…");
    judged = await judgeResults(anthropic, results);

    const passJ = judged.filter(r => "veredicto" in (r as any).judgment && (r as any).judgment.veredicto === "pass").length;
    const reviewJ = judged.filter(r => "veredicto" in (r as any).judgment && (r as any).judgment.veredicto === "needs_review").length;
    const failJ = judged.filter(r => "veredicto" in (r as any).judgment && (r as any).judgment.veredicto === "fail").length;
    console.log(`   pass: ${passJ} · needs_review: ${reviewJ} · fail: ${failJ}`);
  }

  const outPath = path.join(process.cwd(), outFile);
  await exportMarkdown(judged, outPath);
  console.log(`\n✅ Reporte exportado: ${outPath}`);
  console.log("   Abre el markdown, revisa los casos marcados y añota tus observaciones.\n");
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
