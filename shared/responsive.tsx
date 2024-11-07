import React from "react"
import { useMediaQuery } from "react-responsive"
import { breakpoints } from "theme"

type Breakpoints = keyof typeof breakpoints

interface HMediaQueryProps {
  children: React.ReactNode
  /** To get when query does not match */
  notMatch?: boolean
  /** Media querying min-width or max-width */
  match?: "min" | "max"
  breakpoint: Breakpoints
}

export const HMediaQuery: React.FC<HMediaQueryProps> = ({
  notMatch,
  children,
  breakpoint,
  match = "max"
}) => {
  const isMatch = useMediaQuery({
    query: `(${match}-width: ${breakpoints[breakpoint]}px)`
  })
  if ((notMatch === undefined && isMatch) || (notMatch && !isMatch)) {
    return children
  }
  return null
}
