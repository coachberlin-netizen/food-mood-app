"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check, X, Crown, Sparkles, ArrowRight, Zap, BookOpen, Loader2,
  ShieldCheck, RefreshCcw, Lock,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/* ── Feature lists ───────────────────────────────────────── */
const FREE_FEATURES = [
  { text: "Test de estado emocional", included: true },
  { text: "1 receta por estado", included: true },
  { text: "Historial de estados", included: false },
  { text: "Recetas completas", included: false },
  { text: "Guías de ingredientes funcionales", included: false },
  { text: "Acceso anticipado a contenidos", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Todo lo gratuito", included: true },
  { text: "Recetas completas por estado", included: true },
  { text: "Historial de estados", included: true },
  { text: "Guías de ingredientes funcionales", included: true },
  { text: "Acceso anticipado a nuevos contenidos", included: true },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        // Check subscription status
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, tier")
          .eq("id", session.user.id)
          .single();
        if (profile?.is_premium || profile?.tier === "premium") {
          setIsPremium(true);
        }
      }
    };
    checkUser();
  }, []);

  const handleCheckout = async (plan: "monthly" | "quarterly") => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/pricing&plan=${plan}`;
      return;
    }
    setIsLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago. Inténtalo de nuevo.");
        setIsLoading(null);
      }
    } catch {
      alert("Error de conexión. Inténtalo de nuevo.");
      setIsLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 md:px-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 block">
            Planes
          </span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-aubergine-dark leading-[1.1] mb-5">
            Empieza gratis.<br />
            <span className="not-italic font-semibold">Profundiza cuando quieras.</span>
          </h1>
          <p className="text-lg text-aubergine-dark/50 font-light max-w-xl mx-auto leading-relaxed">
            Una sola receta es un primer paso. La transformación real viene con la diversidad microbiana.
          </p>
        </motion.div>

        {/* ── Plans grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">

          {/* ═══ FREE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10 flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35">
                Gratuito
              </span>
              <div className="flex items-end gap-1 mt-3 mb-2">
                <span className="text-5xl font-serif text-aubergine-dark">0€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">/siempre</span>
              </div>
              <p className="text-sm text-aubergine-dark/45 font-light">
                Prueba lo que Food·Mood puede hacer por ti.
              </p>
            </div>

            <ul className="space-y-3.5 mb-10 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  {f.included ? (
                    <Check className="w-4 h-4 text-aubergine-dark/30 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-aubergine-dark/15 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm font-light ${
                    f.included ? "text-aubergine-dark/50" : "text-aubergine-dark/25 line-through"
                  }`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/test">
              <button className="w-full py-3.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-medium hover:bg-aubergine-dark/5 transition-colors">
                Empezar gratis
              </button>
            </Link>
          </motion.div>

          {/* ═══ MONTHLY ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10 flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  Mensual
                </span>
              </div>
              <div className="flex items-end gap-1 mt-1 mb-2">
                <span className="text-5xl font-serif text-aubergine-dark">9€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">/mes</span>
              </div>
              <p className="text-sm text-aubergine-dark/45 font-light">
                Acceso completo al ecosistema Food·Mood.
              </p>
            </div>

            <ul className="space-y-3.5 mb-10 flex-1">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-aubergine-dark/60">{f.text}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-3.5 rounded-xl bg-aubergine-dark/5 text-aubergine-dark/40 text-sm font-medium text-center">
                Plan actual
              </div>
            ) : (
              <button
                onClick={() => handleCheckout("monthly")}
                disabled={isLoading === "monthly"}
                className="w-full py-3.5 rounded-xl bg-aubergine-dark hover:bg-aubergine-dark/90 disabled:opacity-70 text-cream text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isLoading === "monthly" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Redirigiendo…</>
                ) : (
                  <>Suscribirme por 9 €/mes</>
                )}
              </button>
            )}
          </motion.div>

          {/* ═══ QUARTERLY (RECOMMENDED) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-cream rounded-2xl border-2 border-[#C9A84C]/40 p-8 md:p-10 flex flex-col shadow-luxury"
          >
            {/* Badge */}
            <div className="absolute -top-3 right-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                <Zap className="w-3 h-3" />
                Más popular
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  Trimestral
                </span>
              </div>
              <div className="flex items-end gap-1 mt-1 mb-1">
                <span className="text-5xl font-serif text-aubergine-dark">15€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">/ 3 meses</span>
              </div>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">
                Solo 5 €/mes
              </p>
              <p className="text-sm text-aubergine-dark/45 font-light">
                Todo lo del mensual, ahorrando un 44%.
              </p>
            </div>

            <ul className="space-y-3.5 mb-10 flex-1">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                  <span className="text-sm font-light text-aubergine-dark/60">{f.text}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="w-full py-4 rounded-xl bg-aubergine-dark/5 text-aubergine-dark/40 text-sm font-medium text-center">
                Plan actual
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleCheckout("quarterly")}
                  disabled={isLoading === "quarterly"}
                  className="w-full py-4 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] disabled:opacity-70 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading === "quarterly" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Redirigiendo…</>
                  ) : (
                    <>
                      Empezar 7 días gratis
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-aubergine-dark/30 mt-3 font-light">
                  Después 15 € / 3 meses · Cancela cuando quieras
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Trust signals ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mb-20"
        >
          {[
            { icon: ShieldCheck, text: "Sin permanencia" },
            { icon: RefreshCcw, text: "Cancela cuando quieras" },
            { icon: Lock, text: "Pago seguro" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-aubergine-dark/35">
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-light">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 text-center mb-8">
            Preguntas frecuentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "¿Puedo cancelar cuando quiera?",
                a: "Sí, sin permanencia. Cancela desde tu perfil en cualquier momento y seguirás teniendo acceso hasta el final del periodo pagado.",
              },
              {
                q: "¿Las recetas son realmente diferentes?",
                a: "Cada receta está diseñada para un cruce específico de mood, sexo y grupo de edad. Con 10,000 combinaciones, nunca te faltará variedad.",
              },
              {
                q: "¿Qué son las recetas Michelin-inspired?",
                a: "200 recetas diseñadas con técnicas de 20 chefs con estrella Michelin. El mismo rigor científico Food·Mood, con técnicas de alta cocina.",
              },
              {
                q: "¿Es seguro el pago?",
                a: "Utilizamos Stripe, el procesador de pagos líder mundial. Tus datos financieros nunca pasan por nuestros servidores.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-aubergine-dark/8 pb-6">
                <h3 className="text-base font-medium text-aubergine-dark mb-2">{faq.q}</h3>
                <p className="text-sm text-aubergine-dark/50 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Disclaimer ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 mt-16 text-aubergine-dark/25 text-xs max-w-2xl mx-auto">
          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-light">
            Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia.
          </p>
        </div>
      </div>
    </div>
  );
}
