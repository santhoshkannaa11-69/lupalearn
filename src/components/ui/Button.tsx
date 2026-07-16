"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg",
          "disabled:opacity-40 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          {
            "border border-border bg-surface text-text-primary hover:bg-elevated hover:border-border-hover shadow-sm":
              variant === "default",
            "border border-accent bg-accent text-white hover:bg-accent-hover shadow-sm":
              variant === "primary",
            "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent":
              variant === "ghost",
            "border border-danger bg-danger text-white hover:opacity-90":
              variant === "danger",
            "border border-border bg-transparent text-text-secondary hover:text-accent hover:border-accent":
              variant === "outline",
          },
          {
            "h-7 px-3 text-xs": size === "sm",
            "h-9 px-4 text-sm": size === "md",
            "h-11 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
export type { ButtonProps }
