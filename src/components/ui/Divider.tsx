import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  label?: string
}

function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3 text-xs text-[#606060] font-mono", className)}>
        <span className="flex-1 border-t border-[#1e1e1e]" />
        <span>{label}</span>
        <span className="flex-1 border-t border-[#1e1e1e]" />
      </div>
    )
  }

  return (
    <div className={cn("border-t border-[#1e1e1e]", className)} />
  )
}

export { Divider }
