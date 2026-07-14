import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await prisma.like.create({ data: { postId: id, userId: "anonymous" } })
    return NextResponse.json({ liked: true })
  } catch {
    // Already liked — unlike
    await prisma.like.deleteMany({ where: { postId: id, userId: "anonymous" } })
    return NextResponse.json({ liked: false })
  }
}
