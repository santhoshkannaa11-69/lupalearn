"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { showToast } from "@/components/ui/Toast"
import { Send, CheckCircle, Clock, Archive, Eye } from "lucide-react"

type QueueItem = {
  id: string
  title: string
  slug: string
  status: "draft" | "review" | "scheduled" | "published" | "archived"
  updatedAt: string
  author: string
}

const MOCK_QUEUE: QueueItem[] = [
  { id: "1", title: "What Are Variables?", slug: "what-are-variables", status: "draft", updatedAt: "2026-07-12", author: "admin" },
  { id: "2", title: "Data Types in Python", slug: "data-types-in-python", status: "review", updatedAt: "2026-07-11", author: "admin" },
  { id: "3", title: "Functions: The Building Blocks", slug: "functions-basics", status: "published", updatedAt: "2026-07-10", author: "admin" },
]

const STATUS_CONFIG = {
  draft: { color: "#606060", icon: Clock, label: "Draft" },
  review: { color: "var(--color-warning)", icon: Eye, label: "In Review" },
  scheduled: { color: "var(--color-info)", icon: Clock, label: "Scheduled" },
  published: { color: "var(--color-accent)", icon: CheckCircle, label: "Published" },
  archived: { color: "var(--color-danger)", icon: Archive, label: "Archived" },
}

export default function PublishQueuePage() {
  const [items, setItems] = useState(MOCK_QUEUE)

  const handlePublish = async (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "published" } : i))
    showToast("Lesson published", "success")
  }

  const handleSubmitReview = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "review" } : i))
    showToast("Submitted for review", "info")
  }

  const handleArchive = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "archived" } : i))
    showToast("Lesson archived", "info")
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        <Badge variant="info" className="mb-2">Content</Badge>
        <h1 className="text-xl font-bold text-text-primary font-mono mb-6">Publish Queue</h1>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {(["draft", "review", "published", "archived"] as const).map((status) => {
            const cfg = STATUS_CONFIG[status]
            const count = items.filter((i) => i.status === status).length
            return (
              <Card key={status} variant="bordered">
                <CardContent>
                  <div className="flex items-center gap-2">
                    <cfg.icon size={14} style={{ color: cfg.color }} />
                    <span className="text-xs text-text-muted font-mono">{cfg.label}</span>
                  </div>
                  <p className="text-2xl font-bold font-mono mt-1" style={{ color: cfg.color }}>{count}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const cfg = STATUS_CONFIG[item.status]
            const Icon = cfg.icon
            return (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3 border border-border hover:border-border-hover transition-colors">
                <Icon size={16} style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-mono font-bold">{item.title}</p>
                  <p className="text-[10px] text-text-muted font-mono">
                    {item.slug} · {item.author} · {item.updatedAt}
                  </p>
                </div>
                <Badge variant="info" className="text-[10px]" style={{ borderColor: cfg.color, color: cfg.color }}>
                  {cfg.label}
                </Badge>
                <div className="flex items-center gap-1">
                  {item.status === "draft" && (
                    <Button variant="ghost" size="sm" onClick={() => handleSubmitReview(item.id)}>
                      Submit
                    </Button>
                  )}
                  {item.status === "review" && (
                    <Button variant="primary" size="sm" onClick={() => handlePublish(item.id)}>
                      <Send size={12} /> Publish
                    </Button>
                  )}
                  {item.status === "published" && (
                    <Button variant="ghost" size="sm" onClick={() => handleArchive(item.id)}>
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


