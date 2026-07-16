import type { SVGProps } from "react"

export function ObjectDiamond(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2l7 10-7 10-7-10z" />
      <path d="M12 6l4 6-4 6-4-6z" />
    </svg>
  )
}
