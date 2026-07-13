type Handler<T = unknown> = (event: T) => void | Promise<void>

const handlers = new Map<string, Set<Handler>>()
const history: DomainEvent[] = []

export type DomainEvent = {
  type: string
  data: Record<string, unknown>
  timestamp: number
  id: string
}

export function emit(type: string, data: Record<string, unknown> = {}) {
  const event: DomainEvent = {
    type,
    data,
    timestamp: Date.now(),
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }
  history.push(event)
  const hs = handlers.get(type)
  if (hs) {
    for (const h of hs) {
      try {
        const result = h(event)
        if (result instanceof Promise) result.catch((e) => console.error(`Event handler error for ${type}:`, e))
      } catch (e) {
        console.error(`Event handler error for ${type}:`, e)
      }
    }
  }
}

export function on(type: string, handler: Handler) {
  if (!handlers.has(type)) handlers.set(type, new Set())
  handlers.get(type)!.add(handler)
  return () => handlers.get(type)?.delete(handler)
}

export function off(type: string, handler: Handler) {
  handlers.get(type)?.delete(handler)
}

export function getHistory(types?: string[]): DomainEvent[] {
  if (!types) return [...history]
  return history.filter((e) => types.includes(e.type))
}

// ─── Domain Event Types ───

export const DomainEvents = {
  LESSON_CREATED: "lesson.created",
  LESSON_UPDATED: "lesson.updated",
  LESSON_PUBLISHED: "lesson.published",
  LESSON_ARCHIVED: "lesson.archived",
  LESSON_ROLLED_BACK: "lesson.rolled-back",
  NODE_CREATED: "node.created",
  NODE_UPDATED: "node.updated",
  NODE_DELETED: "node.deleted",
  EDGE_CREATED: "edge.created",
  EDGE_DELETED: "edge.deleted",
  QUIZ_PUBLISHED: "quiz.published",
  CHALLENGE_PUBLISHED: "challenge.published",
  ROADMAP_GENERATED: "roadmap.generated",
  GRAPH_REVISION: "graph.revision",
} as const
