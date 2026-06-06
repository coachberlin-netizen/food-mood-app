"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getWeekBounds } from "@/lib/weekly-insights"

// ── Types ─────────────────────────────────────────────────────────────────────

interface WeeklyDigest {
  fm_index_avg:      number | null
  fm_index_change:   number | null
  best_day:          string | null
  best_day_index:    number | null
  top_correlation_1: string | null
  top_correlation_2: string | null
  top_correlation_3: string | null
  record_broken:     boolean
  week_start:        string
  week_end:          string
}

interface DayEntry {
  log_date:    string
  index_value: number
  color_hex:   string | null
}

interface CuratedItem {
  id:           string
  category:     string
  title:        string
  excerpt:      string | null
  external_url: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────


function addDays(date: string, n: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d.toISOString().split("T")[0]
}

function formatShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

function formatDayName(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"]

const CATEGORY_META: Record<string, { emoji: string; label: string }> = {
  neurociencia:  { emoji: "🧬", label: "Neurociencia"  },
  alimentacion:  { emoji: "🌿", label: "Alimentación"  },
  psicologia:    { emoji: "🧠", label: "Psicología"    },
  longevidad:    { emoji: "🔬", label: "Longevidad"    },
  biotecnologia: { emoji: "💊", label: "Biotecnología" },
}

// ── ConfidenceBadge ───────────────────────────────────────────────────────────

function ConfidenceBadge({ value }: { value?: string }) {
  const bg = value === "alta" ? "#5A9B8A" : value === "media" ? "#C8902A" : "#8B2020"
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: bg }}
    >
      {value ?? "baja"}
    </span>
  )
}

// ── WeekMosaic ────────────────────────────────────────────────────────────────

const EXAMPLE_COLORS = ["#FFB000", "#00D1FF", "#FF6B00", "#00DD80", "#FF2D55", "#9D00FF", "#FFB000"]

