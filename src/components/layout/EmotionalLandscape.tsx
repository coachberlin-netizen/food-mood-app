"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

type MoodDetail = {
  id: string;
  nombre: string;
  color: string;
  microText: string;
  neurotransmitters: string;
  foods: string;
};

const MOODS: MoodDetail[] = [
  {
    id: "activacion",
    nombre: "Activación",
    color: "#E8703A",
    microText: "Estás encendida. Lo que comas ahora puede sostener ese ritmo — o tirarlo por tierra a las 4 de la tarde.",
    neurotransmitters: "Energía mental + respuesta rápida",
    foods: "Proteína completa, omega-3, adaptógenos (ashwagandha, rhodiola)",
  },
  {
    id: "calma",
    nombre: "Calma",
    color: "#5A9B8A",
    microText: "Modo absorción total. Tu cuerpo está receptivo — es el mejor momento para darle lo bueno de verdad.",
    neurotransmitters: "Calma + bienestar",
    foods: "Fermentados (kéfir, miso), magnesio (semillas de calabaza), triptófano (pavo, huevo)",
  },
  {
    id: "focus",
    nombre: "Foco",
    color: "#4A7AB5",
    microText: "Tu cerebro quiere rendir. Hay alimentos que le dan exactamente lo que necesita para no fallar.",
    neurotransmitters: "Memoria + concentración",
    foods: "Huevo, pescado azul, nueces, vinagre de kombucha",
  },
  {
    id: "social",
    nombre: "Social",
    color: "#C04878",
    microText: "Quieres conectar. Algunos sabores y rituales hacen que estar con gente sea todavía mejor.",
    neurotransmitters: "Vínculo + placer compartido",
    foods: "Frutos rojos, cacao puro, shrubs y bebidas fermentadas compartidas",
  },
  {
    id: "reset",
    nombre: "Restauración",
    color: "#7A5AAA",
    microText: "Necesitas parar. Tu cuerpo lo sabe antes que tú — hay alimentos que lo ayudan a soltar.",
    neurotransmitters: "Limpieza celular + antiinflamación",
    foods: "Cúrcuma, brócoli y crucíferas, caldo de huesos, ayuno intermitente suave",
  },
  {
    id: "confort",
    nombre: "Confort",
    color: "#C8902A",
    microText: "Necesitas que algo te abrace por dentro. Eso también es nutrición — y tiene su propia ciencia.",
    neurotransmitters: "Placer + bienestar",
    foods: "Papaya, plátano, cacao, fermentados cálidos (sopa de miso, kéfir tibio)",
  },
];

const MoodIcon = ({ id, color }: { id: string; color: string }) => {
  const paths: Record<string, React.ReactNode> = {
    activacion: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />,
    calma: (
      <>
        <path d="M2 12c5-5 15 5 20 0" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17c5-5 15 5 20 0" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    focus: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </>
    ),
    social: <path d="M18 8a3 3 0 10-6 0 3 3 0 006 0zM6 15a3 3 0 100-6 3 3 0 000 6zM21 19a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />,
    reset: (
      <>
        <path d="M20 11a8.1 8.1 0 00-15.5-2m-.5 5v-5h5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 13a8.1 8.1 0 0015.5 2m.5-5v5h-5" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    confort: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
    >
      {paths[id]}
    </svg>
  );
};

export function EmotionalLandscape() {
  const [openMood, setOpenMood] = useState<string | null>(null);

  const toggle = (id: string) => setOpenMood(openMood === id ? null : id);

  return (
    <section id="estados" className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-aubergine/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-sans tracking-[0.3em] uppercase text-aubergine-dark/40 mb-6 font-bold"
          >
            Seis estados. Seis maneras de comer.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-[1.1]"
          >
            Lo que sientes hoy{" "}
            <br />
            <span className="italic font-light">
              cambia lo que tu cuerpo necesita.
            </span>
          </motion.h2>
          <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Toca cada estado y mira qué pasa dentro — y qué comer para que tu cuerpo vaya contigo.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {MOODS.map((mood, idx) => {
            const isOpen = openMood === mood.id;
            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
              >
                <button
                  onClick={() => toggle(mood.id)}
                  className="w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: isOpen ? `${mood.color}40` : "rgba(63,26,34,0.08)",
                    backgroundColor: isOpen ? `${mood.color}08` : "rgba(255,255,255,0.5)",
                  }}
                >
                  {/* Card header — always visible */}
                  <div className="flex items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${mood.color}18` }}
                      >
                        <MoodIcon id={mood.id} color={mood.color} />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-aubergine-dark leading-tight">
                          {mood.nombre}
                        </h3>
                        <p className="text-xs text-aubergine-dark/50 font-light mt-0.5">
                          {mood.microText}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 text-aubergine-dark/40 shrink-0 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t" style={{ borderColor: `${mood.color}20` }}>
                      <div className="grid md:grid-cols-2 gap-6 mt-5">
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: mood.color }}
                          >
                            Cómo funciona en tu cuerpo
                          </p>
                          <p className="text-sm font-semibold text-aubergine-dark">
                            {mood.neurotransmitters}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: mood.color }}
                          >
                            Alimentos clave
                          </p>
                          <p className="text-sm text-aubergine-dark/80 font-light leading-relaxed">
                            {mood.foods}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl overflow-hidden"
          style={{ backgroundColor: "#2d0f16" }}
        >
          <div className="px-8 md:px-14 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "#FF6B35" }}
              >
                Comunidad gratuita
              </p>
              <p className="font-serif text-2xl md:text-3xl text-[#F5F0E8] leading-[1.3] font-light">
                Newsletter semanal, podcast y contenido curado — síguenos en Telegram y WhatsApp, gratis.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="https://t.me/foodmoodapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#229ED9" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Unirse en Telegram
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbCEhFoCsU9LDcPX362R"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Seguir en WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
