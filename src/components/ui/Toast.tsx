"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type?: "info" | "success" | "warning" | "error"
}

let toastListeners: ((toast: Toast) => void)[] = []

export function showToast(message: string, type: Toast["type"] = "info") {
  const toast: Toast = { id: Date.now().toString(), message, type }
  toastListeners.forEach((fn) => fn(toast))
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 4000)
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type || "info"]
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-up",
              "bg-elevated backdrop-blur-sm",
              toast.type === "info" && "border-info/30",
              toast.type === "success" && "border-accent/30",
              toast.type === "warning" && "border-warning/30",
              toast.type === "error" && "border-danger/30",
              toast.type === "success" && "shadow-[0_0_20px_rgba(232,184,75,0.1)]",
            )}
          >
            <Icon size={16} className={cn(
              "mt-0.5 shrink-0",
              toast.type === "info" && "text-info",
              toast.type === "success" && "text-accent",
              toast.type === "warning" && "text-warning",
              toast.type === "error" && "text-danger",
            )} />
            <p className="text-sm text-text-primary flex-1">{toast.message}</p>
          </div>
        )
      })}
    </div>
  )
}

export { ToastContainer }
export type { Toast }
