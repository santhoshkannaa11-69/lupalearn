"use client"

import { useCallback, useRef, useMemo } from "react"
import Editor from "@monaco-editor/react"
import { editorTheme } from "./EditorTheme"
import { useEditorStore, getFileContent } from "@/stores/editorStore"
import type { editor } from "monaco-editor"

function MonacoEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const activeFile = useEditorStore((s) => s.activeFile)
  const workspace = useEditorStore((s) => s.workspace)
  const setFileContent = useEditorStore((s) => s.setFileContent)

  const fileContent = useMemo(
    () => (activeFile ? getFileContent(workspace, activeFile) : ""),
    [workspace, activeFile]
  )

  const language = activeFile
    ? useEditorStore.getState().detectLanguage(activeFile.split("/").pop() || "")
    : "plaintext"

  const handleBeforeMount = useCallback((monaco: typeof import("monaco-editor")) => {
    monaco.editor.defineTheme("lupa-terminal", editorTheme)
  }, [])

  const handleMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed
    ed.focus()
  }, [])

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        setFileContent(activeFile, value)
      }
    },
    [activeFile, setFileContent]
  )

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-xs text-[#606060] font-mono">No file open</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        key={`${activeFile}-${fileContent.length}`}
        height="100%"
        language={language}
        value={fileContent}
        theme="lupa-terminal"
        onChange={handleChange}
        onMount={handleMount}
        beforeMount={handleBeforeMount}
        loading={
          <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
            <p className="text-xs text-[#606060] font-mono">Loading editor...</p>
          </div>
        }
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12 },
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
        }}
      />
    </div>
  )
}

export { MonacoEditor }
