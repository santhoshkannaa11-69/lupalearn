import { NextResponse } from "next/server"
import { getUserGamificationStats } from "@/lib/gamification"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") || "anonymous"

  const stats = await getUserGamificationStats(userId)
  return NextResponse.json(stats)
}
