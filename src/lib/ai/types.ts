export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  response?: TutorResponse
  createdAt: number
}

export type TutorMode = "tutor" | "hint" | "review" | "quiz" | "explain"

export type LearningContext = {
  learner: {
    level: "beginner" | "intermediate" | "advanced"
    confidence: Record<string, number>
    weakConcepts: string[]
    strongConcepts: string[]
    completedLessons: string[]
  }
  current: {
    lessonSlug?: string
    lessonTitle?: string
    conceptSlug?: string
    conceptName?: string
    roadmapSlug?: string
    roadmapTitle?: string
  }
  goals: {
    primary?: string
    secondary: string[]
  }
  history: {
    recentLessons: string[]
    recentQueries: string[]
  }
}

export type TutorDecision = {
  mode: TutorMode
  concepts: string[]
  tools: string[]
  responseStyle: "teach" | "guide" | "challenge" | "summarize"
  needsHint: boolean
  needsQuiz: boolean
  needsReview: boolean
}

export type TutorResponse = {
  markdown: string
  citations?: Array<{
    lessonSlug: string
    lessonTitle: string
    conceptSlug: string
    conceptName: string
    relevance: number
  }>
  recommendations?: Array<{
    type: "lesson" | "project" | "challenge" | "review"
    title: string
    href: string
    reason: string
  }>
  followUps?: string[]
  actions?: Array<{
    type: "generate-quiz" | "show-hint" | "review-code" | "explain-concept"
    label: string
    data?: Record<string, unknown>
  }>
  confidenceUsed?: Array<{
    conceptSlug: string
    conceptName: string
    confidence: number
  }>
  mode: TutorMode
  metadata?: {
    sessionId: string
    responseTimeMs: number
    provider: string
    cached: boolean
    decision: TutorDecision
  }
}

export type ToolDefinition = {
  id: string
  name: string
  description: string
  execute: (args: Record<string, unknown>, ctx: LearningContext) => Promise<Record<string, unknown>>
}

export type TutorSession = {
  id: string
  userId: string
  mode: TutorMode
  history: Message[]
  context: LearningContext
  currentLesson?: string
  currentConcept?: string
  roadmapId?: string
  createdAt: number
  updatedAt: number
}

export type AIProviderConfig = {
  apiKey?: string
  model?: string
  baseUrl?: string
  temperature?: number
  maxTokens?: number
}

export type StreamChunk = {
  type: "token" | "citation" | "recommendation" | "action" | "done" | "error"
  data: unknown
}
