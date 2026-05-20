"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const NODES = [
  { emoji: '🍊', emotion: 'energía',       color: '#FF8C00', top: '15%', left: '10%', delay: 0,   dx: 14,  dy: -10 },
  { emoji: '🍐', emotion: 'calma',         color: '#7CB87A', top: '24%', left: '83%', delay: 1,   dx: -12, dy: 16  },
  { emoji: '🍎', emotion: 'concentración', color: '#E05555', top: '68%', left: '14%', delay: 2,   dx: 10,  dy: -14 },
  { emoji: '🥚', emotion: 'vitalidad',     color: '#F5E6C8', top: '62%', left: '78%', delay: 1.5, dx: -16, dy: 8   },
  { emoji: '🍬', emotion: 'placer',        color: '#E6A0C4', top: '10%', left: '50%', delay: 0.5, dx: 12,  dy: 14  },
  { emoji: '🫐', emotion: 'memoria',       color: '#7B68EE', top: '83%', left: '46%', delay: 3,   dx: -10, dy: -12 },
  { emoji: '🥑', emotion: 'equilibrio',    color: '#6DB33F', top: '42%', left: '5%',  delay: 1.2, dx: 16,  dy: -6  },
  { emoji: '🍋', emotion: 'claridad',      color: '#FFD700', top: '52%', left: '91%', delay: 0.8, dx: -14, dy: 10  },
  { emoji: '🥦', emotion: 'reset',         color: '#4CAF50', top: '87%', left: '11%', delay: 1.8, dx: 12,  dy: -10 },
  { emoji: '🫚', emotion: 'longevidad',    color: '#C9A84C', top: '7%',  left: '87%', delay: 2.5, dx: -10, dy: 16  },
];

const CONNECTIONS: [number, number][] = [
  [0, 4], [4, 1], [1, 3], [3, 7],
  [7, 5], [5, 8], [8, 6], [6, 0],
  [4, 9], [2, 5], [0, 2], [3, 5],
];

const PULSES: { conn: number; delay: number }[] = [
  { conn: 0, delay: 0 },
  { conn: 2, delay: 1.8 },
  { conn: 5, delay: 3.5 },
  { conn: 8, delay: 5.2 },
];

export function ConstellationBackground() {
  const [hovered, setHovered] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Memoize gradient definitions — they never change
  const gradients = useMemo(() =>
    CONNECTIONS.map(([a, b], i) => ({
      id: `lg-${i}`,
      x1: `${parseFloat(NODES[a].left)}%`,
      y1: `${parseFloat(NODES[a].top)}%`,
      x2: `${parseFloat(NODES[b].left)}%`,
      y2: `${parseFloat(NODES[b].top)}%`,
      color1: NODES[a].color,
      color2: NODES[b].color,
    })),
  []);

  // Memoize line coordinates
  const lines = useMemo(() =>
    CONNECTIONS.map(([a, b]) => ({
      x1: parseFloat(NODES[a].left),
      y1: parseFloat(NODES[a].top),
      x2: parseFloat(NODES[b].left),
      y2: parseFloat(NODES[b].top),
    })),
  []);

  // Memoize pulse coordinates
  const pulseCoords = useMemo(() =>
    PULSES.map(({ conn, delay }) => {
      const [a, b] = CONNECTIONS[conn];
      return {
        x1: parseFloat(NODES[a].left),
        y1: parseFloat(NODES[a].top),
        x2: parseFloat(NODES[b].left),
        y2: parseFloat(NODES[b].top),
        delay,
      };
    }),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Core ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] pointer-events-none"
        style={{ width: '80%', height: '80%', backgroundColor: 'rgba(255,255,255,0.04)' }}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {gradients.map(g => (
            <linearGradient
              key={g.id}
              id={g.id}
              x1={g.x1} y1={g.y1}
              x2={g.x2} y2={g.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor={g.color1} stopOpacity="0.05" />
              <stop offset="50%"  stopColor="#ffffff"  stopOpacity="0.22" />
              <stop offset="100%" stopColor={g.color2} stopOpacity="0.05" />
            </linearGradient>
          ))}
        </defs>

        {/* Lines */}
        {lines.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1} y1={l.y1}
            x2={l.x2} y2={l.y2}
            stroke={`url(#lg-${i})`}
            strokeWidth="0.25"
            animate={prefersReducedMotion ? { opacity: 0.4 } : { opacity: [0.25, 0.6, 0.25] }}
            transition={prefersReducedMotion ? {} : {
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'easeInOut',
            }}
            style={{ willChange: 'opacity' }}
          />
        ))}

        {/* Pulse dots */}
        {!prefersReducedMotion && pulseCoords.map((p, i) => (
          <motion.circle
            key={i}
            r="0.6"
            fill="white"
            initial={{ cx: p.x1, cy: p.y1, opacity: 0 }}
            animate={{
              cx:      [p.x1, p.x2, p.x1],
              cy:      [p.y1, p.y2, p.y1],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            style={{ willChange: 'transform, opacity' }}
          />
        ))}
      </svg>

      {/* Food emoji nodes */}
      {NODES.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={prefersReducedMotion
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: hovered === i ? 1    : [0.55, 0.9, 0.55],
                scale:   hovered === i ? 1.25 : [1, 1.12, 1],
                x: [0, node.dx, 0],
                y: [0, node.dy, 0],
              }
          }
          transition={prefersReducedMotion ? { duration: 0.3 } : {
            duration: 6 + node.delay * 0.8,
            repeat: Infinity,
            delay: node.delay,
            ease: 'easeInOut',
          }}
          onHoverStart={() => setHovered(i)}
          onHoverEnd={() => setHovered(null)}
          style={{
            position:    'absolute',
            top:         node.top,
            left:        node.left,
            fontSize:    '2.4rem',
            lineHeight:  1,
            cursor:      'default',
            userSelect:  'none',
            filter:      `drop-shadow(0 0 18px ${node.color}cc) drop-shadow(0 0 6px ${node.color}88)`,
            pointerEvents: 'auto',
            willChange:  prefersReducedMotion ? 'auto' : 'transform, opacity',
            transform:   'translateZ(0)',
          }}
        >
          {node.emoji}

          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, scale: 0.75, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.75, y: 6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position:        'absolute',
                  bottom:          '115%',
                  left:            '50%',
                  transform:       'translateX(-50%)',
                  backgroundColor: 'rgba(20,6,12,0.88)',
                  border:          `1px solid ${node.color}50`,
                  borderRadius:    6,
                  padding:         '3px 10px',
                  whiteSpace:      'nowrap',
                  color:           node.color,
                  fontSize:        10,
                  fontWeight:      700,
                  letterSpacing:   '0.14em',
                  textTransform:   'uppercase',
                  pointerEvents:   'none',
                  backdropFilter:  'blur(4px)',
                }}
              >
                {node.emotion}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
