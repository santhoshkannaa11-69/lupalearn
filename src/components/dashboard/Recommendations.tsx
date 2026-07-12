"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { ArrowRight, BookOpen, RotateCcw, TrendingUp } from "lucide-react"

type Recommendation = {
  type: string
  title: string
  description: string
  reason: string
  href: string
  priority: number
}

type RecsByCategory = Record<string, Recommendation[]>

const categoryMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  "continue-learning": { label: "Continue Learning", icon: BookOpen, color: "#00ff41" },
  "review-again": { label: "Review Again", icon: RotateCcw, color: "#ffb000" },
  trending: { label: "Trending", icon: TrendingUp, color: "#00f0ff" },
}

function Recommendations() {
  const [categories, setCategories] = useState<RecsByCategory>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/v1/recommendations?userId=anonymous")
      .json<{ categories: RecsByCategory }>()
      .then((res) => setCategories(res.categories))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Spinner label="Loading recommendations..." />
        </CardContent>
      </Card>
    )
  }

  const categoryKeys = Object.keys(categories)
  if (categoryKeys.length === 0) {
    return (
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[#606060] font-mono text-center py-4">
            Complete some lessons to see recommendations.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {categoryKeys.map((catKey) => {
        const meta = categoryMeta[catKey] || { label: catKey, icon: BookOpen, color: "#606060" }
        const items = categories[catKey]
        const Icon = meta.icon

        return (
          <Card key={catKey} variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon size={14} style={{ color: meta.color }} />
                <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">
                  {meta.label}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <Link key={i} href={item.href}>
                    <div className="flex items-start justify-between gap-3 px-3 py-2 border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#ffffff] font-mono font-bold">{item.title}</p>
                        <p className="text-[10px] text-[#606060] font-mono mt-0.5">{item.description}</p>
                        <p className="text-[10px] text-[#606060] font-mono mt-0.5 italic">
                          💡 {item.reason}
                        </p>
                      </div>
                      <ArrowRight size={12} className="text-[#606060] shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { Recommendations }
