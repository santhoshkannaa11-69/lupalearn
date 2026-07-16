import type { SVGProps } from "react"

export function Sigma(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16l-6 8 6 8H4" />
    </svg>
  )
}
