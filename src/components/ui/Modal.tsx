"use client"

import { useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") onClose()
      })
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0a0a0a]/80" onClick={onClose} />
      <div
        className={cn(
          "relative bg-[#121212] border border-[#1e1e1e] shadow-lg",
          "w-full max-w-lg mx-4",
          "animate-fade-in",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
            <h2 className="text-sm font-bold text-[#ffffff] uppercase tracking-wider">{title}</h2>
            <button onClick={onClose} className="text-[#606060] hover:text-[#c0c0c0] text-sm">
              [x]
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export { Modal }
