import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info"
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-surface border border-border text-text-muted": variant === "default",
          "bg-accent-soft text-accent": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-danger/10 text-danger": variant === "error",
          "bg-info/10 text-info": variant === "info",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
export type { BadgeProps }
