"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Watch, Download, Trash2, LogOut, ChevronRight } from "lucide-react"
import { saveWhatsAppOptInAction, getWhatsAppOptInAction } from "./actions"

export default function ConfiguracionPage() {
  const router = useRouter()

  const [email,   setEmail]   = useState<string | null>(null)

  const [waPhone,   setWaPhone]   = useState("")
  const [waOptIn,   setWaOptIn]   = useState(false)
  const [waSaving,  setWaSaving]  = useState(false)
  const [waSuccess, setWaSuccess] = useState(false)
  const [waError,   setWaError]   = useState<string | null>(null)

  const [betaCode,   setBetaCode]   = useState("")
  const [betaStatus, setBetaStatus] = useState<"idle" | "loading" | "ok" | "error">("idle")
  const [betaMsg,    setBetaMsg]    = useState("")

  const [exportLoading,    setExportLoading]    = useState(false)
  const [showDeleteModal,  setShowDeleteModal]  = useState(false)
  const [deleteConfirmTxt, setDeleteConfirmTxt] = useState("")
  const [deleteLoading,    setDeleteLoading]    = useState(false)
  const [deleteError,      setDeleteError]      = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? null)
    })
    getWhatsAppOptInAction().then(data => {
      if (data) {
        setWaPhone(data.whatsapp_phone ?? "")
        setWaOptIn(data.whatsapp_opt_in ?? false)
      }
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const res = await fetch("/api/user/export-data")
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ?? "foodmood-datos.json"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("No se pudo exportar. Inténtalo de nuevo.")
    } finally {
      setExportLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const res  = await fetch("/api/user/delete-all-data", { method: "POST" })
      const json = await res.json() as { error?: string }
      if (!res.ok) throw new Error(json.error ?? "Error desconocido")
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/?cuenta=eliminada")
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Esta acción no se pudo completar.")
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#F5F0E8" }}>
      <div className="max-w-xl mx-auto px-5 py-10">

        <header className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
            Tu cuenta
          </p>
          <h1 className="font-serif text-3xl font-black" style={{ color: "#2d0f16" }}>
            Configuración
          </h1>
          {email && (
            <p className="text-sm font-light mt-1" style={{ color: "rgba(107,39,55,0.55)" }}>
              {email}
            </p>
          )}
        </header>

        {/* Wearables */}
        <section className="mb-4">
          <Link
            href="/configuracion/wearables"
            className="flex items-center justify-between rounded-2xl p-5 bg-white transition-all hover:scale-[1.01]"
            style={{ border: "1px solid rgba(107,39,55,0.1)" }}
          >
            <div className="flex items-center gap-3">
              <Watch className="w-5 h-5 shrink-0" style={{ color: "#6B2737" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>Wearables</p>
                <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>Conecta Oura Ring u otros dispositivos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "rgba(107,39,55,0.3)" }} />
          </Link>
        </section>

        {/* WhatsApp */}
        <section className="mb-4 rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>WhatsApp</h2>
          <p className="text-xs font-light mb-4 leading-relaxed" style={{ color: "rgba(107,39,55,0.55)" }}>
            Recibe recomendaciones y novedades en WhatsApp. Solo para suscriptoras. Tu número nunca se comparte con terceros.
          </p>
          <input
            type="tel"
            value={waPhone}
            onChange={e => setWaPhone(e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full rounded-xl border px-4 py-3 text-sm mb-3 bg-[#F5F0E8] focus:outline-none"
            style={{ borderColor: "rgba(107,39,55,0.15)", color: "#2d0f16" }}
          />
          <label className="flex items-start gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={waOptIn}
              onChange={e => setWaOptIn(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 rounded accent-[#6B2737]"
            />
            <span className="text-xs font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.7)" }}>
              Acepto recibir mensajes de WhatsApp de Food·Mood. Puedo retirar mi consentimiento en cualquier momento desde aquí.
            </span>
          </label>
          {waError   && <p className="text-xs text-red-600 mb-2">{waError}</p>}
          {waSuccess && <p className="text-xs mb-2" style={{ color: "#6B2737" }}>Preferencias guardadas.</p>}
          <button
            disabled={waSaving}
            onClick={async () => {
              if (waOptIn && !waPhone.trim()) { setWaError("Introduce tu número de teléfono."); return }
              setWaSaving(true); setWaError(null); setWaSuccess(false)
              try {
                await saveWhatsAppOptInAction(waPhone, waOptIn)
                setWaSuccess(true)
                setTimeout(() => setWaSuccess(false), 3000)
              } catch (err: unknown) {
                setWaError(err instanceof Error ? err.message : "Error al guardar.")
              } finally {
                setWaSaving(false)
              }
            }}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ background: "#6B2737", color: "#F5F0E8" }}
          >
            {waSaving ? "Guardando…" : "Guardar preferencias"}
          </button>
        </section>

        {/* Código de acceso */}
        <section className="mb-4 rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: "#2d0f16" }}>Código de acceso</h2>
          <p className="text-xs font-light mb-4 leading-relaxed" style={{ color: "rgba(107,39,55,0.55)" }}>
            ¿Tienes un código beta o de colaboradora? Introdúcelo para activar el acceso premium.
          </p>
          {betaStatus === "ok" ? (
            <p className="text-xs font-semibold" style={{ color: "#6B2737" }}>{betaMsg}</p>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={betaCode}
                  onChange={e => setBetaCode(e.target.value)}
                  placeholder="Tu código"
                  className="flex-1 rounded-xl border px-4 py-3 text-sm bg-[#F5F0E8] focus:outline-none uppercase tracking-widest"
                  style={{ borderColor: "rgba(107,39,55,0.15)", color: "#2d0f16" }}
                />
                <button
                  disabled={betaStatus === "loading" || !betaCode.trim()}
                  onClick={async () => {
                    setBetaStatus("loading"); setBetaMsg("")
                    try {
                      const res  = await fetch("/api/beta/redeem", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: betaCode }),
                      })
                      const json = await res.json() as { error?: string }
                      if (res.ok) { setBetaStatus("ok"); setBetaMsg("¡Acceso premium activado! Recarga la página.") }
                      else        { setBetaStatus("error"); setBetaMsg(json.error ?? "Código no válido.") }
                    } catch {
                      setBetaStatus("error"); setBetaMsg("Error de conexión.")
                    }
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40 shrink-0"
                  style={{ background: "#6B2737", color: "#F5F0E8" }}
                >
                  {betaStatus === "loading" ? "…" : "Canjear"}
                </button>
              </div>
              {betaStatus === "error" && <p className="text-xs text-red-600">{betaMsg}</p>}
            </>
          )}
        </section>

        {/* Cuenta y RGPD */}
        <section className="mb-4 rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm transition-colors hover:bg-[#F5F0E8] disabled:opacity-50"
            style={{ color: "#2d0f16", borderBottom: "1px solid rgba(107,39,55,0.06)" }}
          >
            <Download className="w-4 h-4 shrink-0" style={{ color: "#FF6B35" }} />
            {exportLoading ? "Preparando exportación…" : "Exportar mis datos"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm transition-colors hover:bg-[#F5F0E8]"
            style={{ color: "#2d0f16", borderBottom: "1px solid rgba(107,39,55,0.06)" }}
          >
            <LogOut className="w-4 h-4 shrink-0" style={{ color: "#6B2737" }} />
            Cerrar sesión
          </button>
          <button
            onClick={() => { setShowDeleteModal(true); setDeleteConfirmTxt(""); setDeleteError(null) }}
            className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm transition-colors hover:bg-red-50"
            style={{ color: "#b91c1c" }}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            Eliminar cuenta
          </button>
        </section>

        <p className="text-center text-[10px] font-light mt-8" style={{ color: "rgba(107,39,55,0.35)" }}>
          Food·Mood · Tus datos, siempre tuyos
        </p>

      </div>

      {/* Modal eliminar cuenta */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5" style={{ background: "#F5F0E8", border: "1px solid rgba(185,28,28,0.2)" }}>
            <h2 className="font-serif text-2xl font-black" style={{ color: "#2d0f16" }}>Eliminar cuenta</h2>
            <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(107,39,55,0.7)" }}>
              Esta acción es <strong>irreversible</strong>. Se borrarán todos tus datos, historial y suscripción activa conforme al RGPD.
            </p>
            <p className="text-sm font-light" style={{ color: "rgba(107,39,55,0.7)" }}>
              Escribe <span className="font-mono font-bold text-red-600">ELIMINAR</span> para confirmar.
            </p>
            <input
              type="text"
              value={deleteConfirmTxt}
              onChange={e => setDeleteConfirmTxt(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full rounded-xl border border-red-300 px-4 py-3 text-sm font-mono tracking-widest uppercase bg-white focus:outline-none"
            />
            {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-full text-sm font-semibold transition-colors"
                style={{ border: "1px solid rgba(107,39,55,0.2)", color: "rgba(107,39,55,0.7)" }}
              >
                Cancelar
              </button>
              <button
                disabled={deleteConfirmTxt !== "ELIMINAR" || deleteLoading}
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-full text-sm font-semibold bg-red-500 text-white transition-colors hover:bg-red-600 disabled:opacity-40"
              >
                {deleteLoading ? "Eliminando…" : "Eliminar todo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
