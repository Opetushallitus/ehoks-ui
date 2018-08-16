import * as React from "react"
import * as ReactDOM from "react-dom"

import { Provider } from "mobx-react"
import { App } from "./components/App"
import { RootStore } from "./models/RootStore"

// fetch that returns the JSON directly
const fetch = (url: string) =>
  window.fetch(url).then(response => response.json())

// pass fetch to root store using DI, so we can easily mock it in tests
const store = RootStore.create({}, { fetch })

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  appContainer
)

// setup webpack hot module replacement support
if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").App
    ReactDOM.render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      appContainer
    )
  })
}
