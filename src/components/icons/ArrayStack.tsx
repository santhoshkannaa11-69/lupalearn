import type { SVGProps } from "react"

export function ArrayStack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16" />
      <path d="M4 9h16" />
      <path d="M4 14h16" />
      <path d="M4 19h16" />
      <path d="M4 4v15" />
      <path d="M20 4v15" />
    </svg>
  )
}
