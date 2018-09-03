import { apiUrl } from "config"
import React from "react"
import { IntlProvider } from "react-intl"
import renderer from "react-test-renderer"
import { InjectedStores } from "stores/RootStore"
import { translations } from "./translations"

// mocked fetch using local json files
export const mockFetch = (version = 0) => (url: string) => {
  const [, path] = url.split(apiUrl(""))
  return Promise.resolve(
    require("./stores/mocks/" + path.replace(/\//g, "_") + version + ".json")
  )
}

// fetch that returns the JSON directly
export const fetch = (url: string | Request, init: RequestInit) =>
  window
    .fetch(url, { credentials: "include", ...init })
    .then(response => response.json())

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

export const injectSession = (stores: InjectedStores) => ({
  session: stores.store.session
})
