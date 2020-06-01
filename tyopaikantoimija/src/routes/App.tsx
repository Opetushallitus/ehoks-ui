import { Router, RouteComponentProps } from "@reach/router"
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
import { AppFooter } from "routes/App/AppFooter"
import { AppHeader } from "routes/App/AppHeader"
import { GlobalStyles } from "routes/App/globalStyles"
import { Etusivu } from "routes/Etusivu"
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

const MainApp = (_: RouteComponentProps) => (
  <Container>
    <AppHeader />
    <Main id="main" role="main">
      <Router basepath="/ehoks-tyopaikantoimija-ui">
        <Etusivu path="/" />
      </Router>
    </Main>
    <AppFooter />
    <GlobalStyles />
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
          <Router basepath="/ehoks-tyopaikantoimija-ui">
            <MainApp path="*" />
          </Router>
        </IntlProvider>
      </ThemeWrapper>
    )
  }
}
