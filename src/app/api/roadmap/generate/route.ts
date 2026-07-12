import { NextResponse } from "next/server"
import { generateRoadmap } from "@/lib/roadmap"

export async function POST(request: Request) {
  try {
    const { goal, userId } = await request.json()

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 })
    }

    const roadmap = await generateRoadmap(goal)

    return NextResponse.json({ roadmap })
  } catch (error) {
    console.error("Roadmap generation error:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const goal = searchParams.get("goal")

  if (!goal) {
    return NextResponse.json({ error: "Goal query parameter required" }, { status: 400 })
  }

  const roadmap = await generateRoadmap(goal)
  return NextResponse.json({ roadmap })
}
