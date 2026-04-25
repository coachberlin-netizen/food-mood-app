"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check, X, Crown, Sparkles, ArrowRight, Zap, BookOpen,
  ShieldCheck, RefreshCcw, Lock, Loader2,
} from "lucide-react";

const FREE_FEATURES = [
  { text: "Inspiración diaria (lectura)", included: true },
  { text: "Historial de estados", included: false },
  { text: "Recetas que responden a cada color", included: false },
  { text: "Glosario científico y Fermentos del Mundo", included: false },
  { text: "Paleta emocional personalizada completa", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Todo lo gratuito, más:", included: true },
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
  const router = useRouter();

  async function handleBetaRedeem() {
    if (!betaCode.trim()) return
    setBetaStatus('loading')
    try {
      const { createClient: createSupabase } = await import('@/lib/supabase/client')
      const supabase = createSupabase()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login?redirect=/pricing')
        return
      }

      const res = await fetch('/api/beta/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
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
                <span className="text-5xl font-serif text-aubergine-dark">15€</span>
                <span className="text-aubergine-dark/40 font-light text-sm mb-2">facturados cada 3 meses</span>
              </div>
              <p className="text-sm text-[#C9A84C] font-semibold mb-1">Equivale a 5€/mes · Ahorra un 44%</p>
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
                  {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Suscribirme por 15€/trimestre<ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-center text-[10px] text-aubergine-dark/30 mt-3 font-light">15€ facturados trimestralmente · Cancela cuando quieras</p>
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

        {/* ── Canal privado de Telegram ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="max-w-3xl mx-auto mb-16 rounded-2xl border border-aubergine-dark/10 bg-cream overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2 bg-[#6B2737] shrink-0" />
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
            <div className="text-3xl select-none">✈️</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B2737] mb-1">Solo para premium</p>
              <h3 className="font-serif text-xl text-aubergine-dark mb-2">Canal privado de Telegram</h3>
              <p className="text-sm text-aubergine-dark/55 font-light leading-relaxed">
                Al suscribirte recibes un enlace de invitación único a nuestro canal privado donde publicamos
                hallazgos científicos, protocolos de bienestar y contenido exclusivo antes de que llegue a ningún otro sitio.
                El acceso se activa automáticamente con tu suscripción y se revoca si cancelas.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-2xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {[
              { q: "¿El test es totalmente gratis?", a: "Sí. Puedes usar el Test visual o charlar libremente con nuestra IA sin coste alguno." },
              { q: "¿Qué incluye exactamente mi Premium?", a: "Desbloquea instantáneamente el mapa Food·Mood al 100%: Recetas Completas, glosario, Fermentos del Mundo e Historial." },
              { q: "¿Las recetas sirven para todos en casa?", a: "Totalmente. Hemos estructurado la arquitectura Premium para que funcione con ingredientes y preparaciones que todos pueden disfrutar." },
              { q: "¿Es seguro el pago y cancelable?", a: "Operamos con pasarela encriptada Stripe y puedes cancelar en 1 solo clic desde tu perfil." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-aubergine-dark/8 pb-6"><h3 className="text-base font-medium text-aubergine-dark mb-2">{faq.q}</h3><p className="text-sm text-aubergine-dark/50 font-light leading-relaxed">{faq.a}</p></div>
            ))}
          </div>
        </motion.div>

        {/* ── Código beta / influencer ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="max-w-md mx-auto mt-14 mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-aubergine-dark/30 mb-3">
            ¿Tienes un código de acceso?
          </p>
          {betaStatus === 'ok' ? (
            <p className="text-sm font-medium text-green-700">✓ {betaMsg}</p>
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
