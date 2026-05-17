"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { n: 1, text: 'Ve a', link: { href: "https://cloud.ouraring.com/user/settings#data-access", label: "cloud.ouraring.com → Ajustes" } },
  { n: 2, text: 'Baja hasta la sección "Personal Access Tokens"', link: null },
  { n: 3, text: 'Pulsa "Create New Personal Access Token", ponle un nombre (p.ej. "FoodMood") y copia el token', link: null },
  { n: 4, text: 'Pégalo aquí abajo', link: null },
];

export default function WearablesPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/biomarkers/connect-pat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setState("ok");
        setTimeout(() => router.push("/dashboard?biomarker_connected=oura"), 1800);
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setErrorMsg(data.error ?? "Error desconocido");
        setState("error");
      }
    } catch {
      setErrorMsg("Error de red. Inténtalo de nuevo.");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0d0709" }}>
      <div className="w-full max-w-[480px] space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-4xl">💍</span>
          <h1 className="text-2xl font-serif font-black" style={{ color: "#F5F0E8" }}>
            Conecta tu Oura Ring
          </h1>
          <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.5)" }}>
            Sin crear ninguna cuenta de desarrollador. Solo un token personal.
          </p>
        </div>

        {/* Steps */}
        <ol className="space-y-4">
          {STEPS.map(({ n, text, link }) => (
            <li key={n} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
              >
                {n}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {text}{" "}
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: "#C9A84C" }}
                  >
                    {link.label}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ol>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              Tu Personal Access Token de Oura
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              required
              disabled={state === "loading" || state === "ok"}
              className="w-full rounded-2xl px-4 py-3 text-sm font-mono outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F5F0E8",
              }}
            />
          </div>

          {state === "error" && (
            <p className="text-sm rounded-xl px-4 py-3"
              style={{ backgroundColor: "rgba(255,80,80,0.1)", color: "#ff9090" }}>
              {errorMsg}
            </p>
          )}

          {state === "ok" ? (
            <div className="text-center py-4">
              <p className="text-base font-semibold" style={{ color: "#C9A84C" }}>
                ¡Oura conectado! Redirigiendo...
              </p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={state === "loading" || !token.trim()}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: "#C9A84C", color: "#120a0e" }}
            >
              {state === "loading" ? "Verificando..." : "Conectar Oura Ring"}
            </button>
          )}
        </form>

        <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          Tu token se cifra con AES-256 antes de guardarse. Nunca lo compartimos.
        </p>
      </div>
    </main>
  );
}
