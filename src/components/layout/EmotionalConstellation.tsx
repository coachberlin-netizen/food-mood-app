"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const nodes = [
  { id: "activacion", name: "Activación", color: "#FFD700", x: 20, y: 30, size: 45, fruit: "citrus" },
  { id: "calma", name: "Calma", color: "#E6E6FA", x: 75, y: 25, size: 55, fruit: "grapes" },
  { id: "focus", name: "Focus", color: "#FFFFFF", x: 50, y: 55, size: 50, fruit: "apple" },
  { id: "social", name: "Social", color: "#FFD1DC", x: 80, y: 70, size: 40, fruit: "strawberry" },
  { id: "reset", name: "Reset", color: "#E0FFF0", x: 25, y: 80, size: 50, fruit: "pear" },
  { id: "confort", name: "Confort", color: "#FFDAB9", x: 15, y: 55, size: 42, fruit: "peach" },
]

const FruitIcon = ({ type, color, isHovered, index }: { type: string, color: string, isHovered: boolean, index: number }) => {
  return (
    <g>
      {/* Halo Background Glow (soft & wide) */}
      <circle
        r="7"
        fill={color}
        style={{
          filter: "blur(6px)",
          opacity: isHovered ? 0.35 : 0.15,
          transition: "all 0.3s ease"
        }}
      />
      
      {/* Main Core Glow (brighter) */}
      <circle
        r="4.5"
        fill={color}
        style={{
          filter: "blur(3px)",
          opacity: isHovered ? 0.8 : 0.45,
          transition: "all 0.3s ease"
        }}
      />
      
      {/* Sparkles (Destellos) - tiny twinkling stars */}
      <motion.circle
        r="0.5" cx="-3" cy="-2" fill="white"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5 + (index % 3), repeat: Infinity, delay: index * 0.2 }}
      />
      <motion.circle
        r="0.4" cx="2" cy="-4" fill="white"
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 2 + (index % 2), repeat: Infinity, delay: index * 0.5 }}
      />
      <motion.circle
        r="0.3" cx="3" cy="2" fill="white"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.8 + (index % 4), repeat: Infinity, delay: index * 0.7 }}
      />
      
      {/* Solid Fruit Body */}
      <g opacity={isHovered ? 1 : 0.85} transform="scale(0.45)">
        {type === 'apple' && (
          <g>
            <path d="M0,3 C-2,3 -4,1 -4,-2 C-4,-5 -2,-7 0,-7 C2,-7 4,-5 4,-2 C4,1 2,3 0,3 Z" fill={color} />
            <path d="M0,-7 C0,-9 0.5,-10 1.5,-10" stroke="#FFF" strokeWidth="1" opacity="0.4" fill="none" />
          </g>
        )}
        {type === 'citrus' && (
          <g>
            <circle r="4.5" fill={color} />
            <path d="M-3,0 L3,0 M0,-3 L0,3 M-2.1,-2.1 L2.1,2.1 M-2.1,2.1 L2.1,-2.1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          </g>
        )}
        {type === 'grapes' && (
          <g transform="translate(0, -1)">
            <circle cx="-2" cy="-2" r="2.2" fill={color} />
            <circle cx="2" cy="-2" r="2.2" fill={color} />
            <circle cx="0" cy="1" r="2.2" fill={color} />
            <circle cx="-1.5" cy="4" r="2.2" fill={color} />
            <circle cx="1.5" cy="4" r="2.2" fill={color} />
          </g>
        )}
        {type === 'strawberry' && (
          <g>
            <path d="M0,5 C-3.5,5 -5,1 -5,-2 C-5,-5 -2.5,-6 0,-6 C2.5,-6 5,-5 5,-2 C5,1 3.5,5 0,5 Z" fill={color} />
            <path d="M-2,-6 L0,-3 L2,-6" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
          </g>
        )}
        {type === 'pear' && (
          <g>
            <path d="M0,5 C-3.5,5 -4,2.5 -4,0 C-4,-2 -2,-4 -1,-6 C0,-7.5 0,-8.5 0,-8.5 C0,-8.5 0,-7.5 1,-6 C2,-4 4,-2 4,0 C4,2.5 3.5,5 0,5 Z" fill={color} />
            <path d="M0,-8.5 C0,-9.5 0.5,-10.5 1.5,-10.5" stroke="#FFF" strokeWidth="1" opacity="0.4" fill="none" />
          </g>
        )}
        {type === 'peach' && (
          <g>
            <circle r="4.5" fill={color} />
            <path d="M0,-4.5 Q1.5,0 0,4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          </g>
        )}
      </g>

      {/* Subtle shine highlight */}
      <circle r="1" cx="-1" cy="-1" fill="white" opacity={isHovered ? 0.35 : 0.2} />
    </g>
  );
};

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 5], [2, 0]
]

export function EmotionalConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <div className="relative w-full h-[150px] md:h-[250px] flex items-center justify-center pointer-events-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-2xl overflow-visible drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fine Connections (ethereal/magical) */}
        <g opacity="0.12">
          {connections.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="white"
              strokeWidth="0.22"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </g>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0, x: node.x, y: node.y }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [node.y, node.y - 3, node.y],
              x: [node.x, node.x + 1.5, node.x]
            }}
            transition={{
              scale: { delay: i * 0.1, duration: 0.5 },
              opacity: { delay: i * 0.1, duration: 0.5 },
              y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 5 + i, ease: "easeInOut" }
            }}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onTouchStart={() => setHoveredNode(node.id)}
          >
            <FruitIcon type={node.fruit} color={node.color} isHovered={hoveredNode === node.id} index={i} />
            
            {/* Tooltip-like Text */}
            <AnimatePresence>
              {hoveredNode === node.id && (
                <motion.g
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fill="white"
                    className="text-[2.2px] font-sans tracking-[0.22em] uppercase font-bold pointer-events-none"
                    style={{ filter: "none" }}
                  >
                    {node.name}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

