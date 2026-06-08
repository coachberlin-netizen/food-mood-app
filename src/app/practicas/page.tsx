import type { Metadata } from "next"
import Link from "next/link"
import { Brain, BookOpen, MessageSquare, Thermometer, Utensils, Heart, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Mis prácticas | Food·Mood",
  description: "Herramientas conductuales para tu bienestar.",
}

const BURGUNDY = "#6B2737"
const DARK     = "#2d0f16"

type ToolDef = {
  href:        string
  icon:        React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  title:       string
  description: string
  badges:      string[]
  time:        string
  table:       string
  daily:       boolean
}

const TOOLS: ToolDef[] = [
  {
    href:        "/registro/interoceptivo",
    icon:        Brain,
    title:       "Check-in interoceptivo",
    description: "Registra tu estado del sistema nervioso y las señales de tu cuerpo.",
    badges:      ["Polivagal", "Interocepción"],
    time:        "60–90 seg",
    table:       "interoceptive_checkins",
    daily:       true,
  },
  {
    href:        "/registro/hambre",
    icon:        Thermometer,
    title:       "Termómetro de hambre",
    description: "Distingue hambre física, emocional y claridad interoceptiva antes de comer.",
    badges:      ["Interocepción", "Alimentación consciente"],
    time:        "1 min",
    table:       "hunger_thermometer_logs",
    daily:       true,
  },
  {
    href:        "/registro/emocion",
    icon:        BookOpen,
    title:       "Registro emocional",
    description: "Expande tu vocabulario emocional con un diálogo guiado por IA.",
    badges:      ["Granularidad emocional"],
    time:        "4 turnos",
    table:       "emotion_granularity_logs",
    daily:       true,
  },
  {
    href:        "/registro/comida",
    icon:        Utensils,
    title:       "Pre/post comida",
    description: "Cómo tu estado emocional y corporal cambia alrededor de las comidas.",
    badges:      ["Alimentación", "Estado polivagal"],
    time:        "2 min",
    table:       "emotional_meal_logs",
    daily:       true,
  },
  {
    href:        "/registro/pensamiento",
    icon:        MessageSquare,
    title:       "Diario de pensamientos",
    description: "Explora un pensamiento con cuestionamiento socrático, ACT y autocompasión.",
    badges:      ["TCC", "ACT", "Autocompasión"],
    time:        "5–8 min",
    table:       "socratic_dialogues",
    daily:       true,
  },
  {
    href:        "/setup/valores",
    icon:        Heart,
    title:       "Mis valores",
    description: "Clarifica los valores que guían tu relación con la alimentación y el cuerpo.",
    badges:      ["Entrevista motivacional"],
    time:        "6 turnos",
    table:       "values_clarifications",
    daily:       false,
  },
  {
    href:        "/herramientas/plan-si-entonces",
    icon:        Target,
    title:       "Planes si-entonces",
    description: "Crea intenciones de implementación concretas y registra su uso.",
    badges:      ["Gollwitzer", "ACT"],
    time:        "3 min",
    table:       "implementation_intentions",
    daily:       false,
  },
]

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86_400_000)
  if (d === 0) return "hoy"
  if (d === 1) return "ayer"
  if (d < 7)  return `hace ${d} días`
  if (d < 30) return `hace ${Math.floor(d / 7)} sem`
  return `hace ${Math.floor(d / 30)} meses`
}

