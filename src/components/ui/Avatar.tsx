"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface AvatarProps extends HTMLMotionProps<"div"> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-12 w-12 text-sm",
      lg: "h-16 w-16 text-lg",
    }

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.05 }}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-sage/20 items-center justify-center text-navy dark:text-cream border border-sage/30",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
        ) : (
          <span className="font-serif font-medium">{fallback}</span>
        )}
      </motion.div>
    )
  }
)
Avatar.displayName = "Avatar"
