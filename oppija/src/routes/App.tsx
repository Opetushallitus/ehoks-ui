import { Router } from "@reach/router"
import { ThemeWrapper } from "components/ThemeWrapper"
import {
  cleanLocaleParam,
  isLocaleStored,
  parseLocaleParam,
  readLocaleFromDomain,
  readLocaleFromLocalStorage
} from "localeUtils"
import { inject, observer } from "mobx-react"
import React from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { AppFooter } from "routes/App/AppFooter"
import { AppHeader } from "routes/App/AppHeader"
import AppNotifications from "routes/App/AppNotifications"
import { GlobalStyles } from "routes/App/globalStyles"
import { Etusivu } from "routes/Etusivu"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { Saavutettavuusseloste } from "routes/Saavutettavuusseloste"
import { Suunnittelu } from "routes/Suunnittelu"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"

const Container = styled("div")`
  margin: 0;
  ${props =>
    props.theme.typography
      .body} /* Needed for fixing apply-raamit.css injection */
`

const Main = styled("main")``

const ModalContainer = styled("div")``

const MainApp = (_: { path: string }) => (
  <Container>
    <AppHeader />
    <AppNotifications />
    <Main id="main" role="main">
      <Router basepath="/ehoks">
        <Etusivu path="/" />
        <Suunnittelu path="suunnittelu/*" />
        <Henkilokohtaistaminen path="henkilokohtaistaminen" />
        <Ammatillinentutkinto path="ammatillinentutkinto" />
        <Saavutettavuusseloste path="saavutettavuusseloste" />
      </Router>
    </Main>
    <AppFooter />
    <GlobalStyles />
    <ModalContainer id="modal-root" />
  </Container>
)

export interface AppProps {
  store?: IRootStore
}

@inject("store")
@observer
export class App extends React.Component<AppProps> {
  async componentDidMount() {
    const { store } = this.props
    const localeParam = parseLocaleParam(window.location.search)
    if (localeParam) {
      store!.translations.setActiveLocale(localeParam)
      cleanLocaleParam()
    } else {
      const locale = isLocaleStored()
        ? readLocaleFromLocalStorage()
        : readLocaleFromDomain()
      store!.translations.setActiveLocale(locale)
    }
    // load user session info from backend
    await store!.session.checkSession()
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
