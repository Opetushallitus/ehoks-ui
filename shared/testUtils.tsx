import ThemeWrapper from "components/ThemeWrapper"
import React from "react"
import { IntlProvider } from "react-intl"
import { render } from "react-testing-library"
import defaultMessages from "stores/TranslationStore/defaultMessages.json"

const messages = defaultMessages.reduce<{
  [key: string]: string
}>((result, translation) => {
  result[translation.key] = translation.value
  return result
}, {})

export const createRenderWithIntl = (
  children: React.ReactNode,
  props = { defaultLocale: "fi", locale: "fi", messages }
) => {
  return render(<IntlProvider {...props}>{children}</IntlProvider>)
}

export const createRenderWithTheme = (children: React.ReactChild) => {
  return render(<ThemeWrapper>{children}</ThemeWrapper>)
}

export const createRenderWithContext = (children: React.ReactChild) => {
  return createRenderWithIntl(<ThemeWrapper>{children}</ThemeWrapper>)
}
