import { Provider } from "mobx-react"
import React from "react"
import renderer from "react-test-renderer"
import { RootStore } from "stores/RootStore"
import { mockFetch } from "../../utils"
import { App } from "../App"

it("App renders correctly", async () => {
  // pass fetch to root store using DI, so we can easily mock it in tests
  const store = RootStore.create({}, { fetch: mockFetch() })
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
