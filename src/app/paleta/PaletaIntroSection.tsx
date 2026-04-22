"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CALMA_C = "#8BB5A8";
const MELAN_C = "#8B7FA8";
const SIN_C   = "#D4A87A";

const ORB_CSS = `
  @keyframes palOrbSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes palOrbRev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  .pal-spin-a { animation:palOrbSpin 40s linear infinite; transform-origin:160px 160px; }
  .pal-spin-b { animation:palOrbRev  28s linear infinite; transform-origin:160px 160px; }
  .pal-spin-c { animation:palOrbSpin 55s linear infinite reverse; transform-origin:160px 160px; }
`;

function BarFill({ color, width, delay }: { color: string; width: string; delay: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      height: "100%",
      borderRadius: 9999,
      width: go ? width : "0%",
      backgroundColor: color,
      transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
    }} />
  );
}

const BENEFITS = [
  {
    bg: CALMA_C + "33", stroke: CALMA_C,
    title: "Menos estrés en el cuerpo",
    desc: "Identificar tus emociones reduce la respuesta al estrés y mejora tu bienestar físico.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.5A2.5 2.5 0 0 1 12 5a2.5 2.5 0 0 1-2.5-2.5V2z"/>
        <path d="M9 5.5C5.5 5.5 3 8 3 11.5c0 2 .8 3.7 2 5 .7.7 1 1.7 1 2.5v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1c0-.8.3-1.8 1-2.5 1.2-1.3 2-3 2-5C21 8 18.5 5.5 15 5.5"/>
        <path d="M9 15h6M10 18h4"/>
      </svg>
    ),
  },
  {
    bg: MELAN_C + "33", stroke: MELAN_C,
    title: "Mejor toma de decisiones",
    desc: "Cuando sabes cómo estás repartido, actúas desde la claridad, no desde el ruido.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="14" width="4" height="7" rx="1"/>
        <rect x="10" y="9" width="4" height="12" rx="1"/>
        <rect x="17" y="4" width="4" height="17" rx="1"/>
        <path d="M5 14 10 9 14 11 19 4" strokeOpacity="0.5"/>
      </svg>
    ),
  },
  {
    bg: SIN_C + "33", stroke: SIN_C,
    title: "Comer más consciente",
    desc: "La nutrición emocional empieza por saber qué sientes antes de abrir la nevera.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11c0-4.4 3.6-8 8-8s8 3.6 8 8v1H3v-1z"/>
        <path d="M2 12h20"/>
        <path d="M12 12v8"/>
        <path d="M8 20h8"/>
        <path d="M7 7.5C8 6 10 5.5 12 6"/>
      </svg>
    ),
  },
];

const BARS = [
  { name: "Calma",          pct: "60%", w: "60%", color: CALMA_C, delay: 600 },
  { name: "Melancolía",     pct: "25%", w: "25%", color: MELAN_C, delay: 800 },
  { name: "Sin nombre aún", pct: "15%", w: "15%", color: SIN_C,   delay: 1000, nameColor: SIN_C },
];

