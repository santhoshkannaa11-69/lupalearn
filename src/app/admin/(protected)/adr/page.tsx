import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import fs from "fs"
import path from "path"

type ADR = { id: string; title: string; status: string; content: string }

async function getADRs(): Promise<ADR[]> {
  const adrDir = path.join(process.cwd(), "docs", "adr")
  try {
    const files = fs.readdirSync(adrDir).filter((f) => f.endsWith(".md")).sort()
    return files.map((file) => {
      const content = fs.readFileSync(path.join(adrDir, file), "utf-8")
      const title = content.split("\n")[0]?.replace("# ", "") || file
      const status = content.includes("## Status\n\nAccepted") ? "Accepted" : content.includes("## Status\n\nProposed") ? "Proposed" : "Draft"
      return { id: file.replace(".md", ""), title, status, content }
    })
  } catch {
    return []
  }
}

export default async function ADRPage() {
  const adrs = await getADRs()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <Badge variant="info" className="mb-2">System / ADR</Badge>
      <h1 className="text-xl font-bold text-text-primary font-mono mb-6">Architecture Decision Records</h1>

      {adrs.length === 0 ? (
        <p className="text-sm text-text-muted font-mono">No ADRs found in docs/adr/</p>
      ) : (
        <div className="space-y-4">
          {adrs.map((adr) => (
            <Card key={adr.id} variant="bordered">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm text-text-primary font-mono">{adr.title}</CardTitle>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                    adr.status === "Accepted" ? "border-accent text-accent" :
                    adr.status === "Proposed" ? "border-warning text-warning" :
                    "border-[#606060] text-text-muted"
                  }`}>{adr.status}</span>
                </div>
                <p className="text-[10px] text-text-muted font-mono">{adr.id}</p>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {adr.content.slice(0, 500)}{adr.content.length > 500 ? "\n..." : ""}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


