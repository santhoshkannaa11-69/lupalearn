"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { NextSteps } from "@/components/dashboard/NextSteps"
import { Recommendations } from "@/components/dashboard/Recommendations"
import { useEffect, useState } from "react"
import ky from "ky"
import { BookOpen, Zap, Flame, Award } from "lucide-react"

type Summary = {
  averageConfidence: number
  totalConcepts: number
  weakCount: number
  inProgressCount: number
  masteredCount: number
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    ky.get("/api/v1/confidence?userId=anonymous")
      .json<Summary>()
      .then(setSummary)
      .catch(() => {})
  }, [])

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="success" className="mb-3">Dashboard</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono">lupa@learn:~/dashboard</h1>
          <p className="text-sm text-[#606060] font-mono mt-1">Your learning overview and next steps</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#ffb000]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Mastery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ffb000] font-mono">
                {summary?.averageConfidence ?? "—"}%
              </p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">Average confidence</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-[#00ff41]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Mastered</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00ff41] font-mono">{summary?.masteredCount ?? 0}</p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">of {summary?.totalConcepts ?? 0} concepts</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[#00f0ff]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">In Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00f0ff] font-mono">{summary?.inProgressCount ?? 0}</p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">concepts being learned</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-[#ff3355]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Weak Areas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ff3355] font-mono">{summary?.weakCount ?? 0}</p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content: Next Steps + Recommendations */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <NextSteps />
          </div>
          <div className="md:col-span-2">
            <Recommendations />
          </div>
        </div>
      </div>
    </Shell>
  )
}
