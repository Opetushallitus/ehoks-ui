import { Router } from "@reach/router"
import { ThemeWrapper } from "components/ThemeWrapper"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { AppErrors } from "routes/App/AppErrors"
import { AppFooter } from "routes/App/AppFooter"
import { AppHeader } from "routes/App/AppHeader"
import { GlobalStyles } from "routes/App/globalStyles"
import { Etusivu } from "routes/Etusivu"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { Suunnittelu } from "routes/Suunnittelu"
import { TyopaikanToimija } from "routes/TyopaikanToimija"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"

const Container = styled("div")`
  margin: 0;
`

const Main = styled("main")``

const MainApp = (_: { path: string }) => {
  return (
    <Container>
      <AppHeader />
      <AppErrors />
      <Main id="main" role="main">
        <Router basepath="/ehoks">
          <Etusivu path="/" />
          <Suunnittelu path="suunnittelu/*" />
          <TyopaikanToimija path="tyopaikantoimija" />
          <Henkilokohtaistaminen path="henkilokohtaistaminen" />
          <Ammatillinentutkinto path="ammatillinentutkinto" />
        </Router>
      </Main>
      <AppFooter />
      <GlobalStyles />
    </Container>
  )
}

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
    const activeLocale = store!.translations.activeLocale
    const translations = store!.translations.messages[activeLocale]
    const messages =
      activeLocale === Locale.FI
        ? translations
        : // use finnish translations as fallback, merge provided translations
          { ...store!.translations.messages.fi, ...translations }
    return (
      <ThemeWrapper>
        <IntlProvider
          defaultLocale={Locale.FI}
          locale={activeLocale}
          messages={messages}
          textComponent={React.Fragment}
        >
          <Router basepath="/ehoks">
            <MainApp path="*" />
          </Router>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}
