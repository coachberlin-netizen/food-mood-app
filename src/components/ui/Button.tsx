import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-aubergine-dark text-white hover:bg-aubergine shadow-luxury hover:shadow-luxury-hover",
        gold: "bg-transparent border border-gold text-gold hover:bg-gold/5",
        outline: "border border-transparent bg-aubergine text-cream hover:bg-aubergine-dark",
        ghost: "hover:bg-aubergine-dark/10 text-aubergine-dark",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-7 py-3.5 text-base",
        lg: "h-14 px-8 text-lg font-serif",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
