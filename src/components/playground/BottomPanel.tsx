"use client"

import { useEditorStore, type BottomPanelTab } from "@/stores/editorStore"
import { PlaygroundTerminal } from "./PlaygroundTerminal"
import { LivePreview } from "./LivePreview"
import { cn } from "@/lib/utils"
import { Terminal, Eye, AlertCircle, Sparkles } from "lucide-react"

const tabs: { id: BottomPanelTab; label: string; icon: React.ElementType }[] = [
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "problems", label: "Problems", icon: AlertCircle },
  { id: "ai-output", label: "AI", icon: Sparkles },
]

function BottomPanel() {
  const activeTab = useEditorStore((s) => s.bottomPanelTab)
  const setActiveTab = useEditorStore((s) => s.setBottomPanelTab)
  const panelHeight = useEditorStore((s) => s.bottomPanelHeight)
  const setPanelHeight = useEditorStore((s) => s.setBottomPanelHeight)

  return (
    <div className="border-t border-border bg-[#0a0a0a] flex flex-col" style={{ height: panelHeight }}>
      {/* Tab bar */}
      <div className="flex items-center bg-[#0a0a0a] border-b border-border shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-colors",
                activeTab === tab.id
                  ? "text-accent bg-[#121212] border-t-[2px] border-t-[#00ff41]"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          )
        })}

        {/* Resize handle area */}
        <div className="flex-1" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "terminal" && <PlaygroundTerminal />}
        {activeTab === "preview" && <LivePreview />}
        {activeTab === "problems" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-text-muted font-mono">No problems detected</p>
          </div>
        )}
        {activeTab === "ai-output" && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-text-muted font-mono">Select code and use AI actions from the toolbar</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { BottomPanel }

