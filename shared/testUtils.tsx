import ThemeWrapper from "components/ThemeWrapper"
import React from "react"
import { IntlProvider } from "react-intl"
import { render } from "@testing-library/react"
import defaultMessages from "stores/TranslationStore/defaultMessages.json"
import { ThemeProvider } from "styled"
import { theme } from "theme"

const messages = defaultMessages.reduce<{
  [key: string]: string
}>((result, translation) => {
  result[translation.key] = translation.value
  return result
}, {})

const Providers = ({ children }: { children: React.ReactElement }) => (
  <IntlProvider defaultLocale="fi" locale="fi" messages={messages}>
    <ThemeWrapper>{children}</ThemeWrapper>
  </IntlProvider>
)

export const renderWithContext = (
  children: React.ReactElement,
  options?: any
) => render(children, { wrapper: Providers, ...options })

export const ThemeProviderWrapper = ({
  children
}: {
  children: React.ReactNode
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>

export const withTheme = <T extends {}>(Component: React.ComponentType<T>) => (
  props: T
) => (
  <ThemeProvider theme={theme}>
    <Component {...props} />
  </ThemeProvider>
)
