"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function CommunityPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="info" className="mb-3">Community</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Community</h1>
        <p className="text-sm text-[#606060] font-mono">Coming soon. Forums, blogs, project showcase, study groups, and events.</p>
      </div>
    </Shell>
  )
}
