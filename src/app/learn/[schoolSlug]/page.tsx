import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Shell } from "@/components/layout/Shell"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { ArrowLeft, FileText, BookOpen, CheckCircle } from "lucide-react"

export default async function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params

  // Fetch volume by slug
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

  const difficultyColor = (d: string) =>
    d === "beginner" ? "#00ff41" : d === "intermediate" ? "#ffb000" : "#ff3355"

  return (
    <Shell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learn" className="text-xs text-[#00ff41] hover:underline font-mono flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to Schools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-none flex-shrink-0" style={{ backgroundColor: volume.color || "#00ff41" }} />
            <div>
              <Badge variant="info">v{String(volume.number).padStart(2, "0")}</Badge>
              <h1 className="text-2xl font-bold text-[#ffffff] font-mono mt-1">{volume.title}</h1>
              <p className="text-sm text-[#606060] font-mono">{volume.subtitle}</p>
            </div>
          </div>
          <p className="text-xs text-[#606060] font-mono mt-2">
            {volume.categories.length} categories · {totalLessons} lessons
          </p>
        </div>

        {/* Categories */}
        {volume.categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-[#1e1e1e]">
            <FileText size={40} className="text-[#606060] mb-4" />
            <h2 className="text-lg font-bold text-[#c0c0c0] font-mono mb-2">No content yet</h2>
            <p className="text-sm text-[#606060] font-mono text-center max-w-md">
              This school's curriculum is being authored.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {volume.categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-sm font-bold text-[#ffffff] font-mono uppercase tracking-wider mb-3">
                  {category.title}
                  <span className="text-[#606060] font-normal ml-2">({category.modules.length} modules)</span>
                </h2>

                <div className="space-y-3">
                  {category.modules.map((module) => (
                    <Card key={module.id} variant="bordered">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xs text-[#ffffff] font-mono">
                            {module.title}
                          </CardTitle>
                          <span className="text-[10px] text-[#606060] font-mono">
                            {module._count.lessons} lessons
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {module.lessons.map((lesson) => (
                            <Link
                              key={lesson.slug}
                              href={`/learn/${volume.slug}/${module.slug}/${lesson.slug}`}
                              className="flex items-center gap-3 px-3 py-2 border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors group"
                            >
                              <BookOpen size={12} className="text-[#606060] group-hover:text-[#00ff41] shrink-0" />
                              <span className="flex-1 text-xs text-[#c0c0c0] font-mono group-hover:text-[#ffffff] truncate">
                                {lesson.title}
                              </span>
                              {lesson.duration && (
                                <span className="text-[10px] text-[#606060] font-mono shrink-0">{lesson.duration}min</span>
                              )}
                              <span
                                className="w-1.5 h-1.5 rounded-none shrink-0"
                                style={{ backgroundColor: difficultyColor(lesson.difficulty) }}
                              />
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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
