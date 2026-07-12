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
          "inline-flex items-center justify-center gap-2 font-mono transition-all duration-150",
          "disabled:opacity-40 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41]",
          {
            "border border-[#1e1e1e] bg-[#121212] text-[#c0c0c0] hover:bg-[#1a1a1a] hover:border-[#2a2a2a]":
              variant === "default",
            "border border-[#00ff41] bg-[#00ff41] text-[#0a0a0a] hover:bg-[#00cc33] hover:border-[#00cc33] font-bold":
              variant === "primary",
            "bg-transparent text-[#c0c0c0] hover:bg-[#1a1a1a] border border-transparent":
              variant === "ghost",
            "border border-[#ff3355] bg-[#ff3355] text-[#0a0a0a] hover:bg-[#cc2244] hover:border-[#cc2244] font-bold":
              variant === "danger",
            "border border-[#1e1e1e] bg-transparent text-[#c0c0c0] hover:border-[#00ff41] hover:text-[#00ff41]":
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
