import { prisma } from "./db"

type ConfidenceSignals = {
  lessonCompletions: number
  lessonWeight: number
  quizAccuracy: number
  quizWeight: number
  challengesSolved: number
  challengeWeight: number
  projectsSubmitted: number
  projectWeight: number
  daysSinceLastActivity: number
  recencyDecay: number
  reviewCount: number
  reviewWeight: number
}

function calculateWeightedScore(signals: ConfidenceSignals): number {
  let score = 0
  let totalWeight = 0

  // Lesson completions (up to 20% of score)
  const lessonScore = Math.min(signals.lessonCompletions * 5, 20)
  score += lessonScore * signals.lessonWeight
  totalWeight += signals.lessonWeight

  // Quiz accuracy (up to 30%)
  const quizScore = signals.quizAccuracy * 30
  score += quizScore * signals.quizWeight
  totalWeight += signals.quizWeight

  // Challenges solved (up to 20%)
  const challengeScore = Math.min(signals.challengesSolved * 10, 20)
  score += challengeScore * signals.challengeWeight
  totalWeight += signals.challengeWeight

  // Projects submitted (up to 20%)
  const projectScore = Math.min(signals.projectsSubmitted * 15, 20)
  score += projectScore * signals.projectWeight
  totalWeight += signals.projectWeight

  // Recency decay (penalty up to -10%)
  const recencyPenalty = Math.min(signals.daysSinceLastActivity / 7, 10)
  score -= recencyPenalty * signals.recencyDecay
  totalWeight += signals.recencyDecay

  // Review sessions (boost up to 10%)
  const reviewScore = Math.min(signals.reviewCount * 5, 10)
  score += reviewScore * signals.reviewWeight
  totalWeight += signals.reviewWeight

  return totalWeight > 0 ? Math.max(0, Math.min(100, score / totalWeight)) : 0
}

export async function calculateConceptConfidence(userId: string, conceptId: string): Promise<number> {
  // Find lessons that teach this concept
  const concept = await prisma.node.findUnique({
    where: { id: conceptId },
    include: {
      incomingEdges: {
        where: { relationType: "teaches" },
        include: { source: true },
      },
    },
  })

  if (!concept) return 0

  const lessonNodeSlugs = concept.incomingEdges
    .filter((e) => e.source.type === "lesson")
    .map((e) => e.source.slug.replace("lesson-", ""))

  if (lessonNodeSlugs.length === 0) return 0

  // Count lesson completions
  const completions = await prisma.lessonCompletion.count({
    where: {
      userId,
      lesson: { slug: { in: lessonNodeSlugs } },
      completed: true,
    },
  })

  // Count quiz attempts
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      question: {
        lesson: { slug: { in: lessonNodeSlugs } },
      },
    },
  })

  const correctQuizAttempts = quizAttempts.filter((a) => a.correct).length
  const totalQuizAttempts = quizAttempts.length

  // Count challenge submissions for related challenges
  const challengeSubs = await prisma.challengeSubmission.count({
    where: { userId, passed: true },
  })

  // Count project submissions
  const projectSubs = await prisma.projectSubmission.count({
    where: { userId },
  })

  // Get last activity
  const lastCompletion = await prisma.lessonCompletion.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  const daysSinceLastActivity = lastCompletion
    ? Math.floor((Date.now() - lastCompletion.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 999

  const signals: ConfidenceSignals = {
    lessonCompletions: completions,
    lessonWeight: 25,
    quizAccuracy: totalQuizAttempts > 0 ? correctQuizAttempts / totalQuizAttempts : 0,
    quizWeight: 35,
    challengesSolved: challengeSubs,
    challengeWeight: 20,
    projectsSubmitted: projectSubs,
    projectWeight: 20,
    daysSinceLastActivity,
    recencyDecay: 10,
    reviewCount: 0,
    reviewWeight: 10,
  }

  return Math.round(calculateWeightedScore(signals))
}

export async function calculateAllConceptConfidence(userId: string) {
  const concepts = await prisma.node.findMany({
    where: { type: "concept" },
  })

  const results = []
  for (const concept of concepts) {
    const confidence = await calculateConceptConfidence(userId, concept.id)
    results.push({
      conceptId: concept.id,
      conceptSlug: concept.slug,
      conceptName: concept.name,
      confidence,
    })
  }

  return results.sort((a, b) => a.confidence - b.confidence)
}
