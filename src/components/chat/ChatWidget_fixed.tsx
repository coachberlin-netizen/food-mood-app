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
          // FIX: mensaje más accionable con CTA a pricing
          content: "¡Me alegra que hayamos hablado! 🌿 Para ver tu plan Food·Mood personalizado y acceder a todas las recetas, crea tu cuenta gratis. ¡Solo toma 30 segundos! 🚀",
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
      {!state.isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-aubergine-dark text-cream flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
          {/* Pulse */}
          <span className="absolute inset-0 rounded-full bg-aubergine-dark/30 animate-ping" />
        </button>
      )}

      {/* Label below button */}
      {!state.isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-2 right-4 z-50 text-xs text-aubergine-dark/60 font-medium"
        >
          💬 ¿Cómo te sientes?
        </button>
      )}

      {/* ── Chat Panel ───────────────────────────── */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] max-h-[560px] bg-cream rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-aubergine-dark/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-aubergine-dark text-cream">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <div>
                  <p className="text-sm font-semibold">Food·Mood IA</p>
                  <p className="text-xs opacity-70">Asistente emocional</p>
                </div>
              </div>
              <button onClick={toggleChat} className="hover:opacity-70 transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {state.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm rounded-xl px-3 py-2 max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-aubergine-dark text-cream ml-auto"
                      : "bg-white text-aubergine-dark border border-aubergine-dark/10"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {/* Loading dots */}
              {state.isLoading && (
                <div className="bg-white border border-aubergine-dark/10 rounded-xl px-3 py-2 w-16 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-aubergine-dark/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-aubergine-dark/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-aubergine-dark/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}

              {/* ── Mood Detected + Recipes ────── */}
              {state.detectedMood && state.recetas.length > 0 && (
                <div className="space-y-2 pt-1">
                  {/* Mood badge */}
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: moodColor || "#C9A84C" }}
                  >
                    {moodEmoji} {state.detectedMood}
                  </div>

                  {/* Recipe cards */}
                  {state.recetas.map((r) => (
                    <Link
                      key={r.id}
                      href={`/recetas/${r.id}`}
                      className="block bg-white border border-aubergine-dark/10 rounded-xl p-3 hover:border-aubergine-dark/30 transition-colors"
                    >
                      <p className="text-xs font-semibold text-aubergine-dark">{r.nombre_es}</p>
                      <p className="text-xs text-aubergine-dark/50 mt-0.5">{moodEmoji} {r.mood_es}</p>
                    </Link>
                  ))}

                  {/* CTA */}
                  <div className="pt-1">
                    {state.isPremium ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-aubergine-dark text-cream rounded-xl py-2.5 hover:bg-aubergine-dark/90 transition-colors"
                      >
                        Ver mi dashboard <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      // FIX: CTA va a pricing, no al test
                      <Link
                        href="/pricing"
                        className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-aubergine-dark text-cream rounded-xl py-2.5 hover:bg-aubergine-dark/90 transition-colors"
                      >
                        Ver plan completo <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Auth prompt for free users at limit */}
              {!state.userId && state.messageCount >= MAX_FREE_MESSAGES && (
                <div className="pt-1">
                  {/* FIX: redirige a login con redirect=/pricing, no al test */}
                  <Link
                    href="/auth/login?redirect=/pricing"
                    className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold bg-aubergine-dark text-cream rounded-xl py-2.5 hover:bg-aubergine-dark/90 transition-colors"
                  >
                    Crear cuenta gratis → <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-aubergine-dark/10 flex items-center gap-2">
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
                disabled={state.isLoading || !input.trim()}
                className="text-aubergine-dark/60 hover:text-aubergine-dark disabled:opacity-30 transition-colors"
              >
                {state.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {!state.userId && (
              <p className="text-center text-[10px] text-aubergine-dark/30 pb-2">
                {MAX_FREE_MESSAGES - state.messageCount > 0
                  ? `${MAX_FREE_MESSAGES - state.messageCount} mensajes restantes`
                  : "Crea tu cuenta para seguir"}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
