"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, PlusSquare, ArrowUp, Monitor, Smartphone, Download } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other" | null>(null);

  useEffect(() => {
    // 1. Detect platform
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);
    
    if (isIOS) setPlatform("ios");
    else if (isAndroid) setPlatform("android");
    else setPlatform("other");

    // 2. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) {
      return;
    }

    // 3. Android/Chrome prompt listener
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show if not dismissed
      if (localStorage.getItem("pwa-prompt-dismissed") !== "true") {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 4. iOS Fallback visibility
    if (isIOS && localStorage.getItem("pwa-prompt-dismissed") !== "true") {
      // Small delay to not annoy immediately
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 md:p-6 md:pb-10"
      >
        <div className="max-w-md mx-auto bg-aubergine-dark/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-2 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 shadow-inner">
                <span className="text-gold font-serif font-black text-xl">FM</span>
              </div>
              <div>
                <h3 className="text-white font-serif text-lg font-bold leading-tight">Food·Mood PWA</h3>
                <p className="text-white/50 text-xs font-medium tracking-wide">Experiencia nativa completa</p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {platform === "ios" ? (
              <div className="space-y-4">
                <p className="text-white/80 text-sm leading-relaxed font-light">
                  Añade Food·Mood a tu pantalla de inicio para acceso instantáneo y pantalla completa:
                </p>
                <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                      <Share className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-xs">1. Pulsa el botón <strong>Compartir</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                      <PlusSquare className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-xs">2. Selecciona <strong>Añadir a pantalla de inicio</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80 text-sm leading-relaxed font-light">
                  Instala la aplicación para recibir recetas recomendadas y un rendimiento optimizado, igual que una app nativa.
                </p>
                <button
                  onClick={handleInstall}
                  className="w-full bg-gold hover:bg-gold/90 text-aubergine-dark font-bold py-4 rounded-2xl transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2 group"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Instalar App
                </button>
              </div>
            )}
          </div>

          {/* Footer Decoration */}
          <div className="h-1 w-24 bg-white/10 mx-auto mb-4 rounded-full opacity-50" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
