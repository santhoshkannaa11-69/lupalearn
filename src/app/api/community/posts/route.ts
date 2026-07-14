import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { comments: true, likes: true } } },
    take: 20,
  })

  const result = posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content.slice(0, 200),
    type: p.type,
    tags: JSON.parse(p.tags || "[]"),
    pinned: p.pinned,
    createdAt: p.createdAt.toISOString(),
    commentCount: p._count.comments,
    likeCount: p._count.likes,
  }))

  return NextResponse.json({ posts: result })
}

export async function POST(request: Request) {
  try {
    const { title, content, type = "discussion", tags = [], userId = "anonymous" } = await request.json()
    if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 })

    const post = await prisma.post.create({
      data: {
        userId,
        title,
        content,
        type,
        tags: JSON.stringify(tags),
      },
    })
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
