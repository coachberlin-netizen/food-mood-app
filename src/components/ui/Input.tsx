import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    const defaultId = React.useId()
    const inputId = id || defaultId

    return (
      <div className="relative w-full">
        <input
          type={type}
          id={inputId}
          className={cn(
            "peer flex h-14 w-full rounded-md border border-navy/20 dark:border-cream/20 bg-transparent px-4 pt-4 pb-1 text-sm text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy dark:focus-visible:ring-cream disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder={label}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="absolute left-4 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform cursor-text text-sm text-navy/60 dark:text-cream/60 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-navy dark:peer-focus:text-cream"
        >
          {label}
        </label>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
