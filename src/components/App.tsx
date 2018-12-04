import { Router } from "@reach/router"
import { GlobalStyles } from "components/App/globalStyles"
import { AppFooter } from "components/AppFooter"
import { AppHeader } from "components/AppHeader"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { TyopaikanToimija } from "routes/TyopaikanToimija"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { Etusivu } from "../routes/Etusivu"
import { AppErrors } from "./AppErrors"
import { ThemeWrapper } from "./ThemeWrapper"

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
    this.props.store!.session.checkSession()
  }

  render() {
    const { store } = this.props
    return (
      <ThemeWrapper>
        <IntlProvider
          defaultLocale="fi"
          locale={store!.translations.activeLocale}
          messages={
            store!.translations.messages[store!.translations.activeLocale]
          }
          textComponent={React.Fragment}
        >
          <Container>
            <AppHeader />
            <AppErrors />
            <Router basepath="/ehoks">
              <Etusivu path="/*" />
              <TyopaikanToimija path="tyopaikantoimija" />
              <Henkilokohtaistaminen path="henkilokohtaistaminen" />
              <Ammatillinentutkinto path="ammatillinentutkinto" />
            </Router>
            <AppFooter />
            <GlobalStyles />
          </Container>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}