export function PaletaIntroSection() {
  return (
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#F5F0E8" }}>
      <style dangerouslySetInnerHTML={{ __html: ORB_CSS }} />

      <div className="max-w-4xl mx-auto flex flex-col gap-0">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
          className="mb-14"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: CALMA_C }}>
            food·mood · inteligencia emocional
          </p>
          <h1
            className="font-serif font-light leading-[1.05] tracking-tight mb-5 max-w-[560px]"
            style={{ fontSize: "clamp(42px,6vw,68px)", color: "#2d0f16" }}
          >
            Una forma distinta de{" "}
            <em style={{ fontStyle: "italic", color: MELAN_C }}>entenderte</em>
          </h1>
          <p className="text-base font-light leading-[1.7] max-w-[440px]" style={{ color: "#5C5750" }}>
            No eres &ldquo;triste&rdquo;. Eres una{" "}
            <strong style={{ color: "#2d0f16", fontWeight: 500 }}>mezcla única</strong>.<br />
            Hoy quizá seas un 60% calma, un 25% melancolía y un 15% de algo que
            aún no tiene nombre. Eso es normal — y tiene más información de lo que parece.
          </p>
        </motion.div>

        {/* ── MAIN VISUAL: orbe + result card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
          className="grid md:grid-cols-2 gap-10 items-center mb-16"
        >
          {/* ORB */}
          <div className="relative flex items-center justify-center py-10 px-10 md:px-0">
            {/* Calma */}
            <motion.div
              className="absolute flex items-center gap-2 bg-white rounded-full shadow-lg z-10"
              style={{ top: 8, left: -8, padding: "8px 16px 8px 10px", whiteSpace: "nowrap" }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CALMA_C }} />
              <span className="font-serif text-[19px] font-medium leading-none" style={{ color: CALMA_C }}>60%</span>
              <span className="text-[11px] uppercase tracking-wider font-light" style={{ color: "#5C5750" }}>Calma</span>
            </motion.div>

            {/* Melancolía */}
            <motion.div
              className="absolute flex items-center gap-2 bg-white rounded-full shadow-lg z-10"
              style={{ bottom: 30, left: -12, padding: "8px 16px 8px 10px", whiteSpace: "nowrap" }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: MELAN_C }} />
              <span className="font-serif text-[19px] font-medium leading-none" style={{ color: MELAN_C }}>25%</span>
              <span className="text-[11px] uppercase tracking-wider font-light" style={{ color: "#5C5750" }}>Melancolía</span>
            </motion.div>

            {/* Sin nombre — wrapper handles -50% centering, motion handles float */}
            <div className="absolute z-10" style={{ top: "50%", right: -8, transform: "translateY(-50%)" }}>
              <motion.div
                className="flex items-center gap-2 bg-white rounded-full shadow-lg"
                style={{ padding: "8px 16px 8px 10px", whiteSpace: "nowrap" }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SIN_C }} />
                <span className="font-serif text-[19px] font-medium leading-none" style={{ color: SIN_C }}>15%</span>
                <span className="text-[11px] uppercase tracking-wider font-light" style={{ color: "#5C5750" }}>Sin nombre aún</span>
              </motion.div>
            </div>

            <svg
              width="320" height="320" viewBox="0 0 320 320" fill="none"
              style={{ filter: "drop-shadow(0 20px 60px rgba(139,181,168,0.25))", overflow: "visible" }}
            >
              <defs>
                <filter id="palB1" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="18"/>
                </filter>
                <filter id="palB2" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="12"/>
                </filter>
                <clipPath id="palC"><circle cx="160" cy="160" r="130"/></clipPath>
              </defs>

              <circle cx="160" cy="160" r="150" stroke="rgba(44,42,38,0.06)" strokeWidth="1"/>
              <circle cx="160" cy="160" r="140" stroke="rgba(44,42,38,0.04)" strokeWidth="1" strokeDasharray="4 8"/>

              <g clipPath="url(#palC)">
                <g className="pal-spin-a">
                  <ellipse cx="140" cy="130" rx="120" ry="110" fill={CALMA_C} opacity="0.75" filter="url(#palB1)"/>
                </g>
                <g className="pal-spin-b">
                  <ellipse cx="130" cy="210" rx="90" ry="80" fill={MELAN_C} opacity="0.70" filter="url(#palB2)"/>
                </g>
                <g className="pal-spin-c">
                  <ellipse cx="215" cy="170" rx="75" ry="65" fill={SIN_C} opacity="0.65" filter="url(#palB2)"/>
                </g>
                <ellipse cx="145" cy="135" rx="45" ry="35" fill="white" opacity="0.22"/>
              </g>

              <circle cx="160" cy="160" r="130" stroke="rgba(44,42,38,0.08)" strokeWidth="1.5"/>
              <text x="160" y="154" textAnchor="middle" fontSize="13" fill="rgba(44,42,38,0.5)" letterSpacing="2" fontFamily="Georgia, serif">TU MEZCLA</text>
              <text x="160" y="172" textAnchor="middle" fontSize="13" fill="rgba(44,42,38,0.5)" letterSpacing="2" fontFamily="Georgia, serif">HOY</text>
            </svg>
          </div>

          {/* RESULT CARD */}
          <div className="bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, ${CALMA_C}, ${MELAN_C}, ${SIN_C})` }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "#9B9690" }}>
              Así se ve tu resultado — ejemplo real
            </p>

            <div className="flex flex-col gap-3.5 mb-7">
              {BARS.map(bar => (
                <div key={bar.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif text-[17px]" style={{ color: bar.nameColor ?? "#2d0f16" }}>
                      {bar.name}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#5C5750" }}>{bar.pct}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(44,42,38,0.07)" }}>
                    <BarFill color={bar.color} width={bar.w} delay={bar.delay} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 border-t" style={{ borderColor: "rgba(44,42,38,0.08)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: "#9B9690" }}>
                Recetas para este estado
              </p>
              <div className="flex flex-wrap gap-2">
                {["Kéfir con fresas", "Ensalada de wakame", "Infusión de pasiflora"].map(r => (
                  <span
                    key={r}
                    className="px-3.5 py-1.5 rounded-full text-xs border"
                    style={{ backgroundColor: "#F5F0E8", color: "#5C5750", borderColor: "rgba(44,42,38,0.08)" }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── INSIGHT QUOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="rounded-3xl px-8 md:px-12 py-12 mb-12 relative overflow-hidden"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <span
            className="absolute right-8 -top-5 font-serif leading-none pointer-events-none select-none"
            style={{ fontSize: 200, color: "rgba(255,255,255,0.04)" }}
          >
            &ldquo;
          </span>
          <p
            className="font-serif font-light italic leading-[1.55] max-w-[620px] mb-6"
            style={{ fontSize: "clamp(20px,2.5vw,27px)", color: "#FDFAF6" }}
          >
            No eres &ldquo;dramática&rdquo; ni &ldquo;demasiado sensible&rdquo;.<br />
            Eres una{" "}
            <em style={{ fontStyle: "normal", color: "#ffffff" }}>mezcla que cambia cada día</em>
            {" "}— y eso es normal.
          </p>
          <p className="text-sm font-light leading-[1.7] max-w-[540px]" style={{ color: "rgba(253,250,246,0.5)" }}>
            Cuando consigues ponerle nombre exacto a esa mezcla, algo cambia: sabes si necesitas
            descanso, si necesitas moverte, si necesitas hablar con alguien, o si simplemente
            necesitas{" "}
            <strong style={{ color: "rgba(253,250,246,0.85)", fontWeight: 500 }}>
              comer algo que te nutra de verdad
            </strong>.
          </p>
        </motion.div>

        {/* ── BENEFITS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {BENEFITS.map(b => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-7 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: b.bg, color: b.stroke }}
              >
                {b.icon}
              </div>
              <p className="font-serif text-[18px] leading-[1.2]" style={{ color: "#2d0f16" }}>{b.title}</p>
              <p className="text-[13px] font-light leading-[1.6]" style={{ color: "#5C5750" }}>{b.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* ── CTA (existing, functional) ── */}
        <div
          className="flex flex-col sm:flex-row gap-6 p-8 rounded-2xl items-center justify-between"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "#C9A84C" }}>
              Empieza ahora
            </p>
            <p className="font-serif text-lg font-light leading-snug" style={{ color: "#F7F0E6" }}>
              Descubre tu <em>mezcla emocional</em> de hoy — y las recetas que le corresponden.
            </p>
          </div>
          <Link
            href="/test"
            className="inline-flex items-center justify-center px-7 py-4 rounded-full font-semibold text-sm shrink-0 transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg whitespace-nowrap"
            style={{ backgroundColor: "#C9A84C", color: "#2d0f16" }}
          >
            Descubrir mi paleta →
          </Link>
        </div>

      </div>
    </section>
  );
}
