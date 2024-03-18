import { BrowserRouter } from "react-router-dom"
import "@testing-library/jest-dom/extend-expect"
import { cleanup, render } from "@testing-library/react"
import { apiUrl } from "../../config"
import { createEnvironment } from "../../../../shared/createEnvironment"
import { mockFetch } from "../../../../shared/fetchUtils"
import { Provider } from "mobx-react"
import React from "react"
import { RootStore } from "../../stores/RootStore"
import { App } from "../App"

const callerId = (headers?: Headers) => (headers ? headers : new Headers())

function renderWithRouter(ui: React.ReactNode) {
  return {
    ...render(<BrowserRouter>{ui}</BrowserRouter>)
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
    </Provider>
  )
  expect(container).toMatchSnapshot()
})
