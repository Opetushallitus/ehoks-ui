import { Provider } from "mobx-react"
import React from "react"
import { RootStore } from "stores/RootStore"
import { createComponentWithIntl } from "testUtils"
import { mockFetch } from "../../utils"
import { App } from "../App"

it("App renders correctly", () => {
  // pass fetch to root store using DI, so we can easily mock it in tests
  const store = RootStore.create({}, { fetch: mockFetch() })
  const tree = createComponentWithIntl(
    <Provider store={store}>
      <App />
    </Provider>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
