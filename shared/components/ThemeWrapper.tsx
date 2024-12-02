import React from "react"
import { ThemeProvider } from "styled"
import { theme } from "theme"

interface ThemeWrapperProps {
  children?: React.ReactChild
}
export class ThemeWrapper extends React.Component<ThemeWrapperProps> {
  render = () => (
    <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
  )
}

export default ThemeWrapper
