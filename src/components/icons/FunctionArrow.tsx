import type { SVGProps } from "react"

export function FunctionArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5" cy="12" r="2" />
      <path d="M7 12h10" />
      <path d="M13 8l4 4-4 4" />
      <circle cx="21" cy="12" r="2" />
    </svg>
  )
}
