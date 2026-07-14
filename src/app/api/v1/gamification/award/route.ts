import { NextResponse } from "next/server"
import { awardXp, updateStreak, checkAndAwardAchievements } from "@/lib/gamification"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId = "anonymous", action, type } = body

    if (type === "streak") {
      const streak = await updateStreak(userId)
      return NextResponse.json(streak)
    }

    if (!action) {
      return NextResponse.json({ error: "Action required" }, { status: 400 })
    }

    const xpResult = await awardXp(userId, action)
    const newAchievements = await checkAndAwardAchievements(userId)

    // Also update streak on any activity
    await updateStreak(userId)

    return NextResponse.json({ ...xpResult, newAchievements })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
