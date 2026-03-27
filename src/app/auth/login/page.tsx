"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const setAuthStoreLogin = useAuthStore(state => state.login);

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
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Update the legacy store as well for components still relying on it
      setAuthStoreLogin({ 
        email, 
        name: data.user?.user_metadata?.name || email.split("@")[0], 
      });

      router.push("/dashboard");
      router.refresh();
    } else {
      setLoading(false);
      setError("Por favor, ingresa tu email y contraseña.");
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center gap-2 text-white">
            <Leaf className="w-8 h-8 text-amber-300" />
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          <h1 className="text-2xl font-serif font-bold text-navy mb-2 text-center">Bienvenido de nuevo</h1>
          <p className="text-navy/60 text-center text-sm mb-6">Conecta con tu estado interior hoy.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-navy/50 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all font-medium text-navy"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-navy/50">Contraseña</label>
                <Link href="#" className="text-xs text-navy/40 hover:text-navy transition-colors font-semibold">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-navy/5 border border-navy/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all font-medium text-navy"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white hover:bg-navy/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-navy/60 text-sm mt-8 border-t border-navy/5 pt-8">
            ¿No tienes cuenta? <Link href="/auth/register" className="font-bold text-navy hover:underline">Crear cuenta gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

