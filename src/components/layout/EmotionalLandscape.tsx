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
    microText: "Tienes pila. Tu cuerpo pide alimentos que mantengan ese ritmo sin dejarte caer después.",
    neurotransmitters: "Energía mental + respuesta rápida",
    foods: "Proteína completa, omega-3, adaptógenos (ashwagandha, rhodiola)",
  },
  {
    id: "calma",
    nombre: "Calma",
    color: "#5A9B8A",
    microText: "Estás tranquila. Es el mejor momento para que tu cuerpo absorba bien todo lo que comes.",
    neurotransmitters: "Calma + bienestar",
    foods: "Fermentados (kéfir, miso), magnesio (semillas de calabaza), triptófano (pavo, huevo)",
  },
  {
    id: "focus",
    nombre: "Focus",
    color: "#4A7AB5",
    microText: "Necesitas que tu cabeza funcione. Hay alimentos que literalmente alimentan las neuronas.",
    neurotransmitters: "Memoria + concentración",
    foods: "Huevo, pescado azul, nueces, vinagre de kombucha",
  },
  {
    id: "social",
    nombre: "Social",
    color: "#C04878",
    microText: "Modo compartir activado. Algunos sabores y rituales hacen que conectar con los demás sea aún mejor.",
    neurotransmitters: "Vínculo + placer compartido",
    foods: "Frutos rojos, cacao puro, shrubs y bebidas fermentadas compartidas",
  },
  {
    id: "reset",
    nombre: "Reset",
    color: "#7A5AAA",
    microText: "Tu cuerpo pide pausa y limpieza. Alimentos que ayudan a tu hígado y te dejan respirar.",
    neurotransmitters: "Limpieza celular + antiinflamación",
    foods: "Cúrcuma, brócoli y crucíferas, caldo de huesos, ayuno intermitente suave",
  },
  {
    id: "confort",
    nombre: "Confort",
    color: "#C8902A",
    microText: "Necesitas que algo te abrace por dentro. Existe la ciencia del confort sin culpa.",
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
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
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
            Tus emociones, tu guía.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-aubergine-dark max-w-4xl mx-auto leading-[1.1]"
          >
            Cada emoción es una señal.{" "}
            <br />
            <span className="italic font-light">
              Escúchalas y responde con nutrición.
            </span>
          </motion.h2>
          <p className="mt-8 text-aubergine-dark/60 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Pulsa cada estado para ver cómo funciona en tu cuerpo y qué comer para sostenerlo.
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
                style={{ color: "#C9A84C" }}
              >
                Club Premium
              </p>
              <p className="font-serif text-2xl md:text-3xl text-[#F5F0E8] leading-[1.3] font-light">
                Suscríbete y únete a nuestro club de WhatsApp Premium — contenido
                curado de verdad y contrastado por nuestros expertos.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-[#2d0f16] text-base transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0"
              style={{ backgroundColor: "#C9A84C" }}
            >
              Suscribirme <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
