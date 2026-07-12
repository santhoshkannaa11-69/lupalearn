"use client"

import { forwardRef, useRef, useEffect, useState, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, ...props }, ref) => {
    const prefixRef = useRef<HTMLSpanElement>(null)
    const [prefixWidth, setPrefixWidth] = useState(0)

    useEffect(() => {
      if (prefixRef.current) {
        setPrefixWidth(prefixRef.current.offsetWidth)
      }
    }, [prefix])

    return (
      <div className="relative flex items-center">
        {prefix && (
          <span
            ref={prefixRef}
            className="absolute left-3 text-[#00ff41] text-sm font-mono select-none whitespace-nowrap"
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-9 bg-[#121212] border border-[#1e1e1e] text-[#c0c0c0] font-mono text-sm",
            "focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]",
            "placeholder:text-[#606060]",
            "transition-colors duration-150",
            prefix ? "pr-3" : "px-3",
            className
          )}
          style={prefix && prefixWidth > 0 ? { paddingLeft: prefixWidth + 16 } : undefined}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
