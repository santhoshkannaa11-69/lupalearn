import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  label?: string
}

function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3 text-xs text-text-muted", className)}>
        <span className="flex-1 border-t border-border" />
        <span>{label}</span>
        <span className="flex-1 border-t border-border" />
      </div>
    )
  }

  return (
    <div className={cn("border-t border-border", className)} />
  )
}

export { Divider }
