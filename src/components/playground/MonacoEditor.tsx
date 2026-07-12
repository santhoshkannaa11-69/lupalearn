"use client"

import { useCallback, useRef } from "react"
import Editor from "@monaco-editor/react"
import { editorTheme } from "./EditorTheme"
import { useEditorStore, getFileContent } from "@/stores/editorStore"
import type { editor } from "monaco-editor"

function MonacoEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const activeFile = useEditorStore((s) => s.activeFile)
  const workspace = useEditorStore((s) => s.workspace)
  const setFileContent = useEditorStore((s) => s.setFileContent)

  const fileContent = activeFile ? getFileContent(workspace, activeFile) : ""
  const language = activeFile
    ? useEditorStore.getState().detectLanguage(activeFile.split("/").pop() || "")
    : "plaintext"

  const handleMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed
    ed.focus()
    ed.getModel()?.setValue(fileContent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBeforeMount = useCallback((monaco: typeof import("monaco-editor")) => {
    monaco.editor.defineTheme("lupa-terminal", editorTheme)
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
        key={activeFile}
        height="100%"
        language={language}
        value={fileContent}
        theme="lupa-terminal"
        onChange={handleChange}
        onMount={handleMount}
        beforeMount={handleBeforeMount}
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
