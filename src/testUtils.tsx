import React from "react"
import { IntlProvider } from "react-intl"
import renderer from "react-test-renderer"
import { translations } from "./translations"

function defaultCreateNodeMock(): null {
  return null
}

export const createComponentWithIntl = (
  children: React.ReactNode,
  createNodeMock?: () => any,
  props = { locale: "fi" }
) => {
  const options = { createNodeMock: createNodeMock || defaultCreateNodeMock }
  return renderer.create(
    <IntlProvider {...props} messages={translations[props.locale]}>
      {children}
    </IntlProvider>,
    options
  )
}
