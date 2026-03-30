import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    const defaultId = React.useId()
    const selectId = id || defaultId

    return (
      <div className="relative w-full">
        <select
          id={selectId}
          className={cn(
            "peer flex h-14 w-full appearance-none rounded-md border border-aubergine-dark/20 dark:border-cream/20 bg-transparent px-4 pt-4 pb-1 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy dark:focus-visible:ring-cream disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          defaultValue=""
          {...props}
        >
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-aubergine-dark">
              {opt.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={selectId}
          className="absolute left-4 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform text-sm text-aubergine-dark/60 dark:text-cream/60 transition-all duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-aubergine-dark dark:peer-focus:text-cream pointer-events-none"
        >
          {label}
        </label>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg className="h-4 w-4 text-aubergine-dark/60 dark:text-cream/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
