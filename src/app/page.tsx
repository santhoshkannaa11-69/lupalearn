"use client"

import Link from "next/link"
import { Shell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Progress } from "@/components/ui/Progress"
import { Divider } from "@/components/ui/Divider"
import { SCHOOLS } from "@/lib/constants"
import {
  ArrowRight,
  Book,
  Code,
  Bot,
  Swords,
  Award,
  Users,
  GraduationCap,
  Star,
  ChevronRight,
} from "lucide-react"

const FEATURES = [
  { icon: Book, title: "Interactive Courses", desc: "10,000+ lessons across 20 schools with hands-on coding" },
  { icon: Code, title: "Live Code Playground", desc: "Monaco editor + xterm.js terminal + live preview in browser" },
  { icon: Bot, title: "AI Tutor", desc: "Get instant explanations, code review, and personalized guidance" },
  { icon: Swords, title: "Coding Challenges", desc: "Daily, weekly, and monthly challenges with leaderboards" },
  { icon: Award, title: "Certifications", desc: "Earn verifiable certificates through practical exams and AI interviews" },
  { icon: GraduationCap, title: "Skill Roadmaps", desc: "Personalized learning paths across 500+ skill trees" },
]

const TESTIMONIALS = [
  { name: "Alex Chen", role: "Full Stack Developer", quote: "LupaLearn's terminal-based lessons make learning feel like actually building real software." },
  { name: "Sarah Kim", role: "CS Student", quote: "The AI tutor explains concepts better than most textbooks. It's like having a senior dev beside you." },
  { name: "Marcus Johnson", role: "DevOps Engineer", quote: "The playground with live terminal and Monaco editor is the best learning tool I've ever used." },
]

export default function HomePage() {
  return (
    <Shell>
      {/* Hero Section */}
      <section className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <Badge variant="info" className="mb-6">
              v0.1.0 — AI-Powered Learning Platform
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-mono leading-tight mb-6">
              <span className="text-[#00ff41]">$</span>{" "}
              <span className="text-[#ffffff]">learn.</span>{" "}
              <span className="text-[#00f0ff]">practice.</span>{" "}
              <span className="text-[#ffb000]">build.</span>{" "}
              <span className="text-[#ff00aa]">grow.</span>
            </h1>

            <p className="text-sm md:text-base text-[#606060] max-w-2xl mb-10 leading-relaxed font-mono">
              An AI-powered interactive learning platform that combines tutorials, live coding,
              AI mentorship, real-world projects, and personalized roadmaps into a single developer ecosystem.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/onboarding">
                <Button variant="primary" size="lg">
                  <GraduationCap size={16} />
                  Start Learning
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/playground">
                <Button variant="outline" size="lg">
                  <Code size={16} />
                  Try Playground
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-[10px] text-[#606060] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00ff41]" />
                10,000+ Lessons
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#00f0ff]" />
                20 Schools
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#ffb000]" />
                AI-Powered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-none bg-[#ff00aa]" />
                Free & Open
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Core Features</Badge>
            <h2 className="text-xl md:text-2xl font-bold text-[#ffffff] font-mono">
              Everything a developer needs to level up
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} variant="bordered" className="hover:border-[#2a2a2a] transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-[#00ff41]" />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[#606060]">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Schools Overview */}
      <section className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="info" className="mb-4">Curriculum</Badge>
              <h2 className="text-xl md:text-2xl font-bold text-[#ffffff] font-mono">
                20 Schools of Computer Engineering
              </h2>
            </div>
            <Link href="/learn" className="text-xs text-[#00ff41] hover:underline font-mono flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCHOOLS.slice(0, 8).map((school) => (
              <Link key={school.slug} href={`/learn/${school.slug}`}>
                <Card variant="bordered" className="hover:border-[#2a2a2a] transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-none flex-shrink-0"
                        style={{ backgroundColor: school.color }}
                      />
                      <CardTitle className="text-[11px]">{school.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[10px] text-[#606060] font-mono">
                      ─── {school.subtitle} ───
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/learn">
              <Button variant="outline" size="md">
                Browse all 20 schools <ChevronRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Badge variant="warning" className="mb-4">Testimonials</Badge>
            <h2 className="text-xl md:text-2xl font-bold text-[#ffffff] font-mono">
              What learners are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} variant="bordered">
                <CardContent>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-[#ffb000] fill-[#ffb000]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#c0c0c0] mb-4 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="text-xs">
                    <p className="text-[#ffffff] font-bold">{t.name}</p>
                    <p className="text-[#606060]">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-[#1e1e1e]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <Badge variant="success" className="mb-4">Get Started</Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-[#ffffff] font-mono mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-sm text-[#606060] mb-8 max-w-xl mx-auto font-mono">
            Join thousands of developers learning across 20 schools with AI-powered guidance,
            hands-on projects, and a supportive community.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button variant="primary" size="lg">
                <GraduationCap size={16} />
                Start Learning Free
              </Button>
            </Link>
            <Link href="/playground">
              <Button variant="outline" size="lg">
                <Code size={16} />
                Open Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <Divider className="mb-8" />
          <div className="grid md:grid-cols-4 gap-8 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#00ff41] font-bold text-sm">Lupa</span>
                <span className="text-[#606060]">Learn</span>
              </div>
              <p className="text-[#606060] text-[10px] leading-relaxed">
                AI-powered interactive learning platform for developers.
                Learn, practice, build, and grow.
              </p>
            </div>
            <div>
              <h4 className="text-[#ffffff] font-bold mb-3 uppercase tracking-wider">Platform</h4>
              <div className="space-y-2 text-[#606060]">
                <Link href="/learn" className="block hover:text-[#c0c0c0]">Schools</Link>
                <Link href="/playground" className="block hover:text-[#c0c0c0]">Playground</Link>
                <Link href="/ai-tutor" className="block hover:text-[#c0c0c0]">AI Tutor</Link>
                <Link href="/challenges" className="block hover:text-[#c0c0c0]">Challenges</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[#ffffff] font-bold mb-3 uppercase tracking-wider">Community</h4>
              <div className="space-y-2 text-[#606060]">
                <Link href="/community" className="block hover:text-[#c0c0c0]">Forums</Link>
                <Link href="/community/blogs" className="block hover:text-[#c0c0c0]">Blogs</Link>
                <Link href="/community/showcase" className="block hover:text-[#c0c0c0]">Showcase</Link>
                <Link href="/certifications" className="block hover:text-[#c0c0c0]">Certifications</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[#ffffff] font-bold mb-3 uppercase tracking-wider">Ecosystem</h4>
              <div className="space-y-2 text-[#606060]">
                <span className="block">LupaCode</span>
                <span className="block">LupaFlow</span>
                <span className="block">LupaBrain</span>
                <span className="block text-[#00ff41] animate-pulse-glow">● All Systems Online</span>
              </div>
            </div>
          </div>
          <Divider className="my-8" />
          <p className="text-[10px] text-[#606060] text-center font-mono">
            © {new Date().getFullYear()} LupaLearn. Built with ❄️ for developers everywhere.
          </p>
        </div>
      </footer>
    </Shell>
  )
}
