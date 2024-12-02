// @ts-ignore
import React, { act } from "react"
// @ts-ignore
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { cleanup } from "@testing-library/react"
import { apiUrl } from "../../config"
import { createEnvironment } from "../../../../shared/createEnvironment"
import { mockFetch } from "../../../../shared/fetchUtils"
import { Provider } from "mobx-react"
import { RootStore } from "../../stores/RootStore"
import { App } from "../App"

const callerId = (headers?: Headers) => (headers ? headers : new Headers())

afterEach(cleanup)

it("App renders correctly", async () => {
  const container = document.createElement("div")
  container.id = "app"
  document.body.appendChild(container)
  // pass fetch utils to root store using store's environment context
  const store = RootStore.create(
    {},
    createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
  )
  // fetch default translations
  await store.translations.fetchLocales()

  await act(() =>
    ReactDOM.createRoot(container!).render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    )
  )

  expect(container).toMatchSnapshot()
})
