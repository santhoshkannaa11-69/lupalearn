"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function ProjectsPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="warning" className="mb-3">Projects</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Projects</h1>
        <p className="text-sm text-[#606060] font-mono">Coming soon. Beginner, intermediate, and advanced projects with guided builds.</p>
      </div>
    </Shell>
  )
}
