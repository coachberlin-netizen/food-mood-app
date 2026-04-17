"use client";

import React from 'react';
import { motion } from 'framer-motion';

const nodes = [
  { top: '15%', left: '10%', size: 4, color: '#E30B5D', delay: 0 },
  { top: '25%', left: '85%', size: 3, color: '#FFB000', delay: 1 },
  { top: '70%', left: '15%', size: 5, color: '#00CED1', delay: 2 },
  { top: '65%', left: '80%', size: 4, color: '#E6E6FA', delay: 1.5 },
  { top: '10%', left: '50%', size: 2, color: '#FFFFFF', delay: 0.5 },
  { top: '85%', left: '45%', size: 3, color: '#FF7F50', delay: 3 },
  { top: '40%', left: '5%', size: 2, color: '#C9A84C', delay: 1.2 },
  { top: '55%', left: '95%', size: 3, color: '#E30B5D', delay: 0.8 },
  { top: '5%', left: '90%', size: 2, color: '#FFFFFF', delay: 2.5 },
  { top: '90%', left: '10%', size: 3, color: '#00CED1', delay: 1.8 },
];

export function ConstellationBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radiant Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 rounded-full blur-[150px] opacity-30" />
      
      {/* Individual Radiant Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: node.top,
            left: node.left,
            width: node.size,
            height: node.size,
            backgroundColor: node.color,
            borderRadius: '50%',
            boxShadow: `0 0 15px ${node.color}cc`,
          }}
        />
      ))}

      {/* Subtle connecting dust/lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path 
          d="M100,150 Q500,50 900,100" 
          stroke="white" 
          strokeWidth="0.5" 
          fill="none" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 10, repeat: Infinity, alternate: true }}
        />
        <motion.path 
          d="M200,800 Q400,600 800,900" 
          stroke="white" 
          strokeWidth="0.5" 
          fill="none" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 15, repeat: Infinity, alternate: true, delay: 2 }}
        />
      </svg>
    </div>
  );
}
