"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { ArrowRight, Target } from "lucide-react"

type NextStep = {
  concept: { slug: string; name: string; type: string; description: string | null }
  reason: string
  unlocks: string[]
  confidence: number
  order: number
  lessonsCount: number
  lessonSlugs: string[]
}

function NextSteps() {
  const [steps, setSteps] = useState<NextStep[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/v1/progress/next-steps?userId=anonymous&limit=5")
      .json<{ steps: NextStep[] }>()
      .then((res) => setSteps(res.steps))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-[10px] text-text-muted uppercase tracking-widest">Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <Spinner label="Calculating next steps..." />
        </CardContent>
      </Card>
    )
  }

  if (steps.length === 0) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-[10px] text-text-muted uppercase tracking-widest">Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Target size={32} className="text-text-muted mb-3" />
            <p className="text-sm text-text-secondary font-mono mb-1">No learning path yet</p>
            <p className="text-xs text-text-muted font-mono">
              <Link href="/onboarding" className="text-accent hover:underline">Set a goal</Link> to get personalized recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle className="text-[10px] text-text-muted uppercase tracking-widest">Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <Link
              key={step.concept.slug}
              href={step.lessonSlugs[0]
                ? `/learn/computer-science/programming-fundamentals/${step.lessonSlugs[0]}`
                : `/explore?q=${step.concept.slug}`
              }
              className="block"
            >
              <div className="border border-border p-3 hover:border-border-hover transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 bg-surface border border-border text-[10px] font-bold text-accent font-mono shrink-0">
                        {step.order}
                      </span>
                      <p className="text-sm text-text-primary font-mono font-bold truncate">{step.concept.name}</p>
                      <Badge variant={step.confidence < 40 ? "error" : step.confidence < 70 ? "warning" : "success"}>
                        {step.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted font-mono mt-1 leading-relaxed">{step.reason}</p>
                    {step.unlocks.length > 0 && (
                      <p className="text-[10px] text-info font-mono mt-1">Unlocks: {step.unlocks.join(", ")}</p>
                    )}
                  </div>
                  <ArrowRight size={14} className="text-text-muted shrink-0 mt-1" />
                </div>
                <Progress value={step.confidence} variant={step.confidence < 40 ? "error" : step.confidence < 70 ? "warning" : "success"} className="mt-2" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { NextSteps }

