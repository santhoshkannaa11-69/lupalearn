import { prisma } from "./db"
import { emit, DomainEvents } from "./events"

// ─── XP Configuration ───

export const XP_TABLE = {
  "lesson.complete": 25,
  "quiz.pass": 15,
  "challenge.solve": 50,
  "challenge.first-blood": 100,
  "project.submit": 75,
  "project.capstone": 150,
  "streak.day-7": 50,
  "streak.day-30": 200,
  "streak.day-100": 500,
  "login.daily": 5,
  "concept.mastered": 40,
} as const

export type XPAction = keyof typeof XP_TABLE

// ─── Level Configuration ───

const LEVEL_THRESHOLDS = [
  0,        // Level 1
  200,      // Level 2
  500,      // Level 3
  1000,     // Level 4
  1800,     // Level 5
  2800,     // Level 6
  4000,     // Level 7
  5500,     // Level 8
  7500,     // Level 9
  10000,    // Level 10
  13000,    // Level 11
  17000,    // Level 12
  22000,    // Level 13
  28000,    // Level 14
  35000,    // Level 15
  43000,    // Level 16
  52000,    // Level 17
  62000,    // Level 18
  73000,    // Level 19
  85000,    // Level 20
]

export function getLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progress: number } {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) { level = i + 1; break }
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000
  const progress = nextThreshold > currentThreshold
    ? Math.min(100, Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    : 100
  return { level, currentLevelXp: xp - currentThreshold, nextLevelXp: nextThreshold - currentThreshold, progress }
}

export function getLevelTitle(level: number): string {
  if (level >= 100) return "Grandmaster"
  if (level >= 50) return "Architect"
  if (level >= 25) return "Engineer"
  if (level >= 10) return "Developer"
  if (level >= 5) return "Apprentice"
  return "Newbie"
}

// ─── Streak Management ───

export async function updateStreak(userId: string): Promise<{ streak: number; updated: boolean }> {
  const stats = await prisma.userStats.findUnique({ where: { userId } })
  if (!stats) {
    await prisma.userStats.create({ data: { userId, streak: 1, xp: 0, level: 1, lastActive: new Date() } })
    return { streak: 1, updated: true }
  }

  const now = new Date()
  const lastActive = new Date(stats.lastActive)
  const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { streak: stats.streak, updated: false } // already active today

  let newStreak = stats.streak
  if (diffDays === 1) {
    newStreak += 1 // consecutive day
  } else if (diffDays > 1) {
    newStreak = 1 // streak broken
  }

  await prisma.userStats.update({
    where: { userId },
    data: { streak: newStreak, lastActive: now },
  })

  // Award streak milestone XP
  if ([7, 30, 100].includes(newStreak)) {
    const key = `streak.day-${newStreak}` as XPAction
    await awardXp(userId, key)
  }

  return { streak: newStreak, updated: true }
}

// ─── XP Awarding ───

export async function awardXp(userId: string, action: XPAction, metadata?: Record<string, unknown>): Promise<{ xpAwarded: number; totalXp: number; level: number; leveledUp: boolean }> {
  const xpAmount = XP_TABLE[action]
  if (!xpAmount) return { xpAwarded: 0, totalXp: 0, level: 1, leveledUp: false }

  const stats = await prisma.userStats.upsert({
    where: { userId },
    update: { xp: { increment: xpAmount } },
    create: { userId, xp: xpAmount, level: 1, streak: 0, lastActive: new Date() },
    select: { xp: true, level: true },
  })

  const totalXp = stats.xp + xpAmount
  const { level } = getLevel(totalXp)
  const leveledUp = level > stats.level

  if (leveledUp) {
    await prisma.userStats.update({ where: { userId }, data: { level } })
  }

  await prisma.userStats.update({ where: { userId }, data: { xp: totalXp } })

  return { xpAwarded: xpAmount, totalXp, level, leveledUp }
}

// ─── Achievement Definitions ───

export type AchievementDefinition = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  xpReward: number
  check: (userId: string) => Promise<boolean>
}

const achievements: AchievementDefinition[] = []

export function defineAchievement(achievement: AchievementDefinition): void {
  achievements.push(achievement)
}

export function getAchievements(): AchievementDefinition[] {
  return [...achievements]
}

// ─── Seed Achievements ───

