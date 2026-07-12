import type { MDXComponents } from "mdx/types"
import { LessonTerminal } from "@/components/terminal/LessonTerminal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

function Diagram({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-4 border border-[#1e1e1e] p-4 bg-[#121212]">
      <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center text-[#606060] text-sm font-mono">
        [Diagram: {src}]
      </div>
      {caption && (
        <figcaption className="mt-2 text-[10px] text-[#606060] font-mono text-center">
          ─── {caption} ───
        </figcaption>
      )}
    </figure>
  )
}

function CodeBlock({
  children,
  language,
}: {
  children: string
  language?: string
}) {
  return (
    <div className="my-4">
      <div className="flex items-center gap-2 px-3 py-1 bg-[#121212] border border-b-0 border-[#1e1e1e]">
        <span className="text-[10px] text-[#606060] font-mono uppercase">{language || "code"}</span>
        <div className="flex-1" />
        <button className="text-[10px] text-[#00ff41] hover:underline font-mono">[Copy]</button>
        <button className="text-[10px] text-[#00f0ff] hover:underline font-mono">[Run]</button>
      </div>
      <pre className="p-4 border border-[#1e1e1e] bg-[#0a0a0a] overflow-x-auto">
        <code className="text-sm text-[#c0c0c0] font-mono leading-relaxed">{children}</code>
      </pre>
    </div>
  )
}

function Quiz({
  question,
  options,
  answer,
  explanation,
}: {
  question: string
  options: string[]
  answer: string
  explanation?: string
}) {
  return (
    <Card variant="bordered" className="my-4">
      <CardHeader>
        <Badge variant="warning">Quiz</Badge>
        <CardTitle className="mt-2 text-sm text-[#ffffff]">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-3 px-3 py-2 border border-[#1e1e1e] cursor-pointer hover:border-[#2a2a2a] transition-colors"
            >
              <input type="radio" name="quiz-option" value={i.toString()} className="accent-[#00ff41]" />
              <span className="text-xs text-[#c0c0c0] font-mono">{opt}</span>
            </label>
          ))}
        </div>
        {explanation && (
          <p className="mt-3 text-[10px] text-[#606060] font-mono italic">
            💡 {explanation}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6 my-6">{children}</div>
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#1e1e1e] pl-4 ml-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-[#00ff41] font-mono font-bold">Step {number}</span>
        <span className="text-xs text-[#ffffff] font-mono font-bold">{title}</span>
      </div>
      <div className="text-sm text-[#c0c0c0]">{children}</div>
    </div>
  )
}

function Callout({ type, children }: { type: "info" | "warning" | "tip" | "danger"; children: React.ReactNode }) {
  const colors = {
    info: { border: "#00f0ff", text: "#00f0ff", label: "INFO" },
    warning: { border: "#ffb000", text: "#ffb000", label: "WARNING" },
    tip: { border: "#00ff41", text: "#00ff41", label: "TIP" },
    danger: { border: "#ff3355", text: "#ff3355", label: "DANGER" },
  }

  const c = colors[type]

  return (
    <div
      className="my-4 px-4 py-3 border-l-2 text-sm font-mono"
      style={{ borderColor: c.border, color: c.text, backgroundColor: "#121212" }}
    >
      <span className="font-bold text-[10px] uppercase tracking-wider">[{c.label}]</span> {children}
    </div>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Terminal: LessonTerminal,
    Diagram,
    CodeBlock,
    Quiz,
    Steps,
    Step,
    Callout,
  }
}
