"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

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
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "px-4 py-2 border text-sm font-mono animate-slide-up",
            "shadow-lg",
            toast.type === "info" && "border-[#00f0ff] bg-[#0a0a0a] text-[#00f0ff]",
            toast.type === "success" && "border-[#00ff41] bg-[#0a0a0a] text-[#00ff41]",
            toast.type === "warning" && "border-[#ffb000] bg-[#0a0a0a] text-[#ffb000]",
            toast.type === "error" && "border-[#ff3355] bg-[#0a0a0a] text-[#ff3355]",
          )}
        >
          [{toast.type?.toUpperCase()}] {toast.message}
        </div>
      ))}
    </div>
  )
}

export { ToastContainer }
export type { Toast }
