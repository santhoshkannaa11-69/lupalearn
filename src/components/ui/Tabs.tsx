"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  return (
    <div className={className}>
      <div className="flex border-b border-[#1e1e1e] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors",
              "border-b-2 -mb-[1px]",
              active === tab.id
                ? "border-[#00ff41] text-[#00ff41]"
                : "border-transparent text-[#606060] hover:text-[#c0c0c0]"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}

export { Tabs }
export type { Tab, TabsProps }
