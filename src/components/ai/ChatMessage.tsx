"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { ChatMessage } from "./useChat"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import { Lantern } from "@/components/icons"

function ChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 px-6 py-5", isUser ? "bg-bg" : "bg-surface/30")}>
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-7 h-7 rounded-xl bg-surface border border-border flex items-center justify-center">
            <User size={14} className="text-text-secondary" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center">
            <Lantern width={14} height={14} className="text-accent" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {isUser ? (
          <p className="text-sm text-text-primary whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert max-w-none">
            {message.streaming && !message.content ? (
              <div className="flex items-center gap-1 text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                          customStyle={{ background: "#1C1A17", borderRadius: "12px", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", border: "1px solid #2C2924", padding: "16px", margin: "12px 0" }}
                        >
                          {codeStr}
                        </SyntaxHighlighter>
                      )
                    }
                    return (
                      <code className="bg-accent-soft text-accent px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  a({ href, children }) {
                    return <a href={href} className="text-accent hover:underline text-sm">{children}</a>
                  },
                  p({ children }) {
                    return <p className="text-sm text-text-primary leading-relaxed mb-3">{children}</p>
                  },
                  h1({ children }) {
                    return <h1 className="text-base font-bold text-text-primary mt-4 mb-2">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-sm font-semibold text-text-primary mt-3 mb-2">{children}</h2>
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside text-text-primary space-y-1 mb-3 text-sm">{children}</ul>
                  },
                  li({ children }) {
                    return <li className="text-sm">{children}</li>
                  },
                  strong({ children }) {
                    return <strong className="text-text-primary font-semibold">{children}</strong>
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {/* Citations */}
            {message.response?.citations && message.response.citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-text-muted mb-2">Related Lessons</p>
                <div className="flex flex-wrap gap-2">
                  {message.response.citations.map((c, i) => (
                    <a
                      key={i}
                      href={`/learn/computer-science/programming-fundamentals/${c.lessonSlug}`}
                      className="text-xs text-accent hover:brightness-110 transition-all border border-accent/20 bg-accent-soft/50 rounded-lg px-2 py-1"
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
                <p className="text-xs text-text-muted mb-1">Suggested Questions</p>
                <div className="space-y-1">
                  {message.response.followUps.map((q, i) => (
                    <p key={i} className="text-xs text-text-muted italic">→ {q}</p>
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
