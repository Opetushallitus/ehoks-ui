import React from "react"
import { IntlProvider } from "react-intl"
import { ThemeWrapper } from "components/ThemeWrapper"
import { Locale } from "../stores/TranslationStore"

export default class StyleguidistWrapper extends React.Component<{
  children: React.ReactNode
}> {
  render() {
    return (
      <ThemeWrapper>
        <IntlProvider defaultLocale={Locale.FI} locale={Locale.FI}>
          {this.props.children}
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}
