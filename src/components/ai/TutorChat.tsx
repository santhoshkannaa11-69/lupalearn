"use client"

import { useRef, useEffect } from "react"
import { useChat } from "./useChat"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Trash2, Bot } from "lucide-react"

function TutorChat() {
  const { messages, loading, send, clear } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e1e1e] bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-[#00ff41]" />
          <Badge variant="info" className="text-[10px]">LupaTutor</Badge>
          <span className="text-xs text-[#606060] font-mono">lupa@brain:~$</span>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Trash2 size={12} /> Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
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
