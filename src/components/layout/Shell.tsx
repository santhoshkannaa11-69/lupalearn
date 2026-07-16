"use client"

import type { ReactNode } from "react"
import { NavigationRail } from "./NavigationRail"

interface ShellProps {
  children: ReactNode
}

function Shell({ children }: ShellProps) {
  return (
    <div className="h-screen flex bg-bg">
      <NavigationRail />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export { Shell }
