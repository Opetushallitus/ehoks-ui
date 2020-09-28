import { APIConfigContext } from "components/APIConfigContext"
import { AppContext } from "components/AppContext"
import { apiPrefix, apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { appendCallerId, fetch } from "fetchUtils"
import { Provider } from "mobx-react"
import "promise-polyfill/src/polyfill" // polyfill Promise for IE 11
import React from "react"
import ReactDOM from "react-dom"
import { addLocaleData } from "react-intl"
import fi from "react-intl/locale-data/fi"
import sv from "react-intl/locale-data/sv"
import { App } from "./routes/App"
import { RootStore } from "./stores/RootStore"

// load finnish & swedish locale data (currency units, separators etc.)
addLocaleData([...fi, ...sv])

// pass fetch utils to RootStore using MST's environment context, so we can easily mock it in tests
const store = RootStore.create(
  {},
  createEnvironment(fetch, apiUrl, apiPrefix, appendCallerId)
)
store.environment.getEnvironment()
store.translations.fetchLocales()

const apiConfig = { apiUrl, apiPrefix }
const appContext = {
  app: "oppija",
  featureFlags: {
    shareDialog: false,
    shareNotifications: false,
    casOppija: false // set flag value also to oppija SessionStore.logoutOppija
  }
}

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <APIConfigContext.Provider value={apiConfig}>
    <AppContext.Provider value={appContext}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContext.Provider>
  </APIConfigContext.Provider>,
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
      <APIConfigContext.Provider value={apiConfig}>
        <AppContext.Provider value={appContext}>
          <Provider store={store}>
            <NextApp />
          </Provider>
        </AppContext.Provider>
      </APIConfigContext.Provider>,
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
