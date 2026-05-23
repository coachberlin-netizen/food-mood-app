"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check, X, Crown, Sparkles, ArrowRight, Zap, BookOpen,
  ShieldCheck, RefreshCcw, Lock, Loader2, ChevronDown,
} from "lucide-react";
import { trackEvent } from "@/components/analytics/AnalyticsProvider";

const FREE_FEATURES = [
  { text: "Inspiración diaria (lectura)", included: true },
  { text: "Historial de estados", included: false },
  { text: "Recetas que responden a cada color", included: false },
  { text: "Glosario científico y Fermentos del Mundo", included: false },
  { text: "Paleta emocional personalizada completa", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Todo lo gratuito, más:", included: true },
  { text: "FOOD-MOOD Guide — tu asistente IA especializada en el eje intestino-cerebro. Responde sobre recetas, síntomas y hábitos del día", included: true },
  { text: "Tu Paleta Emocional personalizada — descubre tu color cada día", included: true },
  { text: "Recetas adaptadas a tu mezcla emocional, no a una categoría genérica", included: true },
  { text: "Historial de colores — observa tus patrones emocionales semanales", included: true },
  { text: "Acceso completo a todas las recetas", included: true },
  { text: "Glosario científico y Fermentos del Mundo", included: true },
  { text: "Canal privado de Telegram — contenido exclusivo y avant-première", included: true },
];

export default function PricingClient({ initialIsPremium, initialIsAuthenticated }: { initialIsPremium: boolean; initialIsAuthenticated: boolean }) {
  const [isPremium] = useState(initialIsPremium);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [betaCode,   setBetaCode]   = useState('');
  const [betaStatus, setBetaStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [betaMsg,    setBetaMsg]    = useState('');
  const [faqOpen,    setFaqOpen]    = useState<number | null>(null);
  const router = useRouter();

  async function handleBetaRedeem() {
    if (!betaCode.trim()) return
    setBetaStatus('loading')
    try {
      // Trust SSR auth check; if not authenticated redirect to login
      if (!initialIsAuthenticated) {
        router.push('/auth/login?redirect=/pricing')
        return
      }

      const res = await fetch('/api/beta/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: betaCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setBetaStatus('error'); setBetaMsg(data.error ?? 'Código incorrecto.'); return }
      setBetaStatus('ok')
      setBetaMsg('¡Acceso activado! Ya tienes acceso premium completo.')
    } catch {
      setBetaStatus('error')
      setBetaMsg('Error de conexión. Inténtalo de nuevo.')
    }
  }

  const handleCheckout = async (plan: "monthly" | "quarterly") => {
    trackEvent({ name: "checkout_started", properties: { plan } });
    const priceId = plan === "quarterly"
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_QUARTERLY || "price_1THqhMKAfsMmyDlfzjeoWoSw"
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || "price_1THUGfKAfsMmyDlfym8JQTiC";

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planType: plan }),
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout response:', data);
        alert(`Error al conectar con la pasarela de pago: ${data.error || 'Inténtelo de nuevo más tarde'}`);
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error de red al conectar con Stripe. Compruebe su conexión.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/50 mb-6 block">Planes</span>
          <h1 className="text-4xl md:text-6xl font-serif italic text-aubergine-dark leading-[1.1] mb-5">Empieza gratis.<br /><span className="not-italic font-semibold">Profundiza cuando quieras.</span></h1>
          <p className="text-lg text-aubergine-dark/50 font-light max-w-xl mx-auto leading-relaxed">Una sola receta es un primer paso. La transformación real viene con la diversidad microbiana.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {/* FREE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10 flex flex-col">
            <div className="mb-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/35">Gratuito</span>
              <div className="flex items-end gap-1 mt-3 mb-2"><span className="text-5xl font-serif text-aubergine-dark">0€</span><span className="text-aubergine-dark/40 font-light text-sm mb-2">/siempre</span></div>
              <p className="text-sm text-aubergine-dark/45 font-light">Test de mood + Paleta Emocional (resultado sin recetas)</p>
            </div>
            <ul className="space-y-3.5 mb-10 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  {f.included ? <Check className="w-4 h-4 text-aubergine-dark/30 shrink-0 mt-0.5" /> : <X className="w-4 h-4 text-aubergine-dark/15 shrink-0 mt-0.5" />}
                  <span className={`text-sm font-light ${f.included ? "text-aubergine-dark/50" : "text-aubergine-dark/25 line-through"}`}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/test"><button className="w-full py-3.5 rounded-xl border border-aubergine-dark/15 text-aubergine-dark/60 text-sm font-semibold hover:bg-aubergine-dark/5 transition-colors">Hacer mi test gratis</button></Link>
          </motion.div>

          {/* MONTHLY */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-cream rounded-2xl border border-aubergine-dark/10 p-8 md:p-10 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3"><Crown className="w-4 h-4 text-[#C9A84C]" /><span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Mensual</span></div>
              <div className="flex items-end gap-1 mt-1 mb-2"><span className="text-5xl font-serif text-aubergine-dark">9€</span><span className="text-aubergine-dark/40 font-light text-sm mb-2">/mes</span></div>
              <p className="text-xs text-aubergine-dark/35 font-medium mb-1">Sin compromiso · Cancela en cualquier momento</p>
              <p className="text-sm text-aubergine-dark/45 font-light">Ideal si quieres probar un mes antes de comprometerte. Mismo acceso completo que el trimestral.</p>
            </div>
            <ul className="space-y-3.5 mb-10 flex-1">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" /><span className="text-sm font-light text-aubergine-dark/60">{f.text}</span></li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-3.5 rounded-xl bg-aubergine-dark/5 text-aubergine-dark/40 text-sm font-medium text-center">Plan actual</div>
            ) : (
              <button onClick={() => handleCheckout("monthly")} disabled={isCheckingOut} className="w-full py-3.5 rounded-xl bg-aubergine-dark hover:bg-aubergine-dark/90 text-cream text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suscribirme por 9€/mes"}
              </button>
            )}
          </motion.div>

          {/* QUARTERLY */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative bg-cream rounded-2xl border-2 border-[#C9A84C]/40 p-8 md:p-10 flex flex-col shadow-luxury">
            <div className="absolute -top-3 right-6"><span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C9A84C] text-white text-[10px] font-bold uppercase tracking-wider shadow-md"><Zap className="w-3 h-3" />Más popular</span></div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-[#C9A84C]" /><span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">Trimestral</span></div>
              <div className="flex items-end gap-1 mt-1 mb-1">
                <span className="text-5xl font-serif text-aubergine-dark">21€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">facturados cada 3 meses</span>
              </div>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">Equivale a 7€/mes · Ahorra un 22%</p>
              <p className="text-sm text-aubergine-dark/45 font-light">Tu paleta emocional completa. Recetas que responden a cada color.</p>
            </div>
            <ul className="space-y-3.5 mb-10 flex-1">
              {PREMIUM_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" /><span className="text-sm font-light text-aubergine-dark/60">{f.text}</span></li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-4 rounded-xl bg-aubergine-dark/5 text-aubergine-dark/40 text-sm font-medium text-center">Plan actual</div>
            ) : (
              <>
                <button onClick={() => handleCheckout("quarterly")} disabled={isCheckingOut} className="w-full py-4 rounded-xl bg-[#C9A84C] hover:bg-[#b8953e] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50">
                  {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Suscribirme por 21€/trimestre<ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-center text-[10px] text-aubergine-dark/30 mt-3 font-light">21€ facturados trimestralmente · Cancela cuando quieras</p>
              </>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-8 mb-20">
          {[
            { icon: ShieldCheck, text: "Sin permanencia" },
            { icon: RefreshCcw, text: "Cancela cuando quieras" },
            { icon: Lock, text: "Pago seguro" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-aubergine-dark/35"><item.icon className="w-4 h-4" /><span className="text-sm font-light">{item.text}</span></div>
          ))}
        </motion.div>

        {/* ── Retos como add-on ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
          className="max-w-3xl mx-auto mb-10 rounded-2xl border border-aubergine-dark/10 bg-cream overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2 bg-[#C9A84C] shrink-0" />
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
            <div className="text-3xl select-none">⚡</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Retos de transformación — pago único</p>
              <h3 className="font-serif text-xl text-aubergine-dark mb-2">No son una suscripción</h3>
              <p className="text-sm text-aubergine-dark/55 font-light leading-relaxed">
                Los retos (7 días desde 19€, 28 días desde 29€) son programas intensivos de pago único.
                Compras el reto una vez y tienes acceso de por vida a su contenido — independientemente de si tienes plan premium o no.
              </p>
            </div>
            <Link href="/retos" className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: '#6B2737' }}>
              Ver retos →
            </Link>
          </div>
        </motion.div>

        {/* ── Comunidad gratuita (Telegram + WhatsApp) ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="max-w-3xl mx-auto mb-16 rounded-2xl border border-aubergine-dark/10 bg-cream overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2 bg-[#229ED9] shrink-0" />
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
            <div className="text-3xl select-none">📡</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#229ED9] mb-1">Gratuito — sin suscripción</p>
              <h3 className="font-serif text-xl text-aubergine-dark mb-2">Canal de Telegram y WhatsApp</h3>
              <p className="text-sm text-aubergine-dark/55 font-light leading-relaxed mb-5">
                Newsletter semanal, episodios de podcast y contenido de YouTube — publicamos todo aquí,
                gratis y abierto a cualquiera.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://t.me/foodmoodapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: "#229ED9" }}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Unirse en Telegram
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbCEhFoCsU9LDcPX362R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Seguir en WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              { q: "¿El test es totalmente gratis?", a: "Sí. El test de mood y la Paleta Emocional básica son gratuitos. El asistente IA FOOD-MOOD Guide y las recetas completas están incluidos en el plan premium." },
              { q: "¿Qué incluye exactamente mi Premium?", a: "Desbloquea el asistente IA FOOD-MOOD Guide, el recetario completo con recetas adaptadas a tu mezcla emocional del día, glosario, Fermentos del Mundo, historial emocional y canal privado de Telegram." },
              { q: "¿Las recetas sirven para todos en casa?", a: "Totalmente. Hemos estructurado la arquitectura Premium para que funcione con ingredientes y preparaciones que todos pueden disfrutar." },
              { q: "¿Es seguro el pago y cancelable?", a: "Operamos con pasarela encriptada Stripe y puedes cancelar en 1 solo clic desde tu perfil." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-aubergine-dark/8">
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                  aria-expanded={faqOpen === i}
                >
                  <span className="text-base font-medium text-aubergine-dark group-hover:text-[#6B2737] transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-aubergine-dark/40 shrink-0 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <p className="pb-5 text-sm text-aubergine-dark/50 font-light leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Código beta / influencer ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          id="codigo"
          className="max-w-md mx-auto mt-14 mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 mb-3">
            ¿Tienes un código de acceso?
          </p>
          {betaStatus === 'ok' ? (
            <p className="text-sm font-medium text-green-700">✓ {betaMsg}</p>
          ) : !initialIsAuthenticated ? (
            <p className="text-sm text-aubergine-dark/50">
              <Link href="/auth/login?redirect=/pricing" className="font-semibold text-aubergine-dark underline underline-offset-2">Inicia sesión</Link>
              {" "}o{" "}
              <Link href="/auth/register?redirect=/pricing" className="font-semibold text-aubergine-dark underline underline-offset-2">crea una cuenta gratis</Link>
              {" "}para canjear tu código.
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={betaCode}
                onChange={e => setBetaCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBetaRedeem()}
                placeholder="Código beta o influencer"
                disabled={betaStatus === 'loading'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-aubergine-dark/15 bg-cream text-sm text-aubergine-dark placeholder:text-aubergine-dark/25 focus:outline-none focus:border-aubergine-dark/35 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleBetaRedeem}
                disabled={betaStatus === 'loading' || !betaCode.trim()}
                className="px-4 py-2.5 rounded-xl bg-aubergine-dark text-cream text-sm font-semibold disabled:opacity-40 hover:bg-aubergine-dark/90 transition-colors whitespace-nowrap"
              >
                {betaStatus === 'loading' ? '…' : 'Canjear'}
              </button>
            </div>
          )}
          {betaStatus === 'error' && (
            <p className="text-xs text-red-600 mt-2">{betaMsg}</p>
          )}
        </motion.div>

        <div className="flex items-start gap-3 mt-6 text-aubergine-dark/25 text-xs max-w-2xl mx-auto"><BookOpen className="w-4 h-4 shrink-0 mt-0.5" /><p className="leading-relaxed font-light">Food·Mood recomienda recetas y alimentos funcionales basados en divulgación científica. No ofrece diagnóstico, tratamiento ni terapia.</p></div>
      </div>
    </div>
  );
}
