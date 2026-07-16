"use client"

import { useState } from "react"
import { useEditorStore } from "@/stores/editorStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const FILE_TEMPLATES = [
  { name: "index.js", language: "javascript" },
  { name: "index.ts", language: "typescript" },
  { name: "index.html", language: "html" },
  { name: "style.css", language: "css" },
  { name: "main.py", language: "python" },
  { name: "main.rs", language: "rust" },
  { name: "main.go", language: "go" },
  { name: "README.md", language: "markdown" },
]

function NewFileDialog() {
  const [fileName, setFileName] = useState("")
  const isOpen = useEditorStore((s) => s.newFileDialogOpen)
  const toggle = useEditorStore((s) => s.toggleNewFileDialog)
  const createFile = useEditorStore((s) => s.createFile)

  if (!isOpen) return null

  const handleCreate = (name: string) => {
    const lang = name.split(".").pop() || "javascript"
    createFile("/", name, lang)
    toggle()
    setFileName("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-bg/80" onClick={toggle} />
      <div className="relative bg-surface border border-border p-4 w-full max-w-md animate-fade-in">
        <h2 className="text-sm font-bold text-text-primary font-mono mb-3 uppercase tracking-wider">New File</h2>

        <div className="flex items-center gap-2 mb-4">
          <Input
            prefix="> lupa@pg:~$ touch"
            placeholder="filename.js"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fileName && handleCreate(fileName)}
          />
          <Button variant="primary" size="sm" onClick={() => fileName && handleCreate(fileName)} disabled={!fileName}>
            Create
          </Button>
        </div>

        <p className="text-[10px] text-text-muted font-mono mb-2 uppercase tracking-wider">Templates</p>
        <div className="grid grid-cols-2 gap-1">
          {FILE_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              onClick={() => handleCreate(tpl.name)}
              className="text-left px-2 py-1.5 text-xs font-mono text-text-secondary hover:bg-surface border border-transparent hover:border-border transition-colors"
            >
              <span className="text-info">{tpl.name}</span>
              <span className="text-text-muted ml-1">({tpl.language})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { NewFileDialog }


