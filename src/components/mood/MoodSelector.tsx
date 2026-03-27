"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { moods } from "@/data/moods"
import { MoodCard } from "./MoodCard"
import { cn } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
  }
}

interface MoodSelectorProps {
  className?: string;
}

export function MoodSelector({ className }: MoodSelectorProps) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {moods.map((mood, index) => (
          <motion.div key={mood.id} variants={itemVariants} className="h-full flex">
            <MoodCard mood={mood} index={index} className="w-full" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