export default async function PracticasPage() {
  const supabase  = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const todayISO = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

  type ToolState = { doneToday: boolean; lastUsed: string | null }
  const state: Record<string, ToolState> = {}

  if (user) {
    await Promise.all(TOOLS.map(async ({ table, daily }) => {
      const [countRes, lastRes] = await Promise.all([
        supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", daily ? todayISO : "2000-01-01"),
        supabase
          .from(table)
          .select("created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      state[table] = {
        doneToday: (countRes.count ?? 0) > 0,
        lastUsed:  lastRes.data?.created_at ?? null,
      }
    }))
  }

  const dailyTools = TOOLS.filter(t => t.daily)
  const setupTools = TOOLS.filter(t => !t.daily)
  const doneCount  = dailyTools.filter(t => state[t.table]?.doneToday).length

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-lg mx-auto px-5 py-10 pb-28">

        {/* ── Header ── */}
        <header className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
            Herramientas
          </p>
          <h1 className="font-serif text-3xl font-black mb-3" style={{ color: DARK }}>Mis prácticas</h1>

          {user && (
            <div className="flex items-center gap-3">
              {/* Progress dots */}
              <div className="flex gap-1.5 items-center">
                {dailyTools.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width:      state[t.table]?.doneToday ? 10 : 7,
                      height:     state[t.table]?.doneToday ? 10 : 7,
                      background: state[t.table]?.doneToday ? "#FF6B35" : "rgba(107,39,55,0.18)",
                    }}
                  />
                ))}
              </div>
              <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
                {doneCount === 0
                  ? "Empieza tu camino de hoy"
                  : doneCount === dailyTools.length
                  ? "Todas las prácticas completadas"
                  : `${doneCount} de ${dailyTools.length} completadas hoy`}
              </p>
            </div>
          )}
        </header>

        {/* ── Prácticas diarias — timeline ── */}
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: "rgba(107,39,55,0.3)" }}>
            Prácticas diarias
          </p>

          <div className="relative">
            {/* Vertical connecting line */}
            <div
              className="absolute top-5 bottom-5 w-px"
              style={{ left: 19, background: "rgba(107,39,55,0.1)" }}
            />

            <div className="flex flex-col gap-3">
              {dailyTools.map((tool, i) => {
                const { doneToday, lastUsed } = state[tool.table] ?? { doneToday: false, lastUsed: null }
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex gap-4 items-start no-underline group"
                  >
                    {/* Node */}
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{
                        background:  doneToday ? BURGUNDY : "white",
                        border:      doneToday ? "none" : "2px solid rgba(107,39,55,0.2)",
                        boxShadow:   doneToday ? "0 2px 10px rgba(107,39,55,0.3)" : "none",
                      }}
                    >
                      {doneToday ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold" style={{ color: "rgba(107,39,55,0.35)" }}>
                          {i + 1}
                        </span>
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 rounded-2xl p-4 transition-all duration-200 group-hover:translate-x-0.5"
                      style={{
                        background:  doneToday ? "rgba(107,39,55,0.05)" : "white",
                        border:      `1px solid ${doneToday ? "rgba(107,39,55,0.18)" : "rgba(107,39,55,0.09)"}`,
                        opacity:     doneToday ? 0.85 : 1,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h2 className="font-serif text-sm font-bold leading-snug" style={{ color: DARK }}>
                          {tool.title}
                        </h2>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wide shrink-0 mt-0.5"
                          style={{ color: doneToday ? "#FF6B35" : lastUsed ? "rgba(107,39,55,0.3)" : "rgba(107,39,55,0.2)" }}
                        >
                          {doneToday ? "✓ hecho" : lastUsed ? relativeTime(lastUsed) : "sin hacer"}
                        </span>
                      </div>
                      <p className="text-[11px] font-light leading-relaxed mb-2.5" style={{ color: "rgba(107,39,55,0.55)" }}>
                        {tool.description}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tool.badges.map(b => (
                          <span
                            key={b}
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(107,39,55,0.07)", color: BURGUNDY }}
                          >
                            {b}
                          </span>
                        ))}
                        <span className="ml-auto text-[9px] font-light" style={{ color: "rgba(107,39,55,0.3)" }}>
                          {tool.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Herramientas de base ── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(107,39,55,0.3)" }}>
            Herramientas de base
          </p>
          <div className="flex flex-col gap-3">
            {setupTools.map(tool => {
              const { doneToday: configured, lastUsed } = state[tool.table] ?? { doneToday: false, lastUsed: null }
              const Icon = tool.icon
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex gap-4 items-start no-underline group"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                    style={{
                      background: configured ? "rgba(107,39,55,0.08)" : "white",
                      border:     `2px solid ${configured ? BURGUNDY : "rgba(107,39,55,0.2)"}`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: configured ? BURGUNDY : "rgba(107,39,55,0.3)" }} />
                  </div>
                  <div
                    className="flex-1 rounded-2xl p-4 transition-all duration-200 group-hover:translate-x-0.5"
                    style={{
                      background: "white",
                      border:     "1px solid rgba(107,39,55,0.09)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h2 className="font-serif text-sm font-bold" style={{ color: DARK }}>{tool.title}</h2>
                      {lastUsed && (
                        <span className="text-[9px] font-light shrink-0 mt-0.5" style={{ color: "rgba(107,39,55,0.3)" }}>
                          {relativeTime(lastUsed)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-light leading-relaxed mb-2.5" style={{ color: "rgba(107,39,55,0.55)" }}>
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tool.badges.map(b => (
                        <span
                          key={b}
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(107,39,55,0.07)", color: BURGUNDY }}
                        >
                          {b}
                        </span>
                      ))}
                      <span className="ml-auto text-[9px] font-light" style={{ color: "rgba(107,39,55,0.3)" }}>
                        {tool.time}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <p className="text-[10px] text-center mt-10 font-light italic" style={{ color: "rgba(107,39,55,0.3)" }}>
          Herramientas de auto-reflexión guiada. No sustituyen atención psicológica profesional. Crisis: 024.
        </p>
      </div>
    </div>
  )
}
