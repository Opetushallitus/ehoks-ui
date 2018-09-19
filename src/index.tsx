import React from "react"
import ReactDOM from "react-dom"

import { Provider } from "mobx-react"
import { addLocaleData } from "react-intl"
import fi from "react-intl/locale-data/fi"
import sv from "react-intl/locale-data/sv"
import { App } from "./components/App"
import { RootStore } from "./stores/RootStore"
import { fetch } from "./utils"

// load finnish & swedish locale data (currency units, separators etc.)
addLocaleData([...fi, ...sv])

// pass fetch to RootStore using MST's context, so we can easily mock it in tests
const store = RootStore.create({}, { fetch })
store.translations.fetchTranslations()

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
