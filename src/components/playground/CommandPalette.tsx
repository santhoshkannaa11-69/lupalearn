"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useEditorStore } from "@/stores/editorStore"
import { File, Search, Play, Sparkles, Save, Home, BookOpen } from "lucide-react"

type Command = {
  id: string
  label: string
  description: string
  icon: React.ElementType
  action: () => void
}

function CommandPalette() {
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const isOpen = useEditorStore((s) => s.commandPaletteOpen)
  const toggle = useEditorStore((s) => s.toggleCommandPalette)
  const toggleNewFile = useEditorStore((s) => s.toggleNewFileDialog)
  const toggleSave = useEditorStore((s) => s.toggleSaveDialog)
  const runCode = useEditorStore((s) => s.setIsRunning)

  const commands: Command[] = [
    { id: "run", label: "Run Code", description: "Execute the current file", icon: Play, action: () => { runCode(true); toggle() } },
    { id: "new-file", label: "New File", description: "Create a new file", icon: File, action: () => { toggleNewFile(); toggle() } },
    { id: "save", label: "Save Project", description: "Save current workspace", icon: Save, action: () => { toggleSave(); toggle() } },
    { id: "ai-explain", label: "AI: Explain Code", description: "Explain the current selection", icon: Sparkles, action: () => { toggle() } },
    { id: "ai-fix", label: "AI: Fix Code", description: "Fix issues in the code", icon: Sparkles, action: () => { toggle() } },
    { id: "dashboard", label: "Go to Dashboard", description: "Open your learning dashboard", icon: Home, action: () => { window.location.href = "/dashboard" } },
    { id: "lessons", label: "Go to Lessons", description: "Browse all schools", icon: BookOpen, action: () => { window.location.href = "/learn" } },
    { id: "explore", label: "Explore", description: "Search knowledge graph", icon: Search, action: () => { window.location.href = "/explore" } },
  ]

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    : commands

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") toggle()
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === "Enter" && filtered[selectedIdx]) {
        filtered[selectedIdx].action()
      }
    },
    [filtered, selectedIdx, toggle]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-[#0a0a0a]/80" onClick={toggle} />
      <div className="relative w-full max-w-lg bg-[#121212] border border-border shadow-2xl animate-fade-in">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search size={14} className="text-text-muted mr-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-text-secondary font-mono outline-none placeholder:text-text-muted"
          />
          <span className="text-[10px] text-text-muted font-mono border border-border px-1.5 py-0.5">esc</span>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon
            return (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  i === selectedIdx ? "bg-[#1a1a1a] text-accent" : "text-text-secondary hover:bg-[#1a1a1a]"
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-bold">{cmd.label}</p>
                  <p className="text-[10px] text-text-muted font-mono">{cmd.description}</p>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-xs text-text-muted font-mono text-center py-4">No commands found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { CommandPalette }

