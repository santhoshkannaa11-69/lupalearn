import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  label?: string
}

const FRAMES = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]

function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-[#00ff41] font-mono", className)}>
      <span className="animate-spin-step">{FRAMES[0]}</span>
      {label && <span>{label}</span>}
    </span>
  )
}

export { Spinner }
