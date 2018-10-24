import ThemeWrapper from "components/ThemeWrapper"
import React from "react"
import { IntlProvider } from "react-intl"
import renderer from "react-test-renderer"

function defaultCreateNodeMock(): null {
  return null
}

export const createComponentWithIntl = (
  children: React.ReactNode,
  createNodeMock?: () => any,
  props = { defaultLocale: "fi", locale: "fi" }
) => {
  const options = { createNodeMock: createNodeMock || defaultCreateNodeMock }
  return renderer.create(
    <IntlProvider {...props}>{children}</IntlProvider>,
    options
  )
}

export const createThemeRenderer = (children: React.ReactNode) => {
  return renderer.create(<ThemeWrapper>{children}</ThemeWrapper>)
}
