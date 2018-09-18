import React from "react"
import ReactDOM from "react-dom"

import { Provider } from "mobx-react"
import { addLocaleData, IntlProvider } from "react-intl"
import fi from "react-intl/locale-data/fi"
import sv from "react-intl/locale-data/sv"
import { App } from "./components/App"
import { RootStore } from "./stores/RootStore"
import { translations } from "./translations"
import { fetch } from "./utils"

// load finnish & sweidsh locale data (currency units, separators etc.)
addLocaleData([...fi, ...sv])

// pass fetch to root store using DI, so we can easily mock it in tests
const store = RootStore.create({}, { fetch })

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <Provider store={store}>
    <IntlProvider
      locale={store.activeLocale}
      messages={translations[store.activeLocale]}
    >
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
        <IntlProvider
          locale={store.activeLocale}
          messages={translations[store.activeLocale]}
        >
          <NextApp />
        </IntlProvider>
      </Provider>,
      appContainer
    )
  })
}
