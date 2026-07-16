"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/Progress"
import { Spinner } from "@/components/ui/Spinner"
import Link from "next/link"
import ky from "ky"
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react"

type ReadinessResult = {
  overall: number
  prerequisites: Array<{ slug: string; name: string; confidence: number; required: boolean }>
  missingCount: number
  totalCount: number
  needsReview: boolean
}

function ReadinessScore({ concepts, type = "lesson", schoolSlug = "computer-science", moduleSlug = "programming-fundamentals" }: { concepts: string[]; type?: string; schoolSlug?: string; moduleSlug?: string }) {
  const [data, setData] = useState<ReadinessResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (concepts.length === 0) { setLoading(false); return }
    ky.get(`/api/v1/readiness?concepts=${concepts.join(",")}&type=${type}`)
      .json<ReadinessResult>()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [concepts, type])

  if (loading) return <div className="border border-border p-3 mb-4"><Spinner label="Calculating readiness..." /></div>
  if (!data || data.totalCount === 0) return null

  return (
    <div className="border border-border p-3 bg-surface mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
          {type === "project" ? "Project Readiness" : "Prerequisite Readiness"}
        </span>
        <span className="text-xs font-mono font-bold" style={{ color: data.overall >= 80 ? "var(--color-accent)" : data.overall >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>
          {data.overall}%
        </span>
      </div>

      <Progress value={data.overall} variant={data.overall >= 80 ? "success" : data.overall >= 50 ? "warning" : "error"} size="sm" className="mb-3" />

      <div className="space-y-1">
        {data.prerequisites.map((p) => (
          <div key={p.slug} className="flex items-center gap-2 text-xs font-mono">
            {p.confidence >= 70 ? (
              <CheckCircle size={12} className="text-accent shrink-0" />
            ) : p.confidence >= 40 ? (
              <AlertCircle size={12} className="text-warning shrink-0" />
            ) : (
              <AlertCircle size={12} className="text-danger shrink-0" />
            )}
            <Link href={`/learn/${schoolSlug}/${moduleSlug}/${p.slug}`} className="text-text-secondary hover:text-accent hover:underline truncate">
              {p.name}
            </Link>
            <span className="ml-auto text-text-muted">{p.confidence}%</span>
          </div>
        ))}
      </div>

      {data.needsReview && (
        <p className="text-[10px] text-warning font-mono mt-2">
          ⚠ Review highlighted concepts before continuing
        </p>
      )}
    </div>
  )
}

function WhyLearnThis({ conceptSlug }: { conceptSlug: string }) {
  const [unlocks, setUnlocks] = useState<Array<{ slug: string; name: string; domain: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conceptSlug) { setLoading(false); return }
    ky.get(`/api/v1/why-learn?concept=${conceptSlug}`)
      .json<{ unlocks: typeof unlocks }>()
      .then((res) => setUnlocks(res.unlocks))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [conceptSlug])

  if (loading) return null
  if (unlocks.length === 0) return null

  return (
    <div className="border border-border p-3 bg-surface mb-4">
      <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider mb-2">Why This Matters</p>
      <p className="text-xs text-text-secondary font-mono mb-2">Mastering this unlocks:</p>
      <div className="flex flex-wrap gap-1">
        {unlocks.map((u) => (
          <Link key={u.slug} href={`/explore?q=${u.slug}`} className="text-[10px] text-info hover:underline font-mono border border-border px-1.5 py-0.5">
            {u.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export { ReadinessScore, WhyLearnThis }


