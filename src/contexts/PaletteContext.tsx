"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculatePalette, type PaletteResult } from "@/lib/emotional-palette";

export type { PaletteResult };

interface PaletteContextType {
  currentPalette: PaletteResult | null;
  isLoading: boolean;
  refreshPalette: () => Promise<void>;
}

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<PaletteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchLatestPalette = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCurrentPalette(null);
        return;
      }

      // Fetch latest palette within the last 24 hours
      const { data, error } = await supabase
        .from("emotional_palettes")
        .select("*")
        .eq("user_id", session.user.id)
        .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setCurrentPalette(null);
      } else {
        // Reconstruct common palette result using stored dimensions
        const result = calculatePalette({
          energia: data.energia,
          serenidad: data.serenidad,
          claridad: data.claridad,
          conexion: data.conexion,
        });
        setCurrentPalette(result);
      }
    } catch (err) {
      console.error("Error fetching palette from context:", err);
      setCurrentPalette(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLatestPalette();
  }, [fetchLatestPalette]);

  return (
    <PaletteContext.Provider 
      value={{ 
        currentPalette, 
        isLoading, 
        refreshPalette: fetchLatestPalette 
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}
