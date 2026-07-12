import { NextResponse } from "next/server"
import { generateRoadmap, saveGeneratedRoadmap, getCachedRoadmap } from "@/lib/roadmap"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.goal) return NextResponse.json({ error: "Goal is required" }, { status: 400 })
    const roadmap = await generateRoadmap(body.goal, body.constraints || {})
    await saveGeneratedRoadmap(roadmap)
    return NextResponse.json({ roadmap })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const goal = searchParams.get("goal")
  const hash = searchParams.get("hash")
  if (hash) {
    const cached = await getCachedRoadmap(hash)
    if (cached) return NextResponse.json({ roadmap: cached, cached: true })
    return NextResponse.json({ error: "Cached roadmap not found" }, { status: 404 })
  }
  if (!goal) return NextResponse.json({ error: "Goal query parameter required" }, { status: 400 })
  const timePerDay = searchParams.get("timePerDay")
  const difficulty = searchParams.get("difficulty") as "beginner" | "intermediate" | "advanced" | null
  const maxSteps = searchParams.get("maxSteps")
  const constraints = {
    ...(timePerDay ? { timePerDay: parseInt(timePerDay) } : {}),
    ...(difficulty ? { difficulty } : {}),
    ...(maxSteps ? { maxSteps: parseInt(maxSteps) } : {}),
  }
  const roadmap = await generateRoadmap(goal, constraints)
  await saveGeneratedRoadmap(roadmap)
  return NextResponse.json({ roadmap, cached: false })
}
