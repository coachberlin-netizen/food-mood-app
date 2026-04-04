"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check, X, Crown, Sparkles, ArrowRight, Zap, BookOpen,
  ShieldCheck, RefreshCcw, Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ── Feature lists ───────────────────────────────────────── */
const FREE_FEATURES = [
  { text: "Test de estado emocional ilimitado", included: true },
  { text: "Inspiraciones recomendadas diarias", included: true },
  { text: "Historial de estados", included: false },
  { text: "Recetas completas paso a paso", included: false },
  { text: "Guías de ingredientes funcionales", included: false },
  { text: "Biblioteca integral de la Familia", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Todo lo gratuito, más:", included: true },
  { text: "Recetas completas con preparaciones", included: true },
  { text: "Historial y analítica de estados", included: true },
  { text: "Variantes completas para la Familia", included: true },
  { text: "Guías clínicas de ingredientes", included: true },
];

export default function PricingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .single();
        if (profile?.is_premium === true) {
          setIsPremium(true);
        }
      }
    };
    checkUser();
  }, []);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  // Store userId when checking auth
  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, [isAuthenticated]);

  const handleCheckout = async (plan: "monthly" | "quarterly") => {
    if (!isAuthenticated || !userId) {
      router.push(`/auth/login?redirect=/pricing`);
      return;
    }

    const priceId = plan === "quarterly"
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_QUARTERLY || "price_1THqhMKAfsMmyDlfzjeoWoSw"
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_1THUGfKAfsMmyDlfym8JQTiC";

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout response:', data);
        alert('Error al conectar con la pasarela de pago.');
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error al conectar con la pasarela de pago.');
      setIsCheckingOut(false);
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
                Descubre tu mapa emocional sin compromiso.
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
                  <span className={`text-sm font-light ${f.included ? "text-aubergine-dark/50" : "text-aubergine-dark/25 line-through"
                    }`}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/test">
              <button className="w-full py-3.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-semibold hover:bg-aubergine-dark/5 transition-colors">
                Hacer mi test gratis
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
                Acceso íntrego al recetario para reescribir tu biología.
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
                className="w-full py-3.5 rounded-xl bg-aubergine-dark hover:bg-aubergine-dark/90 text-cream text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                Suscribirme por 9 €/mes
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
                La biblioteca Premium para ti y toda tu Familia (44% off).
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
                  className="w-full py-4 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Empezar 7 días gratis
                  <ArrowRight className="w-4 h-4" />
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
                q: "¿El test es totalmente gratis?",
                a: "Sí. Puedes usar el Test visual o charlar libremente con nuestra IA sin coste alguno. Como perfil Free recibirás orientaciones de conducta y una 'Inspiración Botánica', pero no tendrás acceso a nuestras Recetas de preparación completas.",
              },
              {
                q: "¿Qué incluye exactamente mi Premium?",
                a: "Desbloquea instantáneamente el mapa Food·Mood al 100%: tendrás línea directa a todas las Recetas Completas (gramajes, instrucciones dietéticas precisas), la biblioteca adaptada a la Familia, e Historial evolutivo de tu estado.",
              },
              {
                q: "¿Tenéis recetas para toda la Familia?",
                a: "Totalmente. Hemos estructurado la arquitectura Premium para que funcione con variantes aptas para toda tu casa, resolviendo lo que deben comer niños y jóvenes sin que pierdas jamás tu foco terapéutico.",
              },
              {
                q: "¿Es seguro el pago y cancelable?",
                a: "Operamos con pasarela encriptada Stripe y puedes cancelar en 1 solo clic desde tu perfil. Sin permanencia ni excusas. Te mantendremos el acceso activo hasta acabar el tiempo que pagaste.",
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
