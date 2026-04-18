"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const processedRef = useRef(false);

  useEffect(() => {
    async function verifyAndExchange() {
      if (processedRef.current) return;
      processedRef.current = true;

      // Check current session first
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      
      // If we already have a recovery session, we might be good
      if (existingSession) {
        setIsVerifying(false);
        return;
      }

      // Try to get code from URL or hash (Supabase can use both)
      const code = searchParams.get('code');
      
      // Also check hash fragment just in case (Implicit flow fallback)
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const hashParams = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = hashParams.get('access_token');

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Critical Exchange Error:", exchangeError);
          setError(`El enlace es inválido o ha caducado. (Error: ${exchangeError.message})`);
        }
      } else if (accessToken) {
        // If it was an implicit flow, Supabase Browser Client might have already picked it up
        // but we verify session one last time
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("No se pudo establecer la sesión de recuperación. Intenta solicitar un nuevo enlace.");
        }
      } else {
        setError("No se encontró un código de acceso válido en el enlace.");
      }
      
      setIsVerifying(false);
    }

    verifyAndExchange();
  }, [searchParams, supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        
        // Delay redirect to show success state
        setTimeout(() => {
          router.push("/auth/login?message=Contraseña actualizada. Inicia sesión con tu nueva contraseña.");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado al actualizar la contraseña.");
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 text-white text-center">
        <Loader2 className="w-10 h-10 animate-spin mb-4 mx-auto" />
        <p className="font-serif italic opacity-60">Verificando enlace de seguridad...</p>
      </div>
    );
  }

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

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          {!success ? (
            <>
              <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Nueva contraseña</h1>
              <p className="text-aubergine-dark/60 text-center text-sm mb-8">Ingresa tu nueva contraseña para acceder</p>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-6 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-aubergine-dark text-white hover:bg-aubergine-dark/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Guardar contraseña <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Contraseña guardada</h1>
              <p className="text-aubergine-dark/70 text-sm leading-relaxed mb-4">
                Tu contraseña ha sido actualizada correctamente. Cargando inicio de sesión...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
