"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setAuthStoreRegister = useAuthStore(state => state.register);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (name && email && password && acceptTerms) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Automatically create a profile if it's not handled by a Postgres trigger
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert({ user_id: data.user.id, name: name, email: email });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      // Update the legacy store as well for components still relying on it
      setAuthStoreRegister({ email, name }, false);

      // Step 2: Post-registration redirect to Stripe if pendingPlan exists
      if (typeof window !== 'undefined') {
        const pendingPlan = sessionStorage.getItem('pendingPlan');
        const pendingPriceId = sessionStorage.getItem('pendingPriceId');

        if (pendingPlan && pendingPriceId) {
          try {
            const res = await fetch('/api/stripe/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ priceId: pendingPriceId, planType: pendingPlan }),
            });
            const { url } = await res.json();

            // Cleanup sessionStorage before redirecting
            sessionStorage.removeItem('pendingPlan');
            sessionStorage.removeItem('pendingPriceId');

            if (url) {
              window.location.href = url;
              return;
            }
          } catch (err) {
            console.error("Error creating checkout session after registration:", err);
          }
        }
      }

      // Detection of auth session status
      const session = data.session;
      const user = data.user;

      if (!session && user) {
        // CASE: email confirmation might be required OR browser session failed to persist
        // Try a fallback signInWithPassword to ensure we have a session before redirect
        console.log("⚠️ Registro exitoso pero sin sesión activa. Intentando logueo automático...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("❌ Fallo en el auto-login tras registro:", signInError.message);
          // Standard Supabase behavior: user exists but needs email verification.
          // In this case, we don't redirect yet if the session is required for /test.
          setError("Registro parcial: por favor verifica tu email para comenzar el test.");
          setLoading(false);
          return;
        }
        
        if (!signInData.session) {
          setError("No se pudo establecer sesión. Por favor verifica tu email.");
          setLoading(false);
          return;
        }
      }

      // Ensure session is fully established in browser cookies
      await supabase.auth.getSession();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Tras registro manda al test si ya tenemos sesión
      router.push("/test");
      router.refresh();
    } else {
      setLoading(false);
      setError("Por favor, completa todos los campos requeridos.");
    }
  };

  return (
    <div className="min-h-screen bg-aubergine-dark flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center text-white">
            <span className="text-3xl font-serif font-bold tracking-tight">Food·Mood</span>
          </Link>
        </div>

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Empieza tu viaje</h1>
          <p className="text-aubergine-dark/60 text-center text-sm mb-6">Tus emociones te hablan. Empieza a escucharlas.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all font-medium text-aubergine-dark"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all font-medium text-aubergine-dark"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-aubergine-dark/5 border border-aubergine-dark/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all font-medium text-aubergine-dark"
                placeholder="Crea una contraseña segura"
              />
            </div>

            <div className="pt-2">

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 rounded border-aubergine-dark/20 text-aubergine-dark focus:ring-navy/30 bg-aubergine-dark/5"
                />
                <span className="text-sm text-aubergine-dark/70 group-hover:text-aubergine-dark transition-colors">
                  Acepto la <Link href="#" className="font-bold underline">política de privacidad</Link> y el uso de mis datos para el test.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!acceptTerms || loading}
              className="w-full bg-aubergine-dark text-white hover:bg-aubergine-dark/90 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2 mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Comenzar Test <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-aubergine-dark/60 text-sm mt-8 border-t border-aubergine-dark/5 pt-6">
            ¿Ya tienes cuenta? <Link href={`/auth/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="font-bold text-aubergine-dark hover:underline">Iniciar sesión</Link>
          </p>
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
