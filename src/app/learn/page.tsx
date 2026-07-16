"use client"

import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"
import { COURSES, VOLUME_INFO } from "@/lib/schools"
import { ArrowRight, BookOpen } from "lucide-react"

export default function LearnPage() {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
            <BookOpen size={14} />
            <span>Curriculum</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">{VOLUME_INFO.title}</h1>
          <p className="text-text-secondary max-w-2xl">{VOLUME_INFO.description}</p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSES.map((course) => (
            <Link key={course.slug} href={`/learn/${course.slug}`}>
              <div
                className="p-5 rounded-xl bg-surface border border-border shadow-sm hover:border-accent/30 hover:shadow-md transition-all group h-full"
              >
                {/* Header with course identity */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${course.lanternColor}15` }}
                  >
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: course.lanternColor }}
                      />
                      <span className="text-xs text-text-muted">{course.lanternName} Lantern</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                  <span>{course.moduleCount} modules</span>
                  <span>·</span>
                  <span>{course.lessonCount} lessons</span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: "0%", backgroundColor: course.lanternColor }} />
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-xs font-medium text-accent group-hover:brightness-110 transition-all">
                  {course.lessonCount > 5 ? "Continue Learning" : "Start Learning"}
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  )
}
