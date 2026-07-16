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
      <div className="flex gap-1 p-1 bg-surface rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              active === tab.id
                ? "bg-elevated text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
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
