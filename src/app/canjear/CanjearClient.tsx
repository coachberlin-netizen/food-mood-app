"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function CanjearForm() {
  const [code,    setCode]    = useState("")
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        const returnTo = encodeURIComponent("/canjear" + (searchParams.toString() ? "?" + searchParams.toString() : ""))
        router.replace(`/auth/login?returnTo=${returnTo}`)
      } else {
        setChecking(false)
      }
    })
  }, [supabase, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmed = code.trim().toUpperCase()
    if (trimmed.length < 4) {
      setError("El código no es válido o ha expirado.")
      return
    }

    setLoading(true)

    const { error: rpcError } = await supabase.rpc("redeem_invitation", { p_code: trimmed })

    if (rpcError) {
      // Map known error messages from the DB function
      const msg = rpcError.message
      if (msg.includes("Acceso no autorizado")) {
        setError("Autenticación requerida.")
      } else if (msg.includes("ya ha sido utilizado")) {
        setError("El código ya ha sido utilizado.")
      } else if (msg.includes("ya existe")) {
        setError("Esta vinculación ya existe.")
      } else {
        setError("El código no es válido o ha expirado.")
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (checking) {
    return <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#6B2737]" />
    </div>
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-serif font-bold text-[#6B2737]">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[#6B2737]/10">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-xl font-serif font-bold text-[#6B2737]">Vinculación completada</h1>
              <p className="text-sm text-[#6B2737]/60">
                Tu consulta ha quedado vinculada correctamente. Desde ahora tu profesional puede acompañar tu proceso en Food·Mood.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#6B2737] text-white rounded-xl text-sm font-medium hover:bg-[#6B2737]/90 transition-all"
              >
                Ir a mi dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-serif font-bold text-[#6B2737] mb-2 text-center">
                Código de consulta
              </h1>
              <p className="text-sm text-[#6B2737]/60 text-center mb-8">
                Introduce el código que te ha facilitado tu profesional de salud.
              </p>

              {error && (
                <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                    Código de invitación
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    maxLength={6}
                    className="w-full font-mono text-2xl tracking-[0.3em] text-center uppercase bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-5 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all text-[#6B2737]"
                    placeholder="A3K9PQ"
                    autoFocus
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.trim().length === 0}
                  className="w-full bg-[#6B2737] text-white hover:bg-[#6B2737]/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Canjear código <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CanjearClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <CanjearForm />
    </Suspense>
  )
}
