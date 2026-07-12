"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { StatusBar } from "./StatusBar"

interface ShellProps {
  children: ReactNode
}

function Shell({ children }: ShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      <Header onMenuToggle={() => setSidebarCollapsed((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  )
}

export { Shell }
