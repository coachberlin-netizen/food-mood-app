"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed or already granted
    const dismissed = localStorage.getItem("push_banner_dismissed");
    if (dismissed) return;

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("push_banner_dismissed", "true");
  };

  const handleSubscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Register SW and get subscription
        const registration = await navigator.serviceWorker.register("/sw.js");
        
        // Wait for SW to be ready
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            });
        }

        // Send to backend
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription)
        });

        setIsVisible(false);
        localStorage.setItem("push_banner_dismissed", "true");
        alert("¡Notificaciones activadas! Te avisaremos cada mañana.");
      } else {
        handleDismiss();
      }
    } catch (err) {
      console.error("Error subscribing to push:", err);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-aubergine-dark text-cream p-5 rounded-2xl shadow-luxury border border-[#C9A84C]/20 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-sm font-semibold">¿Quieres tu receta diaria?</p>
              <p className="text-[11px] text-cream/50 font-light mt-0.5">Recibe un recordatorio cada mañana.</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-cream/30 hover:text-cream">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSubscribe}
            className="flex-1 bg-[#C9A84C] hover:bg-[#b8953e] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            S\u00ed, act\u00edvalo
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/5 hover:bg-white/10 text-cream/70 text-xs font-medium py-2.5 rounded-xl transition-colors"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
