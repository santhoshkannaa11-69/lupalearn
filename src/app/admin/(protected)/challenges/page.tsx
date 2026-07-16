"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { showToast } from "@/components/ui/Toast"
import { Swords, Plus, Trash2 } from "lucide-react"

type TestCase = { input: string; expected: string }

export default function ChallengesPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [starterCode, setStarterCode] = useState("")
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: "", expected: "" }])
  const [concepts, setConcepts] = useState("")
  const [xpReward, setXpReward] = useState(50)

  const addTestCase = () => setTestCases((prev) => [...prev, { input: "", expected: "" }])
  const removeTestCase = (i: number) => { if (testCases.length > 1) setTestCases((prev) => prev.filter((_, idx) => idx !== i)) }
  const updateTestCase = (i: number, field: keyof TestCase, value: string) => {
    setTestCases((prev) => prev.map((tc, idx) => (idx === i ? { ...tc, [field]: value } : tc)))
  }

  const handleSave = () => {
    showToast(`Challenge "${title || "Untitled"}" saved with ${testCases.length} test cases`, "success")
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="warning" className="mb-2">Content / Challenges</Badge>
            <h1 className="text-xl font-bold text-text-primary font-mono">Challenge Builder</h1>
          </div>
          <Button variant="primary" size="sm" onClick={handleSave}><Swords size={14} /> Save Challenge</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="w-full h-9 bg-surface border border-border text-sm text-text-secondary font-mono px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">
              Concepts <span className="text-text-muted">(comma-separated)</span>
            </label>
            <Input value={concepts} onChange={(e) => setConcepts(e.target.value)} placeholder="arrays, loops" />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full h-20 bg-surface border border-border text-sm text-text-secondary font-mono px-3 py-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Starter Code</label>
            <textarea value={starterCode} onChange={(e) => setStarterCode(e.target.value)}
              className="w-full h-40 bg-surface border border-border text-xs text-text-secondary font-mono p-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none font-mono"
              placeholder="function solution(input) {&#10;  // Your code here&#10;}" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">XP Reward</label>
            <input type="number" value={xpReward} onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
              className="w-full h-9 bg-surface border border-border text-sm text-text-secondary font-mono px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
        </div>

        <Card variant="bordered">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs text-text-primary font-mono">Test Cases ({testCases.length})</CardTitle>
              <Button variant="ghost" size="sm" onClick={addTestCase}><Plus size={12} /> Add</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testCases.map((tc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted font-mono w-6 shrink-0">#{i + 1}</span>
                  <input value={tc.input} onChange={(e) => updateTestCase(i, "input", e.target.value)}
                    className="flex-1 h-7 bg-surface border border-border px-2 text-xs text-text-secondary font-mono outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Input" />
                  <span className="text-text-muted text-xs">→</span>
                  <input value={tc.expected} onChange={(e) => updateTestCase(i, "expected", e.target.value)}
                    className="flex-1 h-7 bg-surface border border-border px-2 text-xs text-text-secondary font-mono outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Expected output" />
                  <button onClick={() => removeTestCase(i)} className="text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


