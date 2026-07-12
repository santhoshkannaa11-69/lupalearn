"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { ArrowRight, Target, BookOpen } from "lucide-react"

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
          <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
            Continue Learning
          </CardTitle>
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
          <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <Target size={32} className="text-[#606060] mb-3" />
            <p className="text-sm text-[#c0c0c0] font-mono mb-1">No learning path yet</p>
            <p className="text-xs text-[#606060] font-mono">
              <Link href="/onboarding" className="text-[#00ff41] hover:underline">Set a goal</Link> to get personalized recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
          Continue Learning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <Link
              key={step.concept.slug}
              href={step.lessonSlugs[0]
                ? `/learn/computer-science/programming-fundamentals/${step.lessonSlugs[0]}`
                : `/explore?q=${step.concept.slug}`
              }
              className="block"
            >
              <div className="border border-[#1e1e1e] p-3 hover:border-[#2a2a2a] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 bg-[#1a1a1a] border border-[#1e1e1e] text-[10px] font-bold text-[#00ff41] font-mono shrink-0">
                        {step.order}
                      </span>
                      <p className="text-sm text-[#ffffff] font-mono font-bold truncate">
                        {step.concept.name}
                      </p>
                      <Badge variant={step.confidence < 40 ? "error" : step.confidence < 70 ? "warning" : "success"}>
                        {step.confidence}%
                      </Badge>
                    </div>
                    <p className="text-xs text-[#606060] font-mono mt-1 leading-relaxed">
                      {step.reason}
                    </p>
                    {step.unlocks.length > 0 && (
                      <p className="text-[10px] text-[#00f0ff] font-mono mt-1">
                        Unlocks: {step.unlocks.join(", ")}
                      </p>
                    )}
                  </div>
                  <ArrowRight size={14} className="text-[#606060] shrink-0 mt-1" />
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
