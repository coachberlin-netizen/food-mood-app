"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const PROFESSIONAL_TITLES = [
  "Psicología clínica",
  "Psicología",
  "Nutrición",
  "Dietética y Nutrición",
  "Medicina",
  "Enfermería",
  "Psicoterapia",
  "Trabajo social",
  "Coaching de salud",
  "Otra especialidad",
]

export default function SignupClient() {
  const [form, setForm] = useState({
    email:              "",
    password:           "",
    full_name:          "",
    professional_title: "",
    license_number:     "",
    bio:                "",
  })
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const router  = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (!form.professional_title) {
      setError("Selecciona una especialidad.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/pro/signup", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        email:              form.email,
        password:           form.password,
        full_name:          form.full_name,
        professional_title: form.professional_title,
        license_number:     form.license_number || undefined,
        bio:                form.bio || undefined,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Error al crear la cuenta.")
      setLoading(false)
      return
    }

    // Auto-login after account creation
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    })

    if (signInError) {
      setError("Cuenta creada. Inicia sesión en el portal profesional.")
      setLoading(false)
      router.push("/pro/login")
      return
    }

    router.push("/pro/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#6B2737] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-lg z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-white font-serif font-bold text-3xl">Food·Mood</span>
            <span className="block text-xs font-sans text-white/50 uppercase tracking-widest mt-1">
              Portal Profesional
            </span>
          </Link>
        </div>

        <div className="bg-[#F5F0E8] rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <h1 className="text-2xl font-serif font-bold text-[#6B2737] mb-2 text-center">
            Registro profesional
          </h1>
          <p className="text-[#6B2737]/60 text-center text-sm mb-8">
            Crea tu cuenta para vincular pacientes y hacer seguimiento.
          </p>

          {error && (
            <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={set("full_name")}
                required
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="Nombre y apellidos"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Especialidad
              </label>
              <select
                value={form.professional_title}
                onChange={set("professional_title")}
                required
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
              >
                <option value="">Selecciona tu especialidad</option>
                {PROFESSIONAL_TITLES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Número de colegiación <span className="font-normal normal-case">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.license_number}
                onChange={set("license_number")}
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="Ej: 28-12345"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Email profesional
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                required
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="tu@consulta.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#6B2737]/50 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                required
                minLength={8}
                className="w-full bg-[#6B2737]/5 border border-[#6B2737]/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all font-medium text-[#6B2737]"
                placeholder="Mínimo 8 caracteres"
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
                <>Crear cuenta profesional <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[#6B2737]/10 pt-8 text-center text-sm text-[#6B2737]/60">
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link href="/pro/login" className="font-bold text-[#6B2737] hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
