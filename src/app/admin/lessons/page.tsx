"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"

export default function LessonsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Badge variant="info" className="mb-2">Content</Badge>
          <h1 className="text-xl font-bold text-[#ffffff] font-mono">Lessons</h1>
        </div>
        <Link href="/admin/lessons/new">
          <Button variant="primary" size="sm"><Plus size={14} /> New Lesson</Button>
        </Link>
      </div>
      <p className="text-sm text-[#606060] font-mono">Lesson list coming soon. Use the lesson editor to create and manage content.</p>
    </div>
  )
}
