"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { NextSteps } from "@/components/dashboard/NextSteps"
import { Recommendations } from "@/components/dashboard/Recommendations"
import { Spinner } from "@/components/ui/Spinner"
import { useEffect, useState } from "react"
import ky from "ky"
import { Zap, Flame, Award, Target, TrendingUp, BookOpen, Star, Swords, Rocket } from "lucide-react"

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
        <div className="flex items-center justify-center h-64">
          <Spinner label="Loading dashboard..." />
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="success" className="mb-3">Dashboard</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono">lupa@learn:~/dashboard</h1>
          <p className="text-sm text-[#606060] font-mono mt-1">Your learning overview and next steps</p>
        </div>

        {/* Gamification Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#ffb000]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">XP</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ffb000] font-mono">{gStats?.xp ?? 0}</p>
              <div className="mt-1">
                <Progress value={gStats?.progress ?? 0} variant="warning" size="sm" />
              </div>
              <p className="text-[10px] text-[#606060] font-mono mt-1">
                {gStats?.currentLevelXp ?? 0} / {gStats?.nextLevelXp ?? 100} to next level
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target size={14} className="text-[#00ff41]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Level</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00ff41] font-mono">{gStats?.level ?? 1}</p>
              <p className="text-[10px] text-[#00ff41] font-mono mt-1">{gStats?.levelTitle ?? "Newbie"}</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-[#ff3355]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Streak</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ff3355] font-mono">{gStats?.streak ?? 0} days</p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">
                {gStats?.streak && gStats.streak >= 7 ? "🔥 On fire!" : "Keep going!"}
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[#00f0ff]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00f0ff] font-mono">
                {gStats?.unlockedCount ?? 0}<span className="text-lg text-[#606060]">/{gStats?.totalAchievements ?? 0}</span>
              </p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">badges earned</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#ffb000]" />
                <CardTitle className="text-[10px] text-[#606060] uppercase">Mastery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ffb000] font-mono">{cStats?.averageConfidence ?? 0}%</p>
              <p className="text-[10px] text-[#606060] font-mono mt-1">
                {cStats?.masteredCount ?? 0} / {cStats?.totalConcepts ?? 0} concepts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main content: Next Steps + Recommendations */}
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-6">
            <NextSteps />

            {/* Achievements */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {gStats?.achievements.slice(0, 9).map((ach) => (
                    <div
                      key={ach.slug}
                      className={`border p-2 text-center transition-colors ${ach.unlocked ? "border-[#00ff41] bg-[#0a1a0a]" : "border-[#1e1e1e] opacity-40"}`}
                    >
                      <span className="text-lg">{ach.icon}</span>
                      <p className={`text-[10px] font-mono mt-1 ${ach.unlocked ? "text-[#c0c0c0]" : "text-[#606060]"}`}>
                        {ach.title}
                      </p>
                      <p className="text-[8px] text-[#606060] font-mono mt-0.5">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Recommendations />

            {/* Quick Stats */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606060] flex items-center gap-1"><BookOpen size={12} /> Lessons</span>
                    <span className="text-[#c0c0c0]">—</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606060] flex items-center gap-1"><Star size={12} /> XP per lesson</span>
                    <span className="text-[#c0c0c0]">+{25}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606060] flex items-center gap-1"><Swords size={12} /> Challenges</span>
                    <span className="text-[#c0c0c0]">—</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606060] flex items-center gap-1"><Rocket size={12} /> Projects</span>
                    <span className="text-[#c0c0c0]">—</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}
