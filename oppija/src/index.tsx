import { APIConfigContext } from "components/APIConfigContext"
import { apiPrefix, apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { fetch } from "fetchUtils"
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
const store = RootStore.create({}, createEnvironment(fetch, apiUrl, apiPrefix))
store.environment.getEnvironment()
store.translations.fetchLocales()

const apiConfig = { apiUrl, apiPrefix }

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <APIConfigContext.Provider value={apiConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </APIConfigContext.Provider>,
  appContainer
)

// setup webpack hot module replacement support
if (module.hot) {
  module.hot.accept("./routes/App", () => {
    const NextApp = require("./routes/App").App
    ReactDOM.render(
      <APIConfigContext.Provider value={apiConfig}>
        <Provider store={store}>
          <NextApp />
        </Provider>
      </APIConfigContext.Provider>,
      appContainer
    )
  })
}
