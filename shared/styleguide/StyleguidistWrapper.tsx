import React from "react"
import { IntlProvider } from "react-intl"
import { ThemeWrapper } from "components/ThemeWrapper"

export default class StyleguidistWrapper extends React.Component {
  render() {
    return (
      <ThemeWrapper>
        <IntlProvider defaultLocale="fi">{this.props.children}</IntlProvider>
      </ThemeWrapper>
    )
  }
}
