import { prisma } from "@/lib/db"

export async function buildLessonContext(lessonSlug?: string) {
  if (!lessonSlug) return { slug: undefined, title: undefined, content: undefined, concepts: [] }

  const lesson = await prisma.lesson.findUnique({ where: { slug: lessonSlug } })
  if (!lesson) return { slug: lessonSlug, title: undefined, content: undefined, concepts: [] }

  // Find concepts this lesson teaches
  const lessonNode = await prisma.node.findUnique({ where: { slug: `lesson-${lessonSlug}` } })
  let concepts: { slug: string; name: string }[] = []
  if (lessonNode) {
    const edges = await prisma.edge.findMany({
      where: { sourceId: lessonNode.id, relationType: "teaches" },
      include: { target: true },
    })
    concepts = edges.map((e) => ({ slug: e.target.slug, name: e.target.name }))
  }

  return {
    slug: lessonSlug,
    title: lesson.title || undefined,
    content: lesson.description || undefined,
    concepts,
  }
}
