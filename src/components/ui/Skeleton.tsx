import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "card" | "avatar"
}

function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-[#1a1a1a] animate-pulse",
        variant === "text" && "h-4 w-full rounded-none",
        variant === "card" && "h-32 w-full",
        variant === "avatar" && "h-8 w-8 rounded-none",
        className
      )}
    />
  )
}

export { Skeleton }
