"use client"

import { Shell } from "@/components/layout/Shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"

export default function DashboardPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Badge variant="success" className="mb-3">Dashboard</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono">lupa@learn:~/dashboard</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-[10px] text-[#606060]">XP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ffffff]">0</p>
              <Progress value={0} className="mt-2" />
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-[10px] text-[#606060]">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00ff41]">1</p>
              <p className="text-[10px] text-[#606060] mt-1">Newbie</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-[10px] text-[#606060]">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#ffb000]">0 days</p>
              <p className="text-[10px] text-[#606060] mt-1">Start learning to begin</p>
            </CardContent>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-[10px] text-[#606060]">Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#00f0ff]">0</p>
              <p className="text-[10px] text-[#606060] mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center py-20 border border-[#1e1e1e]">
          <div className="text-center">
            <h2 className="text-lg font-bold text-[#c0c0c0] font-mono mb-2">Welcome to LupaLearn</h2>
            <p className="text-sm text-[#606060] font-mono">
              Start learning to see your progress, achievements, and recommendations.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}
