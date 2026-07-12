import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info"
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
        {
          "border border-[#1e1e1e] text-[#606060]": variant === "default",
          "border border-[#00ff41] text-[#00ff41]": variant === "success",
          "border border-[#ffb000] text-[#ffb000]": variant === "warning",
          "border border-[#ff3355] text-[#ff3355]": variant === "error",
          "border border-[#00f0ff] text-[#00f0ff]": variant === "info",
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
