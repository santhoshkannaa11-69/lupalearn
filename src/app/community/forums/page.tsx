"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

const TOPICS = [
  { title: "What's the best way to practice recursion?", replies: 5, concept: "recursion" },
  { title: "Help understanding closures in JavaScript", replies: 3, concept: "closures" },
  { title: "Tips for the Weather CLI capstone project", replies: 8, concept: "functions" },
  { title: "Comparison: for loops vs while loops", replies: 4, concept: "loops" },
]

export default function ForumsPage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Badge variant="info" className="mb-3">Community / Forums</Badge>
        <h1 className="text-xl font-bold text-text-primary font-mono mb-6">Discussions</h1>
        <div className="space-y-2">
          {TOPICS.map((t) => (
            <div key={t.title} className="flex items-center gap-4 px-4 py-3 border border-border hover:border-border-hover transition-colors cursor-pointer">
              <MessageSquare size={16} className="text-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-mono font-bold truncate">{t.title}</p>
                <p className="text-xs text-text-muted font-mono">{t.replies} replies · #{t.concept}</p>
              </div>
              <ArrowRight size={14} className="text-text-muted shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

