'use client'

import { useEffect, useState, useCallback } from 'react'
import type { KbDoc } from '@/lib/enciclopedia'

interface BookmarkState {
  [anchor: string]: boolean
}

interface Props {
  kb: KbDoc
}

export function KbDetailClient({ kb }: Props) {
  const [bookmarks, setBookmarks] = useState<BookmarkState>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/enciclopedia/bookmarks?slug=${kb.slug}`)
      .then(r => r.json())
      .then((data: { section_anchor: string }[]) => {
        if (Array.isArray(data)) {
          const map: BookmarkState = {}
          data.forEach(b => { map[b.section_anchor] = true })
          setBookmarks(map)
        }
      })
      .catch(() => {})
  }, [kb.slug])

  const toggleBookmark = useCallback(async (anchor: string, heading: string) => {
    const isBookmarked = bookmarks[anchor]
    setSaving(anchor)

    try {
      if (isBookmarked) {
        await fetch('/api/enciclopedia/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kb_slug: kb.slug, section_anchor: anchor }),
        })
        setBookmarks(prev => ({ ...prev, [anchor]: false }))
      } else {
        await fetch('/api/enciclopedia/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kb_slug: kb.slug, section_anchor: anchor, section_title: heading }),
        })
        setBookmarks(prev => ({ ...prev, [anchor]: true }))
      }
    } catch {
      // silently fail — state reverts on next load
    } finally {
      setSaving(null)
    }
  }, [bookmarks, kb.slug])

  return (
    <div className="space-y-12">
      {kb.sections.map(section => (
        <article
          key={section.anchor}
          id={section.anchor}
          className="scroll-mt-24"
        >
          <div className="flex items-start justify-between gap-4 mb-1">
            <div
              className="kb-section prose prose-sm max-w-none flex-1"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
            <button
              onClick={() => toggleBookmark(section.anchor, section.heading)}
              disabled={saving === section.anchor}
              className="shrink-0 mt-1 p-1.5 rounded-full transition-all hover:scale-110 active:scale-95"
              style={{
                color: bookmarks[section.anchor] ? '#C9A84C' : 'rgba(26,22,18,0.2)',
                backgroundColor: bookmarks[section.anchor] ? 'rgba(201,168,76,0.08)' : 'transparent',
              }}
              title={bookmarks[section.anchor] ? 'Quitar marcador' : 'Guardar sección'}
              aria-label={bookmarks[section.anchor] ? 'Quitar marcador' : 'Guardar sección'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarks[section.anchor] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
