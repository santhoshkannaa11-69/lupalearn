import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered"
}

function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#121212]",
        variant === "bordered" && "border border-[#1e1e1e]",
        "p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-3", className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-sm font-bold text-[#ffffff] uppercase tracking-wider", className)} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[#606060] mt-1", className)} {...props}>
      {children}
    </p>
  )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-[#c0c0c0]", className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-3 pt-3 border-t border-[#1e1e1e]", className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
