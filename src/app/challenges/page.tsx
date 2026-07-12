"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function ChallengesPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="warning" className="mb-3">Challenges</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Coding Challenges</h1>
        <p className="text-sm text-[#606060] font-mono">Coming soon. Daily, weekly, and monthly challenges with leaderboards.</p>
      </div>
    </Shell>
  )
}
