"use client"

import { useEditorStore } from "@/stores/editorStore"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function EditorTabs() {
  const openFiles = useEditorStore((s) => s.openFiles)
  const activeFile = useEditorStore((s) => s.activeFile)
  const setActiveFile = useEditorStore((s) => s.setActiveFile)
  const closeFile = useEditorStore((s) => s.closeFile)
  const workspace = useEditorStore((s) => s.workspace)

  if (openFiles.length === 0) {
    return (
      <div className="h-8 flex items-center px-3 bg-[#0a0a0a] border-b border-border">
        <span className="text-[10px] text-text-muted font-mono">No files open</span>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-[#0a0a0a] border-b border-border overflow-x-auto">
      {openFiles.map((path) => {
        const name = path.split("/").pop() || path
        const isActive = path === activeFile

        return (
          <div
            key={path}
            onClick={() => setActiveFile(path)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono cursor-pointer border-r border-border",
              "transition-colors select-none whitespace-nowrap",
              isActive
                ? "bg-[#121212] text-text-secondary border-t-[2px] border-t-[#00ff41]"
                : "bg-[#0a0a0a] text-text-muted hover:text-text-secondary hover:bg-[#121212]"
            )}
          >
            <span>{name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeFile(path)
              }}
              className="hover:text-danger transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export { EditorTabs }

