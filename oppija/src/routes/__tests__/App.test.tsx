import "jest-styled-components"
import { Provider } from "mobx-react"
import React from "react"
import renderer from "react-test-renderer"
import { ErrorStore } from "stores/ErrorStore"
import { RootStore } from "stores/RootStore"
import { fetchUtils, mockFetch } from "utils"
import { App } from "../App"

it("App renders correctly", async () => {
  // pass fetch utils to root store using store's environment context
  const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
    mockFetch()
  )
  const errors = ErrorStore.create({})
  const store = RootStore.create(
    {},
    { fetchCollection, fetchSingle, deleteResource, errors }
  )
  // fetch default translations
  await store.translations.haeLokalisoinnit()
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
