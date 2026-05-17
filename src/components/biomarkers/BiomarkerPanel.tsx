"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BiomarkerStatus = {
  connected: string[];
  metrics: {
    hrv?: number;
    sleep_h?: number;
    resting_hr?: number;
    glucose_mean?: number;
  };
};

const PROVIDERS = [
  { id: "oura",   label: "Oura",   emoji: "💍" },
  { id: "whoop",  label: "Whoop",  emoji: "⌚" },
  { id: "fitbit", label: "Fitbit", emoji: "📊" },
] as const;

const METRICS = [
  { key: "hrv",        label: "HRV",       unit: "ms",  description: "Variabilidad cardíaca" },
  { key: "sleep_h",    label: "Sueño",     unit: "h",   description: "Media 7 días" },
  { key: "resting_hr", label: "FC reposo", unit: "bpm", description: "Frecuencia basal" },
] as const;

export function BiomarkerPanel() {
  const [status, setStatus] = useState<BiomarkerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/biomarkers/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: [], metrics: {} }))
      .finally(() => setLoading(false));
  }, []);

  const hasMetrics = status && Object.keys(status.metrics).length > 0;
  const hasConnections = status && status.connected.length > 0;

  if (loading) {
    return (
      <div className="max-w-[520px] w-full mx-auto rounded-3xl p-6 bg-white border border-aubergine-dark/5 shadow-sm animate-pulse">
        <div className="h-3 bg-gray-100 rounded w-32 mb-4" />
        <div className="h-16 bg-gray-50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-[520px] w-full mx-auto rounded-3xl overflow-hidden"
      style={{ backgroundColor: "#120a0e", border: "1px solid rgba(201,168,76,0.15)" }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#C9A84C" }}>
            Biomarcadores
          </p>
          <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
            {hasConnections ? "Datos de los últimos 7 días" : "Conecta tu wearable"}
          </p>
        </div>
        <span className="text-xl">📡</span>
      </div>

      {/* Métricas */}
      {hasMetrics && (
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          {METRICS.map(({ key, label, unit, description }) => {
            const value = status?.metrics[key as keyof typeof status.metrics];
            if (value == null) return null;
            return (
              <div
                key={key}
                className="rounded-2xl p-3 flex flex-col gap-1"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {label}
                </span>
                <span className="text-xl font-serif font-black" style={{ color: "#C9A84C" }}>
                  {key === "sleep_h" ? value.toFixed(1) : Math.round(value)}
                  <span className="text-xs font-sans font-light ml-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}>{unit}</span>
                </span>
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {description}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Proveedores */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        {PROVIDERS.map(({ id, label, emoji }) => {
          const connected = status?.connected.includes(id);
          return (
            <div
              key={id}
              className="flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ backgroundColor: connected ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{emoji}</span>
                <span className="text-sm font-medium" style={{ color: connected ? "#C9A84C" : "rgba(255,255,255,0.55)" }}>
                  {label}
                </span>
              </div>
              {connected ? (
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                  Conectado
                </span>
              ) : (
                <Link
                  href={`/api/biomarkers/connect/${id}`}
                  className="text-[11px] font-medium px-3 py-1 rounded-full transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Conectar →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
