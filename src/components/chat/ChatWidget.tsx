"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, ChefHat, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
  recipe?: any;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { resultMood } = useQuizStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isPremium, setIsPremium] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0 && (isOpen || true)) {
      const moodLabel = resultMood ? resultMood.toUpperCase() : null;
      const greeting = moodLabel 
        ? `Veo que hoy estás en modo ${moodLabel}. ¿Quieres que te recomiende algo especial?`
        : "Hola, soy tu asistente de Food·Mood. ¿Cómo te sientes hoy?";
      
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [resultMood, isOpen]);

  // Check premium status
  useEffect(() => {
    async function checkPremium() {
      if (!isAuthenticated) return;
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user?.id)
        .single();
      setIsPremium(!!profile?.is_premium);
    }
    checkPremium();
  }, [isAuthenticated, user]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // 1. Detect mood or intent from user message
      // (Very simple matching for energy, calma, focus, social, reset, familia)
      const inputLower = userMsg.toLowerCase();
      let detectedMood = "";
      if (inputLower.includes("energ") || inputLower.includes("activa")) detectedMood = "activacion";
      else if (inputLower.includes("calm") || inputLower.includes("paz")) detectedMood = "calma";
      else if (inputLower.includes("foc") || inputLower.includes("concentra")) detectedMood = "focus";
      else if (inputLower.includes("soci") || inputLower.includes("amig")) detectedMood = "social";
      else if (inputLower.includes("res") || inputLower.includes("depura")) detectedMood = "reset";
      else if (inputLower.includes("famili") || inputLower.includes("niñ")) detectedMood = "familia";

      // If no mood detected, check resultMood
      const finalMood = detectedMood || resultMood || "social";
      const MOOD_MAP: Record<string, string> = {
        activacion: "Energía", calma: "Calma", focus: "Focus",
        social: "Social", reset: "Reset", familia: "Familia"
      };

      // 2. Fetch one matching recipe from Supabase
      const res = await fetch(`/api/recetas?mood=${MOOD_MAP[finalMood] || 'Social'}&limit=1`);
      const data = await res.json();
      const recipe = data.recetas?.[0];

      if (recipe) {
        let responseContent = "";
        if (isPremium) {
          responseContent = `¡Claro! Te recomiendo el "${recipe.nombre_es}". Es ideal para tu estado actual porque ${recipe.nota_food_mood_es || 'equilibra tu cuerpo'}. Aquí tienes los pasos:`;
        } else {
          responseContent = `Te sugiero preparar el "${recipe.nombre_es}". Es una opción fantástica para hoy.`;
        }

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: responseContent,
          recipe: recipe 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "No he encontrado una receta exacta ahora mismo, pero puedes probar explorando el catálogo completo." 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Lo siento, he tenido un problema conectando con el catálogo. ¿Podemos intentarlo de nuevo?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-aubergine-dark text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group border border-white/10"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A84C] rounded-full scale-0 group-hover:scale-100 transition-transform flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-cream border border-aubergine-dark/15 rounded-[2rem] shadow-luxury flex flex-col overflow-hidden z-[60] backdrop-blur-sm"
          >
            {/* Header */}
            <div className="bg-aubergine-dark p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center border border-[#C9A84C]/30">
                  <ChefHat className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-cream text-sm font-bold">Asistente Food·Mood</h3>
                  <p className="text-cream/50 text-[10px] uppercase tracking-widest">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-cream/40 hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-light leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-aubergine text-white rounded-tr-none" 
                      : "bg-white border border-aubergine-dark/10 text-aubergine-dark/80 rounded-tl-none shadow-sm"
                  }`}>
                    {msg.content}

                    {msg.recipe && (
                      <div className="mt-4 pt-4 border-t border-aubergine-dark/5 space-y-3">
                        <h4 className="font-serif font-black text-aubergine-dark">{msg.recipe.nombre_es}</h4>
                        <p className="text-[11px] text-aubergine-dark/60 line-clamp-3">{msg.recipe.nota_food_mood_es}</p>
                        
                        {isPremium ? (
                          <div className="space-y-4 pt-2">
                             <div className="bg-aubergine-dark/[0.03] p-3 rounded-lg border border-aubergine-dark/5">
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#C9A84C]">Ingredientes</p>
                                <ul className="text-[10px] space-y-1">
                                  {msg.recipe.ingredientes_es?.slice(0, 5).map((ing: any, idx: number) => {
                                    const text = typeof ing === 'string' ? ing : ing.ingrediente || ing.nombre || "Ingrediente";
                                    return <li key={idx}>• {text}</li>;
                                  })}
                                  {msg.recipe.ingredientes_es?.length > 5 && <li className="opacity-40 italic">Y más...</li>}
                                </ul>
                             </div>
                             <Link href={`/recetas/${msg.recipe.id}`} className="block w-full py-2 bg-aubergine-dark text-white rounded-xl text-center text-xs font-medium">
                                Ver pasos completos
                             </Link>
                          </div>
                        ) : (
                          <div className="mt-2 text-center bg-[#C9A84C]/5 p-3 rounded-xl border border-[#C9A84C]/20">
                            <Lock className="w-3 h-3 mx-auto text-[#C9A84C] mb-1.5" />
                            <Link href="/pricing" className="text-[11px] font-bold text-[#C9A84C] hover:underline">
                              Ver receta completa → Hazte premium
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-aubergine-dark/10 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-aubergine-dark/20" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-aubergine-dark/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="¿Cómo te sientes? (ej: cansado, estresado...)"
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-cream border border-aubergine-dark/15 text-sm font-light text-aubergine-dark focus:outline-none focus:border-aubergine focus:shadow-Luxury transition-all"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-aubergine-dark text-white rounded-xl flex items-center justify-center hover:bg-aubergine transition-colors disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-center text-aubergine-dark/30 mt-3 font-medium uppercase tracking-[0.15em]">
                Sugerencias basadas en el catálogo real
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
