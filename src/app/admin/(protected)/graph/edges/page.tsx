"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { showToast } from "@/components/ui/Toast"
import ky from "ky"
import { Plus, Trash2 } from "lucide-react"

type GraphNode = { id: string; slug: string; name: string; type: string }
type GraphEdge = { id: string; sourceId: string; targetId: string; relationType: string }

export default function EdgesPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceId, setSourceId] = useState("")
  const [targetId, setTargetId] = useState("")
  const [relType, setRelType] = useState("requires")

  useEffect(() => {
    ky.get("/api/admin/graph-data")
      .json<{ nodes: GraphNode[]; edges: GraphEdge[] }>()
      .then((res) => { setNodes(res.nodes); setEdges(res.edges) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    if (!sourceId || !targetId) return
    showToast(`Edge created: ${relType}`, "success")
    setEdges((prev) => [...prev, { id: `new-${Date.now()}`, sourceId, targetId, relationType: relType }])
  }

  const nodeName = (id: string) => nodes.find((n) => n.id === id)?.name || id.slice(0, 8)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Badge variant="info" className="mb-2">Knowledge / Relationships</Badge>
      <h1 className="text-xl font-bold text-text-primary font-mono mb-6">Edge Editor</h1>

      <Card variant="bordered" className="mb-6">
        <CardHeader><CardTitle className="text-xs text-text-primary font-mono">Create New Edge</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <div>
              <label className="text-[10px] text-text-muted font-mono block mb-1">Source</label>
              <select value={sourceId} onChange={(e) => setSourceId(e.target.value)}
                className="h-9 bg-surface border border-border text-xs text-text-secondary font-mono px-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 w-40">
                <option value="">Select...</option>
                {nodes.sort((a, b) => a.name.localeCompare(b.name)).map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-text-muted font-mono block mb-1">Relation</label>
              <select value={relType} onChange={(e) => setRelType(e.target.value)}
                className="h-9 bg-surface border border-border text-xs text-text-secondary font-mono px-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                {["requires","teaches","related_to","references","part_of","extends","recommends","precedes","alternative_to"].map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-text-muted font-mono block mb-1">Target</label>
              <select value={targetId} onChange={(e) => setTargetId(e.target.value)}
                className="h-9 bg-surface border border-border text-xs text-text-secondary font-mono px-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 w-40">
                <option value="">Select...</option>
                {nodes.sort((a, b) => a.name.localeCompare(b.name)).map((n) => (<option key={n.id} value={n.id}>{n.name}</option>))}
              </select>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreate}><Plus size={14} /> Create Edge</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? <Spinner label="Loading edges..." /> : (
        <div className="space-y-1">
          {edges.sort((a, b) => a.relationType.localeCompare(b.relationType)).map((edge) => (
            <div key={edge.id} className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs font-mono">
              <span className="text-text-secondary">{nodeName(edge.sourceId)}</span>
              <span className="text-[10px]" style={{ color: edge.relationType === "requires" ? "var(--color-danger)" : edge.relationType === "teaches" ? "var(--color-accent)" : "var(--color-warning)" }}>
                ──[{edge.relationType}]──
              </span>
              <span className="text-text-secondary">{nodeName(edge.targetId)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



