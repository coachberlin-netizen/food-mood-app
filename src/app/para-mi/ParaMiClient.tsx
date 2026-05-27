"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePrescriptions, useLinkedProfessional } from "@/hooks/usePrescriptions"
import { BookOpen, Video, FileText, Dumbbell, ChevronRight, CheckCircle, Circle } from "lucide-react"

type Filter = "all" | "unread" | "read"

function contentTypeLabel(type: string): string {
  switch (type) {
    case "video":      return "Vídeo"
    case "newsletter": return "Newsletter"
    case "exercise":   return "Ejercicio"
    default:           return "Artículo"
  }
}

function contentTypeIcon(type: string) {
  switch (type) {
    case "video":      return Video
    case "newsletter": return FileText
    case "exercise":   return Dumbbell
    default:           return BookOpen
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",    label: "Todos" },
  { key: "unread", label: "Sin leer" },
  { key: "read",   label: "Leídos" },
]

export default function ParaMiClient() {
  const router = useRouter()
  const { hasLink, professionalName, loading: linkLoading } = useLinkedProfessional()
  const { prescriptions, loading } = usePrescriptions()
  const [filter, setFilter] = useState<Filter>("all")

  useEffect(() => {
    if (!linkLoading && !hasLink) {
      router.replace("/dashboard")
    }
  }, [hasLink, linkLoading, router])

  if (linkLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0E8" }}>
        <div className="w-6 h-6 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasLink) return null

  const filtered = prescriptions.filter(p => {
    if (filter === "unread") return !p.read_at
    if (filter === "read")   return !!p.read_at
    return true
  })

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-5 py-10 pb-28">

        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A84C" }}>
            Contenido prescrito
          </p>
          <h1 className="font-serif text-3xl font-black" style={{ color: "#2d0f16" }}>
            Para ti
          </h1>
          {professionalName && (
            <p className="text-base font-light mt-1" style={{ color: "#6B2737" }}>
              de {professionalName}
            </p>
          )}
        </header>

        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: filter === key ? "#6B2737" : "transparent",
                color:      filter === key ? "#F5F0E8" : "#6B2737",
                border:     "1px solid #6B2737",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm font-light py-16" style={{ color: "rgba(107,39,55,0.5)" }}>
            {prescriptions.length === 0
              ? "Aún no tienes contenido prescrito por tu profesional. Cuando lo haga, aparecerá aquí."
              : "No hay contenido en este filtro."}
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {filtered.map(p => {
              const Icon = contentTypeIcon(p.content_library.content_type)
              const isRead = !!p.read_at
              return (
                <li key={p.id}>
                  <Link
                    href={`/para-mi/${p.id}`}
                    className="block rounded-2xl p-5 bg-white transition-all hover:scale-[1.01]"
                    style={{
                      border: isRead
                        ? "1px solid rgba(107,39,55,0.1)"
                        : "2px solid #6B2737",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-0.5">
                        {isRead
                          ? <CheckCircle className="w-5 h-5" style={{ color: "rgba(107,39,55,0.3)" }} />
                          : <Circle className="w-5 h-5 fill-[#6B2737]" style={{ color: "#6B2737" }} />
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#C9A84C" }} />
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>
                            {contentTypeLabel(p.content_library.content_type)}
                          </span>
                          {p.content_library.duration_minutes && (
                            <span className="text-[10px]" style={{ color: "rgba(107,39,55,0.45)" }}>
                              · {p.content_library.duration_minutes} min
                            </span>
                          )}
                        </div>

                        <h2 className="font-serif text-base font-bold mb-1 leading-snug" style={{ color: "#2d0f16" }}>
                          {p.content_library.title}
                        </h2>

                        <p className="text-[11px] font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
                          Prescrito el {formatDate(p.prescribed_at)}
                        </p>

                        {p.professional_note && (
                          <div
                            className="mt-3 px-3 py-2 rounded-lg text-xs font-light italic leading-relaxed"
                            style={{
                              background:  "#F5F0E8",
                              color:       "#6B2737",
                              borderLeft:  "3px solid #C9A84C",
                            }}
                          >
                            {p.professional_note}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(107,39,55,0.3)" }} />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