function WeekMosaic({
  weekStart,
  dayEntries,
}: {
  weekStart: string
  dayEntries: DayEntry[]
}) {
  const isExample = dayEntries.length === 0
  const colorByDate = new Map(dayEntries.map(e => [e.log_date, e.color_hex]))
  const today = new Date().toISOString().split("T")[0]
  const days  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const color   = isExample ? EXAMPLE_COLORS[i] : colorByDate.get(date)
          const isToday = date === today
          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-lg"
                style={{
                  aspectRatio: "1",
                  backgroundColor: color ?? "#e8e0d0",
                  opacity: isExample ? 0.45 : date > today ? 0.35 : 1,
                  outline: isToday && !isExample ? "2px solid #FF6B35" : "none",
                  outlineOffset: "2px",
                }}
              />
              <span className="text-[9px] font-medium" style={{ color: "rgba(107,39,55,0.45)" }}>
                {DAY_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
      {isExample && (
        <p className="text-[11px] text-center mt-3" style={{ color: "rgba(107,39,55,0.4)" }}>
          Haz tu test diario para ver tu semana en colores reales
        </p>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SemanaPage() {
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [digest, setDigest]         = useState<WeeklyDigest | null>(null)
  const [dayEntries, setDayEntries] = useState<DayEntry[]>([])
  const [curated, setCurated]       = useState<CuratedItem[]>([])
  const [isPremium, setIsPremium]   = useState(false)
  const [isAuth, setIsAuth]         = useState(false)
  const [loading, setLoading]       = useState(true)

  const { weekStart, weekEnd } = useMemo(() => getWeekBounds(), [])

  useEffect(() => {
    async function init() {
      const [{ data: { user } }, tierRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch("/api/mi-tier"),
      ])

      if (!user) { setLoading(false); return }
      setIsAuth(true)
      if (tierRes.ok) {
        const tier = await tierRes.json()
        setIsPremium(tier.isPremium ?? false)
      }

      // Fetch digest + day colors + curated in parallel
      const [{ data: digestRaw }, { data: daysRaw }, { data: curatedRaw }] = await Promise.all([
        supabase
          .from("weekly_digest")
          .select("*")
          .eq("user_id", user.id)
          .eq("week_start", weekStart)
          .maybeSingle(),
        supabase
          .from("fm_index_log")
          .select("log_date, index_value, color_hex")
          .eq("user_id", user.id)
          .gte("log_date", weekStart)
          .lte("log_date", weekEnd),
        supabase
          .from("blog_posts")
          .select("id, category, title, excerpt, external_url")
          .eq("week_start", weekStart)
          .not("category", "is", null)
          .eq("status", "published")
          .order("category", { ascending: true })
          .limit(10),
      ])

      setDayEntries((daysRaw ?? []) as DayEntry[])
      setCurated((curatedRaw ?? []) as CuratedItem[])

      if (digestRaw) {
        setDigest(digestRaw as WeeklyDigest)
      } else {
        // Generate digest if it doesn't exist
        const res = await fetch("/api/weekly-summary", { method: "POST" })
        if (res.ok) {
          const { digest: generated } = await res.json()
          if (generated) setDigest(generated as WeeklyDigest)
        }
      }

      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Group curated by category
  const curatedByCategory = curated.reduce<Record<string, CuratedItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const correlations = [
    digest?.top_correlation_1,
    digest?.top_correlation_2,
    digest?.top_correlation_3,
  ].filter(Boolean) as string[]

  if (loading) {
    return (
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
        <div className="max-w-[520px] mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF6B35] border-t-transparent animate-spin" />
        </div>
      </main>
    )
  }

  if (!isAuth) {
    return (
      <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
        <div className="max-w-[520px] mx-auto px-4 py-16 text-center">
          <p className="font-serif text-2xl font-bold mb-4" style={{ color: "#2d0f16" }}>
            Tu semana en datos
          </p>
          <p className="text-sm font-light mb-8" style={{ color: "rgba(107,39,55,0.65)" }}>
            Regístrate para ver tu resumen semanal y correlaciones personales.
          </p>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: "#6B2737" }}
          >
            Empezar ahora
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      <div className="max-w-[520px] mx-auto px-4 py-8 pb-28">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="font-serif text-xl font-semibold" style={{ color: "#2d0f16" }}>
            Food<span style={{ color: "#FF6B35" }}>·</span>Mood
          </Link>
          <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
            {formatShort(weekStart)} – {formatShort(weekEnd)}
          </span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
            Tu semana en datos
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight mb-2" style={{ color: "#2d0f16" }}>
            Lo que tu cuerpo te dijo esta semana.
          </h1>
          <p className="text-sm font-light" style={{ color: "rgba(107,39,55,0.6)" }}>
            Correlaciones reales. Solo tuyas.
          </p>
        </div>

        {/* ── Índice de la semana ── */}
        {digest?.fm_index_avg != null && (
          <div
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: "#2d0f16" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
              Índice Food·Mood — media semanal
            </p>
            <div className="flex items-end gap-3 mb-2">
              <span
                className="font-serif font-black leading-none"
                style={{ fontSize: "clamp(52px,16vw,64px)", color: "#FF6B35" }}
              >
                {digest.fm_index_avg}
              </span>
              {digest.fm_index_change != null && (
                <span className="text-sm font-light text-white/60 mb-2">
                  {digest.fm_index_change >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(digest.fm_index_change)} vs sem. anterior
                </span>
              )}
            </div>

            {digest.best_day && digest.best_day_index != null && (
              <p className="text-xs font-light text-white/55">
                Mejor día: {formatDayName(digest.best_day)} — índice {digest.best_day_index}
              </p>
            )}

            {digest.record_broken && (
              <div
                className="mt-3 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ backgroundColor: "rgba(255,107,53,0.18)", color: "#FF6B35" }}
              >
                🏆 ¡Nuevo récord personal esta semana!
              </div>
            )}
          </div>
        )}

        {/* ── Mosaico semanal ── */}
        <div
          className="rounded-3xl p-5 mb-6"
          style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#FF6B35" }}>
            Tu semana en colores
          </p>
          <WeekMosaic weekStart={weekStart} dayEntries={dayEntries} />
        </div>

        {/* ── Correlaciones de la semana ── */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#6B2737" }}>
            Tus correlaciones de la semana
          </p>

          {!isPremium ? (
            <div className="relative rounded-2xl overflow-hidden">
              <div style={{ filter: "blur(5px)", pointerEvents: "none" }}>
                {[
                  "Los días con fermentados tu tensión baja 18 puntos de media.",
                  "Con proteína en el bol, tu claridad sube 22 puntos.",
                  "Los días con procesados tu ánimo cae 15 puntos.",
                ].map((txt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl mb-2"
                    style={{ backgroundColor: "white", borderLeft: "4px solid #FF6B35" }}
                  >
                    <p className="text-sm italic" style={{ color: "#2d0f16" }}>{txt}</p>
                  </div>
                ))}
              </div>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: "rgba(245,240,232,0.85)" }}
              >
                <span className="text-2xl">🔐</span>
                <p className="text-sm font-semibold text-center" style={{ color: "#2d0f16" }}>
                  Correlaciones personales
                </p>
                <Link
                  href="/pricing"
                  className="px-5 py-2 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#6B2737" }}
                >
                  Desbloquear Premium
                </Link>
              </div>
            </div>
          ) : correlations.length === 0 ? (
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: "white", borderLeft: "4px solid rgba(255,107,53,0.35)" }}
            >
              <p className="text-sm" style={{ color: "rgba(107,39,55,0.6)" }}>
                Aún no hay correlaciones — combina test diario, bol y síntomas esta semana.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {correlations.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: "white", borderLeft: "4px solid #FF6B35", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                >
                  <ConfidenceBadge />
                  <p
                    className="text-sm font-light leading-relaxed italic mt-2"
                    style={{ fontFamily: "var(--font-cormorant, serif)", color: "#2d0f16" }}
                  >
                    {c}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Curated ── */}
        {(curated.length > 0 || true) && (
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#6B2737" }}>
              Lo que importa saber esta semana
            </p>

            {curated.length === 0 ? (
              <div
                className="p-5 rounded-2xl text-center"
                style={{ backgroundColor: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
              >
                <p className="text-sm" style={{ color: "rgba(107,39,55,0.5)" }}>
                  El equipo está seleccionando el contenido de esta semana. Vuelve el domingo.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {Object.entries(curatedByCategory).map(([cat, items]) => {
                  const meta = CATEGORY_META[cat] ?? { emoji: "📌", label: cat }
                  return (
                    <div key={cat}>
                      <p
                        className="text-[10px] font-bold uppercase tracking-widest mb-2"
                        style={{ color: "#FF6B35" }}
                      >
                        {meta.emoji} {meta.label}
                      </p>
                      {items.map(item => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl mb-2"
                          style={{ backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                        >
                          <p className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>
                            {item.title}
                          </p>
                          {item.excerpt && (
                            <p className="text-xs font-light leading-relaxed mb-2" style={{ color: "rgba(107,39,55,0.65)" }}>
                              {item.excerpt}
                            </p>
                          )}
                          {item.external_url && (
                            <a
                              href={item.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold"
                              style={{ color: "#6B2737" }}
                            >
                              Leer más →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── CTA Comunidad gratuita ── */}
        <div
          className="rounded-3xl p-6 text-center"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
            Comunidad gratuita
          </p>
          <p className="font-serif text-lg font-bold text-white mb-2">
            Newsletter semanal · Podcast · Telegram y WhatsApp
          </p>
          <p className="text-xs font-light leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
            Contenido científico y recetas funcionales — sin coste, sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/foodmoodapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "#229ED9" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Unirse en Telegram
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbCEhFoCsU9LDcPX362R"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Seguir en WhatsApp
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}
