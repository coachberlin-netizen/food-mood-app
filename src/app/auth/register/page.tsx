"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function RegisterForm() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const router      = useRouter();
  const searchParams = useSearchParams();
  const supabase    = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || email.split("@")[0] },
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered") || signUpError.message.includes("User already registered")) {
        setError("Este email ya tiene cuenta. ¿Olvidaste tu contraseña?");
      } else {
        setError("Error al crear la cuenta. Inténtalo de nuevo.");
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cream/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Crear cuenta</h1>
          <p className="text-aubergine-dark/60 text-center text-sm mb-6">Empieza gratis. Profundiza cuando quieras.</p>

          {success ? (
            <div className="p-4 rounded-xl text-sm text-center bg-green-50 text-green-700 border border-green-100 space-y-1">
              <p className="font-bold">✓ Cuenta creada</p>
              <p>Revisa tu email y confirma tu cuenta antes de iniciar sesión. Después vuelve aquí para entrar.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 rounded-xl text-sm mb-6 text-center bg-red-50 text-red-600 border border-red-100">
                  {error}
                  {error.includes("contraseña") && (
                    <Link href="/auth/forgot-password" className="block mt-2 font-bold underline">
                      Recuperar contraseña →
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Nombre (opcional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-aubergine/20 transition-all font-medium text-aubergine-dark"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-aubergine-dark text-white hover:bg-aubergine-dark/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Crear cuenta <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-8 border-t border-aubergine-dark/5 pt-8 space-y-2 text-center text-sm text-aubergine-dark/60">
                <p>¿Ya tienes cuenta? <Link href="/auth/login" className="font-bold text-aubergine-dark hover:underline">Iniciar sesión</Link></p>
                <p>¿Tienes código beta? <Link href="/pricing" className="font-bold text-aubergine-dark hover:underline">Canjéalo en planes</Link></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-aubergine-dark" />}>
      <RegisterForm />
    </Suspense>
  );
}
