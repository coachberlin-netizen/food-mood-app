"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useQuizStore } from "@/store/useQuizStore";
import { moods } from "@/data/moods";
import { recipesData } from "@/data/recipes";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  User, Calendar, Activity, PieChart, Bookmark, CheckCircle2,
  Settings, Download, Trash2, Globe, Heart, ExternalLink, LogOut, Gift
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { saveWhatsAppOptInAction, getWhatsAppOptInAction } from "./actions";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { moodHistory, savedRecipes, completedRecipes } = useQuizStore();
  const [activeTab, setActiveTab]       = useState<"guardadas" | "completadas">("guardadas");
  const [waPhone,    setWaPhone]         = useState('');
  const [waOptIn,    setWaOptIn]         = useState(false);
  const [waSaving,   setWaSaving]        = useState(false);
  const [waSuccess,  setWaSuccess]       = useState(false);
  const [waError,    setWaError]         = useState<string | null>(null);
  const [betaCode,   setBetaCode]        = useState('');
  const [betaStatus, setBetaStatus]      = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [betaMsg,    setBetaMsg]         = useState('');
  const router = useRouter();

  useEffect(() => {
    getWhatsAppOptInAction().then(data => {
      if (data) {
        setWaPhone(data.whatsapp_phone ?? '');
        setWaOptIn(data.whatsapp_opt_in ?? false);
      }
    })
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      useAuthStore.getState().logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 1. CABECERA & PATRÓN (Últimos 30 días)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const recentHistory = moodHistory.filter(e => new Date(e.timestamp) >= last30Days);
  
  const moodCounts = recentHistory.reduce((acc, curr) => {
    acc[curr.moodId] = (acc[curr.moodId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMoodIds = Object.keys(moodCounts).sort((a,b) => moodCounts[b] - moodCounts[a]);
  const predominantId = sortedMoodIds[0];
  const predominantMood = moods.find(m => m.id === predominantId);
  const secondaryMood = sortedMoodIds[1] ? moods.find(m => m.id === sortedMoodIds[1]) : null;

  const headerColor = predominantMood?.color || "#cbd5e1";

  // Insight Generator
  let insight = "Haz el test o el check-in diario para ver qué te pide el cuerpo.";
  if (predominantMood && secondaryMood) {
    insight = `Últimamente eres puro ${predominantMood.nombre} y un poco de ${secondaryMood.nombre}. Tu cuerpo pide estos balances. Dale lo que necesita.`;
  } else if (predominantMood) {
    insight = `Últimamente eres puro ${predominantMood.nombre}. Sigue escuchándole.`;
  }

  // 3. MIS RECETAS
  const displayedRecipesIds = activeTab === "guardadas" ? savedRecipes : completedRecipes;
  const displayedRecipes = recipesData.filter(r => displayedRecipesIds.includes(r.id));

  // 4. MI HISTORIAL DE TESTS
  // In our simple store, all entries are in moodHistory. We'll show the first one and the latest.
  const firstTest = moodHistory.length > 0 ? moodHistory[0] : null;
  const latestTest = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null;
  const mFirst = moods.find(m => m.id === firstTest?.moodId);
  const mLatest = moods.find(m => m.id === latestTest?.moodId);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--background)] pb-24">
        
        {/* 1. CABECERA DE PERFIL */}
        <header className="relative pt-32 pb-16 px-6 md:px-12 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.05] blur-[100px]"
            style={{ backgroundColor: headerColor }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)]" />
          
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            <div 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-4xl font-serif text-white bg-cover bg-center"
              style={{ backgroundColor: headerColor }}
            >
              {user?.name?.charAt(0).toUpperCase() || <User className="w-12 h-12" />}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif text-aubergine-dark mb-4 leading-[1.2]">{user?.name || "Viajero"}</h1>
              <p className="text-[11px] font-sans tracking-[0.2em] uppercase text-aubergine-dark/70 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span>{user?.email || "hola@foodmood.app"}</span>
                <span className="hidden md:inline-block w-1 h-1 rounded-full bg-aubergine-dark/20" />
                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> Miembro reciente</span>
              </p>
            </div>
            
            {predominantMood && (
              <div className="shrink-0 text-center">
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 mb-3">Tu estado más frecuente</p>
                <div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl shadow-luxury border border-aubergine-dark/20 bg-cream"
                  style={{ color: headerColor }}
                >
                  <span className="text-2xl filter drop-shadow-sm">{predominantMood.emoji}</span>
                  <span className="font-serif text-lg">{predominantMood.nombre}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16">
          
          {/* 2. MI PATRON FOOD MOOD */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <PieChart className="w-5 h-5 text-aubergine-dark/50" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Tu Patrón</h2>
            </div>
            
            <div className="bg-cream rounded-xl p-10 md:p-14 shadow-luxury border border-aubergine-dark/20">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Visual Chart Placeholder */}
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="flex h-6 w-full rounded-full overflow-hidden border border-black/5 shadow-inner">
                    {Object.entries(moodCounts).map(([id, count]) => {
                      const m = moods.find(x => x.id === id);
                      const width = `${(count / recentHistory.length) * 100}%`;
                      return <div key={id} style={{ width, backgroundColor: m?.color }} title={`${m?.nombre}: ${count}`} />
                    })}
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] font-sans uppercase tracking-widest text-aubergine-dark/60">
                    {sortedMoodIds.slice(0, 3).map(id => {
                      const m = moods.find(x => x.id === id);
                      const pct = Math.round((moodCounts[id] / recentHistory.length) * 100);
                      return <span key={id} style={{ color: m?.color }}>{m?.nombre} {pct}%</span>
                    })}
                  </div>
                </div>
                
                {/* Insight */}
                <div className="flex-1 bg-[var(--background)] border border-aubergine-dark/20 p-8 rounded-xl relative">
                   <p className="font-serif italic text-aubergine-dark/80 text-xl leading-[1.6] shrink-0 max-w-lg">
                     &quot;{insight}&quot;
                   </p>
                </div>
              </div>

              {/* Timeline visual (last 5) */}
              <div className="mt-12 pt-8 border-t border-aubergine-dark/20">
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-aubergine-dark/40 mb-6">Últimos check-ins</p>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[...recentHistory].reverse().slice(0, 5).map((entry, idx) => {
                    const m = moods.find(x => x.id === entry.moodId);
                    return (
                      <div key={idx} className="flex-shrink-0 flex items-center gap-4 bg-[var(--background)] p-4 rounded-xl border border-aubergine-dark/20 shadow-sm min-w-[200px] hover:border-aubergine-dark/30 transition-colors cursor-default">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-cream border border-aubergine-dark/20" style={{ color: m?.color }}>{m?.emoji}</div>
                        <div>
                          <p className="font-serif text-lg text-aubergine-dark leading-none mb-1">{m?.nombre}</p>
                          <p className="text-[10px] font-sans uppercase tracking-[0.1em] text-aubergine-dark/40">{new Date(entry.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 3. MIS RECETAS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <Bookmark className="w-5 h-5 text-aubergine-dark/50" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Tus descubrimientos</h2>
            </div>
            
            <div className="flex gap-8 border-b border-aubergine-dark/20 pb-4">
              <button 
                onClick={() => setActiveTab("guardadas")} 
                className={`text-[11px] font-sans uppercase tracking-[0.2em] transition-all relative pb-2 ${activeTab === 'guardadas' ? 'text-aubergine-dark' : 'text-aubergine-dark/40 hover:text-aubergine-dark/60'}`}
              >
                Guardadas ({savedRecipes.length})
                {activeTab === 'guardadas' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-aubergine-dark" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("completadas")} 
                className={`text-[11px] font-sans uppercase tracking-[0.2em] transition-all relative pb-2 ${activeTab === 'completadas' ? 'text-aubergine-dark' : 'text-aubergine-dark/40 hover:text-aubergine-dark/60'}`}
              >
                Probadas ({completedRecipes.length})
                {activeTab === 'completadas' && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-aubergine-dark" />
                )}
              </button>
            </div>

            {displayedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="bg-cream border border-dashed border-aubergine-dark/20 p-16 rounded-xl text-center text-aubergine-dark/40 font-light text-lg">
                No tienes recetas en esta lista todavía.
              </div>
            )}
          </section>

          {/* 4. HISTORIAL DE TESTS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-aubergine-dark/50" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Tu historia</h2>
            </div>
            
            <div className="bg-cream rounded-xl p-10 md:p-14 shadow-luxury border border-aubergine-dark/20 text-center md:text-left flex flex-col items-center md:items-start">
              {firstTest && latestTest && mFirst && mLatest ? (
                <p className="font-serif text-2xl md:text-3xl text-aubergine-dark leading-[1.6] max-w-3xl">
                  Empezaste siendo <strong className="font-serif italic" style={{ color: mFirst.color }}>{mFirst.nombre}</strong> el {new Date(firstTest.timestamp).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })}. <br/><br/>
                  Hoy, tu cuerpo es puro <strong className="font-serif italic" style={{ color: mLatest.color }}>{mLatest.nombre}</strong>.
                </p>
              ) : (
                <p className="text-aubergine-dark/50 font-light text-lg">Realiza pruebas para documentar tu historia emocional.</p>
              )}
            </div>
          </section>

          {/* BETA / ACCESO VIP */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <Gift className="w-5 h-5 text-aubergine-dark/50" />
              <h2 className="text-3xl font-serif text-aubergine-dark">Código de acceso</h2>
            </div>
            <div className="bg-cream rounded-xl p-8 shadow-luxury border border-aubergine-dark/20 space-y-5">
              {betaStatus === 'ok' ? (
                <p className="text-sm text-green-700 font-medium">✓ {betaMsg}</p>
              ) : (
                <>
                  <p className="text-sm text-aubergine-dark/60 font-light leading-relaxed">
                    ¿Tienes un código beta o de influencer? Introdúcelo aquí para activar el acceso premium.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={betaCode}
                      onChange={e => setBetaCode(e.target.value)}
                      placeholder="Introduce tu código"
                      className="flex-1 border border-aubergine-dark/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 uppercase tracking-widest"
                    />
                    <button
                      disabled={betaStatus === 'loading' || !betaCode.trim()}
                      onClick={async () => {
                        setBetaStatus('loading'); setBetaMsg('');
                        try {
                          const res = await fetch('/api/beta/redeem', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code: betaCode }),
                          });
                          const json = await res.json();
                          if (res.ok) {
                            setBetaStatus('ok');
                            setBetaMsg('¡Acceso premium activado! Recarga la página.');
                          } else {
                            setBetaStatus('error');
                            setBetaMsg(json.error ?? 'Error desconocido.');
                          }
                        } catch {
                          setBetaStatus('error');
                          setBetaMsg('Error de conexión.');
                        }
                      }}
                      className="px-5 py-3 rounded-full bg-[#6B2737] text-white text-sm font-semibold hover:bg-[#5a2030] transition-colors disabled:opacity-40 shrink-0"
                    >
                      {betaStatus === 'loading' ? '…' : 'Canjear'}
                    </button>
                  </div>
                  {betaStatus === 'error' && <p className="text-sm text-red-600">{betaMsg}</p>}
                </>
              )}
            </div>
          </section>

          {/* 5b. WHATSAPP OPT-IN */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-aubergine-dark/50 text-xl leading-none">📱</span>
              <h2 className="text-3xl font-serif text-aubergine-dark">WhatsApp</h2>
            </div>
            <div className="bg-cream rounded-xl p-8 shadow-luxury border border-aubergine-dark/20 space-y-5">
              <p className="text-sm text-aubergine-dark/60 font-light leading-relaxed">
                Recibe recomendaciones personalizadas y novedades exclusivas directamente en WhatsApp.
                Solo para suscriptoras premium. Tu número nunca se compartirá con terceros.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/40 mb-2">Número de teléfono</label>
                <input
                  type="tel"
                  value={waPhone}
                  onChange={e => setWaPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full border border-aubergine-dark/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={waOptIn}
                  onChange={e => setWaOptIn(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-aubergine-dark/30 accent-[#6B2737] shrink-0"
                />
                <span className="text-sm text-aubergine-dark/70 font-light leading-relaxed group-hover:text-aubergine-dark transition-colors">
                  Acepto recibir mensajes de WhatsApp de Food·Mood con contenido de bienestar personalizado.
                  Puedo retirar mi consentimiento en cualquier momento desde esta pantalla.
                </span>
              </label>
              {waError   && <p className="text-sm text-red-600">{waError}</p>}
              {waSuccess && <p className="text-sm text-green-700">✓ Preferencias guardadas.</p>}
              <button
                disabled={waSaving}
                onClick={async () => {
                  if (waOptIn && !waPhone.trim()) { setWaError('Introduce tu número de teléfono.'); return; }
                  setWaSaving(true); setWaError(null); setWaSuccess(false);
                  try {
                    await saveWhatsAppOptInAction(waPhone, waOptIn);
                    setWaSuccess(true);
                    setTimeout(() => setWaSuccess(false), 3000);
                  } catch (err: any) { setWaError(err.message); }
                  finally { setWaSaving(false); }
                }}
                className="px-5 py-2.5 rounded-full bg-[#6B2737] text-white text-sm font-semibold hover:bg-[#5a2030] transition-colors disabled:opacity-50"
              >
                {waSaving ? 'Guardando…' : 'Guardar preferencias'}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 5. AJUSTES */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5 text-aubergine-dark/50" />
                <h2 className="text-3xl font-serif text-aubergine-dark">Ajustes</h2>
              </div>
              <div className="bg-cream rounded-xl p-8 shadow-luxury border border-aubergine-dark/20 space-y-2 divide-y divide-[#edeae3]">
                <div className="py-4 flex justify-between items-center cursor-pointer group">
                  <span className="font-light text-aubergine-dark/80 group-hover:text-aubergine-dark transition-colors">Idioma</span>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-aubergine-dark bg-[var(--background)] border border-aubergine-dark/20 px-3 py-1.5 rounded-md">Español</span>
                </div>
                <div className="py-4 flex justify-between items-center cursor-pointer group">
                  <span className="font-light text-aubergine-dark/80 group-hover:text-aubergine-dark transition-colors">Notificaciones</span>
                  <div className="w-10 h-6 bg-green-400 rounded-full flex items-center p-1 justify-end"><div className="w-4 h-4 bg-cream rounded-full" /></div>
                </div>
                <div className="py-5 flex justify-between items-center cursor-pointer group text-gold hover:text-amber-700">
                  <span className="font-light flex items-center gap-3"><Download className="w-4 h-4" /> Exportar mis datos</span>
                </div>
                <div 
                  onClick={handleLogout}
                  className="py-5 flex justify-between items-center cursor-pointer group text-aubergine-dark/80 hover:text-aubergine-dark transition-colors"
                >
                  <span className="font-light flex items-center gap-3"><LogOut className="w-4 h-4" /> Cerrar sesión</span>
                </div>
                <div className="py-5 flex justify-between items-center cursor-pointer group text-red-400 hover:text-red-500">
                  <span className="font-light flex items-center gap-3"><Trash2 className="w-4 h-4" /> Eliminar cuenta</span>
                </div>
              </div>
            </section>

            {/* 6. SOBRE FOOD MOOD */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <Heart className="w-5 h-5 text-aubergine-dark/50" />
                <h2 className="text-3xl font-serif text-aubergine-dark">Sobre Food·Mood</h2>
              </div>
              <div className="bg-cream rounded-xl p-8 shadow-luxury border border-aubergine-dark/20 flex flex-col justify-center gap-6 text-center md:text-left h-full pb-10">
                <h3 className="font-serif text-xl text-aubergine-dark">Food·Mood v.1.0 (Beta)</h3>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center justify-center md:justify-start gap-3 text-aubergine-dark/60 hover:text-aubergine-dark font-light transition-colors">
                    <Globe className="w-4 h-4" /> Visita food-mood.app
                  </Link>
                  <Link href="#" className="flex items-center justify-center md:justify-start gap-3 text-aubergine-dark/60 hover:text-aubergine-dark font-light transition-colors">
                    <ExternalLink className="w-4 h-4" /> Comprar el Libro &quot;Food Mood&quot;
                  </Link>
                </div>
                <div className="pt-6 mt-4 border-t border-aubergine-dark/20">
                  <p className="text-[10px] text-aubergine-dark/40 font-sans uppercase tracking-[0.2em]">Creado por</p>
                  <p className="text-sm font-light text-aubergine-dark mt-2">Nuestro equipo — Psicología & Food Tech</p>
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </AuthGuard>
  );
}
