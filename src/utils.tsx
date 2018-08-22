import React from "react"
import { IntlProvider } from "react-intl"
import renderer from "react-test-renderer"
import { translations } from "./translations"

// mocked fetch using local json files
export const mockFetch = (url: string) => {
  const [, path] = url.split("http://localhost:3000/")
  return Promise.resolve(
    require("./models/mocks/" + path.replace(/\//g, "_") + ".json")
  )
}

// fetch that returns the JSON directly
export const fetch = (url: string) =>
  window.fetch(url).then(response => response.json())

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
