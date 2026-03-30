"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MoodId } from "@/lib/types"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-aubergine-dark text-cream hover:bg-aubergine-dark/80 dark:bg-cream dark:text-aubergine-dark dark:hover:bg-cream/80",
        outline: "text-foreground border-aubergine-dark/20 dark:border-cream/20",
        gold: "border-transparent bg-gold/20 text-gold-foreground border-gold/50",
      },
      mood: {
        ansioso: "bg-coral/20 text-coral border-coral/30",
        triste: "bg-lavender/20 text-lavender border-lavender/30",
        fatigado: "bg-gold/20 text-gold-foreground border-gold/30",
        desconcentrado: "bg-sage/20 text-sage-foreground border-sage/30",
        irritable: "bg-coral/20 text-coral border-coral/30",
        equilibrado: "bg-sage/20 text-sage-foreground border-sage/30",
        none: "",
      }
    },
    defaultVariants: {
      variant: "default",
      mood: "none",
    },
  }
)

export interface BadgeProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, mood, ...props }: BadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(badgeVariants({ variant, mood, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
