import { NextResponse } from "next/server"
import { getNextSteps } from "@/lib/progression"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"
  const goal = searchParams.get("goal") || undefined
  const limit = parseInt(searchParams.get("limit") || "5")
  try {
    const steps = await getNextSteps(userId, goal, limit)
    return NextResponse.json({ steps, count: steps.length })
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate next steps" }, { status: 500 })
  }
}
