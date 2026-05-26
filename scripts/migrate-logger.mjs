import { readFileSync, writeFileSync } from "fs";

const files = [
  "src/app/api/agent/chat/route.ts",
  "src/app/api/ai/chat/route.ts",
  "src/app/api/auth/setup/route.ts",
  "src/app/api/biomarkers/callback/[provider]/route.ts",
  "src/app/api/biomarkers/sync/route.ts",
  "src/app/api/chat/mood/route.ts",
  "src/app/api/checkout/route.ts",
  "src/app/api/images/generate/route.ts",
  "src/app/api/leads/route.ts",
  "src/app/api/mi-tier/route.ts",
  "src/app/api/notifications/tick/route.ts",
  "src/app/api/push/send/route.ts",
  "src/app/api/push/send-reto/route.ts",
  "src/app/api/push/subscribe/route.ts",
  "src/app/api/receta-gratis/route.ts",
  "src/app/api/recetas/route.ts",
  "src/app/api/recetas/[id]/route.ts",
  "src/app/api/recipe/generate/route.ts",
  "src/app/api/recipes/generate/route.ts",
  "src/app/api/retos/complete-day/route.ts",
  "src/app/api/retos/generar-informe/route.ts",
  "src/app/api/retos/restart/route.ts",
  "src/app/api/stripe/checkout/route.ts",
  "src/app/api/stripe/create-checkout/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/telegram/webhook/route.ts",
  "src/app/api/user/delete-all-data/route.ts",
  "src/app/api/voice/tts/route.ts",
  "src/app/api/waitlist/route.ts",
  "src/lib/ai/image-generator.ts",
  "src/lib/claude.ts",
  "src/lib/daily-inspiration.ts",
  "src/lib/mood-diary.ts",
  "src/lib/premium.ts",
  "src/lib/stripe.ts",
  "src/lib/supabase/blog.ts",
  "src/lib/supabase/newsletter.ts",
];

const IMPORT_LINE = 'import logger from "@/lib/logger"';

let changed = 0;

for (const f of files) {
  let content;
  try {
    content = readFileSync(f, "utf8");
  } catch {
    console.warn("Skipping (not found):", f);
    continue;
  }

  const original = content;

  content = content.replaceAll("console.log(", "logger.info(");
  content = content.replaceAll("console.warn(", "logger.warn(");
  content = content.replaceAll("console.error(", "logger.error(");
  content = content.replaceAll("console.info(", "logger.info(");

  if (content !== original) {
    // Inject import if not already present
    const hasImport =
      content.includes('from "@/lib/logger"') ||
      content.includes("from '@/lib/logger'");

    if (!hasImport) {
      // Insert after the last import in the file's leading import block
      const lines = content.split("\n");
      let lastImportIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("import ")) lastImportIdx = i;
        else if (lastImportIdx !== -1 && lines[i].trim() !== "" && !lines[i].startsWith("import ")) break;
      }
      if (lastImportIdx === -1) {
        content = IMPORT_LINE + "\n" + content;
      } else {
        lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
        content = lines.join("\n");
      }
    }

    writeFileSync(f, content, "utf8");
    changed++;
    console.log("✓", f);
  }
}

console.log(`\nDone — ${changed} files updated.`);
