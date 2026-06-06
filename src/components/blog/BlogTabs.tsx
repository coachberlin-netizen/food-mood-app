"use client"

import { useState } from "react"
import Link from "next/link"
import { EDITORIAL_NEWSLETTERS } from "@/lib/editorial-newsletters"
import type { BlogPost } from "@/lib/supabase/blog"
import { BlogCard } from "./BlogCard"

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string }> = {
  neurociencia:  { emoji: "🧬", label: "Neurociencia",  color: "#7A5AAA" },
  alimentacion:  { emoji: "🌿", label: "Alimentación",  color: "#5A9B8A" },
  psicologia:    { emoji: "🧠", label: "Psicología",    color: "#4A7AB5" },
  longevidad:    { emoji: "🔬", label: "Longevidad",    color: "#C8902A" },
  biotecnologia: { emoji: "💊", label: "Biotecnología", color: "#C04878" },
}

function weekLabel(weekStart: string | null, newsletterDate: string | null): string {
  const raw = weekStart ?? newsletterDate
  if (!raw) return "Archivo"
  const d = new Date(raw)
  const end = new Date(d)
  end.setDate(d.getDate() + 6)
  const fmt = (dt: Date) => dt.toLocaleDateString("es-ES", { day: "numeric", month: "long" })
  return `${fmt(d)} – ${fmt(end)}`
}

type Tab = "newsletters" | "articulos"

export function BlogTabs({ posts }: { posts: BlogPost[] }) {
  const [tab, setTab] = useState<Tab>("newsletters")

  // Group Supabase posts by week
  const grouped = new Map<string, BlogPost[]>()
  for (const post of posts) {
    const key = post.week_start ?? post.newsletter_date ?? "__archivo__"
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(post)
  }
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    if (a === "__archivo__") return 1
    if (b === "__archivo__") return -1
    return b.localeCompare(a)
  })

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* ── Tab bar ── */}
      <div className="flex gap-1 mb-10 border-b border-[#6B2737]/10">
        {([
          { id: "newsletters", label: `Newsletters (${EDITORIAL_NEWSLETTERS.length})` },
          { id: "articulos",   label: `Artículos${posts.length ? ` (${posts.length})` : ""}` },
        ] as { id: Tab; label: string }[]).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px"
            style={tab === t.id
              ? { color: "#6B2737", borderColor: "#FF6B35" }
              : { color: "rgba(107,39,55,0.4)", borderColor: "transparent" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Newsletter archive ── */}
      {tab === "newsletters" && (
        <div className="flex flex-col divide-y divide-[#6B2737]/8">
          {[...EDITORIAL_NEWSLETTERS].reverse().map(nl => (
            <Link
              key={nl.slug}
              href={`/newsletter/${nl.slug}`}
              className="group flex items-baseline gap-4 py-4 hover:bg-[#6B2737]/3 -mx-3 px-3 rounded-xl transition-colors"
            >
              <span className="font-serif text-xs shrink-0 w-6 text-right" style={{ color: "#FF6B35", opacity: 0.6 }}>
                {nl.numero}
              </span>
              <span className="text-[15px] font-light flex-1 leading-snug transition-colors" style={{ color: "#2d0f16" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#6B2737")}
                onMouseLeave={e => (e.currentTarget.style.color = "#2d0f16")}
              >
                {nl.subject}
              </span>
              <span className="text-xs shrink-0 transition-colors" style={{ color: "rgba(107,39,55,0.3)" }}>→</span>
            </Link>
          ))}
        </div>
      )}

      {/* ── Articles from Supabase ── */}
      {tab === "articulos" && (
        sortedKeys.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F0E8] rounded-2xl border border-[#6B2737]/5">
            <p className="text-[#6B2737]/40 font-light italic">
              Vuelve el próximo domingo — el equipo está preparando el contenido.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {sortedKeys.map(key => {
              const weekPosts = grouped.get(key)!
              const firstPost = weekPosts[0]
              const label = key === "__archivo__"
                ? "Archivo"
                : weekLabel(firstPost.week_start, firstPost.newsletter_date)
              const curated = weekPosts.filter(p => p.category)
              const regular = weekPosts.filter(p => !p.category)
              return (
                <div key={key}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-[#FF6B35] opacity-30 flex-1" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B2737] whitespace-nowrap">{label}</span>
                    <div className="h-px bg-[#FF6B35] opacity-30 flex-1" />
                  </div>
                  {curated.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {curated.map(post => {
                        const meta = CATEGORY_META[post.category ?? ""] ?? { emoji: "📌", label: post.category ?? "", color: "#6B2737" }
                        return (
                          <div key={post.id} className="bg-white rounded-2xl p-6 border border-[#2d0f16]/6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: meta.color }}>
                                {meta.emoji} {meta.label}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-[#2d0f16] mb-2 leading-snug">{post.title}</h3>
                            {post.excerpt && <p className="text-sm text-[#2d0f16]/60 font-light leading-relaxed mb-4">{post.excerpt}</p>}
                            <a href={post.external_url ?? `/blog/${post.slug}`} target={post.external_url ? "_blank" : undefined} rel={post.external_url ? "noopener noreferrer" : undefined} className="text-xs font-bold text-[#6B2737] hover:underline">
                              Leer más →
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {regular.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {regular.map(post => <BlogCard key={post.id} post={post} />)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

    </div>
  )
}
