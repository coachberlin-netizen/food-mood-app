import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config({ path: path.join(process.cwd(), ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.RECETAS_SUPABASE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service key. Check .env.local")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const NEWSLETTERS_DIR = path.join(process.cwd(), "newsletters")

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&ordm;/g,   "º")
    .replace(/&mdash;/g,  "—")
    .replace(/&ndash;/g,  "–")
    .replace(/&nbsp;/g,   " ")
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g,    "&")
    .replace(/&lt;/g,     "<")
    .replace(/&gt;/g,     ">")
    .replace(/&quot;/g,   '"')
    .replace(/&#39;/g,    "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!match) return "Newsletter Food·Mood"
  return decodeHtmlEntities(match[1].trim())
}

function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return match ? match[1].trim() : html
}

function fileToSlug(filename: string): string {
  const base = path.basename(filename, ".html")
  return `newsletter-${base}`
}

async function seed() {
  const files = fs.readdirSync(NEWSLETTERS_DIR)
    .filter(f => f.endsWith(".html"))
    .sort()

  console.log(`Seeding ${files.length} newsletters into content_library…\n`)

  let ok = 0
  let errors = 0

  for (const file of files) {
    const html     = fs.readFileSync(path.join(NEWSLETTERS_DIR, file), "utf-8")
    const slug     = fileToSlug(file)
    const title    = extractTitle(html)
    const bodyHtml = extractBody(html)

    const { data: existing } = await admin
      .from("content_library")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()

    let error: { message: string } | null = null

    if (existing) {
      const { error: updateErr } = await admin
        .from("content_library")
        .update({
          title,
          content_type: "newsletter",
          body_html:    bodyHtml,
          is_published: true,
          tags:         ["newsletter"],
        })
        .eq("id", existing.id)
      error = updateErr
    } else {
      const { error: insertErr } = await admin
        .from("content_library")
        .insert({
          slug,
          title,
          content_type: "newsletter",
          body_html:    bodyHtml,
          is_published: true,
          tags:         ["newsletter"],
        })
      error = insertErr
    }

    if (error) {
      console.error(`  ERROR  ${file}:`, error.message)
      errors++
    } else {
      const action = existing ? "updated" : "inserted"
      console.log(`  ${action.padEnd(8)} ${slug}`)
      console.log(`           ${title.substring(0, 70)}`)
      ok++
    }
  }

  console.log(`\nDone — ${ok} OK, ${errors} errors`)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
