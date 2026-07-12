import { NextResponse } from "next/server"
import { getLessonVersions, createDraft, submitForReview } from "@/lib/versioning"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  const versions = await getLessonVersions(id)
  return NextResponse.json({ lesson: lesson.slug, versions })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const contentPath = body.contentPath || lesson.contentPath
  const changelog = body.changelog || undefined

  const version = await createDraft(id, contentPath, changelog)

  if (body.action === "submit-for-review") {
    await submitForReview(version.id)
  }

  return NextResponse.json({ version }, { status: 201 })
}