export function seedAchievements(): void {
  defineAchievement({
    id: "first-lesson",
    slug: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    xpReward: 50,
    check: async (userId) => {
      const count = await prisma.lessonCompletion.count({ where: { userId } })
      return count >= 1
    },
  })

  defineAchievement({
    id: "ten-lessons",
    slug: "ten-lessons",
    title: "Dedicated Learner",
    description: "Complete 10 lessons",
    icon: "📚",
    xpReward: 150,
    check: async (userId) => {
      const count = await prisma.lessonCompletion.count({ where: { userId } })
      return count >= 10
    },
  })

  defineAchievement({
    id: "first-quiz-pass",
    slug: "first-quiz-pass",
    title: "Quiz Master",
    description: "Pass your first quiz",
    icon: "🧠",
    xpReward: 40,
    check: async (userId) => {
      const count = await prisma.quizAttempt.count({
        where: { userId, correct: true },
      })
      return count >= 1
    },
  })

  defineAchievement({
    id: "streak-7",
    slug: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    xpReward: 100,
    check: async (userId) => {
      const stats = await prisma.userStats.findUnique({ where: { userId } })
      return (stats?.streak || 0) >= 7
    },
  })

  defineAchievement({
    id: "streak-30",
    slug: "streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day learning streak",
    icon: "💪",
    xpReward: 300,
    check: async (userId) => {
      const stats = await prisma.userStats.findUnique({ where: { userId } })
      return (stats?.streak || 0) >= 30
    },
  })

  defineAchievement({
    id: "first-challenge",
    slug: "first-challenge",
    title: "Problem Solver",
    description: "Solve your first coding challenge",
    icon: "⚡",
    xpReward: 75,
    check: async (userId) => {
      const count = await prisma.challengeSubmission.count({
        where: { userId, passed: true },
      })
      return count >= 1
    },
  })

  defineAchievement({
    id: "first-project",
    slug: "first-project",
    title: "Builder",
    description: "Submit your first project",
    icon: "🚀",
    xpReward: 100,
    check: async (userId) => {
      const count = await prisma.projectSubmission.count({ where: { userId } })
      return count >= 1
    },
  })

  defineAchievement({
    id: "level-5",
    slug: "level-5",
    title: "Apprentice",
    description: "Reach level 5",
    icon: "⭐",
    xpReward: 200,
    check: async (userId) => {
      const stats = await prisma.userStats.findUnique({ where: { userId } })
      return (stats?.level || 0) >= 5
    },
  })

  defineAchievement({
    id: "level-10",
    slug: "level-10",
    title: "Developer",
    description: "Reach level 10",
    icon: "👑",
    xpReward: 500,
    check: async (userId) => {
      const stats = await prisma.userStats.findUnique({ where: { userId } })
      return (stats?.level || 0) >= 10
    },
  })
}

// ─── Achievement Detection ───

export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  const unlocked = new Set(
    (await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievement: { select: { slug: true } } },
    })).map((a) => a.achievement.slug)
  )

  const newlyUnlocked: string[] = []
  const defs = getAchievements()
  for (const ach of defs) {
    if (unlocked.has(ach.slug)) continue
    try {
      const earned = await ach.check(userId)
      if (earned) {
        await prisma.userAchievement.create({
          data: { userId, achievementId: ach.slug },
        })
        await awardXp(userId, "concept.mastered")
        newlyUnlocked.push(ach.slug)
      }
    } catch { /* skip */ }
  }

  return newlyUnlocked
}

// ─── Get User Gamification Stats ───

export async function getUserGamificationStats(userId: string) {
  seedAchievements()

  const stats = await prisma.userStats.findUnique({ where: { userId } })
  const xp = stats?.xp || 0
  const streak = stats?.streak || 0
  const levelInfo = getLevel(xp)

  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { unlockedAt: "desc" },
  })

  const defs = getAchievements()
  const unlockedSlugs = new Set(userAchievements.map((a) => a.achievement.slug))
  const allAchievements = defs.map((a) => ({
    ...a,
    unlocked: unlockedSlugs.has(a.slug),
    unlockedAt: userAchievements.find((ua) => ua.achievement.slug === a.slug)?.unlockedAt || null,
  }))

  return {
    xp,
    ...levelInfo,
    levelTitle: getLevelTitle(levelInfo.level),
    streak,
    achievements: allAchievements,
    unlockedCount: userAchievements.length,
    totalAchievements: achievements.length,
  }
}
