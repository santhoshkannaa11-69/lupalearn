import type { SVGProps } from "react"

export function TerminalPrompt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  )
}
