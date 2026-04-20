"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Each node: food emoji, associated emotion label, glow color, position, float offset
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

// Pairs of node indices to connect with lines
const CONNECTIONS: [number, number][] = [
  [0, 4], [4, 1], [1, 3], [3, 7],
  [7, 5], [5, 8], [8, 6], [6, 0],
  [4, 9], [2, 5], [0, 2], [3, 5],
];

// Pulse travelers: a dot that moves along a subset of lines
const PULSES: { conn: number; delay: number }[] = [
  { conn: 0, delay: 0 },
  { conn: 2, delay: 1.8 },
  { conn: 5, delay: 3.5 },
  { conn: 8, delay: 5.2 },
];

export function ConstellationBackground() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Core ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] pointer-events-none"
        style={{ width: '80%', height: '80%', backgroundColor: 'rgba(255,255,255,0.04)' }}
      />

      {/* SVG layer: connection lines + pulse travelers */}
      {/* viewBox 0 0 100 100 maps directly to the percentage-based node positions */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {CONNECTIONS.map(([a, b], i) => (
            <linearGradient
              key={i}
              id={`lg-${i}`}
              x1={`${parseFloat(NODES[a].left)}%`}
              y1={`${parseFloat(NODES[a].top)}%`}
              x2={`${parseFloat(NODES[b].left)}%`}
              y2={`${parseFloat(NODES[b].top)}%`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor={NODES[a].color} stopOpacity="0.05" />
              <stop offset="50%"  stopColor="#ffffff"        stopOpacity="0.22" />
              <stop offset="100%" stopColor={NODES[b].color} stopOpacity="0.05" />
            </linearGradient>
          ))}
        </defs>

        {/* Lines */}
        {CONNECTIONS.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={parseFloat(NODES[a].left)}
            y1={parseFloat(NODES[a].top)}
            x2={parseFloat(NODES[b].left)}
            y2={parseFloat(NODES[b].top)}
            stroke={`url(#lg-${i})`}
            strokeWidth="0.25"
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.35,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Pulse dots traveling along selected lines */}
        {PULSES.map(({ conn, delay }, i) => {
          const [a, b] = CONNECTIONS[conn];
          const x1 = parseFloat(NODES[a].left);
          const y1 = parseFloat(NODES[a].top);
          const x2 = parseFloat(NODES[b].left);
          const y2 = parseFloat(NODES[b].top);
          return (
            <motion.circle
              key={i}
              r="0.6"
              fill="white"
              initial={{ cx: x1, cy: y1, opacity: 0 }}
              animate={{
                cx:      [x1, x2, x1],
                cy:      [y1, y2, y1],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>

      {/* Food emoji nodes */}
      {NODES.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: hovered === i ? 1    : [0.55, 0.9, 0.55],
            scale:   hovered === i ? 1.25 : [1, 1.12, 1],
            x: [0, node.dx, 0],
            y: [0, node.dy, 0],
          }}
          transition={{
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
          }}
        >
          {node.emoji}

          {/* Emotion tooltip on hover */}
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
