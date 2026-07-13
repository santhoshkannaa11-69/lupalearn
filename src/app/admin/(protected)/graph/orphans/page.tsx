"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import { Progress } from "@/components/ui/Progress"
import ky from "ky"

type HealthCheck = { name: string; status: "pass" | "fail" | "warn"; message: string; count?: number; items?: Array<{ name: string; slug: string }> }

export default function OrphansPage() {
  const [health, setHealth] = useState<{ score: number; checks: HealthCheck[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/admin/health")
      .json<{ health: { score: number; checks: HealthCheck[] } }>()
      .then((res) => setHealth(res.health))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex-1 flex items-center justify-center"><Spinner label="Running health checks..." /></div>

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Badge variant="warning" className="mb-2">Knowledge / Graph Health</Badge>
      <h1 className="text-xl font-bold text-[#ffffff] font-mono mb-2">Graph Health & Orphan Detector</h1>
      <p className="text-sm text-[#606060] font-mono mb-6">
        Health Score: <span style={{ color: (health?.score || 0) >= 80 ? "#00ff41" : "#ffb000" }}>{health?.score ?? "—"}%</span>
      </p>

      <div className="space-y-3">
        {health?.checks.map((check) => (
          <Card key={check.name} variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-none ${check.status === "pass" ? "bg-[#00ff41]" : check.status === "fail" ? "bg-[#ff3355]" : "bg-[#ffb000]"}`} />
                <CardTitle className="text-xs text-[#ffffff] font-mono">{check.name}</CardTitle>
                <span className={`text-[10px] font-mono uppercase ${check.status === "pass" ? "text-[#00ff41]" : check.status === "fail" ? "text-[#ff3355]" : "text-[#ffb000]"}`}>{check.status}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[#606060] font-mono mb-2">{check.message}</p>
              {check.items && check.items.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {check.items.map((item) => (
                    <span key={item.slug} className="text-[10px] text-[#c0c0c0] font-mono border border-[#1e1e1e] px-1.5 py-0.5">
                      {item.name}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
