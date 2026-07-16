import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Shell } from "@/components/layout/Shell"
import { Badge } from "@/components/ui/Badge"
import { ArrowLeft, BookOpen, FileText, Clock } from "lucide-react"

export default async function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params

  const volume = await prisma.volume.findUnique({
    where: { slug: schoolSlug },
    include: {
      categories: {
        orderBy: { order: "asc" },
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                select: { slug: true, title: true, duration: true, difficulty: true },
              },
              _count: { select: { lessons: true } },
            },
          },
        },
      },
    },
  })

  if (!volume) notFound()

  const totalLessons = volume.categories.reduce(
    (sum, cat) => sum + cat.modules.reduce((s, m) => s + m._count.lessons, 0),
    0
  )

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learn" className="text-xs text-accent hover:brightness-110 transition-all flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">{volume.title}</h1>
          <p className="text-sm text-text-secondary">{volume.subtitle}</p>
          <p className="text-xs text-text-muted mt-2">
            {volume.categories.length} categories · {totalLessons} lessons
          </p>
        </div>

        {/* Categories */}
        {volume.categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-surface">
            <FileText size={40} className="text-text-muted mb-4" />
            <h2 className="text-lg font-semibold text-text-secondary mb-2">No content yet</h2>
            <p className="text-sm text-text-muted text-center max-w-md">
              This course is being authored. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {volume.categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-4 rounded-full bg-accent" />
                  <h2 className="text-sm font-semibold text-text-primary">{category.title}</h2>
                  <span className="text-xs text-text-muted">({category.modules.length} modules)</span>
                </div>

                <div className="space-y-2">
                  {category.modules.map((module) => (
                    <div key={module.id} className="rounded-xl bg-surface border border-border overflow-hidden">
                      {/* Module header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-surface/80">
                        <h3 className="text-sm font-medium text-text-primary">{module.title}</h3>
                        <span className="text-xs text-text-muted">{module._count.lessons} lessons</span>
                      </div>

                      {/* Lesson list */}
                      <div className="divide-y divide-border">
                        {module.lessons.map((lesson) => (
                          <Link
                            key={lesson.slug}
                            href={`/learn/${volume.slug}/${module.slug}/${lesson.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface/50 transition-colors group"
                          >
                            <BookOpen size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
                            <span className="flex-1 text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                              {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="flex items-center gap-1 text-xs text-text-muted shrink-0">
                                <Clock size={10} />
                                {lesson.duration}min
                              </span>
                            )}
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                lesson.difficulty === "beginner" ? "bg-accent-soft text-accent" :
                                lesson.difficulty === "intermediate" ? "bg-warning/10 text-warning" :
                                "bg-danger/10 text-danger"
                              }`}
                            >
                              {lesson.difficulty}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}
