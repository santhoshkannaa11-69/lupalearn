import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conceptSlug = searchParams.get("concept")

  if (!conceptSlug) {
    return NextResponse.json({ lessons: [] })
  }

  const concept = await prisma.node.findUnique({
    where: { slug: conceptSlug },
    include: {
      incomingEdges: {
        where: { relationType: "teaches" },
        include: { source: true },
      },
    },
  })

  if (!concept) {
    return NextResponse.json({ lessons: [] })
  }

  const lessonNodeSlugs = concept.incomingEdges
    .filter((e) => e.source.type === "lesson")
    .map((e) => e.source.slug.replace("lesson-", ""))

  if (lessonNodeSlugs.length === 0) {
    return NextResponse.json({ lessons: [] })
  }

  const lessons = await prisma.lesson.findMany({
    where: { slug: { in: lessonNodeSlugs } },
    orderBy: { order: "asc" },
  })

  return NextResponse.json({ lessons })
}
