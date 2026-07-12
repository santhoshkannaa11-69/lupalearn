"use client"

import { useEffect } from "react"
import { PlaygroundToolbar } from "./PlaygroundToolbar"
import { FileTree } from "./FileTree"
import { EditorTabs } from "./EditorTabs"
import { MonacoEditor } from "./MonacoEditor"
import { BottomPanel } from "./BottomPanel"
import { CommandPalette } from "./CommandPalette"
import { NewFileDialog } from "./NewFileDialog"
import { SaveProjectDialog } from "./SaveProjectDialog"
import { useEditorStore } from "@/stores/editorStore"

function Playground() {
  const toggleCommandPalette = useEditorStore((s) => s.toggleCommandPalette)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const activeFile = useEditorStore((s) => s.activeFile)

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K — command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        toggleCommandPalette()
      }
      // ⌘Z — undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey && activeFile) {
        e.preventDefault()
        undo(activeFile)
      }
      // ⌘⇧Z or Ctrl+Y — redo
      if (((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") || ((e.metaKey || e.ctrlKey) && e.key === "y")) {
        if (activeFile) {
          e.preventDefault()
          redo(activeFile)
        }
      }
      // Ctrl+S — save (handled by dialog)
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        // Save is handled by the toolbar or auto-save
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleCommandPalette, undo, redo, activeFile])

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <PlaygroundToolbar />
      <div className="flex flex-1 overflow-hidden">
        <FileTree />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorTabs />
          <MonacoEditor />
          <BottomPanel />
        </div>
      </div>
      <CommandPalette />
      <NewFileDialog />
      <SaveProjectDialog />
    </div>
  )
}

export { Playground }
