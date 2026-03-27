import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div className={cn("flex items-center justify-center w-full py-12", className)} {...props}>
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-[1px] bg-gold/20 relative flex items-center justify-center w-full max-w-sm"
      >
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, type: "tween", ease: "easeOut" }}
          className="absolute w-[6px] h-[6px] rounded-full bg-gold" 
        />
      </motion.div>
    </div>
  )
}
