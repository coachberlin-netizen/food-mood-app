"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const nodes = [
  { id: "activacion", name: "Activación", color: "#FF7043", x: 20, y: 30, size: 45 },
  { id: "calma", name: "Calma", color: "#90CAF9", x: 75, y: 25, size: 55 },
  { id: "focus", name: "Focus", color: "#81C784", x: 50, y: 55, size: 50 },
  { id: "social", name: "Social", color: "#F06292", x: 80, y: 70, size: 40 },
  { id: "reset", name: "Reset", color: "#9575CD", x: 25, y: 80, size: 50 },
  { id: "confort", name: "Confort", color: "#BCAAA4", x: 15, y: 55, size: 42 },
]

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
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 15}
              fill={node.color}
              className="transition-all duration-300"
              style={{
                filter: hoveredNode === node.id ? `blur(8px) brightness(1.2)` : `blur(4px)`,
                opacity: hoveredNode === node.id ? 1 : 0.6
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 22}
              fill="white"
              opacity={hoveredNode === node.id ? 1 : 0.9}
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
                    x={node.x}
                    y={node.y + 10}
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
