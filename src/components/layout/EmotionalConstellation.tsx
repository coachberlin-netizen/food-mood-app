"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const nodes = [
  { id: "activacion", name: "Activación", color: "#FF7043", x: 20, y: 30, size: 45, fruit: "citrus" },
  { id: "calma", name: "Calma", color: "#90CAF9", x: 75, y: 25, size: 55, fruit: "grapes" },
  { id: "focus", name: "Focus", color: "#81C784", x: 50, y: 55, size: 50, fruit: "apple" },
  { id: "social", name: "Social", color: "#F06292", x: 80, y: 70, size: 40, fruit: "strawberry" },
  { id: "reset", name: "Reset", color: "#9575CD", x: 25, y: 80, size: 50, fruit: "pear" },
  { id: "confort", name: "Confort", color: "#BCAAA4", x: 15, y: 55, size: 42, fruit: "peach" },
]

const FruitIcon = ({ type, color, isHovered }: { type: string, color: string, isHovered: boolean }) => {
  const glowStyle = {
    filter: isHovered ? `blur(8px) brightness(1.2)` : `blur(4px)`,
    opacity: isHovered ? 1 : 0.6,
    transition: "all 0.3s ease"
  };

  switch (type) {
    case 'apple':
      return (
        <g style={glowStyle}>
          <path d="M0,2 C-2,2 -4,0 -4,-3 C-4,-6 -2,-8 0,-8 C2,-8 4,-6 4,-3 C4,0 2,2 0,2 Z" fill={color} />
          <path d="M0,-8 C0,-10 1,-11 2,-11" stroke={color} strokeWidth="1" fill="none" />
          <path d="M2,-11 C3,-11 4,-10 4,-9 C4,-8 3,-7 2,-7" fill={color} opacity="0.8" />
        </g>
      );
    case 'citrus':
      return (
        <g style={glowStyle}>
          <circle r="4" fill={color} />
          <circle r="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="white" strokeWidth="0.3" opacity="0.5" />
        </g>
      );
    case 'grapes':
      return (
        <g style={glowStyle}>
          <circle cx="-1.5" cy="-1.5" r="1.8" fill={color} />
          <circle cx="1.5" cy="-1.5" r="1.8" fill={color} />
          <circle cx="0" cy="1" r="1.8" fill={color} />
          <circle cx="0" cy="3.5" r="1.8" fill={color} />
        </g>
      );
    case 'strawberry':
      return (
        <g style={glowStyle}>
          <path d="M0,4 C-3,4 -4,1 -4,-2 C-4,-4 -2,-5 0,-5 C2,-5 4,-4 4,-2 C4,1 3,4 0,4 Z" fill={color} />
          <path d="M-2,-5 L0,-3 L2,-5" stroke="white" strokeWidth="0.5" fill="none" opacity="0.5" />
          <circle cx="-1" cy="0" r="0.3" fill="white" opacity="0.6" />
          <circle cx="1" cy="1" r="0.3" fill="white" opacity="0.6" />
          <circle cx="0" cy="-1" r="0.3" fill="white" opacity="0.6" />
        </g>
      );
    case 'pear':
      return (
        <g style={glowStyle}>
          <path d="M0,4 C-3,4 -4,2 -4,-1 C-4,-3 -2,-4 -1,-6 C0,-7 0,-8 0,-8 C0,-8 0,-7 1,-6 C2,-4 4,-3 4,-1 C4,2 3,4 0,4 Z" fill={color} />
          <path d="M0,-8 C0,-9 1,-10 2,-10" stroke={color} strokeWidth="0.8" fill="none" />
        </g>
      );
    case 'peach':
      return (
        <g style={glowStyle}>
          <circle r="4" fill={color} />
          <path d="M0,-4 Q1,0 0,4" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M0,-4 C1,-6 2,-7 3,-7" stroke={color} strokeWidth="0.8" fill="none" />
        </g>
      );
    default:
      return <circle r="4" fill={color} style={glowStyle} />;
  }
};

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 5], [2, 0]
]

export function EmotionalConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center pointer-events-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-2xl overflow-visible drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connections */}
        <g opacity="0.15">
          {connections.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="white"
              strokeWidth="0.5"
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -4, 0],
              x: [0, 2, 0]
            }}
            transition={{
              scale: { delay: i * 0.1, duration: 0.5 },
              opacity: { delay: i * 0.1, duration: 0.5 },
              y: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" }
            }}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onTouchStart={() => setHoveredNode(node.id)}
            transform={`translate(${node.x}, ${node.y})`}
          >
            <FruitIcon type={node.fruit} color={node.color} isHovered={hoveredNode === node.id} />
            
            <circle
              r={node.size / 22}
              fill="white"
              opacity={hoveredNode === node.id ? 0.4 : 0.2}
            />
            
            {/* Tooltip-like Text */}
            <AnimatePresence>
              {hoveredNode === node.id && (
                <motion.g
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fill="white"
                    className="text-[3px] font-sans tracking-[0.1em] uppercase font-bold pointer-events-none"
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

