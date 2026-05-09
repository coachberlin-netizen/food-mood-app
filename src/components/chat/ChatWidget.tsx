"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, ChefHat, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import Link from "next/link";

type AccessState = 'idle' | 'loading' | 'unauthenticated' | 'no-subscription' | 'subscribed';

const DAILY_LIMIT = 20;

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [accessState, setAccessState] = useState<AccessState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const { resultMood } = useQuizStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Server-side entitlement check every time the widget opens
  useEffect(() => {
    if (!isOpen) return;
    setAccessState('loading');

    fetch('/api/ai/entitlement')
      .then(async res => {
        if (res.status === 401) { setAccessState('unauthenticated'); return; }
        const data = await res.json();
        if (data.canUseAI) {
          setAccessState('subscribed');
          setMessagesRemaining(data.messagesRemaining ?? DAILY_LIMIT);
        } else {
          setAccessState('no-subscription');
        }
      })
      .catch(() => setAccessState('unauthenticated'));
  }, [isOpen]);

  // Greeting — only when subscribed and conversation is fresh
  useEffect(() => {
    if (accessState !== 'subscribed' || messages.length > 0) return;
    const moodLabel = typeof resultMood === 'string' ? resultMood.toUpperCase() : null;
    const greeting = moodLabel
      ? `Veo que hoy estás en modo ${moodLabel}. ¿Cómo te encuentras? ¿Quieres que te oriente con una receta o un hábito?`
      : "Hola, soy tu asistente Food·Mood. ¿Cómo te encuentras hoy?";
    setMessages([{ role: "assistant", content: greeting }]);
  }, [accessState, resultMood]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading || accessState !== 'subscribed') return;
    if (messagesRemaining !== null && messagesRemaining <= 0) return;

    const userMsg = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      // Server enforces auth/subscription — update state if access changes mid-session
      if (res.status === 401) { setAccessState('unauthenticated'); return; }
      if (res.status === 403) { setAccessState('no-subscription'); return; }

      if (res.status === 429) {
        setMessagesRemaining(0);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Has alcanzado tu límite de 20 mensajes diarios. Vuelve mañana para continuar. 🌙",
        }]);
        return;
      }

      const data = await res.json();

      if (typeof data.messagesRemaining === 'number') {
        setMessagesRemaining(data.messagesRemaining);
      }

      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Lo siento, ha habido un problema. Por favor, inténtalo de nuevo.",
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, accessState, messages, messagesRemaining]);

  const handleClose = () => {
    setIsOpen(false);
    setInput("");
  };

  const limitReached = messagesRemaining !== null && messagesRemaining <= 0;

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
            <div className="bg-aubergine-dark p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center border border-[#C9A84C]/30">
                  <ChefHat className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-cream text-sm font-bold">Asistente Food·Mood</h3>
                  <p className="text-cream/50 text-[10px] uppercase tracking-widest">En línea</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-cream/40 hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Loading ── */}
            {accessState === 'loading' && (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-aubergine-dark/20" />
              </div>
            )}

            {/* ── Unauthenticated ── */}
            {accessState === 'unauthenticated' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
                <div className="w-12 h-12 rounded-full bg-aubergine-dark/5 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-aubergine-dark/30" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-aubergine-dark text-lg leading-tight">
                    Entra para usar tu asistente Food·Mood
                  </h4>
                  <p className="text-sm font-light text-aubergine-dark/55 leading-relaxed">
                    Crea tu cuenta o inicia sesión para acceder a tu espacio Food·Mood.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="px-7 py-3 bg-aubergine-dark text-white rounded-2xl text-sm font-semibold hover:bg-aubergine transition-colors"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

            {/* ── No subscription ── */}
            {accessState === 'no-subscription' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
                  <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-aubergine-dark text-lg leading-tight">
                    Desbloquea tu asistente Food·Mood
                  </h4>
                  <p className="text-sm font-light text-aubergine-dark/55 leading-relaxed">
                    El asistente IA está incluido en la suscripción Food·Mood. Suscríbete para recibir orientación personalizada sobre recetas, hábitos y bienestar emocional.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="px-7 py-3 rounded-2xl text-sm font-semibold transition-colors text-white"
                  style={{ backgroundColor: '#C9A84C' }}
                >
                  Suscribirme
                </Link>
              </div>
            )}

            {/* ── Subscribed: full chat ── */}
            {accessState === 'subscribed' && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-light leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-aubergine text-white rounded-tr-none"
                          : "bg-white border border-aubergine-dark/10 text-aubergine-dark/80 rounded-tl-none shadow-sm"
                      }`}>
                        {msg.content}
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
                <div className="p-4 bg-white border-t border-aubergine-dark/10 shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={limitReached ? "Límite diario alcanzado" : "¿Cómo te sientes? (ej: cansado, estresado...)"}
                      className="w-full pl-4 pr-12 py-3 rounded-2xl bg-cream border border-aubergine-dark/15 text-sm font-light text-aubergine-dark focus:outline-none focus:border-aubergine transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSend()}
                      maxLength={1000}
                      disabled={limitReached}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading || limitReached}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-aubergine-dark text-white rounded-xl flex items-center justify-center hover:bg-aubergine transition-colors disabled:opacity-30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Counter */}
                  <p className="text-[9px] text-center mt-3 font-medium uppercase tracking-[0.15em]"
                    style={{ color: limitReached ? '#C9A84C' : 'rgba(45,15,22,0.3)' }}>
                    {limitReached
                      ? 'Límite diario alcanzado — Vuelve mañana'
                      : messagesRemaining !== null
                        ? `${messagesRemaining} de ${DAILY_LIMIT} mensajes restantes hoy`
                        : 'Asistente IA · Food·Mood'}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
