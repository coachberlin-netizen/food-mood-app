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

        {/* Eyebrow */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 block"
          style={{ color: "#C9A84C" }}
        >
          La herramienta de autorregulación más potente que existe
        </p>

        {/* H1 */}
        <h1 className="font-serif text-4xl md:text-6xl text-[#2d0f16] leading-[1.15] mb-8">
          No eres{" "}
          <span className="italic font-light">&ldquo;triste&rdquo;</span>.{" "}
          <br className="hidden md:block" />
          Eres un{" "}
          <span
            className="inline-block px-3 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "#5A9B8A" }}
          >
            60% calma
          </span>
          ,{" "}
          <span
            className="inline-block px-3 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "#4A7AB5" }}
          >
            25% melancolía
          </span>{" "}
          y un{" "}
          <span
            className="inline-block px-3 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "#C04878" }}
          >
            15%
          </span>{" "}
          de algo que aún no tiene nombre.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#6B2737]/70 font-serif italic leading-relaxed max-w-3xl mb-16">
          &ldquo;Por qué el espectro emocional continuo es la herramienta de
          autorregulación más potente que existe — y casi nadie la usa.&rdquo;
        </p>

        {/* Explanatory box */}
        <div className="bg-white rounded-3xl border border-[#6B2737]/8 p-8 md:p-12 mb-12 shadow-sm">
          <h2 className="font-serif text-2xl md:text-3xl text-[#2d0f16] mb-5">
            Cuanto más preciso eres con lo que sientes, menos lo sufres.
          </h2>
          <p className="text-[#4a3a3a]/80 font-light leading-relaxed mb-8 text-base md:text-lg">
            Cuanto más exacto eres al describir lo que sientes, menos te afecta.
            No es intuición — está probado científicamente. Cuando le pones un
            nombre concreto a una emoción, la parte de tu cerebro que dispara el
            miedo se calma sola. La diferencia entre decir{" "}
            <em>"estoy mal"</em> y decir{" "}
            <em>"tengo ese cansancio de hacer cosas que no me apetecen"</em> es
            real: menos estrés en el cuerpo, mejores decisiones, más calma.
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

        {/* Spectrum visualizer */}
        <div className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]/40 mb-5">
            Espectros emocionales — pulsa para explorar
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
              <strong className="font-semibold text-[#6B2737]">Lisa Feldman Barrett</strong>{" "}
              es investigadora del cerebro en Harvard. Descubrió que las personas que saben
              describir con exactitud lo que sienten sufren menos — literalmente tienen menos
              estrés físico en el cuerpo.{" "}
              <strong className="font-semibold text-[#6B2737]">Matthew Lieberman</strong>,
              psicólogo de UCLA, lo confirmó en laboratorio: cuando le pones nombre
              concreto a una emoción, la parte de tu cerebro que dispara el miedo se calma
              sola.
            </p>
            <p className="text-sm font-light text-[#4a3a3a]/70 leading-relaxed">
              En Food·Mood lo aplicamos de una forma diferente: en lugar de decirte qué
              emoción tienes, te mostramos tu mezcla real en porcentajes. Porque{" "}
              <em>"estoy triste"</em> es una etiqueta que cierra.{" "}
              <em>"60% calma, 25% melancolía, 15% curiosidad"</em> es un mapa que abre —
              y con ese mapa puedes decidir qué comer y cómo cuidarte de verdad.
            </p>
          </div>
        </details>

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
