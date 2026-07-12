"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function AiTutorPage() {
  return (
    <Shell>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e]">
          <Badge variant="info">AI Tutor</Badge>
          <span className="text-xs text-[#606060] font-mono">lupa@brain:~$</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-lg font-bold text-[#00f0ff] font-mono mb-2">AI Tutor</h2>
            <p className="text-sm text-[#606060] font-mono">
              Coming soon. Ask questions, get code reviews, generate examples, and more.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}
