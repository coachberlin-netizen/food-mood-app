"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DOMPurify from "isomorphic-dompurify"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ArrowLeft, BookOpen, Video, FileText, Dumbbell } from "lucide-react"

type ViewerPrescription = {
  id: string
  prescribed_at: string
  read_at: string | null
  professional_note: string | null
  content_library: {
    id: string
    title: string
    content_type: string
    duration_minutes: number | null
    body_html: string | null
    external_url: string | null
  }
  professionals: { full_name: string } | null
}

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

export default function VisorClient({ prescriptionId }: { prescriptionId: string }) {
  const router = useRouter()
  const [prescription, setPrescription] = useState<ViewerPrescription | null>(null)
  const [bodyHtml,     setBodyHtml]     = useState<string>("")
  const [loading,      setLoading]      = useState(true)
  const [notFound,     setNotFound]     = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/auth/login"); return }

      const { data, error } = await supabase
        .from("content_prescriptions")
        .select(`
          id,
          prescribed_at,
          read_at,
          professional_note,
          content_library (
            id,
            title,
            content_type,
            duration_minutes,
            body_html,
            external_url
          ),
          professionals (
            full_name
          )
        `)
        .eq("id", prescriptionId)
        .eq("patient_user_id", user.id)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const row = data as unknown as ViewerPrescription
      setPrescription(row)

      if (row.content_library.body_html) {
        setBodyHtml(
          DOMPurify.sanitize(row.content_library.body_html, {
            USE_PROFILES: { html: true },
          })
        )
      }

      if (!row.read_at) {
        await supabase
          .from("content_prescriptions")
          .update({ read_at: new Date().toISOString() })
          .eq("id", prescriptionId)
          .eq("patient_user_id", user.id)
      }

      setLoading(false)
    }

    load()
  }, [prescriptionId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F0E8" }}>
        <div className="w-6 h-6 border-2 border-[#6B2737] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !prescription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#F5F0E8" }}>
        <p className="text-sm" style={{ color: "#6B2737" }}>Contenido no encontrado.</p>
        <Link href="/para-mi" className="text-xs underline" style={{ color: "rgba(107,39,55,0.6)" }}>
          Volver a Para ti
        </Link>
      </div>
    )
  }

  const lib  = prescription.content_library
  const Icon = contentTypeIcon(lib.content_type)

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-5 py-10 pb-28">

        <Link
          href="/para-mi"
          className="inline-flex items-center gap-2 text-xs font-medium mb-8"
          style={{ color: "rgba(107,39,55,0.6)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Para ti
        </Link>

        <header className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-4 h-4" style={{ color: "#C9A84C" }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C9A84C" }}>
              {contentTypeLabel(lib.content_type)}
              {lib.duration_minutes ? ` · ${lib.duration_minutes} min` : ""}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-black leading-snug mb-2" style={{ color: "#2d0f16" }}>
            {lib.title}
          </h1>
          {prescription.professionals?.full_name && (
            <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
              Prescrito por {prescription.professionals.full_name} — {formatDate(prescription.prescribed_at)}
            </p>
          )}
        </header>

        {prescription.professional_note && (
          <div
            className="mb-8 px-4 py-3 rounded-xl text-sm font-light italic leading-relaxed"
            style={{
              background:  "white",
              color:       "#6B2737",
              borderLeft:  "3px solid #C9A84C",
            }}
          >
            {prescription.professional_note}
          </div>
        )}

        {bodyHtml ? (
          <div
            className="overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : lib.external_url ? (
          <a
            href={lib.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-opacity hover:opacity-80"
            style={{ background: "#6B2737", color: "#F5F0E8" }}
          >
            Ver contenido
          </a>
        ) : (
          <p className="text-sm font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
            El contenido de este recurso no está disponible todavía.
          </p>
        )}
      </div>
    </div>
  )
}
