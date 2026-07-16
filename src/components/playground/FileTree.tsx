"use client"

import { useState } from "react"
import { useEditorStore, type FileNode, type FolderNode } from "@/stores/editorStore"
import { cn } from "@/lib/utils"
import { File, Folder, FolderOpen, Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react"

function FileTreeItem({ node, path }: { node: FileNode | FolderNode; path: string }) {
  const [expanded, setExpanded] = useState(false)
  const activeFile = useEditorStore((s) => s.activeFile)
  const openFile = useEditorStore((s) => s.openFile)
  const deleteFile = useEditorStore((s) => s.deleteFile)

  const isFolder = "children" in node
  const isActive = !isFolder && activeFile === node.path

  if (isFolder) {
    const folder = node as FolderNode
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-text-muted hover:text-text-secondary hover:bg-[#121212] transition-colors text-left"
          )}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {expanded ? <FolderOpen size={12} className="text-[#00f0ff]" /> : <Folder size={12} className="text-[#00f0ff]" />}
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && (
          <div className="ml-3 border-l border-border pl-1">
            {folder.children.map((child) => (
              <FileTreeItem key={child.path} node={child} path={child.path} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const file = node as FileNode

  return (
    <div className="group flex items-center">
      <button
        onClick={() => openFile(node.path)}
        className={cn(
          "flex-1 flex items-center gap-1.5 px-2 py-1 text-xs font-mono transition-colors text-left min-w-0",
          isActive
            ? "bg-[#1a1a1a] text-accent border-l-2 border-[#00ff41]"
            : "text-text-muted hover:text-text-secondary hover:bg-[#121212] border-l-2 border-transparent"
        )}
      >
        <File size={12} />
        <span className="truncate">{node.name}</span>
      </button>
      <button
        onClick={() => deleteFile(node.path)}
        className="opacity-0 group-hover:opacity-100 px-1 text-text-muted hover:text-danger transition-all"
      >
        <Trash2 size={10} />
      </button>
    </div>
  )
}

function FileTree() {
  const workspace = useEditorStore((s) => s.workspace)
  const sidebarOpen = useEditorStore((s) => s.sidebarOpen)
  const toggleNewFileDialog = useEditorStore((s) => s.toggleNewFileDialog)
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar)

  if (!sidebarOpen) return null

  return (
    <div className="w-52 bg-[#0a0a0a] border-r border-border flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Files</span>
        <button
          onClick={toggleNewFileDialog}
          className="text-text-muted hover:text-accent transition-colors"
          title="New File"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        <FileTreeItem node={workspace.root} path={workspace.root.path} />
      </div>
    </div>
  )
}

export { FileTree }

