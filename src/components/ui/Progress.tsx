"use client"

import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  variant?: "default" | "success" | "warning" | "error"
}

function Progress({ value, max = 100, showLabel = true, size = "sm", className, variant = "default" }: ProgressProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex-1 rounded-full bg-surface overflow-hidden",
        size === "sm" && "h-1.5",
        size === "md" && "h-2",
        size === "lg" && "h-3",
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            variant === "success" && "bg-accent",
            variant === "warning" && "bg-warning",
            variant === "error" && "bg-danger",
            variant === "default" && "bg-accent",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn(
          "text-xs font-medium tabular-nums",
          variant === "success" && "text-accent",
          variant === "warning" && "text-warning",
          variant === "error" && "text-danger",
          variant === "default" && "text-text-secondary",
        )}>
          {pct}%
        </span>
      )}
    </div>
  )
}

export { Progress }
