import type { MDXComponents } from "mdx/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

function Diagram({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-4 rounded-xl border border-border p-4 bg-surface">
      <div className="aspect-video bg-surface flex items-center justify-center text-text-muted text-sm font-mono rounded-lg">
        [Diagram: {src}]
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-text-muted text-center">
          {caption}
        </figcaption>
      )}
    </figure>
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
        <CardTitle className="mt-2 text-sm text-text-primary">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className="flex items-center gap-3 px-3 py-2 border border-border cursor-pointer hover:border-accent/30 transition-colors rounded-lg"
            >
              <input type="radio" name="quiz-option" value={i.toString()} className="accent-accent" />
              <span className="text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
        {explanation && (
          <p className="mt-3 text-xs text-text-muted italic">
            {explanation}
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
    <div className="border-l-2 border-accent/30 pl-4 ml-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-accent">Step {number}</span>
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      </div>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  )
}

function Callout({ type, children }: { type: "info" | "warning" | "tip" | "danger"; children: React.ReactNode }) {
  const colors: Record<string, { border: string; text: string; label: string }> = {
    info: { border: "#5BA0D9", text: "#5BA0D9", label: "INFO" },
    warning: { border: "#D4A534", text: "#D4A534", label: "WARNING" },
    tip: { border: "#E8B84B", text: "#E8B84B", label: "TIP" },
    danger: { border: "#D4605A", text: "#D4605A", label: "DANGER" },
  }

  const c = colors[type]

  return (
    <div
      className="my-4 px-4 py-3 border-l-2 text-sm rounded-r-xl"
      style={{ borderColor: c.border, color: c.text, backgroundColor: "var(--color-surface)" }}
    >
      <span className="font-semibold text-xs uppercase tracking-wider">[{c.label}]</span> {children}
    </div>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Diagram,
    Quiz,
    Steps,
    Step,
    Callout,
  }
}
