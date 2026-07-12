"use client"

import { useMemo } from "react"
import { useEditorStore, getFileContent } from "@/stores/editorStore"

function LivePreview() {
  const workspace = useEditorStore((s) => s.workspace)

  const htmlContent = useMemo(() => {
    const html = getFileContent(workspace, "/index.html")
    if (html) return html

    // Auto-generate HTML from JS files
    const js = getFileContent(workspace, "/index.js") || getFileContent(workspace, "/script.js")
    const css = getFileContent(workspace, "/style.css")

    if (!js && !css && !html) return null

    return `<!DOCTYPE html>
<html>
<head>
  <style>${css || "body { background: #0a0a0a; color: #00ff41; font-family: monospace; padding: 2rem; }"}</style>
</head>
<body>
  <div id="root">
    <h1>LupaLearn Playground</h1>
    <pre id="output" style="color:#00ff41"></pre>
  </div>
  <script>
    const output = document.getElementById('output');
    const console = { log: (...args) => { output.textContent += args.join(' ') + '\\n'; } };
    try {
      ${js || "console.log('Open index.html to see your content');"}
    } catch(e) { output.textContent += 'Error: ' + e.message + '\\n'; }
  </script>
</body>
</html>`
  }, [workspace])

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0a0a]">
        <p className="text-xs text-[#606060] font-mono">Create an index.html file for live preview</p>
      </div>
    )
  }

  return (
    <div className="h-full bg-white">
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        title="Live Preview"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  )
}

export { LivePreview }
