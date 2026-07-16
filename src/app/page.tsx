"use client"

import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react"
import { Lantern, VariableBox, FunctionArrow, ArrayStack, LoopCycle, TreeHierarchy, GraphNetwork } from "@/components/icons"
import { COURSES } from "@/lib/schools"
import { CodeBrackets, Sigma, PuzzlePiece } from "@/components/icons"

const FEATURES = [
  { icon: VariableBox, title: "Interactive Courses", desc: "Every concept mastered lights the path ahead." },
  { icon: FunctionArrow, title: "AI Mentor", desc: "Personal guidance that adapts to your learning pace." },
  { icon: ArrayStack, title: "Knowledge Graph", desc: "Watch your understanding grow as a living map." },
  { icon: LoopCycle, title: "Hands-on Practice", desc: "Code, build, and apply what you learn immediately." },
  { icon: TreeHierarchy, title: "Structured Curriculum", desc: "From foundations to mastery, one lesson at a time." },
  { icon: GraphNetwork, title: "Learning OS", desc: "Everything you need in one focused workspace." },
]

const iconMap: Record<string, React.ElementType> = {
  CodeBrackets, Sigma, PuzzlePiece,
}

export default function HomePage() {
  return (
    <Shell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <Lantern width={32} height={32} className="text-accent" />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-4 leading-tight">
              Master Computer Science
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
              A learning operating system where every concept becomes part of a living map of your knowledge.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-text-inverse text-sm font-medium rounded-xl hover:brightness-110 transition-all shadow-sm animate-glow-pulse"
              >
                <BookOpen size={16} />
                Start Learning
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-secondary text-sm font-medium rounded-xl hover:bg-surface hover:border-border-hover transition-all"
              >
                Your Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="p-5 rounded-xl bg-surface border border-border hover:border-accent/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <Icon width={20} height={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Courses Overview */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-text-primary tracking-tight">Volume 1</h2>
              <p className="text-sm text-text-secondary mt-1">Computer Engineering Foundations — 183 lessons</p>
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 text-sm text-accent hover:brightness-110 transition-all"
            >
              View all courses <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURSES.slice(0, 6).map((course) => {
              const Icon = iconMap[course.iconComponent]
              return (
                <Link key={course.slug} href={`/learn/${course.slug}`}>
                  <div className="p-4 rounded-xl bg-surface border border-border hover:border-accent/20 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${course.lanternColor}15`, color: course.lanternColor }}>
                        {Icon && <Icon width={16} height={16} />}
                      </div>
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                        {course.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{course.moduleCount} modules</span>
                      <span>·</span>
                      <span>{course.lessonCount} lessons</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Lantern width={16} height={16} className="text-accent" />
            <span>LupaLearn</span>
          </div>
          <p className="text-xs text-text-muted">Every concept you master lights the path ahead.</p>
        </div>
      </footer>
    </Shell>
  )
}
