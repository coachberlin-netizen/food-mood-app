"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { PaletteResult } from "@/lib/emotional-palette";

interface PaletteResultProps {
  result: PaletteResult;
  animate?: boolean;
}

export default function PaletteResultView({
  result,
  animate = true,
}: PaletteResultProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.6, ease: "easeOut" },
    }),
  };

  const circleVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 0.8, duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={containerVariants}
      className="w-full py-[60px] flex flex-col items-center text-center relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${result.colorDominante}20 0%, transparent 70%)`,
      }}
    >
      {/* 2. Círculo central */}
      <motion.div
        variants={circleVariants}
        className="w-[200px] h-[200px] rounded-full"
        style={{
          background: `linear-gradient(135deg, ${result.colorDominante}, ${result.colorSecundario})`,
          boxShadow: `0 20px 60px ${result.colorDominante}4D`,
        }}
      />

      {/* 3. Label del color */}
      <motion.p
        custom={0.2}
        variants={itemVariants}
        className="mt-4 text-[18px] font-medium"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B2737" }}
      >
        {result.colorLabelDominante} con matiz {result.colorLabelSecundario}
      </motion.p>

      {/* 4. Descripción */}
      <motion.h2
        custom={0.4}
        variants={itemVariants}
        className="mt-3 text-[28px] italic"
        style={{ fontFamily: "'Playfair Display', serif", color: "#6B2737" }}
      >
        Tu paisaje hoy narra {result.descripcion}
      </motion.h2>

      {/* 5. Necesidades */}
      <motion.p
        custom={0.6}
        variants={itemVariants}
        className="mt-5 max-w-lg text-[16px] font-light leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif", color: "#7a7974" }}
      >
        {result.necesidades}
      </motion.p>

      {/* 6. Línea decorativa */}
      <motion.div
        variants={lineVariants}
        className="mt-10 w-[60px] h-[1px]"
        style={{ background: "#FF6B35", margin: "0 auto" }}
      />
    </motion.div>
  );
}
