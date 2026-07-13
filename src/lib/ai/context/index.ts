import type { LearningContext } from "../types"
import { buildProgressContext } from "./progress-provider"
import { buildKnowledgeContext } from "./knowledge-provider"
import { buildLessonContext } from "./lesson-provider"
import { buildRoadmapContext } from "./roadmap-provider"

export async function buildLearningContext(opts: {
  userId: string
  lessonSlug?: string
  conceptSlug?: string
  roadmapSlug?: string
  goal?: string
}): Promise<LearningContext> {
  const progress = await buildProgressContext(opts.userId)
  const knowledge = await buildKnowledgeContext(opts.conceptSlug)
  const lesson = await buildLessonContext(opts.lessonSlug)
  const roadmap = await buildRoadmapContext(opts.roadmapSlug || opts.goal)

  return {
    learner: {
      level: progress.level,
      confidence: progress.confidence,
      weakConcepts: progress.weakConcepts,
      strongConcepts: progress.strongConcepts,
      completedLessons: progress.completedLessons,
    },
    current: {
      lessonSlug: lesson.slug ?? undefined,
      lessonTitle: lesson.title ?? undefined,
      conceptSlug: knowledge.slug ?? undefined,
      conceptName: knowledge.name ?? undefined,
      roadmapSlug: roadmap.slug ?? undefined,
      roadmapTitle: roadmap.title ?? undefined,
    },
    goals: {
      primary: roadmap.goal ?? undefined,
      secondary: [],
    },
    history: {
      recentLessons: progress.completedLessons.slice(-5),
      recentQueries: [],
    },
  }
}
