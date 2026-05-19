import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

export interface KbMeta {
  slug: string
  filename: string
  title: string
  section: string
  mood_relevance: string[]
  palancas_longevidad: string[]
  nivel_evidencia_general: 'A' | 'B' | 'C' | 'D'
  audiencia_primaria: string
  last_updated: string
  intro: string
  orden: number
}

export interface KbSection {
  anchor: string
  heading: string
  level: number
  html: string
}

export interface KbDoc extends KbMeta {
  sections: KbSection[]
}

const KB_DIR = path.join(process.cwd(), 'content', 'kb', 'longevidad')

export function slugify(filename: string): string {
  return filename
    .replace(/^\d+_/, '')
    .replace(/\.md$/, '')
    .replace(/_/g, '-')
}

export function toAnchor(heading: string): string {
  return heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function mdToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)
  return String(result)
}

function extractOrder(filename: string): number {
  const match = filename.match(/^(\d+)_/)
  return match ? parseInt(match[1], 10) : 99
}

function extractIntro(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && trimmed.length > 40) {
      return trimmed.slice(0, 160) + (trimmed.length > 160 ? '…' : '')
    }
  }
  return ''
}

export function getAllKbsMeta(): KbMeta[] {
  const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md')).sort()

  return files.map(filename => {
    const raw = fs.readFileSync(path.join(KB_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)
    const title = data.title || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || filename

    return {
      slug: slugify(filename),
      filename,
      title,
      section: data.section || slugify(filename),
      mood_relevance: Array.isArray(data.mood_relevance) ? data.mood_relevance : [],
      palancas_longevidad: Array.isArray(data.palancas_longevidad) ? data.palancas_longevidad : [],
      nivel_evidencia_general: (data.nivel_evidencia_general || 'B') as 'A' | 'B' | 'C' | 'D',
      audiencia_primaria: data.audiencia_primaria || '',
      last_updated: data.last_updated || '2026-05',
      intro: extractIntro(content),
      orden: extractOrder(filename),
    }
  })
}

export async function getKbBySlug(slug: string): Promise<KbDoc | null> {
  const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md')).sort()
  const filename = files.find(f => slugify(f) === slug)
  if (!filename) return null

  const raw = fs.readFileSync(path.join(KB_DIR, filename), 'utf-8')
  const { data, content } = matter(raw)

  const title = data.title || content.match(/^#\s+(.+)$/m)?.[1]?.trim() || filename

  // Split by ## or ### headings (skip # h1 title line)
  const sectionRegex = /^(#{2,3})\s+(.+)$/gm
  const matches = Array.from(content.matchAll(sectionRegex))

  const sections: KbSection[] = []
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const level = match[1].length
    const heading = match[2].trim()
    const start = match.index! + match[0].length
    const end = matches[i + 1]?.index ?? content.length
    const body = content.slice(start, end).trim()

    const html = await mdToHtml(`${match[1]} ${heading}\n\n${body}`)
    sections.push({
      anchor: toAnchor(heading),
      heading,
      level,
      html,
    })
  }

  return {
    slug,
    filename,
    title,
    section: data.section || slug,
    mood_relevance: Array.isArray(data.mood_relevance) ? data.mood_relevance : [],
    palancas_longevidad: Array.isArray(data.palancas_longevidad) ? data.palancas_longevidad : [],
    nivel_evidencia_general: (data.nivel_evidencia_general || 'B') as 'A' | 'B' | 'C' | 'D',
    audiencia_primaria: data.audiencia_primaria || '',
    last_updated: data.last_updated || '2026-05',
    intro: extractIntro(content),
    orden: extractOrder(filename),
    sections,
  }
}

export function getDailyExtractSeed(userId: string): { kbIndex: number; sectionIndex: number } {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  const seed = Array.from(today + userId.slice(0, 8)).reduce(
    (acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 0
  )
  return {
    kbIndex: seed % 16,
    sectionIndex: (seed * 7 + 3) & 0x7fffffff,
  }
}
