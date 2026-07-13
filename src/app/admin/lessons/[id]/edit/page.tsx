import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { LessonEditor } from "@/components/admin/LessonEditor"

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) notFound()

  return (
    <LessonEditor
      initialData={{
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description || "",
        difficulty: lesson.difficulty as "beginner" | "intermediate" | "advanced" || "beginner",
        duration: lesson.duration || 15,
        xpReward: lesson.xpReward || 20,
        tags: JSON.parse(lesson.tags || "[]"),
        content: `# ${lesson.title}\n\n${lesson.description || ""}\n\n<!-- Load content from: ${lesson.contentPath} -->`,
      }}
    />
  )
}
