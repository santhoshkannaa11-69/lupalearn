"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function NewLessonPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        <Badge variant="info" className="mb-2">Content / Lessons</Badge>
        <h1 className="text-xl font-bold text-[#ffffff] font-mono mb-6">New Lesson</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-[#606060] font-mono mb-4 uppercase tracking-wider">Metadata</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Title</label>
                <Input placeholder="Lesson title" />
              </div>
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Slug</label>
                <Input placeholder="lesson-slug" prefix="> lupa@cms:~$" />
              </div>
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Description</label>
                <textarea className="w-full h-20 bg-[#121212] border border-[#1e1e1e] text-sm text-[#c0c0c0] font-mono px-3 py-2 outline-none focus:border-[#00ff41] resize-none" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#606060] font-mono mb-4 uppercase tracking-wider">Settings</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Difficulty</label>
                <select className="w-full h-9 bg-[#121212] border border-[#1e1e1e] text-sm text-[#c0c0c0] font-mono px-3 outline-none focus:border-[#00ff41]">
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Duration (min)</label>
                <Input type="number" placeholder="15" />
              </div>
              <div>
                <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">XP Reward</label>
                <Input type="number" placeholder="30" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#1e1e1e] pt-6">
          <p className="text-xs text-[#606060] font-mono mb-4 uppercase tracking-wider">Content (MDX)</p>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              className="w-full h-96 bg-[#121212] border border-[#1e1e1e] text-sm text-[#c0c0c0] font-mono p-3 outline-none focus:border-[#00ff41] resize-none"
              placeholder="Write your MDX content here..."
            />
            <div className="border border-[#1e1e1e] bg-[#121212] p-4 overflow-y-auto h-96">
              <p className="text-[10px] text-[#606060] font-mono">Preview will render here</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="primary" size="sm">Save Draft</Button>
          <Button variant="outline" size="sm">Preview</Button>
        </div>
      </div>
    </div>
  )
}
