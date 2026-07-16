"use client"

import { useState, useEffect } from "react"
import { useEditorStore } from "@/stores/editorStore"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Trash2, Check } from "lucide-react"
import { showToast } from "@/components/ui/Toast"

type SavedProject = {
  id: string
  name: string
  language: string
  savedAt: string
  workspace: string
}

function SaveProjectDialog() {
  const [projectName, setProjectName] = useState("")
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const isOpen = useEditorStore((s) => s.saveDialogOpen)
  const toggle = useEditorStore((s) => s.toggleSaveDialog)
  const workspace = useEditorStore((s) => s.workspace)
  const setWorkspace = useEditorStore((s) => s.setWorkspace)

  useEffect(() => {
    if (isOpen) {
      const raw = localStorage.getItem("lupa-projects")
      setSavedProjects(raw ? JSON.parse(raw) : [])
      setProjectName(workspace.name)
    }
  }, [isOpen, workspace.name])

  const handleSave = () => {
    const name = projectName.trim() || workspace.name
    const projects: SavedProject[] = JSON.parse(localStorage.getItem("lupa-projects") || "[]")
    const existing = projects.findIndex((p) => p.name === name)
    const entry: SavedProject = {
      id: existing >= 0 ? projects[existing].id : Date.now().toString(),
      name,
      language: workspace.language,
      savedAt: new Date().toISOString(),
      workspace: JSON.stringify(workspace),
    }

    if (existing >= 0) {
      projects[existing] = entry
    } else {
      projects.push(entry)
    }

    localStorage.setItem("lupa-projects", JSON.stringify(projects))
    setSavedProjects(projects)
    showToast(`Project "${name}" saved`, "success")
  }

  const handleLoad = (project: SavedProject) => {
    try {
      const ws = JSON.parse(project.workspace)
      setWorkspace(ws)
      showToast(`Loaded "${project.name}"`, "info")
      toggle()
    } catch {
      showToast("Failed to load project", "error")
    }
  }

  const handleDelete = (id: string) => {
    const projects = savedProjects.filter((p) => p.id !== id)
    localStorage.setItem("lupa-projects", JSON.stringify(projects))
    setSavedProjects(projects)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0a0a0a]/80" onClick={toggle} />
      <div className="relative bg-[#121212] border border-border p-4 w-full max-w-md animate-fade-in max-h-[70vh] flex flex-col">
        <h2 className="text-sm font-bold text-[#ffffff] font-mono mb-3 uppercase tracking-wider">Save Project</h2>

        <div className="flex items-center gap-2 mb-4">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="flex-1 h-8 bg-[#1a1a1a] border border-border px-3 text-xs text-text-secondary font-mono outline-none focus:border-[#00ff41] placeholder:text-text-muted"
          />
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Check size={12} /> Save
          </Button>
        </div>

        {savedProjects.length > 0 && (
          <>
            <p className="text-[10px] text-text-muted font-mono mb-2 uppercase tracking-wider">Saved Projects</p>
            <div className="flex-1 overflow-y-auto space-y-1">
              {savedProjects.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 border border-border hover:border-[#2a2a2a] transition-colors group">
                  <button onClick={() => handleLoad(p)} className="flex-1 text-left min-w-0">
                    <p className="text-xs text-text-secondary font-mono font-bold truncate">{p.name}</p>
                    <p className="text-[10px] text-text-muted font-mono">
                      <Badge variant="info" className="text-[8px]">{p.language}</Badge>
                      {new Date(p.savedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {savedProjects.length === 0 && (
          <p className="text-xs text-text-muted font-mono text-center py-4">No saved projects yet</p>
        )}
      </div>
    </div>
  )
}

export { SaveProjectDialog }

