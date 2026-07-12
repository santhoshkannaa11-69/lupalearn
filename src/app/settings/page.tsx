"use client"

import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"

export default function SettingsPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Badge variant="default" className="mb-3">Settings</Badge>
        <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">Settings</h1>
        <p className="text-sm text-[#606060] font-mono">Profile, account, appearance, notifications, and AI preferences.</p>
      </div>
    </Shell>
  )
}
