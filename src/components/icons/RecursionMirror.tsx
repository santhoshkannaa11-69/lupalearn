import type { SVGProps } from "react"

export function RecursionMirror(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l6 6-6 6" />
      <path d="M14 4l6 6-6 6" />
      <path d="M10 10h4" />
    </svg>
  )
}
