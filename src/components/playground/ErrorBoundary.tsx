"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/Button"

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex items-center justify-center h-full bg-[#0a0a0a] p-6">
          <div className="text-center max-w-md">
            <p className="text-sm text-[#ff3355] font-mono font-bold mb-2">[ERROR]</p>
            <p className="text-xs text-[#606060] font-mono mb-4">
              {this.state.error?.message || "Something went wrong"}
            </p>
            <Button variant="outline" size="sm" onClick={() => this.setState({ hasError: false })}>
              Try Again
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export { ErrorBoundary }
