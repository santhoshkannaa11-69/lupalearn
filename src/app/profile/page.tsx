"use client"

import { useEffect, useState } from "react"
import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { Zap, Target, Flame, Award, BookOpen, Code2, TrendingUp } from "lucide-react"

type Achievement = { slug: string; title: string; description: string; icon: string; unlocked: boolean }
type GamificationStats = { xp: number; level: number; progress: number; streak: number; levelTitle: string; achievements: Achievement[]; unlockedCount: number; totalAchievements: number }

export default function ProfilePage() {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ky.get("/api/v1/gamification/stats?userId=anonymous")
      .json<GamificationStats>()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Shell><div className="flex items-center justify-center h-64"><Spinner label="Loading profile..." /></div></Shell>

  return (
    <Shell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#1a1a1a] border-2 border-[#00ff41] flex items-center justify-center">
            <span className="text-2xl font-bold text-[#00ff41] font-mono">{stats?.level}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#ffffff] font-mono">Learner Profile</h1>
            <p className="text-sm text-[#606060] font-mono">{stats?.levelTitle} · {stats?.xp} XP</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Card variant="bordered">
            <CardHeader><div className="flex items-center gap-2"><Zap size={14} className="text-[#ffb000]" /><CardTitle className="text-[10px] text-[#606060] uppercase">XP</CardTitle></div></CardHeader>
            <CardContent><p className="text-2xl font-bold text-[#ffb000] font-mono">{stats?.xp ?? 0}</p><Progress value={stats?.progress ?? 0} variant="warning" size="sm" className="mt-1" /></CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader><div className="flex items-center gap-2"><Target size={14} className="text-[#00ff41]" /><CardTitle className="text-[10px] text-[#606060] uppercase">Level</CardTitle></div></CardHeader>
            <CardContent><p className="text-2xl font-bold text-[#00ff41] font-mono">{stats?.level ?? 1}</p><p className="text-[10px] text-[#00ff41] font-mono mt-1">{stats?.levelTitle}</p></CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader><div className="flex items-center gap-2"><Flame size={14} className="text-[#ff3355]" /><CardTitle className="text-[10px] text-[#606060] uppercase">Streak</CardTitle></div></CardHeader>
            <CardContent><p className="text-2xl font-bold text-[#ff3355] font-mono">{stats?.streak ?? 0} days</p></CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader><div className="flex items-center gap-2"><Award size={14} className="text-[#00f0ff]" /><CardTitle className="text-[10px] text-[#606060] uppercase">Badges</CardTitle></div></CardHeader>
            <CardContent><p className="text-2xl font-bold text-[#00f0ff] font-mono">{stats?.unlockedCount ?? 0}<span className="text-lg text-[#606060]">/{stats?.totalAchievements ?? 0}</span></p></CardContent>
          </Card>
        </div>

        <Card variant="bordered" className="mb-8">
          <CardHeader><CardTitle className="text-[10px] text-[#606060] uppercase tracking-widest">Achievements</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {stats?.achievements.map((ach) => (
                <div key={ach.slug} className={`border p-2 text-center ${ach.unlocked ? "border-[#00ff41] bg-[#0a1a0a]" : "border-[#1e1e1e] opacity-40"}`}>
                  <span className="text-lg">{ach.icon}</span>
                  <p className={`text-[10px] font-mono mt-1 ${ach.unlocked ? "text-[#c0c0c0]" : "text-[#606060]"}`}>{ach.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card variant="bordered"><CardHeader><CardTitle className="text-[10px] text-[#606060] uppercase">Learning Activity</CardTitle></CardHeader><CardContent><div className="space-y-2 text-xs font-mono"><div className="flex justify-between text-[#606060]"><span className="flex items-center gap-1"><BookOpen size={12} /> Lessons</span><span className="text-[#c0c0c0]">—</span></div><div className="flex justify-between text-[#606060]"><span className="flex items-center gap-1"><Code2 size={12} /> Projects</span><span className="text-[#c0c0c0]">—</span></div></div></CardContent></Card>
          <Card variant="bordered"><CardHeader><CardTitle className="text-[10px] text-[#606060] uppercase">Current Roadmap</CardTitle></CardHeader><CardContent><p className="text-xs text-[#606060] font-mono">Set a goal in the <a href="/onboarding" className="text-[#00ff41] hover:underline">AI Roadmap</a> to start tracking</p></CardContent></Card>
        </div>
      </div>
    </Shell>
  )
}
