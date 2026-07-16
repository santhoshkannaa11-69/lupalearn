"use client"

import { useEditorStore } from "@/stores/editorStore"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { AIActions } from "./AIActions"
import { Play, Save, FolderOpen, PanelRightOpen, Command, ChevronDown } from "lucide-react"

const LANGUAGES = [
  "javascript", "typescript", "html", "css", "python",
  "rust", "go", "java", "cpp", "csharp",
]

function PlaygroundToolbar() {
  const isRunning = useEditorStore((s) => s.isRunning)
  const setIsRunning = useEditorStore((s) => s.setIsRunning)
  const toggleCommandPalette = useEditorStore((s) => s.toggleCommandPalette)
  const toggleNewFile = useEditorStore((s) => s.toggleNewFileDialog)
  const toggleSave = useEditorStore((s) => s.toggleSaveDialog)
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar)
  const sidebarOpen = useEditorStore((s) => s.sidebarOpen)

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 1500)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-bg shrink-0">
      <Badge variant="info" className="text-[10px]">Playground</Badge>
      <span className="text-[10px] text-text-muted font-mono">lupa@pg:~$</span>

      <div className="w-px h-4 bg-border mx-1" />

      <button
        onClick={toggleSidebar}
        className="text-text-muted hover:text-text-secondary transition-colors"
        title="Toggle Sidebar"
      >
        <PanelRightOpen size={14} />
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button variant="default" size="sm" onClick={handleRun} disabled={isRunning}>
        <Play size={12} /> Run
      </Button>

      <Button variant="ghost" size="sm" onClick={toggleNewFile}>
        <FolderOpen size={12} /> New
      </Button>

      <Button variant="ghost" size="sm" onClick={toggleSave}>
        <Save size={12} /> Save
      </Button>

      <div className="flex-1" />

      <AIActions />

      <div className="w-px h-4 bg-border mx-1" />

      <button
        onClick={toggleCommandPalette}
        className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-secondary font-mono border border-border px-2 py-1 bg-surface transition-colors"
        title="⌘K: Command Palette · ⌘Z: Undo · ⌘⇧Z: Redo"
      >
        <Command size={12} />
        <span className="hidden sm:inline">⌘K</span>
      </button>
    </div>
  )
}

export { PlaygroundToolbar }


