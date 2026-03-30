"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    if (localStorage.getItem("pwa-banner-dismissed") === "true") {
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Provide an iOS fallback detection since beforeinstallprompt is Safari-limited
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    // We optionally show the banner for iOS users who aren't in standalone mode
    if (isIOS && !isStandalone && !localStorage.getItem("pwa-banner-dismissed")) {
      setIsVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // If it's iOS and no deferred prompt exists, alert them on how to install
      alert("Para instalar en iOS: presiona el ícono de 'Compartir' en la barra inferior y luego selecciona 'Añadir a la pantalla de inicio'.");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
      >
        <div className="bg-aubergine-dark rounded-2xl shadow-luxury-hover p-4 flex items-center justify-between text-white border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cream/10 rounded-xl flex items-center justify-center font-serif text-gold font-bold">
              FM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Food·Mood</span>
              <span className="text-xs text-white/60">Instala la app en tu móvil</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-gold hover:bg-gold/90 text-aubergine-dark font-medium text-xs px-4 py-2 rounded-full transition-colors"
            >
              Instalar
            </button>
            <button 
              onClick={handleDismiss}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
