import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router"
import "@testing-library/jest-dom/extend-expect"
import { cleanup, render } from "@testing-library/react"
import { apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { mockFetch } from "fetchUtils"
import { Provider } from "mobx-react"
import React from "react"
import { RootStore } from "stores/RootStore"
import { App } from "../App"

const callerId = (headers?: Headers) => (headers ? headers : new Headers())

function renderWithRouter(
  ui: any,
  { route = "/", history = createHistory(createMemorySource(route)) } = {}
) {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  }
}

afterEach(cleanup)

it("App renders correctly", async () => {
  // pass fetch utils to root store using store's environment context
  const store = RootStore.create(
    {},
    createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
  )
  // fetch default translations
  await store.translations.fetchLocales()

  const { container } = renderWithRouter(
    <Provider store={store}>
      <App />
    </Provider>,
    { route: "/ehoks" }
  )
  expect(container).toMatchSnapshot()
})
