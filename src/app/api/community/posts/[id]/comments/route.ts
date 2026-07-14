import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
    take: 50,
  })
  return NextResponse.json({ comments })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { content, userId = "anonymous" } = await request.json()
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 })

  const comment = await prisma.comment.create({
    data: { postId: id, userId, content },
  })
  return NextResponse.json({ comment }, { status: 201 })
}
