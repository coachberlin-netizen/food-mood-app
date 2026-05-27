"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function ProLoginForm() {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data: pro } = await supabase.from("professionals").select("id").maybeSingle()
      if (pro) {
        router.replace(searchParams.get("redirect") || "/pro/dashboard")
      }
    })
  }, [supabase, router, searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      const msg = signInError.message
      if (msg.includes("Email not confirmed")) {
        setError("Revisa tu email para confirmar tu cuenta.")
      } else if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
        setError("Email o contraseña incorrectos.")
      } else if (msg.includes("Too many requests") || msg.includes("rate limit")) {
        setError("Demasiados intentos. Espera unos minutos.")
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.")
      }
      setLoading(false)
      return
    }

    // Verify this user has a professional profile
    const { data: pro } = await supabase.from("professionals").select("id").maybeSingle()
    if (!pro) {
      await supabase.auth.signOut()
      setError("Cuenta no registrada como profesional. Accede desde el área de usuarias si tienes cuenta de consumidora.")
      setLoading(false)
      return
    }

    const redirectTo = searchParams.get("redirect") || "/pro/dashboard"
    router.replace(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#6B2737] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-white font-serif font-bold text-3xl">Food·Mood</span>
            <span className="block text-xs font-sans text-white/50 uppercase tracking-widest mt-1">
              Portal Profesional
            </span>
          </Link>
        </div>

        <div className="bg-[#F5F0E8] rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <h1 className="text-2xl font-serif font-bold text-[#6B2737] mb-2 text-center">Acceso profesional</h1>
          <p className="text-[#6B2737]/60 text-center text-sm mb-8">
            Área exclusiva para profesionales de salud.
          </p>

          {error && (
            <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="tu@consulta.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50">
                  Contraseña
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#6B2737]/40 hover:text-[#6B2737] transition-colors font-semibold"
                >
                  ¿Olvidaste la contraseña?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B2737] text-white hover:bg-[#6B2737]/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Entrar al portal <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[#6B2737]/10 pt-8 text-center text-sm text-[#6B2737]/60">
            <p>
              ¿Sin cuenta profesional?{" "}
              <Link href="/pro/signup" className="font-bold text-[#6B2737] hover:underline">
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProLoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#6B2737]" />}>
      <ProLoginForm />
    </Suspense>
  )
}
