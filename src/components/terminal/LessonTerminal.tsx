"use client"

import { Terminal } from "./Terminal"

interface LessonTerminalProps {
  code?: string
  language?: string
  mode?: "output-only" | "interactive" | "challenge"
}

function LessonTerminal({ code, language = "javascript", mode = "output-only" }: LessonTerminalProps) {
  const initialContent = code
    ? `$ cat example.${language}\n${code}\n\n$ Running example...\n`
    : "Ready. Start coding below."

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-text-muted" />
          <span className="w-2 h-2 rounded-full bg-text-muted/60" />
          <span className="w-2 h-2 rounded-full bg-text-muted/30" />
          <span className="text-[10px] text-text-muted font-mono ml-2 uppercase tracking-wider">
            Terminal — {language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted font-mono">
            {mode === "output-only" ? "OUTPUT" : mode === "interactive" ? "INTERACTIVE" : "CHALLENGE"}
          </span>
        </div>
      </div>
      <Terminal
        initialContent={initialContent}
        readonly={mode === "output-only"}
        prompt={mode === "output-only" ? "" : "> user@lupa:~$"}
        height="250px"
      />
    </div>
  )
}

export { LessonTerminal }
