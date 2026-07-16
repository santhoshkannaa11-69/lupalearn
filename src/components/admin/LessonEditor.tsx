"use client"

import { useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { showToast } from "@/components/ui/Toast"
import { emit, DomainEvents } from "@/lib/events"
import { Sparkles, Save, Eye, Code, Search, Plus } from "lucide-react"

type LessonMeta = {
  title: string
  slug: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  xpReward: number
  tags: string[]
  concepts: string[]
}

type ConceptResult = {
  slug: string
  name: string
  type: string
}

function LessonEditor({ initialData }: { initialData?: Partial<LessonMeta> & { content?: string } }) {
  const [meta, setMeta] = useState<LessonMeta>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    difficulty: initialData?.difficulty || "beginner",
    duration: initialData?.duration || 15,
    xpReward: initialData?.xpReward || 20,
    tags: initialData?.tags || [],
    concepts: initialData?.concepts || [],
  })
  const [content, setContent] = useState(initialData?.content || "")
  const [showPreview, setShowPreview] = useState(true)
  const [tagInput, setTagInput] = useState("")
  const [conceptSearch, setConceptSearch] = useState("")
  const [conceptResults, setConceptResults] = useState<ConceptResult[]>([])
  const [searching, setSearching] = useState(false)

  const updateMeta = useCallback(<K extends keyof LessonMeta>(key: K, value: LessonMeta[K]) => {
    setMeta((prev) => ({ ...prev, [key]: value }))
    if (key === "title" && !initialData?.slug) {
      setMeta((prev) => ({ ...prev, slug: String(value).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))
    }
  }, [initialData])

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !meta.tags.includes(t)) {
      setMeta((prev) => ({ ...prev, tags: [...prev.tags, t] }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setMeta((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const searchConcepts = async (q: string) => {
    setConceptSearch(q)
    if (q.length < 2) { setConceptResults([]); return }
    setSearching(true)
    try {
      const ky = (await import("ky")).default
      const res = await ky.get(`/api/v1/search?q=${encodeURIComponent(q)}`).json<{ nodes: ConceptResult[] }>()
      setConceptResults(res.nodes?.filter((n) => !meta.concepts.includes(n.slug)) || [])
    } catch { setConceptResults([]) }
    setSearching(false)
  }

  const addConcept = (slug: string) => {
    if (!meta.concepts.includes(slug)) {
      setMeta((prev) => ({ ...prev, concepts: [...prev.concepts, slug] }))
    }
    setConceptSearch("")
    setConceptResults([])
  }

  const removeConcept = (slug: string) => {
    setMeta((prev) => ({ ...prev, concepts: prev.concepts.filter((c) => c !== slug) }))
  }

  const handleSave = () => {
    const lesson = { ...meta, content }
    localStorage.setItem(`lesson-draft-${meta.slug || "new"}`, JSON.stringify(lesson))
    emit(DomainEvents.LESSON_CREATED, { slug: meta.slug, title: meta.title })
    showToast("Draft saved locally", "success")
  }

  const handleAIAction = async (action: string) => {
    showToast(`AI: ${action} — coming soon`, "info")
  }

  const mdxPreview = `---
title: ${meta.title || "Untitled"}
slug: ${meta.slug || "untitled"}
difficulty: ${meta.difficulty}
duration: ${meta.duration}
xp: ${meta.xpReward}
tags: [${meta.tags.join(", ")}]
concepts: [${meta.concepts.join(", ")}]
---

${content || "*Start typing your lesson content...*"}`

  return (
    <div className="flex-1 overflow-y-auto bg-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="info" className="mb-2">Content / Lessons / Editor</Badge>
            <h1 className="text-xl font-bold text-text-primary font-mono">
              {meta.title || "New Lesson"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <Code size={14} /> : <Eye size={14} />}
              {showPreview ? "Editor" : "Preview"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleAIAction("improve")}>
              <Sparkles size={14} /> AI Improve
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save size={14} /> Save Draft
            </Button>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Title</label>
            <Input value={meta.title} onChange={(e) => updateMeta("title", String(e.target.value))} placeholder="Lesson title" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Slug</label>
            <Input value={meta.slug} onChange={(e) => updateMeta("slug", String(e.target.value))} prefix="> lupa@cms:~$" placeholder="lesson-slug" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Difficulty</label>
            <select value={meta.difficulty} onChange={(e) => updateMeta("difficulty", e.target.value as "beginner" | "intermediate" | "advanced")}
              className="w-full h-9 bg-surface border border-border text-sm text-text-secondary font-mono px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Duration</label>
              <Input type="number" value={meta.duration} onChange={(e) => updateMeta("duration", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">XP</label>
              <Input type="number" value={meta.xpReward} onChange={(e) => updateMeta("xpReward", parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Description</label>
          <textarea value={meta.description} onChange={(e) => updateMeta("description", e.target.value || "")}
            className="w-full h-16 bg-surface border border-border text-sm text-text-secondary font-mono px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none" />
        </div>

        {/* Tags + Concepts Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Tags</label>
            <div className="flex items-center gap-2 mb-1">
              <Input value={tagInput} onChange={(e) => setTagInput(String(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tag..." className="text-xs" />
              <button onClick={addTag} className="text-accent hover:text-accent-hover"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-1">
              {meta.tags.map((tag) => (
                <Badge key={tag} variant="info" className="cursor-pointer hover:border-danger" onClick={() => removeTag(tag)}>
                  {tag} ✕
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">
              Concepts <span className="text-text-muted">(from knowledge graph)</span>
            </label>
            <div className="relative">
              <Input value={conceptSearch} onChange={(e) => searchConcepts(String(e.target.value))}
                placeholder="Search concepts..." prefix="> lupa@cms:~$" />
              {conceptResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-surface border border-border z-10 mt-1 max-h-40 overflow-y-auto">
                  {conceptResults.map((c) => (
                    <button key={c.slug} onClick={() => addConcept(c.slug)}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-secondary font-mono hover:bg-surface flex items-center gap-2">
                      <span className="text-[10px] text-text-muted uppercase">{c.type}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {meta.concepts.map((slug) => (
                <Badge key={slug} variant="success" className="cursor-pointer hover:border-danger" onClick={() => removeConcept(slug)}>
                  {slug} ✕
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Split Editor + Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider">MDX Source</label>
              <div className="flex items-center gap-1">
                <button onClick={() => handleAIAction("example")}
                  className="text-[10px] text-info hover:underline font-mono">[Generate Example]</button>
                <button onClick={() => handleAIAction("quiz")}
                  className="text-[10px] text-warning hover:underline font-mono">[Generate Quiz]</button>
              </div>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full h-[500px] bg-surface border border-border text-sm text-text-secondary font-mono p-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
              placeholder="Write your MDX content here...
              
Supports:
## Headings
** Bold **
- Lists
1. Numbered
`code` inline
```code blocks```
[Links](/path)
              
Terminal, Diagram, Quiz, CodeBlock components render in preview."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div>
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-2">Preview</label>
              <div className="border border-border bg-surface p-4 overflow-y-auto h-[500px]">
                <div className="prose prose-invert max-w-none text-sm font-mono">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        const codeStr = String(children).replace(/\n$/, "")
                        if (match) {
                          return (
                            <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div"
                              customStyle={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: 0, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                              {codeStr}
                            </SyntaxHighlighter>
                          )
                        }
                        return <code className="bg-surface text-accent px-1 text-xs" {...props}>{children}</code>
                      },
                      h1: ({ children }) => <h1 className="text-base font-bold text-text-primary font-mono mt-4 mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold text-text-primary font-mono mt-3 mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xs font-bold text-accent font-mono mt-2 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="text-text-secondary leading-relaxed mb-3 text-xs">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside text-text-secondary space-y-1 mb-3">{children}</ul>,
                      li: ({ children }) => <li className="text-xs">{children}</li>,
                      strong: ({ children }) => <strong className="text-text-primary font-bold">{children}</strong>,
                      a: ({ href, children }) => <a href={href} className="text-info hover:underline font-mono text-xs">{children}</a>,
                    }}
                  >
                    {mdxPreview}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={14} /> Save Draft
          </Button>
          <Button variant="outline" size="sm">Submit for Review</Button>
          <div className="flex-1" />
          <span className="text-[10px] text-text-muted font-mono">
            {meta.concepts.length} concepts | {meta.tags.length} tags | {content.length} chars
          </span>
        </div>
      </div>
    </div>
  )
}

export { LessonEditor }



