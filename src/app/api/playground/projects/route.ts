import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  })
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const project = await prisma.project.create({
      data: {
        slug: body.slug || `project-${Date.now()}`,
        title: body.title || "Untitled Project",
        description: body.description || "",
        difficulty: body.difficulty || "beginner",
        template: body.template || null,
      },
    })
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
