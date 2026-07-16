"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import ky from "ky"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) { setError("Fill in both fields"); return }
    setLoading(true)
    setError("")
    try {
      await ky.post("/api/admin/auth", { json: { username, password }, timeout: 10000 })
      window.location.href = "/admin"
    } catch {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="border border-border bg-surface p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center">
              <Lock size={20} className="text-accent" />
            </div>
          </div>

          <h1 className="text-lg font-bold text-text-primary font-mono text-center mb-1">Admin Access</h1>
          <p className="text-xs text-text-muted font-mono text-center mb-6">LupaLearn Content Management</p>

          {error && (
            <div className="mb-4 px-3 py-2 border border-danger bg-[#1a0a0a]">
              <p className="text-xs text-danger font-mono">[{error}]</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin"
                prefix="> lupa@cms:~$"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  prefix="> lupa@cms:~$"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] text-text-muted font-mono text-center">
              Default: admin / lupalearn2024
            </p>
            <p className="text-[10px] text-warning font-mono text-center mt-1">
              ⚠ Change ADMIN_USERNAME & ADMIN_PASSWORD in .env.local before production
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


