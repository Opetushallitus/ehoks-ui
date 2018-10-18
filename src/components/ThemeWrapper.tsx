import { ThemeProvider } from "emotion-theming"
import React from "react"
import { theme } from "theme"

export class ThemeWrapper extends React.Component {
  render() {
    return <ThemeProvider theme={theme}>{this.props.children}</ThemeProvider>
  }
}

export default ThemeWrapper
