import { Provider } from "mobx-react"
import React from "react"
import ReactDOM from "react-dom"
import { addLocaleData } from "react-intl"
import fi from "react-intl/locale-data/fi"
import sv from "react-intl/locale-data/sv"
import { App } from "./routes/App"

// polyfill Promise for IE 11
import "promise-polyfill/src/polyfill"

// load finnish & swedish locale data (currency units, separators etc.)
addLocaleData([...fi, ...sv])

// initial render to app container
const appContainer = document.getElementById("app")
ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  appContainer
)

// setup webpack hot module replacement support
if (module.hot) {
  module.hot.accept("./routes/App", () => {
    const NextApp = require("./routes/App").App
    ReactDOM.render(
      <Provider>
        <NextApp />
      </Provider>,
      appContainer
    )
  })
}
