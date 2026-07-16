"use client"

import { Shell } from "@/components/layout/Shell"
import { TutorChat } from "@/components/ai/TutorChat"

export default function AiTutorPage() {
  return (
    <Shell>
      <div className="h-full bg-bg">
        <TutorChat />
      </div>
    </Shell>
  )
}
