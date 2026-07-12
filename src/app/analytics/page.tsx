"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function AnalyticsPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="warning" className="mb-3">Analytics</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Analytics</h1>
        <p className="text-sm text-[#606060] font-mono">Coming soon. Learning time, skill progress, weak areas, activity heatmap, and AI recommendations.</p>
      </div>
    </Shell>
  )
}
