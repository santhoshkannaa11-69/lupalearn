"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { CommandContext, ResolvedCommand } from "@/lib/command-system/types"
import { useCommands } from "@/lib/command-system/hooks/useCommands"
import { registerLessonCommands } from "@/lib/command-system/commands/lesson-commands"
import { loadHistory, addToHistory, clearHistory } from "@/lib/command-system/history"

type CommandBarProps = {
  context: CommandContext
  onClose: () => void
}

export function CommandBar({ context, onClose }: CommandBarProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [suggestions, setSuggestions] = useState<ResolvedCommand[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { execute, getSuggestions, register } = useCommands(context)

  // Register commands once
  useEffect(() => { registerLessonCommands() }, [register])

  // Load command history
  useEffect(() => { setHistory(loadHistory()) }, [])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback((value: string) => {
    setInput(value)
    if (value.startsWith(":") && value.length > 1) {
      setSuggestions(getSuggestions(value) as ResolvedCommand[])
    } else {
      setSuggestions([])
    }
  }, [getSuggestions])

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return
    addToHistory(input)
    setHistory((prev) => [...prev, input])
    setHistoryIdx(-1)
    await execute(input)
    setInput("")
    setSuggestions([])
  }, [input, execute])

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        await handleSubmit()
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        if (history.length > 0) {
          const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
          setHistoryIdx(idx)
          setInput(history[idx])
        }
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIdx >= 0) {
          const idx = historyIdx + 1
          if (idx >= history.length) {
            setHistoryIdx(-1)
            setInput("")
          } else {
            setHistoryIdx(idx)
            setInput(history[idx])
          }
        }
        return
      }
    },
    [history, historyIdx, handleSubmit, onClose]
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-[#0a0a0a] border-t border-[#1e1e1e] animate-slide-up">
      {/* Suggestions */}
      {suggestions.length > 0 && input.startsWith(":") && (
        <div className="border-b border-[#1e1e1e] bg-[#121212] max-h-32 overflow-y-auto">
          {suggestions.map((s, i) => (
            <div
              key={s.command.id}
              className="flex items-center gap-3 px-4 py-1.5 text-xs font-mono hover:bg-[#1a1a1a] cursor-pointer"
              onClick={() => {
                setInput(`:${s.matchedAlias} `)
                setSuggestions([])
                inputRef.current?.focus()
              }}
            >
              <span className="text-[#00ff41] shrink-0">:{s.matchedAlias}</span>
              <span className="text-[#606060] flex-1 truncate">{s.command.description}</span>
              <span className="text-[10px] text-[#606060] uppercase">{s.command.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center px-4 py-2 gap-3">
        <span className="text-[#00ff41] text-sm font-mono shrink-0">:</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command... (Esc to close)"
          className="flex-1 bg-transparent text-sm text-[#c0c0c0] font-mono outline-none placeholder:text-[#606060]"
          spellCheck={false}
          autoComplete="off"
        />
        <span className="text-[10px] text-[#606060] font-mono">
          {suggestions.length > 0 ? `${suggestions.length} matches` : "⏎ to run"}
        </span>
      </div>
    </div>
  )
}
