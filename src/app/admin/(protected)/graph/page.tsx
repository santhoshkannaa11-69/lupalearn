"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"

type GraphNode = { id: string; slug: string; name: string; type: string }
type GraphEdge = { id: string; sourceId: string; targetId: string; relationType: string }

type GraphData = { nodes: GraphNode[]; edges: GraphEdge[] }

const NODE_COLORS: Record<string, string> = {
  concept: "var(--color-accent)", language: "var(--color-info)", framework: "var(--color-warning)",
  tool: "#ff00aa", lesson: "#606060", technology: "var(--color-info)",
}

const EDGE_COLORS: Record<string, string> = {
  requires: "var(--color-danger)", teaches: "var(--color-accent)", related_to: "var(--color-warning)",
}

const NODE_RADIUS = 28

export default function GraphPage() {
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    ky.get("/api/admin/graph-data")
      .json<GraphData>()
      .then((res) => {
        setData(res)
        // Layout: distribute nodes in a circle
        const pos: Record<string, { x: number; y: number }> = {}
        const center = 300
        const radius = 200
        res.nodes.forEach((n, i) => {
          const angle = (2 * Math.PI * i) / res.nodes.length
          pos[n.id] = { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) }
        })
        setPositions(pos)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }, [dragging, dragStart])

  const handleMouseUp = useCallback(() => setDragging(false), [])

  const handleNodeClick = (node: GraphNode) => setSelectedNode(node)

  const zoomIn = () => setScale((s) => Math.min(s * 1.3, 5))
  const zoomOut = () => setScale((s) => Math.max(s / 1.3, 0.2))
  const resetView = () => { setScale(1); setOffset({ x: 0, y: 0 }) }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Spinner label="Loading graph..." /></div>

  return (
    <div className="flex-1 overflow-hidden flex bg-bg">
      {/* Graph Canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="info" className="mb-1">Knowledge Graph</Badge>
          <p className="text-[10px] text-text-muted font-mono">{data?.nodes.length} nodes · {data?.edges.length} edges</p>
        </div>

        <div className="absolute top-3 right-3 z-10 flex gap-1">
          <button onClick={zoomIn} className="p-1.5 bg-surface border border-border text-text-secondary hover:text-accent"><ZoomIn size={14} /></button>
          <button onClick={zoomOut} className="p-1.5 bg-surface border border-border text-text-secondary hover:text-accent"><ZoomOut size={14} /></button>
          <button onClick={resetView} className="p-1.5 bg-surface border border-border text-text-secondary hover:text-accent"><Maximize size={14} /></button>
        </div>

        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {/* Edges */}
            {data?.edges.map((edge) => {
              const src = positions[edge.sourceId]
              const tgt = positions[edge.targetId]
              if (!src || !tgt) return null
              return (
                <line
                  key={edge.id}
                  x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                  stroke={EDGE_COLORS[edge.relationType] || "var(--color-border)"}
                  strokeWidth={1}
                  strokeDasharray={edge.relationType === "related_to" ? "4,4" : undefined}
                  opacity={0.6}
                />
              )
            })}

            {/* Nodes */}
            {data?.nodes.map((node) => {
              const pos = positions[node.id]
              if (!pos) return null
              const isSelected = selectedNode?.id === node.id
              const color = NODE_COLORS[node.type] || "#606060"
              return (
                <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                  <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS}
                    fill={isSelected ? color : "var(--color-surface)"}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    opacity={isSelected ? 1 : 0.8}
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                    fill={isSelected ? "var(--color-bg)" : "var(--color-text-secondary)"}
                    fontSize={8} fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.name.length > 10 ? node.name.slice(0, 9) + "…" : node.name}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Node Detail Panel */}
      <div className="w-64 border-l border-border p-4 overflow-y-auto bg-bg">
        {selectedNode ? (
          <div>
            <p className="text-xs font-bold text-text-primary font-mono mb-1">{selectedNode.name}</p>
            <p className="text-[10px] text-text-muted font-mono mb-3">/{selectedNode.slug} · <span style={{ color: NODE_COLORS[selectedNode.type] || "#606060" }}>{selectedNode.type}</span></p>

            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">Connections</p>
            <div className="space-y-1 mb-4">
              {data?.edges.filter((e) => e.sourceId === selectedNode.id || e.targetId === selectedNode.id).map((edge) => {
                const otherId = edge.sourceId === selectedNode.id ? edge.targetId : edge.sourceId
                const other = data?.nodes.find((n) => n.id === otherId)
                const dir = edge.sourceId === selectedNode.id ? "→" : "←"
                return (
                  <div key={edge.id} className="text-[10px] font-mono flex items-center gap-1">
                    <span style={{ color: EDGE_COLORS[edge.relationType] || "#606060" }}>{dir}</span>
                    <span className="text-text-muted">{edge.relationType}</span>
                    <span className="text-text-secondary">{other?.name || "?"}</span>
                  </div>
                )
              })}
              {data?.edges.filter((e) => e.sourceId === selectedNode.id || e.targetId === selectedNode.id).length === 0 && (
                <p className="text-[10px] text-text-muted font-mono italic">No connections</p>
              )}
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="text-[10px] text-text-muted font-mono hover:text-text-secondary"
            >
              [Deselect]
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xs text-text-muted font-mono">Click a node to see details</p>
            <p className="text-[10px] text-text-muted font-mono mt-2">Drag to pan · Scroll to zoom</p>
            <div className="mt-6 text-left space-y-1">
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">Legend</p>
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-text-muted">{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


