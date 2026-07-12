"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function CertificationsPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="success" className="mb-3">Certifications</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Certifications</h1>
        <p className="text-sm text-[#606060] font-mono">Coming soon. Practical exams, coding exams, AI viva, and skill verification.</p>
      </div>
    </Shell>
  )
}
