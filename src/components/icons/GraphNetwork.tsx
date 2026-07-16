import type { SVGProps } from "react"

export function GraphNetwork(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 7l4 4" />
      <path d="M16 7l-4 4" />
      <path d="M8 17l4-4" />
      <path d="M16 17l-4-4" />
      <path d="M6 8v8" />
      <path d="M18 8v8" />
    </svg>
  )
}
