"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import {
  FileText, CircleDot, Share2, AlertTriangle, HeartPulse,
  BookOpen, CheckCircle, XCircle, AlertCircle, GitBranch,
} from "lucide-react"

type HealthCheck = {
  name: string
  status: "pass" | "fail" | "warn"
  message: string
  count?: number
}

type HealthReport = {
  score: number
  checks: HealthCheck[]
  timestamp: number
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<HealthReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/admin/health")
      .json<{ health: HealthReport }>()
      .then((res) => setHealth(res.health))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle size={12} className="text-accent" />
      case "fail": return <XCircle size={12} className="text-danger" />
      case "warn": return <AlertCircle size={12} className="text-warning" />
      default: return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="info" className="mb-3">Admin</Badge>
          <h1 className="text-2xl font-bold text-text-primary font-mono">Dashboard</h1>
          <p className="text-sm text-text-muted font-mono mt-1">Content and knowledge graph overview</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-info" />
                <CardTitle className="text-[10px] text-text-muted uppercase">Lessons</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-info font-mono" id="stat-lessons">—</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CircleDot size={14} className="text-accent" />
                <CardTitle className="text-[10px] text-text-muted uppercase">Concepts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent font-mono" id="stat-concepts">—</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 size={14} className="text-warning" />
                <CardTitle className="text-[10px] text-text-muted uppercase">Relationships</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning font-mono" id="stat-edges">—</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HeartPulse size={14} className="text-accent" />
                <CardTitle className="text-[10px] text-text-muted uppercase">Graph Health</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Spinner label="Loading..." />
              ) : (
                <>
                  <p className="text-2xl font-bold font-mono" style={{ color: (health?.score || 0) >= 80 ? "var(--color-accent)" : (health?.score || 0) >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>
                    {health?.score ?? "—"}%
                  </p>
                  <p className="text-[10px] text-text-muted font-mono mt-1">
                    {health?.checks.filter((c) => c.status === "pass").length ?? 0}/{health?.checks.length ?? 0} checks passing
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Graph Health Checks */}
        <Card variant="bordered" className="mb-8">
          <CardHeader>
            <CardTitle className="text-[10px] text-text-muted uppercase tracking-widest">Graph Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Spinner label="Running health checks..." />
            ) : (
              <div className="space-y-2">
                {health?.checks.map((check) => (
                  <div key={check.name} className="flex items-start gap-3 px-3 py-2 border border-border">
                    <div className="mt-0.5">{statusIcon(check.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-text-primary font-mono font-bold">{check.name}</p>
                        <span className="text-[10px] font-mono uppercase"
                          style={{ color: check.status === "pass" ? "var(--color-accent)" : check.status === "fail" ? "var(--color-danger)" : "var(--color-warning)" }}
                        >
                          {check.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted font-mono mt-0.5">{check.message}</p>
                    </div>
                    {check.count !== undefined && (
                      <span className="text-xs text-text-muted font-mono shrink-0">{check.count}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-3">
          <Link href="/admin/lessons/new" className="block">
            <Card variant="bordered" className="hover:border-border-hover transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-accent" />
                  <CardTitle className="text-xs text-text-primary">New Lesson</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-text-muted font-mono">Create a new lesson with MDX editor and live preview</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/graph" className="block">
            <Card variant="bordered" className="hover:border-border-hover transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitBranch size={14} className="text-info" />
                  <CardTitle className="text-xs text-text-primary">Graph Editor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-text-muted font-mono">Visualize and edit the knowledge graph</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/graph/orphans" className="block">
            <Card variant="bordered" className="hover:border-border-hover transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HeartPulse size={14} className="text-warning" />
                  <CardTitle className="text-xs text-text-primary">Graph Health</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-text-muted font-mono">Run integrity checks and fix issues</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"


