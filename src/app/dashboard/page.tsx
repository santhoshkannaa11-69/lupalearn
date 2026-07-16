"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { NextSteps } from "@/components/dashboard/NextSteps"
import { Recommendations } from "@/components/dashboard/Recommendations"
import { Spinner } from "@/components/ui/Spinner"
import { useEffect, useState } from "react"
import ky from "ky"
import { Zap, Flame, Award, TrendingUp, BookOpen, Star, Swords, Rocket, ArrowRight, CheckCircle, Clock, User } from "lucide-react"
import { VariableBox, Lantern } from "@/components/icons"
import Link from "next/link"

type Achievement = {
  slug: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  xpReward: number
}

type GamificationStats = {
  xp: number
  level: number
  progress: number
  currentLevelXp: number
  nextLevelXp: number
  levelTitle: string
  streak: number
  achievements: Achievement[]
  unlockedCount: number
  totalAchievements: number
}

type ConfidenceSummary = {
  averageConfidence: number
  totalConcepts: number
  weakCount: number
  inProgressCount: number
  masteredCount: number
}

export default function DashboardPage() {
  const [gStats, setGStats] = useState<GamificationStats | null>(null)
  const [cStats, setCStats] = useState<ConfidenceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ky.get("/api/v1/gamification/stats?userId=anonymous").json<GamificationStats>(),
      ky.get("/api/v1/confidence?userId=anonymous").json<ConfidenceSummary>(),
    ])
      .then(([g, c]) => { setGStats(g); setCStats(c) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen bg-bg">
          <div className="flex flex-col items-center gap-3">
            <Lantern width={32} height={32} className="text-accent animate-glow-pulse" />
            <span className="text-sm text-text-muted">Loading your path...</span>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Good evening.
          </h1>
          <p className="text-text-secondary mt-1">Your path is becoming brighter.</p>
        </div>

        {/* Continue Learning — Primary CTA */}
        <Link href="/learn/mathematics/set-theory/what-is-a-set" className="block mb-8">
          <div className="relative p-6 rounded-xl bg-gradient-to-r from-accent/10 to-surface border border-accent/20 hover:border-accent/40 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                <VariableBox width={24} height={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted mb-1">Continue Learning</p>
                <h2 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                  What Is a Set?
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={12} /> 20 min</span>
                  <span className="flex items-center gap-1"><Zap size={12} className="text-accent" /> +30 XP</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center text-accent group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Stats Row — calm, muted */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-accent" />
              <span className="text-xs text-text-muted uppercase tracking-wider">XP</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{gStats?.xp ?? 0}</p>
            <div className="mt-2 h-1 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${gStats?.progress ?? 0}%` }} />
            </div>
            <p className="text-xs text-text-muted mt-1">{gStats?.currentLevelXp ?? 0} / {gStats?.nextLevelXp ?? 100}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Level</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{gStats?.level ?? 1}</p>
            <p className="text-xs text-text-secondary mt-1">{gStats?.levelTitle ?? "Newbie"}</p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-warning" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{gStats?.streak ?? 0} days</p>
            <p className="text-xs text-text-secondary mt-1">
              {gStats?.streak && gStats.streak >= 7 ? "On fire!" : "Keep going"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Achievements</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">
              {gStats?.unlockedCount ?? 0}<span className="text-sm text-text-muted">/{gStats?.totalAchievements ?? 0}</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">badges earned</p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Mastery</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{cStats?.averageConfidence ?? 0}%</p>
            <p className="text-xs text-text-secondary mt-1">{cStats?.masteredCount ?? 0} / {cStats?.totalConcepts ?? 0} concepts</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            {/* Knowledge Map — mastery overview */}
            <div className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Lantern width={16} height={16} className="text-accent" />
                Knowledge Map
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Set Theory", progress: 14, color: "#E8B84B" },
                  { name: "Graph Theory", progress: 0, color: "#5BA0D9" },
                  { name: "Programming Fundamentals", progress: 0, color: "#E8B84B" },
                ].map((concept) => (
                  <div key={concept.name} className="flex items-center gap-3 py-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${concept.progress > 0 ? "bg-accent" : "bg-text-muted"}`}
                      style={concept.progress > 0 ? { backgroundColor: concept.color } : {}}
                    />
                    <span className={`text-sm flex-1 ${concept.progress > 0 ? "text-text-primary" : "text-text-muted"}`}>
                      {concept.name}
                    </span>
                    <span className="text-xs text-text-muted">{concept.progress}%</span>
                    <div className="w-16 h-1 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${concept.progress}%`, backgroundColor: concept.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <NextSteps />

            {/* Achievements */}
            <div className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gStats?.achievements.slice(0, 9).map((ach) => (
                  <div
                    key={ach.slug}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      ach.unlocked
                        ? "border-accent/20 bg-accent-soft/50"
                        : "border-border bg-surface opacity-40"
                    }`}
                  >
                    <span className="text-lg block mb-1">{ach.icon}</span>
                    <p className={`text-xs font-medium ${ach.unlocked ? "text-text-primary" : "text-text-muted"}`}>
                      {ach.title}
                    </p>
                    <p className="text-[10px] text-text-muted mt-0.5">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-2 space-y-6">
            <Recommendations />

            <div className="p-5 rounded-xl bg-surface border border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <User width={16} height={16} className="text-text-muted" />
                Learning Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Lessons Completed", icon: BookOpen, value: "—" },
                  { label: "XP per lesson", icon: Star, value: "+25" },
                  { label: "Challenges", icon: Swords, value: "—" },
                  { label: "Projects", icon: Rocket, value: "—" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center gap-2">
                      <stat.icon size={14} className="text-text-muted" />
                      {stat.label}
                    </span>
                    <span className="text-text-primary font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
