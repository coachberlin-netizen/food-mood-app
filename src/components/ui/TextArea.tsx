import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const defaultId = React.useId()
    const textareaId = id || defaultId

    return (
      <div className="relative w-full">
        <textarea
          id={textareaId}
          className={cn(
            "peer flex min-h-[120px] w-full rounded-md border border-aubergine-dark/20 dark:border-cream/20 bg-transparent px-4 pt-6 pb-2 text-sm text-foreground transition-colors placeholder:text-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy dark:focus-visible:ring-cream disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            className
          )}
          placeholder={label}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={textareaId}
          className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2 scale-75 transform cursor-text text-sm text-aubergine-dark/60 dark:text-cream/60 transition-all duration-200 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-aubergine-dark dark:peer-focus:text-cream"
        >
          {label}
        </label>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
