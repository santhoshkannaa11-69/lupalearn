import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "card" | "avatar"
}

function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface animate-pulse rounded-lg",
        variant === "text" && "h-4 w-full",
        variant === "card" && "h-32 w-full",
        variant === "avatar" && "h-8 w-8",
        className
      )}
    />
  )
}

export { Skeleton }
