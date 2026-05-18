"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const WARM_WHITE = "#FFFDF5"

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function hexToRgb(h: string) {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
}
function blendColors(c1: string, c2: string, t: number): string {
  const [r1,g1,b1] = hexToRgb(c1)
  const [r2,g2,b2] = hexToRgb(c2)
  return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`
}

const nodes = [
  { id: "activacion", name: "Activación", color: "#C9A84C", x: 12, y: 18, icon: "citrus", phase: 0   },
  { id: "calma",      name: "Calma",      color: "#7FBFAA", x: 88, y: 12, icon: "lotus",  phase: 1.0 },
  { id: "focus",      name: "Foco",         color: "#9BB8D4", x: 50, y: 48, icon: "gem",    phase: 2.0 },
  { id: "social",     name: "Social",       color: "#C87F9A", x: 92, y: 82, icon: "bloom",  phase: 3.0 },
  { id: "reset",      name: "Restauración", color: "#9B7EC8", x: 15, y: 88, icon: "fern",   phase: 4.0 },
  { id: "confort",    name: "Confort",    color: "#C49060", x:  6, y: 52, icon: "fig",    phase: 5.0 },
]

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 5], [2, 0]
]

interface IconProps {
  sc: string    // stroke color
  so: number    // stroke opacity
  sw: number    // stroke width (pre-scale)
}

function CitrusIcon({ sc, so, sw }: IconProps) {
  const segs = [0, 60, 120, 180, 240, 300].map(deg => {
    const rad = (deg - 90) * Math.PI / 180
    const ix = +(Math.cos(rad) * 2.5).toFixed(2), iy = +(Math.sin(rad) * 2.5).toFixed(2)
    const ox = +(Math.cos(rad) * 8).toFixed(2),   oy = +(Math.sin(rad) * 8).toFixed(2)
    return `M${ix},${iy}L${ox},${oy}`
  }).join(' ')
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round">
      <circle r="8" />
      <circle r="2.5" />
      <path d={segs} />
    </g>
  )
}

function LotusIcon({ sc, so, sw }: IconProps) {
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round">
      <circle cx="0"  cy="-5"   r="3.5" />
      <circle cx="-3" cy="-2.5" r="3.5" />
      <circle cx="3"  cy="-2.5" r="3.5" />
      <path d="M0,1 L0,6" />
      <path d="M0,3.5 C-2,2.5 -3,4.5 -1.5,5" />
      <path d="M0,3.5 C2,2.5 3,4.5 1.5,5" />
    </g>
  )
}

function GemIcon({ sc, so, sw }: IconProps) {
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0,-8 L5.5,-1 L0,8 L-5.5,-1 Z" />
      <line x1="-5.5" y1="-1" x2="5.5" y2="-1" />
      <path d="M-5.5,-1 L-2.5,-4 L0,-8 L2.5,-4 L5.5,-1" />
      <line x1="-2.5" y1="-1" x2="0" y2="8" />
      <line x1="2.5"  y1="-1" x2="0" y2="8" />
    </g>
  )
}

function BloomIcon({ sc, so, sw }: IconProps) {
  const petals = [0, 72, 144, 216, 288].map(deg => {
    const r = deg * Math.PI / 180
    const tx = +(Math.sin(r) * 5.5).toFixed(2), ty = +(-Math.cos(r) * 5.5).toFixed(2)
    const lx = +(Math.sin(r-0.6)*3).toFixed(2), ly = +(-Math.cos(r-0.6)*3).toFixed(2)
    const rx = +(Math.sin(r+0.6)*3).toFixed(2), ry = +(-Math.cos(r+0.6)*3).toFixed(2)
    return `M0,0 C${lx},${ly} ${tx},${ty} ${tx},${ty} C${tx},${ty} ${rx},${ry} 0,0`
  })
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round">
      {petals.map((d,i) => <path key={i} d={d} />)}
      <circle r="1.8" />
    </g>
  )
}

function FernIcon({ sc, so, sw }: IconProps) {
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round">
      <path d="M0,8 C1,4 0,-1 -1,-8" />
      <path d="M0.5,5.5 C2.5,3.5 4.5,5.5 3,7" />
      <path d="M0.5,5.5 C-1.5,3.5 -3.5,5.5 -2,7" />
      <path d="M0,2 C2,0 4,1.5 2.5,3.5" />
      <path d="M0,2 C-2,0 -4,1.5 -2.5,3.5" />
      <path d="M-0.3,-2 C1.5,-4 3,-2.5 1.5,-1" />
      <path d="M-0.3,-2 C-2,-4 -3.5,-2.5 -2,-1" />
      <path d="M-1,-8 C-3,-10 -1,-12 0,-10" />
    </g>
  )
}

function FigIcon({ sc, so, sw }: IconProps) {
  return (
    <g stroke={sc} strokeOpacity={so} fill="none" strokeWidth={sw} strokeLinecap="round">
      <ellipse rx="5.5" ry="7" cy="1" />
      <path d="M0,-6 L0,-9.5" />
      <path d="M0,-8.5 C-1.5,-11 -4,-10 -3,-8" />
      <path d="M0,-6 L0,5.5" strokeOpacity={so * 0.45} />
      <path d="M-2,7.5 C-1,6 1,6 2,7.5" />
    </g>
  )
}

const ICONS: Record<string, React.ComponentType<IconProps>> = {
  citrus: CitrusIcon,
  lotus:  LotusIcon,
  gem:    GemIcon,
  bloom:  BloomIcon,
  fern:   FernIcon,
  fig:    FigIcon,
}

function BotanicalIcon({
  type, baseColor, time, phase, isHovered, index,
}: {
  type: string; baseColor: string; time: number
  phase: number; isHovered: boolean; index: number
}) {
  const wave  = Math.sin(time * 0.7 + phase) * 0.5 + 0.5
  const sc    = blendColors(baseColor, WARM_WHITE, wave * 0.75)
  const so    = isHovered ? 1 : 0.6 + wave * 0.3
  const sw    = 1.25

  const glowA  = isHovered ? 0.22 : 0.07 + wave * 0.07
  const glowA2 = isHovered ? 0.45 : 0.18 + wave * 0.12
  const coreA  = isHovered ? 0.55 : 0.18 + wave * 0.14

  const Icon = ICONS[type]
  if (!Icon) return null

  return (
    <g>
      <circle r="18" fill={baseColor} style={{ filter:"blur(10px)", opacity: glowA }} />
      <circle r="8"  fill={baseColor} style={{ filter:"blur(5px)",  opacity: glowA2 }} />
      <circle r="4"  fill={WARM_WHITE} style={{ filter:"blur(2px)", opacity: coreA }} />

      <motion.circle r="0.5" cx="-4" cy="-3" fill="white"
        animate={{ opacity:[0,1,0] }}
        transition={{ duration:1.5+(index%3), repeat:Infinity, delay:index*0.2 }}
      />
      <motion.circle r="0.4" cx="3" cy="-5" fill="white"
        animate={{ opacity:[0,0.8,0] }}
        transition={{ duration:2+(index%2), repeat:Infinity, delay:index*0.5 }}
      />

      <g transform="scale(0.42)">
        <Icon sc={sc} so={so} sw={sw} />
      </g>
    </g>
  )
}

export function EmotionalConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [time, setTime] = useState(0)
  const rafRef  = useRef<number>()
  const startRef = useRef<number>()

  useEffect(() => {
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      setTime((now - startRef.current) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div className="relative w-full h-[85vh] md:h-[80vh] flex items-center justify-center pointer-events-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <g opacity="0.18">
          {connections.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              stroke="white" strokeWidth="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </g>

        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0, x: node.x, y: node.y }}
            animate={{
              scale: 1, opacity: 1,
              y: [node.y, node.y - 4, node.y],
              x: [node.x, node.x + 2, node.x],
            }}
            transition={{
              scale:   { delay: i * 0.1, duration: 0.5 },
              opacity: { delay: i * 0.1, duration: 0.5 },
              y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" },
              x: { repeat: Infinity, duration: 5 + i, ease: "easeInOut" },
            }}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onTouchStart={() => setHoveredNode(node.id)}
          >
            <BotanicalIcon
              type={node.icon}
              baseColor={node.color}
              time={time}
              phase={node.phase}
              isHovered={hoveredNode === node.id}
              index={i}
            />

            <AnimatePresence>
              {hoveredNode === node.id && (
                <motion.g
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <text
                    x={0} y={12}
                    textAnchor="middle"
                    fill="white"
                    className="text-[2.5px] font-sans tracking-[0.25em] uppercase font-bold pointer-events-none"
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
