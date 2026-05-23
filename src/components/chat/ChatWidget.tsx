"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, ChefHat, Lock, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/useQuizStore";
import Link from "next/link";

type AccessState = "idle" | "loading" | "unauthenticated" | "no-subscription" | "subscribed";

const DAILY_LIMIT = 20;
// Counter only appears when this many messages or fewer remain
const COUNTER_WARN_THRESHOLD = 5;

const QUICK_REPLIES = [
  "Recomiéndame una receta para ahora",
  "Tengo niebla mental",
  "No dormí bien",
  "Tengo un sofoco",
  "¿Qué puedo comer para sentirme mejor?",
];

interface Message {
  role: "assistant" | "user";
  content: string;
}

// Detect SpeechRecognition support (cast to any — browser API, not in TS lib by default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpeechRecognition(): (new () => any) | null {
  if (typeof window === "undefined") return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen]                   = useState(false);
  const [accessState, setAccessState]         = useState<AccessState>("idle");
  const [messages, setMessages]               = useState<Message[]>([]);
  const [input, setInput]                     = useState("");
  const [loading, setLoading]                 = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [isListening, setIsListening]         = useState(false);
  const [voiceSupported, setVoiceSupported]   = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef                        = useRef<any>(null);
  const { resultMood }                        = useQuizStore();
  const scrollRef                             = useRef<HTMLDivElement>(null);
  const inputRef                              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVoiceSupported(getSpeechRecognition() !== null);
  }, []);

  // Server-side entitlement check every time the widget opens
  useEffect(() => {
    if (!isOpen) return;
    setAccessState("loading");

    fetch("/api/ai/entitlement")
      .then(async (res) => {
        if (res.status === 401) { setAccessState("unauthenticated"); return; }
        const data = await res.json();
        if (data.canUseAI) {
          setAccessState("subscribed");
          setMessagesRemaining(data.messagesRemaining ?? DAILY_LIMIT);
        } else {
          setAccessState("no-subscription");
        }
      })
      .catch(() => setAccessState("unauthenticated"));
  }, [isOpen]);

  // Greeting — only when subscribed and conversation is fresh
  useEffect(() => {
    if (accessState !== "subscribed" || messages.length > 0) return;
    const moodLabel = typeof resultMood === "string" ? resultMood : null;
    const greeting = moodLabel
      ? `Veo que hoy estás en modo ${moodLabel.toUpperCase()}. ¿Cómo te encuentras?`
      : "Hola, soy tu asistente Food·Mood. ¿Cómo te encuentras hoy?";
    setMessages([{ role: "assistant", content: greeting }]);
  }, [accessState, resultMood]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || loading || accessState !== "subscribed") return;
      if (messagesRemaining !== null && messagesRemaining <= 0) return;

      const newMessages: Message[] = [...messages, { role: "user", content: text }];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (res.status === 401) { setAccessState("unauthenticated"); return; }
        if (res.status === 403) { setAccessState("no-subscription"); return; }

        if (res.status === 429) {
          setMessagesRemaining(0);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Por hoy hemos llegado al límite. Vuelve mañana para continuar. 🌙" },
          ]);
          return;
        }

        const data = await res.json();
        if (typeof data.messagesRemaining === "number") {
          setMessagesRemaining(data.messagesRemaining);
        }
        if (data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Ha habido un problema. Por favor, inténtalo de nuevo." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, accessState, messages, messagesRemaining],
  );

  const startVoice = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
      // Auto-focus input so user can review before sending
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [isListening]);

  const handleClose = () => {
    recognitionRef.current?.stop();
    setIsOpen(false);
    setInput("");
    setIsListening(false);
  };

  const limitReached    = messagesRemaining !== null && messagesRemaining <= 0;
  const showCounter     = !limitReached && messagesRemaining !== null && messagesRemaining <= COUNTER_WARN_THRESHOLD;
  // Quick replies visible only before the user has sent anything
  const showQuickReplies = accessState === "subscribed" && messages.length === 1 && !loading;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente Food·Mood"}
        aria-expanded={isOpen}
        className="fixed right-4 sm:right-6 w-14 h-14 bg-aubergine-dark text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group border border-white/10"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
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
            role="dialog"
            aria-label="Asistente Food·Mood"
            aria-modal="true"
            className="fixed right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] bg-cream border border-aubergine-dark/15 rounded-[2rem] shadow-luxury flex flex-col overflow-hidden z-[60] backdrop-blur-sm"
            style={{
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)",
              maxHeight: "min(520px, calc(100dvh - 10rem))",
            }}
          >
            {/* Header */}
            <div className="bg-aubergine-dark p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C9A84C]/20 flex items-center justify-center border border-[#C9A84C]/30">
                  <ChefHat className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="text-cream text-sm font-bold">Asistente Food·Mood</h3>
                  <p className="text-cream/40 text-[10px] uppercase tracking-widest">IA · Nutrición funcional</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Cerrar"
                className="text-cream/40 hover:text-cream transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Loading ── */}
            {accessState === "loading" && (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-aubergine-dark/20" />
              </div>
            )}

            {/* ── Unauthenticated ── */}
            {accessState === "unauthenticated" && (
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
                  href="/auth/login"
                  className="px-7 py-3 bg-aubergine-dark text-white rounded-2xl text-sm font-semibold hover:bg-aubergine transition-colors"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

            {/* ── No subscription ── */}
            {accessState === "no-subscription" && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center border border-[#C9A84C]/20">
                  <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-black text-aubergine-dark text-lg leading-tight">
                    Desbloquea tu asistente Food·Mood
                  </h4>
                  <p className="text-sm font-light text-aubergine-dark/55 leading-relaxed">
                    El asistente IA está incluido en la suscripción premium. Orientación personalizada sobre recetas, síntomas y hábitos.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="px-7 py-3 rounded-2xl text-sm font-semibold transition-colors text-white"
                  style={{ backgroundColor: "#C9A84C" }}
                >
                  Ver planes
                </Link>
              </div>
            )}

            {/* ── Subscribed: full chat ── */}
            {accessState === "subscribed" && (
              <>
                {/* Messages */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 scrollbar-hide"
                >
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-aubergine text-white rounded-tr-none"
                            : "bg-white border border-aubergine-dark/10 text-aubergine-dark/80 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-aubergine-dark/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-aubergine-dark/25" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick replies — shown only before first user message */}
                <AnimatePresence>
                  {showQuickReplies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-2 flex flex-wrap gap-2 shrink-0"
                    >
                      {QUICK_REPLIES.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleSend(reply)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all active:scale-95 hover:opacity-80 text-left"
                          style={{
                            backgroundColor: "rgba(107,39,55,0.06)",
                            borderColor: "rgba(107,39,55,0.15)",
                            color: "#3F1A22",
                          }}
                        >
                          {reply}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <div className="p-4 bg-white border-t border-aubergine-dark/10 shrink-0">
                  <div className="relative flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={
                        limitReached
                          ? "Límite diario alcanzado"
                          : isListening
                          ? "Escuchando…"
                          : "Escribe o habla…"
                      }
                      className="flex-1 pl-4 pr-3 py-3 rounded-2xl bg-cream border border-aubergine-dark/15 text-sm font-light text-aubergine-dark focus:outline-none focus:border-aubergine transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ fontSize: "16px" }}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      maxLength={1000}
                      disabled={limitReached}
                      aria-label="Mensaje al asistente"
                    />

                    {/* Voice button */}
                    {voiceSupported && !limitReached && (
                      <button
                        onClick={startVoice}
                        aria-label={isListening ? "Parar grabación" : "Hablar"}
                        aria-pressed={isListening}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                        style={{
                          backgroundColor: isListening
                            ? "rgba(201,168,76,0.15)"
                            : "rgba(63,26,34,0.07)",
                          color: isListening ? "#C9A84C" : "rgba(63,26,34,0.4)",
                          border: isListening
                            ? "1px solid rgba(201,168,76,0.4)"
                            : "1px solid transparent",
                        }}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {/* Send button */}
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || loading || limitReached}
                      aria-label="Enviar mensaje"
                      className="w-10 h-10 bg-aubergine-dark text-white rounded-xl flex items-center justify-center hover:bg-aubergine transition-colors disabled:opacity-30 shrink-0 active:scale-90"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Counter — only visible when ≤5 remaining */}
                  {showCounter && (
                    <p
                      className="text-[10px] text-center mt-2 font-medium"
                      style={{ color: messagesRemaining! <= 2 ? "#C9A84C" : "rgba(45,15,22,0.3)" }}
                    >
                      {messagesRemaining} {messagesRemaining === 1 ? "pregunta" : "preguntas"} restantes hoy
                    </p>
                  )}
                  {limitReached && (
                    <p className="text-[10px] text-center mt-2 font-medium" style={{ color: "#C9A84C" }}>
                      Límite diario alcanzado — Vuelve mañana 🌙
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
