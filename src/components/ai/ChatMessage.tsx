"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { ChatMessage } from "./useChat"
import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"

function ChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 px-4 py-4", isUser ? "bg-[#0a0a0a]" : "bg-[#121212]")}>
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-6 h-6 bg-[#1a1a1a] border border-[#1e1e1e] flex items-center justify-center">
            <User size={12} className="text-[#00ff41]" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-[#1a1a1a] border border-[#00ff41] flex items-center justify-center">
            <Bot size={12} className="text-[#00ff41]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {isUser ? (
          <p className="text-sm text-[#c0c0c0] font-mono whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none text-sm font-mono">
            {message.streaming && !message.content ? (
              <div className="flex items-center gap-1 text-[#00ff41]">
                <span className="animate-blink">▊</span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const codeStr = String(children).replace(/\n$/, "")
                    if (match) {
                      return (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 0, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {codeStr}
                        </SyntaxHighlighter>
                      )
                    }
                    return (
                      <code className="bg-[#1a1a1a] text-[#00ff41] px-1 text-xs" {...props}>
                        {children}
                      </code>
                    )
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} className="text-[#00f0ff] hover:underline font-mono text-xs">
                        {children}
                      </a>
                    )
                  },
                  p({ children }) {
                    return <p className="text-[#c0c0c0] leading-relaxed mb-3">{children}</p>
                  },
                  h1({ children }) {
                    return <h1 className="text-base font-bold text-[#ffffff] font-mono mt-4 mb-2">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-sm font-bold text-[#ffffff] font-mono mt-3 mb-2">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-xs font-bold text-[#00ff41] font-mono mt-2 mb-1">{children}</h3>
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside text-[#c0c0c0] space-y-1 mb-3">{children}</ul>
                  },
                  li({ children }) {
                    return <li className="text-xs">{children}</li>
                  },
                  strong({ children }) {
                    return <strong className="text-[#ffffff] font-bold">{children}</strong>
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {/* Citations */}
            {message.response?.citations && message.response.citations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1e1e1e]">
                <p className="text-[10px] text-[#606060] font-mono uppercase tracking-wider mb-1">Related Lessons</p>
                <div className="flex flex-wrap gap-1">
                  {message.response.citations.map((c, i) => (
                    <a
                      key={i}
                      href={`/learn/computer-science/programming-fundamentals/${c.lessonSlug}`}
                      className="text-[10px] text-[#00f0ff] hover:underline font-mono border border-[#1e1e1e] px-1.5 py-0.5"
                    >
                      {c.lessonTitle}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-ups */}
            {message.response?.followUps && message.response.followUps.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] text-[#606060] font-mono uppercase tracking-wider mb-1">Suggested Questions</p>
                <div className="space-y-1">
                  {message.response.followUps.map((q, i) => (
                    <p key={i} className="text-[10px] text-[#606060] font-mono italic">💡 {q}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { ChatMessage }
