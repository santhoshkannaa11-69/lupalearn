"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, style, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-text-muted text-sm select-none whitespace-nowrap">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-9 bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted",
            "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
            "transition-all duration-150 rounded-lg",
            prefix ? "pr-3 pl-8" : "px-3",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
