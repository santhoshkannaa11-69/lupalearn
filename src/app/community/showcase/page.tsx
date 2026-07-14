"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Code2, Heart, MessageCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

const PROJECTS = [
  { title: "Calculator App", author: "Anonymous", desc: "A full-featured calculator with history", tags: ["javascript", "beginner"], likes: 12, comments: 3 },
  { title: "Todo List Manager", author: "Anonymous", desc: "CLI todo app with file persistence", tags: ["python", "intermediate"], likes: 8, comments: 5 },
  { title: "Number Guessing Game", author: "Anonymous", desc: "Interactive game with difficulty levels", tags: ["javascript", "beginner"], likes: 15, comments: 7 },
]

export default function ShowcasePage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="warning" className="mb-3">Community / Showcase</Badge>
        <h1 className="text-xl font-bold text-[#ffffff] font-mono mb-6">Project Showcase</h1>

        <div className="grid md:grid-cols-3 gap-4">
          {PROJECTS.map((p) => (
            <Card key={p.title} variant="bordered">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-[#ffb000]" />
                  <CardTitle className="text-xs text-[#ffffff] font-mono">{p.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#606060] font-mono mb-3">{p.desc}</p>
                <div className="flex items-center gap-2 mb-3">
                  {p.tags.map((t) => <span key={t} className="text-[10px] text-[#00f0ff] font-mono">#{t}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-[#606060] font-mono">
                  <span>{p.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><Heart size={12} />{p.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} />{p.comments}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  )
}
