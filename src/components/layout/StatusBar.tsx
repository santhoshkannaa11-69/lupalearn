"use client"

import { useEffect, useState } from "react"

function StatusBar() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="h-6 bg-[#0a0a0a] border-t border-[#1e1e1e] flex items-center px-4 gap-4 text-[10px] font-mono text-[#606060]">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-none bg-[#00ff41]" />
        <span>lupa@learn</span>
      </span>

      <span className="text-[#1e1e1e]">|</span>

      <span className="hidden sm:inline">NORMAL</span>

      <span className="text-[#1e1e1e]">|</span>

      <span className="hidden sm:inline">Ln 1 Col 1</span>

      <span className="text-[#1e1e1e]">|</span>

      <span>{time}</span>

      <div className="flex-1" />

      <span className="flex items-center gap-1">
        <span className="text-[#606060]">●</span>
        <span>Connected</span>
      </span>

      <span className="text-[#1e1e1e]">|</span>

      <span>v0.1.0</span>
    </footer>
  )
}

export { StatusBar }
