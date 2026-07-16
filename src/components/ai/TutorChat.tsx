"use client"

import { useRef, useEffect } from "react"
import { useChat } from "./useChat"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Trash2 } from "lucide-react"
import { Lantern } from "@/components/icons"

function TutorChat() {
  const { messages, loading, send, clear } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/50 shrink-0">
        <div className="flex items-center gap-2">
          <Lantern width={16} height={16} className="text-accent" />
          <Badge variant="success" className="text-[10px]">Mentor</Badge>
          <span className="text-xs text-text-muted">Your learning companion</span>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Trash2 size={12} /> Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <Lantern width={48} height={48} className="text-accent/40 mb-4" />
              <h2 className="text-lg font-semibold text-text-primary mb-2">Your learning companion</h2>
              <p className="text-sm text-text-secondary max-w-md">
                Ask me anything about what you're studying. I can explain concepts, help with code, and suggest what to learn next.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={send} loading={loading} />
    </div>
  )
}

export { TutorChat }
