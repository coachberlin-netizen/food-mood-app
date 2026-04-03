"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────── */
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RecetaCard {
  id: string;
  nombre_es: string;
  mood_es: string;
  imagen_url: string | null;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  messageCount: number;
  detectedMood: string | null;
  recetas: RecetaCard[];
  userId: string | null;
  isPremium: boolean;
  authChecked: boolean;
}

const MAX_FREE_MESSAGES = 5;

const MOOD_EMOJI: Record<string, string> = {
  "Activación & Energía": "⚡",
  "Calma & Equilibrio": "🌿",
  "Focus & Claridad Mental": "🧠",
  "Social & Placer Compartido": "🥂",
  "Reset & Ligereza": "🍋",
  "Confort & Calidez": "🫶",
};

const MOOD_COLOR: Record<string, string> = {
  "Activación & Energía": "#D97706",
  "Calma & Equilibrio": "#6B8E6B",
  "Focus & Claridad Mental": "#0D9488",
  "Social & Placer Compartido": "#BE185D",
  "Reset & Ligereza": "#65A30D",
  "Confort & Calidez": "#C2714F",
};

export function ChatWidget() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isOpen: false,
    isLoading: false,
    messageCount: 0,
    detectedMood: null,
    recetas: [],
    userId: null,
    isPremium: false,
    authChecked: false,
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_premium")
            .eq("id", session.user.id)
            .single();
          setState(s => ({
            ...s,
            userId: session.user.id,
            isPremium: !!profile?.is_premium,
            authChecked: true,
          }));
        } else {
          setState(s => ({ ...s, authChecked: true }));
        }
      } catch {
        setState(s => ({ ...s, authChecked: true }));
      }
    }
    checkAuth();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [state.isOpen]);

  const toggleChat = useCallback(() => {
    setState(s => {
      const opening = !s.isOpen;
      return {
        ...s,
        isOpen: opening,
        // Add welcome message on first open
        messages: opening && s.messages.length === 0
          ? [{ role: "assistant" as const, content: "¡Hola! 👋 Soy tu asistente Food·Mood. ¿Cómo te sientes hoy?" }]
          : s.messages,
      };
    });
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || state.isLoading) return;

    // Check message limit for non-authenticated users
    if (!state.userId && state.messageCount >= MAX_FREE_MESSAGES) {
      setState(s => ({
        ...s,
        messages: [...s.messages, {
          role: "assistant",
          content: "Para seguir chateando, crea tu cuenta gratis. ¡Solo toma 30 segundos! 🚀",
        }],
      }));
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...state.messages, userMsg];

    setState(s => ({
      ...s,
      messages: newMessages,
      isLoading: true,
      messageCount: s.messageCount + 1,
    }));
    setInput("");

    try {
      // Only send user/assistant messages (not the system welcome)
      const apiMessages = newMessages
        .filter(m => m.role === "user" || (m.role === "assistant" && newMessages.indexOf(m) > 0))
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          userId: state.userId,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setState(s => ({
          ...s,
          messages: [...s.messages, { role: "assistant", content: "Lo siento, ha ocurrido un error. ¿Puedes intentarlo de nuevo?" }],
          isLoading: false,
        }));
        return;
      }

      setState(s => ({
        ...s,
        messages: [...s.messages, { role: "assistant", content: data.reply }],
        isLoading: false,
        detectedMood: data.mood || s.detectedMood,
        recetas: data.recetas || s.recetas,
      }));
    } catch {
      setState(s => ({
        ...s,
        messages: [...s.messages, { role: "assistant", content: "Error de conexión. Inténtalo de nuevo." }],
        isLoading: false,
      }));
    }
  }, [input, state]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const moodEmoji = state.detectedMood ? MOOD_EMOJI[state.detectedMood] || "✨" : null;
  const moodColor = state.detectedMood ? MOOD_COLOR[state.detectedMood] || "#C9A84C" : null;

  return (
    <>
      {/* ── Floating Button ──────────────────────── */}
      <AnimatePresence>
        {!state.isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-aubergine-dark text-cream shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center group"
            aria-label="Abrir chat"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Pulse */}
            <span className="absolute inset-0 rounded-full bg-aubergine-dark/30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Label below button */}
      <AnimatePresence>
        {!state.isOpen && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-1 right-4 z-50 pointer-events-none"
          >
            <span className="text-[10px] font-medium text-aubergine-dark/50 bg-cream/90 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
              💬 ¿Cómo te sientes?
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ───────────────────────────── */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-cream rounded-2xl shadow-2xl border border-aubergine-dark/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-aubergine-dark text-cream rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cream/15 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Food·Mood IA</h3>
                  <p className="text-[10px] text-cream/50">Asistente emocional</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="w-8 h-8 rounded-full hover:bg-cream/10 flex items-center justify-center transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {state.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-aubergine-dark text-cream rounded-br-md"
                        : "bg-aubergine-dark/5 text-aubergine-dark rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading dots */}
              {state.isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-aubergine-dark/5 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-aubergine-dark/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-aubergine-dark/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-aubergine-dark/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              {/* ── Mood Detected + Recipes ────── */}
              {state.detectedMood && state.recetas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 pt-2"
                >
                  {/* Mood badge */}
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: moodColor || "#C9A84C", backgroundColor: `${moodColor}18` }}
                    >
                      {moodEmoji} {state.detectedMood}
                    </span>
                  </div>

                  {/* Recipe cards */}
                  {state.recetas.map((r) => (
                    <Link key={r.id} href={`/recetas/${r.id}`}>
                      <div className="bg-white rounded-xl border border-aubergine-dark/8 p-3 hover:border-aubergine-dark/20 transition-all cursor-pointer group">
                        <p className="text-[12px] font-serif font-semibold text-aubergine-dark group-hover:text-aubergine transition-colors leading-snug">
                          {r.nombre_es}
                        </p>
                        <span
                          className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          style={{ color: moodColor || "#666", backgroundColor: `${moodColor}12` }}
                        >
                          {moodEmoji} {r.mood_es}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {/* CTA */}
                  <div className="pt-1">
                    {state.isPremium ? (
                      <Link href="/dashboard">
                        <button className="w-full py-2.5 rounded-xl bg-aubergine-dark text-cream text-[12px] font-semibold hover:bg-aubergine-dark/90 transition-colors flex items-center justify-center gap-1.5">
                          Ver mi dashboard <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    ) : (
                      <Link href="/pricing">
                        <button className="w-full py-2.5 rounded-xl bg-[#C9A84C] text-white text-[12px] font-semibold hover:bg-[#b8953e] transition-colors flex items-center justify-center gap-1.5">
                          Ver plan completo <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Auth prompt for free users at limit */}
              {!state.userId && state.messageCount >= MAX_FREE_MESSAGES && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                  <Link href="/auth/register">
                    <button className="w-full py-2.5 rounded-xl bg-aubergine-dark text-cream text-[12px] font-semibold hover:bg-aubergine-dark/90 transition-colors">
                      Crear cuenta gratis →
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-aubergine-dark/5">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-aubergine-dark/10 px-3 py-2 focus-within:border-aubergine-dark/25 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={state.detectedMood ? "¿Algo más?" : "Cuéntame cómo te sientes..."}
                  disabled={state.isLoading}
                  className="flex-1 text-[13px] text-aubergine-dark placeholder:text-aubergine-dark/30 bg-transparent outline-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || state.isLoading}
                  className="w-8 h-8 rounded-lg bg-aubergine-dark text-cream flex items-center justify-center disabled:opacity-30 hover:bg-aubergine-dark/90 transition-all shrink-0"
                >
                  {state.isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {!state.userId && (
                <p className="text-[9px] text-aubergine-dark/30 text-center mt-1.5">
                  {MAX_FREE_MESSAGES - state.messageCount > 0
                    ? `${MAX_FREE_MESSAGES - state.messageCount} mensajes restantes`
                    : "Crea tu cuenta para seguir"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
