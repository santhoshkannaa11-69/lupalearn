"use client"

import { useState, useCallback, useRef } from "react"
import ky from "ky"
import type { TutorResponse } from "@/lib/ai/types"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  response?: TutorResponse
  streaming?: boolean
  createdAt: number
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm LupaTutor. I know what you've learned and can help you with any concept. What would you like to explore?",
      streaming: false,
      createdAt: Date.now(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const counterRef = useRef(0)

  const send = useCallback(async (content: string) => {
    if (!content.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `user-${counterRef.current++}`,
      role: "user",
      content,
      createdAt: Date.now(),
    }

    const assistantMsg: ChatMessage = {
      id: `ai-${counterRef.current++}`,
      role: "assistant",
      content: "",
      streaming: true,
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setLoading(true)

    try {
      const res = await ky
        .post("/api/ai/chat", {
          json: { message: content, userId: "anonymous" },
          timeout: 60000,
        })
        .json<TutorResponse>()

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: res.markdown, response: res, streaming: false }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Sorry, I couldn't process that. Please try again.", streaming: false }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }, [loading])

  const clear = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hi! I'm LupaTutor. What would you like to learn today?",
        streaming: false,
        createdAt: Date.now(),
      },
    ])
  }, [])

  return { messages, loading, send, clear }
}
