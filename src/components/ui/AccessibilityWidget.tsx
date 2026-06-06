"use client"

import { useState, useEffect } from "react"
import { Eye, Moon, Type } from "lucide-react"

type Theme    = "dark"  | "light"
type FontSize = "large" | "normal"
type Contrast = "high"  | "normal"

function applyAttr(key: string, value: string | null) {
  const html = document.documentElement
  if (value) html.setAttribute(key, value)
  else        html.removeAttribute(key)
}

export function AccessibilityWidget() {
  const [open,     setOpen]     = useState(false)
  const [theme,    setTheme]    = useState<Theme>("light")
  const [fontSize, setFontSize] = useState<FontSize>("normal")
  const [contrast, setContrast] = useState<Contrast>("normal")

  useEffect(() => {
    try {
      const t = localStorage.getItem("fm-theme")    as Theme    | null
      const f = localStorage.getItem("fm-font-size") as FontSize | null
      const c = localStorage.getItem("fm-contrast")  as Contrast | null
      if (t === "dark")   setTheme("dark")
      if (f === "large")  setFontSize("large")
      if (c === "high")   setContrast("high")
    } catch {}
  }, [])

  function toggle(
    current: string,
    on: string,
    off: string,
    htmlKey: string,
    lsKey: string,
    setter: (v: any) => void,
  ) {
    const next = current === on ? off : on
    setter(next)
    applyAttr(htmlKey, next === on ? on : null)
    if (next === on) localStorage.setItem(lsKey, on)
    else             localStorage.removeItem(lsKey)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[9990]"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Opciones de accesibilidad"
          aria-modal="true"
          className="fixed z-[9999] rounded-2xl shadow-2xl p-5 w-68"
          style={{
            bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
            left: 16,
            width: 264,
            backgroundColor: "#fff",
            border: "1px solid rgba(63,26,34,0.1)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "rgba(63,26,34,0.4)" }}
          >
            Accesibilidad
          </p>

          <div className="space-y-2">
            <AccessToggle
              icon={<Moon className="w-4 h-4" />}
              label="Modo oscuro"
              active={theme === "dark"}
              onToggle={() =>
                toggle(theme, "dark", "light", "data-theme", "fm-theme", setTheme)
              }
            />
            <AccessToggle
              icon={<Type className="w-4 h-4" />}
              label="Letra grande"
              active={fontSize === "large"}
              onToggle={() =>
                toggle(fontSize, "large", "normal", "data-font-size", "fm-font-size", setFontSize)
              }
            />
            <AccessToggle
              icon={<Eye className="w-4 h-4" />}
              label="Contraste alto"
              active={contrast === "high"}
              onToggle={() =>
                toggle(contrast, "high", "normal", "data-contrast", "fm-contrast", setContrast)
              }
            />
          </div>

          <p
            className="text-[10px] text-center mt-4 leading-relaxed"
            style={{ color: "rgba(63,26,34,0.35)" }}
          >
            WCAG 2.1 · Si necesitas más ayuda,{" "}
            <a
              href="mailto:info@food-mood.app"
              className="underline underline-offset-2"
              style={{ color: "#FF6B35" }}
            >
              escríbenos
            </a>
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed z-[9999] rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
          left: 16,
          width: 44,
          height: 44,
          backgroundColor: "#fff",
          border: "1px solid rgba(63,26,34,0.12)",
          boxShadow: "0 2px 8px rgba(63,26,34,0.12)",
          color: "#3F1A22",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="1" />
          <path d="m9 9 3 3v7" />
          <path d="m6 12 3-3 4 1" />
          <path d="m15 9-2 2" />
          <path d="m9 21 1.5-4" />
          <path d="m15 21-1.5-4" />
        </svg>
      </button>
    </>
  )
}

function AccessToggle({
  icon,
  label,
  active,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left"
      style={{
        backgroundColor: active ? "#6B2737" : "rgba(245,240,232,0.8)",
        color: active ? "#F5F0E8" : "#3F1A22",
      }}
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium flex-1">{label}</span>

      {/* Toggle pill */}
      <span
        className="relative shrink-0 rounded-full transition-colors"
        style={{
          width: 32,
          height: 18,
          backgroundColor: active ? "rgba(255,255,255,0.3)" : "rgba(63,26,34,0.15)",
        }}
      >
        <span
          className="absolute top-[3px] rounded-full bg-white transition-all"
          style={{
            width: 12,
            height: 12,
            left: active ? 17 : 3,
          }}
        />
      </span>
    </button>
  )
}
