"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, CalendarDays, CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Vista pública — para visitantes sin cuenta que aterrizan en /canjear
function CanjearPublic() {
  const searchParams = useSearchParams()
  const returnTo = encodeURIComponent("/canjear" + (searchParams.toString() ? "?" + searchParams.toString() : ""))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-serif font-bold" style={{ color: "#6B2737" }}>Food<span style={{ color: "#FF6B35" }}>·</span>Mood</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
          {/* Icono */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "rgba(107,39,55,0.07)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B2737" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 className="text-2xl font-serif font-bold text-center mb-3" style={{ color: "#2d0f16" }}>
            Acceso solo por invitación
          </h1>
          <p className="text-sm font-light text-center leading-relaxed mb-2" style={{ color: "rgba(107,39,55,0.62)" }}>
            La companion app de Food·Mood está disponible únicamente para pacientes que han recibido un código de su profesional de salud.
          </p>
          <p className="text-sm font-light text-center leading-relaxed mb-8" style={{ color: "rgba(107,39,55,0.45)" }}>
            Si ya tienes un código, entra con tu cuenta para canjearlo.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href={`/auth/login?returnTo=${returnTo}`}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110"
              style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
            >
              Entrar y canjear código <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/auth/register?returnTo=${returnTo}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-light transition-all"
              style={{ backgroundColor: "rgba(107,39,55,0.06)", color: "rgba(107,39,55,0.7)", border: "1px solid rgba(107,39,55,0.12)" }}
            >
              Crear cuenta nueva
            </Link>
          </div>

          <p className="text-xs text-center font-light mt-6" style={{ color: "rgba(107,39,55,0.35)" }}>
            ¿No tienes código?{" "}
            <span style={{ color: "rgba(107,39,55,0.5)" }}>
              Pídelo a tu profesional de salud.
            </span>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-light transition-opacity hover:opacity-60" style={{ color: "rgba(107,39,55,0.4)" }}>
            ¿Eres profesional de salud? Conoce Food·Mood Pro →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── 3-screen onboarding after successful link ─────────────────────────

const SLIDE = {
  enter:  { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0   },
  exit:   { opacity: 0, x: -32 },
}

function OnboardingFlow() {
  const [step, setStep] = useState(0)

  return (
    <div>
      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === step ? 20 : 6,
              height:     6,
              background: i === step ? "#6B2737" : "rgba(107,39,55,0.15)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            variants={SLIDE} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.25)" }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: "#FF6B35" }} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
              Vinculación completada
            </p>
            <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: "#2d0f16" }}>
              Tu consulta está conectada
            </h2>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(107,39,55,0.65)" }}>
              Tu profesional puede acompañar tu proceso en Food·Mood. Verá tus patrones de bienestar — no mensajes individuales — para entender cómo apoyarte mejor.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110"
              style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
            >
              ¿Cómo funciona? <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-1"
            variants={SLIDE} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(107,39,55,0.07)", border: "1px solid rgba(107,39,55,0.12)" }}
            >
              <CalendarDays className="w-7 h-7" style={{ color: "#6B2737" }} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
              Tu check-in diario
            </p>
            <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: "#2d0f16" }}>
              Tu voz, tu ritmo
            </h2>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(107,39,55,0.65)" }}>
              Cada día, en menos de 90 segundos, registras cómo estás emocionalmente y físicamente. Tu profesional ve los patrones — nunca tus palabras exactas — para acompañarte desde un lugar de comprensión real.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110"
                style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
              >
                Entendido <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(0)}
                className="text-xs font-light transition-opacity hover:opacity-60"
                style={{ color: "rgba(107,39,55,0.45)" }}
              >
                Volver
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            variants={SLIDE} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="text-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(107,39,55,0.07)", border: "1px solid rgba(107,39,55,0.12)" }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "#6B2737" }} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#FF6B35" }}>
              Tu primer registro
            </p>
            <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: "#2d0f16" }}>
              ¿Empezamos hoy?
            </h2>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(107,39,55,0.65)" }}>
              El primer paso es el más importante. Tómate 90 segundos ahora para hacer tu primer check-in. Tu profesional verá que has comenzado.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/eloraculo"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:brightness-110"
                style={{ backgroundColor: "#6B2737", color: "#F5F0E8" }}
              >
                Hacer mi primer registro <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="text-xs font-light transition-opacity hover:opacity-60"
                style={{ color: "rgba(107,39,55,0.45)" }}
              >
                Explorar el dashboard primero
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Vista autenticada — formulario de canje
function CanjearForm() {
  const [code,    setCode]    = useState("")
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authState, setAuthState] = useState<"checking" | "public" | "authenticated">("checking")
  const searchParams = useSearchParams()
  const supabase     = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? "authenticated" : "public")
    })
  }, [supabase])

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

  if (authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F0E8" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#6B2737" }} />
      </div>
    )
  }

  if (authState === "public") return <CanjearPublic />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-serif font-bold" style={{ color: "#6B2737" }}>Food<span style={{ color: "#FF6B35" }}>·</span>Mood</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm" style={{ border: "1px solid rgba(107,39,55,0.1)" }}>
          {success ? (
            <OnboardingFlow />
          ) : (
            <>
              <h1 className="text-2xl font-serif font-bold text-center mb-2" style={{ color: "#2d0f16" }}>
                Código de consulta
              </h1>
              <p className="text-sm font-light text-center mb-8" style={{ color: "rgba(107,39,55,0.6)" }}>
                Introduce el código que te ha facilitado tu profesional de salud.
              </p>

              {error && (
                <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(107,39,55,0.5)" }}>
                    Código de invitación
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    maxLength={6}
                    className="w-full font-mono text-2xl tracking-[0.3em] text-center uppercase rounded-2xl px-5 py-5 focus:outline-none focus:ring-2 focus:ring-[#6B2737]/20 transition-all"
                    style={{ backgroundColor: "rgba(107,39,55,0.05)", border: "1px solid rgba(107,39,55,0.1)", color: "#6B2737" }}
                    placeholder="A3K9PQ"
                    autoFocus
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || code.trim().length === 0}
                  className="w-full py-4 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  style={{ backgroundColor: "#6B2737", color: "white" }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Canjear código <ArrowRight className="w-4 h-4" /></>}
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
