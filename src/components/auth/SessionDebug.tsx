"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SessionDebug() {
  const [sessionInfo, setSessionInfo] = useState<{
    exists: boolean;
    email: string | null;
    id: string | null;
    loading: boolean;
  }>({
    exists: false,
    email: null,
    id: null,
    loading: true,
  });

  const checkSession = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setSessionInfo({
        exists: true,
        email: user.email || "No email",
        id: user.id,
        loading: false,
      });
    } else {
      setSessionInfo({
        exists: false,
        email: null,
        id: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkSession();

    // Set up a real-time listener for any auth state change (login/logout/token refresh)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      console.log("🔔 Auth State Change Detected:", _event);
      if (session?.user) {
        setSessionInfo({
          exists: true,
          email: session.user.email || "No email",
          id: session.user.id,
          loading: false,
        });
      } else {
        setSessionInfo({
          exists: false,
          email: null,
          id: null,
          loading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[280px] p-5 bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] border-2 border-aubergine-dark/10 rounded-3xl text-left font-mono text-[10px] animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-[#C9A84C]">
          Debug: Supabase Auth
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      
      {sessionInfo.loading ? (
        <p className="text-aubergine-dark/40 italic">Verificando sesión...</p>
      ) : (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-aubergine-dark/5">
            <span className="text-aubergine-dark/40">Sessión activa:</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${sessionInfo.exists ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {sessionInfo.exists ? "CONECTADO" : "DESCONECTADO"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-aubergine-dark/40 block">Email:</span>
            <span className="text-aubergine-dark/80 line-clamp-1">{sessionInfo.email || "(no detectado)"}</span>
          </div>
          <div className="space-y-1">
            <span className="text-aubergine-dark/40 block">User ID:</span>
            <span className="text-aubergine-dark/80 text-[8px] break-all">{sessionInfo.id || "(no detectado)"}</span>
          </div>
          <button 
            onClick={checkSession}
            className="w-full mt-4 py-2.5 bg-aubergine-dark hover:bg-aubergine-dark/90 text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            Refrescar check
          </button>
        </div>
      )}
    </div>
  );
}
