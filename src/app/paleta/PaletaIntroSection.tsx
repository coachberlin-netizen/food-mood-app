"use client";

import React, { useState } from "react";
import Link from "next/link";

type Segment = { name: string; pct: number; color: string };
type BarData = { label: string; segments: Segment[] };

const BARS: BarData[] = [
  {
    label: "Un día de calma matizada",
    segments: [
      { name: "Calma", pct: 60, color: "#5A9B8A" },
      { name: "Melancolía", pct: 25, color: "#4A7AB5" },
      { name: "Sin nombre", pct: 15, color: "#C04878" },
    ],
  },
  {
    label: "Una mañana de alta intensidad",
    segments: [
      { name: "Activación", pct: 45, color: "#E8703A" },
      { name: "Ansiedad leve", pct: 35, color: "#7A5AAA" },
      { name: "Curiosidad", pct: 20, color: "#5A9B8A" },
    ],
  },
  {
    label: "Una tarde de introspección",
    segments: [
      { name: "Confort", pct: 70, color: "#C8902A" },
      { name: "Nostalgia", pct: 20, color: "#4A7AB5" },
      { name: "Alegría quieta", pct: 10, color: "#5A9B8A" },
    ],
  },
];

function GranularityBar({
  bar,
  active,
  onClick,
}: {
  bar: BarData;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <div
        className={`rounded-2xl border transition-all duration-300 p-4 ${
          active
            ? "border-[#6B2737]/25 shadow-md bg-white"
            : "border-[#e8e0d8] bg-[#F5F0E8]/60 hover:bg-white hover:border-[#6B2737]/10"
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]/50 mb-3">
          {bar.label}
        </p>
        <div className="flex rounded-full overflow-hidden h-7">
          {bar.segments.map((s) => (
            <div
              key={s.name}
              style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              className="transition-all duration-500"
            />
          ))}
        </div>
        {active && (
          <div className="flex flex-wrap gap-4 mt-3">
            {bar.segments.map((s) => (
              <span
                key={s.name}
                className="flex items-center gap-1.5 text-xs font-medium text-[#3a2a2a]"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                {s.pct}% {s.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

export function PaletaIntroSection() {
  const [activeBar, setActiveBar] = useState<number | null>(0);

  return (
    <section className="bg-[#F5F0E8] py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb + skip link */}
        <nav aria-label="Migas de pan" className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-light transition-colors hover:opacity-80"
            style={{ color: "rgba(107,39,55,0.4)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Food·Mood
          </Link>
          <Link
            href="/paleta?test=1"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "#C9A84C" }}
          >
            Ir al test →
          </Link>
        </nav>

        {/* Eyebrow */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 block"
          style={{ color: "#C9A84C" }}
        >
          Una forma distinta de entenderte
        </p>

        {/* H1 */}
        <h1 className="font-serif text-4xl md:text-6xl text-[#2d0f16] leading-[1.15] mb-8">
          No eres{" "}
          <span className="italic font-light">&ldquo;triste&rdquo;</span>.{" "}
          <br className="hidden md:block" />
          Eres una mezcla única.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#6B2737]/70 font-serif font-light leading-relaxed max-w-3xl mb-16">
          Hoy quizá seas un{" "}
          <span className="inline-block px-2 py-0.5 rounded-full text-white text-base" style={{ backgroundColor: "#5A9B8A" }}>60% calma</span>
          , un{" "}
          <span className="inline-block px-2 py-0.5 rounded-full text-white text-base" style={{ backgroundColor: "#4A7AB5" }}>25% melancolía</span>
          {" "}y un{" "}
          <span className="inline-block px-2 py-0.5 rounded-full text-white text-base" style={{ backgroundColor: "#C04878" }}>15%</span>
          {" "}de algo que aún no tiene nombre. Eso es normal — y tiene más información de lo que parece.
        </p>

        {/* Static palette mockup — show don't tell */}
        <div className="mb-12 rounded-2xl bg-white border border-[#6B2737]/8 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(107,39,55,0.35)" }}>
              Así se ve tu resultado — ejemplo real
            </p>
            <div className="flex rounded-full overflow-hidden h-8 mb-4">
              <div style={{ width: "60%", backgroundColor: "#5A9B8A" }} />
              <div style={{ width: "25%", backgroundColor: "#4A7AB5" }} />
              <div style={{ width: "15%", backgroundColor: "#C04878" }} />
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { pct: "60%", label: "Calma", color: "#5A9B8A" },
                { pct: "25%", label: "Melancolía", color: "#4A7AB5" },
                { pct: "15%", label: "Sin nombre aún", color: "#C04878" },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 text-sm font-medium text-[#3a2a2a]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 inline-block" style={{ backgroundColor: s.color }} />
                  {s.pct} {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(107,39,55,0.06)", backgroundColor: "rgba(245,240,232,0.4)" }}>
            <p className="text-xs font-light" style={{ color: "rgba(107,39,55,0.5)" }}>
              Recetas para este estado:{" "}
              <span className="font-medium" style={{ color: "rgba(107,39,55,0.7)" }}>
                Kéfir con fresas · Ensalada de wakame · Infusión de pasiflora
              </span>
            </p>
          </div>
        </div>

        {/* Explanatory box */}
        <div className="bg-white rounded-3xl border border-[#6B2737]/8 p-8 md:p-12 mb-12 shadow-sm">
          <h2 className="font-serif text-2xl md:text-3xl text-[#2d0f16] mb-5">
            Cuanto más específico eres con lo que sientes, más fácil es hacer algo al respecto.
          </h2>
          <p className="text-[#4a3a3a]/80 font-light leading-relaxed mb-8 text-base md:text-lg">
            No eres &ldquo;triste&rdquo;, &ldquo;dramática&rdquo; o &ldquo;demasiado sensible&rdquo;.
            Eres una mezcla que cambia cada día — y eso es normal.{" "}
            Cuando consigues ponerle nombre exacto a esa mezcla, algo cambia:
            sabes si necesitas descanso, si necesitas moverte, si necesitas hablar con alguien, o si simplemente necesitas comer algo que te nutra de verdad.{" "}
            No hace falta que sea complicado. Empieza con una sola pregunta:{" "}
            <em>&ldquo;¿cómo estoy repartido emocionalmente ahora mismo?&rdquo;</em>.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: "🧠", text: "Menos estrés en el cuerpo" },
              { emoji: "📊", text: "Mejor toma de decisiones" },
              { emoji: "🍽", text: "Comer más consciente" },
            ].map((card) => (
              <div
                key={card.text}
                className="rounded-2xl p-5 flex items-center gap-3"
                style={{ backgroundColor: "#F5F0E8" }}
              >
                <span className="text-2xl shrink-0">{card.emoji}</span>
                <p className="text-sm font-semibold text-[#2d0f16]">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mid-page conversion CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-14 p-6 rounded-2xl" style={{ backgroundColor: "#2d0f16" }}>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: "#C9A84C" }}>Empieza ahora</p>
            <p className="font-serif text-lg text-white font-light leading-snug">
              Descubre tu mezcla emocional de hoy — y las recetas que le corresponden.
            </p>
          </div>
          <Link
            href="/test"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm shrink-0 transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: "#C9A84C", color: "#2d0f16" }}
          >
            Descubrir mi paleta →
          </Link>
        </div>

        {/* Spectrum visualizer */}
        <div className="mb-14" role="group" aria-labelledby="espectros-label">
          <p id="espectros-label" className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]/40 mb-5 flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 3a1.5 1.5 0 0 1 3 0v7.5h2.25A2.25 2.25 0 0 1 21 12.75v1.5a4.5 4.5 0 0 1-4.5 4.5h-3a4.5 4.5 0 0 1-4.5-4.5V9a1.5 1.5 0 0 1 3 0v2.25H13.5V3Z"/></svg>
            Toca cada espectro para ver los porcentajes
          </p>
          <div className="space-y-3">
            {BARS.map((bar, i) => (
              <GranularityBar
                key={i}
                bar={bar}
                active={activeBar === i}
                onClick={() => setActiveBar(activeBar === i ? null : i)}
              />
            ))}
          </div>
          <p className="text-xs text-[#6B2737]/45 font-light mt-5 leading-relaxed">
            En Food·Mood el test de estado te muestra tu espectro real — no una
            etiqueta, sino porcentajes.
          </p>
          <Link
            href="#estados"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#6B2737" }}
          >
            ¿Qué comer para cada estado? Explora los 6 estados →
          </Link>
        </div>

        {/* Accordion ciencia */}
        <details className="mb-14 rounded-3xl border border-[#6B2737]/8 overflow-hidden group" open={typeof window !== "undefined" && window.innerWidth >= 768 ? true : undefined}>
          <summary className="cursor-pointer px-8 py-6 bg-[#F5F0E8]/60 hover:bg-[#F5F0E8] transition-colors list-none flex items-center justify-between gap-4">
            <span className="font-serif italic text-xl text-[#2d0f16]">
              ¿Por qué funciona esto? La ciencia, en sencillo.
            </span>
            <svg className="w-4 h-4 text-[#6B2737]/40 shrink-0 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="px-8 py-8 bg-white" style={{ maxWidth: "65ch", margin: "0 auto" }}>
            <p className="text-sm font-light text-[#4a3a3a]/70 leading-relaxed mb-5">
              <a
                href="https://www.lisafeldmanbarrett.com/books/how-emotions-are-made/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-[#6B2737]/20 hover:decoration-[#6B2737]/60 transition-all"
                style={{ color: "#6B2737" }}
              >
                Lisa Feldman Barrett
              </a>{" "}
              (neurocientífica, Northeastern University) descubrió que las personas que saben
              describir con exactitud lo que sienten sufren menos — literalmente tienen menos
              estrés físico en el cuerpo.{" "}
              <a
                href="https://www.scn.ucla.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-[#6B2737]/20 hover:decoration-[#6B2737]/60 transition-all"
                style={{ color: "#6B2737" }}
              >
                Matthew Lieberman
              </a>{" "}
              (psicólogo, UCLA) lo confirmó en laboratorio: cuando le pones nombre
              concreto a una emoción, la parte de tu cerebro que dispara el miedo se calma
              sola.{" "}
              <cite className="not-italic text-[#4a3a3a]/40 text-xs">
                Lieberman et al., <em>Psychological Science</em>, 2007.
              </cite>
            </p>
            <p className="text-sm font-light text-[#4a3a3a]/70 leading-relaxed">
              En Food·Mood lo aplicamos de una forma diferente: en lugar de decirte qué
              emoción tienes, te mostramos tu mezcla real en porcentajes. Porque{" "}
              <em>&ldquo;estoy triste&rdquo;</em> es una etiqueta que cierra.{" "}
              <em>&ldquo;60% calma, 25% melancolía, 15% curiosidad&rdquo;</em> es un mapa que abre —
              y con ese mapa puedes decidir qué comer y cómo cuidarte de verdad.
            </p>
          </div>
        </details>

        {/* Bibliografía */}
        <div className="mb-14 pt-10 border-t" style={{ borderColor: "rgba(107,39,55,0.08)" }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(107,39,55,0.3)" }}>
            Referencias científicas
          </p>
          <ul className="space-y-2">
            {[
              { authors: "Barrett, L.F.", year: "2017", title: "How Emotions Are Made", pub: "Houghton Mifflin Harcourt" },
              { authors: "Lieberman, M.D. et al.", year: "2007", title: "Putting Feelings Into Words", pub: "Psychological Science, 18(5), 421–428" },
              { authors: "Cryan, J.F. et al.", year: "2019", title: "The Microbiota-Gut-Brain Axis", pub: "Physiological Reviews, 99(4), 1877–2013" },
              { authors: "Yano, J.M. et al.", year: "2015", title: "Indigenous Bacteria from the Gut Microbiota Regulate Host Serotonin Biosynthesis", pub: "Cell, 161(2), 264–276" },
            ].map((ref) => (
              <li key={ref.title} className="text-[11px] font-light leading-relaxed" style={{ color: "rgba(74,58,58,0.45)" }}>
                {ref.authors} ({ref.year}). <cite className="not-italic font-medium">{ref.title}</cite>. {ref.pub}.
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/test"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-base transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: "#6B2737" }}
          >
            Descubrir mi espectro hoy →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:bg-[#6B2737]/5"
            style={{ borderColor: "#6B2737", color: "#6B2737" }}
          >
            Club WhatsApp Premium
          </Link>
        </div>
      </div>
    </section>
  );
}
