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
    <div className="border-t border-[#1e1e1e] bg-[#0a0a0a] p-4">
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
            placeholder="Ask LupaTutor anything..."
            rows={1}
            className="w-full bg-[#121212] border border-[#1e1e1e] text-sm text-[#c0c0c0] font-mono px-3 py-2.5 outline-none focus:border-[#00ff41] resize-none placeholder:text-[#606060]"
            style={{ minHeight: "40px" }}
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="h-10 w-10 flex items-center justify-center bg-[#00ff41] text-[#0a0a0a] hover:bg-[#00cc33] transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {loading ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}

export { ChatInput }
