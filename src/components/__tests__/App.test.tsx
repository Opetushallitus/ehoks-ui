import { Provider } from "mobx-react"
import * as React from "react"
import * as renderer from "react-test-renderer"
import { RootStore } from "../../models/RootStore"
import { App } from "../App"

it("App renders correctly", () => {
  // pass fetch to root store using DI, so we can easily mock it in tests
  const store = RootStore.create({}, { fetch: window.fetch })
  const tree = renderer
    .create(
      <Provider store={store}>
        <App />
      </Provider>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
