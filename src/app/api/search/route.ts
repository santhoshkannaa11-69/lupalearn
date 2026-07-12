import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ nodes: [], lessons: [] })
  }

  const query = q.trim()

  const nodes = await prisma.node.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { slug: { contains: query } },
      ],
    },
    orderBy: { name: "asc" },
    take: 20,
  })

  // Also search lessons
  const lessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    orderBy: { title: "asc" },
    take: 10,
  })

  return NextResponse.json({ nodes, lessons })
}
