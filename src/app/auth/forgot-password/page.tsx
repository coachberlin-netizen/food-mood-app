"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSuccess(true);
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

        <div className="bg-cream rounded-[2.5rem] p-8 md:p-12 shadow-2xl w-full">
          {!success ? (
            <>
              <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-2 text-center">Recuperar contraseña</h1>
              <p className="text-aubergine-dark/60 text-center text-sm mb-8">Te enviamos un enlace a tu email</p>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-6 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-aubergine-dark text-white hover:bg-aubergine-dark/90 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 mt-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Enviar enlace <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-aubergine-dark mb-4">Revisa tu email</h1>
              <p className="text-aubergine-dark/70 text-sm leading-relaxed mb-8">
                Si la cuenta existe, recibirás un enlace en los próximos minutos. Revisa también la carpeta de spam.
              </p>
              <Link 
                href="/auth/login"
                className="inline-flex items-center gap-2 text-aubergine-dark font-bold hover:underline"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          )}

          {!success && (
            <p className="text-center text-aubergine-dark/60 text-sm mt-8 border-t border-aubergine-dark/5 pt-8">
              <Link href="/auth/login" className="font-bold text-aubergine-dark hover:underline">Volver al inicio de sesión</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
