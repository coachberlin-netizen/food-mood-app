import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-aubergine-dark/10 dark:bg-cream/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
