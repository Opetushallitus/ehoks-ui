import ThemeWrapper from "components/ThemeWrapper"
import React from "react"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import defaultMessages from "stores/TranslationStore/defaultMessages.json"

const messages = defaultMessages.reduce<{
  [key: string]: string
}>((result, translation) => {
  result[translation.key] = translation.value
  return result
}, {})

const Providers = ({ children }: { children: React.ReactElement }) => {
  return (
    <IntlProvider defaultLocale="fi" locale="fi" messages={messages}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </IntlProvider>
  )
}

export const renderWithContext = (
  children: React.ReactElement,
  options?: any
) => {
  return render(children, { wrapper: Providers, ...options })
}
