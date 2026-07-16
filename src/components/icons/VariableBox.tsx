import type { SVGProps } from "react"

export function VariableBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <text x="12" y="19" textAnchor="middle" fontSize="7" stroke="none" fill="currentColor">x</text>
    </svg>
  )
}
