import { notFound } from "next/navigation"
import Link from "next/link"
import path from "path"
import fs from "fs"
import { getLessonBySlug, getConceptsForLesson } from "@/lib/graph"
import { LessonViewer } from "@/components/learn/LessonViewer"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ schoolSlug: string; moduleSlug: string; lessonSlug: string }>
}) {
  const { lessonSlug, schoolSlug } = await params
  const lesson = await getLessonBySlug(lessonSlug)

  if (!lesson) {
    notFound()
  }

  const concepts = await getConceptsForLesson(lessonSlug)

  // Read MDX content from file system
  let mdxContent = ""
  try {
    // contentPath is like: lessons/volume-01/course-07-programming-fundamentals/02-variables-data-types/01-variables-data-types.mdx
    const fullPath = path.join(process.cwd(), "content", lesson.contentPath)
    if (fs.existsSync(fullPath)) {
      mdxContent = fs.readFileSync(fullPath, "utf-8")
      // Strip frontmatter (content between --- delimiters)
      mdxContent = mdxContent.replace(/^---[\s\S]*?---\n?/, "")
    }
  } catch (e) {
    console.error("Failed to load lesson content:", e)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e] bg-[#0a0a0a] text-xs font-mono">
        <Link href="/learn" className="text-[#00ff41] hover:underline">~/learn</Link>
        <span className="text-[#606060]">/</span>
        <Link href={`/learn/${schoolSlug}`} className="text-[#606060] hover:text-[#c0c0c0]">{schoolSlug}</Link>
        <span className="text-[#606060]">/</span>
        <span className="text-[#c0c0c0]">{lesson.slug}</span>
        <span className="text-[#00ff41] animate-blink ml-0.5">_</span>

        <div className="flex-1" />

        <span className="text-[#606060]">{lesson.duration}min</span>
        <span className="text-[#1e1e1e]">|</span>
        <span className="text-[#ffb000]">+{lesson.xpReward} XP</span>
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
      />
    </div>
  )
}
