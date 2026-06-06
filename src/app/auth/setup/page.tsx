"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function SetupForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const supabase = createClient();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!sessionId) {
      setError("No se detectó una sesión de pago válida. Contacta a soporte si esto es un error.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // 1. Send password and sessionId to our secure backend
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error en el servidor.");
        setLoading(false);
        return;
      }

      const email = data.email;

      // 2. The user is created/updated in the backend. 
      // Now we sign them in on the client so the browser gets the session cookie!
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        // Fallback en caso de que alguien cierre antes de terminar
        setError("Cuenta creada, pero ocurrió un error iniciando sesión de forma automática. Ve a Iniciar Sesión.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // UX Delay before heading to dashboard to trigger the Welcome Modal explicitly
      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setError("Error de red. Por favor, intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cream/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full relative overflow-hidden">
          {/* Subtle premium accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF6B35]/40 via-[#FF6B35] to-[#FF6B35]/40" />

          {!sessionId ? (
             <div className="text-center py-6">
                <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Acceso Inválido</h1>
                <p className="text-aubergine-dark/60 text-sm leading-relaxed mb-8">
                  Falta la confirmación segura del pago. Si acabas de adquirir tu suscripción, revisa tu correo electrónico o contacta con soporte.
                </p>
                <Link href="/pricing" className="inline-flex items-center justify-center px-6 py-3 bg-aubergine-dark text-white rounded-xl text-sm font-bold shadow-md hover:bg-aubergine-dark/90 transition-all">
                  Ver Planes
                </Link>
             </div>
          ) : success ? (
            <div className="text-center py-8 flex flex-col items-center">
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                 <CheckCircle2 className="w-8 h-8" />
               </div>
               <h2 className="text-2xl font-serif font-bold text-aubergine-dark mb-2">¡Todo listo!</h2>
               <p className="text-aubergine-dark/60 text-sm mb-6">
                 Creando tu sesión segura y redirigiendo a tu espacio personal...
               </p>
               <Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] text-[10px] font-bold uppercase tracking-widest border border-[#FF6B35]/20">
                  <Sparkles className="w-3 h-3" /> Pago Confirmado
                </span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Configura tu perfil</h1>
              <p className="text-aubergine-dark/60 text-center text-sm mb-8 leading-relaxed">
                Elige una contraseña para acceder a tu plataforma Premium siempre que quieras.
              </p>

              {error && (
                <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSetup} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 transition-all font-medium text-aubergine-dark"
                    placeholder="Min. 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Repetir Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 transition-all font-medium text-aubergine-dark"
                    placeholder="Repite tu contraseña"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B35] text-white hover:bg-[#b8953e] py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Entrar al Club <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" /></div>}>
      <SetupForm />
    </Suspense>
  );
}
