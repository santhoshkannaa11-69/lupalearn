import type { TutorSession, Message, LearningContext, TutorMode } from "./types"

const sessions = new Map<string, TutorSession>()

export function createSession(userId: string, mode: TutorMode = "tutor"): TutorSession {
  const session: TutorSession = {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    mode,
    history: [],
    context: {
      learner: { level: "beginner", confidence: {}, weakConcepts: [], strongConcepts: [], completedLessons: [] },
      current: {},
      goals: { secondary: [] },
      history: { recentLessons: [], recentQueries: [] },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  sessions.set(session.id, session)
  return session
}

export function getSession(id: string): TutorSession | undefined {
  return sessions.get(id)
}

export function appendMessage(sessionId: string, message: Message): TutorSession | undefined {
  const session = sessions.get(sessionId)
  if (!session) return undefined
  session.history.push(message)
  session.updatedAt = Date.now()
  return session
}

export function updateContext(sessionId: string, context: Partial<LearningContext>): TutorSession | undefined {
  const session = sessions.get(sessionId)
  if (!session) return undefined
  session.context = { ...session.context, ...context }
  session.updatedAt = Date.now()
  return session
}

export function deleteSession(id: string): void {
  sessions.delete(id)
}

export function getUserSessions(userId: string): TutorSession[] {
  return Array.from(sessions.values())
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}
