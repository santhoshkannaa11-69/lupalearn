"use client"

import { useEffect, useState } from "react"
import { Shell } from "@/components/layout/Shell"
import { Spinner } from "@/components/ui/Spinner"
import ky from "ky"
import { Zap, Award, Flame, BookOpen, TrendingUp } from "lucide-react"
import { Lantern, VariableBox } from "@/components/icons"

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

  if (loading) return (
    <Shell>
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="flex flex-col items-center gap-3">
          <Lantern width={32} height={32} className="text-accent animate-glow-pulse" />
          <span className="text-sm text-text-muted">Loading profile...</span>
        </div>
      </div>
    </Shell>
  )

  return (
    <Shell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-accent-soft border border-accent/20 flex items-center justify-center">
            <Lantern width={28} height={28} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Learner Profile</h1>
            <p className="text-sm text-text-secondary mt-0.5">{stats?.levelTitle} · {stats?.xp} XP</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-accent" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Level</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{stats?.level}</p>
            <div className="mt-2 h-1 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${stats?.progress ?? 0}%` }} />
            </div>
            <p className="text-xs text-text-muted mt-1">to next level</p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs text-text-muted uppercase tracking-wider">XP</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{stats?.xp ?? 0}</p>
            <p className="text-xs text-text-secondary mt-1">total experience</p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-warning" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{stats?.streak ?? 0} days</p>
            <p className="text-xs text-text-secondary mt-1">
              {stats?.streak && stats.streak >= 7 ? "On fire!" : "Keep going"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Award size={14} className="text-text-muted" />
              <span className="text-xs text-text-muted uppercase tracking-wider">Badges</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">
              {stats?.unlockedCount ?? 0}<span className="text-sm text-text-muted">/{stats?.totalAchievements ?? 0}</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">achievements earned</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="rounded-xl bg-surface border border-border p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Award width={16} height={16} className="text-text-muted" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {stats?.achievements.map((ach) => (
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
    </Shell>
  )
}
