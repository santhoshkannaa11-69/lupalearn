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
  const blocks = Math.round(pct / 5)
  const totalBlocks = 20
  const filled = "█"
  const empty = "░"

  return (
    <div className={cn("flex items-center gap-2 font-mono", className)}>
      <span className="text-[#00ff41] text-xs">
        [{filled.repeat(blocks)}{empty.repeat(totalBlocks - blocks)}]
      </span>
      {showLabel && (
        <span className={cn(
          "text-xs",
          variant === "success" && "text-[#00ff41]",
          variant === "warning" && "text-[#ffb000]",
          variant === "error" && "text-[#ff3355]",
          variant === "default" && "text-[#c0c0c0]",
        )}>
          {pct}%
        </span>
      )}
    </div>
  )
}

export { Progress }
