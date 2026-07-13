import type { TutorDecision, TutorResponse, TutorSession, LearningContext, TutorMode, StreamChunk } from "./types"
import { buildLearningContext } from "./context/index"
import { createSession, getSession, appendMessage } from "./session"
import { createProvider } from "./provider"
import { getCached, setCached } from "./cache"
import { buildPrompt as buildTutorPrompt } from "./prompts/tutor-v1"
import { executeTool } from "./tools/registry"
import "./tools/search-lesson"
import "./tools/generate-quiz"
import "./tools/review-code"
import "./tools/find-concepts"
import "./tools/show-progress"

function makeDecision(context: LearningContext, message: string): TutorDecision {
  const lower = message.toLowerCase()
  const needsHint = lower.includes("hint") || lower.includes("help") || lower.includes("stuck")
  const needsQuiz = lower.includes("quiz") || lower.includes("test") || lower.includes("practice")
  const needsReview = lower.includes("review") || lower.includes("check my") || lower.includes("feedback")

  let mode: TutorMode = "tutor"
  if (needsHint) mode = "hint"
  if (needsReview) mode = "review"
  if (needsQuiz) mode = "quiz"

  return {
    mode,
    concepts: context.current.conceptSlug ? [context.current.conceptSlug] : context.learner.weakConcepts.slice(0, 3),
    tools: ["search-lesson", "find-concepts"],
    responseStyle: context.learner.level === "beginner" ? "teach" : "guide",
    needsHint,
    needsQuiz,
    needsReview,
  }
}

export async function handleChatMessage(
  userId: string,
  message: string,
  sessionId?: string,
  opts?: { lessonSlug?: string; conceptSlug?: string; goal?: string; mode?: TutorMode }
): Promise<{
  session: TutorSession
  response: AsyncGenerator<StreamChunk>
  fullResponse: Promise<TutorResponse>
}> {
  // 1. Get or create session
  let session = sessionId ? getSession(sessionId) : null
  if (!session) {
    session = createSession(userId, opts?.mode || "tutor")
  }

  // 2. Build learning context
  const context = await buildLearningContext({
    userId,
    lessonSlug: opts?.lessonSlug || session.currentLesson,
    conceptSlug: opts?.conceptSlug || session.currentConcept,
    goal: opts?.goal,
  })
  session.context = context

  // 3. Append user message to history
  appendMessage(session.id, {
    id: `msg-${Date.now()}`,
    role: "user",
    content: message,
    createdAt: Date.now(),
  })

  // 4. Make decision
  const decision = makeDecision(context, message)

  // 5. Build prompt
  const promptMessages = buildTutorPrompt({
    level: context.learner.level,
    question: message,
    weakConcepts: context.learner.weakConcepts,
    strongConcepts: context.learner.strongConcepts,
    currentConcept: context.current.conceptSlug,
    goal: context.goals.primary,
  })

  // 6. Check cache
  const cached = getCached(promptMessages)
  if (cached) {
    const response: TutorResponse = {
      markdown: cached,
      mode: decision.mode,
      metadata: { sessionId: session.id, responseTimeMs: 0, provider: "cache", cached: true, decision },
    }
    appendMessage(session.id, {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: cached,
      response,
      createdAt: Date.now(),
    })
    const gen = (async function* () {
      yield { type: "token", data: cached } as StreamChunk
      yield { type: "done", data: cached } as StreamChunk
    })()
    return { session, response: gen, fullResponse: Promise.resolve(response) }
  }

  // 7. Call provider
  const startTime = Date.now()
  const provider = createProvider()
  const { stream, text } = provider.complete(promptMessages)

  // 8. Execute any tools
  const toolResults: Record<string, unknown> = {}
  for (const toolId of decision.tools) {
    try {
      toolResults[toolId] = await executeTool(toolId, { query: message }, context)
    } catch { /* tool failure is non-fatal */ }
  }

  // 9. Build async generator that yields chunks and accumulates full response
  const fullTextPromise = text
  const gen = (async function* () {
    let fullText = ""
    for await (const chunk of stream) {
      if (chunk.type === "token") {
        fullText += chunk.data as string
      }
      yield chunk
    }

    // Build citations from tool results
    const citations = (toolResults["search-lesson"] as { results?: Array<Record<string, unknown>> })?.results?.map(
      (r: Record<string, unknown>) => ({
        lessonSlug: r.lessonSlug as string,
        lessonTitle: r.lessonTitle as string,
        conceptSlug: r.conceptSlug as string,
        conceptName: r.conceptName as string,
        relevance: r.relevance as number,
      })
    ) || []

    // Cache the response
    setCached(promptMessages, fullText)

    yield {
      type: "done",
      data: {
        markdown: fullText,
        citations,
        mode: decision.mode,
        metadata: {
          sessionId: session.id,
          responseTimeMs: Date.now() - startTime,
          provider: "simulated",
          cached: false,
          decision,
        },
      } as TutorResponse,
    } as StreamChunk
  })()

  const fullResponse = (async (): Promise<TutorResponse> => {
    const text = await fullTextPromise
    return {
      markdown: text,
      mode: decision.mode,
      metadata: { sessionId: session.id, responseTimeMs: Date.now() - startTime, provider: "simulated", cached: false, decision },
    }
  })()

  // Append assistant message placeholder
  appendMessage(session.id, {
    id: `msg-${Date.now() + 1}`,
    role: "assistant",
    content: "",
    createdAt: Date.now(),
  })

  return { session, response: gen, fullResponse }
}
