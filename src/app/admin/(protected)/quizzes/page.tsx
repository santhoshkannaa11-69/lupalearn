"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { showToast } from "@/components/ui/Toast"
import { Plus, Trash2, ListChecks } from "lucide-react"

type Question = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  concept: string
}

function createQuestion(): Question {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    concept: "",
  }
}

export default function QuizzesPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [concepts, setConcepts] = useState("")
  const [questions, setQuestions] = useState<Question[]>([createQuestion()])

  const addQuestion = () => setQuestions((prev) => [...prev, createQuestion()])

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, field: keyof Question, value: string | number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, options: q.options.map((o, i) => (i === optIdx ? value : o)) } : q))
    )
  }

  const handleSave = () => {
    showToast(`Quiz "${title || "Untitled"}" saved with ${questions.length} questions`, "success")
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="info" className="mb-2">Content / Quizzes</Badge>
            <h1 className="text-xl font-bold text-[#ffffff] font-mono">Quiz Builder</h1>
          </div>
          <Button variant="primary" size="sm" onClick={handleSave}><ListChecks size={14} /> Save Quiz</Button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" />
          </div>
          <div>
            <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">
              Concepts <span className="text-[#606060]">(comma-separated)</span>
            </label>
            <Input value={concepts} onChange={(e) => setConcepts(e.target.value)} placeholder="variables, functions, loops" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full h-16 bg-[#121212] border border-[#1e1e1e] text-sm text-[#c0c0c0] font-mono px-3 py-2 outline-none focus:border-[#00ff41] resize-none" />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <Card key={q.id} variant="bordered">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs text-[#ffffff] font-mono">Question {qi + 1}</CardTitle>
                  <button onClick={() => removeQuestion(q.id)} className="text-[#606060] hover:text-[#ff3355]">
                    <Trash2 size={14} />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-[#606060] font-mono block mb-1">Question</label>
                    <textarea value={q.question} onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                      className="w-full h-16 bg-[#1a1a1a] border border-[#1e1e1e] text-xs text-[#c0c0c0] font-mono px-3 py-2 outline-none focus:border-[#00ff41] resize-none"
                      placeholder="Write your question..." />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateQuestion(q.id, "correctIndex", oi)}
                          className="accent-[#00ff41]"
                        />
                        <input
                          value={opt}
                          onChange={(e) => updateOption(q.id, oi, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 h-7 bg-[#1a1a1a] border border-[#1e1e1e] px-2 text-xs text-[#c0c0c0] font-mono outline-none focus:border-[#00ff41] placeholder:text-[#606060]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-[#606060] font-mono block mb-1">Explanation</label>
                      <input value={q.explanation} onChange={(e) => updateQuestion(q.id, "explanation", e.target.value)}
                        className="w-full h-7 bg-[#1a1a1a] border border-[#1e1e1e] px-2 text-xs text-[#c0c0c0] font-mono outline-none focus:border-[#00ff41]"
                        placeholder="Why is this correct?" />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#606060] font-mono block mb-1">Concept Tag</label>
                      <input value={q.concept} onChange={(e) => updateQuestion(q.id, "concept", e.target.value)}
                        className="w-full h-7 bg-[#1a1a1a] border border-[#1e1e1e] px-2 text-xs text-[#c0c0c0] font-mono outline-none focus:border-[#00ff41]"
                        placeholder="e.g. variables" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addQuestion}><Plus size={14} /> Add Question</Button>
          <span className="text-[10px] text-[#606060] font-mono">{questions.length} questions</span>
        </div>
      </div>
    </div>
  )
}
