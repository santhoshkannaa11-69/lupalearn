import { notFound } from "next/navigation"
import Link from "next/link"
import path from "path"
import fs from "fs"
import { prisma } from "@/lib/db"
import { getLessonBySlug, getConceptsForLesson } from "@/lib/graph"
import { LessonViewer } from "@/components/learn/LessonViewer"
import { ChevronDown } from "lucide-react"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ schoolSlug: string; moduleSlug: string; lessonSlug: string }>
}) {
  const { lessonSlug, schoolSlug, moduleSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)

  if (!lesson) notFound()

  const concepts = await getConceptsForLesson(lessonSlug)

  const moduleLessons = await prisma.lesson.findMany({
    where: { module: { slug: moduleSlug } },
    orderBy: { order: "asc" },
    select: { slug: true, title: true },
  })
  const currentIdx = moduleLessons.findIndex((l) => l.slug === lessonSlug)
  const nextSlug = currentIdx < moduleLessons.length - 1 ? moduleLessons[currentIdx + 1].slug : undefined
  const prevSlug = currentIdx > 0 ? moduleLessons[currentIdx - 1].slug : undefined

  let mdxContent = ""
  try {
    const fullPath = path.join(process.cwd(), "content", lesson.contentPath)
    if (fs.existsSync(fullPath)) {
      mdxContent = fs.readFileSync(fullPath, "utf-8")
      mdxContent = mdxContent.replace(/^---[\s\S]*?---\n?/, "")
    }
  } catch (e) {
    console.error("Failed to load lesson content:", e)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-40 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center gap-2 text-sm">
          <Link href="/learn" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            Learn
          </Link>
          <ChevronDown size={12} className="-rotate-90 text-zinc-400" />
          <span className="text-zinc-500 dark:text-zinc-400 capitalize">{schoolSlug.replace(/-/g, " ")}</span>
          <ChevronDown size={12} className="-rotate-90 text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-200 capitalize">{moduleSlug.replace(/-/g, " ")}</span>
          <div className="flex-1" />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">{lesson.duration} min</span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">+{lesson.xpReward} XP</span>
        </div>
      </div>

      <LessonViewer
        lesson={{
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          contentPath: lesson.contentPath,
          contentType: lesson.contentType,
          order: lesson.order,
          duration: lesson.duration,
          xpReward: lesson.xpReward,
          difficulty: lesson.difficulty,
          tags: lesson.tags,
          moduleId: lesson.moduleId,
        }}
        concepts={concepts}
        mdxContent={mdxContent}
        conceptSlugs={concepts.map((c) => c.slug)}
        navigation={{
          schoolSlug,
          moduleSlug,
          currentIndex: currentIdx,
          totalInModule: moduleLessons.length,
          nextSlug,
          prevSlug,
        }}
      />
    </div>
  )
}
