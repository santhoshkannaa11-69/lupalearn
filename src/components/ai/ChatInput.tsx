"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"

function ChatInput({ onSend, loading }: { onSend: (msg: string) => void; loading: boolean }) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [loading])

  const handleSubmit = () => {
    if (input.trim() && !loading) {
      onSend(input.trim())
      setInput("")
    }
  }

  return (
    <div className="border-t border-border bg-bg p-4">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Ask your mentor anything..."
            rows={1}
            className="w-full bg-surface border border-border text-sm text-text-primary rounded-xl px-4 py-2.5 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none placeholder:text-text-muted transition-all"
            style={{ minHeight: "44px" }}
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="h-11 w-11 flex items-center justify-center bg-accent text-text-inverse rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:pointer-events-none shrink-0"
        >
          {loading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
