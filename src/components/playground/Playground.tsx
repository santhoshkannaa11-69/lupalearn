"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import { PlaygroundToolbar } from "./PlaygroundToolbar"
import { FileTree } from "./FileTree"
import { EditorTabs } from "./EditorTabs"
import { MonacoEditor } from "./MonacoEditor"
import { BottomPanel } from "./BottomPanel"
import { CommandPalette } from "./CommandPalette"
import { NewFileDialog } from "./NewFileDialog"
import { SaveProjectDialog } from "./SaveProjectDialog"
import { ErrorBoundary } from "./ErrorBoundary"
import { useEditorStore } from "@/stores/editorStore"
import { GripHorizontal } from "lucide-react"

function Playground() {
  const toggleCommandPalette = useEditorStore((s) => s.toggleCommandPalette)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const activeFile = useEditorStore((s) => s.activeFile)
  const bottomPanelHeight = useEditorStore((s) => s.bottomPanelHeight)
  const setBottomPanelHeight = useEditorStore((s) => s.setBottomPanelHeight)

  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Drag handler for resizing bottom panel
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newHeight = rect.bottom - e.clientY
      const clamped = Math.max(80, Math.min(rect.height - 100, newHeight))
      setBottomPanelHeight(clamped)
    }

    const handleMouseUp = () => setDragging(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging, setBottomPanelHeight])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleCommandPalette()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey && activeFile) {
        e.preventDefault()
        undo(activeFile)
      }
      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") || ((e.metaKey || e.ctrlKey) && e.key === "y")) {
        if (activeFile) { e.preventDefault(); redo(activeFile) }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleCommandPalette, undo, redo, activeFile])

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-[#0a0a0a] select-none">
      <PlaygroundToolbar />
      <div className="flex flex-1 overflow-hidden">
        <FileTree />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorTabs />
          <ErrorBoundary>
            <div className="flex-1 overflow-hidden">
              <MonacoEditor />
            </div>
          </ErrorBoundary>

          {/* Resize Handle */}
          <div
            className={`h-2 flex items-center justify-center border-t border-[#1e1e1e] cursor-row-resize hover:bg-[#1a1a1a] transition-colors shrink-0 ${dragging ? "bg-[#1a1a1a]" : "bg-[#0a0a0a]"}`}
            onMouseDown={handleMouseDown}
          >
            <GripHorizontal size={12} className="text-[#606060]" />
          </div>

          <ErrorBoundary>
            <BottomPanel />
          </ErrorBoundary>
        </div>
      </div>
      <CommandPalette />
      <NewFileDialog />
      <SaveProjectDialog />
    </div>
  )
}

export { Playground }
