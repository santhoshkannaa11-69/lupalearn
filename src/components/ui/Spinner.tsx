import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  label?: string
}

function Spinner({ className, label }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-text-secondary", className)}>
      <span className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      {label && <span>{label}</span>}
    </span>
  )
}

export { Spinner }
