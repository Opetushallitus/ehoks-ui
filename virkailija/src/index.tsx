import { AppContext } from "components/AppContext"
import { apiPrefix, apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { appendCommonHeaders, fetch } from "fetchUtils"
import { Provider } from "mobx-react"
import "promise-polyfill/src/polyfill" // polyfill Promise for IE 11
import React from "react"
import ReactDOM from "react-dom"
import "@formatjs/intl-relativetimeformat/polyfill"
import "@formatjs/intl-relativetimeformat/locale-data/fi"
import "@formatjs/intl-relativetimeformat/locale-data/sv"
import { App } from "./routes/App"
import { RootStore } from "./stores/RootStore"
import "core-js"

// pass fetch utils to RootStore using MST's environment context, so we can easily mock it in tests
const store = RootStore.create(
  {},
  createEnvironment(fetch, apiUrl, apiPrefix, appendCommonHeaders)
)

store.translations.fetchLocales()
const appContext = {
  app: "virkailija",
  featureFlags: {
    shareDialog: false,
    shareNotifications: false,
    casOppija: false
  }
}

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <AppContext.Provider value={appContext}>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContext.Provider>,
  appContainer
)

// setup webpack hot module replacement support
// eslint-disable-next-line no-undef
if (module.hot) {
  // eslint-disable-next-line no-undef
  module.hot.accept("./routes/App", () => {
    // eslint-disable-next-line
    const NextApp = require("./routes/App").App
    ReactDOM.render(
      <AppContext.Provider value={appContext}>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </AppContext.Provider>,
      appContainer
    )
  })
}

// React-Axe accessibility errors in browser devtools console when not production build
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line
  const axe = require("react-axe")
  axe(React, ReactDOM, 1000)
}
