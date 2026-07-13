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
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="border border-[#1e1e1e] bg-[#121212] p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#1a1a1a] border border-[#1e1e1e] flex items-center justify-center">
              <Lock size={20} className="text-[#00ff41]" />
            </div>
          </div>

          <h1 className="text-lg font-bold text-[#ffffff] font-mono text-center mb-1">Admin Access</h1>
          <p className="text-xs text-[#606060] font-mono text-center mb-6">LupaLearn Content Management</p>

          {error && (
            <div className="mb-4 px-3 py-2 border border-[#ff3355] bg-[#1a0a0a]">
              <p className="text-xs text-[#ff3355] font-mono">[{error}]</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin"
                prefix="> lupa@cms:~$"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#606060] font-mono uppercase tracking-wider block mb-1">Password</label>
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#c0c0c0]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e1e1e]">
            <p className="text-[10px] text-[#606060] font-mono text-center">
              Default: admin / lupalearn2024
            </p>
            <p className="text-[10px] text-[#606060] font-mono text-center mt-1">
              Set ADMIN_USERNAME & ADMIN_PASSWORD in .env.local for production
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
