import { Routes, Route } from "react-router"
import { ThemeWrapper } from "components/ThemeWrapper"
import {
  cleanLocaleParam,
  isLocaleStored,
  parseLocaleParam,
  readLocaleFromDomain,
  readLocaleFromSessionStorage,
  setDocumentLocale
} from "localeUtils"
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { IntlProvider } from "react-intl"
import { Ammatillinentutkinto } from "routes/Ammatillinentutkinto"
import { AppFooter } from "routes/App/AppFooter"
import { AppHeader } from "routes/App/AppHeader"
import AppNotifications from "routes/App/AppNotifications"
import { GlobalStyles } from "routes/App/globalStyles"
import { Etusivu } from "routes/Etusivu"
import { Henkilokohtaistaminen } from "routes/Henkilokohtaistaminen"
import { Suunnittelu } from "routes/Suunnittelu"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"
import { Redirect } from "components/Redirect"

const Container = styled("div")`
  margin: 0;
  ${props =>
    props.theme.typography
      .body} /* Needed for fixing apply-raamit.css injection */
`

const Main = styled("main")``

const ModalContainer = styled("div")``

const MainApp = () => (
  <Container>
    <AppHeader />
    <AppNotifications />
    <Main id="main" role="main">
      <Routes>
        <Route path="/ehoks/" element={<Etusivu />} />
        <Route path="/ehoks/suunnittelu/*" element={<Suunnittelu />} />
        <Route
          path="/ehoks/henkilokohtaistaminen"
          element={<Henkilokohtaistaminen />}
        />
        <Route
          path="/ehoks/ammatillinentutkinto"
          element={<Ammatillinentutkinto />}
        />
      </Routes>
    </Main>
    <AppFooter />
    <GlobalStyles />
    <ModalContainer id="modal-root" />
  </Container>
)

export interface AppProps {
  store?: IRootStore
}

export const App = inject("store")(
  observer((props: AppProps) => {
    useEffect(() => {
      const { store } = props
      const localeParam = parseLocaleParam(window.location.search)
      if (localeParam) {
        store!.translations.setActiveLocale(localeParam)
        cleanLocaleParam()
      } else {
        const locale = isLocaleStored()
          ? readLocaleFromSessionStorage()
          : readLocaleFromDomain()
        store!.translations.setActiveLocale(locale)
      }

      // load user session info from backend
      store!.session.checkSession()
    }, [])

    const { store } = props
    const activeLocale = store!.translations.activeLocale
    setDocumentLocale(activeLocale)
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
          <Routes>
            <Route path="/ehoks/*" element={<MainApp />} />
            <Route path="/" element={<Redirect to="/ehoks/" />} />
          </Routes>
        </IntlProvider>
      </ThemeWrapper>
    )
  })
)
