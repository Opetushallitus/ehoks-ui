import { apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { mockFetch } from "fetchUtils"
import "jest-styled-components"
import { Provider } from "mobx-react"
import React from "react"
import renderer from "react-test-renderer"
import { RootStore } from "stores/RootStore"
import { App } from "../App"

it("App renders correctly", async () => {
  // pass fetch utils to root store using store's environment context
  const store = RootStore.create({}, createEnvironment(mockFetch(apiUrl)))
  // fetch default translations
  await store.translations.haeLokalisoinnit(apiUrl)
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
