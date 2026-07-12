"use client"

import { use } from "react"
import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { SCHOOLS } from "@/lib/constants"
import { ArrowLeft, Book, FileText } from "lucide-react"

export default function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = use(params)
  const school = SCHOOLS.find((s) => s.slug === schoolSlug)

  if (!school) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-xl font-bold text-[#ff3355] font-mono">School not found</h1>
          <p className="text-sm text-[#606060] mt-2">No school with slug "{schoolSlug}" exists.</p>
          <Link href="/learn" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              <ArrowLeft size={14} /> Back to Schools
            </Button>
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/learn" className="text-xs text-[#00ff41] hover:underline font-mono flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to Schools
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span
              className="w-3 h-3 rounded-none flex-shrink-0"
              style={{ backgroundColor: school.color }}
            />
            <div>
              <Badge variant="info">v{String(school.number).padStart(2, "0")}</Badge>
              <h1 className="text-2xl font-bold text-[#ffffff] font-mono mt-1">{school.title}</h1>
              <p className="text-sm text-[#606060] font-mono">{school.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 border border-[#1e1e1e]">
          <FileText size={40} className="text-[#606060] mb-4" />
          <h2 className="text-lg font-bold text-[#c0c0c0] font-mono mb-2">Content Coming Soon</h2>
          <p className="text-sm text-[#606060] font-mono text-center max-w-md">
            This school's curriculum is being authored. Check back soon for interactive lessons,
            quizzes, and projects.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link href="/playground">
              <Button variant="outline" size="sm">
                Try Playground Instead
              </Button>
            </Link>
            <Link href="/ai-tutor">
              <Button variant="ghost" size="sm">
                Ask AI Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Placeholder for categories/modules */}
        <div className="mt-8">
          <h2 className="text-sm font-bold text-[#ffffff] font-mono uppercase tracking-wider mb-4">
            Categories
          </h2>
          <p className="text-xs text-[#606060]">Categories will be loaded from the database.</p>
        </div>
      </div>
    </Shell>
  )
}
