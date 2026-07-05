import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from './markdown'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface MdxFrontmatter {
  title: string
  description: string
  date: string
  author: string
  authorCredentials: string
  keywords: string[]
  slug: string
  canonical: string
}

export interface MdxPostMeta extends MdxFrontmatter {
  readingTimeMinutes: number
}

export interface MdxPost extends MdxPostMeta {
  contentHtml: string
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.(mdx?|md)$/, '')
}

// Normalise to a path — strips https://www.food-mood.app prefix if present.
function toPath(canonical: string): string {
  return canonical.replace(/^https?:\/\/www\.food-mood\.app/, '')
}

function estimateReadingTime(text: string): number {
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))
}

export function getAllMdxPosts(): MdxPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => /\.(mdx?|md)$/.test(f))
    .map(filename => {
      const src = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(src)
      const fm = data as Partial<MdxFrontmatter>
      const slug = fm.slug || slugFromFilename(filename)
      return {
        slug,
        title: fm.title || '',
        description: fm.description || '',
        date: fm.date || '',
        author: fm.author || 'M.Muralter',
        authorCredentials: fm.authorCredentials || '',
        keywords: fm.keywords || [],
        canonical: toPath(fm.canonical || `/blog/${slug}`),
        readingTimeMinutes: estimateReadingTime(content),
      } satisfies MdxPostMeta
    })
    .filter(p => Boolean(p.title) && Boolean(p.date))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getMdxPostBySlug(slug: string): Promise<MdxPost | null> {
  if (!fs.existsSync(BLOG_DIR)) return null

  const files = fs.readdirSync(BLOG_DIR).filter(f => /\.(mdx?|md)$/.test(f))
  for (const filename of files) {
    const src = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
    const { data, content } = matter(src)
    const fm = data as Partial<MdxFrontmatter>
    const fileSlug = fm.slug || slugFromFilename(filename)
    if (fileSlug !== slug) continue

    return {
      slug: fileSlug,
      title: fm.title || '',
      description: fm.description || '',
      date: fm.date || '',
      author: fm.author || 'M.Muralter',
      authorCredentials: fm.authorCredentials || '',
      keywords: fm.keywords || [],
      canonical: toPath(fm.canonical || `/blog/${fileSlug}`),
      readingTimeMinutes: estimateReadingTime(content),
      contentHtml: await markdownToHtml(content),
    }
  }

  return null
}
