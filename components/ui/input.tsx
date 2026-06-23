import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-text">{label}</label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-bg text-text px-4 py-2 text-sm",
              "transition-base",
              "placeholder:text-text-muted",
              "focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pe-10",
              error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
              className,
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className={cn(
              "absolute end-3 top-1/2 -translate-y-1/2 transition-base",
              error ? "text-destructive" : "text-text-muted"
            )}>
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }