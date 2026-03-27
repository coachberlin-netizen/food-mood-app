"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WaitlistForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, source: 'website' })
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Error al procesar la solicitud');
        }
        
        setSubmitted(true);
        if (data.message === '¡Gracias por unirte!' && waitlistCount !== null) {
          setWaitlistCount(waitlistCount + 1);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="space-y-3"
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white/10 border border-navy/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-navy dark:text-white placeholder-navy/40 dark:placeholder-white/40"
                placeholder="Tu nombre"
              />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-navy/20 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-medium text-navy dark:text-white placeholder-navy/40 dark:placeholder-white/40"
                placeholder="tu@email.com"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-navy hover:bg-amber-300 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Unirme a la lista de espera <Send className="w-4 h-4" /></>}
            </button>
            <p className="text-center text-xs text-navy/60 dark:text-white/60 font-medium mt-2">
              Únete a las <strong className="text-amber-500">{waitlistCount !== null ? waitlistCount : '...'} personas</strong> que ya están en la lista.
            </p>
          </motion.form>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-1">¡Estás en la lista!</h3>
            <p className="text-sm text-green-700/80 dark:text-green-400/80">
              Te avisaremos en cuanto Food·Mood lance su próxima versión. {waitlistCount !== null && `Eres el #${waitlistCount}.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
