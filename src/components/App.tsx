import { Router } from "@reach/router"
import "components/App/globalStyles"
import { AppFooter } from "components/AppFooter"
import { AppHeader } from "components/AppHeader"
import { ThemeProvider } from "emotion-theming"
import { inject, observer } from "mobx-react"
import React from "react"
import styled from "react-emotion"
import { IntlProvider } from "react-intl"
import { Ammattitutkinto } from "routes/Ammattitutkinto"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { IRootStore } from "stores/RootStore"
import { theme } from "theme"
import { Home } from "../routes/Home"

const Container = styled("div")`
  margin: 0;
`

export interface AppProps {
  store?: IRootStore
}

@inject("store")
@observer
export class App extends React.Component<AppProps> {
  componentDidMount() {
    // load user session info from backend
    this.props.store.session.checkSession()
  }

  render() {
    const { store } = this.props
    return (
      <ThemeProvider theme={theme}>
        <IntlProvider
          defaultLocale="fi"
          locale={store.translations.activeLocale}
          messages={
            store.translations.messages[store.translations.activeLocale]
          }
        >
          <Container>
            <AppHeader />
            <Router basepath="/ehoks">
              <Home path="/*" />
              <Henkilokohtaistaminen path="henkilokohtaistaminen" />
              <Ammattitutkinto path="ammattitutkinto" />
            </Router>
            <AppFooter />
          </Container>
        </IntlProvider>
      </ThemeProvider>
    )
  }
}
