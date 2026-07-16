import type { SVGProps } from "react"

export function CodeBrackets(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 4L2 12l6 8" />
      <path d="M16 4l6 8-6 8" />
    </svg>
  )
}
