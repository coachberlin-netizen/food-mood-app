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

function WeekMosaic({
  weekStart,
  dayEntries,
}: {
  weekStart: string
  dayEntries: DayEntry[]
}) {
  const colorByDate = new Map(dayEntries.map(e => [e.log_date, e.color_hex]))
  const today = new Date().toISOString().split("T")[0]
  const days  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date, i) => {
        const color   = colorByDate.get(date)
        const isToday = date === today
        return (
          <div key={date} className="flex flex-col items-center gap-1.5">
            <div
              className="w-full rounded-lg"
              style={{
                aspectRatio: "1",
                backgroundColor: color ?? "#e8e0d0",
                opacity: date > today ? 0.35 : 1,
                outline: isToday ? "2px solid #C9A84C" : "none",
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
          <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
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
            Food<span style={{ color: "#C9A84C" }}>·</span>Mood
          </Link>
          <span className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
            {formatShort(weekStart)} – {formatShort(weekEnd)}
          </span>
        </div>

        {/* ── Hero ── */}
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
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
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
              Índice Food·Mood — media semanal
            </p>
            <div className="flex items-end gap-3 mb-2">
              <span
                className="font-serif font-black leading-none"
                style={{ fontSize: "clamp(52px,16vw,64px)", color: "#C9A84C" }}
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
                style={{ backgroundColor: "rgba(201,168,76,0.18)", color: "#C9A84C" }}
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
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#C9A84C" }}>
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
                    style={{ backgroundColor: "white", borderLeft: "4px solid #C9A84C" }}
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
              style={{ backgroundColor: "white", borderLeft: "4px solid rgba(201,168,76,0.35)" }}
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
                  style={{ backgroundColor: "white", borderLeft: "4px solid #C9A84C", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
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
                  El equipo está curating el contenido de esta semana. Vuelve el domingo.
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
                        style={{ color: "#C9A84C" }}
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

        {/* ── CTA WhatsApp Premium ── */}
        <div
          className="rounded-3xl p-6 text-center"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
            Club Premium
          </p>
          <p className="font-serif text-lg font-bold text-white mb-2">
            Canal privado de Telegram + comunidad WhatsApp
          </p>
          <p className="text-xs font-light leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
            Suscríbete y accede a contenido científico exclusivo en Telegram
            y a la comunidad de WhatsApp — solo para premium.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{ backgroundColor: "#6B2737", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            Ver planes →
          </Link>
        </div>

      </div>
    </main>
  )
}
