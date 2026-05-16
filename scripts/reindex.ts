import "dotenv/config";
import { reindex } from "../src/agent/rag/cli";

async function main() {
  const [kb, dir] = process.argv.slice(2);
  if (!kb || !dir || (kb !== "food-mood" && kb !== "longevity")) {
    console.error("Uso: npx tsx scripts/reindex.ts <food-mood|longevity> <dir>");
    process.exit(1);
  }
  const missing = ["DATABASE_URL", "VOYAGE_API_KEY"].filter(k => !process.env[k]);
  if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log(`[reindex] kb=${kb} dir=${dir}`);
  await reindex(kb, dir);
  console.log("Reindexación completada.");
}

main().catch(e => { console.error(e); process.exit(1); });
