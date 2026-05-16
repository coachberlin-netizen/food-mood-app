import { writeFile } from "node:fs/promises";
import type { JudgedResult, Judgment } from "./judge";
import type { QaResult } from "./runner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function badge(v: string | undefined): string {
  if (v === "pass")         return "✅ pass";
  if (v === "needs_review") return "⚠️ needs_review";
  if (v === "fail")         return "❌ fail";
  return "⬜ unjudged";
}

function scoreLine(dims: Judgment["dimensiones"]): string {
  return Object.entries(dims)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(" · ");
}

// ── Markdown export ───────────────────────────────────────────────────────────

export async function exportMarkdown(
  results: (QaResult & { judgment?: Judgment | { error: string } })[],
  outPath: string,
): Promise<void> {
  const lines: string[] = [];

  // ── Header ──
  lines.push("# QA del agente Food·Mood — Resultados\n");
  lines.push(`_Generado: ${new Date().toISOString()}_\n`);

  // ── Resumen ──
  const counts: Record<string, number> = {};
  for (const r of results) {
    const v = (r as JudgedResult).judgment && "veredicto" in (r as JudgedResult).judgment
      ? ((r as JudgedResult).judgment as Judgment).veredicto
      : "unjudged";
    counts[v] = (counts[v] ?? 0) + 1;
  }

  const total = results.length;
  const passed = counts["pass"] ?? 0;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  lines.push("## Resumen\n");
  lines.push(`| Veredicto | N |`);
  lines.push(`|---|---|`);
  for (const [k, n] of Object.entries(counts)) {
    lines.push(`| ${badge(k)} | ${n} |`);
  }
  lines.push(`\n**Pass rate: ${pct}% (${passed}/${total})**\n`);

  // ── Por caso ──
  lines.push("## Casos\n");

  for (const r of results) {
    const j = (r as JudgedResult).judgment;
    const isJudgment = j && "veredicto" in j;
    const verdict = isJudgment ? (j as Judgment).veredicto : undefined;

    lines.push(`### ${badge(verdict)} \`${r.case.id}\``);
    lines.push(`**${r.case.description}**\n`);
    lines.push(`Latencia: ${Math.round(r.latencyMs)} ms`);

    if (isJudgment) {
      const jj = j as Judgment;
      lines.push(`\nPuntuaciones: ${scoreLine(jj.dimensiones)}`);
      if (jj.notas) lines.push(`\nNotas del juez: _${jj.notas}_`);
    } else if (j && "error" in j) {
      lines.push(`\n⚠️ Error al evaluar: ${(j as { error: string }).error}`);
    }

    lines.push("\n<details><summary>Expectativas</summary>\n");
    lines.push("```json");
    lines.push(JSON.stringify(r.case.expect, null, 2));
    lines.push("```\n</details>\n");

    lines.push("<details><summary>Respuesta del agente</summary>\n");
    lines.push("```json");
    lines.push(JSON.stringify(r.response, null, 2));
    lines.push("```\n</details>\n");

    lines.push("- [ ] Revisado por autora\n");
    lines.push("---\n");
  }

  await writeFile(outPath, lines.join("\n"), "utf8");
}
