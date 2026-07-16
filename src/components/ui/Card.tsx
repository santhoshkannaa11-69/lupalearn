import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated"
}

function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variant === "default" && "bg-surface border border-border shadow-sm",
        variant === "bordered" && "bg-surface border border-border",
        variant === "elevated" && "bg-elevated border border-border shadow-md",
        "p-5",
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
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-text-primary", className)} {...props}>
      {children}
    </h3>
  )
}

function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-muted mt-1", className)} {...props}>
      {children}
    </p>
  )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-text-secondary", className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-border", className)} {...props}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
