"use client"

import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { SCHOOLS } from "@/lib/constants"

export default function LearnPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Badge variant="info" className="mb-3">Curriculum</Badge>
          <h1 className="text-2xl font-bold text-[#ffffff] font-mono mb-2">All Schools</h1>
          <p className="text-sm text-[#606060] font-mono">
            Browse all 20 schools of computer engineering and software development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCHOOLS.map((school) => (
            <Link key={school.slug} href={`/learn/${school.slug}`}>
              <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-none flex-shrink-0"
                      style={{ backgroundColor: school.color }}
                    />
                    <div>
                      <CardTitle className="text-xs">{school.title}</CardTitle>
                      <p className="text-[10px] text-[#606060] font-mono mt-0.5">
                        v{String(school.number).padStart(2, "0")} — {school.subtitle}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Coming Soon</Badge>
                    <span className="text-[10px] text-[#606060] font-mono">───</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  )
}
