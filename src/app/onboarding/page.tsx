"use client"

import { useState } from "react"
import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Spinner } from "@/components/ui/Spinner"
import { Input } from "@/components/ui/Input"
import ky from "ky"
import { ArrowRight, CheckCircle, Target, Clock, BookOpen, BarChart3 } from "lucide-react"

type Step = {
  node: { slug: string; name: string; type: string; description: string | null }
  order: number
  prerequisites: Array<{ slug: string; name: string }>
  lessonsCount: number
  lessonSlugs: string[]
}

type Roadmap = {
  goal: string
  steps: Step[]
  estimatedHours: number
  difficulty: string
}

const QUICK_GOALS = [
  { label: "Backend Developer", icon: "🖥️", desc: "APIs, databases, servers" },
  { label: "Frontend Developer", icon: "🎨", desc: "UI, frameworks, browsers" },
  { label: "Full Stack Developer", icon: "⚡", desc: "Frontend + backend" },
  { label: "DevOps Engineer", icon: "☁️", desc: "Cloud, CI/CD, infra" },
  { label: "AI / ML Engineer", icon: "🤖", desc: "Machine learning, AI" },
  { label: "Learn Python", icon: "🐍", desc: "Python fundamentals" },
  { label: "Learn Rust", icon: "🦀", desc: "Systems programming" },
  { label: "Learn JavaScript", icon: "📜", desc: "JS fundamentals" },
]

export default function OnboardingPage() {
  const [goal, setGoal] = useState("")
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generateRoadmap(g: string) {
    if (!g.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await ky.get(`/api/roadmap/generate?goal=${encodeURIComponent(g)}`).json<{ roadmap: Roadmap }>()
      setRoadmap(res.roadmap)
    } catch {
      setError("Failed to generate roadmap. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const levelColors: Record<string, string> = {
    beginner: "var(--color-accent)",
    intermediate: "var(--color-warning)",
    advanced: "var(--color-danger)",
  }

  return (
    <Shell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Step 1: Ask the goal */}
        {!roadmap && !loading && (
          <>
            <div className="text-center mb-10">
              <Badge variant="info" className="mb-4">AI Mode 🤖</Badge>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary font-mono mb-3">
                What do you want to learn?
              </h1>
              <p className="text-sm text-text-muted font-mono max-w-lg mx-auto">
                Tell LupaLearn your goal. I'll generate a personalized learning roadmap
                from the knowledge graph.
              </p>
            </div>

            <div className="max-w-xl mx-auto mb-10">
              <Input
                prefix="> lupa@brain:~$"
                placeholder="e.g. I want to become a backend developer..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateRoadmap(goal)}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => generateRoadmap(goal)}
                  disabled={!goal.trim()}
                >
                  Generate Roadmap <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-xs text-text-muted font-mono text-center mb-4 uppercase tracking-wider">
                Quick goals
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {QUICK_GOALS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => {
                      setGoal(q.label)
                      generateRoadmap(q.label)
                    }}
                    className="text-left px-3 py-3 border border-border hover:border-border-hover transition-colors bg-surface"
                  >
                    <span className="text-lg">{q.icon}</span>
                    <p className="text-xs text-text-primary font-mono font-bold mt-1">{q.label}</p>
                    <p className="text-[10px] text-text-muted font-mono mt-0.5">{q.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner label="Generating your personalized roadmap..." />
            <p className="text-xs text-text-muted font-mono mt-4">Traversing the knowledge graph...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10">
            <p className="text-sm text-danger font-mono">{error}</p>
            <Button variant="ghost" size="sm" onClick={() => setRoadmap(null)} className="mt-4">
              Try again
            </Button>
          </div>
        )}

        {/* Step 2: View generated roadmap */}
        {roadmap && !loading && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="success" className="mb-3">Your Personalized Roadmap 🎯</Badge>
                  <h1 className="text-xl md:text-2xl font-bold text-text-primary font-mono">
                    {roadmap.goal}
                  </h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setRoadmap(null); setGoal("") }}>
                  [New Goal]
                </Button>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-text-secondary">
                  <BookOpen size={12} /> {roadmap.steps.length} concepts
                </span>
                <span className="flex items-center gap-1 text-text-secondary">
                  <Clock size={12} /> ~{roadmap.estimatedHours}h
                </span>
                <Badge
                  variant={roadmap.difficulty === "beginner" ? "success" : roadmap.difficulty === "intermediate" ? "warning" : "error"}
                >
                  {roadmap.difficulty}
                </Badge>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2 mb-8">
              {roadmap.steps.map((step, i) => (
                <Link
                  key={step.node.slug}
                  href={step.lessonSlugs[0] ? `/learn/computer-science/programming-fundamentals/${step.lessonSlugs[0]}` : `/explore?q=${step.node.slug}`}
                >
                  <Card variant="bordered" className="hover:border-border-hover transition-colors cursor-pointer">
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-surface border border-border shrink-0">
                          <span className="text-xs font-bold text-accent font-mono">{step.order}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-text-primary font-mono font-bold">{step.node.name}</p>
                            <span className="text-[10px] text-text-muted uppercase">{step.node.type}</span>
                          </div>
                          {step.node.description && (
                            <p className="text-xs text-text-muted font-mono mt-0.5 truncate">{step.node.description}</p>
                          )}
                        </div>
                        {step.prerequisites.length > 0 && (
                          <div className="hidden md:flex items-center gap-1 text-[10px] text-text-muted font-mono">
                            <span>requires:</span>
                            {step.prerequisites.map((p) => (
                              <span key={p.slug} className="text-info">{p.name}</span>
                            ))}
                          </div>
                        )}
                        <ArrowRight size={14} className="text-text-muted shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Start button */}
            <div className="flex items-center justify-center gap-4 border-t border-border pt-6">
              <Link href={roadmap.steps[0]?.lessonSlugs[0] ? `/learn/computer-science/programming-fundamentals/${roadmap.steps[0].lessonSlugs[0]}` : "/explore"}>
                <Button variant="primary" size="lg">
                  <CheckCircle size={16} />
                  Start Learning: {roadmap.steps[0]?.node.name || "First Lesson"}
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="ghost" size="sm">
                  Or explore freely
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}


