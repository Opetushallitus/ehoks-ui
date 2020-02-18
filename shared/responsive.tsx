import React from "react"
import { useMediaQuery } from "react-responsive"
import { withTheme } from "styled"
import { TypeOfTheme, breakpoints } from "theme"

type Breakpoints = keyof typeof breakpoints

interface MediaQueryProps {
  theme: TypeOfTheme
  maxWidth?: Breakpoints
  minWidth?: Breakpoints
  breakpoint?: Breakpoints
  breakpointType?: "max" | "min"
  notMatch?: boolean
}

const MediaQuery: React.SFC<MediaQueryProps> = props => {
  const {
    theme,
    maxWidth,
    minWidth,
    breakpoint,
    breakpointType,
    children,
    notMatch
  } = props
  // breakpointType
  const breakpointMax = breakpointType === "max"
  const breakpointMin = breakpointType === "min"
  // breakpoint values
  const breakpointMaxWidth =
    !!breakpoint && breakpointMax && theme.breakpoints[breakpoint]
  const breakpointMinWidth =
    !!breakpoint && breakpointMin && theme.breakpoints[breakpoint]
  // maxWidth, minWidth or breakpoint
  const useMaxwitdh = !!maxWidth
    ? theme.breakpoints[maxWidth]
    : breakpointMaxWidth
  const useMinwitdh = !!minWidth
    ? theme.breakpoints[minWidth]
    : breakpointMinWidth
  const query = {
    ...(useMaxwitdh && { maxWidth: useMaxwitdh }),
    ...(useMinwitdh && { minWidth: useMinwitdh })
  }
  const testQuery = useMediaQuery(query)
  return (testQuery && !notMatch) || (!testQuery && !!notMatch) ? (
    <React.Fragment>{children}</React.Fragment>
  ) : null
}

const MediaQueryWithTheme = withTheme(MediaQuery)

interface HMediaQueryProps {
  children: React.ReactNode
  /** To get when query does not match */
  notMatch?: boolean
}

interface WithBreakpointProps extends HMediaQueryProps {
  breakpoint: Breakpoints
}
/**
 * Wrapper for rendering children only when screen size conditions are met
 * (Breakpoints are the highest resolution of the named device)
 * Using static methods: SmallTablet | Tablet | Desktop | Large | Max
 * <HMediaQuery.SmallTablet></HMediaQuery.SmallTablet>
 * Or: MaxWidth | MinWidth
 * <HMediaQuery.MinWidth breakpoint="SmallTablet"></HMediaQuery.MinWidth>
 * To get all else but defined conditions use: notMatch
 */
export class HMediaQuery extends React.Component<HMediaQueryProps> {
  static SmallTablet = (props: HMediaQueryProps) => (
    <MediaQueryWithTheme {...props} maxWidth="SmallTablet" />
  )
  static Tablet = (props: HMediaQueryProps) => (
    <MediaQueryWithTheme {...props} minWidth="SmallTablet" maxWidth="Tablet" />
  )
  static Desktop = (props: HMediaQueryProps) => (
    <MediaQueryWithTheme {...props} minWidth="Tablet" maxWidth="Desktop" />
  )
  static Large = (props: HMediaQueryProps) => (
    <MediaQueryWithTheme {...props} minWidth="Desktop" maxWidth="Large" />
  )
  static Max = (props: HMediaQueryProps) => (
    <MediaQueryWithTheme {...props} minWidth="Large" maxWidth="Max" />
  )
  static MaxWidth = (props: WithBreakpointProps) => (
    <MediaQueryWithTheme {...props} breakpointType="max" />
  )
  static MinWidth = (props: WithBreakpointProps) => (
    <MediaQueryWithTheme {...props} breakpointType="min" />
  )
  render() {
    return this.props.children
  }
}
