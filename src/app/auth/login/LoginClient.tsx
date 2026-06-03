"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const setAuthStoreLogin = useAuthStore(state => state.login);

  // Auto-redirect if session already exists
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) setError(message);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirectTo = searchParams.get('redirect') || searchParams.get('returnTo') || '/dashboard';
        router.replace(redirectTo);
      }
    });
  }, [supabase, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email && password) {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setError("Revisa tu email para confirmar tu cuenta. ¿No lo recibiste? ");
          setLoading(false);
          return;
        }
        if (signInError.message.includes("Invalid login credentials") || signInError.message.includes("invalid_credentials")) {
          setError("Email o contraseña incorrectos — o puede que aún no hayas confirmado tu cuenta. Revisa tu bandeja de entrada.");
          setLoading(false);
          return;
        }
        if (signInError.message.includes("Too many requests") || signInError.message.includes("rate limit")) {
          setError("Demasiados intentos. Espera unos minutos y vuelve a intentarlo.");
          setLoading(false);
          return;
        }
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }

      // Update the legacy store as well for components still relying on it
      setAuthStoreLogin({
        email,
        name: data.user?.user_metadata?.name || email.split("@")[0],
      });

      // If user has a professional profile and no explicit redirect, send to pro portal
      const explicitRedirect = searchParams.get('redirect') || searchParams.get('returnTo');
      let redirectTo = explicitRedirect || '/dashboard';
      if (!explicitRedirect) {
        const { data: pro } = await supabase.from('professionals').select('id').maybeSingle();
        if (pro) redirectTo = '/pro/dashboard';
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace(redirectTo);
      router.refresh();

    } else {
      setLoading(false);
      setError("Por favor, ingresa tu email y contraseña.");
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Por favor, ingresa tu email para reenviar el enlace.");
      return;
    }
    
    setLoading(true);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (resendError) {
      if (resendError.message.toLowerCase().includes("rate limit")) {
        setError("Has solicitado demasiados emails en poco tiempo. Espera unos minutos antes de intentarlo de nuevo.");
      } else {
        setError(resendError.message);
      }
    } else {
      setError("Email de confirmación reenviado. Revisa tu bandeja de entrada.");
    }
    setLoading(false);
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

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Hola de nuevo</h1>
          <p className="text-aubergine-dark/60 text-center text-sm mb-6">Conecta con tu estado interior hoy.</p>

          {error && (
            <div className={`p-4 rounded-xl text-sm mb-6 text-center ${
              error.includes("reenviado") || error.includes("actualizada")
                ? "bg-green-50 text-green-700 border border-green-100" 
                : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {error}
              {(error.includes("confirmar tu cuenta") || error.includes("confirmado")) && (
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="block w-full mt-2 font-bold underline hover:no-underline transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Reenviar email de confirmación →"}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50">Contraseña</label>
                <Link href="/auth/forgot-password" title="Recuperar contraseña" className="text-xs text-aubergine-dark/40 hover:text-aubergine-dark transition-colors font-semibold">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-aubergine-dark/5 pt-8 space-y-2 text-center text-sm text-aubergine-dark/60">
            <p>¿No tienes cuenta? <Link href="/auth/register" className="font-bold text-aubergine-dark hover:underline">Crear cuenta gratis →</Link></p>
            <p>¿Tienes un código beta? <Link href="/pricing#codigo" className="font-bold text-aubergine-dark hover:underline">Canjéalo en planes</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark" />}>
      <LoginForm />
    </Suspense>
  );
}
