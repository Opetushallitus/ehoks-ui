import * as React from "react"
import * as ReactDOM from "react-dom"

import { Provider } from "mobx-react"
import { addLocaleData, IntlProvider } from "react-intl"
import fi from "react-intl/locale-data/fi"
import sv from "react-intl/locale-data/sv"
import { App } from "./components/App"
import { RootStore } from "./models/RootStore"
import * as translations from "./translations"
import { mockFetch } from "./utils"

// load finnish & sweidsh locale data (currency units, separators etc.)
addLocaleData([...fi, ...sv])

// active locale is hardcoded to finnish for now
const activeLocale = "fi"

// pass fetch to root store using DI, so we can easily mock it in tests
const store = RootStore.create({}, { fetch: mockFetch })

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={activeLocale} messages={translations[activeLocale]}>
      <App />
    </IntlProvider>
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
