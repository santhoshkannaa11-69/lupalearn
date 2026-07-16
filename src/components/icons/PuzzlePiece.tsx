import type { SVGProps } from "react"

export function PuzzlePiece(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h3a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
      <path d="M4 13h3a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
      <path d="M10 4v3a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2a1 1 0 00-1 1z" />
      <path d="M10 16v3a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1z" />
      <path d="M16 7v3a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2a1 1 0 00-1 1z" />
      <path d="M16 14v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1z" />
    </svg>
  )
}
