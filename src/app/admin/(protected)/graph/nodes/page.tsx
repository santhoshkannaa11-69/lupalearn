"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { showToast } from "@/components/ui/Toast"
import ky from "ky"
import { Plus, Trash2 } from "lucide-react"

type GraphNode = { id: string; slug: string; name: string; type: string; description: string | null }

export default function NodesPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newType, setNewType] = useState("concept")

  useEffect(() => {
    ky.get("/api/admin/graph-data")
      .json<{ nodes: GraphNode[] }>()
      .then((res) => setNodes(res.nodes))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    if (!newName || !newSlug) return
    showToast(`Created: ${newName} (${newType})`, "success")
    setNodes((prev) => [...prev, { id: `new-${Date.now()}`, slug: newSlug, name: newName, type: newType, description: null }])
    setNewName(""); setNewSlug("")
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Badge variant="info" className="mb-2">Knowledge / Nodes</Badge>
      <h1 className="text-xl font-bold text-[#ffffff] font-mono mb-6">Concept & Node Editor</h1>

      <Card variant="bordered" className="mb-6">
        <CardHeader><CardTitle className="text-xs text-[#ffffff] font-mono">Create New Node</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-[#606060] font-mono block mb-1">Name</label>
              <Input value={newName} onChange={(e) => { setNewName(e.target.value); setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")) }} placeholder="Node name" />
            </div>
            <div>
              <label className="text-[10px] text-[#606060] font-mono block mb-1">Slug</label>
              <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} prefix="/" />
            </div>
            <div>
              <label className="text-[10px] text-[#606060] font-mono block mb-1">Type</label>
              <select value={newType} onChange={(e) => setNewType(e.target.value)}
                className="h-9 bg-[#121212] border border-[#1e1e1e] text-xs text-[#c0c0c0] font-mono px-2 outline-none focus:border-[#00ff41]">
                {["concept","language","framework","tool","technology","paradigm"].map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreate}><Plus size={14} /> Create</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? <Spinner label="Loading nodes..." /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {nodes.sort((a, b) => a.name.localeCompare(b.name)).map((node) => (
            <div key={node.id} className="p-3 border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors">
              <p className="text-xs text-[#ffffff] font-mono font-bold truncate">{node.name}</p>
              <p className="text-[10px] text-[#606060] font-mono truncate">{node.slug}</p>
              <span className="text-[10px] font-mono uppercase" style={{ color: node.type === "concept" ? "#00ff41" : node.type === "language" ? "#00f0ff" : node.type === "framework" ? "#ffb000" : "#606060" }}>{node.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
