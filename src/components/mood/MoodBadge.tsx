import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { MoodState } from "@/lib/types"

import { HTMLMotionProps } from "framer-motion"

interface MoodBadgeProps extends HTMLMotionProps<"div"> {
  mood: MoodState;
}

export function MoodBadge({ mood, className, ...props }: MoodBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
        className
      )}
      style={{
        backgroundColor: mood.fondo,
        color: mood.color,
        borderColor: `${mood.color}40`, // 25% opacity
      }}
      {...props}
    >
      <span className="text-sm leading-none">{mood.emoji}</span>
      <span>{mood.nombre}</span>
    </motion.div>
  )
}
