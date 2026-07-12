"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { Search, BookOpen, Code, Swords, ArrowRight } from "lucide-react"

type NodeResult = {
  id: string
  slug: string
  name: string
  type: string
  description: string | null
}

type LessonResult = {
  id: string
  slug: string
  title: string
  description: string | null
  difficulty: string
  duration: number | null
  xpReward: number
}

function ExploreContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [nodes, setNodes] = useState<NodeResult[]>([])
  const [lessons, setLessons] = useState<LessonResult[]>([])
  const [selectedNode, setSelectedNode] = useState<NodeResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setNodes([])
      setLessons([])
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await ky.get(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal }).json<{ nodes: NodeResult[] }>()
        setNodes(res.nodes)
        setSelectedNode(null)
        setLessons([])
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          console.error(e)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => { clearTimeout(timer); controller.abort() }

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!selectedNode) return
    setLoading(true)
    ky.get(`/api/lessons/by-concept?concept=${selectedNode.slug}`).json<{ lessons: LessonResult[] }>().then((res) => {
      setLessons(res.lessons)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [selectedNode])

  const typeColors: Record<string, string> = {
    concept: "#00ff41",
    language: "#00f0ff",
    framework: "#ffb000",
    tool: "#ff00aa",
    technology: "#00aaff",
    paradigm: "#ff3355",
    lesson: "#00ff41",
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Search Header */}
        <div className="mb-8">
          <Badge variant="info" className="mb-3">Explorer Mode 🚀</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Search anything</h1>
          <p className="text-sm text-[#606060] font-mono mb-4">
            Find lessons, concepts, technologies, and tools — no prerequisites required.
          </p>

          <Input
            prefix="> lupa@explore:~$ search"
            placeholder="e.g. variables, functions, Python, Docker..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-10 text-center">
            <Spinner label="Searching knowledge graph..." />
          </div>
        )}

        {/* Results */}
        {!loading && query && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nodes sidebar */}
            <div className="md:col-span-1">
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
                    Results ({nodes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {nodes.length === 0 ? (
                    <p className="text-xs text-[#606060] font-mono">No results found.</p>
                  ) : (
                    <div className="space-y-1">
                      {nodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors flex items-center gap-2 ${
                            selectedNode?.id === node.id
                              ? "bg-[#1a1a1a] text-[#00ff41] border-l-2 border-[#00ff41]"
                              : "text-[#c0c0c0] hover:bg-[#121212] border-l-2 border-transparent"
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-none flex-shrink-0"
                            style={{ backgroundColor: typeColors[node.type] || "#606060" }}
                          />
                          <span className="truncate">{node.name}</span>
                          <span className="ml-auto text-[10px] text-[#606060] uppercase">{node.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detail panel */}
            <div className="md:col-span-2">
              {selectedNode ? (
                <div>
                  <Card variant="bordered" className="mb-4">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-none"
                          style={{ backgroundColor: typeColors[selectedNode.type] || "#606060" }}
                        />
                        <Badge variant="info">{selectedNode.type}</Badge>
                        <CardTitle className="text-sm">{selectedNode.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-[#606060] font-mono">{selectedNode.description}</p>
                    </CardContent>
                  </Card>

                  <h3 className="text-xs font-bold text-[#ffffff] font-mono uppercase tracking-wider mb-3">
                    Related Lessons ({lessons.length})
                  </h3>

                  {lessons.length === 0 ? (
                    <p className="text-xs text-[#606060] font-mono">No lessons linked to this concept yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/learn/computer-science/programming-fundamentals/${lesson.slug}`}
                        >
                          <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer">
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-[#ffffff] font-mono font-bold">{lesson.title}</p>
                                  <p className="text-xs text-[#606060] font-mono mt-1">{lesson.description}</p>
                                </div>
                                <ArrowRight size={14} className="text-[#606060] shrink-0" />
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <Badge variant={lesson.difficulty === "beginner" ? "success" : lesson.difficulty === "intermediate" ? "warning" : "error"}>
                                  {lesson.difficulty}
                                </Badge>
                                <span className="text-[10px] text-[#606060] font-mono">{lesson.duration} min</span>
                                <span className="text-[10px] text-[#ffb000] font-mono">+{lesson.xpReward} XP</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border border-[#1e1e1e]">
                  <p className="text-xs text-[#606060] font-mono">
                    Select a result to see related lessons
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 border border-[#1e1e1e]">
            <Search size={40} className="text-[#606060] mb-4" />
            <h2 className="text-lg font-bold text-[#c0c0c0] font-mono mb-2">What do you want to learn?</h2>
            <p className="text-sm text-[#606060] font-mono text-center max-w-md">
              Search for any concept, technology, language, or tool.
              LupaLearn will find every connected lesson, project, and resource.
            </p>
          </div>
        )}
      </div>
    </Shell>
  )
}

export { ExploreContent }
